/**
 * Created by sanal on 16/12/13.
 */
function CalendarView(config,parentObj){
    var self = this;
    self.config = config;
    self.subModule = parentObj;
    self.erp = self.subModule.erp;
    self.initialize();
    return self;
}

CalendarView.prototype={
    constants: {
        container: {
            "class": "calendarContainer"
        },
        mainContainer: {
            "class": "addMainConatiner"
        },
        subContainer: {'class': 'addConatiner'},
        eventData:{
            'id': 'CustomerName'
        },
        startData:{
            'id': 'startDate'
        },
        startTime:{
            'id': 'startTime'
        },
        description:{
            'id': 'description'
        },
        carNumber:{
            'id': 'carNumber'
        },
        customerNumber:{'id': 'mobileNumber'}


    },
    initialize: function () {
        var self = this;
        if(!self.config.viewsToShow){
            self.config.viewsToShow = ['month'];
        }
        if(!self.config.firstDay){
            self.config.firstDay = '0';
        }
        if(self.config.showWeekends === undefined){
            self.config.showWeekends = true;
        }
        if(!self.config.hiddenDays){
            self.config.hiddenDays = [];
        }
        for(var key in self.config){
            self[key] = self.config[key];
        }
        self.notifier = self.erp.notifier;
        self.eventHandlers = self.config.eventHandlers || {};
        self.createElements().bindEvents().intializeSocketEventsObject();
        self._db.initialize(self);
        return self;
    },
    createElements: function(){
        var self = this;
        self.elements = {};
        self.elements.buttons = {};
        self.creation.createElements(self);
//        self.search();
        return self;
    },
    intializeSocketEventsObject: function(){
        var self = this;
        self.socketEvents = $.extend({}, self.socketEvents);
        for(var key in self.socketEvents){
            self.socketEvents[key] += '_'+ self.subModule.id;
            if(self.subModule.randomId){
                self.socketEvents[key] += '_'+  self.subModule.randomId;
            }
        }
        return self;
    },
    getData: function(options){
        var self = this;
        self._db.getData(self, options);
        return self;
    },
    _db: {
        initialize: function(calendarView){
            var self = this;
            var socket = calendarView.getSocket();
            socket.on(calendarView.socketEvents.getCalendarDataDone, function(data){

                self.getData_done(calendarView, data);
            });
        },
        getData: function(calendarView, options){
            var self = this;
            //var filter = calendarView.filterManager.getFilter();
            var config = {};
            var socket = calendarView.getSocket();
            calendarView.container.find('.fc-button').css('visibility', 'hidden');
            calendarView.lastRequestTime = new Date();

            if(options){
                var requestId = crypto.getRandomValues(new Uint16Array(1))[0];
                config.requestId = requestId;
                socket.calendarView.events[requestId] = options;
            }

            var selectedMonth =  new Date().getMonth();
            if( calendarView.selectedMonth !== undefined){
                selectedMonth = calendarView.selectedMonth;
            }
            config.selectedMonth = selectedMonth;
            socket.emit(calendarView.socketEvents.getCalendarData, {config:config});
            return self;
        },
        getData_done: function(calendarView, data){
            var self = this;

            if(data.success){
                //console.log(new Date() - calendarView.lastRequestTime);
                calendarView.data = {};
                calendarView.dataArr = [];
                if(data.result && data.result.data && data.result.data.length){
                    data.result.data.forEach(function(dataRow){
                        calendarView.data[dataRow.id] = dataRow;
                    });
                    calendarView.dataArr = data.result.data;
                }
                calendarView.creation.createCalendar(calendarView, data.result);

                if(data.requestId){
                    var options = calendarView.getSocket().calendarView.events[data.requestId];
                    if(options){
                        options.callback(calendarView, options.options);
                    }
                }
            }
            else{
                calendarView.notifier.showReportableErrorNotification(data.errorMessage || 'Error Getting Data');
            }
//            calendarView.container.find('.fc-button')
//                .removeClass('hidden');
//            calendarView.subModule.buttonManager.rowSelectorChanged($(this));
        }
    },
    bindEvents: function(){
        var self = this;
        return self;
    },
    openCreateFormViewManager: function(dataRowId){
        var self = this;
        self.subModule.formView.show('create',dataRowId,self.subModule.buttonManager.buttons.create);
        return self;
    },
    openFormViewManager: function(eventData){
        var self = this;
        self.subModule.formView.show( FormView.VIEW_MODE, self.data[eventData.id] ,self.subModule.buttonManager.buttons['view']);
        return self;
    },
    openEditFormViewManager: function(dataRowId){
        var self = this;
        var config ={};
        for(var key in self.data){
            var data = self.data[key];
            if(data.id == dataRowId.id){
                config = data;
                break;
            }
        }
        var obj ={};
        obj['buttonId'] = "edit";
        obj['config'] = config;
        obj['id'] = parseInt(dataRowId.id);
        self.subModule.formView.calendarDataSet(obj);
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    show: function () {
        var self = this;
        self.container.show();
        return self;
    },
    hide: function () {
        var self = this;
        self.container.hide();
        return self;
    },
    setConditionColorSetting: function (currentCondition, obj) {
        var self = this;
        switch(currentCondition.actionToTake){
            case "rowBackColor":
            case "rowForeColor":
            case "rowTextShadow":
                switch (currentCondition.actionToTake) {
                    case "rowBackColor":
                        obj['backgroundColor'] = currentCondition.colorChooser;
                        break;
                    case "rowForeColor":
                        obj['textColor'] = currentCondition.colorChooser;
                        break;
                }
                break;
        }
        return self;
    },
    formatData: function () {
        var self = this;
        var arr = [];
        var columnManager = self.subModule.columnManager;
        var colors = [
            'rgb(175, 176, 147)', 'rgb(117, 167, 225)', 'rgb(198, 153, 153)', 'rgb(131, 210, 170)',
            'rgb(123, 208, 227)', 'rgb(159, 124, 56)', 'rgb(117, 161, 107)','rgb(158, 123, 227)'
        ];
        var conditionColorSettings = self.conditionColorSettings || [];
        var allDay = true;
        if(self.startTimeColumnId){
            allDay = false;
        }
        self.dataArr.forEach(function(dataRow, dataRowIndex){
            var obj = {};

            obj['allDay']= allDay;
            obj['editable']= false;
            obj['slotEventOverlap']= false;
            obj['id'] = dataRow.id;
            obj['title'] = self.createStringFromSmartText(self.config.titleSmartText, dataRow);
            obj['description'] = self.createStringFromSmartText(self.config.descriptionSmartText, dataRow);

            if(self.config.startTimeColumnId){
                obj['start'] = moment(moment(columnManager.columns[self.config.startDateColumnId].parseEditValue(dataRow)).format('DD-MM-YYYY') + ' ' +moment(columnManager.columns[self.config.startTimeColumnId].parseEditValue(dataRow)).format('hh:mm:ss'), 'DD-MM-YYYY hh:mm:ss');
                obj['end'] = moment(moment(columnManager.columns[self.config.endDateColumnId].parseEditValue(dataRow)).format('DD-MM-YYYY') + ' ' +moment(columnManager.columns[self.config.endTimeColumnId].parseEditValue(dataRow)).format('hh:mm:ss'), 'DD-MM-YYYY hh:mm:ss');
            }
            else{
                obj['start'] = columnManager.columns[self.config.startDateColumnId].parseEditValue(dataRow);
                obj['end'] = columnManager.columns[self.config.endDateColumnId].parseEditValue(dataRow);
            }


//            obj['backgroundColor'] = colors[dataRowIndex%8];
//            obj['textColor'] = '#000';

            var currentConditions = [];
            if(conditionColorSettings.length){
                for(var conditionCount =0; conditionCount< conditionColorSettings.length; conditionCount++){
                    if(self.subModule.checkCondition(conditionColorSettings[conditionCount], dataRow)){
                        currentConditions.push(conditionColorSettings[conditionCount]);
                    }
                }
            }
            if(currentConditions.length){
                currentConditions.forEach(function(currentCondition){
                    self.setConditionColorSetting(currentCondition, obj);
                });
            }
            arr.push(obj);
        });
        return arr;
    },
    createStringFromSmartText: function(smartText, dataRow){
        var self = this;
        var str = '';
        var columnManager = self.subModule.columnManager;
        smartText.config.forEach(function(item){
            var value;
            switch(item.type){
                case 'column':
                    value = columnManager.columns[item.value].parseDisplayValue(dataRow);
                    break;
                default:
                    value = item.value;
                    break;
            }
            str += value;
        });
        return str;
    },
    getSocket: function(){
        var self = this;
        return self.erp.socket;
    },
    creation:{
        createElements: function(calendarView){
            var self = this;
            calendarView.elements = {};
            calendarView.elements.buttons = {};
            calendarView.getElement();
            var container = self.createContainer(calendarView);
            calendarView.container = container;
            return self;
        },
        createCalendar: function(calendarView, receivedData){
            var container = calendarView.container;
            if(calendarView.calendar){
                calendarView.calendar.fullCalendar('destroy');
            }
            var data = calendarView.formatData();
            var calenderContentHeight = window.innerHeight -  calendarView.subModule.elements.viewsContainer.offset().top - 200;
            calendarView.selectedMonth = receivedData.selectedMonth;
            var defaultDateStr = (receivedData.selectedMonth + 1)+ '-10' +'-'+ new Date().getFullYear();

            var viewsArr = [];
            calendarView.viewsToShow.forEach(function(item){
                switch (item){
                    case "week":
                        if(calendarView.startTimeColumnId){
                            viewsArr.push('agendaWeek')
                        }
                        else{
                            viewsArr.push('basicWeek')
                        }
                        break;
                    case "day":
                        if(calendarView.startTimeColumnId){
                            viewsArr.push('agendaDay')
                        }
                        else{
                            viewsArr.push('basicDay')
                        }
                        break;
                    default:
                        viewsArr.push(item);
                }
            });
            calendarView.calendar = container.fullCalendar({
                    height: calenderContentHeight,
                    header:{
                        left: 'prev,next today '+ viewsArr.join(','),
                        center: '',
                        right: 'title'
                    },
                    weekMode: 'liquid',
                    /*
                     minTime:'9:00am',
                     maxTime:'8:00pm',*/
                    editable: true,
//                    month: receivedData.selectedMonth,
                    defaultDate: defaultDateStr,
                    selectable: true,
                    selectHelper: true,
                    weekends: calendarView.showWeekends,
                    firstDay: calendarView.firstDay,
                    hiddenDays: calendarView.hiddenDays,
                    timeFormat:'hh:mm tt',
                    disableResizing: true,
                    timezone: "local",
                    defaultEventMinutes: 30,
                    events:data,
                    eventMouseover: function( event, jsEvent, view ) {
                        $(this).attr('title',event.description);
                    },
                    eventResize: function(event,dayDelta,minuteDelta,revertFunc) {
                        event.startTime = $.fullCalendar.formatDate( event.start,"HH:mm" );
                        event.endTime = $.fullCalendar.formatDate( event.end,"HH:mm" );
                        container.fullCalendar('updateEvent', event);
                    },
                    eventDrop: function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ) {
                        var now = new Date();
                        if(event.startData < now){
                            revertFunc()
                        }
                        event.startTime = $.fullCalendar.formatDate( event.start,"HH:mm" );
                        event.endTime = $.fullCalendar.formatDate( event.end,"HH:mm" );
                        container.fullCalendar('updateEvent', event);
                        calendarView.openEditFormViewManager(event);

                    },
                    eventClick: function(event) {
//                        self.showEvent(event, calendarView);
                        calendarView.openFormViewManager(event);
                    },
                    dayClick: function(date, jsEvent, view) {
                        if(view.name ==='month'){
                            container.fullCalendar( 'gotoDate', date );
                            if(calendarView.startTimeColumnId){
                                container.fullCalendar( 'changeView','agendaDay');
                            }
                            else{
                                container.fullCalendar( 'changeView','basicDay');
                            }
                        }
                    },
                    viewRender: function(viewObject, container){
                        calendarView.viewObject = viewObject;
                        var lastSelectedMonth =  new Date().getMonth();
                        if( calendarView.selectedMonth !== undefined){
                            lastSelectedMonth = calendarView.selectedMonth;
                        }
                        calendarView.selectedMonth = viewObject.intervalStart.month();
                        if(lastSelectedMonth != calendarView.selectedMonth){
                            calendarView.getData();
                        }
//                        calendarView.container.find('.fc-button')
//                            .addClass('button-primary');
                    }
                });
        },
        createContainer: function(calendarView){
            var self = this;
            var container = $(document.createElement('div')).attr(calendarView.constants.container);
            return container;
        }
    }
}

CalendarView.prototype.socketEvents = {
    getCalendarData: "getCalendarData",
    getCalendarDataDone: "getCalendarDataDone"
};