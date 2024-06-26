/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function ReportFilter(config, parentObject) {
    var self = this;
    self.config = config;
    self.reportFilterManager = parentObject;
    self.subReport = self.reportFilterManager.parentObject;
    self.report = self.reportFilterManager.parentObject.parentObject;
    self.erp = self.subReport.erp;
    self.parentObject = parentObject;
    self.initialize();
    return self;
}

ReportFilter.FILTER_TYPES = {};
ReportFilter.FILTER_TYPES.FREE_SEARCH = 'freeSearch';
ReportFilter.FILTER_TYPES.RANGE = 'range';
ReportFilter.FILTER_TYPES.DATE = 'date';
ReportFilter.FILTER_TYPES.CHOICE = 'choice';
ReportFilter.FILTER_TYPES.LOOKUP = 'lookUp';

ReportFilter.prototype = {
    constants: {
        container: {
            "class": "reportFilter-container subReportItem"
        },
        spanDisplayName: {
            "class": "reportFilter-spanDisplayName"
        },
        divHeader: {
            "class": "reportFilter-divHeader divHandle"
        },
        divContent: {
            "class": "reportFilter-divContent"
        },
        spanTextContent: {
            "class": "reportFilter-spanTextContent"
        },
        spanQueryContent: {
            "class": "reportFilter-spanQueryContent text-loading"
        },
        divDisplayName: {
            "class": "reportFilter-display-name"
        },
        divFormElements: {
            "class": "reportFilter-form-elements"
        },
        filterTableMain: {
            "class": "reportFilter-table-main"
        }
    },
    initialize: function () {
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }

        self.createElements().bindEvents();
        self.setDeviceTypeDisplayMode();


        /*//if(self.subReport.id == 'employeePerformanceApprisal'){
         if(self.config.type == 'lookUp'){
         //if(self.id == 'selectService'){
         //console.log(self.container.find('select'));

         self.container.find('select').chosen();
         //self.container.chosen({disable_search_threshold: 10})
         }*/
        return self;
    },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    initializeChosen: function(){
        var self = this;
        if(self.isChosenInitialized){
            return self;
        }
        self.getReportFilterFormElement().chosen({
            allow_single_deselect: true,
            search_contains: true
        });
        self.isChosenInitialized = true;
        return self;
    },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    setDeviceTypeDisplayMode: function(){
        var self = this;
        self.container.addClass(self.erp.deviceType);
        return self;
    },
    bindEvents: function () {
        var self = this;
        var element = self.getReportFilterFormElement();
        if(element){
            element.on('change', function(){
                self.parentObject.doSearch(self);
            });
        }
        return self;
    },
    setPositionAndSize: function(positionObj){
        var self = this;
        if(!positionObj){
            return;
        }
        var index = parseInt(positionObj.index) - 1;
        var td = self.container.closest('td');
        if(index < 0){
            self.container.closest('tr').prepend(td);
        }
        else{
            self.container.closest('tr').children().eq(index).after(td);
        }
    },
    getPositionAndSize: function(){
        var self = this;
        var obj = self.container.position();
        obj.width =self.container.width();
        obj.height =self.container.height();
        obj.index = self.container.parent().index();
        return obj;
    },
    setToNormalMode: function(){
        var self = this;
        self.isInReorderMode = false;
        self.container.resizable('destroy').draggable('destroy');
        return self;
    },
    setToReorderMode: function(){
        var self = this;
        self.isInReorderMode = true;
        self.container.resizable().draggable({ containment: self.subReport.container, scroll: false });
        return self;
    },
    get editValue(){
        var self = this;
        return self.getCurrentEditValue();
    },
    set editValue(newEditValue){
        var self = this;
//        throw 'not implemented exception';
        self.setCurrentEditValue(newEditValue);
    },
    resetEditValue: function(){
        var self = this;
        var value;
        if(self.defaultValue){
            value = self.defaultValue;
        }
        self.editValue = value;
        return self;
    },
    getReportFilterValueFromDefaultValue: function(){
        var self = this;
        var value = '';
        var defaultValue = self.typeSpecific.defaultValue;
        switch(self.type){
            case "date":
                switch(defaultValue){
                    case "getDate":
                        value = moment(new Date()).format('YYYY-MM-DD');
                        break;
                    case "nextMonthFirstDate":
                        value = moment().add('months', 1).format('YYYY-MM-01');
                        break;
                    case "thisMonthFirstDate":
                        value = moment().format('YYYY-MM-01');
                        break;
                    case "lastMonthFirstDate":
                        value = moment().add('months', -1).format('YYYY-MM-01');
                        break;
                }
                break;
            default:
                value = defaultValue;
                break;
        }
        return value;
    },
    getCurrentEditValue: function(){
        var self = this;
        var value;
        switch(self.type){
            case ReportFilter.FILTER_TYPES.FREE_SEARCH:
            case ReportFilter.FILTER_TYPES.DATE:
            case ReportFilter.FILTER_TYPES.CHOICE:
            case ReportFilter.FILTER_TYPES.LOOKUP:
                value = self.getReportFilterFormElement().val();

        }
        return value;
    },
    setCurrentEditValue: function(value){
        var self = this;
        switch(self.type){
            case ReportFilter.FILTER_TYPES.FREE_SEARCH:
            case ReportFilter.FILTER_TYPES.DATE:
            case ReportFilter.FILTER_TYPES.CHOICE:
            case ReportFilter.FILTER_TYPES.LOOKUP:
                self.getReportFilterFormElement().val(value);
                break;
        }
        return value;
    },
    resetValues: function(){
        var self = this;
        for(var key in self.elements.dataSourceElements){
            var element = self.elements.dataSourceElements[key];
            element.addClass('text-loading').text('...');
        }
        return self;
    },
    getReportFilterFormElement: function(){
        var self = this;
        return self.elements.formElements.element;
    },
    linkParentReportFilters: function(){
        var self = this;
        var dataSource = self.typeSpecific.dataSource;
        if(dataSource && dataSource.parentReportFilters){
            dataSource.parentReportFilters.forEach(function(parentReportFilterId){
                var parentReportFilter = self.reportFilterManager.reportFilters[parentReportFilterId];
                if(!parentReportFilter.childReportFilters){
                    parentReportFilter.childReportFilters = [];
                }
                parentReportFilter.childReportFilters.push(self.id);
            })
        }
    },
    refreshDataFromServer: function(parentReportFilter){
        var self = this;
        var parentReportFilterId = undefined;
        if(parentReportFilter){
            parentReportFilterId = parentReportFilter.id;
        }

        if(parentReportFilter){
            if(parentReportFilter.childReportFilters && parentReportFilter.childReportFilters.indexOf(self.id) == -1){
                return;
            }
        }

        var url = '/ajax/reports/' + self.report.id + '/' +self.subReport.id + '/getReportFilterData/'+ self.id;
        self.resetValues();
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                parentReportFilterId :parentReportFilterId,
                config: {
                    filterCondition : self.reportFilterManager.getFilterValues()
                }
            }
        }).done(function(data){
            if(data.success){
                self.lookUpData = data.result;
                //self.dataTimestamp = data.timestamp;
            }
            else{
                //self.setToErrorMode();
                //self.subReport.notifier.showReportableErrorNotification('Error getting data for '+ self.displayName+'('+ data.errorMessage +')');
            }
        });
        return self;
    },

    reportFilterDataReceived: function(data){
        var self = this;
        self.currentData = data;
        self.lookUpData = data;
        return self;
    },
    set lookUpData(data){
        var self = this;
        self.elements.formElements.element.setSelectOptions(data, true);
        if(!self.isChosenInitialized){
            self.initializeChosen()
        }
        else{
            self.getReportFilterFormElement().trigger('chosen:updated');
        }
        return self;
    },

    createPieChart: function(){
        var self = this;
        var config = {};
        config.data = self.currentData.percent;
        config.parentContainer = self.elements.divContent;
        var pieChart = new PieChart(config);
        self.chart = pieChart;
        return self;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);
        if(self.typeSpecific.defaultValue){
            self.setCurrentEditValue(self.getReportFilterValueFromDefaultValue());
        }
        return self;
    },
    isDisabledNow: function(){
        var self = this;
        return self.getReportFilterFormElement().prop('disabled');
    },
    triggerEvent: function(reportFilterMode, eventType){
        var self = this;
        if(!self.isDisabledNow(reportFilterMode)){
            self.getElement(reportFilterMode).trigger(eventType);
        }
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
    getElement: function(type){
        var self = this;
        return self.container;
    },
//    getReportFilterFormElement: function(index){
//        var self = this;
//        return self.elements.formElements.element;;
//    },
    _creation : {
        createContainer: function(reportFilter){
            var div = $(document.createElement('div')).attr({id: reportFilter.id, class: reportFilter.constants.container.class});
            return div;
        },
        createDisplayNameContainer: function(filter){
            var div = $(document.createElement('div'))
                .attr(filter.constants.divDisplayName)
                .text(filter.displayName);
            return div;
        },
        createFormElementsContainer: function(filter){
            var div = $(document.createElement('div'))
                .attr(filter.constants.divFormElements);
            return div;
        },
        createElements: function(reportFilter){
            var self = this;
            var container = self.createContainer(reportFilter);

            reportFilter.elements = {};
            reportFilter.container = container;
            reportFilter.elements.container = container;
            reportFilter.elements.divDisplayName = self.createDisplayNameContainer(reportFilter);
            reportFilter.elements.divFormElements = self.createFormElementsContainer(reportFilter);
            reportFilter.elements.formElements = {};
            switch(reportFilter.type){
                case ReportFilter.FILTER_TYPES.FREE_SEARCH:
                    self.createFreeSearch(reportFilter);
                    break;
                case ReportFilter.FILTER_TYPES.LOOKUP:
                    self.createLookUp(reportFilter);
                    break;
                case ReportFilter.FILTER_TYPES.DATE:
                    self.createDate(reportFilter);
                    break;
                case ReportFilter.FILTER_TYPES.CHOICE:
                    self.createChoice(reportFilter);
                    break;
                //Need to do the rest
            }
            for(var key in reportFilter.elements.formElements){
                reportFilter.elements.formElements[key].appendTo(reportFilter.elements.divFormElements);
            }
            var table = $(document.createElement('table'));
            var tr = $(document.createElement('tr'))
                .attr(reportFilter.constants.filterTableMain)
                .appendTo(table);
            var td1 = $(document.createElement('td')).appendTo(tr).append(reportFilter.elements.divDisplayName);
            var td2 = $(document.createElement('td')).appendTo(tr).append(reportFilter.elements.divFormElements);
            table.appendTo(reportFilter.container);

            return self;
        },
        createFreeSearch: function(reportFilter){
            var self = this;
            var element = $(document.createElement('input')).attr({id: 'reportFilter_'+reportFilter.id, "type": "text"});
            reportFilter.elements.formElements.element = element;
            return element;
        },
        createDate: function(reportFilter){
            var self = this;
            var element = $(document.createElement('input')).attr({id: 'reportFilter_'+reportFilter.id, "type": "date"});
            reportFilter.elements.formElements.element = element;
            return element;
        },
        createChoice: function(reportFilter){
            var self = this;
            var element = $(document.createElement('select')).attr({id: 'reportFilter_'+reportFilter.id});
            element.setSelectOptions(reportFilter.typeSpecific.datalist, true);
            reportFilter.elements.formElements.element = element;
            return element;
        },
        createLookUp: function(reportFilter){
            var self = this;
            var element = $(document.createElement('select')).attr({id: 'reportFilter_'+reportFilter.id});
            reportFilter.elements.formElements.element = element;
            return element;
        }
    },
    _events   : {
    },
    _ui       : {
    }
}