/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function ReportFilterManager(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.subReport = parentObject;
    self.report = self.subReport.report;
    self.erp = self.report.erp;
    self.id = self.subReport.id +'_reportFilter_manager';
    self.initialize();
    return self;
}

ReportFilterManager.prototype = {
    constants: {
        container: {
            "class": "reportFilter-panel"
        },
        divButtonPanel: {
            "class": "reportFilter-button-panel"
        },
        btnSearch: {
            "class": "reportFilter-button-search"
        },
        btnClear: {
            "class": "reportFilter-button-clear"
        },
        reportFilterTableMain: {
            "class": "reportFilter-manager-table-main hundred-percent"
        }
    },
    initialize: function () {
        var self = this;
        self.reportFilters = {};
        for(var key in self.config){
            var reportFilter = new ReportFilter(self.config[key], self);
            self.reportFilters[reportFilter.id] = reportFilter;
        }
        self.reportFiltersOrder = [];
        self.forEachReportFilter(function(reportFilter, index){
            self.reportFiltersOrder[index] = reportFilter;
            reportFilter.linkParentReportFilters();
        });
        self.intializeSocketEventsObject();
        self.createElements().bindEvents();
        self._socket.initialize(self);
        self.setDeviceTypeDisplayMode();
        return self;
    },
    setDeviceTypeDisplayMode: function(){
        var self = this;
        self.container.addClass(self.erp.deviceType);
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
        self.forEachReportFilter(function(column){
            var listenStr = 'getReportFilterDataDone_'+ self.subReport.id +'_'+ column.id;
            var emitStr = 'getReportFilterData_'+ self.subReport.id +'_'+ column.id;
            if(self.randomId){
                listenStr += '_'+  self.subReport.randomId;
                emitStr += '_'+  self.subReport.randomId;
            }
            var listenKey = 'getReportFilterDataDone_'+ column.id;
            var emitKey = 'getReportFilterData_'+ column.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        });
        return self;
    },
    bindEvents: function () {
        var self = this;
        self.elements.btnSearch.on('click', function(){
            self.doSearch();
        });
        self.elements.btnClear.on('click', function(){
            self.clearSearch();
        });
        self.forEachReportFilter(function(reportFilter){
            if(reportFilter.getReportFilterFormElement()){
                reportFilter.getReportFilterFormElement().bindEnterButton(self.elements.btnSearch);
            }
        });
        if(self.erp.deviceType === ERP.DEVICE_TYPES.PC){
            self.elements.sortableTr.sortable({
                axis: 'x',
                stop: function(){
                    self.subReport.savePositionAndSize();
                }
            });
        }
        return self;
    },

    get noOfChildren(){
        var self = this;
        return Object.keys(self.reportFilters).length;
    },
    doSearch: function(reportFilter){
        var self = this;
        var config = self.getFilterValues();
        var socket = self.getSocket();
        self.subReport.resetAllItems();
        var data = {config: config};
        data.parentReportFilterId = reportFilter.id;
        self.parentObject.doSearch(reportFilter);
        //socket.emit(self.socketEvents.search, data);
        return self;
    },
    clearSearch: function(){
        var self = this;
        var socket = self.getSocket();
        var data = {config: {}};
        self.resetFilterValues();
        self.parentObject.clearSearch();
        //socket.emit(self.socketEvents.clearSearch, data);
        return self;
    },
    resetFilterValues: function(){
        var self = this;
        var obj = {};
        self.forEachFilter(function(filter){
            filter.resetEditValue();
        });
        return obj;
    },
    getFilterValues: function(){
        var self = this;
        var obj = {};
        self.forEachReportFilter(function(filter){
            obj[filter.id] = filter.editValue;
        }, function(filter){
            var ret = true;
            if(!filter.editValue){
                ret = false;
            }
            return ret;
        });
        return obj;
    },

    getSocket: function(){
        var self = this;
        return self.erp.socket;
    },
    _socket: {
        initialize: function(reportFilterManager){
            var self = this;
            var socket = reportFilterManager.getSocket();

            reportFilterManager.forEachReportFilter(function(reportFilter){
                var listenStr = reportFilterManager.socketEvents['getReportFilterDataDone_'+reportFilter.id];
                socket.on(listenStr, function(data){
                    self.getReportFilterDataDone_done(reportFilterManager, reportFilter, data, {});
                });
            });

            return self;
        },
        getReportFilterDataDone_done: function(reportFilterManager, reportFilter, data, options){
            var self = this;
            if(data.success){
                reportFilter.reportFilterDataReceived(data.result);
            }
            else{
                reportFilterManager.subReport.notifier.showReportableErrorNotification('Error getting data for '+ reportFilter.displayName);
            }
        }
    },
    resetReportFilterValues: function(){
        var self = this;
        var obj = {};
        self.forEachReportFilter(function(reportFilter){
            reportFilter.resetValues();
        });
        return obj;
    },
    getReportFilterValues: function(){
        var self = this;
        var obj = {};
        self.forEachReportFilter(function(reportFilter){
            obj[reportFilter.id] = reportFilter.editValue;
        }, function(reportFilter){
            var ret = true;
            if(!reportFilter.editValue){
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
    forEachReportFilter: function(eachFunction, reportFilterFunction){
        var self = this;
        var count = 0;
        for(var key in self.reportFilters){
            var reportFilter = self.reportFilters[key];
            if(reportFilterFunction){
                if(reportFilterFunction(reportFilter)){
                    eachFunction.apply(reportFilter, [reportFilter, count++]);
                }
            }
            else{
                eachFunction.apply(reportFilter, [reportFilter, count++]);
            }
        }
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    reportFilterClicked: function(reportFilter, type){
        var self = this;
        self._events.reportFilterClicked(self, reportFilter, type);
        return self;
    },
    _creation : {
        createContainer: function(reportFilterManager){
            var div = $(document.createElement('div')).attr({id: reportFilterManager.id, class: reportFilterManager.constants.container.class});
            return div;
        },
        createElements: function(reportFilterManager){
            var self = this;
            var container = self.createContainer(reportFilterManager);
            var elements = {};
            elements.container = container;
            reportFilterManager.elements = elements;
            reportFilterManager.container = container;
            var table = $(document.createElement('table'))
                .attr(reportFilterManager.constants.reportFilterTableMain);
            var tr = $(document.createElement('tr'))
                .appendTo(table);
            reportFilterManager.forEachReportFilter(function(reportFilter){
                var td = $(document.createElement('td')).appendTo(tr);
                reportFilter.container.appendTo(td);
            });
            var td = $(document.createElement('td')).append(self.createButtonsContainer(reportFilterManager)).appendTo(tr);
            table.appendTo(container);
            reportFilterManager.elements.sortableTr = tr;
        },
        createButtonsContainer: function(reportFilterManager){
            var div = $(document.createElement('div')).attr(reportFilterManager.constants.divButtonPanel);

            var btnSearch = $(document.createElement('button'))
                .attr(reportFilterManager.constants.btnSearch)
                .text('Search')
                .appendTo(div);
            var btnClear = $(document.createElement('button'))
                .attr(reportFilterManager.constants.btnClear)
                .text('Clear')
                .appendTo(div);

            reportFilterManager.elements.divButtonPanel = div;
            reportFilterManager.elements.btnSearch = btnSearch;
            reportFilterManager.elements.btnClear = btnClear;

            return div;
        }
    },
    _events   : {
        reportFilterClicked: function(reportFilterManager, reportFilter, type){
            var self = this;
            if(type === ReportFilter.BUTTON_MODES.GRID){
                self.gridViewReportFilterClicked(reportFilterManager, reportFilter)
            }
            else if(type === ReportFilter.BUTTON_MODES.FORM){
                self.formViewReportFilterClicked(reportFilterManager, reportFilter)
            }
            return this;
        },
        gridViewReportFilterClicked: function(reportFilterManager, reportFilter){
            var self = this;
            switch (reportFilter.type){
                case ReportFilter.BUTTON_TYPES.INSERT:
                    self.insertReportFilterClicked(reportFilterManager, reportFilter);
                    break;
                case ReportFilter.BUTTON_TYPES.VIEW:
                    self.viewReportFilterClicked(reportFilterManager, reportFilter);
                    break;
                case ReportFilter.BUTTON_TYPES.DELETE:
                    self.deleteReportFilterClicked(reportFilterManager, reportFilter);
                    break;
                case ReportFilter.BUTTON_TYPES.STATUS_CHANGE:
                    self.statusChangeReportFilterClicked(reportFilterManager, reportFilter);
                    break;
            }
            return self;
        },
        formViewReportFilterClicked: function(reportFilterManager, reportFilter){
            var self = this;
            switch (reportFilter.type){
                case ReportFilter.BUTTON_TYPES.EDIT:
                    self.editReportFilterClicked(reportFilterManager, reportFilter);
                    break;
            }
            return self;
        },
        editReportFilterClicked: function(reportFilterManager, reportFilter){
            var self = this;
            var subReport = reportFilterManager.getWebpage();
            subReport.formView.show(FormView.EDIT_MODE, {}, reportFilter);
            return self;
        },
        insertReportFilterClicked: function(reportFilterManager, reportFilter){
            var self = this;
            var subReport = reportFilterManager.subReport;
            subReport.formView.show(FormView.CREATE_MODE, null, reportFilter);
            return self;
        },
        viewReportFilterClicked: function(reportFilterManager, reportFilter){
            var self = this;
            var subReport = reportFilterManager.getWebpage();
            console.log(reportFilterManager.subReport.grid.data[reportFilterManager.selectedRows[0]])
            subReport.formView.show(FormView.VIEW_MODE, reportFilterManager.subReport.grid.data[reportFilterManager.selectedRows[0]]);
            return self;
        },
        deleteReportFilterClicked: function(reportFilterManager, reportFilter){
            var self = this;
            var subReport = reportFilterManager.getWebpage();
            if(reportFilter.confirmationMessage){
                if(!confirm(reportFilter.confirmationMessage.replace('@row_count@', reportFilterManager.selectedRowsCount))){
                    return;
                }
            }
            subReport._db.deleteRow(subReport, reportFilterManager.selectedRows, reportFilter);
            return this;
        },
        statusChangeReportFilterClicked:function(reportFilterManager, reportFilter){
            var self = this;
            var subReport = reportFilterManager.getWebpage();
            if(!confirm(reportFilter.confirmationMessage.replace('@row_count@', reportFilterManager.selectedRowsCount))){
                return;
            }
            var data = {};
            data.id = reportFilterManager.selectedRows;
            data.reportFilterId = reportFilter.id;
            subReport._db.statusChange(subReport, reportFilter, data);
            return this;
        }
    },
    _ui       : {
    }
}

ReportFilterManager.prototype.socketEvents = {
    search: "search",
    clearSearch: "clearSearch"
}
