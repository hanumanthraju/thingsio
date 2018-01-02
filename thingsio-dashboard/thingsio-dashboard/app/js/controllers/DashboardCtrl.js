 angular.module('app.dashboard')
  .controller('DashboardController', function($scope, $localStorage, GraphFactory, GraphOptionService, ModalService, GraphDataService, SitesFactory, SearchFactory, DeviceFactory, $state, $timeout, Colors) {
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

   function popandload() {
       if (forms.length == 0) {
           return;
       } else {

           var form = forms[0];
           console.log(form);
           form.height = 150;
           form.size = "small";

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
               g.showg = true;
               $scope.graphs.push(g)
               forms.splice(0, 1);
               popandload()
           })
       }
   }
   getGraphs()
   //popandload();


   $scope.gridsterOptions = {
    margins: [20, 20,],
    columns: 2,
    mobileModeEnabled: false,
    /*width: 'auto',
    colWidth: 'auto',*/
    minColumns: 2,
    minRows: 2,
    maxRows: 10,
    rowHeight: 450,
    defaultSizeX: 1,
    defaultSizeY: 1,
    swapping: true,
    floating: true,
    draggable: {
      handle: 'div.panel-heading'
    },
    resizable: {
     enabled: true,
     handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
     
     // optional callback fired when resize is started
     start: function(event, $element, widget) {},
     
     // optional callback fired when item is resized,
     resize: function(event, $element, widget) {
       if (widget.chart.api) widget.chart.api.update();
     }, 
    
      // optional callback fired when item is finished resizing 
     stop: function(event, $element, widget) {
       $timeout(function(){
         if (widget.chart.api) widget.chart.api.update();
       },400)
     } 
    },
  };
});