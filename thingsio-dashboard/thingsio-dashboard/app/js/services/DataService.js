angular.module('app.services').factory('DataService', function($localStorage, $state, $rootScope, $http, UserFactory) {
    var raw_filter = null;
    var option1 = {
        chart: {
            type: 'historicalBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 65,
                left: 50
            },
            x: function(d) {
                return d[0];
            },
            y: function(d) {
                return d[1] / 100;
            },
            showValues: true,
            valueFormat: function(d) {
                // return d3.format(',.1f')(d);
                return d
            },
            duration: 100,
            xAxis: {
                axisLabel: 'Time',
                // tickFormat: function(d) {
                // 	return d
                // },
                // rotateLabels: 30,
                // showMaxMin: false
            },
            yAxis: {
                axisLabel: 'kwh',
                // axisLabelDistance: -10,
                // tickFormat: function(d) {
                // 	return d3.format(',.1f')(d);
                // }
            },
            tooltip: {
                keyFormatter: function(d) {
                    return d3.time.format('%x')(new Date(d));
                }
            },
            zoom: {
                enabled: true,
                scaleExtent: [1, 10],
                useFixedDomain: false,
                useNiceScale: false,
                horizontalOff: false,
                verticalOff: true,
                unzoomEventType: 'dblclick.zoom'
            }
        }
    };
    var lineoption1 = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d) {
                return d.x;
            },
            y: function(d) {
                return d.y / 100;
            },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e) {
                    console.log("stateChange");
                },
                changeState: function(e) {
                    console.log("changeState");
                },
                tooltipShow: function(e) {
                    console.log("tooltipShow");
                },
                tooltipHide: function(e) {
                    console.log("tooltipHide");
                }
            },
            xAxis: {
                axisLabel: 'Time',
                tickFormat: function(d) {
                    return d3.time.format("%d-%m-%y %H:%M")(new Date(d))
                },
            },
            yAxis: {
                axisLabel: 'Energy (kwh)',
                tickFormat: function(d) {
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: -10
            },
            callback: function(chart) {
                console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'Total Energy Generated'
        },
        subtitle: {
            enable: true,
            text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
            css: {
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        },
        caption: {
            enable: true,
            html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
            css: {
                'text-align': 'justify',
                'margin': '10px 13px 0px 7px'
            }
        }
    };
    var directedoption = {
        chart: {
            type: 'forceDirectedGraph',
            height: 450,
            width: 916,
            margin: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            }
        }
    };
    return {
        getDataFilter: function() {
            return raw_filter
        },
        setDataFilter: function(s) {
            raw_filter = s
        },
        getOption1: function() {
            return lineoption1
        }
    }
})