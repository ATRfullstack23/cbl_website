/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function GraphManager(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.subReport = parentObject;
    self.report = self.subReport.report;
    self.erp = self.report.erp;
    self.id = self.subReport.id +'_graph_manager';
    self.initialize();
    return self;
}

GraphManager.prototype = {
    constants: {
        container: {
            "class": "graph-panel"
        },
        divButtonPanel: {
            "class": "graph-button-panel"
        },
        btnSearch: {
            "class": "graph-button-search"
        },
        btnClear: {
            "class": "graph-button-clear"
        },
        graphTableMain: {
            "class": "graph-manager-table-main hundred-percent"
        }
    },
    initialize: function () {
        var self = this;
        self.graphs = {};
        for(var key in self.config){
            var graph = new Graph(self.config[key], self);
            self.graphs[graph.id] = graph;
        }
        self.graphsOrder = [];
        self.forEachGraph(function(graph, index){
            self.graphsOrder[index] = graph;
        });
        self.intializeSocketEventsObject();
        self.createElements().bindEvents();
        self._socket.initialize(self);
        return self;
    },
    intializeSocketEventsObject: function(){
        var self = this;
        self.socketEvents = $.extend({}, self.socketEvents);
        for(var key in self.socketEvents){
            self.socketEvents[key] += '_'+ self.subReport.id;
            if(self.subReport.randomId){
                self.socketEvents[key] += '_'+  self.subReport.randomId;
            }
        }
        self.forEachGraph(function(column){
            var listenStr = 'getGraphDataDone_'+ self.subReport.id +'_'+ column.id;
            var emitStr = 'getGraphData_'+ self.subReport.id +'_'+ column.id;
            if(self.randomId){
                listenStr += '_'+  self.subReport.randomId;
                emitStr += '_'+  self.subReport.randomId;
            }
            var listenKey = 'getGraphDataDone_'+ column.id;
            var emitKey = 'getGraphData_'+ column.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        });
        return self;
    },
    bindEvents: function () {
        var self = this;
//        self.elements.btnSearch.on('click', function(){
//            self.doSearch();
//        });
//        self.elements.btnClear.on('click', function(){
//            self.clearSearch();
//        });
//        self.forEachGraph(function(graph){
//            if(graph.getGraphFormElement()){
//                graph.getGraphFormElement().bindEnterButton(self.elements.btnSearch);
//            }
//        });
        return self;
    },
    getSocket: function(){
        var self = this;
        return self.erp.socket;
    },
    _socket: {
        initialize: function(graphManager){
            var self = this;
            var socket = graphManager.getSocket();

            graphManager.forEachGraph(function(graph){
                var listenStr = graphManager.socketEvents['getGraphDataDone_'+graph.id];
                socket.on(listenStr, function(data){
                    self.getGraphDataDone_done(graphManager, graph, data, {});
                });
            });

            return self;
        },
        getGraphDataDone_done: function(graphManager, graph, data, options){
            var self = this;
            if(data.success){
                graph.graphDataReceived(data.result);
            }
            else{
                graph.setToErrorMode();
                //graphManager.subReport.notifier.showReportableErrorNotification('Error getting data for '+ graph.displayName);
                //console.log('Error getting data for '+ graph.displayName, data)
            }
        }
    },
    resetGraphValues: function(){
        var self = this;
        var obj = {};
        self.forEachGraph(function(graph){
            graph.resetValues();
        });
        return obj;
    },
    getGraphValues: function(){
        var self = this;
        var obj = {};
        self.forEachGraph(function(graph){
            obj[graph.id] = graph.editValue;
        }, function(graph){
            var ret = true;
            if(!graph.editValue){
                ret = false;
            }
            return ret;
        });
        return obj;
    },
    createElements: function () {
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    show      : function () {
        var self = this;
        return self;
    },
    hide      : function () {
        var self = this;
        return self;
    },
    cancel    : function () {
        var self = this;
        return self;
    },
    forEachGraph: function(eachFunction, graphFunction){
        var self = this;
        var count = 0;
        for(var key in self.graphs){
            var graph = self.graphs[key];
            if(graphFunction){
                if(graphFunction(graph)){
                    eachFunction.apply(graph, [graph, count++]);
                }
            }
            else{
                eachFunction.apply(graph, [graph, count++]);
            }
        }
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    graphClicked: function(graph, type){
        var self = this;
        self._events.graphClicked(self, graph, type);
        return self;
    },
    _creation : {
        createContainer: function(graphManager){
            var div = $(document.createElement('div')).attr({id: graphManager.id, class: graphManager.constants.container.class});
            return div;
        },
        createElements: function(graphManager){
            var self = this;
            var container = self.createContainer(graphManager);
            var elements = {};
            elements.container = container;
            graphManager.elements = elements;
            graphManager.container = container;
            var table = $(document.createElement('table'));
            var tr = $(document.createElement('tr'))
                .attr(graphManager.constants.graphTableMain)
                .appendTo(table);
            graphManager.forEachGraph(function(graph){
                var td = $(document.createElement('td')).appendTo(tr);
                graph.container.appendTo(td);
            });
            table.appendTo(container);
        }
    },
    _events   : {
        graphClicked: function(graphManager, graph, type){
            var self = this;
            if(type === Graph.BUTTON_MODES.GRID){
                self.gridViewGraphClicked(graphManager, graph)
            }
            else if(type === Graph.BUTTON_MODES.FORM){
                self.formViewGraphClicked(graphManager, graph)
            }
            return this;
        },
        gridViewGraphClicked: function(graphManager, graph){
            var self = this;
            switch (graph.type){
                case Graph.BUTTON_TYPES.INSERT:
                    self.insertGraphClicked(graphManager, graph);
                    break;
                case Graph.BUTTON_TYPES.VIEW:
                    self.viewGraphClicked(graphManager, graph);
                    break;
                case Graph.BUTTON_TYPES.DELETE:
                    self.deleteGraphClicked(graphManager, graph);
                    break;
                case Graph.BUTTON_TYPES.STATUS_CHANGE:
                    self.statusChangeGraphClicked(graphManager, graph);
                    break;
            }
            return self;
        },
        formViewGraphClicked: function(graphManager, graph){
            var self = this;
            switch (graph.type){
                case Graph.BUTTON_TYPES.EDIT:
                    self.editGraphClicked(graphManager, graph);
                    break;
            }
            return self;
        },
        editGraphClicked: function(graphManager, graph){
            var self = this;
            var subReport = graphManager.getWebpage();
            subReport.formView.show(FormView.EDIT_MODE, {}, graph);
            return self;
        },
        insertGraphClicked: function(graphManager, graph){
            var self = this;
            var subReport = graphManager.subReport;
            subReport.formView.show(FormView.CREATE_MODE, null, graph);
            return self;
        },
        viewGraphClicked: function(graphManager, graph){
            var self = this;
            var subReport = graphManager.getWebpage();
            console.log(graphManager.subReport.grid.data[graphManager.selectedRows[0]])
            subReport.formView.show(FormView.VIEW_MODE, graphManager.subReport.grid.data[graphManager.selectedRows[0]]);
            return self;
        },
        deleteGraphClicked: function(graphManager, graph){
            var self = this;
            var subReport = graphManager.getWebpage();
            if(graph.confirmationMessage){
                if(!confirm(graph.confirmationMessage.replace('@row_count@', graphManager.selectedRowsCount))){
                    return;
                }
            }
            subReport._db.deleteRow(subReport, graphManager.selectedRows, graph);
            return this;
        },
        statusChangeGraphClicked:function(graphManager, graph){
            var self = this;
            var subReport = graphManager.getWebpage();
            if(!confirm(graph.confirmationMessage.replace('@row_count@', graphManager.selectedRowsCount))){
                return;
            }
            var data = {};
            data.id = graphManager.selectedRows;
            data.graphId = graph.id;
            subReport._db.statusChange(subReport, graph, data);
            return this;
        }
    },
    _ui       : {
    }
}

GraphManager.prototype.socketEvents = {
    search: "search",
    clearSearch: "clearSearch"
}
