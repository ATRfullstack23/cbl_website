/**
 * Created by Akhil Sekharan on 12/4/13.
 */

function SubReport(config, parentObject) {
    var self = this;
    self.parentObject = parentObject;
    self.report = parentObject;
    self.erp = self.report.erp;
    self.socket = self.erp.socket;
    self.config = config;
    self.initialize();
    return self;
}

SubReport.prototype = {
    initialize: function () {
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }

        self.notifier = new Notifier({
            container: $(document.body)
        });

        self.elements = {};
        self.container = self.elements.container = $(document.createElement('div'));
        // return;

        // self.cardManager = new CardManager(self.config.cards, self);
        // self.graphManager = new GraphManager(self.config.graphs, self);
        self.listManager = new ListManager(self.config.lists, self);
        self.reportFilterManager = new ReportFilterManager(self.config.reportFilters, self);

        self.createElements();
        self.intializeSocketEventsObject();
        self._db.initialize(self);
        self.bindEvents();
        if(!self.report.isInFloatingWindow && self.erp.deviceType == ERP.DEVICE_TYPES.PC){
            self.setPositionAndSize();
        }
        if(self.hasFloatingViewMode){
            self.erp.floatingReports[self.id] = self;
        }
        return self;
    },
    intializeSocketEventsObject: function(){
        var self = this;
        self.socketEvents = $.extend({}, self.socketEvents);
        for(var key in self.socketEvents){
            self.socketEvents[key] += '_'+ self.id;
            if(self.randomId){
                self.socketEvents[key] += '_'+  self.randomId;
            }
        }
        self.forEachList(function(list){
            var listenStr = 'openListAsPdfDone_' + self.id + '_' + list.id;
            var emitStr = 'openListAsPdf_' + self.id + '_' + list.id;
            var listenKey = 'openListAsPdfDone_' + list.id;
            var emitKey = 'openListAsPdf_' + list.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        }, function(list){
            return list.enablePdfDownload && list.enablePdfDownload.enable
        })
        return self;
    },
    exportListToPdf: function(list){
        var self = this;
        console.log(this)
        self.erp.hasPdfInQueue = false;
        self.socket.emit(self.socketEvents['openListAsPdf_' + list.id])
        return self;
    },
    exportListToPdfDone: function(data){
        var self = this;
        console.log(self.erp.hasPdfInQueue)
        if(!self.erp.hasPdfInQueue){
            self.erp.hasPdfInQueue = true;
            if(data.success){
                var newWin = window.open(data.result.url, '', 'width=1000,height=500');
            }
        }
        return self
    },
    bindEvents: function () {
        var self = this;
        self.eventHandlers = {};
        self.eventHandlers[SubReport.EVENTS.notificationCountReceived] = {};

        /*self.elements.btnReorder.on('click', function(){
         if(self.isInReorderMode){
         self.setToNormalMode();
         self.elements.btnReorder.text('Reorder');
         }
         else{
         self.setToReorderMode();
         self.elements.btnReorder.text('Save');
         }
         });*/
        return self;
    },
    getPositionAndSize: function(){
        var self = this;
        var obj = {
            cards: {},
            graphs: {},
            lists: {},
            reportFilters: {}
        };
        self.forEachCard(function(card){
            obj.cards[card.id] = card.getPositionAndSize();
        });
        self.forEachList(function(list){
            obj.lists[list.id] = list.getPositionAndSize();
        });
        self.forEachGraph(function(graph){
            obj.graphs[graph.id] = graph.getPositionAndSize();
        });
        self.forEachReportFilter(function(reportFilter){
            obj.reportFilters[reportFilter.id] = reportFilter.getPositionAndSize();
        });
//        self.forEachReportFilter(function(reportFilter){
//            obj.reportFilters[reportFilter.id] = reportFilter.getPositionAndSize();
//            reportFilter.setToNormalMode();
//        });
        return obj;
    },
    setToNormalMode: function(){
        var self = this;
        self.isInReorderMode = false;
        self.savePositionAndSize();
        self.forEachCard(function(card){
            card.setToNormalMode();
        });
        self.forEachList(function(list){
            list.setToNormalMode();
        });
        self.forEachGraph(function(graph){
            graph.setToNormalMode();
        });
//        self.forEachReportFilter(function(reportFilter){
//            reportFilter.setToNormalMode();
//        });
        return self;
    },
    savePositionAndSize: function(){
        var self = this;
        var positionObj = self.getPositionAndSize();
        var str = self.id+ '_gridster_'+ self.erp.deviceType;
        self.erp.saveUserSetting(str, positionObj, function(data){
//            console.log(data)
        });
//        window.localStorage.setItem('subReportConfig_'+ self.id, JSON.stringify(positionObj) );
        return self;
    },
    loadPositionAndSize: function(){
        var self = this;
        var userSettings = self.erp.user.userDetails.settings;
        var positionObj = userSettings[self.id+ '_gridster_'+ self.erp.deviceType];
        if(!positionObj){
            positionObj = userSettings[self.id+ '_gridster_'+ ERP.DEVICE_TYPES.PC];
        }

        positionObj = self.erp.get_user_setting_value(self.id+ '_gridster_'+ ERP.DEVICE_TYPES.PC);
        return positionObj;
    },
    setPositionAndSize: function(){
        var self = this;
        var positionObj = self.loadPositionAndSize();
        if(!positionObj){
            return self;
        }
        // self.forEachCard(function(card){
        //     card.setPositionAndSize(positionObj.cards[card.id]);
        // });
        self.forEachList(function(list){
            list.setPositionAndSize(positionObj.lists[list.id]);
        });
        // self.forEachGraph(function(graph){
        //     graph.setPositionAndSize(positionObj.graphs[graph.id]);
        // });
        self.forEachReportFilter(function(reportFilter){
            reportFilter.setPositionAndSize(positionObj.reportFilters[reportFilter.id]);
        });
//        self.forEachReportFilter(function(reportFilter){
//            reportFilter.setPositionAndSize(positionObj.reportFilters[reportFilter.id]);
//        });
        return self;
    },
    setToReorderMode: function(){
        var self = this;
        self.isInReorderMode = true;
        self.container.css('min-height', (window.innerHeight-100)+'px');
        // self.forEachCard(function(card){
        //     card.setToReorderMode();
        // });
        self.forEachList(function(list){
            list.setToReorderMode();
        });
        // self.forEachGraph(function(graph){
        //     graph.setToReorderMode();
        // });
        self.forEachReportFilter(function(graph){
            graph.setToReorderMode();
        });
//        self.forEachReportFilter(function(reportFilter){
//            reportFilter.setToReorderMode();
//        });
        return self;
    },
    createElements: function () {
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    forEachCard: function(eachFunction, filterFunction){
        var self = this;
        self.cardManager.forEachCard(eachFunction, filterFunction);
        return self;
    },
    forEachList: function(eachFunction, filterFunction){
        var self = this;
        self.listManager.forEachList(eachFunction, filterFunction);
        return self;
    },
    forEachGraph: function(eachFunction, filterFunction){
        var self = this;
        self.graphManager.forEachGraph(eachFunction, filterFunction);
        return self;
    },
    forEachReportFilter: function(eachFunction, filterFunction){
        var self = this;
        self.reportFilterManager.forEachReportFilter(eachFunction, filterFunction);
        return self;
    },
    resetAllItems: function(){
        var self = this;
        // self.cardManager.resetCardValues();
        // self.graphManager.resetGraphValues();
        self.listManager.resetListValues();
        // self.cardManager.resetCardValues();
        return self;
    },
    refreshAllItems: function(){
        var self = this;
        if(!self.isInFloatingWindow && !self.gridster && self.erp.deviceType === ERP.DEVICE_TYPES.PC){
            self.setPositionAndSize();
            // self.gridster = self.elements.ulContainer.gridster(
            //     {
            //         widget_margins: [5, 5],
            //         widget_base_dimensions: [200, 100],
            //         avoid_overlapped_widgets: true,
            //         resize: {
            //             enabled: true,
            //             axes: ['x', 'y', 'both'],
            //             max_size: [Infinity, Infinity],
            //             stop: function(event, ui, element){
            //                 var report = self.report;
            //                 /*report.getSelectedSubReport().savePositionAndSize();*/
            //                 self.savePositionAndSize();
            //                 //var subReport =  report.getSelectedSubReport();
            //                 var subReport =  self;
            //                 if(subReport.graphManager.graphs){
            //                     if(element.hasClass('graph-container')){
            //                         var graphId = element.attr('id');
            //                         setTimeout(function(){
            //                             subReport.graphManager.graphs[graphId]
            //                                 .redraw();
            //                         }, 500);
            //                     }
            //                 }
            //                 else{
            //                     var report = self.report;
            //                     report.getSelectedSubReport().savePositionAndSize();
            //                 }
            //             }
            //         },
            //         draggable:{
            //             enabled: false,
            //             handle: '.divHandle',
            //             axes: ['x', 'y', 'both'],
            //             stop: function(event, ui){
            //                 self.savePositionAndSize();
            //             }
            //         }
            //     });
        }
        self.refreshItemsDataFromServer(true);
        //self.socket.emit(self.socketEvents.getAllReports, {});
        //self.resetAllItems();
        return self;
    },
    doSearch: function(parentReportFilter){
        var self = this;
        self.refreshItemsDataFromServer(parentReportFilter.childReportFilters && parentReportFilter.childReportFilters.length > 0, parentReportFilter);
    },
    clearSearch: function(){
        var self = this;
        self.refreshItemsDataFromServer(false);
    },

    refreshItemsDataFromServer: function(getReportFilterData, parentReportFilter){
        var self = this;

        self.forEachList(function(list){
            list.refreshDataFromServer(parentReportFilter);
        });
        // self.forEachCard(function(card){
        //     card.refreshDataFromServer(parentReportFilter);
        // });
        // self.forEachGraph(function(graph){
        //     graph.refreshDataFromServer(parentReportFilter);
        // });
        if(getReportFilterData){
            self.forEachReportFilter(function(reportFilter){
                reportFilter.refreshDataFromServer(parentReportFilter);
            });
        }


        return self;
    },


    handleKeyDown: function(keyCode){
        var self = this;
        return self.buttonManager.handleKeyDown(keyCode);
    },
    show      : function () {
        var self = this;
        self.container.removeClass('hidden');
        return self;
    },
    hide      : function () {
        var self = this;
        self.container.addClass('hidden');
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    getData: function(){
        var self = this;
        self._db.getData(self);
        return self;
    },
    getSocket: function(){
        var self = this;
        return self.erp.socket;
    },
    forEachColumn: function(eachFunction, filterFunction){
        var self = this;
        self.columnManager.forEachColumn(eachFunction, filterFunction);
        return self;
    },
    getNotificationCount: function(){
        var self = this;
        self._db.getNotificationCount(self);
        return self;
    },
    _creation : {
        _tableMain: '<table id="table_main">'+
        '<tr id="tr_controls">'+
        '   <td>'+
        '   </td>'+
        '</tr>'+
        '<tr id="tr_grid">'+
        '   <td>'+
        '   </td>'+
        '</tr>'+
        '</table>',
        createContainer: function(subReport){
            var div = $(document.createElement('div')).attr({id: subReport.id, class: 'subReport-container hidden'});
            return div;
        },
        createTable: function(subReport){

        },
        createElements: function(subReport){
            var self = this;
            var elements = {};

            var container = self.createContainer(subReport);
            elements.container = container;
            var controlContainer = $(document.createElement('div')).appendTo(container);

            if(subReport.reportFilterManager.noOfChildren > 0){
                container.append(subReport.reportFilterManager.container);
            }

            var ulContainer = $(document.createElement('ul')).addClass('controlContainer').appendTo(container);
            elements.controlContainer= controlContainer;
            elements.ulContainer = ulContainer;

            var btnReOrder = $(document.createElement('button'))
                .attr({id: subReport.id+'_reorder', class: 'btn-subReportReOrder'})
                .text('Reorder');//.appendTo(container);
            elements.btnReorder = btnReOrder;
//            var table = $(document.createElement('table')).attr({class: 'hundred-percent-x'});
//            var trFilters = $(document.createElement('tr')).appendTo(table);
//            var tdFilters = $(document.createElement('td')).appendTo(trFilters);
//            var trCards = $(document.createElement('tr')).appendTo(table);
//            var tdCards = $(document.createElement('td')).appendTo(trCards);
//            var trGraphs = $(document.createElement('tr')).appendTo(table);
//            var tdGraphs = $(document.createElement('td')).appendTo(trGraphs);
//            var trLists = $(document.createElement('tr')).appendTo(table);
//            var tdLists = $(document.createElement('td')).appendTo(trLists);
//
//            tdFilters.append(subReport.reportFilterManager.getElement());
//            tdCards.append(subReport.cardManager.getElement());
//            tdGraphs.append(subReport.graphManager.getElement());
//            tdGraphs.append(subReport.listManager.getElement());
//            subReport.forEachReportFilter(function(reportFilter){
//                controlContainer.append(reportFilter.getElement());
//            });


            // subReport.forEachCard(function(card){
            //     ulContainer.append(card.getElement());
            // });
            subReport.forEachList(function(list){
                ulContainer.append(list.getElement());
            });
            // subReport.forEachGraph(function(graph){
            //     ulContainer.append(graph.getElement());
            // });

//            container.append(table);
            subReport.elements = elements;
            subReport.container = container;
            return container;
        }
    },
    _db:{
        initialize: function(subReport){
            var socket = subReport.getSocket();
            socket.on(subReport.socketEvents.getNotificationCountDone, function(data){
                subReport._db.getNotificationCount_done(subReport, data);
            });
            subReport.forEachList(function(list){
                var listenStr = subReport.socketEvents['openListAsPdfDone_' + list.id];
                socket.on(listenStr, function(data){
                    subReport.exportListToPdfDone(data)
                })
            }, function(list){
                return list.enablePdfDownload && list.enablePdfDownload.enable;
            })
        },
        getNotificationCount: function(subReport){
            var self = this;
            var socket = subReport.getSocket();
            socket.emit(subReport.socketEvents.getNotificationCount, {});
            return self;
        },
        getNotificationCount_done: function(subReport, data){
            var self = this;
            if(data.success){
                subReport.setNotificationCount(data.result);
            }
            else{
                console.log(data);
            }
            return self;
        }
    },
    setNotificationCount: function(count){
        var self = this;
        self.curretNotificationCount = count;
        self.executeEventHandlers(SubReport.EVENTS.notificationCountReceived, [count]);
        return self;
    },
    registerChildWindow: function(column, dataRow, registerChildWindowCallBack){
        var self = this;
        var socket = self.getSocket();
        var data = {
            config: column.typeSpecific.dataSource
        };
        data.config.dataRow = dataRow;


        socket.emit('registerChildWindow', data);
        socket.once('registerChildWindowDone', function(data){
            registerChildWindowCallBack(data);
        });
        return self;
    },
    updateChildWindowParentFilterCondition: function(childWindow, dataRow){
        var self = this;
        var childReport = childWindow.childReport;
        var data = {config: {dataRow: dataRow}};
        data.config.reportId = childReport.id;
        data.config.randomId = childReport.randomId;
        var socket = self.getSocket();

//        childReport.updateChildWindowParentFilterCondition();
        childReport.parentDataRow = childReport.config.parentDataRow = dataRow;
//        childReport.parentFilterCondition= childReport.config.parentFilterCondition = column.typeSpecific.dataSource.filterConditions[0];

        childReport.forEachSubReport(function(subReport){
            subReport.parentDataRow = subReport.config.parentDataRow = dataRow;
        });

        socket.emit('updateChildWindowParentFilterCondition', data);
        return self;
    },
    openChildWindow: function(column, dataRow){
        var self = this;
        if(self.childWindows[column.id]){
            self.updateChildWindowParentFilterCondition(self.childWindows[column.id], dataRow);
            self.childWindows[column.id].show();
            return self;
        }
        self.registerChildWindow(column, dataRow, function(result){
            if(result.success){
                var childWindow = self.createChildWindow(column, result.randomId, dataRow);
                childWindow.show();
            }
            else{
//                childWindow.hide();
                self.notifier.showReportableErrorNotification('Error opening child window');
            }
        });
        return self;
    },
    createChildWindow: function(column, randomId, dataRow){
        var self = this;
        var dataSource = column.typeSpecific.dataSource;
        var reportConfig = $.extend({}, self.erp.reports[dataSource.reportId].config);

        reportConfig.randomId = randomId;
        reportConfig.parentDataRow = dataRow;
        reportConfig.parentColumn = column;
        reportConfig.parentFilterCondition = column.typeSpecific.dataSource.filterConditions[0];
        reportConfig.defaultSubReport = column.typeSpecific.dataSource.subReportId;
        reportConfig.isInChildWindow = true;
        var childReport = new Report( reportConfig, self.erp );

        childReport.forEachSubReport(function(subReport){
            subReport.parentDataRow = subReport.config.parentDataRow = dataRow;
            subReport.isInChildWindow = true;
        });
        var childWindow = new ChildWindow({id: column.id, column: column, dataRow: dataRow, childReport: childReport,
            onClose: function(){
                //delete self.childWindows[childWindow.id];
            },
            onShow: function(){
                childReport.show().setSelectedSubReport(childReport.getSelectedSubReport(), {fromTrigger: true});
            }
        }, self);
        self.childWindows[childWindow.id] = childWindow;
        childWindow.hide();
        childReport.parentWindow = childWindow;
        childReport.setSelectedSubReport(dataSource.subReportId);
        $(document.body).append(childWindow.getElement());
        return childWindow;
    },
    executeEventHandlers: function(eventType, argumentsToPass){
        var self = this;
        var events = self.eventHandlers[eventType];
        if(Object.keys(events).length){
            for(var key in events){
                events[key].handler.apply(self, argumentsToPass || []);
            }
        }
        return self;
    },
    on: function(eventStr, options, handler){
        var self = this;
        var eventType = eventStr.split('.')[0];
        var eventId = eventStr.split('.')[1] || crypto.getRandomValues(new Uint16Array(1))[0];
        self.eventHandlers[eventType][eventId] = {
            options: options || {},
            handler: arguments[arguments.length-1]
        };
        return self;
    },
    _events   : {
    },
    _ui       : {
    }
};

SubReport.EVENTS = {
    notificationCountReceived: "notificationCountReceived"
}

SubReport.prototype.socketEvents = {
    getAllReports: "getAllReports",
    getAllReportsDone: "getAllReportsDone",
    getNotificationCount: "getNotificationCount",
    getNotificationCountDone: "getNotificationCountDone"
};