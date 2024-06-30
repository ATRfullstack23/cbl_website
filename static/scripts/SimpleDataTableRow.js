/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function SimpleDataTableRow(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.simpleDataTable = parentObject;
    self.parentFormView = config.parentFormView;
    self.parentSubModule = config.parentSubModule;
    self.subModule = config.subModule;
    self.erp = self.subModule.erp;
    self.id = self.subModule.id +'_simple_data_table_row_' + window.getRandomId();
    self.initialize();
    self.container.attr('id', self.id);
    self.notifier = new Notifier({
        container: $(document.body)
    });
    return self;
}

SimpleDataTableRow.DISPLAY_MODES = {
    DEFAULT: 'default',
    INLINE: 'inline'
}

SimpleDataTableRow.HIDDEN_MODE = 'none';
SimpleDataTableRow.CREATE_MODE = 'create';
SimpleDataTableRow.EDIT_MODE = 'edit';
SimpleDataTableRow.VIEW_MODE = 'view';

SimpleDataTableRow.prototype = {
    initialize: function () {
        var self = this;
        self.displayMode = self.config.mode;
        self.columns = self.subModule.columnManager.columns;
        self.formElements = {};
        self.createElements();
        self.validationManager = new SimpleDataTableRowValidationManager(self);
        self.bindEvents();
        self.intializeSocketEventsObject();
        self.initializeOnSaveValidationFunctions();
        self._db.initialize(self);
        self._lookUp.initialize(self);
        self.data ={};
        self.mode = self.config.mode;
        self.setDeviceTypeDisplayMode();

        self.bindGetDataFromParentEvents();

        return self;
    },
    destroy: function(){
        var self = this;
        self._db.initialize(self, true);
        self._lookUp.initialize(self, true);
        self.unBindGetDataFromParentEvents();
        self.container.remove();
        return self;
    },
    triggerChange: function(){
        var self = this;
        self.config.onChange && self.config.onChange(self);
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

        //For LookUp
        self.subModule.forEachColumn(function(column){
            var listenStr = 'lookUpParentChangedDone_'+ self.subModule.id +'_'+ column.id;
            var emitStr = 'lookUpParentChanged_'+ self.subModule.id +'_'+ column.id;
            if(self.subModule.randomId){
                listenStr += '_'+  self.subModule.randomId;
                emitStr += '_'+  self.subModule.randomId;
            }
            var listenKey = 'lookUpParentChangedDone_'+ column.id;
            var emitKey = 'lookUpParentChanged_'+ column.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(column){
            var ret = false;
            if(column.childColumns && column.childColumns.length){
                ret = true;
            }
            return ret;
        });

        //For Custom Sql Validation
        self.subModule.forEachColumn(function(column){
            var listenStr = 'customSqlValidationDone_'+ self.subModule.id +'_'+ column.id;
            var emitStr = 'customSqlValidation_'+ self.subModule.id +'_'+ column.id;
            if(self.subModule.randomId){
                listenStr += '_'+  self.subModule.randomId;
                emitStr += '_'+  self.subModule.randomId;
            }
            var listenKey = 'customSqlValidationDone_'+ column.id;
            var emitKey = 'customSqlValidation_'+ column.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        },function(column){
            var ret = false;
            if(column.validations && column.validations.customSql_Create && column.validations.customSql_Create.isEnabled){
                ret = true;
            }
            else if(column.validations && column.validations.customSql_Update && column.validations.customSql_Update.isEnabled){
                ret = true;
            }
            return ret;
        });
        return self;
    },
    initializeOnSaveValidationFunctions: function () {
        var self = this;
        self.onSaveValidationFunctions = {};
        var onSaveValidationFunctionCreate = self.config[SimpleDataTableRow.CREATE_MODE].onSaveValidation;
        var str = '';
        if(onSaveValidationFunctionCreate){
            str = onSaveValidationFunctionCreate.text;
        }
        str = '   var errorMessage = "";\n'+
            '   try{\n'+
            '       '+str + ' \n    }\n'+
            '   catch(err){\n'+
            '       console.log(\'Error in validationFunction_Create\');\n'+
            '   }\n'+
            '   validationFunctionCallBack(errorMessage)';
        self.onSaveValidationFunctions[SimpleDataTableRow.CREATE_MODE] = new Function(['formData', 'validationFunctionCallBack'], str);

        var onSaveValidationFunctionUpdate = self.config[SimpleDataTableRow.EDIT_MODE].onSaveValidation;
        if(onSaveValidationFunctionUpdate){
            str = onSaveValidationFunctionUpdate.text;
        }
        else{
            str = '';
        }
        str = '   var errorMessage = "";;\n'+
            '   try{\n'+
            '       '+str + ' \n    }\n'+
            '   catch(err){\n'+
            '       console.log(\'Error in evaluateFunction_update for '+ self.id+' \');\n'+
            '   }\n'+
            '   evaluateFunctionCallBack(errorMessage)';
        self.onSaveValidationFunctions[SimpleDataTableRow.EDIT_MODE]  = new Function(['formData', 'serverData', 'evaluateFunctionCallBack'], str);
        return self;
    },
    setDeviceTypeDisplayMode: function(){
        var self = this;
//        self.container.addClass(self.erp.deviceType);
        switch(self.erp.deviceType){
            case ERP.DEVICE_TYPES.PC:
                break;
            default:

                break;
        }
        return self;
    },
    createElements: function () {
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    bindEvents: function () {
        var self = this;
        if(self.erp.deviceType === ERP.DEVICE_TYPES.PC){
        }
//        self.container.on('keyup', function(eve){
//            if(eve.keyCode == 13){
//                self.save();
//            }
//        });
//        self.container.on('keydown.simpleDataTableRow', 'input[type="text"]', function(eve){
//            if(eve.keyCode == ERP.KEY_CODES.CTRL){
//                self.isCtrlDown = true;
//            }
//        });
//        self.container.on('keyup.simpleDataTableRow', 'input[type="text"]', function(eve){
//            self.handleKeyUp(eve.keyCode, eve);
//            if(eve.keyCode == ERP.KEY_CODES.CTRL){
//                self.isCtrlDown = false;
//            }
//        });
        return self;
    },
    handleKeyUp: function(keyCode, eve){
        var self = this;
        if(self.isCtrlDown){
            switch(keyCode){
                case ERP.KEY_CODES.ENTER:
                    self.save();
                    break;
            }
        }
        return self;
    },
    validate: function(showErrorMessage){
        var self = this;
        if(showErrorMessage){
            self._ui.resetFormUi(self);
        }
        var ret = self.validationManager.validate();
        if(ret){
            var formData = self.getFormData();
            var onSaveValidationFunction = self.onSaveValidationFunctions[self.mode];
            if(onSaveValidationFunction){
                onSaveValidationFunction.apply(self, [formData,  function(errorMessage) {
                    if (typeof errorMessage !== 'undefined') {
                        if (errorMessage.length) {
                            ret = false;
                            if(showErrorMessage){
                                self.notifier.showErrorNotification(errorMessage);
                            }
                        }
                    }
                }]);
            }
        }
        else{
            if(showErrorMessage){
                self.validationManager.show();
            }
        }
        return ret;
    },
    save: function(onBeforeSaveCallBack){
        var self = this;
        self._ui.resetFormUi(self);

        self.onBeforeSaveCallBack = onBeforeSaveCallBack;
        if(!self.validationManager.validate()){
            self.validationManager.show();
            return false;
        }

        if(self.dynamicCallBacks && self.dynamicCallBacks.executeBeforeSqlOnly){
            self._db.executeBeforeSqlOnly(self);
        }
        else{
            self._db.save(self);
        }
        return self;
    },
    disableSaveAndCancelButtons:function(){
        var self = this;
        self.elements.saveButton.prop('disabled', true);
        self.elements.cancelButton.prop('disabled', true);
        return self;
    },
    enableSaveAndCancelButtons:function(){
        var self = this;
        self.elements.saveButton.prop('disabled', false);
        self.elements.cancelButton.prop('disabled', false);
        return self;
    },
    enableSaveButton: function(){
        var self = this;
        //self.disableSaveButtonCount--;Need to find a better way to resolve errors and disability
//        self.elements.saveButton.prop('disabled', false);
        return self;
    },
    disableSaveButton: function(){
        var self = this;
        //self.disableSaveButtonCount++;    Need to find a better way to resolve errors and disability
//        self.elements.saveButton.prop('disabled', true);
        return self;
    },
    cancel: function(isFromCloseButton){
        var self = this;
        if(isFromCloseButton || self.mode == SimpleDataTableRow.CREATE_MODE){
            self.hide();
        }
        else{
            //self.show(SimpleDataTableRow.VIEW_MODE, self.data.view);
            self.showViewModeFromEditMode();
        }
        return self;
    },
    unloadCurrentMode: function(){
        var self = this;
        //self.lastMode = self.mode;
        switch (self.mode){
            case SimpleDataTableRow.VIEW_MODE:
            case SimpleDataTableRow.EDIT_MODE:
                if(self.displayMode == SimpleDataTableRow.DISPLAY_MODES.INLINE){
                }
                else{
                    self.subModule.buttonManager.selectUnselectAllRows(false);
                    self._animations.simpleDataTableRowOutAnimationView(self, function(){
                        self.container.hide();
                    });
                }
                break;
            case SimpleDataTableRow.CREATE_MODE:
                self._animations.simpleDataTableRowOutAnimationCreate(self, function(){
                    self.container.hide();
                });
                break;
        }
        //self.mode = SimpleDataTableRow.HIDDEN_MODE;
        return self;
    },
    show: function (mode, data, button, dynamicCallBacks, type) {
        var self = this;
        self.disableSaveButtonCount = 0;
        self.mode = mode;
        self.button = button;
        self.container.addClass('simpleDataTableRow-main-'+ mode);
        self.container.show();
        self._ui.resetUi(self);
        if(button && button.typeSpecific && button.typeSpecific.saveButtonText){
            self.elements.saveButton.text(button.typeSpecific.saveButtonText);
        }
        self.dynamicCallBacks = dynamicCallBacks || {};
        if(self.button){
            self.button.disabled = true;
        }
        if(self.dynamicCallBacks.showAsStackedSimpleDataTableRowChild){
            self.container.addClass('stackedView').addClass('child');
        }
        switch (mode){
            case SimpleDataTableRow.CREATE_MODE:
                self.showCreateMode();
                break;
            case SimpleDataTableRow.EDIT_MODE:
                self.showEditMode(self.lastMode === SimpleDataTableRow.VIEW_MODE);
                break;
            case SimpleDataTableRow.VIEW_MODE:
                self.showViewMode(data);
                break;
        }
        self.initializeChosen();
        return self;
    },
    initializeChosen: function(){
        var self = this;

        self.subModule.forEachColumn(function(column){
            column.initializeSimpleDataTableRowChosen(self);
        }, function(column){
            var ret = false;
            if(column.hasChosen && column.hasChosen[self.mode]){
                if(!column.isChosenInitialized[self.mode]){
                    ret = true;
                }
            }
            return ret;
        });
        return self;
    },
    showCreateMode: function(){
        var self = this;
        self.getLookupData(true);
        self._getSet.setDefaultValues(self);
//        self._animations.simpleDataTableRowInAnimationCreate(self);
        self._getSet.enableDisableGetFromParentConditionElements(self);
        if(self.dynamicCallBacks.customCreateModeValues){
            self._getSet.setCustomCreateModeValues(self, self.dynamicCallBacks.customCreateModeValues);
        }
        return self;
    },
    showEditMode: function(isFromViewMode){
        var self = this;
        if(isFromViewMode){
            self.showEditModeFromViewMode();
        }
        self._getSet.setHeaderText(self);
        self._getSet.enableDisableDisableOncePopulatedElements(self);
        if(self.config.onShowEditMode){
            self.config.onShowEditMode.apply(self, [self]);
        }
        return self;
    },
    showEditModeFromViewMode: function(){
        var self = this;
        self._getSet.setEditData(self);
        self._getSet.setHeaderText(self);
        self._animations.simpleDataTableRowInAnimationEditFromView(self);
        if(self.config.onShowEditMode){
            self.config.onShowEditMode.apply(self, [self]);
        }
        self.triggerSimpleDataTableRowDisableFunctionChangeEvent();
        return self;
    },
    triggerSimpleDataTableRowDisableFunctionChangeEvent: function(){
        var self = this;
        self.subModule.forEachColumn(function(column){
            var parernColumns = column.disableFunction.parentColumns.parentColumns
            parernColumns.config.forEach(function(parentColumnId){
                self.subModule.columnManager.columns[parentColumnId.value].triggerSimpleDataTableRowDisableFunctionChangeEvent(self);
            })
        }, function(column){
            var ret = false;
            if(column.disableFunction && column.disableFunction.parentColumns && column.disableFunction.parentColumns.isEnabled){
                ret = true;
            }
            return ret;
        });
        return self;
    },
    showViewModeFromEditMode: function(){
        var self = this;
        self.container.removeClass('simpleDataTableRow-main-edit');
        self.lastMode = self.mode;
        self.mode = SimpleDataTableRow.VIEW_MODE;
        self.container.addClass('simpleDataTableRow-main-'+ self.mode);
        self._db.getOneRowData(self);
        self._getSet.setViewData(self);
        self._getSet.setHeaderText(self);
        self._ui.resetFormUi(self);
        if(self.button){
            self.button.disabled = false;
        }
        self._animations.simpleDataTableRowInAnimationViewFromEdit(self);
        if(self.config.onShowViewMode){
            self.config.onShowViewMode.apply(self, [self]);
        }
        return self;
    },
    setAllLookUpLabelDataForGetOneRowData: function(data){
        var self = this;
        for(var key in data){
            var column = self.subModule.columnManager.columns[key];
            self.data.edit[column.id] = data[key];
            column.setLookupData(data[key], SimpleDataTableRow.VIEW_MODE, {});
//            column.setLookupData(data[key], SimpleDataTableRow.EDIT_MODE, {});
        }
        return self;
    },
    showViewMode: function(data){
        var self = this;
        self.data.view = data;
        self._db.getOneRowData(self);
        self._getSet.setViewData(self);
//        self.getLookupData();
        self._getSet.setHeaderText(self);
        self._animations.simpleDataTableRowInAnimationView(self);
        return self;
    },
    clearValues: function(){
        var self = this;
        console.log(self.container.get(0));
        return self;
    },
    hide: function () {
        var self = this;
        self.unloadCurrentMode();
        if(self.button){
            self.button.disabled = false;
        }
        if(self.config.onHide){
            self.config.onHide.apply(self, [self]);
        }
        self.dynamicCallBacks = {};
        if(self.stackedChildSimpleDataTableRow){
            self.stackedChildSimpleDataTableRow.cancel(true);
            self.stackedChildSimpleDataTableRow = null;
            self.stackedChildColumn = null;
        }
        return self;
    },
    forEach: function(eachFunction, filterFunction){
        var self = this;
        for(var key in self.columns){
            var column = self.columns[key];
            if(filterFunction){
                if(filterFunction(column)){
                    eachFunction.apply(column, [column]);
                }
            }
            else{
                eachFunction.apply(column, [column]);
            }
        }
        return self;
    },
    getElement: function(){
        var self = this;
        return self.element;
    },
    getSocket: function(){
        var self = this;
        var socket = null;
        var current = self;
        while(true){
            if(current.socket){
                socket = current.socket;
                break;
            }
            else{
                current = current.parentObject;
            }
        }
        return socket;
    },
    _animations:{
        simpleDataTableRowInAnimationCreate: function(simpleDataTableRow, callback){
            var self = this;
            simpleDataTableRow.container.css({opacity: .1});
            simpleDataTableRow.elements.divMain.css({scale: 1, rotateX: '-70deg', rotateY: '0deg', translate:'0%'});
            simpleDataTableRow.elements.divMain.transition({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'}, callback);
            simpleDataTableRow.container.transition({opacity: 1});
        },
        simpleDataTableRowOutAnimationCreate: function(simpleDataTableRow, callback){
            var self = this;
            simpleDataTableRow.container.css({opacity: 1});
            simpleDataTableRow.elements.divMain.css({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'});
            simpleDataTableRow.elements.divMain.transition({scale: 1, rotateX: '-70deg', rotateY: '0deg', translate:'0%'}, callback);
            simpleDataTableRow.container.transition({opacity: .1});
        },
        simpleDataTableRowInAnimationView: function(simpleDataTableRow, callback){
            var self = this;
            simpleDataTableRow.container.css({opacity: .1});
            simpleDataTableRow.elements.divMain.css({scale: 1, rotateX: '-70deg', rotateY: '0deg', translate:'0%'});
            simpleDataTableRow.elements.divMain.transition({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'}, callback);
            simpleDataTableRow.container.transition({opacity: 1});
        },
        simpleDataTableRowOutAnimationView: function(simpleDataTableRow, callback){
            var self = this;
            simpleDataTableRow.container.css({opacity: 1});
            simpleDataTableRow.elements.divMain.css({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'});
            simpleDataTableRow.elements.divMain.transition({scale: 1, rotateX: '-70deg', rotateY: '0deg', translate:'0%'}, callback);
            simpleDataTableRow.container.transition({opacity: .1});
        },
        simpleDataTableRowInAnimationEditFromView: function(simpleDataTableRow, callback){
            var self = this;
            //simpleDataTableRow.container.css({opacity: .1});
            simpleDataTableRow.elements.divMain.find('#table_main_container_edit')
                .css({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'+10%'});
            simpleDataTableRow.elements.divMain.css('overflow', 'hidden')
                .find('#table_main_container_edit')
                .transition({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'}, function(){
                    simpleDataTableRow.elements.divMain.css('overflow', 'visible')
                    if(callback){
                        callback();
                    }
                });
            //simpleDataTableRow.container.transition({opacity: 1});
        },
        simpleDataTableRowInAnimationViewFromEdit: function(simpleDataTableRow, callback){
            var self = this;
            //simpleDataTableRow.container.css({opacity: .1});
            simpleDataTableRow.elements.divMain.find('#table_main_container_view')
                .css({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'-10%'});
            simpleDataTableRow.elements.divMain.css('overflow', 'hidden')
                .find('#table_main_container_view')
                .transition({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'}, function(){
                    simpleDataTableRow.elements.divMain.css('overflow', 'visible')
                    if(callback){
                        callback();
                    }
                });
            //simpleDataTableRow.container.transition({opacity: 1});
        }
    },
    getLookupData: function(fromCode){
        var self = this;
        self._lookUp.getLookUpData(self, fromCode);
        return self;
    },
    lookUpParentChanged: function(column, options){
        var self = this;
        self._lookUp.lookUpParentChanged(self, column, options);
        return self;
    },
    _lookUp:{
        initialize: function(simpleDataTableRow, destroy){
            var self = this;
            var socket = simpleDataTableRow.getSocket();

            if(!destroy){
                socket.on(simpleDataTableRow.socketEvents.getLookUpDataForCreateModeDone, getLookUpDataForCreateModeDoneListener);
                socket.on(simpleDataTableRow.socketEvents.getLookUpDataForEditModeDone, getLookUpDataForEditModeDoneListener );
                simpleDataTableRow.subModule.forEachColumn(function(column){
                    var listenStr = simpleDataTableRow.socketEvents['lookUpParentChangedDone_'+column.id];
                    socket.on(listenStr, lookUpParentChangedDoneListener);
                },function(column){
                    var ret = false;
                    if(column.childColumns && column.childColumns.length){
                        ret = true;
                    }
                    return ret;
                });
            }
            else{
                socket.removeListener(simpleDataTableRow.socketEvents.getLookUpDataForCreateModeDone, getLookUpDataForCreateModeDoneListener);
                socket.removeListener(simpleDataTableRow.socketEvents.getLookUpDataForEditModeDone, getLookUpDataForEditModeDoneListener );
                simpleDataTableRow.subModule.forEachColumn(function(column){
                    var listenStr = simpleDataTableRow.socketEvents['lookUpParentChangedDone_'+column.id];
                    socket.removeListener(listenStr, lookUpParentChangedDoneListener);
                },function(column){
                    var ret = false;
                    if(column.childColumns && column.childColumns.length){
                        ret = true;
                    }
                    return ret;
                });
            }


            function getLookUpDataForCreateModeDoneListener(data){
                if(data.simpleDataTableRowId != simpleDataTableRow.id){
                    return;
                }
                self.lookUpData_done(simpleDataTableRow, data, function(simpleDataTableRow, data){
                    for(var key in data.data){
                        var column = simpleDataTableRow.columns[key];
                        if( column.typeSpecific.children && column.typeSpecific.children.length){
                            column.triggerSimpleDataTableRowElementChange(simpleDataTableRow.mode);
                        }
                    }
                });
                if(simpleDataTableRow.dynamicCallBacks.customCreateModeValues){
                    for(var key in data.result){
                        var column = simpleDataTableRow.columns[key];
                        column.setSimpleDataTableRowEditValue(simpleDataTableRow.dynamicCallBacks.customCreateModeValues, simpleDataTableRow.mode);
                        var callbackFunction = function(simpleDataTableRow, childData){
                            if(childData.success){
                                for(var childKey in childData.result){
                                    var childColumn = simpleDataTableRow.columns[childKey];
                                    childColumn.setSimpleDataTableRowEditValue(simpleDataTableRow.dynamicCallBacks.customCreateModeValues, simpleDataTableRow);
                                    childColumn.triggerSimpleDataTableRowElementChange(simpleDataTableRow, {
                                        callback: callbackFunction
                                    });
                                }
                            }
                        };
                        column.triggerSimpleDataTableRowElementChange(simpleDataTableRow.mode, {
                            callback: callbackFunction
                        });
                        //Continue Work here. Second level child lookup should work also
                    }
                }
            }
            function getLookUpDataForEditModeDoneListener(data){
                if(data.simpleDataTableRowId != simpleDataTableRow.id){
                    return;
                }
                self.lookUpData_done(simpleDataTableRow, data, function(simpleDataTableRow, data){
                });
            }
            function lookUpParentChangedDoneListener(data){
                if(data.simpleDataTableRowId != simpleDataTableRow.id){
                    return;
                }
                self.lookUpParentChanged_done(simpleDataTableRow, data, {});
            }

            return self;
        },
        lookUpParentChanged: function(simpleDataTableRow, column, options){
            var self = this;
            var socket = simpleDataTableRow.getSocket();
            var requestId = crypto.getRandomValues(new Uint16Array(1))[0];
            var eventsObj = {};
            var data = {};
            data.formView = {};
            var simpleDataTableRowMode = simpleDataTableRow.mode;
            if(simpleDataTableRowMode == SimpleDataTableRow.VIEW_MODE){
                simpleDataTableRowMode = SimpleDataTableRow.EDIT_MODE;
            }
            data.formView.mode = simpleDataTableRowMode;
            if(options && options.useDbData){
                data.formView.data = self.dataToLookUpRequest(simpleDataTableRow.data.edit);
            }
            else{
                data.formView.data = simpleDataTableRow.getFormData();
            }
            if(simpleDataTableRow.parentFormView){
                data.parentFormView = {
                    data: simpleDataTableRow.parentFormView.getFormData(),
                    subModuleId:  simpleDataTableRow.parentSubModule.id,
                    moduleId:  simpleDataTableRow.parentSubModule.module.id
                };
            }
            data.column = self.toLookUpRequest(simpleDataTableRow, column);
            data.requestId = requestId;
            data.simpleDataTableRowId = simpleDataTableRow.id;
            eventsObj.options = options;
            eventsObj.callback = options.callback;
            socket.simpleDataTableRow.events[requestId] = eventsObj;
//            column.fadeOutChildColumnsInSimpleDataTableRow(simpleDataTableRowMode);
//            console.log(simpleDataTableRow.socketEvents['lookUpParentChanged_'+ column.id], data)
//             socket.emit(simpleDataTableRow.socketEvents['lookUpParentChanged_'+ column.id], data);
            simpleDataTableRow.subModule.do_ajax_request_legacy('lookUpParentChanged_'+ column.id, data, (a_err, response_data)=>{
                // console.log('lookUpParentChanged_done', data, response_data)
                console.log('dbl check here aki simpleDataTableRow, is submodule passing value ??')
                self.lookUpParentChanged_done(simpleDataTableRow, response_data);
            });
            return self;
        },
        lookUpParentChanged_done: function(simpleDataTableRow, data, options){
            var self = this;
//            column.fadeInChildColumnsInSimpleDataTableRow(simpleDataTableRow.mode);
            if(data.error){
                simpleDataTableRow.notifier.showReportableErrorNotification(data.errorMessage);
                return self;
            }
            var lookUpData = data.result;
            for(var key in lookUpData){
                var column = simpleDataTableRow.columns[key];
                var mode = simpleDataTableRow.mode;
                if(simpleDataTableRow.mode === SimpleDataTableRow.VIEW_MODE){
                    mode = SimpleDataTableRow.EDIT_MODE;
                }
                if(mode == SimpleDataTableRow.EDIT_MODE){
//                    var currentEditValue = simpleDataTableRow.data.edit[column.id];
//                    if(currentEditValue.value == null){
                    column.setLookupData(lookUpData[key], mode, options);
//                    }
                }
                else{
                    column.setSimpleDataTableRowLookupData(lookUpData[key], simpleDataTableRow, options);
                }
//                column.fadeInSimpleDataTableRowElement(mode);
            }
            var socket = simpleDataTableRow.getSocket();
            var eventsObj = socket.simpleDataTableRow.events[data.requestId];
            if(eventsObj && eventsObj.callback){
                eventsObj.callback.apply(simpleDataTableRow, [simpleDataTableRow, data]);
            }
            return self;
        },
        getLookUpData: function(simpleDataTableRow, fromCode){
            var self = this;
            switch(simpleDataTableRow.mode){
                case SimpleDataTableRow.CREATE_MODE:
                    if(!simpleDataTableRow.parentObject.hasLookUpDataForCreateMode){
                        simpleDataTableRow.parentObject.hasLookUpDataForCreateMode = true;
                        self.getLookUpDataForCreateMode(simpleDataTableRow, fromCode);
                    }
                    break;
                case SimpleDataTableRow.VIEW_MODE:
                    self.getLookUpDataForEditMode(simpleDataTableRow, fromCode);
                    break;
            }
            return self;
        },
        lookUpData_done: function(simpleDataTableRow, data, callback){
            var self = this;
            if(data.error){
                simpleDataTableRow.notifier.showErrorNotification(data.errorMessage)
            }
            else{
                for(var key in data.result){
//                console.log(data)
                    var column = simpleDataTableRow.subModule.columnManager.columns[key];
                    var mode = SimpleDataTableRow.CREATE_MODE;
                    if(simpleDataTableRow.mode === SimpleDataTableRow.VIEW_MODE){
                        mode = SimpleDataTableRow.EDIT_MODE;
                    }
                    column.setSimpleDataTableRowLookupData(data.result[key], simpleDataTableRow);
                    if(callback){
                        callback(simpleDataTableRow, data);
                    }
                }
            }
        },
        getLookUpDataForCreateMode: function(simpleDataTableRow, fromCode){
            var self = this;
            var columns = [];
            simpleDataTableRow.subModule.columnManager.forEachColumnType( Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST, function(column){
                columns.push(self.toLookUpRequest(simpleDataTableRow, column));
            });
            var data = {};
            data.formView = {};
            data.formView.mode = simpleDataTableRow.mode;
            data.columns = columns;
            data.simpleDataTableRowId = simpleDataTableRow.id;

            var socket = simpleDataTableRow.getSocket();
            socket.emit(simpleDataTableRow.socketEvents.getLookUpDataForCreateMode, data);
            return self;
        },
        getLookUpDataForEditMode: function(simpleDataTableRow, fromCode){
            var self = this;
            var columns = [];
            simpleDataTableRow.subModule.columnManager.forEachColumnType( Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST, function(column){
                columns.push(self.toLookUpRequest(simpleDataTableRow, column));
            });
            var data = {};
            data.formView = {};
            data.formView.mode = simpleDataTableRow.mode;
            data.columns = columns;
            var socket = simpleDataTableRow.getSocket();
            throw 'No need to get lookup data for edit mode'
            socket.emit(simpleDataTableRow.socketEvents.getLookUpDataForEditMode, data);
            return self;
        },
        toLookUpRequest: function(simpleDataTableRow, column){
            return {id: column.id};
        },
        dataToLookUpRequest: function(data){
            var obj = {};
            for(var key in data){
                var value = data[key];
                if(value != null){
                    if(typeof (value === 'object')){
                        obj[key] = value.value;
                    }
                    else{
                        obj[key] = value;
                    }
                }
            }
            return obj;
        }
    },
    _db: {
        initialize: function(simpleDataTableRow, destroy){
            var socket = simpleDataTableRow.getSocket();

            if(!destroy){
                socket.on(simpleDataTableRow.socketEvents.insertRowDone, insertRowDoneListener);
                socket.on(simpleDataTableRow.socketEvents.executeBeforeSqlOnlyInsertDone, executeBeforeSqlOnlyInsertDoneListener);
                socket.on(simpleDataTableRow.socketEvents.updateRowDone, updateRowDoneListener);
                socket.on(simpleDataTableRow.socketEvents.getOneRowDataDone, getOneRowDataDoneListener);
            }
            else{
                socket.removeListener(simpleDataTableRow.socketEvents.insertRowDone, insertRowDoneListener);
                socket.removeListener(simpleDataTableRow.socketEvents.executeBeforeSqlOnlyInsertDone, executeBeforeSqlOnlyInsertDoneListener);
                socket.removeListener(simpleDataTableRow.socketEvents.updateRowDone, updateRowDoneListener);
                socket.removeListener(simpleDataTableRow.socketEvents.getOneRowDataDone, getOneRowDataDoneListener);
            }

            function insertRowDoneListener(data){
                simpleDataTableRow._db.insert_done(simpleDataTableRow, data);
            }
            function executeBeforeSqlOnlyInsertDoneListener(data){
                simpleDataTableRow._db.executeBeforeSqlOnlyInsert_done(simpleDataTableRow, data);
            }
            function updateRowDoneListener(data){
                simpleDataTableRow._db.updateRow_done(simpleDataTableRow, data);
            }
            function getOneRowDataDoneListener(data){
                simpleDataTableRow._db.getOneRowData_done(simpleDataTableRow, data);
            }


        },
        save: function(simpleDataTableRow){
            var self = this;
            switch(simpleDataTableRow.mode){
                case SimpleDataTableRow.CREATE_MODE:
                    self.insert(simpleDataTableRow);
                    break;
                case SimpleDataTableRow.EDIT_MODE:
                    self.updateRow(simpleDataTableRow);
                    break;
            }
            return self;
        },
        insert: function(simpleDataTableRow){
            var self = this;
            var formData = simpleDataTableRow._getSet.getFormData(simpleDataTableRow);
            var socket =simpleDataTableRow.getSocket();
//            var emitStr = 'insertRow_'+ simpleDataTableRow.subModule.id;
            var data = {config: formData};

            var onSaveValidationFunction = simpleDataTableRow.onSaveValidationFunctions[SimpleDataTableRow.CREATE_MODE];
            if(onSaveValidationFunction ){
                onSaveValidationFunction.apply(simpleDataTableRow, [formData,  function(errorMessage){
                    if(typeof errorMessage !== 'undefined'){
                        if(errorMessage.length){
                            simpleDataTableRow.notifier.showErrorNotification(errorMessage);
                        }
                        else{
                            if(simpleDataTableRow.onBeforeSaveCallBack){
                                if(!simpleDataTableRow.onBeforeSaveCallBack.apply(simpleDataTableRow, [formData, simpleDataTableRow])){
                                    return;
                                }
                            }
                            data.buttonId = simpleDataTableRow.button.id;
                            simpleDataTableRow.disableSaveAndCancelButtons();
                            //socket.emit(simpleDataTableRow.socketEvents.insertRow, data);
                            socket.emit(simpleDataTableRow.socketEvents.insertRow, data);
                        }
                    }
                }]);
            }

            return self;
        },
        insert_done: function(simpleDataTableRow, data){
            var self = this;
            simpleDataTableRow.enableSaveAndCancelButtons();
            if(data.success){
                simpleDataTableRow.notifier.showSuccessNotification(data.successMessage);
                var ret = false;
                if(simpleDataTableRow.dynamicCallBacks && simpleDataTableRow.dynamicCallBacks.onAfterInsert){
                    ret = !simpleDataTableRow.dynamicCallBacks.onAfterInsert.apply(simpleDataTableRow, [data.result, simpleDataTableRow]);
                }
                if(ret){
                    return;
                }
                if(!simpleDataTableRow.hasParentSimpleDataTableRow){
                    if(!simpleDataTableRow.subModule.simpleDataTableRowOnlyMode){
                        simpleDataTableRow.subModule.setDisplayMode();
                    }
                }
                if(simpleDataTableRow.simpleDataTableRowType != 'directCreate'){
                    if(simpleDataTableRow.displayMode !== SimpleDataTableRow.DISPLAY_MODES.INLINE){
                        simpleDataTableRow.hide();
                    }
                }

            }
            else{
                simpleDataTableRow.notifier.showReportableErrorNotification(data.errorMessage);
            }
        },

        executeBeforeSqlOnly: function(simpleDataTableRow){
            var self = this;
            switch(simpleDataTableRow.mode){
                case SimpleDataTableRow.CREATE_MODE:
                    self.executeBeforeSqlOnlyInsert(simpleDataTableRow);
                    break;
                case SimpleDataTableRow.EDIT_MODE:
                    console.error('Not yet implemented');
                    break;
            }
            return self;
        },
        executeBeforeSqlOnlyInsert: function(simpleDataTableRow){
            var self = this;
            var formData = simpleDataTableRow._getSet.getFormData(simpleDataTableRow);
            var socket =simpleDataTableRow.getSocket();
            var data = {config: formData};
            var onSaveValidationFunction = simpleDataTableRow.onSaveValidationFunctions[SimpleDataTableRow.CREATE_MODE];
            if(onSaveValidationFunction ){
                onSaveValidationFunction.apply(simpleDataTableRow, [formData,  function(errorMessage){
                    if(typeof errorMessage !== 'undefined'){
                        if(errorMessage.length){
                            simpleDataTableRow.notifier.showErrorNotification(errorMessage);
                        }
                        else{
                            data.buttonId = simpleDataTableRow.button.id;
                            simpleDataTableRow.disableSaveAndCancelButtons();
                            socket.emit(simpleDataTableRow.socketEvents.executeBeforeSqlOnlyInsert, data);
                        }
                    }
                }]);
            }
            return self;
        },
        executeBeforeSqlOnlyInsert_done: function(simpleDataTableRow, data){
            var self = this;
            simpleDataTableRow.enableSaveAndCancelButtons();
            if(data.success){
                if(simpleDataTableRow.dynamicCallBacks && simpleDataTableRow.dynamicCallBacks.onBeforeInsert){
                    var formTextData = simpleDataTableRow._getSet.getFormTextData(simpleDataTableRow);
                    var formData = simpleDataTableRow._getSet.getFormData(simpleDataTableRow);
                    if(!simpleDataTableRow.dynamicCallBacks.onBeforeInsert.apply(simpleDataTableRow, [formData, formTextData, simpleDataTableRow])){
                        return;
                    }
                }
            }
            else{
                simpleDataTableRow.notifier.showReportableErrorNotification(data.errorMessage);
            }
        },

        updateRow: function(simpleDataTableRow){
            var self = this;
            var formData = simpleDataTableRow._getSet.getFormData(simpleDataTableRow);
            self.refreshDisableValueEditMode(simpleDataTableRow);
            var socket =simpleDataTableRow.getSocket();
            var obj = {};
            obj.id = simpleDataTableRow.data.edit.id;
            obj.buttonId = simpleDataTableRow.button.id;
            obj.config = formData;
            simpleDataTableRow.disableSaveAndCancelButtons();
            socket.emit(simpleDataTableRow.socketEvents.updateRow, obj);
            return self;
        },
        refreshDisableValueEditMode: function(simpleDataTableRow){
            var self = this;
            simpleDataTableRow.subModule.forEachColumn(function(column){
                column.valueWhenDisabledEditMode = '';
            });
            return self;
        },
        updateRow_done: function(simpleDataTableRow, data){
            var self = this;
            simpleDataTableRow.enableSaveAndCancelButtons();
            if(data.success){
                simpleDataTableRow.notifier.showSuccessNotification('Update Successful');
//                var eventsObj = {};
//                eventsObj.options = {id: simpleDataTableRow.data.edit.id};
//                eventsObj.callback = function(grid, data){
//                    grid._animations.rowBlinkAnimation(grid, data);
//                };
//                if(simpleDataTableRow.displayMode !== SimpleDataTableRow.DISPLAY_MODES.INLINE){
                simpleDataTableRow.hide();
//                }
                simpleDataTableRow.subModule.setDisplayMode();
            }
            else{
                simpleDataTableRow.notifier.showReportableErrorNotification('Error Saving To Database');
            }
        },
        getOneRowData: function(simpleDataTableRow){
            var self = this;
            var socket =simpleDataTableRow.getSocket();
            var formData = {
                id: simpleDataTableRow.data.view['id']
            };
            socket.emit(simpleDataTableRow.socketEvents.getOneRowData, {config: formData});
            return self;
        },
        getOneRowData_done: function(simpleDataTableRow, data){
            var self = this;
            if(data.success){
                simpleDataTableRow.data.edit = data.result.data;
                simpleDataTableRow.data.view = data.result.data;
                simpleDataTableRow._getSet.setViewData(simpleDataTableRow);
                simpleDataTableRow.enableDisableHeaderButtons();
            }
            else{
                simpleDataTableRow.notifier.showReportableErrorNotification('Error Getting Data From Database');
            }
            return self;
        }
    },
    calculatedValueParentChanged: function(column, options){
        var self = this;
        self._calculatedValue.calculatedValueParentChanged(self, column, options);
        return self;
    },
    disableFunctionParentChanged: function(column, options){
        var self = this;
        self._disableFunction.disableFunctionParentChanged(self, column, options);
        return self;
    },
    _disableFunction: {
        disableFunctionParentChanged: function(simpleDataTableRow, column, options){
            var self = this;

            var formData = simpleDataTableRow.getFormDataWithParsedValues();
            var childColumn = options.childColumn;
            if(simpleDataTableRow.mode === FormView.CREATE_MODE){
                if(childColumn.disableFunctions && childColumn.disableFunctions.create){
                    childColumn.disableFunctions.create.apply(column, [formData, function(ret){
                        if(typeof ret !== 'undefined'){
                            if(ret){
                                if(childColumn.getSimpleDataTableRowElement(simpleDataTableRow)){
                                    if(!childColumn.disableFunction.defaultValue){
                                        childColumn.valueWhenDisabledCreateMode = childColumn.getSimpleDataTableRowElementValue(simpleDataTableRow);
                                    }
                                    childColumn.setSimpleDataTableRowEditValue(null, simpleDataTableRow, (childColumn.disableFunction.defaultValue || ''));
                                    childColumn.getSimpleDataTableRowElementHolder(simpleDataTableRow).hide()
                                }
                            }
                            else{
                                if(childColumn.getSimpleDataTableRowElement(simpleDataTableRow)){
                                    if(childColumn.valueWhenDisabledCreateMode){
                                        childColumn.setSimpleDataTableRowEditValue(null, simpleDataTableRow, childColumn.valueWhenDisabledCreateMode);
                                        childColumn.valueWhenDisabledCreateMode = '';
                                        if(childColumn.disableFunction && childColumn.disableFunction.defaultValue){
                                            childColumn.valueWhenDisabledCreateMode = childColumn.disableFunction.defaultValue;
                                        }
                                    }
                                    childColumn.getSimpleDataTableRowElementHolder(simpleDataTableRow).show()
                                }
                            }
                        }
                    }]);
                }
            }
            else if(simpleDataTableRow.mode === FormView.EDIT_MODE){
                if(childColumn.disableFunctions && childColumn.disableFunctions.update){
                    childColumn.disableFunctions.update.apply(column, [formData, simpleDataTableRow.data.edit, function(ret){
                        if(typeof ret !== 'undefined'){
                            if(ret){
                                if(childColumn.getSimpleDataTableRowElement){
                                    if(!childColumn.disableFunction.defaultValue){
                                        childColumn.valueWhenDisabledEditMode = childColumn.getSimpleDataTableRowElementValue(simpleDataTableRow);
                                    }
                                    childColumn.setSimpleDataTableRowEditValue(null, simpleDataTableRow, (childColumn.disableFunction.defaultValue || ''));
                                    childColumn.getSimpleDataTableRowElement(simpleDataTableRow).hide()
                                }
                            }
                            else{
                                if(childColumn.getSimpleDataTableRowElement){
                                    if(childColumn.valueWhenDisabledEditMode){
                                        childColumn.setSimpleDataTableRowEditValue(null, simpleDataTableRow, childColumn.valueWhenDisabledEditMode);
                                        childColumn.valueWhenDisabledEditMode = '';
                                        if(childColumn.disableFunction && childColumn.disableFunction.defaultValue){
                                            childColumn.valueWhenDisabledEditMode = childColumn.disableFunction.defaultValue;
                                        }
                                    }
                                    childColumn.getSimpleDataTableRowElement(simpleDataTableRow).show()
                                }
                            }
                        }
                    }]);
                }
            }
            return self;
        }
    },
    _calculatedValue:{
        calculatedValueParentChanged: function(simpleDataTableRow, column, options){
            var self = this;

            var formData = simpleDataTableRow.getFormDataWithParsedValues();
            var childColumn = options.childColumn;
            if(simpleDataTableRow.mode === SimpleDataTableRow.CREATE_MODE){
                if(childColumn.calculatedValueFunctions && childColumn.calculatedValueFunctions.create){
                    childColumn.calculatedValueFunctions.create.apply(column, [formData, function(ret){
                        if(typeof ret !== 'undefined'){
                            var currentValue = childColumn.getSimpleDataTableRowValue(simpleDataTableRow);
                            if(currentValue == ret){

                            }
                            else{
                                childColumn.setSimpleDataTableRowEditValue(null, simpleDataTableRow, ret, {triggerChange: true});
                            }
                        }
                    }]);
                }
            }
            else if(simpleDataTableRow.mode === SimpleDataTableRow.EDIT_MODE){
                if(childColumn.calculatedValueFunctions && childColumn.calculatedValueFunctions.update){
                    childColumn.calculatedValueFunctions.update.apply(column, [formData, simpleDataTableRow.data.edit, function(ret){
                        if(typeof ret !== 'undefined'){
                            var currentValue = childColumn.getSimpleDataTableRowValue(simpleDataTableRow);
                            if(currentValue == ret){

                            }
                            else{
                                childColumn.setSimpleDataTableRowEditValue(null, simpleDataTableRow, ret, {triggerChange: true});
                            }
                        }
                    }]);
                }
            }
            return self;
        }
    },
    getFormData: function(){
        var self = this
        return self._getSet.getFormData(self);
    },
    getFormDataWithParsedValues: function(){
        var self = this
        return self._getSet.getFormData(self);
    },
    unBindGetDataFromParentEvents: function(){
        var self = this;
        self.forEach(function(col){
            col.unBindSimpleDataTableRowGetDataFromParentEvents(self);
        }, function(col){
            var ret = false;
            if(col.getFromParentCondition1 && col.getFromParentCondition1.isEnabled){
                ret = true;
            }
            else if(col.getFromParentCondition2 && col.getFromParentCondition2.isEnabled){
                ret = true;
            }
            else if(col.getFromParentCondition3 && col.getFromParentCondition3.isEnabled){
                ret = true;
            }
            return ret;
        });
        return self;
    },
    bindGetDataFromParentEvents: function(){
        var self = this;
        self.forEach(function(col){
            col.bindSimpleDataTableRowGetDataFromParentEvents(self, function(){
                col.setSimpleDataTableRowDefaultValue(self);
                col.triggerSimpleDataTableRowElementChange(self, {
                    fromCode: true, useDbData: false
                });
            });
        }, function(col){
            var ret = false;
            if(col.getFromParentCondition1 && col.getFromParentCondition1.isEnabled){
                ret = true;
            }
            else if(col.getFromParentCondition2 && col.getFromParentCondition2.isEnabled){
                ret = true;
            }
            else if(col.getFromParentCondition3 && col.getFromParentCondition3.isEnabled){
                ret = true;
            }
            return ret;
        });
        return self;
    },
    _getSet:{
        resetForm: function(simpleDataTableRow){
            var self = this;
            // Need to change to a reset function in every column object, like in Editor
            simpleDataTableRow.container.find('input:not(:radio),textarea').val(null);
            simpleDataTableRow.container.find('.simpleDataTableRow-disabled-column').text('');
            simpleDataTableRow.container.find('input[type="checkbox"]').prop('checked', false);
            simpleDataTableRow.container.find('.imgElement').removeAttr('title').css('background-image', '');
            simpleDataTableRow.container.find('.imageInputElement').removeData('changed').val(null);
            simpleDataTableRow.container.find('select').each(function(){
                if(this.options.length){
                    this.options.selectedIndex = 0;
                }
            })//.change();

            if(simpleDataTableRow.mode === SimpleDataTableRow.CREATE_MODE){
            }
            return self;
        },
        getFormData: function(simpleDataTableRow, parseToDataType){
            var self = this;
            var columns = simpleDataTableRow.columns;
            var formData;
            switch (simpleDataTableRow.mode){
                case SimpleDataTableRow.CREATE_MODE:
                    formData = self.getFormDataFromCreateMode(simpleDataTableRow);
                    break;
                case SimpleDataTableRow.EDIT_MODE:
                    formData = self.getFormDataFromEditMode(simpleDataTableRow);
                    break;
                case SimpleDataTableRow.VIEW_MODE:
                    formData = simpleDataTableRow.data.edit;
                    break;
            }

            return formData;
        },
        getFormDataFromCreateMode: function(simpleDataTableRow){
            var self = this;
            var formData = {};
            simpleDataTableRow.subModule.forEachColumn(function(column){
                if(column.disableCondition.disabled){
                    formData[column.id] = column.defaultValue;
                }
                else{
                    formData[column.id] = column.getSimpleDataTableRowElementValue(simpleDataTableRow);
                }
                column.valueWhenDisabledCreateMode = '';
            });

            simpleDataTableRow.subModule.forEachColumn(function(column){
                var container = simpleDataTableRow.formElements[column.id];
                var elements = {
                    imgElement: container.find('.imgElement'),
                    inputElement: container.find('input')
                };
                //= column.hasImage[simpleDataTableRow.mode];
                var fileName = elements.imgElement.attr('title');
                if(fileName){
                    var obj = elements.imgElement.data('fs');
                    obj.fileName = fileName;
                    obj.changed = elements.inputElement.data('changed');
                    formData[column.id] = obj;
                }
                else{
                    formData[column.id] = {};
                }
            }, function(column){
                var ret = false;
                if(column.type === Column.COLUMN_TYPES.IMAGE){
                    ret = true;
                }
                return ret;
            });

            simpleDataTableRow.subModule.forEachColumn(function(column){
                var container = simpleDataTableRow.formElements[column.id];
                var elements = {
                    documentElement: container.find('.documentElement'),
                    inputElement: container.find('input')
                };
                var fileName = elements.documentElement.attr('title');
                if(fileName){
                    var obj = elements.documentElement.data('fs');
                    obj.fileName = fileName;
                    obj.changed = elements.inputElement.data('changed');
                    formData[column.id] = obj;
                }
                else{
                    formData[column.id] = {};
                }
            }, function(column){
                var ret = false;
                if(column.type === Column.COLUMN_TYPES.DOCUMENT){
                    ret = true;
                }
                return ret;
            });

            simpleDataTableRow.subModule.forEachColumn(function(column){
                formData[column.id] = column.simpleDataTables[simpleDataTableRow.mode].getData();
            }, function(column){
                var ret = false;
                if(column.type === Column.COLUMN_TYPES.HYPERLINK && column.typeSpecific.displayAsSubForm){
                    ret = true;
                }
                return ret;
            });
            return formData;
        },
        getFormDataFromEditMode: function(simpleDataTableRow){
            var self = this;
            var formData = {};
            simpleDataTableRow.forEach(function(column){
                formData[column.id] = column.getSimpleDataTableRowElementValue(simpleDataTableRow);
                column.valueWhenDisabledEditMode = '';
            }, function(column){
                var disabled = false;
                if(column.disabled){
                    disabled = true;
                }
                else if(column.disabledInEditMode){
                    disabled = true;
                }
                return !disabled;
            });

            throw 'not yet implemented for edit mode simple data table row';

            simpleDataTableRow.subModule.forEachColumn(function(column){
                var elements = formData[column.id] = column.hasImage[simpleDataTableRow.mode];
                var changed = elements.inputElement.data('changed');
                var obj = elements.imgElement.data('fs') || {};
                obj.changed = changed;
                if(changed){
                    obj.fileName = elements.imgElement.attr('title');
                }
                formData[column.id] = obj;
            }, function(column){
                var ret = false;
                if(column.type === Column.COLUMN_TYPES.IMAGE){
                    ret = true;
                }
                return ret;
            });

            simpleDataTableRow.subModule.forEachColumn(function(column){
                var elements = formData[column.id] = column.hasImage[simpleDataTableRow.mode];
                var changed = elements.inputElement.data('changed');
                var obj = elements.documentElement.data('fs') || {};
                obj.changed = changed;
                if(changed){
                    obj.fileName = elements.imgElement.attr('title');
                }
                formData[column.id] = obj;
            }, function(column){
                var ret = false;
                if(column.type === Column.COLUMN_TYPES.DOCUMENT){
                    ret = true;
                }
                return ret;
            });

            formData.id = simpleDataTableRow.data.edit.id;
            return formData;
        },
        setViewData: function(simpleDataTableRow, columnIds, data){
            var self = this;
            if(!data){
                data = simpleDataTableRow.data.view;
            }
            if(columnIds){
                for(var key in columnIds){
                    var column = simpleDataTableRow.subModule.columnManager.columns[key];
                    column.setSimpleDataTableRowDisplayValue(data, simpleDataTableRow.mode);
                }
            }
            else{
                simpleDataTableRow.forEach(function(col){
                    col.setSimpleDataTableRowDisplayValue(data, simpleDataTableRow.mode);
                }, function(col){
                    return !col.getSimpleDataTableRowPosition(simpleDataTableRow.mode).isHidden;
                });
            }
            return self;
        },
        setEditData: function(simpleDataTableRow, columnIds, data){
            var self = this;

            if(!data){
                data = simpleDataTableRow.data.edit;
            }
            if(columnIds){
                for(var key in columnIds){
                    var column = simpleDataTableRow.subModule.columnManager.columns[key];
                    column.setSimpleDataTableRowEditValue(data, SimpleDataTableRow.EDIT_MODE);
                }
            }
            else{
                simpleDataTableRow.subModule.columnManager.forEachColumn(function(col){
                    col.setSimpleDataTableRowEditValue(data, SimpleDataTableRow.EDIT_MODE);
                    if( col.typeSpecific.children && col.typeSpecific.children.length){
                        col.triggerSimpleDataTableRowElementChange(SimpleDataTableRow.EDIT_MODE, {fromCode: true, useDbData: true});
                    }
                }, function(col){
                    //var ret = !col.getSimpleDataTableRowPosition(SimpleDataTableRow.EDIT_MODE).isHidden;
                    return true;
//                    return ret;
                });
            }
            return self;
        },
        getFormTextData: function(simpleDataTableRow, parseToDataType){
            var self = this;
            var columns = simpleDataTableRow.columns;
            var formTextData;
            switch (simpleDataTableRow.mode){
                case SimpleDataTableRow.CREATE_MODE:
                    formTextData = self.getFormTextDataFromCreateMode(simpleDataTableRow);
                    break;
            }

            return formTextData;
        },
        getFormTextDataFromCreateMode: function(simpleDataTableRow){
            var self = this;
            var formTextData = {};
            simpleDataTableRow.forEach(function(column){
                if(column.disableCondition.disabled){
                    formTextData[column.id] = column.defaultValue;
                }
                else{
                    //formData[column.id] = column.getSimpleDataTableRowElement(simpleDataTableRow.mode).val();
                    formTextData[column.id] = column.getSimpleDataTableRowElementTextValue(simpleDataTableRow);
                    column.valueWhenDisabledCreateMode = '';
                }
            });

//            simpleDataTableRow.subModule.forEachColumn(function(column){
//                var elements = formData[column.id] = column.hasImage[simpleDataTableRow.mode];
//                var fileName = elements.imgElement.attr('title');
//                if(fileName){
//                    var obj = elements.imgElement.data('fs');
//                    obj.fileName = fileName;
//                    obj.changed = elements.inputElement.data('changed');
//                    formData[column.id] = obj;
//                }
//                else{
//                    formData[column.id] = {};
//                }
//            }, function(column){
//                var ret = false;
//                if(column.type === Column.COLUMN_TYPES.IMAGE){
//                    ret = true;
//                }
//                return ret;
//            });

//            simpleDataTableRow.subModule.forEachColumn(function(column){
//                formData[column.id] = column.simpleDataTables[simpleDataTableRow.mode].getData();
//            }, function(column){
//                var ret = false;
//                if(column.type === Column.COLUMN_TYPES.HYPERLINK && column.typeSpecific.displayAsSubForm){
//                    ret = true;
//                }
//                return ret;
//            });
            return formTextData;
        },
        setCustomCreateModeValues: function(simpleDataTableRow, dataRow){
            var self = this;
            simpleDataTableRow.forEach(function(col){
//                if(col.type == 'lookUpLabel'){
//
//                }
//                else{
//
//                }
                if(dataRow[col.id] != undefined){
                    col.setSimpleDataTableRowEditValue(dataRow,simpleDataTableRow.mode);
                }
//                col.setSimpleDataTableRowDefaultValue(simpleDataTableRow);
                if( col.typeSpecific.children && col.typeSpecific.children.length){
//                    console.log('triggering change', col.id)
                    col.triggerSimpleDataTableRowElementChange(simpleDataTableRow.mode, {fromCode: true, useDbData: true});
                }
                else if (col.childColumns &&col.childColumns.length){
//                    console.log('triggering change', col.id)
                    col.triggerSimpleDataTableRowElementChange(simpleDataTableRow.mode);
                }
            }, function(col){
                var ret = false;
                if(!col.isDisabledInSimpleDataTableRow(simpleDataTableRow.mode)){
                    ret = true;
                }
                return ret;
            });
            return self;
        },
        setDefaultValues: function(simpleDataTableRow){
            var self = this;
            simpleDataTableRow.forEach(function(col){
                col.setSimpleDataTableRowDefaultValue(simpleDataTableRow);
//                if( col.typeSpecific.children && col.typeSpecific.children.length){
                col.triggerSimpleDataTableRowElementChange(simpleDataTableRow, {fromCode: true, useDbData: false});
//                }
            }, function(col){
                var ret = false;
                if(col.getFromParentCondition1 && col.getFromParentCondition1.isEnabled){
                    ret = true;
                }
                else if(col.getFromParentCondition2 && col.getFromParentCondition2.isEnabled){
                    ret = true;
                }
                else if(col.getFromParentCondition3 && col.getFromParentCondition3.isEnabled){
                    ret = true;
                }
                else if(typeof(col.defaultValue)!== 'undefined'){
                    ret = true;
                }
                return ret;
            });
            return self;
        },
        enableDisableGetFromParentConditionElements: function(simpleDataTableRow){
            var self = this;
            if(!simpleDataTableRow.tempDisabledFromViewElements){
                simpleDataTableRow.tempDisabledFromViewElements = {};
            }
            if(simpleDataTableRow.tempDisabledFromViewElements[simpleDataTableRow.mode]){
                simpleDataTableRow.tempDisabledFromViewElements[simpleDataTableRow.mode].forEach(function(column){
                    column.enableSimpleDataTableRowElement(simpleDataTableRow.mode, simpleDataTableRow);
                });
            }
            simpleDataTableRow.tempDisabledFromViewElements[simpleDataTableRow.mode] = [];
            simpleDataTableRow.forEach(function(column){
                var parentValue = column.parseGetFromParentCondition(simpleDataTableRow);
                if(parentValue != null){
                    simpleDataTableRow.tempDisabledFromViewElements[simpleDataTableRow.mode].push(column);
                    column.disableSimpleDataTableRowElement(simpleDataTableRow.mode, simpleDataTableRow);
                }
            }, function(col){
                var ret = false;
                if(!col.isDisabledInSimpleDataTableRow(simpleDataTableRow.mode)){
                    if(col.getFromParentCondition1 && col.getFromParentCondition1.isEnabled && col.disableIfGetDataFromParentIsSuccess){
                        ret = true;
                    }
                }
                return ret;
            });
            return self;
        },
        enableDisableDisableOncePopulatedElements: function(simpleDataTableRow){
            var self = this;
            if(!simpleDataTableRow.tempDisabledFromViewElements){
                simpleDataTableRow.tempDisabledFromViewElements = {};
            }
            if(simpleDataTableRow.tempDisabledFromViewElements[simpleDataTableRow.mode]){
                simpleDataTableRow.tempDisabledFromViewElements[simpleDataTableRow.mode].forEach(function(column){
                    column.enableSimpleDataTableRowElement(simpleDataTableRow.mode, simpleDataTableRow);
                });
            }
            simpleDataTableRow.tempDisabledFromViewElements[simpleDataTableRow.mode] = [];

            var dataRow = simpleDataTableRow.data.edit;
            simpleDataTableRow.forEach(function(column){
                var parentValue;
                if(dataRow){
                    parentValue = dataRow[column.id];
                }
                if(parentValue && typeof parentValue === 'object'){
                    parentValue = parentValue.value;
                }
                if(parentValue != null){
                    simpleDataTableRow.tempDisabledFromViewElements[simpleDataTableRow.mode].push(column);
                    column.disableSimpleDataTableRowElement(simpleDataTableRow.mode, simpleDataTableRow);
                }
            }, function(col){
                var ret = false;
                if(col.disableCondition && col.disableCondition.disableOncePopulated){
                    ret = true;
                }
                return ret;
            });
            return self;
        }
    },
    refreshUniqueColumnElementsInSubForm: function(column){
        var self = this;
        self.parentObject.refreshUniqueColumnElementsInSubForm(column)
    },
    _creation : {
        createElements: function(simpleDataTableRow){
            var self = this;

            var config = simpleDataTableRow.config;
            var elements = {};
            simpleDataTableRow.elements = elements;
//        self.divMain = self.container.find('#div_main');
//        self.closeButton = self.container.find('#formview_close');

            if(config.mode == SimpleDataTableRow.CREATE_MODE){
                var trCreate = self.createTableMain(simpleDataTableRow, config.create, SimpleDataTableRow.CREATE_MODE);
                simpleDataTableRow.elements.trCreate = trCreate;
            }

            if(config.mode == SimpleDataTableRow.EDIT_MODE) {
                var trEdit = self.createTableMain(simpleDataTableRow, config.edit, SimpleDataTableRow.EDIT_MODE);
                simpleDataTableRow.elements.trEdit = trEdit;
            }

            if(config.mode == SimpleDataTableRow.VIEW_MODE) {
                var trView = self.createTableMain(simpleDataTableRow, config.view, SimpleDataTableRow.VIEW_MODE);
                simpleDataTableRow.elements.trView = trView;
            }

            var tdButtonPanelCreate = $(document.createElement('td'));
            if(config.buttons.create){
                tdButtonPanelCreate
                    .append(self.createButtonPanel(SimpleDataTableRow.CREATE_MODE, config.buttons.create, simpleDataTableRow))
                    .appendTo(trCreate)
            }


            simpleDataTableRow.container = simpleDataTableRow.elements.trMains[simpleDataTableRow.config.mode];
            simpleDataTableRow.container.addClass('simpleDataTableRowContainer')
                .addClass('simpleDataTableRow-main');

            return self;
        },
        arrangeSimpleDataTableRowElements: function(simpleDataTableRow, type, tr){
            var self = this;
            var subModule = simpleDataTableRow.subModule;
            var arr = [];
            var hiddenArr = [];
            var index = 0;

            subModule.columnManager.forEachColumn(function(column){
                var pos = column.getSimpleDataTableRowPosition(type);
                if(pos.position == null){
                    pos.isHidden = true;
                }
                var divHolder = self.createHolderDiv(column, type, simpleDataTableRow);
                if(!pos.isHidden){
                    if(!arr[pos.position.row]){
                        arr[pos.position.row] = {};
                    }
                    var td = document.createElement('td');

                    td.setAttribute('data-column-id', column.id);

                    td.appendChild(divHolder.get(0))
                    arr[pos.position.row][pos.position.col] = td;
                }
                else{
                    hiddenArr.push(divHolder);
                }
                //Hidden items are not currently appended to the DOM
                index++;
            });

            arr.forEach(function(childArr){
                if(childArr[0]){
                    tr.append(childArr[0]);
                }
                if(childArr[1]){
                    tr.append(childArr[1]);
                }
                if(childArr[2]){
                    tr.append(childArr[2]);
                }
                if(childArr[3]){
                    tr.append(childArr[3]);
                }
                if(childArr[4]){
                    tr.append(childArr[4]);
                }
                if(childArr[5]){
                    tr.append(childArr[5]);
                }
            });




            subModule.columnManager.forEachColumn(function(column) {
                if(!column.mergedColumnsInSubForm){
                    return;
                }

                if(!column.mergedColumnsInSubForm.isEnabled){
                    return;
                }
                console.log('mergedColumnsInSubForm for parent : '+ column.id, column.mergedColumnsInSubForm.mergedColumnsInSubForm.config)
                var columnsToMerge = column.mergedColumnsInSubForm.mergedColumnsInSubForm.config;

                var parentColumnTh = tr.find('td[data-column-id="'+ column.id +'"]');
                parentColumnTh.attr('merged-column-parent', "")

                for(var count = columnsToMerge.length - 1; count >= 0; count--){
                    var obj = columnsToMerge[count];
                    var td = tr.find('td[data-column-id="'+ obj.value +'"]');
                    console.log('found', td.get(0))
                    if(td.length){
                        var divHolder = td.children().get(0);
                        parentColumnTh.prepend(divHolder);
                        td.hide();
                    }
                }

//                columnsToMerge.reverse().forEach(function(obj){
//
//                })

            });






            return self;
        },
        createTableMain: function(simpleDataTableRow, config, mode){
            var self = this;
            var tr = $(document.createElement('tr'));

            if(!simpleDataTableRow.elements.trMains){
                simpleDataTableRow.elements.trMains = {};
            }
            simpleDataTableRow.elements.trMains[mode] = tr;

            var subModule = simpleDataTableRow.subModule;
            self.arrangeSimpleDataTableRowElements(simpleDataTableRow, mode, tr);

            if(mode != SimpleDataTableRow.VIEW_MODE){
                subModule.columnManager.forEachColumn(function(column){
                        column.bindSimpleDataTableRowAutoPostBackEvents(simpleDataTableRow);
                    },
                    function(column){
//                        if(column.type === Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST){
                        return column.childColumns && column.childColumns.length;
//                        }
                    });
                subModule.columnManager.forEachColumn(function(column){
                        column.bindSimpleDataTableRowChangeEvent(simpleDataTableRow);
                    },
                    function(column){
                        return column.hasUniqueValueInSubForm;
                    });

                subModule.columnManager.forEachColumn(function(column){
                        column.bindSimpleDataTableRowValueCarryForwardChangeEvent(simpleDataTableRow);
                    },
                    function(column){
                        return column.hasValueCarryForwardInSubForm;
                    });

                subModule.columnManager.forEachColumn(function(column){
                        var parentColumns =column.calculatedValue.parentColumns.parentColumns;
                        parentColumns.config.forEach(function(columnId){
                            subModule.columnManager.columns[columnId.value]
                                .bindSimpleDataTableRowCalculatedValueEvents(simpleDataTableRow, mode, column);
                        });
                    },
                    function(column){
                        var ret = false;
                        if(column.calculatedValue && column.calculatedValue.parentColumns && column.calculatedValue.parentColumns.isEnabled){
                            ret = true;
                        }
                        return ret;
                    });

                subModule.columnManager.forEachColumn(function(column){
                        var parentColumns =column.disableFunction.parentColumns.parentColumns;
                        parentColumns.config.forEach(function(columnId){
                            subModule.columnManager.columns[columnId.value]
                                .bindSimpleDataTableRowDisableFunctionEvents(simpleDataTableRow, mode, column);
                        });
                    },
                    function(column){
                        var ret = false;
                        if(column.disableFunction && column.disableFunction.parentColumns && column.disableFunction.parentColumns.isEnabled){
                            ret = true;
                        }
                        return ret;
                    });
            }

            if(simpleDataTableRow.erp.deviceType === ERP.DEVICE_TYPES.MOBILE && mode != SimpleDataTableRow.VIEW_MODE){
                //                var trArr = $(table).find('tr');
//                trArr.each(function(){
//                    var tr = $(this);
//                    var td = tr.children().eq(1);
//                    if(td.length){
//                        var tempTr = $(document.createElement('tr'));
//                        tempTr.append(td);
//                        tr.after(tempTr);
//                    }
//                });
            }
            return tr;
        },
        createHolderDiv: function(column, type, simpleDataTableRow){
            var self = this;
            var div = $(document.createElement('div')).attr({id: 'holder_'+ type+'_'+ column.id}).addClass('simpleDataTableRow-column-holder');
            div.data('column', column);
            var displayValueElement = self.createDisplayValueElement(column, simpleDataTableRow);
            div.append(displayValueElement);
            var editValueElement = self.createEditValueElement(column, type, simpleDataTableRow);
            div.append(editValueElement);

            return div;
        },
        createButtonPanel: function(mode, buttons, simpleDataTableRow){
            var self = this;
            var classes = 'simpleDataTableRow-buttonPanel';
            var div = $(document.createElement('div'))
                .addClass(classes);
            for(var key in buttons){
                var button = buttons[key];
                var buttonElement = $(document.createElement('div'))
                    .addClass('simpleDataTableRowButton')
                    .addClass(button.id);
                div.append(buttonElement);
                buttonElement.on('click', function(){
                    button.onClick.apply(simpleDataTableRow, [simpleDataTableRow]);
                });
            }
            return div;
        },
        createDisplayValueElement: function(column){
            var self = this;
            var classes = 'simpleDataTableRow-column-display-value';
            var div = $(document.createElement('div')).append( $(document.createElement('span')) ).addClass(classes);
            return div.get(0);
        },
        createEditValueElement: function(column, type, simpleDataTableRow){
            var self = this;
            var element = column.createSimpleDataTableRowElement(type, simpleDataTableRow);
            var div = $(document.createElement('div')).append(  element  );
            return div.get(0);
        },
        createEmptyTable: function(rows, cols){
            var self = this;
            var table = document.createElement('table');
            table.className = 'table-main';
            for(var i=0; i< rows; i++){
                var tr = document.createElement('tr');
                tr.setAttribute('data-position', i.toString());
                tr.id = 'row_'+i;
                for(var j=0; j< cols; j++){
                    var td = document.createElement('td');
                    td.setAttribute('data-position', i+','+j);
                    td.id = 'cell_'+i+'_'+j;
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            return $(table);
        }
    },
    _events   : {
    },
    _ui       : {
        resetUi: function(simpleDataTableRow){
            var self = this;
            simpleDataTableRow._ui.resetFormUi(simpleDataTableRow);
            simpleDataTableRow._getSet.resetForm(simpleDataTableRow);
            simpleDataTableRow.enableSaveButton();
            return self;
        },
        resetFormUi: function(simpleDataTableRow){
            var self = this;
            simpleDataTableRow.container.find('.simpleDataTableRow-column-holder').css('border','');
            simpleDataTableRow.validationManager.removeAll();
            return self;
        }
    },
    validateUnique: function(column, element){
        var self = this;
        var config = {mode: self.mode};
        if(self.mode === SimpleDataTableRow.EDIT_MODE){
            config.id = self.data.edit.id;
        }
        self.validationManager.validateUniqueColumn(column, element, config)
        return self;
    },
    validateCustomSql: function(column, element){
        var self = this;
        var data = {
            simpleDataTableRowMode: self.mode,
            config: self.getFormData(),
            columnId: column.id
        };
        self.validationManager.validateCustomSqlColumn(column, element, data)
        return self;
    },
    enableDisableHeaderButtons: function(){
        var self = this;
        self.subModule.buttonManager.enableDisableSimpleDataTableRowButtons(self.data.edit);
        return self;
    }
}

SimpleDataTableRow.prototype.socketEvents = {
    insertRowDone: "insertRowDone",
    insertRow: "insertRow",
    updateRowDone: "updateRowDone",
    executeBeforeSqlOnlyInsert: "executeBeforeSqlOnlyInsert",
    executeBeforeSqlOnlyInsertDone: "executeBeforeSqlOnlyInsertDone",
    updateRow: "updateRow",
    getLookUpDataForCreateMode: "getLookUpDataForCreateMode",
    getLookUpDataForCreateModeDone: "getLookUpDataForCreateModeDone",
    getLookUpDataForEditMode: "getLookUpDataForEditMode",
    getLookUpDataForEditModeDone: "getLookUpDataForEditModeDone",
    getOneRowData: "getOneRowData",
    getOneRowDataDone: "getOneRowDataDone"
};



///mergedColumnsInSubForm

