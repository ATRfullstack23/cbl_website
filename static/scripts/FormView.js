/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function FormView(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.subModule = parentObject;
    self.erp = self.subModule.erp;
    self.id = self.subModule.id +'_form_view';
    self.randomId = self.subModule.randomId;
    self.initialize();
    self.notifier = new Notifier({
        container: $(document.body),
        subModule: self.subModule,
        bugReportManager: self.erp.bugReportManager
    });
    return self;
}

FormView.DISPLAY_MODES = {
    DEFAULT: 'default',
    INLINE: 'inline'
}

FormView.HIDDEN_MODE = 'none';
FormView.CREATE_MODE = 'create';
FormView.EDIT_MODE = 'edit';
FormView.VIEW_MODE = 'view';

FormView.prototype = {
    constants:{
        pointerOnTop: {
            "class": "pointerOnTopElement"
        },
        pointerCoverOnTop: {
            "class": "pointerCoverOnTopElement"
        },
        pointerOnBottom: {
            "class": "pointerOnBottomElement"
        },
        pointerCoverOnBottom: {
            "class": "pointerCoverOnBottomElement"
        }
    },

    get fullId(){
        var self = this;
        if(self.randomId){
            return self.id + '_' + self.randomId
        }
        else{
            return self.id;
        }
    },

    initialize: function () {
        var self = this;

        self.userConfiguration = {
            create: self.userConfiguration = self.erp.getUserSetting(self.subModule.id + '_create_formViewConfiguration') || {},
            edit: self.userConfiguration = self.erp.getUserSetting(self.subModule.id + '_edit_formViewConfiguration') || {},
            view: self.userConfiguration = self.erp.getUserSetting(self.subModule.id + '_view_formViewConfiguration') || {}
        };
        self.isConfigurationRestored = {
            create: false,
            edit: false,
            view: false
        }
        self.displayMode = self.config.displayMode || FormView.DISPLAY_MODES.DEFAULT;
        self.disabledColumns = [];
        self.columns = self.subModule.columnManager.columns;
        self.buttons = self.subModule.buttonManager.formViewButtons;

        self.display_styling_mode =  self.config.display_styling_mode || 'custom_size';

        self.subForms = {};
        self.simpleDataTables = {
            create:{},
            edit:{},
            view:{}
        };
        if(!self.config[FormView.EDIT_MODE]){
            self.config[FormView.EDIT_MODE] = self.config[FormView.CREATE_MODE];
        }
        if(!self.config[FormView.VIEW_MODE]){
            self.config[FormView.VIEW_MODE] = self.config[FormView.CREATE_MODE];
        }


        self.createElements();

        self.initializeTabs();


        self.validationManager = new ValidationManager(self);
        if(self.config.displayMode == FormView.DISPLAY_MODES.INLINE){
            self.subModule.container
                .append(self.container.addClass('formViewInline'));
        }
        else{
            $(document.body).append(self.container);
        }

        self.bindEvents();
        self.intializeSocketEventsObject();
        self.initializeOnSaveValidationFunctions();
        self._db.initialize(self);
        self._lookUp.initialize(self);
        self.data ={};
        self.mode = FormView.HIDDEN_MODE;
        if(self.subModule.forceStackedFormView){
            self.forceStackedFormView = true;
            self.container.addClass('stackedView').addClass('parent');
        }
        self.setDeviceTypeDisplayMode();
        return self;
    },
    initializeTabs: function(){
        var self = this;
        var createConfiguration = JSON.parse(JSON.stringify(self.config.create.tabs));
        var editConfiguration = JSON.parse(JSON.stringify(self.config.edit.tabs));
        var viewConfiguration = JSON.parse(JSON.stringify(self.config.view.tabs));
        self.tabbers = {
            create: new Tabber( {
                tabs: createConfiguration,
                classToAdd: "formview-create",
                targetContainer: self.elements.tableMainContainers.create,
                setFirstItemAsSticky: self.config.create.setFirstItemAsSticky,
                stickTabContentContainer: self.elements.trStickyTabContent,
                onAfterChange: function(){
                    self.validationManager.show(self.getSelectedTabId());
                },
                hiddenIfOnlyOne: true,
                elementToFocusAfterChange: ".editable"
            }, self),
            view: new Tabber({
                tabs: viewConfiguration,
                classToAdd: "formview-view",
                targetContainer: self.elements.tableMainContainers.view,
                setFirstItemAsSticky: self.config.view.setFirstItemAsSticky,
                stickTabContentContainer: self.elements.trStickyTabContent,
                hiddenIfOnlyOne: true
            }, self),
            edit: new Tabber({
                tabs: editConfiguration,
                classToAdd: "formview-edit",
                targetContainer: self.elements.tableMainContainers.edit,
                onAfterChange: function(){
                    self.validationManager.show(self.getSelectedTabId());
                },
                hiddenIfOnlyOne: true,
                setFirstItemAsSticky: self.config.edit.setFirstItemAsSticky,
                stickTabContentContainer: self.elements.trStickyTabContent,
                elementToFocusAfterChange: ".editable"
            }, self)
        };
        self.tabbers.create.container.appendTo(self.elements.tabsContainer);
        self.tabbers.view.container.appendTo(self.elements.tabsContainer);
        self.tabbers.edit.container.appendTo(self.elements.tabsContainer);
        return self;
    },
    setPreviousTabAsSelected: function(mode){
        var self = this;
        if(!mode){
            mode = self.mode;
        }
        self.tabbers[mode].setPreviousTabAsSelected();
        return self;
    },
    setNextTabAsSelected: function(mode){
        var self = this;
        if(!mode){
            mode = self.mode;
        }
        self.tabbers[mode].setNextTabAsSelected();
        return self;
    },
    getSelectedTabId: function(mode){
        var self = this;
        if(!mode){
            mode = self.mode;
        }
        return self.tabbers[mode].selectedTabId;
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
        var onSaveValidationFunctionCreate = self.config[FormView.CREATE_MODE].onSaveValidation;
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
        self.onSaveValidationFunctions[FormView.CREATE_MODE] = new Function(['formData', 'validationFunctionCallBack'], str);

        var onSaveValidationFunctionUpdate = self.config[FormView.EDIT_MODE].onSaveValidation;
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
        self.onSaveValidationFunctions[FormView.EDIT_MODE]  = new Function(['formData', 'serverData', 'evaluateFunctionCallBack'], str);
        return self;
    },
    setDeviceTypeDisplayMode: function(){
        var self = this;
        self.container.addClass(self.erp.deviceType);
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
        var currentEvent;
        // self.container.scannerDetection({
        //     onComplete: function(data){
        //         var scannedContainer = $(currentEvent.target);
        //         if(scannedContainer.attr('class') === 'barcodeInput'){
        //             var value = scannedContainer.val();
        //             if(value.length > 7){
        //                 value = value.substring(0, value.length - 7);
        //                 scannedContainer.val(value);
        //             }
        //             else{
        //                 scannedContainer.val('')
        //             }
        //             self.barcodeConfig.value = data;
        //             self.addValueToChildTable(self.barcodeConfig);
        //         }
        //     },
        //     onReceive: function(eve){
        //         currentEvent = eve;
        //     },
        //     onError: function(data){
        //
        //     }
        // });

        self.elements.barcodeScanStartButton && self.elements.barcodeScanStartButton.on('click', function(){
            self.barcodeConfig.simpleDataTableWithBarcode && self.barcodeConfig.simpleDataTableWithBarcode.addNewRow();
            self.setFormViewBarcodeScanningMode();
        });
        self.elements.barcodeScanStopButton && self.elements.barcodeScanStopButton.on('click', function(){
            self.removeFormViewBarcodeScanningMode();
        });



        self.elements.closeButton.on('click', function(event){
            event.stopPropagation();
            self.cancel(true);
        });
        self.container.on('keydown.formView', 'input,textarea', function(eve){
            if(eve.keyCode == ERP.KEY_CODES.CTRL){
                self.isCtrlDown = true;
            }
        });
        self.container.on('keyup.formView', 'input,textarea', function(eve){
            self.handleKeyUp(eve.keyCode, eve);
            if(eve.keyCode == ERP.KEY_CODES.CTRL){
                self.isCtrlDown = false;
            }
        });

        self.container.on('keydown.formViewAlt', 'input', function(eve){
            if(eve.keyCode == ERP.KEY_CODES.ALT){
                self.isAltDown = true;
            }
        });
        self.container.on('keydown.formViewAlt', 'input,textarea', function(eve){
            return self.handleArrowKeyDown(eve);
        });
        self.container.on('keyup.formViewAlt', function(eve){
            self.handleKeyUp(eve.keyCode, eve);
            if(eve.keyCode == ERP.KEY_CODES.ALT){
                self.isAltDown = false;
            }
        });
        self.container.on('focusout', '.barcodeInput', function(){
            self.elements.scaningRadar && self.elements.scaningRadar.removeClass('barcodeScanningRadarInMotion');
        });

//        self.container.pos();
//        self.container.on('scan.pos.barcode', function(event){
//            //access `event.code` - barcode data
//            console.log(event)
//        });




//        self.container.on('keyup.formView', 'input:not(.barcodeInput),textarea', function(eve){
//            if(event.keyCode == 13){
//                self.elements.hasBarcodeScan && self.setFormViewBarcodeScanningMode();
//                self.handleKeyUp(eve.keyCode, eve);
//                if(eve.keyCode == ERP.KEY_CODES.CTRL){
//                    self.isCtrlDown = false;
//                }
//            }
//        });

        self.container.on('click', 'input,textarea,.chosen-container', function(eve){
            eve.stopPropagation();
            $(this).focus();
        });

        self.container.on('click', function(eve){

            self.elements.hasBarcodeScan && self.setFormViewBarcodeScanningMode();
            if(!$(eve.target).is(self.container)){
                return;
            }
            if(self.formViewType == 'smallQuickAddView'){
                self.cancel(true);
            }
        });

        self.container.on('click', '.expandButton', function(eve){
            var element = $(this);
            if(element.attr('data-expanded') == 'true'){
                element.attr('data-expanded', false).text('+');
                element.closest('.formview-column-display-name')
                    .next().slideUp();
            }
            else{
                element.attr('data-expanded', true).text('-');
                element.closest('.formview-column-display-name')
                    .next().slideDown();
            }
        });
        return self;
    },
    saveFormViewWidth: function(size){
        var self = this;
        self.userConfiguration[self.mode].size = {
            width: size.width
        };
        self.erp.saveFormViewConfiguration(self.subModule, self.mode, self.userConfiguration[self.mode]);
        return self;
    },
    setFormViewBarcodeScanningMode: function(){
        var self = this;

//        self.elements.barcodeScanStartButton.prop('disabled', true);
//        self.elements.barcodeScanStartButton.parent().addClass('scan-button-selected');
//        self.elements.barcodeTr.show();
//        self.container.find('.table-main').css({"pointer-events": "none"});
//        self.elements.barcodeScanner.css({opacity: 0});
        self.elements.barcodescanner.focus();
        if(self.elements.scaningRadar && self.elements.scaningRadar.attr('class') != 'barcodeScanningRadarInMotion'){
            self.elements.scaningRadar.addClass('barcodeScanningRadarInMotion');
        }

        var isFirst = true;
//        self.elements.scannerInterval = setInterval(function(){
//            if(isFirst){
//                self.elements.barcodeScanningName.addClass('barcode-column-head-container-hide');
//                isFirst = false;
//                self.elements.barcodescanner.focus();
//            }
//            else{
//                self.elements.barcodeScanningName.removeClass('barcode-column-head-container-hide');
//                isFirst = true;
//                self.elements.barcodescanner.focus();
//            }
//        }, 500);

        return self;
    },
    removeFormViewBarcodeScanningMode: function(){
        var self = this;

        self.barcodeConfig.simpleDataTableWithBarcode && self.barcodeConfig.simpleDataTableWithBarcode.deleteLastRow();
//        self.elements.barcodeScanStartButton.prop('disabled', false);
//        self.elements.barcodeScanStartButton.parent().removeClass('scan-button-selected');
//        self.container.find('.table-main').css({"pointer-events": "all"});
//        clearInterval(self.elements.scannerInterval);
//        self.elements.barcodeTr.hide();
        return self;
    },
    handleKeyUp: function(keyCode, eve){
        var self = this;
        if(keyCode == 113){
            self.elements.hasBarcodeScan && self.setFormViewBarcodeScanningMode();
            eve.preventDefault();
        }
        if(self.isCtrlDown){
            switch(keyCode){
                case ERP.KEY_CODES.ENTER:
                    self.save();
                    break;
            }
        }
        else if(self.isAltDown){
            switch(keyCode){
                case ERP.KEY_CODES.MINUS:
//                    self.removeFormViewBarcodeScanningMode();
                    break;
                case ERP.KEY_CODES.EQUAL:
//                    self.elements.barcodeScanStartButton && self.elements.barcodeScanStartButton.trigger('click');
                    break;
            }
        }
        return self;
    },
    validate: function(showErrorMessage){
        var self = this;
        var ret = self.validationManager.validate();
        self.tabbers[self.mode].clearNotificationCount();
        if(!ret){
            if(self.tabbers[self.mode].stickyTab){
                self.validationManager.show(self.tabbers[self.mode].stickyTab);
            }
            var tabErrorCount = self.validationManager.show(self.getSelectedTabId());
            for(var key in tabErrorCount){
                self.tabbers[self.mode].setNotificationCount(key, tabErrorCount[key]);
            }
        }
        if(ret){

            for(var key in self.simpleDataTables[self.mode]){
                var simpleDataTable = self.simpleDataTables[self.mode][key];
                if(!simpleDataTable.validate(showErrorMessage)){
                    ret = false;
                    break;
                }
            }

        }
        if(ret){
            var formData = self.getFormData();
            var onSaveValidationFunction = self.onSaveValidationFunctions[self.mode];
            if(onSaveValidationFunction){
                var passingArguments = [formData];
                if(self.mode == FormView.EDIT_MODE){
                    passingArguments.push(self.data.edit)
                }
                passingArguments.push(function(errorMessage) {
                    if (typeof errorMessage !== 'undefined') {
                        if (errorMessage.length) {
                            ret = false;
                            if(showErrorMessage) {
                                self.notifier.showErrorNotification(errorMessage);
                            }
                        }
                    }
                });
                onSaveValidationFunction.apply(self, passingArguments);
            }
        }
        return ret;
    },
    save: function(){
        var self = this;
        self._ui.resetFormUi(self);

        if(!self.validate(true)){
//            self.validationManager.show();
            return;
        }
        else{
            if(self.dynamicCallBacks && self.dynamicCallBacks.executeBeforeSqlOnly){
                self._db.executeBeforeSqlOnly(self);
            }
            else{
                self.container
                    .css('position', 'fixed')
                    .addClass('showLoadingOverlay');
                self._db.save(self);
            }
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
        self.elements.saveButton.prop('disabled', false);
        return self;
    },
    disableSaveButton: function(){
        var self = this;
        //self.disableSaveButtonCount++;    Need to find a better way to resolve errors and disability
        self.elements.saveButton.prop('disabled', true);
        return self;
    },
    clearSimpleDataTableLookUpDataBlock: function(){
        var self = this;
        self.forEach(function(column){
            column.simpleDataTables[FormView.CREATE_MODE].hasLookUpDataForCreateMode = false;
        }, function(column){
            return column.type === 'hyperLink' && column.typeSpecific.displayAsSubForm
        })
        return self;
    },
    clearCarryForwardValue: function(){
        var self = this;
        self.forEach(function(column){
            column.simpleDataTables[FormView.CREATE_MODE].forEachColumn(function(column){
                column.clearCarryForwardValue()
            }, function(column){
                return column.hasValueCarryForwardInSubForm
            })
        }, function(column){
            return column.type === 'hyperLink' && column.typeSpecific.displayAsSubForm
        })
        return self;
    },
    cancel: function(isFromCloseButton){
        var self = this;
        self.hasBarcode && self.removeFormViewBarcodeScanningMode();
        if(self.mode == FormView.EDIT_MODE){
            self.subModule.unlockRow();
        }
        if(self.mode == FormView.CREATE_MODE){
            self.clearSimpleDataTableLookUpDataBlock();
            self.clearCarryForwardValue()
        }
        if(isFromCloseButton || self.mode == FormView.CREATE_MODE){
            self.hide();

        }
        else{
            //self.show(FormView.VIEW_MODE, self.data.view);
            self.showViewModeFromEditMode();
        }

        return self;
    },
    unloadCurrentMode: function(){
        var self = this;
        //self.lastMode = self.mode;
        switch (self.mode){
            case FormView.VIEW_MODE:
            case FormView.EDIT_MODE:
                if(self.displayMode == FormView.DISPLAY_MODES.INLINE){
                }
                else{
                    self.subModule.buttonManager.selectUnselectAllRows(false);
                    self._animations.formViewOutAnimationView(self, function(){
                        self.container.hide();
                    });
                }
                break;
            case FormView.CREATE_MODE:
                self._animations.formViewOutAnimationCreate(self, function(){
                    self.container.hide();
                });
                break;
        }
        //self.mode = FormView.HIDDEN_MODE;
        self.resetDisabledColumns();
        return self;
    },
    removeSmallQuickAddMode: function(){
        var self = this;
        self.container.removeClass('smallQuickAddView');
        self.elements.divMain.removeClass('pointerOnBottom');
        self.elements.divMain.removeClass('pointerOnTop');
        self.elements.divMain.css({
            left: "",
            top: "",
            position: ""
        });

///////////////////////////////////////////yathi//////////////////////////////////
        if(self.erp.deviceType === ERP.DEVICE_TYPES.PC && !self.subModule.fullScreenFormView){
            // self.elements.divMain.draggable('enable');
            // self.elements.divMain.resizable('enable');
        }
        else{
            if(self.elements.divMain.data('ui-draggable')){
                // self.elements.divMain.draggable('disable');
                // self.elements.divMain.resizable('disable');
            }

            self.elements.divMain.css({"top":"0px"});
        }
////////////////////////////////////////////////////////////////////////////////////////


        self.elements.divMain.addClass( ('formview-width-') + (self.config[self.mode].width || 'large'));
        return self;
    },
    createContainerForBarcode: function(){
        var self = this;
        self.elements.hasBarcodeScan = true;
        //-- Need to change after tabs in formView. ask jithu
        var table = self.elements.tableMains[FormView.CREATE_MODE];
        self.container.children('#div_main').append(self._creation.createScanningContainer(self));
        return self;
    },
    show: function (mode, data, button, dynamicCallBacks, type) {
        var self = this;

        self.forEach(function(column){
            column.simpleDataTables && column.simpleDataTables[FormView.CREATE_MODE].forEachColumn(function(column){
                column.clearUniqueColumnValuesInSubForm();
            }, function(column){
                return column.hasUniqueValueInSubForm;
            })
        }, function(column){
            return column.type === Column.COLUMN_TYPES.HYPERLINK
        });


        window._f = self;

        self.lastFormViewType = self.formViewType;
        self.formViewType = type;
        if(self.barcodeConfig && self.barcodeConfig.barcodeColumnElement){
            self.barcodeScannedIds = {};
            delete self.barcodeConfig.barcodeColumnElement;
        }
        self.container.removeClass('formview-main-edit');
        self.container.removeClass('formview-main-view');
        self.container.removeClass('formview-main-create');

        if(self.lastFormViewType == 'directCreate'){
            if(self.formViewType != 'directCreate'){
                self.container.appendTo(document.body);
            }
        }

        if(self.parentObject.formViewOnlyMode){
            self.container.removeClass('formViewInline');
        }


        self.lastMode = self.mode;
        self.disableSaveButtonCount = 0;
        if(self.button){
            self.button.disabled = false;
        }
        self.mode = mode;
        self.button = button;
        self.removeSmallQuickAddMode();


        self.elements.divMain.removeClass('formview-width-xLarge');
        self.elements.divMain.removeClass('formview-width-large');
        self.elements.divMain.removeClass('formview-width-medium');
        self.elements.divMain.removeClass('formview-width-small');
        self.elements.divMain.removeClass('smallQuickAddView');



        self.container.addClass('formview-main-'+ mode);
        self.container.show();

        self.subModule.columnManager.createHTMLEditor(self);

        self.latest_styling_setting = self.get_styling_setting_from_user() || {
            display_styling_mode: 'custom_size',
            last_updated_at_utc : null,
            column_structure: {},
            custom_elements: {}
        };
        self.applyUserConfiguration();


        self._ui.resetUi(self);


        if(mode === 'view' || mode === 'edit'){
            self.elements.barcodeButtonContainer && $(self.elements.barcodeButtonContainer).hide();
        }
        else{
            self.elements.barcodeButtonContainer && $(self.elements.barcodeButtonContainer).show();
        }
        if(button && button.typeSpecific && button.typeSpecific.saveButtonText){
            self.elements.saveButton.text(button.typeSpecific.saveButtonText);
        }



        if(self.formViewType === 'directCreate'){
            self.erp.moduleNavPointer.selectedFormView = self.id;
            self.selectedFormView = self.id;
            self.elements.cancelButton.hide();
            self.elements.closeButton.hide();
            self.container.addClass('form-view-in-direct-create');
            self.container.children().addClass('formview-main-in-direct-create');
            self.container.find('.formview-draggable-header').addClass('formview-draggable-header-in-direct-create');;
            self.container.find('.formview-header-text-panel').addClass('formview-header-text-panel-in-direct-create');
            self.container.find('.formview-column-display-name').each(function(){
                $(this).addClass('formview-column-display-name-indirect-create')
            });
            self.container.find('.table-main').addClass('table-main-in-direct-create');
            $(document.body).find('.filter-tabPanel').hide();
            var container = self.container.detach();
            self.erp.container.append(container);
            self.subModule.buttonManager.forEachGridViewButton(function(button){
                button.disabled = true;
            });
            self.elements.divMain.addClass( ('formview-width-') + (self.config[mode].width || 'large'));
        }
        else if (self.formViewType == 'smallQuickAddView'){
            self.container.addClass('smallQuickAddView');
            self.elements.divMain.css('width', '');
            // self.elements.divMain.draggable('disable');
            // self.elements.divMain.resizable('disable');
            var element;
            if(dynamicCallBacks.parentColumnElement){
                element = dynamicCallBacks.parentColumnElement.offsetParent();
            }
            else{
                element = dynamicCallBacks.parentPositioningElement;
            }

            if(dynamicCallBacks.isChosen){
                element = dynamicCallBacks.parentPositioningElement;
            }
            var pos = element.offset();
            if(element.is('button')){
                pos = element.closest('td').offset();
            }
            var formViewPosition = {
                vertical: "pointerOnTop"
            };
            if(pos.top < (window.innerHeight/3)){
                formViewPosition.vertical = 'pointerOnTop';
            }
            else if(pos.top > (window.innerHeight/3)){
                formViewPosition.vertical = 'pointerOnBottom';
            }
//            if(pos.top > (window.innerHeight/3)){
//                formViewPosition.horizontal = 'pointerOnBottom';
//            }
//            else{
//
//            }
            switch (formViewPosition.vertical){
                case 'pointerOnTop':
                    pos.top = pos.top + element.height() + 20;
                    pos.left += 20;
                    break;
                case 'pointerOnBottom':
                    pos.top = pos.top - self.elements.divMain.height();
                    pos.left += 20;
                    break;
            }
            self.elements.divMain.addClass(formViewPosition.vertical)
            self.elements.divMain.css({
                position: "absolute",
                left: pos.left,
                top: pos.top
            })
        }
        else{
            if(self.selectedFormView){
                var formViewContainer = self.erp.container.children('#'+self.selectedFormView).detach()
                $(document.body).append(formViewContainer);
            }
            self.elements.cancelButton.show();
            self.elements.closeButton.show();
            self.container.removeClass('form-view-in-direct-create');
            self.container.children().removeClass('formview-main-in-direct-create');
            self.container.find('.formview-draggable-header').removeClass('formview-draggable-header-in-direct-create');
            self.container.find('.formview-header-text-panel').removeClass('formview-header-text-panel-in-direct-create');
            self.container.find('.formview-column-display-name').each(function(){
                $(this).removeClass('formview-column-display-name-indirect-create')
            });
            self.container.find('.table-main').removeClass('table-main-in-direct-create');
            self.elements.divMain.addClass( ('formview-width-') + (self.config[mode].width || 'large'));
        }

        if(self.button){
            self.button.disabled = true;
        }
        if(dynamicCallBacks && dynamicCallBacks.showAsStackedFormViewChild){
            self.container.addClass('stackedView')
                .addClass('child');
        }
        switch (mode){
            case FormView.CREATE_MODE:
                self.showCreateMode(dynamicCallBacks);
                break;
            case FormView.EDIT_MODE:
                self.showEditMode(self.lastMode === FormView.VIEW_MODE, dynamicCallBacks);
                break;
            case FormView.VIEW_MODE:
                self.showViewMode(data, dynamicCallBacks);
                break;
        }
        self.tabbers[mode].setFirstTabAsSelected(true);
        self.initializeChosen();

        self.requestSuggestionsFromPreviousEntriesForAllColumns();

        self.elements.hasBarcodeScan && self.setFormViewBarcodeScanningMode();
        return self;
    },
    requestSuggestionsFromPreviousEntriesForAllColumns: function(){
        var self = this;
        self.subModule._db.showSuggestionsFromPreviousEntries(self.subModule);
        return self;
    },
    initializeChosen: function(){
        var self = this;

        self.subModule.forEachColumn(function(column){
            column.initializeFormViewChosen(self, self.mode);
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
    showCreateMode: function(dynamicCallBacks){
        var self = this;
        self.dynamicCallBacks = dynamicCallBacks || {};
        self.getLookupData(true);
        self._getSet.setHeaderText(self);
        //self._getSet.setDefaultValues(self);
        self._animations.formViewInAnimationCreate(self);
        self._getSet.enableDisableGetFromParentConditionElements(self);
        self.elements.divMain.find('.table-main:visible').find('input:first:visible').focus();

        if(self.dynamicCallBacks.customCreateModeValues){
            self._getSet.setCustomCreateModeValues(self, self.dynamicCallBacks.customCreateModeValues);
        }
        if(self.forceStackedFormView){
            var childColumn;
            self.subModule.columnManager.forEachColumn(function(column){
                childColumn = column;
            }, function(column){
                return column.typeSpecific && column.typeSpecific.displayAsSubForm;
            });
            self.showSubFormAsStackedChild(childColumn);
        }
        self.subModule.columnManager.forEachColumn(function(column){
            column.clearHTMLEditor(self.mode)
        }, function(column){
            return column.allowHTMLEditor;
        });
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
        self._animations.formViewInAnimationEditFromView(self);
        if(self.config.onShowEditMode){
            self.config.onShowEditMode.apply(self, [self]);
        }
        self.refreshHyperlinkChildWindows();
        self.triggerFormViewElementDisableFunctionChangeEvent();
        return self;
    },
    triggerFormViewElementDisableFunctionChangeEvent: function(){
        var self = this;
        self.subModule.forEachColumn(function(column){
            var parernColumns = column.disableFunction.parentColumns.parentColumns
            parernColumns.config.forEach(function(parentColumnId){
                self.subModule.columnManager.columns[parentColumnId.value].triggerFormViewElementDisableFunctionChangeEvent(self.mode, column);
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
        self.container.removeClass('formview-main-edit');
        self.lastMode = self.mode;
        self.mode = FormView.VIEW_MODE;
        self.container.addClass('formview-main-'+ self.mode);
        self._db.getOneRowData(self);
        self._getSet.setViewData(self);
        self._getSet.setHeaderText(self);
        self._ui.resetFormUi(self);
        if(self.button){
            self.button.disabled = false;
        }
        self._animations.formViewInAnimationViewFromEdit(self);
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
            column.setFormViewLookupData(data[key], FormView.VIEW_MODE, {});
//            column.setFormViewLookupData(data[key], FormView.EDIT_MODE, {});
        }
        return self;
    },
    showViewMode: function(data, dynamicCallBacks){
        var self = this;
        self.dynamicCallBacks = dynamicCallBacks || {};
        self.data.view = data;
        self.subModule.buttonManager.disableFormViewEditButtons();
        self._db.getOneRowData(self);
        self._getSet.setViewData(self);
//        self.getLookupData();
        self._getSet.setHeaderText(self);
        self._animations.formViewInAnimationView(self);
//        self.refreshHyperlinkChildWindows();
        return self;
    },
    resetHyperlinkChildWindows: function(){
        var self = this;
        for(var key in self.childWindows){
            self.childWindows[key].removeQuickViewMode().hide({
                preventAnimation: true
            });
        }
        return self;
    },
    refreshHyperlinkChildWindows: function(){
        var self = this;
        self.childWindows = {};
        self.subModule.columnManager.forEachColumnType(Column.COLUMN_TYPES.HYPERLINK, function(column){
            self.subModule.openChildWindow(column, self.data.edit, {
                createOnly: true,
                onSuccess: function(childWindow){
                    self.childWindows[column.id] = childWindow;
                    var element = column.getFormViewElement(self.mode);
                    childWindow.setAsQuickViewMode(element, {
                        viewOnlyMode: (self.mode == FormView.EDIT_MODE)
                    })
                        .show({
                            preventAnimation: true,
                            onBeforeSetDisplayMode: function(childSubModule, newDisplayMode){
                                // console.log('commented bcos this code was never getting called in old version also. onBeforeSetDisplayMode called : ' + childSubModule.id);
                                // self.reloadCurrentEditDataFromServer();
                                // self.dynamicCallBacks.refreshDisplayModeOnClose = true;
                                return true;
                            }
                        });
                }
            })
        }, function(column){
            return !column.formView[self.mode].isHidden;
        });
        return self;
    },
    clearValues: function(){
        var self = this;
        console.log(self.container.get(0));
        return self;
    },
    hide: function () {
        var self = this;
        if(self.button){
            self.button.disabled = false;
        }
        self.unloadCurrentMode();
        if(self.config.onHide){
            self.config.onHide.apply(self, [self]);
        }
        if(self.stackedChildFormView) {
            self.stackedChildFormView.cancel(true);
            self.stackedChildFormView = null;
            self.stackedChildColumn = null;
        }
        if(self.dynamicCallBacks.refreshDisplayModeOnClose){
            self.subModule.setDisplayMode();
        }
        self.resetHyperlinkChildWindows();
        self.dynamicCallBacks = {};
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
        formViewInAnimationCreate: function(formView, callback){
            var self = this;
            formView.container.css({opacity: .1});
            formView.elements.divMain.css({transform: 'translate(0px, 30px)'});
            formView.elements.divMain.transition({translate:'0px, 0px'}, callback);
            formView.container.transition({opacity: 1});
        },
        formViewOutAnimationCreate: function(formView, callback){
            var self = this;
            formView.container.css({opacity: 1});

            formView.elements.divMain.css({transform: 'translate(0px, 0px)'});
            formView.elements.divMain.transition({translate:'0px, 30px'}, callback);

//            formView.elements.divMain.css({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'});
//            formView.elements.divMain.transition({scale: 1, rotateX: '-70deg', rotateY: '0deg', translate:'0%'}, callback);
            formView.container.transition({opacity: .1});
        },
        formViewInAnimationView: function(formView, callback){
            var self = this;
            formView.container.css({opacity: .1});
            formView.elements.divMain.css({transform: 'translate(0px, -30px)'});
            formView.elements.divMain.transition({translate:'0px, 0px'}, callback);
            formView.container.transition({opacity: 1});
        },
        formViewOutAnimationView: function(formView, callback){
            var self = this;
            formView.container.css({opacity: 1});
            formView.elements.divMain.css({transform: 'translate(0px, 0px)'});
            formView.elements.divMain.transition({translate:'0px, -30px'}, callback);
            formView.container.transition({opacity: .1});
        },
        formViewInAnimationEditFromView: function(formView, callback){
            var self = this;
            //formView.container.css({opacity: .1});
            formView.elements.divMain.find('#table_main_container_edit')
                .css({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'+10%'});
            formView.elements.divMain //.css('overflow', 'hidden')
                .find('#table_main_container_edit')
                .transition({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'}, function(){
                    // formView.elements.divMain.css('overflow', 'visible')
                    if(callback){
                        callback();
                    }
                });
            //formView.container.transition({opacity: 1});
        },
        formViewInAnimationViewFromEdit: function(formView, callback){
            var self = this;
            //formView.container.css({opacity: .1});
            formView.elements.divMain.find('#table_main_container_view')
                .css({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'-10%'});
            formView.elements.divMain //.css('overflow', 'hidden')
                .find('#table_main_container_view')
                .transition({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'}, function(){
                    // formView.elements.divMain.css('overflow', 'visible')
                    if(callback){
                        callback();
                    }
                });
            //formView.container.transition({opacity: 1});
        },

        formViewInAnimationCreate_Old: function(formView, callback){
            var self = this;
            formView.container.css({opacity: .1});
            formView.elements.divMain.css({scale: 1, rotateX: '-70deg', rotateY: '0deg', translate:'0%'});
            formView.elements.divMain.transition({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'}, callback);
            formView.container.transition({opacity: 1});
        },
        formViewOutAnimationCreate_Old: function(formView, callback){
            var self = this;
            formView.container.css({opacity: 1});
            formView.elements.divMain.css({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'});
            formView.elements.divMain.transition({scale: 1, rotateX: '-70deg', rotateY: '0deg', translate:'0%'}, callback);
            formView.container.transition({opacity: .1});
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
    get lookUpColumnsWithoutParentColumns(){
        var self = this;
        var arr = [];
        self.subModule.columnManager.forEachColumn(function(column){
            arr.push(column);
        }, function(column){
//            console.log(column.id, column.typeSpecific)
            if(column.type == Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST){
                if(column.typeSpecific.parentColumns == null){
                    return true;
                }
                if(column.typeSpecific.parentColumns.length == 0){
                    return true;
                }
            }
            return false;
        });
        return arr;
    },
    _lookUp:{
        initialize: function(formView){
            var self = this;
            var socket = formView.getSocket();

            socket.on(formView.socketEvents.getLookUpDataForCreateModeDone, getLookUpDataForCreateModeDoneListener);
            socket.on(formView.socketEvents.getLookUpDataForEditModeDone, getLookUpDataForEditModeDoneListener);

            formView.subModule.forEachColumn(function(column){
                var listenStr = formView.socketEvents['lookUpParentChangedDone_'+column.id];
                socket.on(listenStr, lookUpParentChangedDoneListener);
            },function(column){
                var ret = false;
                if(column.childColumns && column.childColumns.length){
                    ret = true;
                }
                return ret;
            });
            function setColumnValuesFromParentButton(){
                if(formView.subModule.parentObject.parentItem && formView.subModule.parentObject.parentItem.typeSpecific.targetColumnsValue){
                    var button = formView.subModule.parentObject.parentItem;
                    button.typeSpecific.targetColumnsValue.forEach(function(columnValueObject){
                        formView.subModule.columnManager.columns[columnValueObject.text].setFormViewEditValue(null, button.typeSpecific.formViewMode, columnValueObject.value, {triggerChange: true});
                    });
                }
            }

            function getLookUpDataForCreateModeDoneListener(data){
                if(data.simpleDataTableRowId){
                    return;
                }
                self.lookUpData_done(formView, data, function(formView, data){
                    for(var key in data.data){
                        var column = formView.columns[key];
                        //if( column.typeSpecific.children && column.typeSpecific.children.length){
                        column.triggerFormViewElementChange(formView.mode);
                        //}
                    }
                    //formView.elements.hasBarcodeScan && formView.setFormViewBarcodeScanningMode();
                });
                formView._getSet.setDefaultValues(formView);
                if(formView.dynamicCallBacks.customCreateModeValues){
                    for(var key in data.result){
                        var column = formView.columns[key];
                        column.setFormViewEditValue(formView.dynamicCallBacks.customCreateModeValues, formView.mode);
                        var callbackFunction = function(formView, childData){
                            if(childData.success){
                                for(var childKey in childData.result){
                                    var childColumn = formView.columns[childKey];
                                    childColumn.setFormViewEditValue(formView.dynamicCallBacks.customCreateModeValues, formView.mode);
                                    childColumn.triggerFormViewElementChange(formView.mode, {
                                        callback: callbackFunction
                                    });
                                }
                            }
                        };
                        column.triggerFormViewElementChange(formView.mode, {
                            callback: callbackFunction
                        });
                        //Continue Work here. Second level child lookup should work also
                    }
                }
                setColumnValuesFromParentButton();
            }
            function getLookUpDataForEditModeDoneListener(data){
                if(data.simpleDataTableRowId){
                    return;
                }
                self.lookUpData_done(formView, data, function(formView, data){
//                    for(var key in data.data){
//                        var column = formView.columns[key];
//                        if( column.typeSpecific.children && column.typeSpecific.children.length){
//                            column.triggerFormViewElementChange(formView.mode);
//                        }
//                    }
                });
            }
            function lookUpParentChangedDoneListener(data){
                if(data.simpleDataTableRowId){
                    return;
                }
                self.lookUpParentChanged_done(formView, data, {});
            }
            return self;
        },
        lookUpParentChanged: function(formView, column, options){
            var self = this;
            var socket = formView.getSocket();
            var requestId = crypto.getRandomValues(new Uint16Array(1))[0];
            var eventsObj = {};
            var data = {};
            data.formView = {};
            var formViewMode = formView.mode;
            if(formViewMode == FormView.VIEW_MODE){
                formViewMode = FormView.EDIT_MODE;
            }
            data.formView.mode = formViewMode;
            if(options && options.useDbData){
                data.formView.data = self.dataToLookUpRequest(formView.data.edit);
            }
            else{
                data.formView.data = formView.getFormData();
            }
            if(formView.dynamicCallBacks && formView.dynamicCallBacks.parentFormView){
                data.parentFormView = {
                    data: formView.dynamicCallBacks.parentFormView.getFormData(),
                    subModuleId:  formView.dynamicCallBacks.parentSubModule.id,
                    moduleId:  formView.dynamicCallBacks.parentSubModule.module.id
                };
            }
            data.column = self.toLookUpRequest(formView, column);
            data.requestId = requestId;
            eventsObj.formViewModeOnRequestStart = formView.mode;
            eventsObj.options = options;
            eventsObj.callback = options.callback;
            socket.formView.events[requestId] = eventsObj;
            column.fadeOutChildColumnsInFormView(formViewMode);
//            console.log(formView.socketEvents['lookUpParentChanged_'+ column.id], data)
//             socket.emit(formView.socketEvents['lookUpParentChanged_'+ column.id], data);

            formView.subModule.do_ajax_request_legacy('lookUpParentChanged_'+ column.id, data, (a_err, response_data)=>{
                // console.log('lookUpParentChanged_done', data, response_data)
                self.lookUpParentChanged_done(formView, response_data);
            });

            return self;
        },
        lookUpParentChanged_done: function(formView, data, options){
            var self = this;
//            column.fadeInChildColumnsInFormView(formView.mode);
            if(data.error){
                formView.notifier.showReportableErrorNotification(data.errorMessage);
                return self;
            }
            var socket = formView.getSocket();
            var eventsObj = socket.formView.events[data.requestId];

            var lookUpData = data.result;
            for(var key in lookUpData){
                var column = formView.columns[key];
                var mode = formView.mode;
                if(formView.mode === FormView.VIEW_MODE){
                    mode = FormView.EDIT_MODE;
                }
                if(mode == FormView.EDIT_MODE){
                    if(column.type == Column.COLUMN_TYPES.LOOKUP_TEXTBOX){
                        if(eventsObj.formViewModeOnRequestStart != FormView.VIEW_MODE){
                            //console.log('Setting LookUp textbox value')
                            column.setFormViewLookupData(lookUpData[key], mode, options);
                        }
                        else{
                            //console.log('Skipping LookUp textbox value')
                        }
                    }
                    else{
//                    var currentEditValue = formView.data.edit[column.id];
//                    if(currentEditValue.value == null){
                        column.setFormViewLookupData(lookUpData[key], mode, options);
//                    }
                    }

                }
                else{
                    column.setFormViewLookupData(lookUpData[key], mode, options);
                }
                column.fadeInFormViewElement(mode);
            }

            if(eventsObj && eventsObj.callback){
                eventsObj.callback.apply(formView, [formView, data]);
            }
            return self;
        },
        getLookUpData: function(formView, fromCode){
            var self = this;
            switch(formView.mode){
                case FormView.CREATE_MODE:
                    self.getLookUpDataForCreateMode(formView, fromCode);
                    break;
                case FormView.VIEW_MODE:
                    self.getLookUpDataForEditMode(formView, fromCode);
                    break;
            }
            return self;
        },
        lookUpData_done: function(formView, data, callback){
            var self = this;
            if(data.error){
                formView.notifier.showErrorNotification(data.errorMessage)
            }
            else{
                for(var key in data.result){
//                console.log(data)
                    var column = formView.subModule.columnManager.columns[key];
                    var mode = FormView.CREATE_MODE;
                    if(formView.mode === FormView.VIEW_MODE){
                        mode = FormView.EDIT_MODE;
                    }
                    column.setFormViewLookupData(data.result[key], mode);
                    if(callback){
                        callback(formView, data);
                    }
                }
            }
        },









        getLookUpDataForCreateMode: function(formView){
            var self = this;
            var lookUpColumns = formView.lookUpColumnsWithoutParentColumns;
            var formViewObj = {};
            formViewObj.mode = formView.mode;
            if(formView.dynamicCallBacks.customCreateModeValues){
                for(var key in formView.dynamicCallBacks.customCreateModeValues){
                    var column = formView.subModule.columnManager.columns[key];
                    column.setFormViewEditValue(formView.dynamicCallBacks.customCreateModeValues, formView.mode);
                }
            }
            formViewObj.data = formView.getFormData();


            window.async_lib.mapLimit(lookUpColumns, 3, function(column, next){


                if(column.disableCondition && column.disableCondition.disabled){
                    // console.log('ignoing get lookup form server since column is disabled');
                    next();
                    return;
                }

                column.getLookUpDataFromServerViaAjax(formViewObj, function(result){
                    if(!result.success){
                        console.log(column.id, result);
                        next();
                        return;
                    }
                    if(!result.result.isClientDataLatest){
                        column.setFormViewLookupData(result.result, formView.mode, {});
                    }
                    else{
                        //--- This is kind of thattikootu, move this as a function to Column.js and call it from here
                        //--- like column.setFirstItemAsSelected();
                        if( column.lookUpDataBackUp ){

                            var element = column.getFormViewElement(formView.mode);

                            if(column.typeSpecific.setFirstItemAsSelected){
                                if(column.lookUpDataBackUp && column.lookUpDataBackUp[0]){
                                    element.val(column.lookUpDataBackUp[0].value);
                                    element.data('value', column.lookUpDataBackUp[0].value);
                                }
                            }
                            else{
                                var defaultValueIndex = column.lookUpDataBackUp && column.lookUpDataBackUp.findIndex(function(item){
                                        return item.isDefault;
                                    });
                                if(defaultValueIndex != -1){
                                    element.val(column.lookUpDataBackUp[defaultValueIndex].value);
                                    element.data('value', column.lookUpDataBackUp[defaultValueIndex].value);
                                }
                            }

                            if(column.hasChosen && column.hasChosen[formView.mode]){
                                element.trigger('chosen:updated');
                            }
                            column.triggerFormViewElementChange(formView.mode);

                        }
                    }

                    if(formView.dynamicCallBacks.customCreateModeValues && formView.dynamicCallBacks.customCreateModeValues[column.id]){
                        column.setFormViewEditValue(formView.dynamicCallBacks.customCreateModeValues, formView.mode);
                    }
                    column.triggerFormViewElementChange(formView.mode);
                    next();
                });
            }, function(err, result){
                formView._getSet.setDefaultValues(formView);

                if(formView.subModule.parentObject.parentItem && formView.subModule.parentObject.parentItem.typeSpecific.targetColumnsValue){
                    var button = formView.subModule.parentObject.parentItem;
                    button.typeSpecific.targetColumnsValue.forEach(function(columnValueObject){
                        formView.subModule.columnManager.columns[columnValueObject.text]
                            .setFormViewEditValue(null, button.typeSpecific.formViewMode, columnValueObject.value, {triggerChange: true});
                    });
                }

            });
        },



        getLookUpDataForCreateModeOld: function(formView, fromCode){
            var self = this;
            var columns = [];
            formView.subModule.columnManager.forEachColumnType( Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST, function(column){
                columns.push(self.toLookUpRequest(formView, column));
            });
            var data = {};
            data.formView = {};
            data.formView.mode = formView.mode;
            data.columns = columns;
            var socket = formView.getSocket();
            socket.emit(formView.socketEvents.getLookUpDataForCreateMode, data);
            return self;
        },
        getLookUpDataForEditMode: function(formView, fromCode){
            var self = this;
            var columns = [];
            formView.subModule.columnManager.forEachColumnType( Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST, function(column){
                columns.push(self.toLookUpRequest(formView, column));
            });
            var data = {};
            data.formView = {};
            data.formView.mode = formView.mode;
            data.columns = columns;
            var socket = formView.getSocket();
            // throw 'err'
            // socket.emit(formView.socketEvents.getLookUpDataForEditMode, data);

            formView.subModule.do_ajax_request_legacy('getLookUpDataForEditMode', data, (a_err, response_data)=>{
                // console.log('lookUpParentChanged_done', data, response_data)
                self.lookUpData_done(formView, response_data);
            });

            return self;
        },
        toLookUpRequest: function(formView, column){
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
        initialize: function(formView){
            var socket = formView.getSocket();

            // socket.on(formView.socketEvents.insertRowDone, function(data){
            //     formView._db.insert_done(formView, data);
            // });

            socket.on(formView.socketEvents.executeBeforeSqlOnlyInsertDone, function(data){
                formView._db.executeBeforeSqlOnlyInsert_done(formView, data);
            });

            socket.on(formView.socketEvents.updateRowDone, function(data){
                formView._db.updateRow_done(formView, data);
            });

            socket.on(formView.socketEvents.getOneRowDataDone, function(data){
                formView._db.getOneRowData_done(formView, data);
            });

//            socket.on('insertRowDone_'+ formView.subModule.id, function(data){
//                formView._db.insert_done(formView, data);
//            });
//            socket.on('updateRowDone_'+ formView.subModule.id, function(data){
//                formView._db.updateRow_done(formView, data);
//            });
//            socket.on('getOneRowDataDone_'+ formView.subModule.id, function(data){
//                formView._db.getOneRowData_done(formView, data);
//            });

        },
        save: function(formView){
            var self = this;
            switch(formView.mode){
                case FormView.CREATE_MODE:
                    self.insert(formView);
                    break;
                case FormView.EDIT_MODE:
                    self.updateRow(formView);
                    break;
            }
            return self;
        },
        insert: function(formView){
            var self = this;
            var formData = formView._getSet.getFormData(formView);
            var socket =formView.getSocket();
//            var emitStr = 'insertRow_'+ formView.subModule.id;
            var data = {config: formData};

            var onSaveValidationFunction = formView.onSaveValidationFunctions[FormView.CREATE_MODE];
            if(onSaveValidationFunction){
                onSaveValidationFunction.apply(formView, [formData,  function(errorMessage){
                    if(typeof errorMessage !== 'undefined'){
                        if(errorMessage.length){
                            formView.notifier.showErrorNotification(errorMessage);
                        }
                        else{
                            if(formView.dynamicCallBacks && formView.dynamicCallBacks.onBeforeInsert){
                                var formTextData = formView._getSet.getFormTextData(formView);
                                if(!formView.dynamicCallBacks.onBeforeInsert.apply(formView, [formData, formTextData, formView])){
                                    return;
                                }
                            }

                            if(formView.formViewType == 'smallQuickAddView'){
                                if(formView.dynamicCallBacks && formView.dynamicCallBacks.parentDataRowForQuickAdd){
                                    data.parentDataRow = formView.dynamicCallBacks.parentDataRowForQuickAdd;
                                }
                                console.log(formView.id, formView.dynamicCallBacks, data);
                            }

                            data.buttonId = formView.button.id;
                            formView.disableSaveAndCancelButtons();
                            //socket.emit(formView.socketEvents.insertRow, data);


                            formView.subModule.do_ajax_request('insertRow', data, function(ajax_err, responseObj){
                                formView._db.insert_done(formView, responseObj);
                            });

                            // $.ajax({
                            //     type: 'POST',
                            //     data: {_source : JSON.stringify(data)},
                            //     url: insert_url,
                            // }).always(function (responseObj, status) {
                            //     // console.log(grid.socketEvents.insertRowDone + '_Done', responseObj, status);
                            //     formView._db.insert_done(formView, responseObj);
                            // });

                            // socket.emit(formView.socketEvents.insertRow, data);
                        }
                    }
                }]);
            }

            return self;
        },
        insert_done: function(formView, data){
            var self = this;
            formView.clearSimpleDataTableLookUpDataBlock();
            formView.clearCarryForwardValue();
            formView.enableSaveAndCancelButtons();
            formView.container
                .css('position', '')
                .removeClass('showLoadingOverlay');
            if(data.success){
                formView.notifier.showSuccessNotification(data.successMessage);
                var ret = false;
                if(formView.dynamicCallBacks && formView.dynamicCallBacks.onAfterInsert){
                    ret = !formView.dynamicCallBacks.onAfterInsert.apply(formView, [data.result, formView]);
                }
                if(ret){
                    return;
                }
                if(!formView.hasParentFormView){
                    if(!formView.subModule.formViewOnlyMode){
                        formView.subModule.setDisplayMode();
                    }
                }
                if(formView.formViewType != 'directCreate'){
                    if(formView.displayMode !== FormView.DISPLAY_MODES.INLINE){
                        formView.hide();
                    }
                }
                console.log('setAsDataChanged', data)

                formView.subModule.setAsDataChanged('insert');
            }
            else{
                console.log('insert error', data)
                if(data.errorMessage){
                    if(data.errorMessage.simpleDataTableRowId){
                        formView.simpleDataTables[formView.mode][data.errorMessage.columnId]
                            .showErrorMessage(data.errorMessage);
                    }
                    else{
                        formView.notifier.showErrorNotification(data.errorMessage);
                    }
                }
            }
        },

        executeBeforeSqlOnly: function(formView){
            var self = this;
            switch(formView.mode){
                case FormView.CREATE_MODE:
                    self.executeBeforeSqlOnlyInsert(formView);
                    break;
                case FormView.EDIT_MODE:
                    console.error('Not yet implemented');
                    break;
            }
            return self;
        },
        executeBeforeSqlOnlyInsert: function(formView){
            var self = this;
            var formData = formView._getSet.getFormData(formView);
            var socket =formView.getSocket();
            var data = {config: formData};
            var onSaveValidationFunction = formView.onSaveValidationFunctions[FormView.CREATE_MODE];
            if(onSaveValidationFunction ){
                onSaveValidationFunction.apply(formView, [formData,  function(errorMessage){
                    if(typeof errorMessage !== 'undefined'){
                        if(errorMessage.length){
                            formView.notifier.showErrorNotification(errorMessage);
                        }
                        else{
                            data.buttonId = formView.button.id;
                            formView.disableSaveAndCancelButtons();

                            formView.subModule.do_ajax_request('executeBeforeSqlOnlyInsert', data, function(ajax_err, responseObj){
                                formView._db.executeBeforeSqlOnlyInsert_done(formView, responseObj);
                            });

                            // socket.emit(formView.socketEvents.executeBeforeSqlOnlyInsert, data);
                        }
                    }
                }]);
            }
            return self;
        },
        executeBeforeSqlOnlyInsert_done: function(formView, data){
            var self = this;
            formView.enableSaveAndCancelButtons();
            if(data.success){
                if(formView.dynamicCallBacks && formView.dynamicCallBacks.onBeforeInsert){
                    var formTextData = formView._getSet.getFormTextData(formView);
                    var formData = formView._getSet.getFormData(formView);
                    if(!formView.dynamicCallBacks.onBeforeInsert.apply(formView, [formData, formTextData, formView])){
                        return;
                    }
                }
            }
            else{
                formView.notifier.showReportableErrorNotification(data.errorMessage);
            }
        },

        updateRow: function(formView){
            var self = this;
            var formData = formView._getSet.getFormData(formView);
            self.refreshDisableValueEditMode(formView);
            var socket =formView.getSocket();
            var obj = {};
            obj.id = formView.data.edit.id;
            obj.buttonId = formView.button.id;
            obj.config = formData;
            formView.disableSaveAndCancelButtons();

            formView.subModule.do_ajax_request('updateRow', obj, function(ajax_err, responseObj){
                formView._db.updateRow_done(formView, responseObj);
            });

            // socket.emit(formView.socketEvents.updateRow, obj);
            return self;
        },
        refreshDisableValueEditMode: function(formView){
            var self = this;
            formView.forEach(function(column){
                column.valueWhenDisabledEditMode = '';
            })
            return self;
        },
        updateRow_done: function(formView, data){
            var self = this;

            formView.enableSaveAndCancelButtons();
            formView.container
                .css('position', '')
                .removeClass('showLoadingOverlay');
            if(data.success){
                formView.notifier.showSuccessNotification('Update Successful');

                var ret = false;
                if(formView.dynamicCallBacks && formView.dynamicCallBacks.onAfterUpdate){
                    ret = !formView.dynamicCallBacks.onAfterUpdate.apply(formView, [data.result, formView]);
                }
                if(ret){
                    return;
                }

                formView.hide();
//                }
                formView.subModule.setDisplayMode();
                formView.subModule.unlockRow(true);

                formView.subModule.setAsDataChanged('update');
            }
            else{
                if(data.errorMessage){
                    formView.notifier.showErrorNotification(data.errorMessage);
                }
                else{
                    formView.notifier.showReportableErrorNotification('Error Saving To Database');
                }
            }
        },
        getOneRowData: function(formView){
            var self = this;
            var socket =formView.getSocket();
            var formData = {
                id: formView.data.view['id']
            };
            // socket.emit(formView.socketEvents.getOneRowData, {config: formData});

            formView.subModule.do_ajax_request('getOneRowData', formData, function(ajax_err, responseObj){
                self.getOneRowData_done(formView, responseObj);

                formView._lookUp.getLookUpDataForEditMode(formView);
                // call getAllLookUpLabelData also here

            });

            return self;
        },
        getOneRowData_done: function(formView, data){
            var self = this;

            if(data.success){
                formView.data.edit = data.result.data;
                formView.data.view = data.result.data;
                formView._getSet.setViewData(formView);
                formView.enableDisableHeaderButtons();
                formView.dynamicCallBacks.onEditModeReady && formView.dynamicCallBacks.onEditModeReady(formView);
                formView.refreshHyperlinkChildWindows();
            }
            else{
                formView.notifier.showReportableErrorNotification(data.errorMessage || 'Error Getting Data From Database');
            }

            return self;
        }
    },
    refreshCurrentFormData: function(updatedFormData){
        var self = this;
        for(var key in updatedFormData){
            if(self.data.edit[key] && self.data.edit[key].value){
                self.data.edit[key].value = updatedFormData[key];
                self.data.view[key].value = updatedFormData[key];
            }
        }
        return self;
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
        disableFunctionParentChanged: function(formView, column, options){
            var self = this;
            var formData = formView.getFormDataWithParsedValues();
            var childColumn = options.childColumn;
            if(formView.mode === FormView.CREATE_MODE){
                if(childColumn.disableFunctions && childColumn.disableFunctions.create){
                    childColumn.disableFunctions.create.apply(column, [formData, function(ret){
                        if(typeof ret !== 'undefined'){
                            if(ret){
                                if(childColumn.formViewElements.divHolders){
                                    if(!childColumn.disableFunction.defaultValue){
                                        childColumn.valueWhenDisabledCreateMode = childColumn.getFormViewElementValue(formView);
                                    }
                                    childColumn.setFormViewEditValue(null, formView.mode, (childColumn.disableFunction.defaultValue || ''));
                                    childColumn.formViewElements.divHolders[formView.mode].hide()
                                }
                            }
                            else{
                                if(childColumn.formViewElements.divHolders){
                                    if(childColumn.valueWhenDisabledCreateMode){
                                        childColumn.setFormViewEditValue(null, formView.mode, childColumn.valueWhenDisabledCreateMode);
                                        childColumn.valueWhenDisabledCreateMode = '';
                                        if(childColumn.disableFunction && childColumn.disableFunction.defaultValue){
                                            childColumn.valueWhenDisabledEditMode = childColumn.disableFunction.defaultValue;
                                        }
                                    }
                                    childColumn.formViewElements.divHolders[formView.mode].show()
                                }
                            }
                        }
                    }]);
                }
            }
            else if(formView.mode === FormView.EDIT_MODE){
                if(childColumn.disableFunctions && childColumn.disableFunctions.update){
                    childColumn.disableFunctions.update.apply(column, [formData, formView.data.edit, function(ret){
                        if(typeof ret !== 'undefined'){
                            if(ret){
                                if(childColumn.formViewElements.divHolders){
                                    if(!childColumn.disableFunction.defaultValue){
                                        childColumn.valueWhenDisabledEditMode = childColumn.getFormViewElementValue(formView);
                                    }
                                    childColumn.setFormViewEditValue(null, formView.mode, (childColumn.disableFunction.defaultValue || ''));
                                    childColumn.formViewElements.divHolders[formView.mode].hide()
                                }
                            }
                            else{
                                if(childColumn.formViewElements.divHolders){
                                    if(childColumn.valueWhenDisabledEditMode){
                                        childColumn.setFormViewEditValue(null, formView.mode, childColumn.valueWhenDisabledEditMode);
                                        childColumn.valueWhenDisabledEditMode = '';
                                        if(childColumn.disableFunction && childColumn.disableFunction.defaultValue){
                                            childColumn.valueWhenDisabledEditMode = childColumn.disableFunction.defaultValue;
                                        }
                                    }
                                    childColumn.formViewElements.divHolders[formView.mode].show()
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
        calculatedValueParentChanged: function(formView, column, options){
            var self = this;

            var formData = formView.getFormDataWithParsedValues();
            formData.__context = {
                form_view: formView,
                parent_data_row : formView.subModule.parentDataRow,
                parent_child_window : formView.subModule.parentChildWindow,
                parent_submodule : formView.subModule.parentSubModule,
            }
            var childColumn = options.childColumn;
            if(formView.mode === FormView.CREATE_MODE){
                if(childColumn.calculatedValueFunctions && childColumn.calculatedValueFunctions.create){
                    childColumn.calculatedValueFunctions.create.apply(column, [formData, function(ret){
                        if(typeof ret !== 'undefined'){
                            var currentValue = childColumn.getFormViewElementValue(formView);
                            if(currentValue == ret){

                            }
                            else{
                                childColumn.setFormViewEditValue(null, formView.mode, ret, {triggerChange: true});
                            }
                        }
                    }]);
                }
            }
            else if(formView.mode === FormView.EDIT_MODE){
                if(childColumn.calculatedValueFunctions && childColumn.calculatedValueFunctions.update){
                    childColumn.calculatedValueFunctions.update.apply(column, [formData, formView.data.edit, function(ret){
                        if(typeof ret !== 'undefined'){
                            var currentValue = childColumn.getFormViewElementValue(formView);
                            if(currentValue == ret){

                            }
                            else{
                                childColumn.setFormViewEditValue(null, formView.mode, ret, {triggerChange: true});
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
    _getSet:{
        resetForm: function(formView){
            var self = this;
            // Need to change to a reset function in every column object, like in Editor
            formView.container.find('input:not(:radio),textarea').val(null);
            formView.container.find('.formView-disabled-column').text('');
            formView.container.find('input[type="checkbox"]').prop('checked', false);
            formView.container.find('.imgElement').removeAttr('title')
                .css('background-image', '');
            formView.container.find('.imageInputElement')
                .removeData('changed').val(null);
            formView.container.find('.documentElement')
                .removeAttr('title').css('background-image', '');
            formView.container.find('.documentInputElement')
                .removeData('changed').val(null);
            formView.container.find('.expandButton[data-expanded="false"]')
                .each(function(){
                    $(this).closest('.formview-column-display-name')
                        .next().slideDown(0);
                });
            formView.container.find('select').each(function(){
                if(this.options.length){
                    this.options.selectedIndex = 0;
                }
            }).trigger('chosen:updated');//.change();

            if(formView.mode === FormView.CREATE_MODE){
                formView.subModule.forEachColumn(function(column){
                    if(column.simpleDataTables){
                        column.simpleDataTables[formView.mode].clear();
                    }
                }, function(column){
                    var ret = false;
                    if(column.type === Column.COLUMN_TYPES.HYPERLINK && column.typeSpecific.displayAsSubForm){
                        ret = true;
                    }
                    return ret;
                });

                var lookUpColumnsToReset = [];
                formView.subModule.forEachColumn(function(column){
                    column.childColumns.forEach(function(columnId){
                        if(lookUpColumnsToReset.indexOf(columnId) == -1){
                            lookUpColumnsToReset.push(columnId);
                        }
                    });
                }, function(column){
                    var ret = false;
                    if(column.type === Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST && column.childColumns && column.childColumns.length){
                        ret = true;
                    }
                    return ret;
                });
                lookUpColumnsToReset.forEach(function(lookUpColumnId){
                    var column = formView.subModule.columnManager.columns[lookUpColumnId];
                    column.setFormViewLookupData([], formView.mode, {});
                });
            }
            return self;
        },
        setHeaderText: function(formView){
            var self = this;
            formView.elements.headerTextElement.text(self.getHeaderText(formView));
        },
        getHeaderText: function(formView){
            var self = this;
            var ret = '';
            var headerText = formView.config[formView.mode].headerText || {text: "Default Text"};
            switch (formView.mode){
                case FormView.CREATE_MODE:
                    ret = headerText.text;
                    break;
                case FormView.VIEW_MODE:
                case FormView.EDIT_MODE:
                    ret = self.getTextFromSmartTextConfig(formView, headerText, formView.data.view)
                    break;
            }
            return ret;
        },
        getTextFromSmartTextConfig: function(formView, smartText, dataRow){
            var self = this;
            var str = '';
            if(smartText.config){
                smartText.config.forEach(function(item){
                    if(item.type == 'column'){
                        var column = formView.subModule.columnManager.columns[item.value];
                        if(column){
                            str += column.parseDisplayValue(dataRow);
                        }
                        else{
                            console.log('smart text issue colum : ', item);
                        }
                    }
                    else{
                        str += item.value;
                    }
                });
            }
            return str;
        },
        getFormData: function(formView, parseToDataType){
            var self = this;
            var columns = formView.columns;
            var formData;
            switch (formView.mode){
                case FormView.CREATE_MODE:
                    formData = self.getFormDataFromCreateMode(formView);
                    break;
                case FormView.EDIT_MODE:
                    formData = self.getFormDataFromEditMode(formView);
                    break;
                case FormView.VIEW_MODE:
                    formData = formView.data.edit;
                    break;
            }

            return formData;
        },
        getFormDataFromCreateMode: function(formView){
            var self = this;
            var formData = {};
            formView.forEach(function(column){
                if(column.disableCondition.disabled){
                    formData[column.id] = column.defaultValue;
                }
                else{
                    //formData[column.id] = column.getFormViewElement(formView.mode).val();
                    formData[column.id] = column.getFormViewElementValue(formView);
                }
            });

            formView.subModule.forEachColumn(function(column){
                var elements = formData[column.id] = column.hasImage[formView.mode];
                var fileName = elements.imgElement.attr('title');
                if(fileName){
                    var obj = elements.imgElement.data('fs');
                    obj.fileName = fileName;
                    obj.changed = elements.inputElement.data('changed');

                    if(obj.changed){
                        var dimensionObj = elements.imgElement.data('dimension');
                        obj.width = dimensionObj.width;
                        obj.height = dimensionObj.height;
                        obj.orientation = dimensionObj.orientation;
                    }

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

            formView.subModule.forEachColumn(function(column){
                var elements = formData[column.id] = column.hasDocument[formView.mode];
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


            formView.subModule.forEachColumn(function(column){
                formData[column.id] = column.simpleDataTables[formView.mode].getFormData();
            }, function(column){
                var ret = false;
                if(column.type === Column.COLUMN_TYPES.HYPERLINK && column.typeSpecific.displayAsSubForm){
                    ret = true;
                }
                return ret;
            });
            return formData;
        },
        getFormDataFromEditMode: function(formView){
            var self = this;
            var formData = {};
            formView.forEach(function(column){
                formData[column.id] = column.getFormViewElementValue(formView);
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

            formView.subModule.forEachColumn(function(column){
                var elements = formData[column.id] = column.hasImage[formView.mode];
                var changed = elements.inputElement.data('changed');
                var obj = elements.imgElement.data('fs') || {};
                obj.changed = changed;
                if(changed){
                    obj.fileName = elements.imgElement.attr('title');


                    var dimensionObj = elements.imgElement.data('dimension');
                    obj.width = dimensionObj.width;
                    obj.height = dimensionObj.height;
                    obj.orientation = dimensionObj.orientation;

                }
                formData[column.id] = obj;
            }, function(column){
                var ret = false;
                if(column.type === Column.COLUMN_TYPES.IMAGE){
                    ret = true;
                }
                return ret;
            });


            formView.subModule.forEachColumn(function(column){
                var elements = formData[column.id] = column.hasDocument[formView.mode];
                var changed = elements.inputElement.data('changed');
                var obj = elements.documentElement.data('fs') || {};
                obj.changed = changed;
                if(changed){
                    obj.fileName = elements.documentElement.attr('title');
                }
                formData[column.id] = obj;
            }, function(column){
                var ret = false;
                if(column.type === Column.COLUMN_TYPES.DOCUMENT){
                    ret = true;
                }
                return ret;
            });

            formData.id = formView.data.edit.id;
            return formData;
        },
        setViewData: function(formView, columnIds, data){
            var self = this;
            if(!data){
                data = formView.data.view;
            }
            if(columnIds){
                for(var key in columnIds){
                    var column = formView.subModule.columnManager.columns[key];
                    column.setFormViewDisplayValue(data, formView.mode);
                }
            }
            else{
                formView.forEach(function(col){
                    col.setFormViewDisplayValue(data, formView.mode);
                }, function(col){
                    return !col.getFormViewPosition(formView.mode).isHidden;
                });
            }
            return self;
        },
        setEditData: function(formView, columnIds, data){
            var self = this;

            if(!data){
                data = formView.data.edit;
            }
            if(columnIds){
                for(var key in columnIds){
                    var column = formView.subModule.columnManager.columns[key];
                    column.setFormViewEditValue(data, FormView.EDIT_MODE);
                }
            }
            else{
                formView.subModule.columnManager.forEachColumn(function(col){
                    col.setFormViewEditValue(data, FormView.EDIT_MODE);
                    if( col.typeSpecific.children && col.typeSpecific.children.length){
                        col.triggerFormViewElementChange(FormView.EDIT_MODE, {fromCode: true, useDbData: true});
                    }
                }, function(col){
                    //var ret = !col.getFormViewPosition(FormView.EDIT_MODE).isHidden;
                    return true;
//                    return ret;
                });
            }
            return self;
        },
        getFormTextData: function(formView, parseToDataType){
            var self = this;
            var columns = formView.columns;
            var formTextData;
            switch (formView.mode){
                case FormView.CREATE_MODE:
                    formTextData = self.getFormTextDataFromCreateMode(formView);
                    break;
            }

            return formTextData;
        },
        getFormTextDataFromCreateMode: function(formView){
            var self = this;
            var formTextData = {};
            formView.forEach(function(column){
                if(column.disableCondition.disabled){
                    formTextData[column.id] = column.defaultValue;
                }
                else{
                    //formData[column.id] = column.getFormViewElement(formView.mode).val();
                    formTextData[column.id] = column.getFormViewElementTextValue(formView);
                    column.valueWhenDisabledCreateMode = '';
                }
            });

//            formView.subModule.forEachColumn(function(column){
//                var elements = formData[column.id] = column.hasImage[formView.mode];
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

//            formView.subModule.forEachColumn(function(column){
//                formData[column.id] = column.simpleDataTables[formView.mode].getData();
//            }, function(column){
//                var ret = false;
//                if(column.type === Column.COLUMN_TYPES.HYPERLINK && column.typeSpecific.displayAsSubForm){
//                    ret = true;
//                }
//                return ret;
//            });
            return formTextData;
        },
        setCustomCreateModeValues: function(formView, dataRow){
            var self = this;
            formView.forEach(function(col){
//                if(col.type == 'lookUpLabel'){
//
//                }
//                else{
//
//                }
                if(dataRow[col.id] != undefined){
                    col.setFormViewEditValue(dataRow,formView.mode);
                }
//                col.setFormViewDefaultValue(formView);
                if( col.typeSpecific.children && col.typeSpecific.children.length){
//                    console.log('triggering change', col.id)
                    col.triggerFormViewElementChange(formView.mode, {fromCode: true, useDbData: true});
                }
                else if (col.childColumns && col.childColumns.length){
//                    console.log('triggering change', col.id)
                    col.triggerFormViewElementChange(formView.mode);
                }
            }, function(col){
                var ret = false;
                if(!col.isDisabledInFormView(formView.mode)){
                    ret = true;
                }
                return ret;
            });
            return self;
        },
        setDefaultValues: function(formView){
            var self = this;
            formView.forEach(function(col){
                col.setFormViewDefaultValue(formView);
                col.triggerFormViewElementChange(formView.mode, {});
                //No need to trigger change from here, its doing after getLookUpDataForCreateMode
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
                else if(col.getFromParentCondition4 && col.getFromParentCondition4.isEnabled){
                    ret = true;
                }
                else if(col.getFromParentCondition5 && col.getFromParentCondition5.isEnabled){
                    ret = true;
                }
                else if(typeof(col.defaultValue)!== 'undefined'){
                    ret = true;
                }
                return ret;
            });
            return self;
        },
        enableDisableGetFromParentConditionElements: function(formView){
            var self = this;
            if(!formView.tempDisabledFromViewElements){
                formView.tempDisabledFromViewElements = {};
            }
            if(formView.tempDisabledFromViewElements[formView.mode]){
                formView.tempDisabledFromViewElements[formView.mode].forEach(function(column){
                    column.enableFormViewElement(formView.mode, formView);
                });
            }
            formView.tempDisabledFromViewElements[formView.mode] = [];
            formView.forEach(function(column){
                var parentValue = column.parseGetFromParentCondition(formView);
                if(parentValue != null){
                    formView.tempDisabledFromViewElements[formView.mode].push(column);
                    column.disableFormViewElement(formView.mode, formView);
                }
            }, function(col){
                var ret = false;
                if(!col.isDisabledInFormView(formView.mode)){
                    if(col.disableIfGetDataFromParentIsSuccess){

                        if(col.getFromParentCondition1 && col.getFromParentCondition1.isEnabled ){
                            ret = true;
                        }
                        else if(col.getFromParentCondition2 && col.getFromParentCondition2.isEnabled ){
                            ret = true;
                        }
                        else if(col.getFromParentCondition3 && col.getFromParentCondition3.isEnabled ){
                            ret = true;
                        }
                        else if(col.getFromParentCondition4 && col.getFromParentCondition4.isEnabled ){
                            ret = true;
                        }
                        else if(col.getFromParentCondition5 && col.getFromParentCondition5.isEnabled ){
                            ret = true;
                        }

                    }
                }
                return ret;
            });
            return self;
        },
        enableDisableDisableOncePopulatedElements: function(formView){
            var self = this;
            if(!formView.tempDisabledFromViewElements){
                formView.tempDisabledFromViewElements = {};
            }
            if(formView.tempDisabledFromViewElements[formView.mode]){
                formView.tempDisabledFromViewElements[formView.mode].forEach(function(column){
                    column.enableFormViewElement(formView.mode, formView);
                });
            }
            formView.tempDisabledFromViewElements[formView.mode] = [];

            var dataRow = formView.data.edit;
            formView.forEach(function(column){
                var parentValue;
                if(dataRow){
                    parentValue = dataRow[column.id];
                }
                if(parentValue && typeof parentValue === 'object'){
                    parentValue = parentValue.value;
                }
                if(parentValue != null){
                    formView.tempDisabledFromViewElements[formView.mode].push(column);
                    column.disableFormViewElement(formView.mode, formView);
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
    _creation : {
        createContainer: function(formView){
            var div = $(document.createElement('div'))
                .attr(
                    {
                        id: formView.id,
                        'data-full-id': formView.fullId
                });
            return div;
        },
        createCloseButton: function(formView){
            var div = document.createElement('div');
            div.id = 'formview_close';
            div.className = 'formview-close-button';
            div.innerHTML = '<span class="fa fa-icon fa-close"></span>';
            formView.elements.closeButton = $(div);
            return div;
        },
        createElements: function(formView){
            var self = this;

            var config = formView.config;
            var elements = {};
            formView.elements = elements;
//        self.divMain = self.container.find('#div_main');
//        self.closeButton = self.container.find('#formview_close');

            var container = self.createContainer(formView)
                .addClass('formview-container');


            var divMain = $(document.createElement('div'))
                .attr('id', 'div_main')
                .addClass('formview-main');
////////////////////////////////////yathi/////////////////////////////////////
            if(formView.subModule.fullScreenFormView){
                divMain.css({"height":"100%","width":"100%"});
            }
//////////////////////////////////////////////////////////////////////////////
            $(document.createElement('div'))
                .attr(formView.constants.pointerOnTop).appendTo(divMain);
            $(document.createElement('div'))
                .attr(formView.constants.pointerCoverOnTop).appendTo(divMain);
            $(document.createElement('div'))
                .attr(formView.constants.pointerOnBottom).appendTo(divMain);
            $(document.createElement('div'))
                .attr(formView.constants.pointerCoverOnBottom).appendTo(divMain);

            divMain.append(self.createDraggableHeader(formView));

            //var buttonPanelCreate = self.createButtonPanel(formView, FormView.CREATE_MODE);
            //var buttonPanelEdit = self.createButtonPanel(formView, FormView.EDIT_MODE);

            var tableMainContainerCreate = self.createTableMainContainer(formView, config.create, FormView.CREATE_MODE);
            var tableMainContainerEdit = self.createTableMainContainer(formView, config.edit, FormView.EDIT_MODE);
            var tableMainContainerView = self.createTableMainContainer(formView, config.view, FormView.VIEW_MODE);

            elements.tableMainContainers = {
                create: tableMainContainerCreate,
                edit: tableMainContainerEdit,
                view: tableMainContainerView
            }

            var table = document.createElement('table');
            var trStickyTabContent = document.createElement('tr');
            var tdStickyTabContent = document.createElement('td');

            var trTabs = document.createElement('tr');
            var tdTabs = $(document.createElement('td'))
                .appendTo(trTabs);

            var trTableMain = document.createElement('tr');
            var tdTableMain = document.createElement('td');

            //tdButtonPanel.appendChild(buttonPanelCreate);
            //tdButtonPanel.appendChild(buttonPanelEdit);
            //tdButtonPanel.appendChild(buttonPanelView);

            tdTableMain.appendChild(tableMainContainerCreate.get(0));
            tdTableMain.appendChild(tableMainContainerEdit.get(0));
            tdTableMain.appendChild(tableMainContainerView.get(0));

            trStickyTabContent.appendChild(tdStickyTabContent);
            trTableMain.appendChild(tdTableMain);

            // table.appendChild(self.createDraggableHeader(formView));
            table.appendChild(trStickyTabContent);
            table.appendChild(trTabs);
            table.appendChild(trTableMain);
            // table.appendChild(self.createSaveButtonPanel(formView));

            divMain.append(table);
            container.append(divMain);

            divMain.append(self.createSaveButtonPanel(formView));

            elements.trStickyTabContent = tdStickyTabContent;
            elements.tabsContainer = tdTabs;
            elements.container = container;
            elements.divMain = divMain;
            elements.container = container;
            formView.container = container;

            return container;
        },
        createSaveButtonPanel: function(formView){
            // var tr = document.createElement('tr');
            // var td = document.createElement('td');
            var div = document.createElement('div');
            div.className = 'formview-save-panel';

            var btnSave = document.createElement('button');
            btnSave.innerHTML='Save';
            btnSave.className = 'formview-save-button';
            div.appendChild(btnSave);

            var btnCancel = document.createElement('button');
            btnCancel.innerHTML='Cancel';
            btnCancel.className = 'formview-cancel-button';
            div.appendChild(btnCancel);

            var btnRemoveSmallQuickAddMode = document.createElement('div');
            btnRemoveSmallQuickAddMode.innerHTML='+ Show Details';
            btnRemoveSmallQuickAddMode.className = 'removeSmallQuickAddView';
            div.appendChild(btnRemoveSmallQuickAddMode);

            $(btnSave).on('click', function(){
                formView.save();
            });
            $(btnCancel).on('click', function(){
                formView.cancel();
            });
            $(btnRemoveSmallQuickAddMode).on('click', function(){
                formView.removeSmallQuickAddMode();
            });


            let styling_mode_button_panel = $(document.createElement('div')).attr('class', 'styling_mode_button_panel')
            styling_mode_button_panel.html(
                `
<!--                <button class="simple-button add_new_table_row">Add Row</button>-->
                <button class="simple-button save_styling_settings">Save Style</button>
                <button class="simple-button cancel_new_styling_settings">Cancel Styling</button>
<!--                <button class="simple-button add_new_table_row">Add Row</button>-->
                `
            );
            $(div).append(styling_mode_button_panel);

            // formView.elements.styling_mode_add_new_table_row_button = styling_mode_button_panel.find('.add_new_table_row');
            formView.elements.save_styling_settings_button = styling_mode_button_panel.find('.save_styling_settings');
            formView.elements.cancel_new_styling_settings = styling_mode_button_panel.find('.cancel_new_styling_settings');

            // formView.elements.styling_mode_add_new_table_row_button.on('click', function () {
            //     formView.add_new_empty_row_in_styling_mode();
            // });
            formView.elements.save_styling_settings_button.on('click', function () {
                formView.exit_styling_mode(true);
            });
            formView.elements.cancel_new_styling_settings.on('click', function () {
                formView.exit_styling_mode(false);
            });

            formView.elements.saveButton = $(btnSave);
            formView.elements.cancelButton = $(btnCancel);

            // td.appendChild(div);
            // tr.appendChild(td);
            return div;
        },
        createBarcodeButtons: function(formView, mode){
            var self = this;

            var barcodeButtonContainer = document.createElement('div');
            barcodeButtonContainer.setAttribute('class', 'barcode-button-container');
            var barcodeScanStart = $(document.createElement('div')).attr({class: "barcode-scan-start-container"}).appendTo(barcodeButtonContainer);
            var barcodeScanStartButton = $(document.createElement('button')).attr({class: "barcode-scan-start-button"}).appendTo(barcodeScanStart);
            barcodeScanStartButton.text('Start Scan');
            var barcodeScanStop = $(document.createElement('div')).attr({class: "barcode-scan-stop-container"}).appendTo(barcodeButtonContainer);
            var barcodeScanStopButton = $(document.createElement('button')).attr({class: "barcode-scan-stop-button"}).appendTo(barcodeScanStop);
            barcodeScanStopButton.text('Stop Scan');

            formView.elements.barcodeScanStartButton = barcodeScanStartButton;
            formView.elements.barcodeScanStopButton = barcodeScanStopButton;
            formView.elements.barcodeButtonContainer = barcodeButtonContainer;

            return barcodeButtonContainer;
        },
        createDraggableHeader: function(formView){
            var self = this;
            // var tr = document.createElement('tr');
            // var td = document.createElement('td');
            var div = document.createElement('div');
            div.className = 'formview-draggable-header';

            var tableHeader = document.createElement('table');
            tableHeader.className = 'formview-header-table hundred-percent'
            var trHeader = document.createElement('tr');

            var tdHeaderText = document.createElement('td');
//            tdHeaderText.style.width= '40%';
            tdHeaderText.style.verticalAlign= 'top';
            var divHeaderElement = document.createElement('div');
            divHeaderElement.className = 'formview-header-text-panel'
            var spanHeaderText = document.createElement('span');
            spanHeaderText.id = 'header_text';
            divHeaderElement.appendChild(spanHeaderText);
            tdHeaderText.appendChild(divHeaderElement);
            trHeader.appendChild(tdHeaderText);

            var tdButtonPanel = document.createElement('td');
//            tdButtonPanel.style.width= '55%';
            var divButtonPanel = document.createElement('div');
            divButtonPanel.id = 'button_panel';
            divButtonPanel.appendChild(self.createButtonPanel(formView, Button.BUTTON_MODES.FORM, FormView.VIEW_MODE));

            if(formView.subModule.barcodeSubModule && formView.subModule.barcodeSubModule.isEnabled){
//                divButtonPanel.appendChild(self.createBarcodeButtons(formView, FormView.CREATE_MODE))
            }

            tdButtonPanel.appendChild(divButtonPanel);
            trHeader.appendChild(tdButtonPanel);

            var tdCloseButton = document.createElement('td');
//            tdCloseButton.style.width= '5%';
            tdCloseButton.style.verticalAlign= 'top';
            var closeButton = self.createCloseButton(formView);
            tdCloseButton.appendChild(closeButton);
            trHeader.appendChild(tdCloseButton);
            tableHeader.appendChild(trHeader);

            div.appendChild(tableHeader);
            // td.appendChild(div);
            // tr.appendChild(td);
            formView.elements.headerTextElement = $(spanHeaderText);
            formView.elements.headerTextContainerElement = $(divHeaderElement);

            return div;
        },
        createButtonPanel: function(formView, type, formViewMOde){
            var self = this;
            var element;
            switch(type){
                case Button.BUTTON_MODES.FORM:
                    element = formView.subModule.buttonManager.getFormViewElement();
                    break;
                case Button.BUTTON_MODES.GRID:
                    element = formView.subModule.buttonManager.getGridViewElement();
                    break;
            }
            //var div = $(document.createElement('div')).attr({class: 'button-manager-container-'+ type});
            //div.append(element);
            element.addClass('formview-'+formViewMOde);
            return element.get(0);
        },
        arrangeFormViewElements: function(formView, type, tableMains){
            var self = this;
            var subModule = formView.subModule;
            subModule.columnManager.forEachColumn(function(column){
                var pos = column.getFormViewPosition(type);
                if(pos.position == null){
                    pos.isHidden = true;
                }
                else if(!pos.isHidden){
                    if(pos.subForm != undefined){
                        formView.subForms[type][pos.subForm].appendColumn(pos, self.createHolderDiv(column, type));
                    }
                    else{
                        if(!column.formViewElements.divHolders){
                            column.formViewElements.divHolders = {};
                        }
                        if(!column.formViewElements.divHolders[type]){
                            column.formViewElements.divHolders[type] = self.createHolderDiv(column, type);
                        }
                        var td = tableMains[pos.tabId].find('#cell_'+ pos.position.row + '_'+ pos.position.col);
                        td.append(column.formViewElements.divHolders[type]);
                        if(!column.formViewElements.divHolders[type].find('.mandatory-field').length){
                            td.addClass('hideOnSmallQuickAddView')
                        }
                    }
                }
            });
            return self;
        },
        createTableMainContainer: function(formView, config, type){
            var self = this;
            var div = $(document.createElement('div'))
                .attr({id: 'table_main_container_'+ type})
                .addClass('formview-'+ type);
            self.createTableMain(formView, config, type);

            for(var key in formView.elements.tableMains[type]){
                div.append(formView.elements.tableMains[type][key]);
            }
            return div;
        },
        createTableMain: function(formView, config, type){
            var self = this;

            if(!formView.elements.tableMains){
                formView.elements.tableMains = {
                    create: {},
                    edit: {},
                    view: {}
                };
            }

            config.tabs.forEach(function(tabItem){
                let num_rows = tabItem.rows+1;
                if(num_rows < 8){
                    num_rows = 8;
                }
                var table = self.createEmptyTable(num_rows, config.cols, tabItem, formView);
                formView.elements.tableMains[type][tabItem.id] = table.attr('id', tabItem.id);
            });

//            if(config.subForms){
//                formView.subForms[type] = {};
//                config.subForms.forEach(function(item){
//                    var subForm = new SubForm(item, formView);
//                    formView.subForms[type][item.id] = subForm;
//                    table.find('#cell_'+ subForm.pos.row + '_'+ subForm.pos.col).append(subForm.getElement());
//                    //formView.subForms[type][subForm.id] = subForm;
//                });
//            }

            var subModule = formView.subModule;
            self.arrangeFormViewElements(formView, type, formView.elements.tableMains[type]);

            if(type != FormView.VIEW_MODE){
                subModule.columnManager.forEachColumn(function(column){
                        column.bindAutoPostBackEvents(formView, type);
                    },
                    function(column){
//                        if(column.type === Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST){
                        return column.childColumns && column.childColumns.length;
//                        }
                    });

                subModule.columnManager.forEachColumn(function(column){
                        var parentColumns =column.calculatedValue.parentColumns.parentColumns;
                        parentColumns.config.forEach(function(columnId){
                            subModule.columnManager.columns[columnId.value]
                                .bindFormViewElementCalculatedValueEvents(formView, type, column);
                        });
                    },
                    function(column){
                        var ret = false;
                        if(column.calculatedValue && column.calculatedValue.parentColumns && column.calculatedValue.parentColumns.isEnabled){
                            ret = true;
                        }
                        return ret;
                    }
                );

                subModule.columnManager.forEachColumn(function(column){
                        var parentColumns =column.disableFunction.parentColumns.parentColumns;
                        parentColumns.config.forEach(function(columnId){
                            subModule.columnManager.columns[columnId.value]
                                .bindFormViewElementDisableFunctions(formView, type, column);
                        });
                    },
                    function(column){
                        var ret = false;
                        if(column.disableFunction && column.disableFunction.parentColumns && column.disableFunction.parentColumns.isEnabled){
                            ret = true;
                        }
                        return ret;
                    }
                );
            }

//            if(formView.erp.deviceType === ERP.DEVICE_TYPES.PC) {
//
//                for(var key in formView.elements.tableMains[type]){
//                    var table = formView.elements.tableMains[type][key];
//
//                    $(table).find('tr[data-position]').each(function () {
//                        var tr = $(this);
//                        tr.children().each(function () {
//                            var colspan = 1;
//                            var td = $(this);
//                            if(formView.subModule.id == 'billing' && type == 'create'){
//                                tdsOld.push({td: this.id, length:  td.nextAll().length.toString()});
//                            }
//                            if(td.nextAll().length){
//                                td.nextAll().each(function () {
//                                    var nextTd = $(this);
//                                    if (nextTd.is(':empty')) {
//                                        colspan++;
//                                        nextTd.remove();
//                                    }
//                                    else {
//                                        return false;
//                                    }
//                                });
//                            }
//                            if(formView.subModule.id == 'billing' && type == 'create'){
//                                tds.push({td: this.id, colspan:  colspan.toString()});
//                            }
//                            td.attr('colspan', colspan);
//                        });
//                    });
//                }
//            }


            if(formView.erp.deviceType === ERP.DEVICE_TYPES.MOBILE && type != FormView.VIEW_MODE){
                for(var key in formView.elements.tableMains[type]){
                    var table = formView.elements.tableMains[type][key];
                    var trArr = $(table).find('tr[data-position]');
                    trArr.each(function(){
                        var tr = $(this);
                        var td1 = tr.children().eq(1);
                        var td2 = tr.children().eq(2);
                        var td3 = tr.children().eq(3);
                        var td4 = tr.children().eq(4);
                        var td5 = tr.children().eq(5);
                        if(td1.length){
                            var tempTr = $(document.createElement('tr'));
                            tempTr.append(td1);
                            tr.after(tempTr);
                        }
                        if(td2.length){
                            var tempTr = $(document.createElement('tr'));
                            tempTr.append(td2);
                            tr.after(tempTr);
                        }
                        if(td3.length){
                            var tempTr = $(document.createElement('tr'));
                            tempTr.append(td3);
                            tr.after(tempTr);
                        }
                        if(td4.length){
                            var tempTr = $(document.createElement('tr'));
                            tempTr.append(td4);
                            tr.after(tempTr);
                        }
                        if(td5.length){
                            var tempTr = $(document.createElement('tr'));
                            tempTr.append(td5);
                            tr.after(tempTr);
                        }
                    });
                }
            }
            return table;
        },
        createScanningContainer: function(formView){
            var self = this;
            formView.hasBarcode = true;
            var subModule = formView.subModule;
            var targetSubModuleId = subModule.barcodeSubModule.barcodeSubModule;
            var targetBarcodeSubModuleObject = formView.subModule.parentObject.subModules[targetSubModuleId];

//            var barcodeScanningTr = $(document.createElement('tr')).attr({class: "barcode-tr-"+FormView.CREATE_MODE});
//            var barcodeScanningTd = $(document.createElement('td')).attr({class: "barcode-td"}).appendTo(barcodeScanningTr);
            var scaningContainer = $(document.createElement('div')).attr({class: "barcode-scaning-container"})

            var scaningRadar = $(document.createElement('div'))
                .attr({class: "barcodeScanningRadar"}).appendTo(scaningContainer)
//            var barcodeColumnHeadContainer = $(document.createElement('div')).attr({class: "barcode-column-head-container"}).appendTo(barcodeScanningTd);
            var barcodescanner = $(document.createElement('input')).attr({class: "barcodeInput", type: "text"}).appendTo(scaningContainer);
            if(targetBarcodeSubModuleObject.barcodeColumn && targetBarcodeSubModuleObject.barcodeColumn.isEnabled){
                var barcodeColumn = targetBarcodeSubModuleObject.barcodeColumn.barcodeColumn;
//                barcodeColumnHeadContainer.text('SCANNING...');

                formView.elements.targetSubModuleBarcodeColumn = barcodeColumn;
                formView.elements.targetBarcodeSubModule = targetBarcodeSubModuleObject;
            }
            formView.elements.barcodescanner = barcodescanner;
            formView.elements.scaningRadar = scaningRadar;
//            formView.elements.barcodeScanningName = barcodeColumnHeadContainer;
            var hyperLinkedColumnWithBarcodeSubModule = formView.getHyperlinkedColumnWithBarcodeSubModule(targetBarcodeSubModuleObject)
            var autoUpdateColumnWithBarcode = formView.getAutoUpdateColumnWithBarcode(targetBarcodeSubModuleObject);
            var barcodeConfig = {
                targetBarcodeSubModule: targetBarcodeSubModuleObject,
                barcodeColumnId: barcodeColumn,
                hyperlinkedColumnWithBarcodeSubModule: hyperLinkedColumnWithBarcodeSubModule,
                autoUpdateColumnWithBarcode: autoUpdateColumnWithBarcode
            }
            formView.barcodeScannedIds = [];
            formView.barcodeConfig = barcodeConfig;
            formView.elements.barcodescanner  && formView.elements.barcodescanner.on('keyup', function(event){
                if(event.keyCode == 13){
                    var value = $(this).val();
                    if(value.length == 7){
                        barcodeConfig.value = value;
                        formView.addValueToChildTable(barcodeConfig);
                    }
                    formView.elements.barcodescanner.val('');
                }
            });
//            barcodeScanningTr.hide();
            return scaningContainer;
        },

        createSubForm: function(){
            var self = this;
        },
        createHolderDiv: function(column, type){
            var self = this;
            var div = $(document.createElement('div'))
                .attr({id: 'holder_'+ type+'_'+ column.id})
                .attr('data-column_id', column.id)
                .addClass('formview-column-holder');
            div.data('column', column);
            var table = document.createElement('table');
            table.className = 'hundred-percent-x';
            var tr = document.createElement('tr');
            var tdDisplayName = document.createElement('td');
            tdDisplayName.className = 'formview-column-display-name primary_display_name';
            if(column.type == Column.COLUMN_TYPES.HYPERLINK && type != 'create'){
                tdDisplayName.classList.add('hyperlinkColumn');
            }

            if(column.validations.mandatory){
                tdDisplayName.className += ' mandatory-field';
            }
            var tdElements = document.createElement('td');
            tdElements.className = 'formview-column-form-elements';
            var divDisplayName = self.createDisplayNameElement(column);
            tdDisplayName.appendChild(divDisplayName);

            if(column.type == Column.COLUMN_TYPES.HYPERLINK){
                var expandButton = $(document.createElement('div'))
                    .attr({
                        "class": "expandButton",
                        "data-expanded": true
                    })
                    .text('-');
                expandButton.appendTo(divDisplayName);
            }
            var divElements = $(document.createElement('div'))
                .addClass('formview-column-elements-holder');


            var displayValueElement = self.createDisplayValueElement(column);
            divElements.append(displayValueElement);

            var editValueElement = self.createEditValueElement(column, type);
            divElements.append(editValueElement);


            tdElements.appendChild(divElements.get(0));

            tr.appendChild(tdDisplayName);
            tr.appendChild(tdElements);
            table.appendChild(tr);

            div.append(table);
            return div;
        },
        createDisplayNameElement: function(column){
            var self = this;
            var div = $(document.createElement('div'));
            var span = $(document.createElement('span'));
            div.append(span);
            if(column.icon && column.icon.originalName){
                var imagePath = 'iconsGenerated/' + column.module.id + '/' + column.subModule.id + '/' + column.id + '_' + column.icon.name;
                var image = $(document.createElement('img'));
                if(column.type == Column.COLUMN_TYPES.HYPERLINK){
                    image.attr({class: "formViewHyperLinkImageContainer", src: imagePath});
                }
                else{
                    image.attr({class: "formViewImageContainer", src: imagePath});
                }
                span.append(image);
            }
            span.append( column.formViewDisplayName || column.displayName);
            return div.get(0);
        },
        createDisplayValueElement: function(column){
            var self = this;
            var classes = 'formview-column-display-value';
            var div = $(document.createElement('div')).append( $(document.createElement('span')) ).addClass(classes);
            return div.get(0);
        },
        createEditValueElement: function(column, type){
            var self = this;
            var element = column.getFormViewElement(type);

//            var form = document.createElement('form');
//            var submit = document.createElement('input');
//            form.id = element.attr('id')+'_form';
//            submit.type = 'submit';
//            form.appendChild(element.get(0));
//            form.appendChild(submit);
//            element.data('submit', submit);
            var div = $(document.createElement('div')).append(  element  );
            return div.get(0);
        },
        createEmptyTable: function(rows, cols, tabItem, formView){
            var self = this;
            var table = document.createElement('table');
            table.className = 'table-main';
            for(var i=0; i< rows; i++){
                var tr = document.createElement('tr');
                tr.setAttribute('data-position', i.toString());
                tr.classList.add('form_view_table_row');
                tr.id = 'row_'+i;
                for(var j=0; j< cols; j++){
                    var td = document.createElement('td');
                    td.setAttribute('data-position', i+','+j);
                    td.id = 'cell_'+i+'_'+j;
                    td.classList.add('form_view_table_cell');

                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            table = $(table);

            if(formView && formView.erp.deviceType === ERP.DEVICE_TYPES.PC && tabItem) {

                for(var key in tabItem.mergedCells){
                    var cellInfo = tabItem.mergedCells[key];
                    var td = table.find('#cell_'+key)
                        .attr({
                            "rowspan": cellInfo.rowspan,
                            "colspan": cellInfo.colspan
                        });
                    td.addClass('mergedShown').nextAll().each(function(index){
                        var td = $(this);
                        if(cellInfo.colspan == (index+1)){
                            return false;
                        }
                        td.addClass('mergedHidden');
                    });
                    var currentTdIndex = td.index();
                    td.parent().nextAll().each(function(index){
                        var tr = $(this);
                        if(cellInfo.rowspan == (index+1)){
                            return false;
                        }
                        tr.children().each(function(innerIndex){
                            var td = $(this);
                            if(innerIndex < currentTdIndex){
                                return true;
                            }
                            if((cellInfo.colspan + currentTdIndex) == innerIndex){
                                return false;
                            }
                            td.addClass('mergedHidden');
                        });
                    });
                }
                table.find('.mergedHidden').remove();
            }

            return table;
        }
    },
    getAutoUpdateColumnWithBarcode: function(targetBarcodeSubModuleObject){
        var self = this;
        var columnId = '';
        targetBarcodeSubModuleObject.forEachColumn(function(column){
            columnId = column.autoUpdateWithBarcode.autoUpdateWithBarcode;
        }, function(column){
            var ret = false;
            if(column.autoUpdateWithBarcode && column.autoUpdateWithBarcode.isEnabled){
                ret = true;
            }
            return ret;
        });
        var columnElement = ''
        if(columnId){
            columnElement = targetBarcodeSubModuleObject.columnManager.columns[columnId];
        }

        return columnElement;
    },
    getHyperlinkedColumnWithBarcodeSubModule: function(targetBarcodeSubModuleObject){
        var self = this;
        var hyperLinkedColumn = '';
        self.subModule.forEachColumn(function(column){
            if(targetBarcodeSubModuleObject.id === column.typeSpecific.dataSource.subModuleId){
                hyperLinkedColumn = column;
            }
        }, function(column){
            var ret = false;
            if(column.type == 'hyperLink'){
                var ret = true;
            }
            return ret;
        });
        return hyperLinkedColumn;
    },
    addValueToChildTable: function(barcodeConfig, addValueToChildTableCallback){
        var self = this;
        var simpleDataTablesInCreate = self.simpleDataTables[FormView.CREATE_MODE];
        var simpleDataTableWithBarcode = simpleDataTablesInCreate[barcodeConfig.hyperlinkedColumnWithBarcodeSubModule.id];
        barcodeConfig.barcodeColumnElement = $(simpleDataTableWithBarcode.container.find('#create_'+barcodeConfig.barcodeColumnId).get(0));
        barcodeConfig.simpleDataTableWithBarcode = simpleDataTableWithBarcode;
        self.findColumnValueFromId(barcodeConfig, addValueToChildTableCallback);
        return self;
    },
    findColumnValueFromId: function(barcodeConfig, addChildValueCallback){
        var self = this;
        var value = barcodeConfig.value;
        var column = barcodeConfig.targetBarcodeSubModule.columnManager.columns[barcodeConfig.barcodeColumnId];
        var getRowIdWithExistingValue = function(value){
            var rowId = '';
            var rowContainers = barcodeConfig.simpleDataTableWithBarcode.container.find('.simpleDataTableRowContainer')
            rowContainers.each(function(){
                var rowContainer = $(this);
                var barcodeColumnElement = rowContainer.find('#create_'+barcodeConfig.barcodeColumnId);
                if(barcodeColumnElement.val() === value){
                    rowId = rowContainer.attr('id');
                }
            });
            return rowId;
        };
        var hasCorrectValue = false;
        barcodeConfig.barcodeColumnElement.find('option').each(function(){
            var option = $(this);

            if(value && option.attr('value') === value){
                hasCorrectValue = true;
                var simpleDataTableRowIdWithValue = getRowIdWithExistingValue(value);
                if(simpleDataTableRowIdWithValue){
                    var simpleDataTableRowWithValue = barcodeConfig.simpleDataTableWithBarcode.simpleDataTableRows[simpleDataTableRowIdWithValue];
                    var autoUpdateVal = barcodeConfig.autoUpdateColumnWithBarcode.getSimpleDataTableRowElementValue(simpleDataTableRowWithValue);
                    autoUpdateVal = autoUpdateVal + 1;
//                    console.log(autoUpdateVal);
                    barcodeConfig.autoUpdateColumnWithBarcode.setSimpleDataTableRowEditValue('', simpleDataTableRowWithValue, autoUpdateVal, {triggerChange: true});
                }
                else{
                    var rowCountInSimpleDataTable = Object.keys(barcodeConfig.simpleDataTableWithBarcode.simpleDataTableRows).length
                    var rowKey = Object.keys(barcodeConfig.simpleDataTableWithBarcode.simpleDataTableRows)[rowCountInSimpleDataTable-1];
                    var columnValue = column.getSimpleDataTableRowElement(barcodeConfig.simpleDataTableWithBarcode.simpleDataTableRows[rowKey]).val();
                    if(columnValue){
                        barcodeConfig.simpleDataTableWithBarcode.addNewRow();
                        var rowCountInSimpleDataTable = Object.keys(barcodeConfig.simpleDataTableWithBarcode.simpleDataTableRows).length
                        rowKey = Object.keys(barcodeConfig.simpleDataTableWithBarcode.simpleDataTableRows)[rowCountInSimpleDataTable-1];
                    }
                    column.setSimpleDataTableRowEditValue('', barcodeConfig.simpleDataTableWithBarcode.simpleDataTableRows[rowKey], value, {triggerChange: true});
//                    barcodeConfig.simpleDataTableWithBarcode.addNewRow();
                }
            }
        });
        if(addChildValueCallback){
            addChildValueCallback(hasCorrectValue);
        }
        return self;
    },
    _events   : {
    },
    _ui       : {
        resetUi: function(formView){
            var self = this;
            formView._ui.resetFormUi(formView);
            formView._getSet.resetForm(formView);
            formView._ui.positionCloseButton(formView);
            formView.elements.saveButton.text('Save');
            formView.enableSaveButton();
            return self;
        },
        resetFormUi: function(formView){
            var self = this;
            formView.container.find('.formview-column-holder')
                .css('border','');
            formView.tabbers[formView.mode].clearNotificationCount();
            for( var key in formView.simpleDataTables[formView.mode]){
                formView.simpleDataTables[formView.mode][key]
                    .clearErrorMessage();
            }
            formView.validationManager.removeAll();
            return self;
        },
        positionCloseButton: function(formView){
            var offset = formView.elements.divMain.offset();
            var width = formView.elements.divMain.width();
            var left = offset.left + width- 10;
            var top = offset.top - 10;
            formView.elements.closeButton.css({left: left, top: top});
        }
    },
    validateUnique: function(column, element){
        var self = this;
        var config = {mode: self.mode};
        if(self.mode === FormView.EDIT_MODE){
            config.id = self.data.edit.id;
        }
        self.validationManager.validateUniqueColumn(column, element, config)
        return self;
    },
    validateCustomSql: function(column, element){
        var self = this;
        var data = {
            formViewMode: self.mode,
            config: self.getFormData(),
            columnId: column.id
        };
        self.validationManager.validateCustomSqlColumn(column, element, data)
        return self;
    },
    executeCustomOnChangeEventFunction: function(column, element, jsFunction){
        var self = this;
        jsFunction && jsFunction.apply(self, [self.getFormData(), self.subModule, self, column, function(err){
            console.log(err);
        }]);
        return self;
    },
    showSubFormAsStackedChild: function(parentColumn, dataRow, tr){
        var self = this;
        var dataSource = parentColumn.typeSpecific.dataSource;
        var targetSubModule = self.erp.modules[dataSource.moduleId]
            .subModules[dataSource.subModuleId];
        var targetFormView = targetSubModule.formView;
        targetFormView.setZIndex(9999999999999999999999999);
        self.stackedChildFormView = targetFormView;
        self.stackedChildColumn = parentColumn;
        targetFormView.show(FormView.CREATE_MODE, {}, targetSubModule.buttonManager.getDefaultButton('create'), {
            onBeforeInsert: function(formData, formTextData, targetFormViewObj){
                this.setZIndex();
                if(tr){
                    tr.remove();
                }
                self.addHyperLinkFormData(parentColumn, formData, formTextData);
                targetFormViewObj.cancel(true);
                setTimeout(function(){
                    self.showSubFormAsStackedChild(parentColumn);
                }, 500);
            },
            showAsStackedFormViewChild: true,
            executeBeforeSqlOnly: parentColumn.typeSpecific.executeBeforeSqlOfTargetButton,
            ignoreParentCondition: true,
            customCreateModeValues: dataRow,
            parentSubModule: parentColumn.subModule,
            parentFormView: parentColumn.subModule.formView
        });
        return self;
    },

    hyperLinkElementClicked: function(column, dataRow, tr){
        var self = this;
        if(self.stackedChildFormView){
            self.showSubFormAsStackedChild(self.stackedChildColumn,  dataRow, tr);
            return self;
        }
        var dataSource = column.typeSpecific.dataSource;
        var targetSubModule = self.erp.modules[dataSource.moduleId]
            .subModules[dataSource.subModuleId];
        var targetFormView = targetSubModule.formView;
        targetFormView.setZIndex(9999999999999999);
        targetFormView.show(FormView.CREATE_MODE, {}, targetSubModule.buttonManager.getDefaultButton('create'), {
            onBeforeInsert: function(formData, formTextData, targetFormViewObj){
                this.setZIndex();
                if(tr){
                    tr.remove();
                }
                self.addHyperLinkFormData(column, formData, formTextData);
                targetFormViewObj.cancel(true);
            },
            executeBeforeSqlOnly: column.typeSpecific.executeBeforeSqlOfTargetButton,
            ignoreParentCondition: true,
            customCreateModeValues: dataRow,
            parentSubModule: column.subModule,
            parentFormView: column.subModule.formView
        });
        return self;
    },
    addHyperLinkFormData:function(column, formData, formTextData){
        var self = this;
        var dataTable = column.simpleDataTables[FormView.CREATE_MODE];
        dataTable.addNewRow(formData, formTextData);
        return self;
    },
    setSimpleDataTableToReSizeMode: function(columnId){
        var self = this;
        self.subModule.columnManager.columns[columnId].simpleDataTables[self.mode]
            .setToReSizeMode();
        return self;
    },
    setZIndex: function(zIndex){
        var self = this;
        // self.container.css({zIndex: zIndex || ''});
        if(!zIndex){
            // self.container.css({zIndex: ''});
        }
        else{
            if(zIndex > 99999){
                zIndex = 9999;
            }
            window.global_formview_z_index = window.global_formview_z_index || 1000001;
            window.global_formview_z_index++;
            console.trace();
            self.container.css({zIndex: window.global_formview_z_index || ''});
        }
        return self;
    },
    enableDisableHeaderButtons: function(){
        var self = this;
        self.subModule.buttonManager.enableDisableFormViewButtons(self.data.edit);
        return self;
    },
    resetDisabledColumns: function(){
        var self = this;
        self.disabledColumns.forEach(function(columnId){
            self.subModule.columnManager.columns[column].enableFormViewElement(self.mode);
        });
        self.disabledColumns = [];
        return self;
    },
    enableColumn: function(column){
        var self = this;
        if(typeof column == 'string'){
            column = self.subModule.columnManager.columns[column];
        }
        var index = self.disabledColumns.indexOf(column.id);
        if(index !=-1){
            self.disabledColumns.splice(index, 1);
        }
        else{
            return self;
        }
        column.enableFormViewElement(self.mode);
        return self;
    },
    disableColumn: function(column){
        var self = this;
        if(typeof column == 'string'){
            column = self.subModule.columnManager.columns[column];
        }
        var index = self.disabledColumns.indexOf(column.id);
        if(index ==-1) {
            self.disabledColumns.push(column.id);
        }
        else{
            return self;
        }
        column.disableFormViewElement(self.mode);
        return self;
    },
    reloadCurrentEditDataFromServer: function(){
        var self = this;
        self._db.getOneRowData(self);
        return self;
    },



    handleArrowKeyDown: function(eve){
        var self = this;
        var ret = true;
        var element = $(eve.target);
        if(self.isCtrlDown){
            switch(eve.keyCode){
                case ERP.KEY_CODES.LEFT:
                    self._arrowKeyHandlers.ctrlLeft(eve, element, self);
                    break;
                case ERP.KEY_CODES.RIGHT:
                    self._arrowKeyHandlers.ctrlRight(eve, element, self);
                    break;
            }
        }
        else{
            switch(eve.keyCode){
                case ERP.KEY_CODES.LEFT:
                    if(element.is('input[type="date"],input[type="time"],input[type="checkbox"]')){
                        ret = false;
                    }
                    else if(element.get(0).selectionStart == 0){
                        ret = false;
                    }
                    if(!ret){
                        self._arrowKeyHandlers.left(eve, element, self);
                    }
                    ret = true;
                    break;
                case ERP.KEY_CODES.RIGHT:
                    if(element.is('input[type="date"],input[type="time"],input[type="checkbox"]')){
                        ret = false;
                    }
                    else if(element.get(0).selectionStart == element.val().length){
                        ret = false;
                    }
                    if(!ret){
                        self._arrowKeyHandlers.right(eve, element, self);
                    }
                    ret = true;
                    break;
                case ERP.KEY_CODES.UP:
                    if(element.parent().is('.chosen-search')){
                        ret = true;
                    }
                    else {
                        if(element.is('textarea')){
                            if(element.get(0).selectionStart == 0){
                                ret = false;
                                self._arrowKeyHandlers.up(eve, element, self);
                            }
                            else{
                                ret = true;
                            }
                        }
                        else{
                            self._arrowKeyHandlers.up(eve, element, self);
                        }
                    }
                    ret = false;
                    break;
                case ERP.KEY_CODES.DOWN:
                    if(element.parent().is('.chosen-search')){
                        ret = true;
                    }
                    else{
                        if(element.is('textarea')){
                            if(element.get(0).selectionStart == element.val().length){
                                ret = false;
                                self._arrowKeyHandlers.down(eve, element, self);
                            }
                            else{
                                ret = true;
                            }
                        }
                        else{
                            self._arrowKeyHandlers.down(eve, element, self);
                        }
                    }
                    ret = false;
                    break;
            }
        }

        return ret;
    },
    _arrowKeyHandlers:{
        ctrlLeft: function(eve, element, formView){
            var self = this;
            formView.setPreviousTabAsSelected();
            return self;
        },
        ctrlRight: function(eve, element, formView){
            var self = this;
            formView.setNextTabAsSelected();
            return self;
        },
        left: function(eve, element, formView){
            var self = this;
            element.closest('td[data-position]').prevAll().each(function(){
                var element = $(this).find('.editable');
                if(element.length){
                    var column = formView.subModule.columnManager.columns[element.attr('data-column-id')];
                    column.focusFormViewElement(formView.mode);
                    return false;
                }
            });
            return self;
        },
        right: function(eve, element, formView){
            var self = this;
            element.closest('td[data-position]').nextAll().each(function(){
                var element = $(this).find('.editable');
                if(element.length){
                    var column = formView.subModule.columnManager.columns[element.attr('data-column-id')];
                    column.focusFormViewElement(formView.mode);
                    return false;
                }
            });
            return self;
        },

        up: function(eve, element, formView){
            var self = this;
            var tdIndex = element.closest('td[data-position]').index();
            element.closest('tr[id]')
                .prevAll().each(function(){
                var element = $(this).children().eq(tdIndex).find('.editable');
                if(element.length){
                    var column = formView.subModule.columnManager.columns[element.attr('data-column-id')];
                    column.focusFormViewElement(formView.mode);
                    return false;
                }
            });
            return self;
        },
        down: function(eve, element, formView){
            var self = this;
            var tdIndex = element.closest('td[data-position]').index();
            element.closest('tr[id]')
                .nextAll().each(function(){
                var element = $(this).children().eq(tdIndex).find('.editable');
                if(element.length){
                    var column = formView.subModule.columnManager.columns[element.attr('data-column-id')];
                    column.focusFormViewElement(formView.mode);
                    return false;
                }
            });
            return self;
        }
    },


    go_to_styling_mode: function () {
        const self = this;
        this.is_in_styling_mode = true;
        this.initialize_styling_mode();
    },
    destroy_styling_mode: function () {
        const self = this;
        self.container.removeClass('styling_mode');
        $(document.body).off('keydown.formview');
        // formView.elements.tableMains[type]
        const formview_column_holder_elements = self.container.find('.table-main:visible .formview-column-holder');

        // remove resizable as well later
        formview_column_holder_elements.draggable('destroy');
        self.container.find('.table-main:visible .form_view_table_cell').droppable('destroy');
        self.elements.divMain.resizable('destroy');
    },
    refresh_form_view_column_holder_elements: function (new_element) {
        if(new_element){
            let handle_class = 'primary_display_name';
            // if(new_element.classList.contains('form_view_custom_element')){
            //     handle_class = '';
            // }
            jQuery(new_element).draggable({
                // helper: "clone",
                handle: handle_class ? `.${handle_class}` : undefined,
                cursor: "move",
                revert: "invalid",
                start: function () {
                    console.log('draggable start', this);
                    // $(this).resizable('destroy');
                }
            });
        }
        this.formview_column_holder_elements = this.container.find('.table-main:visible').find('.form_view_custom_element,.formview-column-holder');
    },
    initialize_styling_mode: function () {
        const self = this;
        self.container.addClass('styling_mode');

        // formView.elements.tableMains[type] need to use this
        // self.formview_column_holder_elements = self.container.find('.table-main:visible :is(.form_view_custom_element, .formview-column-holder)');
        this.refresh_form_view_column_holder_elements();
        const column_resizable_factor = 10

        $(document.body).on('keydown.formview', function(eve){
            if(eve.keyCode == ERP.KEY_CODES.CTRL){
                self.formview_column_holder_elements.draggable('disable');

                self.formview_column_holder_elements.resizable({
                    // handles: "n, e, s, w, ne, se, sw, nw",
                    grid: [column_resizable_factor, column_resizable_factor],
                    minHeight: 55,
                    minWidth: 100,
                    // containment: "parent", // Contain resizing within the parent element
                    start: function(event, ui) {
                        $(this).css({
                            left: 0,
                            top: 0,
                            position: 'relative'
                        });
                        // $(this).css('position', 'relative'); // Ensure the position is relative during resizing
                    },
                    stop: function () {
                        let resized_element = $(this);
                        // resized_element.css({
                        //     left: 0,
                        //     top: 0,
                        //     position: 'relative'
                        // });
                        console.log('found : ', resized_element.find('#simpleDataTable').get(0));


                        let new_width = parseInt(resized_element.css('width'));
                        let new_height = parseInt(resized_element.css('height'));
                        console.log(`new_size 1 : ${new_width},${new_height}`)

                        new_width = parseInt(Math.round(new_width / 50) * 50);
                        new_height = parseInt(Math.round(new_height / 10) * 10);

                        // for (let allowed_column_width of allowed_column_widths) {
                        //     if(new_width === allowed_column_width){
                        //         break;
                        //     }
                        //     if(new_width > allowed_column_width){
                        //         continue;
                        //     }
                        //     new_width = allowed_column_width;
                        // }

                        // if(new_width % column_resizable_factor !== 0){
                        //     let diff = new_width % column_resizable_factor;
                        //     if(diff >= (column_resizable_factor / 2)){
                        //         new_width += column_resizable_factor - diff;
                        //     }
                        //     else{
                        //         new_width -= diff;
                        //     }
                        // }





                        // if(new_height % column_resizable_factor !== 0){
                        //     let diff = new_height % column_resizable_factor;
                        //     if(diff >= (column_resizable_factor / 2)){
                        //         new_height += column_resizable_factor - diff;
                        //     }
                        //     else{
                        //         new_height -= diff;
                        //     }
                        // }
                        console.log(`new_size 2 : ${new_width},${new_height}`)
                        resized_element.css('width', new_width);
                        resized_element.css('height', new_height);
                        resized_element.attr('title', `size : ${new_width},${new_height}`);

                        resized_element.data('data-size_info', {
                            width: resized_element.css('width'),
                            height: resized_element.css('height')
                        });

                        if(resized_element.find('#simpleDataTable').length){
                            resized_element.css('minHeight', resized_element.css('height'));
                            resized_element.css('height', '');
                        }



                    }
                });
            }
        });
        $(document.body).on('keyup.formview', function(eve){
            if(eve.keyCode == ERP.KEY_CODES.CTRL){
                self.formview_column_holder_elements.draggable('enable');
                self.formview_column_holder_elements.resizable('destroy');

                // formview_column_holder_elements.css({
                //     left: 0,
                //     top: 0,
                //     position: 'relative'
                // });
            }
        });


        // formview_column_holder_elements.on('mouseleave', function () {
        //     // let single_element = $(this);
        //     // console.log('mouseleave', this);
        //     // single_element.resizable('destroy');
        // });
        // formview_column_holder_elements.on('mouseenter', function () {
        //     let single_element = $(this);
        //     // console.log('mouseenter', this);
        //     // single_element.resizable({
        //     //     handles: "n, e, s, w, ne, se, sw, nw",
        //     //     start: function(event, ui) {
        //     //         console.log('resize start', this);
        //     //         // $(this).css('position', 'relative');
        //     //     },
        //     //     end: function () {
        //     //         console.log('resize end', this);
        //     //         // single_element.resizable('destroy');
        //     //     }
        //     // });
        // });



        self.formview_column_holder_elements.draggable({
            // helper: "clone",
            handle: ".primary_display_name",
            cursor: "move",
            revert: "invalid",
            start: function () {
                console.log('draggable start', this);
                // $(this).resizable('destroy');
            }
        });

        self.container.find('.table-main:visible .form_view_table_cell').droppable({
            accept: ".formview-column-holder,.form_view_custom_element",
            hoverClass: "ui-state-hover",
            tolerance: "pointer",
            drop: function(event, ui) {
                // If there's already an element inside the cell, prevent dropping
                if ($(this).children().length > 0) {
                    return;
                }

                // Get the draggable element
                var draggable = ui.draggable;

                // Remove the element from its current position
                draggable.detach();

                // Append the draggable element to the new cell
                $(this).append(draggable);
                draggable.css({
                    left: 0,
                    top: 0,
                    position: 'relative'
                });
            }
        });



        // if(self.erp.deviceType === ERP.DEVICE_TYPES.PC){
        // }
        // self.elements.divMain.draggable({
        //     handle: '.formview-draggable-header',
        //     containment: self.container,
        //     start: function(){
        //         self.validationManager.removeAll();
        //     }
        // });
        self.elements.divMain.resizable({
            handles: 'e,w',
            minWidth: 600,
            stop: function(event, ui){
                self.saveFormViewWidth(ui.size);
            },
            resize: function (eve) {
                // if(self.elements.divMain.children('table').width() > self.elements.divMain.width()){
                //     self.elements.divMain.resizable( "option", "minWidth", self.elements.divMain.children('table').width() + 5 );
                // }
            }
        });
    },



    set_to_full_size_mode: function () {
        const self = this;
        self.display_styling_mode = 'full_size';
        self.container.removeClass('custom_size');
        self.container.addClass(self.display_styling_mode);
    },

    set_to_custom_size_mode: function () {
        const self = this;
        self.display_styling_mode = 'custom_size';
        self.container.removeClass('full_size');
        self.container.addClass(self.display_styling_mode);
    },


    get_styling_setting_from_user: function () {
        const self = this;
        return self.erp.get_role_setting_value(self.get_styling_setting_name());
    },
    get_styling_setting_name: function () {
        const self = this;
        return `formview_styling_config__${self.subModule.id}__${self.mode}`
    },
    save_latest_styling_configuration: function () {
        const self = this;

        let formview_column_holder_elements = self.container.find('.table-main:visible').find('.formview-column-holder,.form_view_custom_element')

        let styling_config = {
            column_structure : {},
            custom_elements: this.latest_styling_setting.custom_elements,
            last_updated_at_utc: Date.now()
        };


        styling_config.div_main_width = self.elements.divMain.outerWidth();

        formview_column_holder_elements.each(function () {
            let element = $(this);
            let column_id = element.attr('data-column_id');
            let custom_element_id = element.attr('data-custom_element_id');
            let pos_string  = element.parent().attr('data-position');

            let column_stack_style  = element.attr('data-column_stack_style') || 'vertical_stack_1';

            let obj = {
                column_id,
                custom_element_id,
                column_stack_style,
                context_item_id: custom_element_id || column_id,
                pos_string : pos_string,
                position: {
                    row_index : parseInt(pos_string.split(',')[0]),
                    column_index : parseInt(pos_string.split(',')[1])
                }
            }

            let min_height = element.css('minHeight');
            obj.size_info = {
                min_height: min_height ? parseInt(min_height) : undefined,
                width: element.outerWidth(),
                height: element.outerHeight()
            };

            styling_config.column_structure[custom_element_id || column_id] = obj;
        });
        styling_config.display_styling_mode = self.display_styling_mode;

        console.log('styling_config', styling_config);
        let setting_name = self.get_styling_setting_name();


        console.log('============ latest_styling_setting', this.latest_styling_setting);
        console.log('============ styling_config', styling_config);


        self.erp.saveRoleSetting(setting_name, styling_config, ()=>{
            console.log(setting_name, ' saved')
        });
    },

    restore_custom_elements_from_config: function (styling_config) {
        const self = this;
        // console.log('styling_config', styling_config);

        if(self[`is_custom_elements_restored__${self.mode}`]){
            return;
        }
        self[`is_custom_elements_restored__${self.mode}`] = true;

        for(const custom_element_key in styling_config.custom_elements){
            const custom_element_info = styling_config.custom_elements[custom_element_key];

            // console.log('restore_custom_elements_from_config', custom_element_key, custom_element_info)

            let column_style_info = styling_config.column_structure[custom_element_key]; // || styling_config.column_structure['undefined'];
            // if(!column_style_info){
            //     delete styling_config.custom_elements[custom_element_key];
            //     continue;
            // }
            const cell_element = self.container.find(`.table-main:visible .form_view_table_cell[data-position="${column_style_info.pos_string}"]`)

            // console.log('restore_custom_elements_from_config', column_style_info, cell_element)

            self.mount_custom_element(custom_element_info.id, custom_element_info.type, cell_element, custom_element_info.config);
        }

    },

    restore_styling_setting_from_config: function (styling_config) {
        const self = this;

        // formView.elements.tableMains[type] need to use this

        // console.log('restore_styling_setting_from_config', styling_config)

        if(styling_config.display_styling_mode){
            switch (styling_config.display_styling_mode){
                case 'full_size':
                    self.set_to_full_size_mode();
                    break;
                default:
                    self.set_to_custom_size_mode();
                    if(styling_config.div_main_width){
                        self.elements.divMain.width(styling_config.div_main_width);
                    }
                    break;
            }
        }

        if(!styling_config.last_updated_at_utc){
            self.elements.headerTextContainerElement.addClass('formview_not_configured');
        }
        else{
            self.elements.headerTextContainerElement.removeClass('formview_not_configured');
        }

        this.restore_custom_elements_from_config(styling_config);

        // console.log('formview_column_holder_elements', formview_column_holder_elements)
        // console.log('restore_styling_setting_from_config', styling_config)

        let formview_column_holder_elements = self.container.find('.table-main:visible').find('.formview-column-holder,.form_view_custom_element');

        formview_column_holder_elements.each(function () {
           const element = $(this);
            // let column_id = element.find('.editable').attr('data-column-id');
            let context_item_id = element.attr('data-column_id') || element.attr('data-custom_element_id');
            let column_style_info = styling_config.column_structure[context_item_id];


            // console.log('restore_styling_setting_from_config', element.get(0), column_id, column_style_info)
            if(column_style_info){

                element.appendTo(self.container.find(`.table-main:visible .form_view_table_cell[data-position="${column_style_info.pos_string}"]`));

                element.addClass(column_style_info.column_stack_style || 'vertical_stack_1');

                let size_info = column_style_info.size_info;
                let css_obj = {};
                if(size_info.width){
                    css_obj.width = size_info.width + 'px';
                }
                if(size_info.min_height){
                    css_obj.minHeight = size_info.min_height + 'px';
                }
                else if(size_info.height){
                    css_obj.height = size_info.height + 'px';
                }
                element.css(css_obj);
            }

        });

        self.container.find(`.table-main:visible .form_view_table_row`).each(function () {
            let row_element = $(this);
            if(row_element.find('.formview-column-holder,.form_view_custom_element').length){
                row_element.addClass('with_children_column')
            }
            else{
                row_element.addClass('without_children_column')
            }
        })



    },

    exit_styling_mode: function (shall_save) {
        const self = this;
        if(shall_save){
            this.save_latest_styling_configuration();
        }
        this.destroy_styling_mode();
        this.is_in_styling_mode = false;
    },

    add_new_empty_row_in_styling_mode: function(){

    },
    applyUserConfiguration: function(){
        var self = this;
        if(self.isConfigurationRestored[self.mode]){
        }
        self.isConfigurationRestored[self.mode] = true;
        var configuration = self.userConfiguration[self.mode];
        switch(self.erp.deviceType){
            case ERP.DEVICE_TYPES.PC:
                if(configuration.size){
                    self.elements.divMain.css(configuration.size);
//                    self.elements.tableMains[self.mode].css(width);
                }

                if(self.latest_styling_setting){
                    self.restore_styling_setting_from_config(self.latest_styling_setting);
                }
                break;
            default:
                break;
        }

        return self;
    },
}

FormView.prototype.socketEvents = {
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