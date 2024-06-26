/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function ListManager(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.subReport = parentObject;
    self.report = self.subReport.report;
    self.erp = self.report.erp;
    self.id = self.subReport.id +'_list_manager';
    self.initialize();
    return self;
}

ListManager.prototype = {
    constants: {
        container: {
            "class": "list-panel"
        },
        divButtonPanel: {
            "class": "list-button-panel"
        },
        btnSearch: {
            "class": "list-button-search"
        },
        btnClear: {
            "class": "list-button-clear"
        },
        listTableMain: {
            "class": "list-manager-table-main hundred-percent"
        }
    },
    initialize: function () {
        var self = this;
        self.lists = {};
        for(var key in self.config){
            var list = new List(self.config[key], self);
            self.lists[list.id] = list;
        }
        self.listsOrder = [];
        self.forEachList(function(list, index){
            self.listsOrder[index] = list;
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
        self.forEachList(function(column){
            var listenStr = 'getListDataDone_'+ self.subReport.id +'_'+ column.id;
            var emitStr = 'getListData_'+ self.subReport.id +'_'+ column.id;
            if(self.randomId){
                listenStr += '_'+  self.subReport.randomId;
                emitStr += '_'+  self.subReport.randomId;
            }
            var listenKey = 'getListDataDone_'+ column.id;
            var emitKey = 'getListData_'+ column.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        });
        return self;
    },
    bindEvents: function () {
        var self = this;
        return self;
    },
    getSocket: function(){
        var self = this;
        return self.erp.socket;
    },
    _socket: {
        initialize: function(listManager){
            var self = this;
            var socket = listManager.getSocket();

            listManager.forEachList(function(list){
                var listenStr = listManager.socketEvents['getListDataDone_'+list.id];
                socket.on(listenStr, function(data){
                    self.getListDataDone_done(listManager, list, data, {});
                });
            });

            return self;
        },
        getListDataDone_done: function(listManager, list, data, options){
            var self = this;
            if(data.success){
                list.listDataReceived(data.result);
            }
            else{
                list.setToErrorMode();
//                listManager.subReport.notifier.showReportableErrorNotification('Error getting data for '+ list.displayName);
                //console.log('Error getting data for '+ list.displayName, data);
            }
        }
    },
    resetListValues: function(){
        var self = this;
        var obj = {};
        self.forEachList(function(list){
            list.resetValues();
        });
        return obj;
    },
    getListValues: function(){
        var self = this;
        var obj = {};
        self.forEachList(function(list){
            obj[list.id] = list.editValue;
        }, function(list){
            var ret = true;
            if(!list.editValue){
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
    forEachList: function(eachFunction, listFunction){
        var self = this;
        var count = 0;
        for(var key in self.lists){
            var list = self.lists[key];
            if(listFunction){
                if(listFunction(list)){
                    eachFunction.apply(list, [list, count++]);
                }
            }
            else{
                eachFunction.apply(list, [list, count++]);
            }
        }
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    listClicked: function(list, type){
        var self = this;
        self._events.listClicked(self, list, type);
        return self;
    },
    _creation : {
        createContainer: function(listManager){
            var div = $(document.createElement('div')).attr({id: listManager.id, class: listManager.constants.container.class});
            return div;
        },
        createElements: function(listManager){
            var self = this;
            var container = self.createContainer(listManager);
            var elements = {};
            elements.container = container;
            listManager.elements = elements;
            listManager.container = container;
            var table = $(document.createElement('table'));
            var tr = $(document.createElement('tr'))
                .attr(listManager.constants.listTableMain)
                .appendTo(table);
            listManager.forEachList(function(list){
                var td = $(document.createElement('td')).appendTo(tr);
                list.container.appendTo(td);
            });
            table.appendTo(container);
        }
    },
    _events   : {
        listClicked: function(listManager, list, type){
            var self = this;
            if(type === List.BUTTON_MODES.GRID){
                self.gridViewListClicked(listManager, list)
            }
            else if(type === List.BUTTON_MODES.FORM){
                self.formViewListClicked(listManager, list)
            }
            return this;
        },
        gridViewListClicked: function(listManager, list){
            var self = this;
            switch (list.type){
                case List.BUTTON_TYPES.INSERT:
                    self.insertListClicked(listManager, list);
                    break;
                case List.BUTTON_TYPES.VIEW:
                    self.viewListClicked(listManager, list);
                    break;
                case List.BUTTON_TYPES.DELETE:
                    self.deleteListClicked(listManager, list);
                    break;
                case List.BUTTON_TYPES.STATUS_CHANGE:
                    self.statusChangeListClicked(listManager, list);
                    break;
            }
            return self;
        },
        formViewListClicked: function(listManager, list){
            var self = this;
            switch (list.type){
                case List.BUTTON_TYPES.EDIT:
                    self.editListClicked(listManager, list);
                    break;
            }
            return self;
        },
        editListClicked: function(listManager, list){
            var self = this;
            var subReport = listManager.getWebpage();
            subReport.formView.show(FormView.EDIT_MODE, {}, list);
            return self;
        },
        insertListClicked: function(listManager, list){
            var self = this;
            var subReport = listManager.subReport;
            subReport.formView.show(FormView.CREATE_MODE, null, list);
            return self;
        },
        viewListClicked: function(listManager, list){
            var self = this;
            var subReport = listManager.getWebpage();
            console.log(listManager.subReport.grid.data[listManager.selectedRows[0]])
            subReport.formView.show(FormView.VIEW_MODE, listManager.subReport.grid.data[listManager.selectedRows[0]]);
            return self;
        },
        deleteListClicked: function(listManager, list){
            var self = this;
            var subReport = listManager.getWebpage();
            if(list.confirmationMessage){
                if(!confirm(list.confirmationMessage.replace('@row_count@', listManager.selectedRowsCount))){
                    return;
                }
            }
            subReport._db.deleteRow(subReport, listManager.selectedRows, list);
            return this;
        },
        statusChangeListClicked:function(listManager, list){
            var self = this;
            var subReport = listManager.getWebpage();
            if(!confirm(list.confirmationMessage.replace('@row_count@', listManager.selectedRowsCount))){
                return;
            }
            var data = {};
            data.id = listManager.selectedRows;
            data.listId = list.id;
            subReport._db.statusChange(subReport, list, data);
            return this;
        }
    },
    _ui       : {
    }
}

ListManager.prototype.socketEvents = {
    search: "search",
    clearSearch: "clearSearch"
}
