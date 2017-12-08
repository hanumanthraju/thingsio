angular.module('app.services').factory('GraphOptionService', function($localStorage, $state, $rootScope, $http, UserFactory) {

	var xy = {};

	function setXY() {
		xy = {};
		xy = {
			single: {
				x: function(d) {
					return d[0];
				},
				y: function(d) {
					return d[1];
				}
			}
		}
	}
	var y_transformation = [{
		name: "None",
		d: 1
	}, {
		name: "Divide",
		d: 1
	}, {
		name: "Multipy",
		d: 1
	}, {
		name: "Add",
		d: 0
	}, {
		name: "Subtract",
		d: 0
	}, {
		name: "Date",
		ar: ["%m/%d/%Y %H:%M", "%m-%d-%Y %H:%M"],
		d: '%m/%d/%Y %H:%M',
		type: 'ar'
	}]
	var x_transformation = y_transformation;
	var option = {};

	function returnAxisFn(tr, d) {
		if (tr.name == "Divide") return parseInt(d) / parseInt(tr.d);
		else if (tr.name == "Multipy") return parseInt(d) * parseInt(tr.d);
		else if (tr.name == "Add") return parseInt(d) + parseInt(tr.d);
		else if (tr.name == "Subtract") return parseInt(d) - parseInt(tr.d);
		else if (tr.name == "Date") return moment(d).format(td.d);
		else return parseInt(d)
	}

	function setTickFormatX(form) {
		if (form.x_transformation.name == "Date") {
			option.chart.xAxis.tickFormat = function(d) {
				return d3.time.format(form.x_transformation.d)(new Date(d))
			}
		} else {
			option.chart.xAxis.tickFormat = function(d) {
				return d3.format(',.0f')(returnAxisFn(form.x_transformation, d));
			}
		}
		if (form.graph.indexOf("Focus") !== -1) {
			option.chart.x2Axis = {};
			option.chart.x2Axis.tickFormat = option.chart.xAxis.tickFormat;
		}
	}

	function setTickFormatY(form) {
		if (form.y_transformation.name == "Date") {
			option.chart.yAxis.tickFormat = function(d) {
				return d3.time.format(form.y_transformation.d)(new Date(d))
			}

		} else {
			option.chart.yAxis.tickFormat = function(d) {
				return d3.format(',.0f')(returnAxisFn(form.y_transformation, d));
			}
		}
		if (form.graph.indexOf("Focus") !== -1) {
			option.chart.y2Axis = {};
			option.chart.y2Axis.tickFormat = option.chart.yAxis.tickFormat;
		}
	}



	function cleanOption() {
		option = {};
		option.chart = {
			type: '',
			margin: {
				top: 60,
				right: 60,
				bottom: 60,
				left: 60
			},
			height: 450,
			xAxis: {
				axisLabel: 'Time (ms)'
			},
			yAxis: {
				axisLabel: 'Time (ms)'
			}
		}
	}

	function prepareOption(op) {
		cleanOption();
		setXY();
		if (op.height) option.chart.height = parseInt(op.height);
		if (op.title) option.title = (op.title);
		if (op.subtitle) option.subtitle = (op.subtitle);
		if (op.caption) option.caption = (op.caption);
		if (op.xy) {
			option.chart.x = xy[op.xy].x;
			option.chart.y = xy[op.xy].y;
		}
		if (op.label_x) option.chart.xAxis.axisLabel = (op.label_x);
		if (op.label_y) option.chart.yAxis.axisLabel = (op.label_y);
		if (op.zoom) option.chart.zoom = {
			enabled: true,
			scaleExtent: [1, 10],
			useFixedDomain: false,
			useNiceScale: false,
			horizontalOff: false,
			verticalOff: true,
			unzoomEventType: 'dblclick.zoom'
		}
		option.chart.type = op.graph;
		setTickFormatY(op);
		setTickFormatX(op);
	}
	return {
		prepareOption: prepareOption,
		setTickFormatY: setTickFormatY,
		setTickFormatX: setTickFormatX,
		yTransformation: function() {
			return y_transformation;
		},
		xTransformation: function() {
			return x_transformation;
		},
		getOption: function() {
			return option;
		}
	}
}).factory('GraphDataService', function($localStorage, $state, $q, $rootScope, $http, UserFactory, DeviceDataFactory) {
	var query = {
		order: "DESC",
		pageno: 1,
		pagesize: 100
	}
	var query_arr = [];

	function createQuery(form) {
		query_arr = [];
		query = {
			order: "DESC",
			pageno: 1,
			pagesize: 100
		}
		var project = [];
		if (form.xy == "single") project = [form.property_y, form.property_x];
		if (form.combined && form.devices.device_id == 0) { //show all devices added up
			query.site_id = form.site.site_id;
			query.projects = project.toString();
			query_arr.push(query)
		} else if (!form.combined && form.devices.device_id == 0) {
			for (var i = 1; i < form.gDevices.length; i++) {
				query = {
					order: "DESC",
					pageno: 1,
					pagesize: form.pagesize || 100
				}
				query.projects = project.toString();
				query.device_id = form.gDevices[i].device_id;
				query.site_id = form.site.site_id;
				query_arr.push(query)
			}
		} else if (!form.combined && form.devices.device_id != 0) {
			query.site_id = form.site.site_id;
			query.device_id = form.devices.device_id;
			query.projects = project.toString();
			query_arr.push(query)
		}

	}

	function getData() {
		var promiseArray = [];
		H5_loading.show();
		var datas = [];
		return $q(function(resolve, reject) {

			for (var i = 0; i < query_arr.length; i++) promiseArray.push(DeviceDataFactory.get(query_arr[i]).$promise)
			$q.all(promiseArray).then(function(data) {
				H5_loading.hide();
				for (var i = 0; i < data.length; i++) {
					var res = data[i];
					if (!res.error) datas.push(res.data)
					else datas.push([])
				}
				resolve(datas)
			})
		})

	}


	function axisizeData(form, values) {
		var timesstamps = {};
		var valuesD = [];
		console.log(values);
		if (form.property_x == "dts" && form.property_y != "dts") {
			for (var i = 0; i < values.length; i++) {
				var data = values[i].data;
				var dts = moment(values[i].dts).format("x");
				if (timesstamps[dts]) timesstamps[dts] = timesstamps[dts] + data[form.property_y]
				else timesstamps[dts] = data[form.property_y]
			}
		} else if (form.property_x != "dts" && form.property_y == "dts") {
			for (var i = 0; i < values.length; i++) {
				var data = values[i].data;
				var dts = moment(values[i].dts).format("x");
				if (timesstamps[dts]) {
					timesstamps[dts] = timesstamps[dts] + data[form.property_x]
				} else {
					timesstamps[dts] = data[form.property_x]
				}
			}
			var t_temp = timesstamps;
			timesstamps = {};
			for (var key in t_temp) {
				if (t_temp.hasOwnProperty(key)) {
					timesstamps[t_temp[key]] = key;
				}
			}
		} else if (form.property_x != "dts" && form.property_y != "dts") {
			valuesD = [];
			for (var i = 0; i < values.length; i++) {
				var data = values[i].data;
				valuesD.push([data[form.property_x], data[form.property_y]])
			}
		}
		return ({
			timesstamps: timesstamps,
			valuesD: valuesD
		})
	}

	function parseData(form, datas) { //values is an array of datas
		var ret = [];
		for (var i = 0; i < datas.length; i++) {
			var pusher = {
				key: String(form.combined ? "Site ID - " + form.site.site_id : "Device ID " + datas[i][0].device_id),
				color: randomColor(),
			}
			//console.log(datas[i][0].device_id);
			var ax = axisizeData(form, datas[i])
			pusher.vs = ax.timesstamps;
			pusher.values = ax.valuesD;
			ret.push(pusher);
		}
		//console.log(ret);
		return ret;
	}

	function formatData(form, tses) {
		for (var i = 0; i < tses.length; i++) {
			if (!tses[i].values || tses[i].values.length == 0) {
				var ts = tses[i].vs;
				tses[i].values = [];
				for (var key in ts) {
					if (ts.hasOwnProperty(key)) tses[i].values.push([parseInt(key), parseInt(ts[key])])
				}
				delete tses[i].vs;
			}
		}
		return tses;
	}
	return {
		createQuery: createQuery,
		parseData: parseData,
		formatData: formatData,
		getData: getData
	}
})
