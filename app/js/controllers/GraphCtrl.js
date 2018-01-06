angular.module('app.controllers')
    .controller('GraphController', function($scope, GraphIDFactory, NgTableParams, $localStorage, GraphFactory, AlertService, $stateParams, GraphOptionService, GraphDataService, SitesFactory, SearchFactory, DeviceFactory, $state, $timeout, Colors) {
        var gid = $stateParams.id;
        $scope.graph = {};
        $scope.view = [true, false];
        $scope.changeview = function(i) {
            $scope.view = [false, false];
            $scope.view[i] = true;
        }

        function getGraphs() {
            H5_loading.show();
            GraphIDFactory.get({
                id: gid
            }).$promise.then(function(graphs) {
                H5_loading.hide();
                if (!graphs.error) {
                    $scope.graph = graphs.data;
                    createGraph();
                    initializeTime($scope.graph.conf)
                    if ($scope.graph.conf.filedsx[0].prop == "dts" && $scope.graph.conf.filedsy[0].prop != "dts") setDateString($scope.graph.conf.x_transformation.d);
                    else if ($scope.graph.conf.filedsx[0].prop != "dts" && $scope.graph.conf.filedsy[0].prop == "dts") setDateString($scope.graph.conf.y_transformation.d);

                }
                console.log(graphs);
            })
        }
        $scope.timeStamp = {
            start: null,
            end: null
        }
        $scope.deleteGraph = function() {
            AlertService.confirm("Delete Graph", "Are you sure you want to delete this graph").then(function() {
                H5_loading.show();
                GraphIDFactory.delete({
                    id: gid
                }).$promise.then(function() {
                    H5_loading.hide();
                    $state.go("app.dashboard")
                })
            })
        }

        function toIso3(s) {
            var dd = s.split(" ");
            var dar = dd[0].split("/");
            var xs = dar[1] + "/" + dar[0] + "/" + dar[2] + " " + dd[1];

            return xs;
        }

        function initializeTime(form) {
            if (form.last_record) var m = moment().startOf('day').add(1, 'days');
            else var m = moment();
            var ets = m.format("DD/MM/YYYY HH:mm");
            var sts = m.subtract(form.default_days, 'days').format("DD/MM/YYYY HH:mm");
            $scope.timeStamp.start = sts;
            $scope.timeStamp.end = ets;
        }

        function setDateString(s) {
            $scope.dateString = "";
            $scope.dateString = $scope.dateString.replace(/%y/g, "YYYY");
            $scope.dateString = $scope.dateString.replace(/%d/g, "DD");
            $scope.dateString = $scope.dateString.replace(/%m/g, "MM");
            $scope.dateString = $scope.dateString.replace(/%H/g, "HH");
            $scope.dateString = $scope.dateString.replace(/%M/g, "mm");
            $scope.dateString = $scope.dateString.replace(/%S/g, "ss");
            $scope.dateString = $scope.dateString.replace(/%W/g, "Wo");
        }
        $scope.dateString = "";


        $scope.changeDm = function() {
            console.log($scope.graph.conf.group_by);
            createGraph()
        }

        $scope.pdm = "none";
        $scope.dm = ["none", "day", "week", "month", "year"];
        $scope.setDateTime = function() {

            var ts = {};
            ts.start = toIso3($scope.timeStamp.start);
            ts.end = toIso3($scope.timeStamp.end);
            $scope.graph.conf.customTime = true;
            $scope.graph.conf.ets = (moment(ts.end).format("x"));
            $scope.graph.conf.sts = (moment(ts.start).format("x"));
            $scope.graph.conf.default_days = ((parseInt($scope.graph.conf.ets) - parseInt($scope.graph.conf.sts)) / 86400000);
            createGraph()

        }
        var options = null;
        var gdata = null;

        function createUsingFullOptions(data) {
            var initialParams = {
                count: 20,
                sorting: {
                    t: "desc"
                } // initial page size
            };
            var initialSettings = {
                // page size buttons (right set of buttons in demo)
                counts: [],
                // determines the pager buttons (left set of buttons in demo)
                paginationMaxBlocks: 13,
                paginationMinBlocks: 2,
                dataset: data
            };
            return new NgTableParams(initialParams, initialSettings);
        }

        $scope.CSVFn = function(v) {
            for (var i = 0; i < v.length; i++) {
                if ($scope.graph.conf.filedsx[0].prop == "dts" && $scope.graph.conf.filedsy[0].prop != "dts") {
                    v[i][0] = moment(v[i][0]).format($scope.dateString);
                } else if ($scope.graph.conf.filedsx[0].prop != "dts" && $scope.graph.conf.filedsy[0].prop == "dts") {
                    v[i][1] = moment(v[i][1]).format($scope.dateString);
                }
            }
            return v;
        }

        function setForTable(ds) {
            var tbl = [];
            for (var i = 0; i < ds.length; i++) {
                tbl.push({
                    t: ds[i][0],
                    d: ds[i][1]
                })
            }
            return tbl;
        }

        function setForGraph(option, data) {
            //	console.log(option.chart.xAxis.tickFormat);
            $scope.chart.graph_option = option;
            $scope.chart.graph_data = data;
            $scope.chart_api.refresh();
            if ($scope.graph.conf.graph == "sparklinePlus") createUsingFullOptions(setForTable($scope.chart.graph_data));
            else $scope.tableParams = createUsingFullOptions(setForTable($scope.chart.graph_data[0].values));
        }

        function redo(graph_data, graph_option) {
            var s = $scope.graph.conf.group_by;
            if (s == "ymd") {
                $scope.dateString = "DD/MM/YYYY";
                graph_option.chart.xAxis.tickFormat = function(d) {
                    return d3.time.format("%d/%m/%y")(new Date(d))

                }
            }
            if (s == "yw") {
                $scope.dateString = "Wo";
                graph_option.chart.xAxis.tickFormat = function(d) {
                    return d3.time.format("%W.%y")(new Date(d))
                }
            }
            if (s == "ym") {
                $scope.dateString = "MM/YYYY";
                graph_option.chart.xAxis.tickFormat = function(d) {
                    return d3.time.format("%m/%y")(new Date(d))
                }
            }
            if (s == "y") {
                $scope.dateString = "YYYY";
                graph_option.chart.xAxis.tickFormat = function(d) {
                    return d3.time.format("%y")(new Date(d))
                }
            }
            if (s == "ymdhas") {
                $scope.dateString = "DD/MM/YYYY HH:mm:ss";
                graph_option.chart.xAxis.tickFormat = function(d) {
                    return d3.time.format("%d-%m-%y %H:%M:%S")(new Date(d))
                }
            }
            if (s == "ymdha") {
                $scope.dateString = "DD/MM/YYYY HH:mm";
                graph_option.chart.xAxis.tickFormat = function(d) {
                    return d3.time.format("%d-%m-%y %H:%M")(new Date(d))
                }
            }
            if (s == "ymdh") {
                $scope.dateString = "DD/MM/YYYY HH";
                graph_option.chart.xAxis.tickFormat = function(d) {
                    return d3.time.format("%d-%m-%y %H")(new Date(d))
                }
            }
            return {
                d: graph_data,
                o: graph_option
            };
        }

        function createGraph() {
            $scope.chart = {};
            var form = $scope.graph.conf;
            GraphOptionService.prepareOption(form);
            var op1 = GraphOptionService.getOption();
            $scope.chart.form = form;
            $scope.chart.showg = false;
            GraphDataService.createQuery(form);

            GraphDataService.getData(form).then(function(data) {
                //console.log(data);
                var dp1 = GraphDataService.formatData(form, GraphDataService.parseData(form, data))
                $scope.chart.showg = true;
                var g = redo(dp1, op1)
                setForGraph(g.o, g.d)
            })
        }

        $scope.printElem = function(i) {
            H5_loading.show();

            $timeout(function() {
                $scope.changeview(i);
                $timeout(function() {
                    H5_loading.hide();
                    window.print();
                }, 3000)
            })

            // setTimeout(function() {
            // 	H5_loading.hide();
            // 	window.print();
            // }, 3000);

        }
        getGraphs()
    })