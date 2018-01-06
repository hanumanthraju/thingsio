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
            option.chart.tooltip.keyFormatter = function(d) {
                return d3.time.format(form.x_transformation.d)(new Date(d))
            }
            option.chart.xAxis.rotateLabels = -30;
            if (form.graph == "sparklinePlus") option.chart.xTickFormat = function(d) {
                return d3.time.format(form.x_transformation.d)(new Date(d))
            }
        } else {
            option.chart.xAxis.tickFormat = function(d) {
                return d3.format(form.xdecimal)(returnAxisFn(form.x_transformation, d));
            }
            option.chart.tooltip.keyFormatter = function(d) {
                return d3.format(form.xdecimal)(returnAxisFn(form.x_transformation, d));
            }
            if (form.graph == "sparklinePlus") option.chart.xTickFormat = function(d) {
                return d3.format(form.xdecimal)(returnAxisFn(form.x_transformation, d));
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
                return d3.format(form.ydecimal)(returnAxisFn(form.y_transformation, d));
            }
            option.chart.tooltip.valueFormatter = function(d) {
                return d3.format(form.ydecimal)(returnAxisFn(form.y_transformation, d));
            }
            if (form.graph == "sparklinePlus") option.chart.yTickFormat = function(d) {
                return d3.format(form.ydecimal)(returnAxisFn(form.y_transformation, d));
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
                bottom: 80,
                left: 80
            },
            //height: 450,
            xAxis: {
                axisLabel: 'Time (ms)'
            },
            yAxis: {
                axisLabel: 'Time (ms)'
            },
            tooltip: {}
        }
    }

    function prepareOption(op) {
        cleanOption();
        setXY();
        //if (op.height) option.chart.height = parseInt(op.height);
        //if (op.size == "small") option.chart.height = 300;
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
            scaleExtent: [1, 50],
            useFixedDomain: false,
            useNiceScale: false,
            horizontalOff: false,
            verticalOff: true,
            unzoomEventType: 'dblclick.zoom'
        }
        option.chart.type = op.graph;
        option.chart.api = {};
        setTickFormatY(op);
        setTickFormatX(op);
    }
    return {
        prepareOption: prepareOption,
        setTickFormatY: setTickFormatY,
        setTickFormatX: setTickFormatX,
        yTransformation: function() {
            return [{
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
                ar: ["%d.%m.%y \n %H:%M", "%d/%m/%y %H:%M", "%d.%m.%y %H:00", "%d-%m-%y %H:%M:%S", "%d.%m.%y", "week %W.%y", "%m.%y", "%Y"],
                d: '%d.%m.%y \n %H:%M',
                type: 'ar'
            }];
        },
        xTransformation: function() {
            return [{
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
                ar: ["%d.%m.%y \n %H:%M", "%d/%m/%y %H:%M", "%d.%m.%y %H:00", "%d-%m-%y %H:%M:%S", "%d.%m.%y", "week %W.%y", "%m.%y", "%Y"],
                d: '%d.%m.%y \n %H:%M',
                type: 'ar'
            }];
        },
        getOption: function() {
            return option;
        }
    }
}).factory('GraphDataService', function($localStorage, $state, $q, $rootScope, $http, UserFactory, DeviceDataFactory) {
    var query = {
        order: "ASC",
        pageno: 1,
        pagesize: 100
    }
    var query_arr = [];

    function getProjects(form) {
        var ret = [];
        var filedsy = form.filedsy;
        var filedsx = form.filedsx;
        for (var i = 0; i < filedsy.length; i++)
            if (ret.indexOf(filedsy[i].prop) == -1) ret.push(filedsy[i].prop);
        for (var i = 0; i < filedsx.length; i++)
            if (ret.indexOf(filedsx[i].prop) == -1) ret.push(filedsx[i].prop);
        return ret;
    }

    function initializeQuery(form) {
        query = {
            order: "ASC",
            pageno: -1,
            pagesize: -1
        }
        if (form.customTime) {
            if (form.last_record) {
                query.ets = moment(parseInt(form.ets)).startOf('day').add(1, 'days').format("X");
                query.sts = moment(parseInt(form.sts)).startOf('day').format("X");
            } else {
                query.ets = moment(parseInt(form.ets)).format("X");
                query.sts = moment(parseInt(form.sts)).format("X");
            }
            query.ets = parseInt(query.ets);
            query.sts = parseInt(query.sts);

        } else {
            //if (form.last_record) var m = moment().startOf('day').add(1, 'days');
            //else
            var m = moment();
            var ets = m.format("X");
            var sts = m.subtract(form.default_days, 'days').format("X");
            query.sts = parseInt(sts);
            query.ets = parseInt(ets);
        }

        var project = [];
        if (form.xy == "single") project = getProjects(form);
        query.projects = project.toString();


        if (form.size == "small") {
            query.pageno = 1;
            query.pagesize = 50;
            query.order = 'ASC';
            delete query.ets;
            delete query.sts;
        }
        //query.breakpoint = [];
        //for (var i = query.sts; i <= query.ets; i += 86400) query.breakpoint.push(i);
        if (form.aggregate) {
            query.aggregate = true;
            query.group_by = form.group_by;
            query.op = form.op;
        }
        return query;
    }

    function createQuery(form) {
        query_arr = [];
        if (form.combined && form.devices.device_id == 0) { //show all devices added up
            var query = initializeQuery(form);
            query.site_id = form.site.site_id;
            query_arr.push(query)
        } else if (!form.combined && form.devices.device_id == 0) { //show individual devices for a site
            for (var i = 1; i < form.gDevices.length; i++) {
                var query = initializeQuery(form);;
                query.device_id = form.gDevices[i].device_id;
                query.site_id = form.site.site_id;
                query_arr.push(query);
            }
        } else if (!form.combined && form.devices.device_id != 0) { //show one device for a site
            var query = initializeQuery(form);
            query.site_id = form.site.site_id;
            query.device_id = form.devices.device_id;
            query_arr.push(query)
        }
        console.log(query_arr);
    }

    function makeEmptyObj(form) {
        var pr2 = getProjects(form);
        var ret = {};
        for (var i = 0; i < pr2.length; i++) {
            ret[pr2[i]] = 0;
        }
        return ret;
    }

    function testSite(q) {
        q.order = "ASC";
        q.pageno = 1;
        q.pagesize = 1;

        return $q(function(resolve, reject) {
            DeviceDataFactory.get(q).$promise.then(function(data) {
                if (!data.error) resolve(data.data)
                else reject(false)
            })
        })
    }
    var getDataTime = 0;

    function rmbrkpt(q) {
        var t_q_arr = {};
        for (var key in q) {
            if (q.hasOwnProperty(key)) {
                if (key != 'breakpoint')
                    t_q_arr[key] = q[key]
            }
        }
        return t_q_arr;
    }

    function getData(form) {
        var promiseArray = [];
        //H5_loading.show();
        var datas = [];
        return $q(function(resolve, reject) {
            var t0 = performance.now();
            for (var i = 0; i < query_arr.length; i++) promiseArray.push(DeviceDataFactory.get(query_arr[i]).$promise)
            $q.all(promiseArray).then(function(data) {
                getDataTime = performance.now() - t0;
                for (var i = 0; i < data.length; i++) {
                    var res = data[i];
                    if (!res.error) datas.push(res.data)
                    else datas.push([])
                }
                resolve(datas)
            })
        })

    }


    function calculateProps(prs, data) {
        var str = "";
        if (prs.length == 1) str = data[prs[0].prop];
        else {

            for (var i = 0; i < prs.length - 1; i++) {
                str = str + data[prs[i].prop] + prs[i].op + data[prs[i + 1].prop];
            }
        }

        try {
            if (prs.length == 1) return str === undefined ? 0 : str;
            else return math.eval(str);

        } catch (err) {
            return 0
        }

    }


    var tracker_date = 0;

    function beautifyData(form, ts) {
        if (form.size == 'small') return true;
        ts = parseInt(ts);
        //console.log(ts, tracker_date, form.ldetail);
        if (Math.abs(ts - tracker_date) > parseInt(form.ldetail)) {
            tracker_date = ts;
            return true;
        } else return false
    }



    var axisizeData2Time = 0;
    var dbValueLength = 0;

    function axisizeData2(form, values) {
        var t0 = performance.now();
        var timesstamps = {};
        var valuesD = [];
        tracker_date = 0
        dbValueLength = dbValueLength + values.length;
        if (form.filedsx[0].prop == "dts" && form.filedsy[0].prop != "dts") { //x axis is time
            for (var i = 0; i < values.length && values[i].data; i++) {
                var data = values[i].data;
                var dts = moment(values[i].dts).format("x"); // - 19800000;

                //var dts = moment(values[i].dts).format("x");
                if (beautifyData(form, dts)) {
                    //if (timesstamps[dts]) timesstamps[dts] = timesstamps[dts] + calculateProps(form.filedsy, data)
                    //else timesstamps[dts] = calculateProps(form.filedsy, data)
                    valuesD.push([parseInt(dts), calculateProps(form.filedsy, data)])
                }
            }
        } else if (form.filedsx[0].prop != "dts" && form.filedsy[0].prop != "dts") {
            valuesD = [];
            for (var i = 0; i < values.length && values[i].data; i++) {
                var data = values[i].data;
                var dts = moment(values[i].dts).format("x");
                if (beautifyData(form, dts)) {
                    valuesD.push([calculateProps(form.filedsx, data), calculateProps(form.filedsy, data)])
                }
            }
        }
        axisizeData2Time = axisizeData2Time + performance.now() - t0;
        return ({
            timesstamps: timesstamps,
            valuesD: valuesD
        })

    }



    function parseData(form, datas) { //values is an array of datas
        axisizeData2Time = 0;
        dbValueLength = 0;
        var ret = [];
        for (var i = 0; i < datas.length; i++) {
            var pusher = {
                key: String(form.combined ? "Site ID - " + form.site.site_id : "Device ID " + query_arr[i].device_id),
                color: randomColor(),
                area: form.area ? true : false
            }
            //console.log(datas[i]);
            var ax = axisizeData2(form, datas[i])
            pusher.vs = ax.timesstamps;
            pusher.values = ax.valuesD;
            ret.push(pusher);
        }

        return ret;
    }



    var totalDataPoints = 0;

    function formatData(form, tses) {
        totalDataPoints = 0;
        for (var i = 0; i < tses.length; i++) {
            if (!tses[i].values || tses[i].values.length == 0) {
                var ts = tses[i].vs;
                tses[i].values = [];
                for (var key in ts) {
                    if (ts.hasOwnProperty(key)) tses[i].values.push([parseInt(key), parseInt(ts[key])])
                }
                delete tses[i].vs;
            }
            totalDataPoints = totalDataPoints + tses[i].values.length;
        }
        if (form.size != "small") {
            mixpanel.track(
                form.name, {
                    "front Time": axisizeData2Time,
                    "back Time": getDataTime,
                    "front Points": totalDataPoints,
                    "back Points": dbValueLength
                }
            );

            console.log("axisizeData2 took " + parseInt(axisizeData2Time) + " ms to plot " + totalDataPoints + " data points derived from " + dbValueLength + " values which took " + parseInt(getDataTime) + " ms.");
        }
        //console.log(tses);
        if (form.graph == "sparklinePlus") return tses[0].values
        return tses;
    }
    var gOptions = null;
    var gData = null;
    return {
        createQuery: createQuery,
        parseData: parseData,
        initializeQuery: initializeQuery,
        testSite: testSite,
        formatData: formatData,
        getData: getData,
        setGoption: function(s) {
            gOptions = s;
        },
        getGoption: function(s) {
            return gOptions;
        },
        setGdata: function(s) {
            gData = s;
        },
        getGdata: function(s) {
            return gData;
        }
    }
})