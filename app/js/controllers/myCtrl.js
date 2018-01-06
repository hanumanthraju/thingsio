angular.module('app.dashboard')
.controller('MyCtrl', function($scope, $timeout, $localStorage, GraphFactory, SitesFactory, GroupFactory, AlertService, GraphOptionService, ModalService, GraphDataService, GraphIDFactory, SearchFactory, DeviceFactory, $state, $timeout, Colors, MyDataService) {
  $scope.gridsterOptions = {
    margins: [20, 20],
    columns: 2,
    mobileModeEnabled: false,
    draggable: {
      handle: 'h3'
    },
    resizable: {
     enabled: true,
     handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
     
     // optional callback fired when resize is started
     start: function(event, $element, widget) {},
     
     // optional callback fired when item is resized,
     resize: function(event, $element, widget) {
       //if (widget.chart.api) widget.chart.api.update();
       if (widget.graph_option && widget.graph_option.chart.api){
            widget.graph_option.chart.api.update();
       } 
     }, 
    
      // optional callback fired when item is finished resizing 
     stop: function(event, $element, widget) {
       $timeout(function(){
         //if (widget.chart.api) widget.chart.api.update();
         if (widget.graph_option && widget.graph_option.chart.api){
            widget.graph_option.chart.api.update();
       } 
       },400)
     } 
    },
  };
  
  $scope.dashboard = {
    widgets: [{
      col: 0,
      row: 0,
      sizeY: 2,
      sizeX: 2,
      name: "Discrete Bar Chart",
      chart: {
        options: MyDataService.discreteBarChart.options(),
        data: MyDataService.discreteBarChart.data(),
        api: {} 
      }
    }, {
      col: 2,
      row: 0,
      sizeY: 2,
      sizeX: 2,
      name: "Candlestick Bar Chart",
      chart: {
        options: MyDataService.candlestickBarChart.options(),
        data: MyDataService.candlestickBarChart.data(),
        api: {} 
      }
    }, {
      col: 0,
      row: 2,
      sizeY: 2,
      sizeX: 3,
      name: "Line Chart",
      chart: {
        options: MyDataService.lineChart.options(),
        data: MyDataService.lineChart.data(),
        api: {} 
      }
    }, {
      col: 4,
      row: 2,
      sizeY: 1,
      sizeX: 1,
      name: "Pie Chart",
      chart: {
        options: MyDataService.pieChart.options(),
        data: MyDataService.pieChart.data(),
        api: {} 
      }
    }]
  };
  
  // We want to manually handle `window.resize` event in each directive.
  // So that we emulate `resize` event using $broadcast method and internally subscribe to this event in each directive
  // Define event handler
  $scope.events = {
    resize: function(e, scope){
      $timeout(function(){
        scope.api.update()
      },200)
    }
  };
  angular.element(window).on('resize', function(e){
    $scope.$broadcast('resize');
  });
  
  // We want to hide the charts until the grid will be created and all widths and heights will be defined.
  // So that use `visible` property in config attribute
  $scope.config = {
    visible: false
  };
  $timeout(function(){
    $scope.config.visible = true;
  }, 200);
  var forms = []
         $scope.graphs = [];

         function getGraphs() {
             GraphFactory.get({
                 type: 'groups'
             }).$promise.then(function(graphs) {
                 console.log(graphs);
                 if (!graphs.error)
                     for (var i = 0; i < graphs.data.length; i++) {
                         var cnf = graphs.data[i].conf;
                         cnf._id = graphs.data[i]._id;
                         forms.push(cnf);
                     }

                 popandload();
             })
         }

         $scope.deleteGraph = function(g) {
             AlertService.confirm("Delete Graph", "Are you sure you want to delete this graph").then(function() {
                 H5_loading.show();
                 GraphIDFactory.delete({
                     id: g.form._id
                 }).$promise.then(function() {
                     H5_loading.hide();
                     g.del = true;
                 })
             })
         }

         function popandload() {
             if (forms.length == 0) {
                 return;
             } else {

                 var form = forms[0];
                 console.log(form);
                 //form.height = 150;
                 //form.size = "small";

                 delete form.title;
                 delete form.subtitle;
                 delete form.caption;
                 GraphOptionService.prepareOption(form);
                 var g = {};
                 g.graph_option = (GraphOptionService.getOption());
                 g.form = form;
                 g.showg = false;
                 GraphDataService.createQuery(form);
                 GraphDataService.getData(form).then(function(data) {
                     g.graph_data = GraphDataService.parseData(form, data);
                     g.graph_data = GraphDataService.formatData(form, g.graph_data);
                     g.sizeX = 1;
                     g.sizeY = 1;
                     g.showg = true;
                     $scope.graphs.push(g)
                     forms.splice(0, 1);
                     popandload()
                 })
             }
         }
         getGraphs();


         $scope.sites = [];
         $scope.groups = [];
         $scope.form = {};

         function loadSites() {
             $scope.sites = [];
             H5_loading.show();
             SitesFactory.get().$promise.then(function(sites) {
                 H5_loading.hide();
                 if (!sites.error) {
                     $scope.sites.push.apply($scope.sites, sites.data);
                     $scope.sites.unshift({
                         name: "All Sites",
                         site_id: -1
                     });
                     $scope.form.site = $scope.sites[0]
                 }
             })
         }

         function loadMyGroups() {
             H5_loading.show();
             GroupFactory.get().$promise.then(function(groups) {
                 H5_loading.hide();
                 if (!groups.error) {
                     $scope.groups.push.apply($scope.groups, groups.data);
                     $scope.groups.unshift({
                         group_name: "All Groups",
                         _id: -1
                     });
                     $scope.form.group = $scope.groups[0]
                 }
             })
         }
         loadMyGroups();
         loadSites();
});
