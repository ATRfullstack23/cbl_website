/**
 * Created by Akhil Sekharan on 12/4/13.
 */

function SubModule(config, parentObject) {
    var self = this;
    self.parentObject = parentObject;
    self.module = parentObject;
    self.erp = self.module.erp;
    self.socket = self.erp.socket;
    self.config = config;
    // self.initialize();

//For Debugging
//    window.notifier = self.notifier;
//    window.subModule = self;
//    window.formView = self.formView;
    return self;
}

SubModule.prototype = {
    initialize: async function () {
        var self = this;

         // temp aki remove later :
        self.config.hasThumbnailViewMode = true;

        for(var key in self.config){
            self[key] = self.config[key];
        }
        if(self.formViewOnlyMode){
            self.hasGridViewMode = false;
            self.hasThumbnailViewMode = false;
            self.hasMasterDetailViewMode = false;
            self.hasCalenderViewMode = false;
        }
        self.dynamicCallBacks = {};

        if(!self.defaultDisplayMode){
            if(self.hasGridViewMode){
                self.defaultDisplayMode = SubModule.DISPLAY_MODES.GRID_VIEW;
            }
            else if(self.hasMasterDetailViewMode){
                self.defaultDisplayMode = SubModule.DISPLAY_MODES.MASTER_DETAIL_VIEW;
            }
            else if(self.hasThumbnailViewMode){
                self.defaultDisplayMode = SubModule.DISPLAY_MODES.THUMBNAIL_VIEW;
                this.cardViewHelper = null; // will be populated later
            }
            else if(self.hasCalendarViewMode){
                self.defaultDisplayMode = SubModule.DISPLAY_MODES.CALENDAR_VIEW;
            }
            else if(self.hasFormViewMode){
                self.defaultDisplayMode = SubModule.DISPLAY_MODES.FORM_VIEW;
            }
        }

        if(self.module.visibilitySettings.subModules){
            self.visibilitySettings = self.module.visibilitySettings.subModules[self.id] || {};
        }
        else{
            self.visibilitySettings = {};
        }

        self.notifier = new Notifier({
            container: $(document.body),
            subModule: self,
            bugReportManager: self.erp.bugReportManager
        });
        self.filterManager = new FilterManager(self.config.filters, self);
        if(self.viewOnlyMode){
            self.buttonManager = new ButtonManager({}, self);
        }
        else{
            self.buttonManager = new ButtonManager(self.config.buttons, self);
        }


        self.columnManager = new ColumnManager(self.config.columns, self);
        if(self.hasGridViewMode){
            self.grid = new Grid(self.config.gridView, self);
            self.common_pager = self.grid.pager;
        }

        if(self.hasMasterDetailViewMode){
            // hasMasterDetailViewMode
            self.config.master_detail_view_config = self.master_detail_view_config = {
                "display_type": "invoice",
            };
        }

        if(self.hasThumbnailViewMode){
            // self.hasThumbnailViewMode = false;
            self.hasCardViewMode = true;
            self.defaultDisplayMode = SubModule.DISPLAY_MODES.CARD_VIEW;
            // aki temp remove later
            // self.cardViewConfig  = self.config.cardViewConfig = {
            //     "display_type": "card With Image",
            //     "orientation": "landscape",
            //     "buttons": [
            //         {
            //             "display_name": "Edit",
            //             "type": "edit_in_view_mode"
            //         }
            //     ],
            //     "header_title_column": {
            //         "type": "lookUpDropDownList",
            //         "id": "employee_profile_id",
            //     },
            //     "header_subtitle_column": {
            //         "type": "choice",
            //         "id": "leave_type_id",
            //     },
            //     "columns": []
            // };
            // self.thumbNailView = new CardViewHelper(self.config.thumbNailView||{}, self);
            // self.thumbNailView = new ThumbNailView(self.config.thumbNailView||{}, self);
        }
        if(self.hasCalendarViewMode){
            self.calendarView = new CalendarView(self.config.calendarView || {}, self);
        }
        await self.createElements();

        if(self.hasFormViewMode){
            var formViewConfig = JSON.parse(JSON.stringify(self.config.formView));
            if(!formViewConfig){
                formViewConfig = {
                    create: {
                        rows: 1,
                        cols: 2,
                        header: {
                            text: "Default Text"
                        }
                    }
                }
            }
            if(self.type == 'singleRow'){
                formViewConfig.displayMode = FormView.DISPLAY_MODES.INLINE;
            }
            formViewConfig.onShowEditMode = function(formView){
                self.erp.disableNavigation();
            };
            formViewConfig.onShowViewMode = function(formView){
                self.erp.enableNavigation();
            };
            formViewConfig.onHide = function(formView){
                self.erp.enableNavigation();
                if(self.formViewOnlyMode){
                    self.module.parentWindow.close();
                }
            };
            self.formViewConfig = formViewConfig;
            self.formView = new FormView(formViewConfig, self);
        }


        self.childWindows = {};
        self.childSubReports = {};
        self.intializeSocketEventsObject();
        self._db.initialize(self);
        self.bindEvents();
//        self.setDefaultDisplayMode();

        self.buttonManager.initializeContextMenu();
        // self.columnManager.createHTMLEditor()
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

        self.forEachButton(function(button){
            var listenStr = 'triggerAnotherButtonDone_'+ self.id +'_'+ button.id;
            var emitStr = 'triggerAnotherButton_'+ self.id +'_'+ button.id;

            var listenKey = 'triggerAnotherButtonDone_'+ button.id;
            var emitKey = 'triggerAnotherButton_'+ button.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(button){
            var ret = false;
            if(button.type == Button.BUTTON_TYPES.TRIGGER_ANOTHER_BUTTON){
                ret = true;
            }
            return ret;
        });

        self.forEachButton(function(button){
            var listenStr = 'execSqlDone_'+ self.id +'_'+ button.id;
            var emitStr = 'execSql_'+ self.id +'_'+ button.id;
            if(self.randomId){
                listenStr += '_'+  self.randomId;
                emitStr += '_'+  self.randomId;
            }
            var listenKey = 'execSqlDone_'+ button.id;
            var emitKey = 'execSql_'+ button.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(button){
            var ret = false;
            if(button.type == Button.BUTTON_TYPES.EXEC_SQL){
                ret = true;
            }
            return ret;
        });
        self.forEachButton(function(button){
            var listenStr = 'getConfirmationQuoteDone_'+ self.id +'_'+ button.id;
            var emitStr = 'getConfirmationQuote_'+ self.id +'_'+ button.id;
            if(self.randomId){
                listenStr += '_'+  self.randomId;
                emitStr += '_'+  self.randomId;
            }
            var listenKey = 'getConfirmationQuoteDone_'+ button.id;
            var emitKey = 'getConfirmationQuote_'+ button.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(button){
            var ret = false;
            if(button.confirmationSql && button.confirmationSql.isEnabled){
                ret = true;
            }
            return ret;
        });
        self.forEachButton(function(button){
            var listenStr = 'emailDone_'+ self.id +'_'+ button.id;
            var emitStr = 'email_'+ self.id +'_'+ button.id;
            if(self.randomId){
                listenStr += '_'+  self.randomId;
                emitStr += '_'+  self.randomId;
            }
            var listenKey = 'emailDone_'+ button.id;
            var emitKey = 'email_'+ button.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(button){
            var ret = false;
            if(button.type == Button.BUTTON_TYPES.EMAIL){
                ret = true;
            }
            return ret;
        });
        self.forEachButton(function(button){
            var listenStr = 'printDone_'+ self.id +'_'+ button.id;
            var emitStr = 'print_'+ self.id +'_'+ button.id;
            if(self.randomId){
                listenStr += '_'+  self.randomId;
                emitStr += '_'+  self.randomId;
            }
            var listenKey = 'printDone_'+ button.id;
            var emitKey = 'print_'+ button.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(button){
            var ret = false;
            if(button.type == Button.BUTTON_TYPES.PRINT){
                ret = true;
            }
            return ret;
        });
        self.forEachButton(function(button){
            var listenStr = 'exportToExcelDone_'+ self.id +'_'+ button.id;
            var emitStr = 'exportToExcel_'+ self.id +'_'+ button.id;
            if(self.randomId){
                listenStr += '_'+  self.randomId;
                emitStr += '_'+  self.randomId;
            }
            var listenKey = 'exportToExcelDone_'+ button.id;
            var emitKey = 'exportToExcel_'+ button.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(button){
            var ret = false;
            if(button.type == Button.BUTTON_TYPES.EXPORT_TO_EXCEL){
                ret = true;
            }
            return ret;
        });
        self.forEachButton(function(button){
            var listenStr = 'smsDone_'+ self.id +'_'+ button.id;
            var emitStr = 'sms_'+ self.id +'_'+ button.id;
            if(self.randomId){
                listenStr += '_'+  self.randomId;
                emitStr += '_'+  self.randomId;
            }
            var listenKey = 'smsDone_'+ button.id;
            var emitKey = 'sms_'+ button.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(button){
            var ret = false;
            if(button.type == Button.BUTTON_TYPES.SMS){
                ret = true;
            }
            return ret;
        });
        self.forEachColumn(function(column){
            var listenStr = 'editInDisplayDone_'+ self.id +'_'+ column.id;
            var emitStr = 'editInDisplay_'+ self.id +'_'+ column.id;
            if(self.randomId){
                listenStr += '_'+  self.randomId;
                emitStr += '_'+  self.randomId;
            }
            var listenKey = 'editInDisplayDone_'+ column.id;
            var emitKey = 'editInDisplay_'+ column.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(column){
            var ret = false;
            if(column.typeSpecific && column.typeSpecific.editInDisplay){
                ret = true;
            }
            return ret;
        });
        self.forEachColumn(function(column){
            var listenStr = 'showSuggestionsFromPreviousEntriesDone_'+ self.id +'_'+ column.id;
            var emitStr = 'showSuggestionsFromPreviousEntries_'+ self.id +'_'+ column.id;
            if(self.randomId){
                listenStr += '_'+  self.randomId;
                emitStr += '_'+  self.randomId;
            }
            var listenKey = 'showSuggestionsFromPreviousEntriesDone_'+ column.id;
            var emitKey = 'showSuggestionsFromPreviousEntries_'+ column.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(column){
            var ret = false;
            if(column.typeSpecific && column.typeSpecific.showSuggestionsFromPreviousEntries){
                ret = true;
            }
            return ret;
        });

        self.forEachButton(function(button){
            if((button.backgroundTasks.emailNotification1 && button.backgroundTasks.emailNotification1.isEnabled) ||  ( button.backgroundTasks.emailNotification2 && button.backgroundTasks.emailNotification2.isEnabled) || (button.backgroundTasks.emailNotification3 && button.backgroundTasks.emailNotification3.isEnabled)){
                var listenStr = 'backgroundTasksEmailDone_'+ self.id +'_'+ button.id;
                if(self.randomId){
                    listenStr += '_'+  self.randomId;
                }
                var listenKey = 'backgroundTasksEmailDone_'+ button.id;
                self.socketEvents[listenKey] = listenStr;
            }
            if((button.backgroundTasks.smsNotification1 && button.backgroundTasks.smsNotification1.isEnabled) ||  ( button.backgroundTasks.smsNotification2 && button.backgroundTasks.smsNotification2.isEnabled) || (button.backgroundTasks.smsNotification3 && button.backgroundTasks.smsNotification3.isEnabled)){
                var listenStr = 'backgroundTasksSMSDone_'+ self.id +'_'+ button.id;
                if(self.randomId){
                    listenStr += '_'+  self.randomId;
                }
                var listenKey = 'backgroundTasksSMSDone_'+ button.id;
                self.socketEvents[listenKey] = listenStr;
            }
            if(button.backgroundTasks.printing.isEnabled){
                var listenStr = 'backgroundTasksPrintingDone_'+ self.id +'_'+ button.id;
                if(self.randomId){
                    listenStr += '_'+  self.randomId;
                }
                var listenKey = 'backgroundTasksPrintingDone_'+ button.id;
                self.socketEvents[listenKey] = listenStr;
            }

        },function(button){
            var ret = false;
            if(button.backgroundTasks && button.backgroundTasks.isEnabled){
                ret = true;
            }
            return ret;
        });

        return self;
    },

    createElements: async function () {
        var self = this;
        await self._creation.createElements(self);
        return self;
    },
////////////////////////////////////yathi//////////////////////////////////////////
    addChildSubReport: function(subReport){
        var self = this;

        self.childSubReports[subReport.id] = {
            reportId: subReport.parentObject.id,
            subReportId: subReport.id
        };

        return self;
    },
    initializeEasyAccessSubReport: function(reportId,subReportId){
        var self = this;

        var subReport = self.erp.reports[reportId].subReports[subReportId];

        var reportConfig =  JSON.parse( JSON.stringify(self.erp.config.reports[subReport.parentObject.id]));
        reportConfig.disableNavigation = true;
        reportConfig.isInFloatingWindow = true;
        reportConfig.erp = self.erp;

        var subReportConfig = JSON.parse(JSON.stringify(self.erp.config.reports[subReport.parentObject.id].subReports[subReport.id]));
        subReportConfig.disableNavigation = true;

        self.childSubReports[subReport.id] = new SubReport(subReportConfig,reportConfig);
        self.elements.childSubReportsContainer.append(self.childSubReports[subReport.id].container);
        return self;
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////
    setDefaultDisplayMode: function(){
        var self = this;
        if(self.erp.deviceType === ERP.DEVICE_TYPES.PC){
            self.setDisplayMode(self.defaultDisplayMode);
        }
        else{
            self.deviceOrientationChanged(self.erp.deviceOrientation);
        }
        self.filterManager.initializeChosen();
        return self;
    },
    deviceOrientationChanged: function(deviceOrientation){
        var self = this;
        switch(deviceOrientation){
            case ERP.DEVICE_ORIENTATIONS.PORTRAIT:
                self.deviceOrientationChangedToPortrait();
                break;
            case ERP.DEVICE_ORIENTATIONS.LANDSCAPE:
                self.deviceOrientationChangedToLandscape();
                break;
        }
        return self;
    },
    deviceOrientationChangedToPortrait: function(){
        var self = this;
        if(self.hasThumbnailViewMode){
            self.setDisplayMode(SubModule.DISPLAY_MODES.THUMBNAIL_VIEW);
        }
        else if (self.hasGridViewMode){
            self.setDisplayMode(SubModule.DISPLAY_MODES.GRID_VIEW);
        }
        else if (self.hasCalendarViewMode){
            self.setDisplayMode(SubModule.DISPLAY_MODES.CALENDAR_VIEW);
        }
        return self;
    },
    deviceOrientationChangedToLandscape: function(){
        var self = this;
        if(self.hasGridViewMode){
            self.setDisplayMode(SubModule.DISPLAY_MODES.GRID_VIEW);
        }
        else if (self.hasCalendarViewMode){
            self.setDisplayMode(SubModule.DISPLAY_MODES.CALENDAR_VIEW);
        }
        return self;
    },
    hideAllViews: function(){
        var self = this;
        self.elements.viewsContainer.children().addClass('hidden');
        if(self.cardViewHelper){
            self.cardViewHelper.hide();
        }
        return self;
    },
    clearReceivedData: function(){
        var self = this;
        switch (self.displayMode){
            case SubModule.DISPLAY_MODES.GRID_VIEW:
                self.grid.showDataHidingAnimation();
                break;
        }
        return self;
    },
    validateNewDisplayMode: function(newDisplayMode){
        var self = this;
        var ret = true;
        switch (newDisplayMode){
            case SubModule.DISPLAY_MODES.DIRECTCREATE_VIEW:
                var button = self.buttonManager.getDefaultButton('create');
                if(!button){
                    ret = false;
                }
                else{
                    if(button.disabled){
                        ret = false;
                    }
                }
                break;
        }
        return ret;
    },
    setDisplayMode: function(newDisplayMode, withResetOfPager){
        var self = this;

        if(!self.validateNewDisplayMode(newDisplayMode)){
            return false;
        }


        if(!newDisplayMode){
            if(self.displayMode){
                newDisplayMode = self.displayMode;
            }
            else{
                self.setDefaultDisplayMode();
                return;
            }
        }

        if(self.dynamicCallBacks.onBeforeSetDisplayMode){
            var ret = self.dynamicCallBacks.onBeforeSetDisplayMode(self, newDisplayMode);
            if(ret === false){
                return false;
            }
        }

        self.hideAllViews();

        self.filterManager.elements.tabFilterPanel.show();
        switch (newDisplayMode){
            case SubModule.DISPLAY_MODES.GRID_VIEW:
                self.setDisplayModeToGridView(withResetOfPager);
                if(self.formView.formViewType == 'directCreate'){
                    self.formView.cancel();
                }
                break;
            case SubModule.DISPLAY_MODES.CARD_VIEW:
                self.setDisplayModeToCardView();
                break;
            case SubModule.DISPLAY_MODES.FORM_VIEW:
                self.setDisplayModeToFormView();
                break;
            case SubModule.DISPLAY_MODES.DIRECTCREATE_VIEW:
                self.setDisplayModeToDirectCreateView();
                break;
            case SubModule.DISPLAY_MODES.CALENDAR_VIEW:
                self.setDisplayModeToCalendarView();
                if(self.formView.formViewType == 'directCreate'){
                    self.formView.cancel();
                }
                break;
        }
        self.buttonManager.setDisplayModeIconSelected(newDisplayMode);
        self.displayMode = newDisplayMode;

        if(!self.isInQuickViewModeChildWindow){
            // if(self.erp.isSocketConnected){
                self.filterManager.getAllFilterDataFromServer();
            // }
        }


        return self;
    },
    setDisplayModeToGridView: function(withResetOfPager){
        var self = this;
        if(withResetOfPager){
            self.grid.pager.selectedPageIndex = 1;
            self.grid.sortCondition.sortColumn = self.columnManager.columns.id;
            self.grid.sortCondition.sortType = 'DESC';
        }
        self.grid.container.removeClass('hidden');
        self.grid.getData();
        return self;
    },
    setDisplayModeToCardView: function(){
        var self = this;
        self.cardViewHelper.show();
        self.cardViewHelper.get_data();
        // self.thumbNailView.container.removeClass('hidden');
        // self.thumbNailView.getData();
        return self;
    },

    setDisplayModeToDirectCreateView: function(){
        var self = this;
//        self.filterManager.container.hide();
        self.elements.viewsContainer.append(self.formView.container);
        self.filterManager.elements.tabFilterPanel.hide();
        if(self.type == 'singleRow'){
            self.formView.show('create', {id: 1000001});
        }
        else{
            var button = self.buttonManager.getButtonObjectFromType('create');
            //self.module.parentWindow.parentItem
            self.formView.show('create', self.formViewData, button, {}, 'directCreate');
        }
        return self;
    },
    setDisplayModeToFormView: function(){
        var self = this;
        if(self.type == 'singleRow'){
            self.formView.show(FormView.VIEW_MODE, {id: 1000001});
        }
        else{
            var button = self.buttonManager.getButtonObjectFromType(self.formViewMode);
            //self.module.parentWindow.parentItem
            self.formView.show(self.formViewMode, self.formViewData, button);
        }
        return self;
    },
    setDisplayModeToCalendarView: function(){
        var self = this;
        self.calendarView.container.removeClass('hidden');
        self.calendarView.getData();
        return self;
    },
    handleKeyDown: function(keyCode){
        var self = this;
        return self.buttonManager.handleKeyDown(keyCode);
    },
    bindEvents: function () {
        var self = this;
        self.eventHandlers = {};
        self.eventHandlers[SubModule.EVENTS.onBeforeSetDisplayMode] = {};
        self.bindSocketFunctionsForTriggerButtons();

//////////////////////////////yathi///////////////////////////////////////////////////////////
        self.elements.childSubReportsContainerCloseButton.on('click',function(){
            self.config.easyAccessReportView = false;
            $(document.body).removeClass('easyAccessReportView');
            self.container.children('table').removeClass('tableAnimationForChildSubReport');

            self.elements.childSubReportsContainer
                //.css({'display':'none'})
                .removeClass('childSubReportsContainerAnimation');
            setTimeout(function() {
                self.elements.childSubReportsContainer.css({'display':'none'});

            },500);
            self.buttonManager.currentSelectedEasyAccessReport.hide();
        });
///////////////////////////////////////////////////////////////////////////////////////////////
        return self;
    },
    bindSocketFunctionsForTriggerButtons: function(){
        var self = this;
        self.forEachButton(function(button){
            self.getSocket().on('onSaveTriggerButtonConfirmation_'+self.id+'_'+button.id, function(){
                self.onSaveTriggerButtonConfirmation(button);
            })
        }, function(button){
            var ret = false;
            if(button.backgroundTasks && button.backgroundTasks.hasOnSaveValidationConfirmation && button.backgroundTasks.hasOnSaveValidationConfirmation.isEnabled){
                ret = true;
            }
            return ret;
        });
        return self
    },
    onSaveTriggerButtonConfirmation: function(button){
        var self = this;
        var confirmationMessage = button.backgroundTasks.hasOnSaveValidationConfirmation.hasOnSaveValidationConfirmation;
        var buttonElement = button.getElement(Button.BUTTON_MODES.GRID);
        var responseData = {};
        var emitFunction = function(responseData){
            self.getSocket().emit('onSaveTriggerButtonConfirmationDone_'+self.id+'_'+button.id, responseData);
        }
        buttonElement.dialog({
            resizable: false,
            height:140,
            width: 350,
            "z-index": 10004,
            modal: true,
            "position": { at: "middle top"},
            title: confirmationMessage,
            content: confirmationMessage,
            buttons: {
                "YES": function() {
                    responseData.success = true;
                    $( this ).dialog( "close" );
                    emitFunction(responseData);

                },
                "NO": function() {
                    responseData.success = false;
                    $( this ).dialog( "close" );
                    emitFunction(responseData);
                }
            }
        });
        $('.ui-dialog').find('.ui-dialog-content').hide(0)
        $('.ui-dialog').css({"z-index": 100004});
        return self;
    },
    show      : function () {
        var self = this;
        self.container.removeClass('hidden');
        self.container.css('--submodule_container_width', self.container.width() + 'px');
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
//        switch (type){
//            case "gridView":
//                self.grid.getData();
//                self.thumbNailView.getData();
//                break;
//        }
        self.setDisplayMode();
        return self;
    },
    getSocket: function(){
        var self = this;
        return self.erp.socket;
    },
    lockRow: function(lockRowCallBack){
        var self = this;
        self.lockRowCallBack = lockRowCallBack;
        var config = {
            selectedRowId: self.formView.data.edit.id
        }
        self.do_ajax_request('lockRow', config, function(ajax_err, responseObj){
            self.lockRow_done(responseObj);
        });

        // self.socket.emit(self.socketEvents.lockRow, config);
        return self;
    },
    lockRow_done: function(responseData){
        var self = this;
        self.lockRowCallBack(responseData.result)
        return self;
    },
    unlockRow: function(afterSavingData){
        var self = this;
        var config = {
            selectedRowId: self.formView.data.edit.id
        }
        if(afterSavingData){
            config.afterSavingData = true;
        }
        self.socket.emit(self.socketEvents.unlockRow, config);
        return self;
    },
    unlockRow_Done: function(responseData){
        var self = this;
        if(responseData.afterSavingData){
            self.formView.refreshCurrentFormData(responseData.data)
        }
        return self;
    },
    get_all_filters_arr: function(){
        const self = this;
        return self.filterManager.get_all_filters_arr();
    },
    get_filter_from_id: function(filter_id){
        const self = this;
        return self.filterManager.get_filter_from_id(filter_id);
    },
    forEachButton: function(eachFunction, filterFunction){
        var self = this;
        self.buttonManager.forEachButton(eachFunction, filterFunction);
        return self;
    },
    get_column_from_id: function(column_id){
        const self = this;
        return self.columnManager.get_column_from_id(column_id);
    },
    get_all_columns_as_array: function(options){
        const self = this;
        return self.columnManager.get_all_columns_as_array(options);
    },
    forEachColumn: function(eachFunction, filterFunction){
        var self = this;
        self.columnManager.forEachColumn(eachFunction, filterFunction);
        return self;
    },
    setLookUpLabelData: function(data){
        var self = this;
        self.lookUpLabelData = data;
        switch(self.displayMode){
            case SubModule.DISPLAY_MODES.GRID_VIEW:
                self.grid.setLookUpLabelData(data);
                break;
        }
        return self;
    },
    getAllLookUpLabelDataForGetOneRowData: function(data){
        var self = this;
        self.formView.setAllLookUpLabelDataForGetOneRowData(data);
        return self;
    },
    getToolTipData: function(column, dataRow){
        var self = this;
        self._db.getToolTipData(self, column, dataRow);
        return self;
    },
    updateEditInDisplayColumn: function(column, value, dataRow){
        var self = this;
        self._db.saveEditInDisplayColumn(self, column, value, dataRow);
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
        createContainer: function(subModule){
            var div = $(document.createElement('div')).attr({id: subModule.id, class: 'subModule-container hidden'});
            return div;
        },
        createTable: function(subModule){

        },
        createElements: async function (subModule) {
            var self = this;
            var elements = {};

            await subModule.module.add_submodule_instance_for_reference(subModule);
            var container = $(subModule.svelte_element_instance.container_element); // self.createContainer(module);

            // var container = self.createContainer(subModule);
            elements.container = container;


            elements.childSubReportsContainer = container.find('.childSubReportsContainer').eq(0);
            elements.childSubReportsContainerCloseButton = container.find('.childSubReportsContainerCloseButton').eq(0);



////////////////////////////////////////yathi////////////////////////////////////////////////////////////////////////
//             elements.childSubReportsContainer = $(document.createElement('div')).attr({'class': 'childSubReportsContainer'});
//             elements.container.append(elements.childSubReportsContainer);
//
//             elements.childSubReportsContainerCloseButton = $(document.createElement('div'))
//                 .attr({'class': 'childSubReportsContainerCloseButton'});
//             elements.childSubReportsContainer.append(elements.childSubReportsContainerCloseButton);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//             var table = $(document.createElement('table')).attr({class: 'hundred-percent subModule-container-table'});
//             var trFilters = $(document.createElement('tr'));
//            var tdFilters = $(document.createElement('td'));
//             var trButtons = $(document.createElement('tr')).addClass('buttonsRow');
//             var tdButtons = $(document.createElement('td'));
//             var trViews = $(document.createElement('tr'));
//             var tdViews = $(document.createElement('td')).attr('id', 'viewsContainer');

            const table = container.find('.subModule-container-table').eq(0);
            const trButtons = container.find('.buttonsRow').eq(0);
            const tdButtons = trButtons.children().eq(0);
            const tdViews = container.find('#viewsContainer').eq(0);
            const trFilters = container.find('.submodule-filter-container').eq(0);


           trFilters.append(subModule.filterManager.getElement());

            tdButtons.append(subModule.buttonManager.getElement('gridView'));
            if (subModule.filterManager.hasTabFilterPanelFilters) {

                var inlineTabFilterPanel = subModule.filterManager.elements.inlineTabFilterPanel;
                if (inlineTabFilterPanel.children().length) {
                    tdButtons.append(inlineTabFilterPanel);
                }
                // console.log('inlineTabFilterPanel', inlineTabFilterPanel.get(0))
                var tabFilterPanel = subModule.filterManager.elements.tabFilterPanel;
                if (tabFilterPanel.children().length) {
                    tdButtons.append(tabFilterPanel);
                }

                trButtons.css('height', '90px')
            } else {
                trButtons.css('height', '45px')
            }

            if (subModule.hasGridViewMode) {
                tdViews.append(subModule.grid.getElement());
            }
            // if (subModule.hasThumbnailViewMode) {
            //     tdViews.append(subModule.thumbNailView.getElement());
            // }
            if (subModule.hasCalendarViewMode) {
                tdViews.append(subModule.calendarView.getElement());
            }
            // trButtons.append(tdButtons);
            // trViews.append(tdViews);

           // table.append(trFilters);
//             table.append(trButtons);
//             table.append(trViews);
            if (subModule.type == 'singleRow') {
                table.hide();
            }

            container.append(table);
            container.append(subModule.filterManager.getElement());
            elements.viewsContainer = tdViews;
            subModule.elements = elements;
            subModule.container = container;
            return container;
        }
    },
    getConfirmationQuote: function(dataRowId, getConfirmationQuoteCallback){
        var self = this;
        self._db.getConfirmationQuote(dataRowId, self, getConfirmationQuoteCallback)
        return self;
    },

    _db:{
        initialize: function(subModule){
            var self = this;
            var socket = subModule.getSocket();
            // socket.on(subModule.socketEvents.deleteRowsDone, function(data){
            //     subModule._db.deleteRow_done(subModule, subModule.buttonManager.buttons[data.buttonId] , data);
            // });
            socket.on(subModule.socketEvents.statusChangeDone, function(data){
                subModule._db.statusChange_done(subModule, subModule.buttonManager.buttons[data.buttonId], data);
            });
            socket.on(subModule.socketEvents.getAllLookUpLabelDataDone, function(data){
                subModule._db.getAllLookUpLabelData_done(subModule, data);
            });
            socket.on(subModule.socketEvents.getAllLookUpLabelDataForGetOneRowDataDone, function(data){
                subModule._db.getAllLookUpLabelDataForGetOneRowData_done(subModule, data);
            });
            socket.on(subModule.socketEvents.getToolTipDataDone, function(data){
                subModule._db.getToolTipData_done(subModule, data);
            });
            socket.on(subModule.socketEvents.getNotificationCountDone, function(data){
                subModule._db.getNotificationCount_done(subModule, data);
            });
            socket.on(subModule.socketEvents.lockRowDone, function(data){
                subModule.lockRow_done(data);
            });
            socket.on(subModule.socketEvents.unlockRowDone, function(data){
                subModule.unlockRow_Done(data);
            });

            subModule.forEachButton(function(button){
                var listenStr = subModule.socketEvents['getConfirmationQuoteDone_'+button.id];
                socket.on(listenStr, function(data){
                    self.getConfirmationQuote_done(subModule, button, data);
                });
            },function(button){
                var ret = false;
                if(button.confirmationSql && button.confirmationSql.isEnabled){
                    ret = true;
                }
                return ret;
            });
            subModule.forEachButton(function(button){
                var listenStr = subModule.socketEvents['execSqlDone_'+button.id];
                socket.on(listenStr, function(data){
                    self.execSql_done(subModule,button, data);
                });
            },function(button){
                var ret = false;
                if(button.type == Button.BUTTON_TYPES.EXEC_SQL){
                    ret = true;
                }
                return ret;
            });
            subModule.forEachButton(function(button){
                var listenStr = subModule.socketEvents['emailDone_'+button.id];
                socket.on(listenStr, function(data){
                    self.email_done(subModule,button, data);
                });
            },function(button){
                var ret = false;
                if(button.type == Button.BUTTON_TYPES.EMAIL){
                    ret = true;
                }
                return ret;
            });
            subModule.forEachButton(function(button){
                var listenStr = subModule.socketEvents['printDone_'+button.id];
                socket.on(listenStr, function(data){
                    self.print_done(subModule, button, data);
                });
            },function(button){
                var ret = false;
                if(button.type == Button.BUTTON_TYPES.PRINT){
                    ret = true;
                }
                return ret;
            });
            subModule.forEachButton(function(button){
                var listenStr = subModule.socketEvents['exportToExcelDone_'+button.id];
                socket.on(listenStr, function(data){
                    self.exportToExcel_done(subModule, button, data);
                });
            },function(button){
                var ret = false;
                if(button.type == Button.BUTTON_TYPES.EXPORT_TO_EXCEL){
                    ret = true;
                }
                return ret;
            });
            subModule.forEachButton(function(button){
                var listenStr = subModule.socketEvents['smsDone_'+button.id];
                socket.on(listenStr, function(data){
                    self.sms_done(subModule, button, data);
                });
            },function(button){
                var ret = false;
                if(button.type == Button.BUTTON_TYPES.SMS){
                    ret = true;
                }
                return ret;
            });

            subModule.forEachButton(function(button){
                var listenStr = subModule.socketEvents['triggerAnotherButtonDone_'+button.id];
                socket.on(listenStr, function(data){
                    self.triggerAnotherButton_done(subModule, button, data);
                });
            },function(button){
                var ret = false;
                if(button.type == Button.BUTTON_TYPES.TRIGGER_ANOTHER_BUTTON){
                    ret = true;
                }
                return ret;
            });

            subModule.forEachColumn(function(column){
                var listenStr = subModule.socketEvents['editInDisplayDone_'+column.id];
                socket.on(listenStr, function(data){
                    self.saveEditInDisplayColumn_done(subModule, column, data);
                });
            }, function(column){
                var ret = false;
                if(column.typeSpecific && column.typeSpecific.editInDisplay){
                    ret = true;
                }
                return ret;
            });
            subModule.forEachColumn(function(column){
                var listenStr = subModule.socketEvents['showSuggestionsFromPreviousEntriesDone_'+column.id];
                socket.on(listenStr, function(data){
                    self.showSuggestionsFromPreviousEntries_done(subModule, column, data);
                });
            }, function(column){
                var ret = false;
                if(column.typeSpecific && column.typeSpecific.showSuggestionsFromPreviousEntries){
                    ret = true;
                }
                return ret;
            });
            subModule.forEachButton(function(button){
                if((button.backgroundTasks.emailNotification1 && button.backgroundTasks.emailNotification1.isEnabled) ||  ( button.backgroundTasks.emailNotification2 && button.backgroundTasks.emailNotification2.isEnabled) || (button.backgroundTasks.emailNotification3 && button.backgroundTasks.emailNotification3.isEnabled)){
                    var listenStr = subModule.socketEvents['backgroundTasksEmailDone_'+ button.id];
                    socket.on(listenStr, function(data){
                        self.backgroundTaskEmail_done(subModule, button, data);
                    });
                }
                if((button.backgroundTasks.smsNotification1 && button.backgroundTasks.smsNotification1.isEnabled) ||  ( button.backgroundTasks.smsNotification2 && button.backgroundTasks.smsNotification2.isEnabled) || (button.backgroundTasks.smsNotification3 && button.backgroundTasks.smsNotification3.isEnabled)){
                    var listenStr = subModule.socketEvents['backgroundTasksSMSDone_'+ button.id];
                    socket.on(listenStr, function(data){
                        self.backgroundTaskSMS_done(subModule, button, data);
                    });
                }
                if(button.backgroundTasks.printing.isEnabled){
                    var listenStr = subModule.socketEvents['backgroundTasksPrintingDone_'+ button.id];
                    socket.on(listenStr, function(data){
                        self.backgroundTaskPrinting_done(subModule, button, data);
                    });
                }

            },function(button){
                var ret = false;
                if(button.backgroundTasks && button.backgroundTasks.isEnabled){
                    ret = true;
                }
                return ret;
            });

        },
        getNotificationCount: function(subModule){
            var self = this;
            var socket = subModule.getSocket();
            socket.emit(subModule.socketEvents.getNotificationCount, {});
            return self;
        },
        getConfirmationQuote: function(dataRow, subModule, getConfirmationQuoteCallback){
            var self = this;
            var socket = subModule.getSocket();
            var isConfirmationSql = false;
            self.getConfirmationQuoteCallback = getConfirmationQuoteCallback;
            subModule.buttonManager.forEachButton(function(button){
                isConfirmationSql = true;
                getConfirmation(button);
            }, function(button){
                var ret = false;
                if(button.confirmationSql && button.confirmationSql.isEnabled){
                    ret = true;
                }
                return ret;
            });

            function getConfirmation(button){
                var data = {
                    buttonId: button.id,
                    dataRowId: dataRow['id']
                }
                socket.emit(subModule.socketEvents['getConfirmationQuote_'+button.id], data)
            }
            if(!isConfirmationSql){
                getConfirmationQuoteCallback();
            }
            return self;
        },
        getConfirmationQuote_done: function(subModule, button, data){
            var self= this;
            var resultObj = data.result[0];
            for(var key in resultObj){
                button.confirmationMessage = resultObj[key];
            }
            self.getConfirmationQuoteCallback();
            return self;
        },

        deleteRow: function(subModule, selectedRows, button, buttonMode, mode){
            var self = this;
            var socket = subModule.getSocket();
            var data = {};
            data.config = {selectedRows: selectedRows};
            data.buttonId = button.id;
            data.buttonMode = buttonMode;
            data.mode = mode;
            button.loading = true;

            subModule.do_ajax_request('deleteRows', data, function(ajax_err, responseObj){
                self.deleteRow_done(subModule, button, responseObj);
            });

            // socket.emit(subModule.socketEvents.deleteRows, data);
            return self;
        },
        deleteRow_done: function(subModule, button, data){
            var self = this;
            button.loading = false;
            if(data.success){
                subModule.notifier.showSuccessNotification('Delete Successful');
                if(data.buttonMode == Button.BUTTON_MODES.FORM){
                    subModule.formView.hide();
                }
                subModule.setDisplayMode();
            }
            else{
                subModule.notifier.showReportableErrorNotification(data.errorMessage || 'Error Deleting Data');
            }
            return self;
        },
        statusChange: function(subModule, button, data){
            var self = this;
            var socket = subModule.getSocket();
            button.loading = true;
            socket.emit(subModule.socketEvents.statusChange, data);
            return self;
        },
        statusChange_done: function(subModule, button, data){
            var self = this;
            button.loading = false;
            if(data.success){
                subModule.notifier.showSuccessNotification(data.successMessage || 'Update Successful');
                subModule.grid.getData();
            }
            else{
                subModule.notifier.showReportableErrorNotification(data.errorMessage || 'Error Updating Data');
            }
            return self;
        },
        getAllLookUpLabelData_done: function(subModule, data){
            var self = this;
            if(data.success){
                subModule.setLookUpLabelData(data.result);
            }
            else{
                subModule.notifier.showReportableErrorNotification('Error getting data for Reference columns');
            }
            return self;
        },
        getNotificationCount_done: function(subModule, data){
            var self = this;
            if(data.success){
                subModule.setNotificationCount(data.result);
            }
            else{
                subModule.notifier.showReportableErrorNotification(data.errorMessage || 'Error getting data for Reference columns');
            }
            return self;
        },
        getAllLookUpLabelDataForGetOneRowData_done: function(subModule, data){
            var self = this;
            if(data.success){
                subModule.getAllLookUpLabelDataForGetOneRowData(data.result);
            }
            else{
                subModule.notifier.showReportableErrorNotification('Error getting data for One Row Reference columns');
            }
            return self;
        },
        execSql: function(subModule, selectedRows, button, buttonMode){
            var self = this;
            var socket = subModule.getSocket();
            var data = {config:{selectedRows: selectedRows}};
            data.buttonId = button.id;
            data.buttonMode = buttonMode;
            button.loading = true;
            // socket.emit(subModule.socketEvents['execSql_'+button.id], data);
            subModule.do_ajax_request('execSql_'+button.id, data, function(ajax_err, responseObj){
                self.execSql_done(subModule, button, responseObj);
            });
            return self;
        },
        execSql_done: function(subModule, button, data){
            var self = this;
            button.loading = false;
            if(data.success){
                subModule.notifier.showSuccessNotification(data.successMessage || 'Data Updated');

                if(data.buttonMode == Button.BUTTON_MODES.FORM){
                    subModule.formView.reloadCurrentEditDataFromServer();
                    subModule.formView.dynamicCallBacks.refreshDisplayModeOnClose = (subModule.erp.getSelectedModule().id == subModule.module.id);
                }
                else{
                    subModule.setDisplayMode();
                }
            }
            else{
                subModule.notifier.showReportableErrorNotification(data.errorMessage || 'Error Updating Data');
            }
            return self;
        },

        execJavaScript: function(subModule, selectedRows, button, buttonMode){
            var self = this;
            var socket = subModule.getSocket();
            var data = {config:{selectedRows: selectedRows}};
            data.buttonId = button.id;
            data.buttonMode = buttonMode;
            button.loading = true;

            button.javascriptHandlers.javascriptCodeMain.apply(button, [data, subModule, function(err, result){
                button.loading = false;
                if(result && result.setDisplayMode){
                    subModule.setDisplayMode();
                }
            }]);


            return self;
        },

        email: function(subModule, selectedRows, button){
            var self = this;
            var socket = subModule.getSocket();
            button.loading = true;
            var data = {config:{selectedRows: selectedRows}};
            data.buttonId = button.id;
            socket.emit(subModule.socketEvents['email_'+button.id], data);
            return self;
        },
        email_done: function(subModule, button, data){
            var self = this;
            button.loading = false;
            if(data.success){
                subModule.notifier.showSuccessNotification(data.successMessage || 'Email Sent Successfully');
                subModule.setDisplayMode();
                subModule.setAsDataChanged('email');
            }
            else{
                console.log(data);
                subModule.notifier.showReportableErrorNotification(data.errorMessage || 'Error Sending Email');
            }
            return self;
        },

        sms: function(subModule, selectedRows, button){
            var self = this;
            var socket = subModule.getSocket();
            button.loading = true;
            var data = {config:{selectedRows: selectedRows}};
            data.buttonId = button.id;
            socket.emit(subModule.socketEvents['sms_'+button.id], data);
            return self;
        },
        sms_done: function(subModule, button, data){
            var self = this;
            button.loading = false;
            if(data.success){
                var successCount = 0;
                var errorMessages = [];
                data.result.forEach(function(dataRow){
                    if(dataRow.success){
                        successCount++;
                    }
                    else{
                        errorMessages.push(dataRow.errorMessage);
                    }
                });
                var str = '';
                if(data.result.length > 1){
                    str = successCount + '/'+data.result.length+ ' SMS Sent Successfully';
                }
                else{
                    str = 'SMS Sent Successfully';
                }
                if(errorMessages.length){
                    str += '\n' + errorMessages.join('\n');
                }

                subModule.notifier.showSuccessNotification(str,{
                    duration: 5000
                });
                subModule.setDisplayMode();
                subModule.setAsDataChanged('sms');
            }
            else{
                subModule.notifier.showReportableErrorNotification(data.errorMessage || 'Error Sending SMS');
            }
            return self;
        },
        print: function(subModule, selectedRows, button, buttonMode){
            var self = this;
            var socket = subModule.getSocket();
            var data = {config:{selectedRows: selectedRows}};
            data.buttonId = button.id;
            data.buttonMode = buttonMode;
            button.loading = true;
            socket.emit(subModule.socketEvents['print_'+button.id], data);
            return self;
        },
        print_done: function(subModule, button, data){
            var self = this;
            button.loading = false;
            if(data.success){
                if(button.enableDirectDownload){
                    var xhr = new XMLHttpRequest();
                    console.log()
                    xhr.open('GET', data.result.url);
                    xhr.responseType = 'blob';
                    xhr.onload = function(event){
                        if(this.status == 200){
                            var blob = this.response;
                            saveAs(blob, data.result.selectedRow[0] || data.result.file)
                        }
                    };
                    xhr.send();
                }
                else{
                    if(data.result.hasDirectPrinting){
                        var url = 'http://localhost:10001/print?url='+data.result.url+'&serverIp='+data.result.serverIp+'&printer='+data.result.printerName+'&port='+data.result.port+'&printCount='+(data.result.printCount || 1)+'&fileName='+data.result.file;
                        var printWindow = window.open(url, '_blank', 'width = 200, height = 200');
                        printWindow.focus();
                        setTimeout(function(){
                            printWindow.close();
                        }, 500);
                    }
                    else{
                        subModule.showPrintingView(data.result, button);
                    }
                }


                if(data.buttonMode == Button.BUTTON_MODES.FORM){
                    subModule.formView.reloadCurrentEditDataFromServer();
                    subModule.formView.dynamicCallBacks.refreshDisplayModeOnClose = (subModule.erp.getSelectedModule().id == subModule.module.id);
                }
                else{
                    subModule.setDisplayMode();
                }

                subModule.setAsDataChanged('print');
            }
            else{
                subModule.notifier.showReportableErrorNotification(data.errorMessage || 'Error Printing Item');
            }
            return self;
        },

        triggerAnotherButton: function(subModule, selectedRows, button){
            var self = this;
            var socket = subModule.getSocket();
            var data = {config:{selectedRows: selectedRows}};
            data.buttonId = button.id;
            button.loading = true;
            socket.emit(subModule.socketEvents['triggerAnotherButton_'+button.id], data);
            return self;
        },
        triggerAnotherButton_done: function(subModule, button, data){
            var self = this;
            button.loading = false;
            if(data.success){
                subModule.erp.notifier.showSuccessNotification('barcodes have been generated')
                subModule.setAsDataChanged('triggerAnotherButton');
            }
            else{
                subModule.erp.notifier.showErrorNotification(data.err)
            }
            subModule.setDisplayMode();
            return self;
        },

        exportToExcel: function(subModule, selectedRows, button){
            var self = this;
            var socket = subModule.getSocket();
            button.loading = true;
            var data = {config:{selectedRows: selectedRows}};
            data.buttonId = button.id;
//            button.disabled = true;
            socket.emit(subModule.socketEvents['exportToExcel_'+button.id], data);
            return self;
        },
        exportToExcel_done: function(subModule, button, data){
            var self = this;
//            button.disabled = false;
            button.loading = false;
            if(data.success){
                //subModule.setDisplayMode();
                subModule.saveExcelFile(data.result, button);
                subModule.setAsDataChanged('exportToExcel');
            }
            else{
                subModule.notifier.showReportableErrorNotification(data.errorMessage || 'Error Exporting Data Item');
            }
            return self;
        },
        getToolTipData: function(subModule, column ,dataRow){
            var data = {};
            data.columnId = column.id;
            data.rowId = dataRow['id'];
            subModule.getSocket().emit(subModule.socketEvents.getToolTipData, data);
            return self;
        },
        getToolTipData_done: function(subModule, data){
            var self = this;
            if(data.success){
                var column = subModule.columnManager.columns[data.result.columnId];
                column.setToolTipData(data.result);
            }
            else{
                subModule.notifier.showReportableErrorNotification(data.errorMessage || 'Error Getting Tooltip Data');
            }
            return self;
        },
        saveEditInDisplayColumn: function(subModule, column, value, dataRow){
            var data = {};
            data.columnId = column.id;
            data.rowId = dataRow['id'];
            data.config = {};
            data.config.databaseName = subModule.databaseName;
            data.config[column.id] = value;
            subModule.getSocket().emit(subModule.socketEvents['editInDisplay_'+column.id], data);
            return self;
        },
        saveEditInDisplayColumn_done: function(subModule, column, data){
            var self = this;
            subModule.grid.appendRowIngrid(data);
            subModule.grid.saveRowDataInConfig(data);
            column.saveEditInDisplayColumnDone(data);
            subModule.setAsDataChanged('saveEditInDisplayColumn');
            return self;
        },
        showSuggestionsFromPreviousEntries: function(subModule){
            var data = {};
            subModule.getSocket().emit(subModule.socketEvents.showSuggestionsFromPreviousEntriesForAllColumns, data);
            return self;
        },
        showSuggestionsFromPreviousEntries_done: function(subModule, column, data){
            var self = this;
            if(data.success){
//                var column = subModule.columnManager.columns[data.result.columnId];
                column.setSuggestionsData(data.result);
            }
            else{
                subModule.notifier.showReportableErrorNotification(data.errorMessage || 'Error Getting Suggestions Data');
            }
            return self;
        },
        backgroundTaskEmail_done: function(subModule, button, data){
            var self = this;
            var options = {
                layout: "topLeft",
                id: data.randomId,
                timeout: 3000
            };
            if(data.success){
                var customError;
                data.result && data.result.forEach(function(item){
                    if(item.error){
                        customError = item.error;
                    }
                });
                if(customError){
                    options.text = customError;
                    options.type = 'alert';
                }
                else{
                    options.text = data.successMessage;
                    options.type = 'success';
                }
                subModule.setAsDataChanged('backgroundTaskEmail');
            }
            else{
                options.text = data.errorMessage;
                options.type = 'error';
            }
            if(button.backgroundTasks.notificationModel == 'oneByOne'){
                noty(options);
            }
            return self;
        },
        backgroundTaskSMS_done: function(subModule, button, data){
            var self = this;
            var options = {
                layout: "topLeft",
                id: data.randomId,
                timeout: 3000
            };
            if(data.success){
                options.text = data.successMessage;
                options.type = 'success';
                subModule.setAsDataChanged('backgroundTaskEmail');
            }
            else{
                options.type = 'error';
                if(data.errorMessage && data.errorMessage.length){
                    options.text = '';
                    if(typeof data.errorMessage == 'string'){
                        options.text = data.errorMessage;
                    }
                    else{
                        data.errorMessage.forEach(function(item){
                            options.text += item.errorMessage;
                        });
                    }
                }
                else{
                    options.text = 'Error Sending SMS';
                }
            }
            if(button.backgroundTasks.notificationModel == 'oneByOne'){
                noty(options);
            }
            return self;
        },
        backgroundTaskPrinting_done: function(subModule, button, data){
            var self = this;
            var options = {
                layout: "topLeft",
                id: data.randomId,
                timeout: 3000
            };
            if(data.success){
                options.text = data.successMessage;
                options.type = 'success';
                subModule.setAsDataChanged('backgroundTaskPrinting');
            }
            else{
                options.text = data.errorMessage;
                options.type = 'error';
            }
            if(button.backgroundTasks.notificationModel == 'oneByOne'){
                noty(options);
            }
            return self;
        }
    },
    showFormViewInViewMode: function(options){
        var self = this;
        var button = self.buttonManager.getDefaultButton(Button.BUTTON_TYPES.VIEW);
        self.formView.setZIndex(9999999999999999);
        self.formView.show(FormView.VIEW_MODE, options.dataRow, button, {
            onAfterUpdate: function(data, formView){
                if(options.onAfterUpdate){
                    options.onAfterUpdate(data);
                    self.formView.setZIndex();
                    formView.hide();
                    return false;
                }
            },
            refreshDisplayModeOnClose: options.refreshDisplayModeOnClose
        });
        return self;
    },
    showFormViewForQuickAdd: function(options){
        var self = this;
        var button = self.buttonManager.getDefaultButton(Button.BUTTON_TYPES.CREATE);
        var formViewType;
        if(options.showQuickAddView){
            formViewType = 'smallQuickAddView';
        }
        self.formView.setZIndex(9999999999999999);
        self.formView.show(FormView.CREATE_MODE, {}, button, {
            onAfterInsert: function(data, formView){
                self.formView.setZIndex();
                formView.hide();
                if(options.onAfterInsert){
                    options.onAfterInsert(data);
                    if(!options.refreshDataOnInsert){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            isChosen: options.isChosen,
            customCreateModeValues: options.customCreateModeValues,
            parentColumnElement: options.parentColumnElement,
            parentDataRowForQuickAdd: options.parentDataRowForQuickAdd,
            parentPositioningElement: options.parentPositioningElement
        }, formViewType);
        return self;
    },
    showPrintingView: function (data, button){
        var self = this;
        var url = data.url;
        var newWin = window.open(url, '', 'width=1000,height=500');
//        newWin.addEventListener('load', function(){console.log('test')}, true)
//        newWin.location.href = url;
        return self;
    },
    saveExcelFile: function(data, button){
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.open('GET', data.url, true);
        xhr.onload = function(eve){
            window.xhr = xhr;
            var blob = new Blob([xhr.response], { type: 'application/vnd.ms-excel' });
            saveAs(blob,  self.displayName + ' ' +moment().format('DD-MMM-YYYY hh:mm:ss a')+'.xls');
        };
        xhr.send(null);
        return self;
    },
    uploadFile: function(file, options){
        var self = this;
        if(!file){
            return self;
        }

        var formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', crypto.getRandomValues(new Uint32Array([1])) [0]+ file.name.substring(file.name.lastIndexOf('.')));
        formData.append('subModuleId', self.id);
        formData.append('moduleId', self.module.id);
        formData.append('userId', self.erp.user.userDetails.id);


        var xhr = new XMLHttpRequest();
        if(options.onProgress){
            xhr.upload.addEventListener('progress', function(uploadEvent){
                var percent = Math.round(uploadEvent.loaded * 100/ uploadEvent.total);
                options.onProgress.apply(self, [percent, uploadEvent]);
            }, false);
        }
        if(options.onLoad){
            xhr.addEventListener('load', function(onLoadEvent){
                options.onLoad.apply(self, [JSON.parse(xhr.responseText), onLoadEvent]);
            }, false);
        }

        xhr.open('POST', '/uploadFile', true);
        xhr.send(formData);
        return self;
    },
//    registerChildWindow: function(column, dataRow, registerChildWindowCallBack){
//        var self = this;
//        var socket = self.getSocket();
//        var data = {
//            config: column.typeSpecific.dataSource,
//            parentSubModuleId: self.id,
//            parentModuleId: self.module.id
//        }
//        data.config.dataRow = dataRow;
//        data.config.randomId = crypto.getRandomValues(new Uint16Array(1))[0];
//        socket.childWindow.events[data.config.randomId] = registerChildWindowCallBack;
//        socket.emit('registerChildWindow', data);
//
////        socket.once('registerChildWindowDone', function(data){
////            registerChildWindowCallBack(data);
////        });
//        return self;
//    },
    updateChildWindowParentFilterCondition: function(parentObject, childWindow, dataRow, updateChildWindowParentFilterConditionCallback){
        var self = this;
        var childModule = childWindow.childModule;
        var data = {
            config: parentObject.typeSpecific.dataSource
        };
        data.config.moduleId = childModule.id;
        data.config.randomId = childModule.randomId;
        data.config.dataRow = dataRow;
        // var socket = self.getSocket();

//        childModule.updateChildWindowParentFilterCondition();
        childWindow.dataRow = dataRow;
        childModule.parentDataRow = childModule.config.parentDataRow = dataRow;
//        childModule.parentFilterCondition= childModule.config.parentFilterCondition = column.typeSpecific.dataSource.filterConditions[0];

        childModule.forEachSubModule(function(subModule){
            subModule.parentDataRow = subModule.config.parentDataRow = dataRow;
        });

        var url = self.getAjaxUrl('updateChildWindowParentFilterCondition');
        $.ajax({
            type: 'POST',
            data: data,
            url: url,
        }).always(function (responseObj, status) {
             // console.log( 'updateChildWindowParentFilterCondition_Done', responseObj, status);
            //grid._db.getData_done(grid, responseObj);
            updateChildWindowParentFilterConditionCallback && updateChildWindowParentFilterConditionCallback(responseObj)
        });

        // socket.emit('updateChildWindowParentFilterCondition', data);
        return self;
    },
    openBlogViewWindow: function(hyperlinkColumn, dataRow, options){
        var self = this;

        // console.log('openBlogViewWindow', hyperlinkColumn, dataRow, options);

        var iframe = document.createElement('iframe');
        iframe.setAttribute('id', 'iframe_' + hyperlinkColumn.uniqueName);
        iframe = $(iframe);

        iframe.css({ position: "fixed", display: "block", top: "0px", left: "0px", width: "100vw", height: "100vh", zIndex: 1000000001, opacity: 1 })
            .appendTo(document.body);
        iframe.attr('src', '/Blog/Blog.html?context=' + hyperlinkColumn.uniqueName);

        var mainDoc = document;
        var mainWin = window;
        var emailConfig;
        // if (hyperlinkColumn.sendEmailOnInsertBlog) {
        //     emailConfig = app.emails[hyperlinkColumn.sendEmailOnInsertBlog];
        // }

        hyperlinkColumn.enableEditingBlog = false;
        hyperlinkColumn.editConfigurationBlog = {
            freezeAfter: 0
        };
        iframe.load(function () {
            var doc = $(iframe.contents().get(0));
            var iWindow = iframe.get(0).contentWindow;
            iWindow.app = erp;

            iWindow.parentSubModuleConfig = {
                mainDoc: mainDoc,
                mainWin: mainWin,
                hyperlinkColumn: hyperlinkColumn,
                parameters: dataRow,
                parentSubModule: self,
                enableEditingBlog: hyperlinkColumn.enableEditingBlog,
                user: self.erp.user.userDetails,
                emailConfig: emailConfig }
            iWindow.blog = new iWindow.Blog(dataRow['id'], hyperlinkColumn.columnId, hyperlinkColumn.enableEditingBlog, hyperlinkColumn.editConfigurationBlog);
            // $(this).fadeTo(100, 1);
        });
    },
    openChildWindow: function(column, dataRow, options){
        var self = this;
        options = options || {};
        var childWindowDisplayMode = column.typeSpecific.displayModeInGridView || 'fullPagePopup'; // -- need to change this default value to old ones

        if(self.childWindows[column.id]){
            var absorbContainer1 = self.grid.elements.rows[dataRow['id']]
                .tr.find('[data-id="'+column.id+'"]');

            // if(self.childWindows[column.id].isOpen){
            //     self.childWindows[column.id].close();
            // }
            // -- ignoring for now

            self.updateChildWindowParentFilterCondition(column, self.childWindows[column.id], dataRow, function (updateConditionResponse) {
                var curentChildWindow = self.childWindows[column.id];
                if(!options.createOnly){
                    curentChildWindow.show({
                        absorbContainer: absorbContainer1
                    });

                    if(childWindowDisplayMode == 'inline'){
                        var rowElement = self.grid.elements.rows[dataRow['id']].tr;
                        var columnElement = self.grid.elements.rows[dataRow['id']].tr.find('[data-id="'+column.id+'"]');

                        curentChildWindow.setAsInlineViewMode(rowElement, columnElement, {
                            viewOnlyMode: false
                        })
                    }
                    else{
                        $(document.body).append(curentChildWindow.getElement());
                    }
                }

                // console.log(curentChildWindow)

                var defaultSubModule = curentChildWindow.childModule.defaultSubModule;//[curentChildWindow.defaultSubModule];
                defaultSubModule.setDisplayMode(defaultSubModule.displayMode, true);//getGridDataWithReset

                options.onSuccess && options.onSuccess.apply(self, [self.childWindows[column.id]]);
            });
            return self;
        }


        self.erp.registerChildWindow(self, column, dataRow, function(result){
            if(result.success){
                setTimeout( function(){
                    console.log('async 1 start');

                    var absorbContainer2;
                    if(self.grid.elements.rows){
                        absorbContainer2 = self.grid.elements.rows[dataRow['id']].tr.find('[data-id="'+column.id+'"]');
                    }
                    self.createChildWindowForColumn(column, result.randomId, dataRow, childWindowDisplayMode, (c_err, childWindow)=>{
                        if(!options.createOnly){
                            childWindow.show({
                                absorbContainer: absorbContainer2
                            });
                        }
                        options.onSuccess && options.onSuccess.apply(self, [childWindow])
                    });

                }, 1);
            }
            else{
//                childWindow.hide();
                self.notifier.showReportableErrorNotification('Error opening child window');
            }
        });
        return self;
    },
    createChildWindowForColumn: function(column, randomId, dataRow, childWindowDisplayMode, createChildWindowForColumnCallback){
        var self = this;
        var dataSource = column.typeSpecific.dataSource;
        var moduleConfig = self.erp.allModules[dataSource.moduleId].config;
//        moduleConfig = JSON.parse(JSON.stringify(moduleConfig));
        var absorbContainer;
        if(self.grid.elements.rows){
            absorbContainer = self.grid.elements.rows[dataRow['id']].tr.find('[data-id="'+column.id+'"]');
        }
        var setAsViewOnlyMode = false;

        moduleConfig.randomId = randomId;
//        moduleConfig.viewOnlyMode = column.typeSpecific.openInViewOnlyMode || false;
        setAsViewOnlyMode = column.typeSpecific.openInViewOnlyMode || false;
        if(moduleConfig.viewOnlyMode){
            if(!column.typeSpecific.preventViewOnlyModeInheritance){
                setAsViewOnlyMode = true;
                //moduleConfig.viewOnlyMode = column.subModule.viewOnlyMode;
            }
        }
        moduleConfig.parentDataRow = dataRow;
        moduleConfig.parentItem = column;
        moduleConfig.parentSubModule = column.subModule;
        moduleConfig.parentFilterCondition = column.typeSpecific.dataSource.filterConditions[0];
        moduleConfig.defaultSubModule = column.typeSpecific.dataSource.subModuleId;
        moduleConfig.isInChildWindow = true;

        var childModule = new Module( moduleConfig, self.erp );

        childModule.initialize().then(()=>{


            childModule.forEachSubModule(function(subModule){
                subModule.parentDataRow = subModule.config.parentDataRow = dataRow;
                subModule.isInChildWindow = true;
                subModule.viewOnlyMode = setAsViewOnlyMode;
            });
            var previousTopMostModuleInViewPlane = '';
            var previousTopMostSubModuleInViewPlane = '';

            // var childWindowMode = 'fullPage';
            // if(column.typeSpecific.showAsInline){
            //     if(!forceShowFullPageLayout){
            //         childWindowMode = 'inline';
            //     }
            // }
            // childWindowMode = 'inline';

            var childWindow = new ChildWindow({
                id: column.id,
                column: column,
                dataRow: dataRow,
                initialDisplayMode: childWindowDisplayMode,
                childModule: childModule,
                onClose: function(){
                    //delete self.childWindows[childWindow.id];
                    self.erp.topMostModuleInViewPlane = previousTopMostModuleInViewPlane;
                    self.parentObject.topMostSubModuleInViewPlane = previousTopMostSubModuleInViewPlane;
                    if(childWindowDisplayMode == 'inline'){
                        if(childWindow.hasDefaultSubModuleDataChanged){
                            self.setDisplayMode();
                        }
                        else{
                            console.log('ignoring close, no data changed')
                        }
                    }
                    else{
                        self.setDisplayMode();
                    }
                },
                onShow: function(){
                    previousTopMostModuleInViewPlane = self.erp.topMostModuleInViewPlane;
                    previousTopMostSubModuleInViewPlane = self.parentObject.topMostSubModuleInViewPlane;

                    self.erp.topMostModuleInViewPlane = childModule;
                    self.parentObject.topMostSubModuleInViewPlane = childModule.getSelectedSubModule();
                    childModule.show().setSelectedSubModule(childModule.getSelectedSubModule(), {fromTrigger: true});
                }
            }, self);
            self.childWindows[childWindow.id] = childWindow;
//        childWindow.hide();
            childModule.parentWindow = childWindow;
            childModule.setSelectedSubModule(dataSource.subModuleId);



            if(childWindowDisplayMode == 'inline'){
                var rowElement = self.grid.elements.rows[dataRow['id']].tr;
                var columnElement = self.grid.elements.rows[dataRow['id']].tr.find('[data-id="'+column.id+'"]');

                childWindow.setAsInlineViewMode(rowElement, columnElement, {
                    viewOnlyMode: false
                })

                childWindow.config.onClose = function () {
                    self.erp.topMostModuleInViewPlane = self;
                    self.setDisplayMode(); // continue here
                }

            }
            else{
                $(document.body).append(childWindow.getElement());
            }
            childWindow.hide({
                absorbContainer: absorbContainer,
                preventAnimation: true
            });
            // return childWindow;


            createChildWindowForColumnCallback(null, childWindow);
        });

    },
    createChildWindowForButton: function(button, config, dataRow, extendConfig, createChildWindowForButtonCallback){
        var self = this;
        var dataSource = button.typeSpecific.dataSource;
        var moduleConfig = $.extend({}, self.erp.allModules[dataSource.moduleId].config);
        var preventAnimation = false;
        var absorbContainer = button.getElement(Button.BUTTON_MODES.GRID);;

        if(extendConfig.formViewOnlyMode){
            preventAnimation = true;
        }

        moduleConfig.randomId = config.randomId;
        moduleConfig.parentDataRow = dataRow;
        moduleConfig.parentItem = button;
        moduleConfig.parentSubModule = button.subModule;
        moduleConfig.parentFilterCondition = button.typeSpecific.dataSource.filterConditions[0];
        moduleConfig.defaultSubModule = button.typeSpecific.dataSource.subModuleId;
        moduleConfig.isInChildWindow = true;

        moduleConfig = $.extend(true, moduleConfig, extendConfig);

        var childModule = new Module( moduleConfig, self.erp );

        childModule.initialize().then(()=>{

            childModule.forEachSubModule(function(subModule){
                subModule.parentDataRow = subModule.config.parentDataRow = dataRow;
                subModule.isInChildWindow = true;
            });
            var previousTopMostModuleInViewPlane = '';
            var previousTopMostSubModuleInViewPlane = '';

            var childWindow = new ChildWindow({
                id: button.id,
                button: button,
                hideControls: config.hideControls,
                dataRow: dataRow,
                preventAnimation: preventAnimation,
                childModule: childModule,
                onClose: function(){
                    //delete self.childWindows[childWindow.id];
                    self.erp.topMostModuleInViewPlane = previousTopMostModuleInViewPlane;
                    self.parentObject.topMostSubModuleInViewPlane = previousTopMostSubModuleInViewPlane;
                    self.setDisplayMode();
                },
                onShow: function(){
                    previousTopMostModuleInViewPlane = self.erp.topMostModuleInViewPlane;
                    previousTopMostSubModuleInViewPlane = self.parentObject.topMostSubModuleInViewPlane;

                    self.erp.topMostModuleInViewPlane = childModule;
                    self.parentObject.topMostSubModuleInViewPlane = childModule.getSelectedSubModule();
                    childModule.show().setSelectedSubModule(childModule.getSelectedSubModule(), {fromTrigger: true});
                }
            }, self);
            self.childWindows[childWindow.id] = childWindow;
//        childWindow.hide();
            childModule.parentWindow = childWindow;
            childModule.setSelectedSubModule(dataSource.subModuleId);
            $(document.body).append(childWindow.getElement());
            childWindow.hide({
                absorbContainer: absorbContainer,
                preventAnimation: true
            });
            createChildWindowForButtonCallback(null, childWindow);
        });

    },
    openChildWindowInNormalMode: function(dataRow, button){
        var self = this;
        button.loading = true;
        self.erp.registerChildWindow(self, button, dataRow, function(result){
            button.loading = false;
            if(result.success){
                setTimeout(function(){
                    var absorbContainer2 = button.getElement(Button.BUTTON_MODES.GRID);
                    self.createChildWindowForButton(button, {
                        randomId: result.randomId,
                        hideControls: false
                    }, dataRow, {
                        preventAnimation: false
                    }, (c_err, childWindow)=>{
                        childWindow.show({
                            absorbContainer: absorbContainer2
                        });
                    });

                }, 0)
            }
            else{
//                childWindow.hide();
                self.notifier.showReportableErrorNotification('Error opening child window');
            }
        });
        return self;
    },
    openChildWindowInFormViewOnlyMode: function(dataRow, button){
        var self = this;
        button.loading = true;
        self.erp.registerChildWindow(self, button, dataRow, function(result){
            button.loading = false;
            if(result.success){
                setTimeout(function(){
                    var absorbContainer2 = button.getElement();
                    self.createChildWindowForButton(button, {
                        randomId: result.randomId,
                        hideControls: true
                    }, dataRow, {
                        formViewOnlyMode: true,
                        formViewMode: button.typeSpecific.formViewMode
                    }, (c_err, childWindow)=>{
                        childWindow.show({
                            absorbContainer: absorbContainer2,
                            preventAnimation: true
                        });
                    });

                }, 0)
            }
            else{
//                childWindow.hide();
                self.notifier.showReportableErrorNotification('Error opening child window');
            }
        });
        return self;
    },

    getTextFromSmartTextConfig: function(smartText, dataRow){
        var self = this;
        var str = '';
        if(smartText.config){
            smartText.config.forEach(function(item){
                if(item.type == 'column'){
                    var column = self.columnManager.columns[item.value];
//                    console.log(item.value, column)
                    str += column.parseDisplayValue(dataRow);
                }
                else{
                    str += item.value;
                }
            });
        }
        return str;
    },
    checkCondition: function (conditionConfig, dataRow) {
        var self = this;
        var disabled;
        var columnValue = dataRow[conditionConfig.column];
        if(typeof (columnValue.value) !== 'undefined' && columnValue.value !== null){
            columnValue = columnValue.value;
        }
        else{
            columnValue = '';
        }
        var filterValue = conditionConfig.conditionValue.toLowerCase();
        columnValue = columnValue.toString().toLowerCase();
        switch (conditionConfig.condition) {
            case "equals":
                disabled = (columnValue == filterValue);
                break;
            case "notEquals":
                disabled = (columnValue != filterValue);
                break;
        }
        return disabled;
    },
    _events   : {
    },
    _ui       : {
    },
    get isInQuickViewModeChildWindow(){
        var self = this;
        return self.parentChildWindow && self.parentChildWindow.quickViewMode;
    },
    removeDynamicCallBacks: function(type){
        var self = this;
        self.dynamicCallBacks = {};
        return self;
    },
    removeDynamicCallBack: function(type){
        var self = this;
        delete self.dynamicCallBacks[type];
        return self;
    },
    setDynamicCallBack: function(type, callback){
        var self = this;
        self.dynamicCallBacks[type] = callback;
        return self;
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
    setNotificationCount: function(count){
        var self = this;
        self.curretNotificationCount = count;
        var events = self.eventHandlers[SubModule.EVENTS.notificationCountReceived];
        if(Object.keys(events).length){
            for(var key in events){
                events[key].handler.apply(self, [count]);
            }
        }

        return self;
    },
    getNotificationCount: function(){
        var self = this;
        self._db.getNotificationCount(self);
        return self;
    },

    handleCtrlKeyUpEvent: function(eve){
        var self = this;

        return self;
    },
    handleCtrlKeyDownEvent: function(eve){
        var self = this;

        return self;
    },

    get viewOnlyMode(){
        var self = this;
        return self._viewOnlyMode;
    },
    set viewOnlyMode(newViewOnlyMode){
        var self = this;
        self._viewOnlyMode = newViewOnlyMode;
        if(newViewOnlyMode){
            self.container.addClass('viewOnlyMode');
            if(self.erp.deviceType != ERP.DEVICE_TYPES.MOBILE){
                self.buttonManager.contextMenu.disabled = true;
            }
        }
        else{
            self.container.removeClass('viewOnlyMode');
            if(self.erp.deviceType != ERP.DEVICE_TYPES.MOBILE){
                self.buttonManager.contextMenu.disabled = false;
            }
        }
        return self;
    },

    getPagedData: function(config, getPagedDataCallBack){
        var self = this;

        $.ajax({
            type: 'POST',
            data: {
                config: config || {}
            },
            url: '/getPagedData/'+ self.id
        }).done(function(response){
            getPagedDataCallBack && getPagedDataCallBack(response);
        });

        return self;
    },
    setAsDataChanged : function (reason) {
        var self = this;
        console.log('setAsDataChanged', self.parentChildWindow);
        if(self.parentChildWindow){
            self.parentChildWindow.setAsDataChanged(reason);
        }
    },


    getColumnsListAsSelectOptions: function(addAll, filterFunction){
        var self = this;
        var options = [];
        self.forEachColumn(function(column){
            var option = document.createElement('option');
            option.value = column.id;
            option.innerHTML = column.displayName;
            options.push(option);
        }, filterFunction);
        if(addAll){
            var addAllOption = document.createElement('option');
            addAllOption.value = '';
            addAllOption.innerHTML = '--Please Select--';
            options.unshift(addAllOption);
        }
        return $(options);
    },
    getColumnsListAsCheckableListElements: function(addAll, filterFunction){
        var self = this;
        var options = [];

        var randomId = 'chk_' + getRandomNumber();

        self.forEachColumn(function(column){

            var inputId = randomId + '_' + column.id;
            var option = document.createElement('li');
            option.value = column.id;
            option.innerHTML = '<input id="'+ inputId +'" data-column-id="'+column.id+'" type="checkbox">' +
                '<label for="'+inputId+'">'+ column.displayName +'</label>';
            options.push(option);
        }, filterFunction);


        return $(options);
    },
    getColumnsListAsCheckableTableRows: function(addAll, filterFunction){
        var self = this;
        var rows = [];

        var randomId = 'chk_' + getRandomNumber();

        self.forEachColumn(function(column){
            var inputId = randomId + '_' + column.id;

            var tr = document.createElement('tr');

            var td1 = document.createElement('td');
            td1.innerHTML = '<label for="'+inputId+'">'+ column.displayName +'</label>';
            tr.appendChild(td1);

            var td2 = document.createElement('td');
            td2.innerHTML = '<input id="'+ inputId +'" ' +
                'data-column-id="'+column.id+'" ' +
                'data-module-id="'+column.subModule.module.id+'" ' +
                'data-sub-module-id="'+column.subModule.id+'" ' +
                'type="checkbox">';
            tr.appendChild(td2);

            rows.push(tr);
        }, filterFunction);


        return $(rows);
    },

    getButtonsListAsSelectOptions: function(addAll){
        var self = this;
        var options = [];
        self.buttonManager.forEachButton(function(button){
            var option = document.createElement('option');
            option.value = button.id;
            option.innerHTML = button.displayName;
            options.push(option);
        });
        if(addAll){
            var addAllOption = document.createElement('option');
            addAllOption.value = '';
            addAllOption.innerHTML = '--Please Select--';
            options.unshift(addAllOption);
        }
        return $(options);
    },

    getColumnsListAsFiltersForQueryBuilder: function(){
        var self = this;
        var filters = [];

        self.columnManager.forEachColumn(function(column){
            filters.push(column.getQueryBuilderConfiguration());
        }, function (column) {
            if(column.databaseName){
                return true; // -- need to check for multiple select column
            }
            return false;
        });

        return filters;
    },

    do_ajax_request: function (queryType, data_with_config_inside, do_ajax_request_callback) {
        const self = this;
        const ajax_url = self.getAjaxUrl(queryType);

        let data_to_pass;

        if(data_with_config_inside.config){
            data_to_pass = {_source : JSON.stringify(data_with_config_inside)};
        }
        else{
            data_to_pass = {_source : JSON.stringify({config: data_with_config_inside})};
        }

        $.ajax({
            type: 'POST',
            data: data_to_pass,
            url: ajax_url,
        }).always(function (responseObj, status) {
            if(responseObj.error || responseObj.errorMessage){
                do_ajax_request_callback && do_ajax_request_callback(responseObj, responseObj); // shall return result only?
                return;
            }
            do_ajax_request_callback && do_ajax_request_callback(null, responseObj);
            // console.log(grid.socketEvents.insertRowDone + '_Done', responseObj, status);

        });
    },
    do_ajax_request_legacy: function (queryType, data_with_config_inside, do_ajax_request_callback) {
        const self = this;
        const ajax_url = self.getAjaxUrl(queryType);

        let data_to_pass;

        data_to_pass = {_source : JSON.stringify(data_with_config_inside)};

        $.ajax({
            type: 'POST',
            data: data_to_pass,
            url: ajax_url,
        }).always(function (responseObj, status) {
            if(responseObj.error || responseObj.errorMessage){
                do_ajax_request_callback && do_ajax_request_callback(responseObj, responseObj); // shall return result only?
                return;
            }
            do_ajax_request_callback && do_ajax_request_callback(null, responseObj);
            // console.log(grid.socketEvents.insertRowDone + '_Done', responseObj, status);

        });
    },
    getAjaxUrl: function (queryType, itemId) {
        var self = this;
        var url = window.ERP_API_AJAX_ROOT_URL + '/@moduleId@/@subModuleId@/@queryType@';
        url = url.replace('@moduleId@', self.module.id);
        url = url.replace('@subModuleId@', self.id);
        url = url.replace('@queryType@', queryType);
        if(itemId){
            url += '/' + itemId;
        }

        if(self.randomId){
            url +='?randomId=' + self.randomId;
        }

        return url;
    },

    set_latest_display_data: function(data_arr, data_map){
        this.latest_display_data = {
            arr: data_arr,
            map: data_map
        };
    }
};

SubModule.DISPLAY_MODES = {
    GRID_VIEW: "gridView",
    CARD_VIEW: "thumbnailView",
    THUMBNAIL_VIEW: "thumbnailView",
    MASTER_DETAIL_VIEW: "master_detail_view",
    FORM_VIEW: "formView",
    CALENDAR_VIEW: "calendarView",
    DIRECTCREATE_VIEW: "directCreate"
}

SubModule.prototype.socketEvents = {
    getConfirmationQuote: "getConfirmationQuote",
    getConfirmationQuoteDone: "getConfirmationQuoteDone",
    "getToolTipData": "getToolTipData",
    "getToolTipDataDone": "getToolTipDataDone",
    deleteRows: "deleteRows",
    deleteRowsDone: "deleteRowsDone",
    statusChange: "statusChange",
    statusChangeDone: "statusChangeDone",
    execSql: "execSql",
    execSqlDone: "execSqlDone",
    email: "email",
    emailDone: "emailDone",
    sms: "sms",
    smsDone: "smsDone",
    print: "print",
    printDone: "printDone",
    exportToExcel: "exportToExcel",
    exportToExcelDone: "exportToExcelDone",
    getAllLookUpLabelData: "getAllLookUpLabelData",
    getAllLookUpLabelDataDone: "getAllLookUpLabelDataDone",
    getAllLookUpLabelDataForGetOneRowData: "getAllLookUpLabelDataForGetOneRowData",
    getAllLookUpLabelDataForGetOneRowDataDone: "getAllLookUpLabelDataForGetOneRowDataDone",
    getNotificationCount: "getNotificationCount",
    getNotificationCountDone: "getNotificationCountDone",
    showSuggestionsFromPreviousEntriesForAllColumns: "showSuggestionsFromPreviousEntriesForAllColumns",
    lockRow: "lockRow",
    lockRowDone: "lockRowDone",
    unlockRow: "unlockRow",
    unlockRowDone: "unlockRowDone"
};

SubModule.EVENTS = {
    onBeforeSetDisplayMode: "onBeforeSetDisplayMode"
}
