/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function Column(config, parentObject) {
    var self = this;
    self.config = config;
    self.columnManager = parentObject;
    self.parentObject = parentObject;
    self.subModule = self.parentObject.subModule;
    self.formView = self.subModule.formView;
    self.module = self.parentObject.module;
    self.erp = self.subModule.erp;
    self.lookUpDataBackUp = [];
    self.initialize();
    return self;
}
//Only Basic Validations For Now
Column.COLUMN_TYPES = {};
Column.COLUMN_TYPES.SINGLELINE = 'singleLine';                      //Done
Column.COLUMN_TYPES.MULTILINE = 'multipleLine';                     //Done
Column.COLUMN_TYPES.INTEGER= 'integer';                             //Done
Column.COLUMN_TYPES.DECIMAL = 'decimal';                            //Done
Column.COLUMN_TYPES.CHOICE = 'choice';                              //Done
Column.COLUMN_TYPES.MULTIPLE_CHOICE = 'multipleChoice';             //Done
Column.COLUMN_TYPES.IMAGE = 'image';                                //Done
Column.COLUMN_TYPES.DOCUMENT = 'document';                          //Done
Column.COLUMN_TYPES.DATE = 'date';                                  //Done
Column.COLUMN_TYPES.TIME = 'time';                                  //Done
Column.COLUMN_TYPES.DATETIME = 'dateTime';                          //Done
Column.COLUMN_TYPES.IDENTITY = 'identity';                          //Done
Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST = 'lookUpDropDownList';     //Done
Column.COLUMN_TYPES.LOOKUP_LABEL = 'lookUpLabel';                   //Done
Column.COLUMN_TYPES.LOOKUP_SUBTOTAL = 'LookUp_Subtotal';            //----6
Column.COLUMN_TYPES.LOOKUP_TEXTBOX = 'lookUpTextBox';               //Done
Column.COLUMN_TYPES.HYPERLINK = 'hyperLink';
Column.COLUMN_TYPES.BLOG_VIEW = 'blogView';
Column.COLUMN_TYPES.CHECKBOX_BIT = 'checkboxBit';                   //Done
Column.COLUMN_TYPES.CHECKBOX_VALUE = 'checkboxValue';               //Done
Column.COLUMN_TYPES.FILE = 'file';
Column.COLUMN_TYPES.SYSTEMDATA = 'SystemData';                      //----5

Column.prototype = {
    constants: {
        toolTipContainer: {
            "class": "toolTipContainer"
        },
        imageDisplayContainer:{
            "class": "image-display-container"
        },
        imageContainer:{
            "class": "image-container"
        },
        displayImage:{
            "class": "display-image smallForm"
        },
        imageCloseButton:{
            "class": "image-close-button"
        },
        imageDownloadButton:{
            "class": "image-download-button button-primary"
        },
        filterableViewContainer: {
            "class": "filterableViewContainer"
        },
        showFilterableViewButton: {
            "class": "showFilterableViewButton",
            title: "Show Filters"
        },
        quickAddButton: {
            "class": "quickAddButton",
            title: "Add new item"
        },
        lookUpViewModeShortCut:{
            "class": "lookUpViewModeShortCut"
        },
        googleMapLink: {
            "class": "googleMapLink"
        }
    },
    versionChangeFixes: function() {
        var self = this;
        if (self.config.uniqueName == undefined) {
            self.config.uniqueName = self.config.id.toString();
        }

        if(self.config.allowHtmlEditor){
            self.config.allowHTMLEditor = true;
        }

        return self;
    },
    initialize: function () {
        var self = this;
        self.versionChangeFixes();
        for(var key in self.config){
            self[key] = self.config[key];
        }
        if(self.disableCondition && typeof self.disableCondition === 'object'){
//            console.log(self.id, self.disableCondition)
        }
        else{
            self.initializeDisableCondition();
        }
        if(!self.gridView){
            self.gridView = {};
        }
        if(self.grid){
            self.gridView = self.grid;
        }
        if(!self.validations){
            self.validations = {};
        }
        if(!self.formView){
            self.formView = self.config.formView = {create:{isHidden: true}}
//            console.log(self.config)
        }
        else{
//            console.log(self.config.formView.create, self.id);
        }
//        if(self.formView.create ){
//            if(!self.formView.create.position){
//                self.formView.create = self.config.formView.create = {isHidden: true}
//            }
//        }
        if(!self.formView[FormView.EDIT_MODE]){
            self.formView[FormView.EDIT_MODE] = self.formView[FormView.CREATE_MODE];
        }
        if(!self.formView[FormView.VIEW_MODE]){
            self.formView[FormView.VIEW_MODE] = self.formView[FormView.CREATE_MODE];
        }
        if(!self.simpleDataTableRow){
            self.simpleDataTableRow = JSON.parse(JSON.stringify(self.formView));
        }
        self.formViewElements = {};
        self.simpleDataTableRowElements = {};
        if(!self.typeSpecific){
            self.typeSpecific = {};
        }
        if(self.hasUniqueValueInSubForm){
            self.uniqueColumnValuesInSubForm = {};
        }
        self.typeSpecific.children = [];
        self.defaultValue = self.typeSpecific.defaultValue;
        self.isHtmlEditorInitialized = {};
        self.createElements();
        self.checkTypeSpecificValues();
        self.bindEvents();
        self.initializeCalculatedValue();
        self.initializeDisableFunctions();
        self.initializeCustomEvents();
        self.initializeSocketEventsObject();
        return self;
    },
    initializeCustomEvents: function () {
        var self = this;
        self.customEventsFunctions = {};
        if(self.events && self.events.onChangeOnCreate && self.events.onChangeOnCreate.isEnabled){
            var str = self.events.onChangeOnCreate.onChangeOnCreate.text;
            str = '\n'+
                '   try{\n' +
                '       '+str + ' \n    }\n'+
                '   catch(err){\n'+
                '       console.log(err, \'Error in onChangeFunction_create for '+ self.id+' \');\n'+
                '       asyncCallBack(err)'+
                '   }\n';
            self.customEventsFunctions.onChangeOnCreate = new Function(['formData', 'subModule', 'parentView', 'column', 'asyncCallBack'], str);
        }
        if(self.events && self.events.onChangeOnUpdate && self.events.onChangeOnUpdate.isEnabled){
            var str = self.events.onChangeOnUpdate.onChangeOnUpdate.text;
            str = '\n'+
                '   try{\n'+
                '       '+str + ' \n    }\n'+
                '   catch(err){\n'+
                '       console.log(err, \'Error in onChangeFunction_update for '+ self.id+' \');\n' +
                '       asyncCallBack(err)'+
                '   }\n';
            self.customEventsFunctions.onChangeOnUpdate = new Function(['formData', 'subModule', 'parentView', 'column', 'asyncCallBack'], str);
        }

        if(self.events && self.events.onSetDisplayValueInViewMode && self.events.onSetDisplayValueInViewMode.isEnabled){
            var str = self.events.onSetDisplayValueInViewMode.onSetDisplayValueInViewMode.text;
            str = '\n'+
                '   try{\n'+
                '       '+str + ' \n    }\n'+
                '   catch(err){\n'+
                '       console.log(err, \'Error in onSetDisplayValueInViewMode for '+ self.id+' \');\n' +
                '       asyncCallBack(err)'+
                '   }\n';
            self.customEventsFunctions.onSetDisplayValueInViewMode = new Function(['dataRow', 'value', 'subModule', 'column', 'element', 'mode', 'asyncCallBack'], str);
        }


        return self;
    },
    initializeCalculatedValue: function () {
        var self = this;
        self.calculatedValueFunctions = {};
        if(self.calculatedValue && self.calculatedValue.evaluateFunctionOnCreate && self.calculatedValue.evaluateFunctionOnCreate.isEnabled){
            var str = self.calculatedValue.evaluateFunctionOnCreate.evaluateFunctionOnCreate.text;
            str = '   var returnValue;\n'+
                '   try{\n'+
                '       '+str + ' \n    }\n'+
                '   catch(err){\n'+
                '       console.log(\'Error in evaluateFunction_create for '+ self.id+' \');\n'+
                '   }\n'+
                '   evaluateFunctionCallBack(returnValue)';
            self.calculatedValueFunctions.create = new Function(['formData', 'evaluateFunctionCallBack'], str);
        }
        if(self.calculatedValue && self.calculatedValue.evaluateFunctionOnUpdate && self.calculatedValue.evaluateFunctionOnUpdate.isEnabled){
            var str = self.calculatedValue.evaluateFunctionOnUpdate.evaluateFunctionOnUpdate.text;
            str = '   var returnValue;\n'+
                '   try{\n'+
                '       '+str + ' \n    }\n'+
                '   catch(err){\n'+
                '       console.log(\'Error in evaluateFunction_update for '+ self.id+' \');\n'+
                '   }\n'+
                '   evaluateFunctionCallBack(returnValue)';
            self.calculatedValueFunctions.update = new Function(['formData', 'serverData', 'evaluateFunctionCallBack'], str);
        }
        return self;
    },
    initializeDisableFunctions: function () {
        var self = this;
        self.disableFunctions = {};
        self.valueWhenDisabledCreateMode = '';
        self.valueWhenDisabledEditMode = '';
        if(self.disableFunction && self.disableFunction.defaultValue){
            self.valueWhenDisabledCreateMode = self.disableFunction.defaultValue;
            self.valueWhenDisabledEditMode = self.disableFunction.defaultValue;
        }
        if(self.disableFunction && self.disableFunction.disableFunctionOnUpdate && self.disableFunction.disableFunctionOnCreate.isEnabled){
            var str = self.disableFunction.disableFunctionOnCreate.disableFunctionOnCreate.text;
            str = '   var returnValue;\n'+
                '   try{\n'+
                '       '+str + ' \n    }\n'+
                '   catch(err){\n'+
                '       console.log(\'Error in evaluateFunction_create for '+ self.id+' \');\n'+
                '   }\n'+
                '   disableFunctionCallBack(returnValue)';
            self.disableFunctions.create = new Function(['formData', 'disableFunctionCallBack'], str);
        }
        if(self.disableFunction && self.disableFunction.disableFunctionOnUpdate && self.disableFunction.disableFunctionOnUpdate.isEnabled){
            var str = self.disableFunction.disableFunctionOnUpdate.disableFunctionOnUpdate.text;
            str = '   var returnValue;\n'+
                '   try{\n'+
                '       '+str + ' \n    }\n'+
                '   catch(err){\n'+
                '       console.log(\'Error in disableFunction_update for '+ self.id+' \');\n'+
                '   }\n'+
                '   disableFunctionCallBack(returnValue)';
            self.disableFunctions.update = new Function(['formData', 'serverData', 'disableFunctionCallBack'], str);
        }
        return self;
    },
    initializeLookUp: function () {
        var self = this;
        var ret = true;
        var parentColumns;
        if(self.typeSpecific.customDataSource && self.typeSpecific.customDataSource.isEnabled && self.typeSpecific.customDataSource.parentColumns){
            parentColumns = self.typeSpecific.customDataSource.parentColumns;
            ret = false;
        }
        else if(self.typeSpecific.dataSource.hasParentColumn){
            ret = false;
            parentColumns = self.typeSpecific.dataSource.parentColumns;
        }
        if(ret){
            return self;
        }
//        parentColumns.forEach(function(parentColumnId){
//            var parentColumn = self.columnManager.columns[parentColumnId];
//            parentColumn.addChildColumn(self.id);
//        });
        //Need to check here

        return self;
    },
    initializeSocketEventsObject: function(){
        var self = this;
        self.socketEvents = $.extend({}, self.socketEvents);
        for(var key in self.socketEvents){
            self.socketEvents[key] += '_'+ self.subModule.id;
            if(self.subModule.randomId){
                self.subModule.socketEvents[key] += '_'+  self.randomId;
            }
        }

        return self;
    },
    getSocket: function(){
        var self = this;
        return self.erp.socket;
    },
    addChildColumn: function(columnId){
        var self = this;
        if(!self.childColumns){
            self.childColumns = [];
        }
        self.childColumns.push(columnId);
        self.typeSpecific.childColumns = self.childColumns;
        return self;
    },
    initializeDisableCondition: function () {
        var self = this;
        var disableCondition = {};
        if(!self.databaseName){
            self.disableCondition = 'disabled';
        }
        disableCondition[self.disableCondition] = true;
        self.disableCondition = self.config.disableCondition = disableCondition;
        return self;
    },
    checkTypeSpecificValues: function(){
        var self = this;
        switch (self.type){
            case Column.COLUMN_TYPES.IDENTITY:
                self.disableCondition = {
                    disabled: true
                }
                break;
            case Column.COLUMN_TYPES.HYPERLINK:
                self.disableSort = self.config.disableSort = true;
                break;
            case Column.COLUMN_TYPES.BLOG_VIEW:
                self.disableSort = self.config.disableSort = true;
                break;
            case Column.COLUMN_TYPES.LOOKUP_LABEL:
                self.disableSort = self.config.disableSort = true;
                break;
            case Column.COLUMN_TYPES.TIME:
                if(!self.typeSpecific.displayFormat){
                    self.typeSpecific.displayFormat = self.typeSpecific.timeFormat;
                }
                break;
            case Column.COLUMN_TYPES.DATE:
                if(!self.typeSpecific.displayFormat){
                    self.typeSpecific.displayFormat = self.typeSpecific.dateFormat;
                }
                break;
            case Column.COLUMN_TYPES.DATETIME:
                if(!self.typeSpecific.displayFormat){
                    self.typeSpecific.displayFormat = self.typeSpecific.dateTimeFormat;
                }
                self.typeSpecific.hasDatePicker = self.typeSpecific.dateTimeFormat.indexOf('MMM') != -1;
                self.typeSpecific.hasTimePicker = self.typeSpecific.dateTimeFormat.indexOf('mmss') != -1;
                if(!self.typeSpecific.hasTimePicker){
                    self.typeSpecific.hasTimePicker = self.typeSpecific.dateTimeFormat.indexOf('a') != -1;
                }
                var momentEditFormat = '';
                var jqueryEditDateFormat = '';
                var jqueryEditTimeFormat = '';
                if(self.typeSpecific.hasDatePicker){
                    momentEditFormat += 'DD/MM/YYYY';
                    jqueryEditDateFormat += 'dd/mm/yy';
                }
                if(self.typeSpecific.hasTimePicker){
                    if(self.typeSpecific.hasDatePicker){
                        momentEditFormat += ' ';
                    }
                    momentEditFormat += 'hh:mm:ss';
                    jqueryEditTimeFormat += 'HH:mm';
                }
                self.typeSpecific.momentEditFormat = momentEditFormat;
                self.typeSpecific.jqueryEditDateFormat = jqueryEditDateFormat;
                self.typeSpecific.jqueryEditTimeFormat = jqueryEditTimeFormat;
                break;
            case Column.COLUMN_TYPES.CHOICE:
//                if(!self.typeSpecific.datalist){
//                    self.typeSpecific.datalist = []
//                }
//                else{
//                    self.typeSpecific.datalist = JSON.parse(self.typeSpecific.datalist)
//                }
                break;
        }
        return self;
    },
    bindEvents: function () {
        var self = this;

        return self;
    },
    createElements: function () {
        var self = this;
        self.elements = {
            editInDisplay: {}
        };
//        self._creation.createElements(self);
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
    getElement: function(){
        var self = this;
        return self.element;
    },
    focusFormViewElement: function(mode){
        var self = this;
        if(self.hasChosen[mode]){
            self.getFormViewElement(mode).data().chosen.activate_field();
        }
        else{
            self.getFormViewElement(mode).focus();
        }
        return self;
    },
    fadeInFormViewElement: function(mode){
        var self = this;
        setTimeout(function(){
            self.getFormViewElement(mode)
                .closest('.formview-column-holder')
                .removeClass('formViewColumnFadeOut');
        }, 100)
        return self;
    },
    fadeOutFormViewElement: function(mode){
        var self = this;
        self.getFormViewElement(mode).closest('.formview-column-holder').addClass('formViewColumnFadeOut');
        return self;
    },
    fadeOutChildColumnsInFormView: function(mode){
        var self = this;
        self.childColumns.forEach(function(childColumnId){
            var childColumn = self.parentObject.columns[childColumnId];
            childColumn.fadeOutFormViewElement(mode);
        });
        return self;
    },
    fadeInChildColumnsInFormView: function(mode){
        var self = this;
        self.childColumns.forEach(function(childColumnId){
            var childColumn = self.parentObject.columns[childColumnId];
            childColumn.fadeInFormViewElement(mode);
        });
        return self;
    },
    showImage: function(images,photoName){
        var self = this;
        var tmpImg = new Image();
        tmpImg.src=images; //or  document.images[i].src;
        var imageDisplayContainer = $(document.createElement('div')).attr(self.constants.imageDisplayContainer).appendTo('#documentWrapper');
        var imageContainer = $(document.createElement('div')).attr(self.constants.imageContainer).appendTo(imageDisplayContainer);
        var downloadButton = $(document.createElement('a')).text('Download').attr(self.constants.imageDownloadButton).appendTo(imageContainer);
        downloadButton.attr({'href':images, 'download':photoName});
        var imagediv = $(document.createElement('div')).appendTo(imageContainer);
        var image = $(document.createElement('img')).attr(self.constants.displayImage).appendTo(imagediv);
        image.attr('src',images);
        imageDisplayContainer.on('click',function(eve){
            if(eve.target && eve.target.tagName ==  'DIV'){
                imageDisplayContainer.remove();
            }
        });
        setTimeout(function(){
            image.removeClass('smallForm');
        }, 10);
        return self;
    },
    _validation: {
        validateFormViewElement: function(column, formView){
            var ret = null;
//            console.log(column)
            if(column.disableCondition.disabled){
                return ret;
            }
            else if(formView.mode === FormView.EDIT_MODE && column.disableCondition.disableOnceCreated){
                return ret;
            }
            var errorMessage= '';
            var element = column.getFormViewElement(formView.mode);
            var value = column.getFormViewElementValue(formView);
            if(column.readonly){
                element.prop('readonly', false);
            }
            if(element.get(0).checkValidity && element.get(0).checkValidity()){
                if(!ret){

                }
            }
            else{
                if(element.get(0).validity){
                    if(element.get(0).validity.patternMismatch){
                        switch(column.type){
                            case Column.COLUMN_TYPES.SINGLELINE:
                            case Column.COLUMN_TYPES.MULTILINE:
                                var titleStr = '';
                                var typeSpecific = column.typeSpecific;
                                var titleBetween = 'Please enter '+typeSpecific.minLength+' to '+typeSpecific.maxLength+' characters';
                                var titleMinOnly = 'Please enter at least '+typeSpecific.minLength+' characters';
                                var titleMaxOnly = 'Maximum '+typeSpecific.maxLength+' characters in only allowed';
                                var titleSpecific = 'Please Enter '+ typeSpecific.minLength + ' characters';
                                if(typeSpecific.maxLength || typeSpecific.minLength){
                                    if(typeSpecific.minLength){
                                        titleStr = titleMinOnly;
                                    }
                                    if(typeSpecific.maxLength){
                                        if(!titleStr){
                                            titleStr = titleMaxOnly;
                                        }
                                        else{
                                            if(typeSpecific.maxLength === typeSpecific.minLength){
                                                titleStr = titleSpecific
                                            }
                                            else{
                                                titleStr = titleBetween;
                                            }
                                        }
                                    }
                                }
                                errorMessage =titleStr;
                                break;
                            case Column.COLUMN_TYPES.DECIMAL:
                            case Column.COLUMN_TYPES.INTEGER:
                                var range = column.typeSpecific.range || {};
                                value = parseFloat(value);
                                var errorMessage='';
                                if(!isNaN(value)){
                                    if(range && value!== ''){
                                        if(range.rangeStart && value < range.rangeStart){
                                            errorMessage = 'Value should be more than '+ range.rangeStart;
                                        }
                                        if(range.rangeEnd && value > range.rangeEnd){
                                            if(errorMessage.length){
                                                errorMessage = ' and less than '+ range.rangeEnd;
                                            }
                                            else{
                                                errorMessage = 'Value should be less than '+ range.rangeEnd;
                                            }
                                        }
                                    }
                                }
                                if(!errorMessage){
                                    if(column.type === Column.COLUMN_TYPES.INTEGER){
                                        if(value && !value && value !==0){
                                            errorMessage = 'Please enter a Integer number';
                                        }
                                    }
                                    else if(column.type === Column.COLUMN_TYPES.DECIMAL){
                                        if(value && !value){
                                            errorMessage = 'Please enter a Decimal number';
                                        }
                                    }
                                }

                                break;
                        }
                    }
                    else if(element.get(0).validity.typeMismatch){
                        errorMessage = element.get(0).validationMessage;
                    }
                    else if(element.get(0).validity.valueMissing){
                        errorMessage = 'This field is Mandatory';
                    }
                    else if(element.get(0).validity.rangeUnderflow){
                        errorMessage = element.get(0).validationMessage;
                    }
                    else if(element.get(0).validity.rangeOverflow){
                        errorMessage = element.get(0).validationMessage;
                    }
                }
                else{
                    if(column.validations.mandatory && column.type === Column.COLUMN_TYPES.IMAGE){
                        if(column.hasImage[formView.mode].imgElement.attr('title') == ''){
                            errorMessage = 'This field is Mandatory';
                        }
                    }
                    else if(column.validations.mandatory && column.type === Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST && column.typeSpecific.appearAsRadioButtonGroup){
                        if(value === undefined || value === ''){
                            errorMessage = 'Please select an option';
                        }
                    }
                }
            }

            if(errorMessage.length){
                ret = new ValidationError({
                    column: column,
                    message: errorMessage,
                    tabId: column.formView[formView.mode].tabId,
                    simpleDataTable: formView,
                    mode: 'formView'
                });
            }
            if(column.readonly){
                element.prop('readonly', true);
            }
            return ret;
        },
        validateSimpleDataTableRowElement: function(column, simpleDataTableRow){
            var ret = null;
            if(column.disableCondition.disabled){
                return ret;
            }
            else if(simpleDataTableRow.mode === FormView.EDIT_MODE && column.disableCondition.disableOnceCreated){
                return ret;
            }
            var errorMessage= '';
            var element = column.getSimpleDataTableRowElement(simpleDataTableRow);
            var value = column.getSimpleDataTableRowElementValue(simpleDataTableRow);
            if(column.readOnly){
                element.prop('readonly', false);
            }
            if(element.get(0).checkValidity && element.get(0).checkValidity()){
                if(!ret){
                }
            }
            else{
                if(element.get(0).validity){
                    if(element.get(0).validity.patternMismatch){
                        switch(column.type){
                            case Column.COLUMN_TYPES.SINGLELINE:
                            case Column.COLUMN_TYPES.MULTILINE:
                                var titleStr = '';
                                var typeSpecific = column.typeSpecific;
                                var titleBetween = 'Please enter '+typeSpecific.minLength+' to '+typeSpecific.maxLength+' characters';
                                var titleMinOnly = 'Please enter at least '+typeSpecific.minLength+' characters';
                                var titleMaxOnly = 'Maximum '+typeSpecific.maxLength+' characters in only allowed';
                                var titleSpecific = 'Please Enter '+ typeSpecific.minLength + ' characters';
                                if(typeSpecific.maxLength || typeSpecific.minLength){
                                    if(typeSpecific.minLength){
                                        titleStr = titleMinOnly;
                                    }
                                    if(typeSpecific.maxLength){
                                        if(!titleStr){
                                            titleStr = titleMaxOnly;
                                        }
                                        else{
                                            if(typeSpecific.maxLength === typeSpecific.minLength){
                                                titleStr = titleSpecific
                                            }
                                            else{
                                                titleStr = titleBetween;
                                            }
                                        }
                                    }
                                }
                                errorMessage =titleStr;
                                break;
                            case Column.COLUMN_TYPES.DECIMAL:
                            case Column.COLUMN_TYPES.INTEGER:
                                var range = column.typeSpecific.range || {};
                                value = parseFloat(value);
                                var errorMessage='';
                                if(!isNaN(value)){
                                    if(range && value!== ''){
                                        if(range.rangeStart && value < range.rangeStart){
                                            errorMessage = 'Value should be more than '+ range.rangeStart;
                                        }
                                        if(range.rangeEnd && value > range.rangeEnd){
                                            if(errorMessage.length){
                                                errorMessage = ' and less than '+ range.rangeEnd;
                                            }
                                            else{
                                                errorMessage = 'Value should be less than '+ range.rangeEnd;
                                            }
                                        }
                                    }
                                }
                                if(!errorMessage){
                                    if(column.type === Column.COLUMN_TYPES.INTEGER){
                                        if(value && !value && value !==0){
                                            errorMessage = 'Please enter a Integer number';
                                        }
                                    }
                                    else if(column.type === Column.COLUMN_TYPES.DECIMAL){
                                        if(value && !value){
                                            errorMessage = 'Please enter a Decimal number';
                                        }
                                    }
                                }

                                break;
                        }
                    }
                    else if(element.get(0).validity.typeMismatch){
                        errorMessage = element.get(0).validationMessage;
                    }
                    else if(element.get(0).validity.valueMissing){
                        errorMessage = 'This field is Mandatory';
                    }
                    else if(element.get(0).validity.rangeUnderflow){
                        errorMessage = element.get(0).validationMessage;
                    }
                    else if(element.get(0).validity.rangeOverflow){
                        errorMessage = element.get(0).validationMessage;
                    }
                }
                else{
                    if(column.validations.mandatory && column.type === Column.COLUMN_TYPES.IMAGE){
                        if(column.hasImage[formView.mode].imgElement.attr('title') == ''){
                            errorMessage = 'This field is Mandatory';
                        }
                    }
                    else if(column.validations.mandatory && column.type === Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST && column.typeSpecific.appearAsRadioButtonGroup){
                        if(value === undefined || value === ''){
                            errorMessage = 'Please select an option';
                        }
                    }
                }
            }

            if(errorMessage.length){
                ret = new SimpleDataTableRowValidationError({
                    column: column,
                    message: errorMessage,
                    simpleDataTable: simpleDataTableRow,
                    mode: 'simpleDataTable'
                }, simpleDataTableRow);
            }
            if(column.readOnly){
                element.prop('readonly', true);
            }
            return ret;
        }
    },
    parseDisplayValue: function(dataRow){
        var self = this;
        var value;
        value = self._parse.parseDisplayValue(self, dataRow);
        if(value === undefined || value === null){
            value = '';
        }
        if(value && typeof value === 'string'){
            if(!self.typeSpecific.isJson){
                value = value.replace(/\n/g, '<br />');
            }
        }
        switch(self.type){
            case Column.COLUMN_TYPES.DATETIME:
            case Column.COLUMN_TYPES.DATE:
                if(value){
                    value = moment(value).format(self.typeSpecific.displayFormat)
                }
                break;
            case Column.COLUMN_TYPES.TIME:
                if(value){
                    value = moment(value).format(self.typeSpecific.displayFormat)
                }
                break;
            case Column.COLUMN_TYPES.INTEGER:
                if(value != undefined){
                    value = parseInt(value);
                }
                break;
            case Column.COLUMN_TYPES.DECIMAL:
                if(value != undefined){
                    value = parseFloat(value);
                }
                if(value != undefined && self.typeSpecific.decimalPoint && self.typeSpecific.decimalPoint.isEnabled){
                    value = value.toFixed(self.typeSpecific.decimalPoint.decimalPoint);
                }
                break;
            case Column.COLUMN_TYPES.BLOG_VIEW:
                if(value){
                    value = self.typeSpecific.hasDetailText + '('+value+')';
                }
                else{
                    value = self.typeSpecific.noDetailText;
                }
                break;
            case Column.COLUMN_TYPES.HYPERLINK:
                if(value){
                    value = self.typeSpecific.hasDetailText + '('+value+')';
                }
                else{
                    value = self.typeSpecific.noDetailText;
                }
                break;
            case Column.COLUMN_TYPES.CHOICE:
                if(value != undefined){
                    var filterdArr = self.typeSpecific.datalist.filter(function(item){
                        return (item.value == value)
                    });
                    if(filterdArr.length){
                        value = filterdArr[0].text;
                    }
                    else{
                        if(!self.typeSpecific.displayValuesNotInDataList){
                            value = '';
                        }
                    }
                }
                break;
            default:
//                value = dataRow[self.id];
                break;
        }
        return value;
    },
    parseEditValue: function(dataRow){
        var self = this;
        var value;
        switch(self.type){
            default:
                value = dataRow[self.id];
                break;
        }
        if(value != null){
            return self._parse.parseEditValue(self, value);
        }
        else{
            return null;
        }
    },
    _parse: {
        parseDisplayValue: function(column, dataRow){
            var value = dataRow[column.id];
            if(typeof(value) ==='object'){
                if(value.text === undefined){
                    return value.value;
                }
                else{
                    return value.text;
                }
            }
            else if(value === undefined){
                return '';
            }
            else{
                return value;
            }
        },
        parseEditValue: function(column, value){
            var realValue;
            if(typeof(value) ==='object'){
                realValue = value.value;
            }
            else if(value === undefined){
                realValue = '';
            }
            else{
                realValue = value;
            }
            //return realValue;
            //Need to debug here, not sure what it is used for
            switch(column.type){
                case Column.COLUMN_TYPES.DATETIME:
                    if (column.typeSpecific.hasTimePicker && column.typeSpecific.hasDatePicker){
                        realValue = moment(new Date(realValue)).format('YYYY-MM-DDThh:mm');
                    }
                    else if(column.typeSpecific.hasDatePicker ){
                        realValue = moment(new Date(realValue)).format('YYYY-MM-DD');
                    }
                    else{
                        realValue = moment(new Date(realValue)).format('hh:mm');
                    }

                    //realValue = moment(realValue).format(column.typeSpecific.momentEditFormat.toUpperCase());
                    break;
                case Column.COLUMN_TYPES.CHECKBOX_BIT:
                    if(typeof realValue == 'string'){
                        realValue = parseInt(realValue);
                    }
                    realValue = realValue? true: false;
//                    realValue = checked;
                    break;
                case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                    var checked = realValue == column.typeSpecific.checkedValue;
                    realValue = checked;
                    break;
                case Column.COLUMN_TYPES.CHOICE:
//                    if(realValue){
//                        var filterdArr = column.typeSpecific.datalist.filter(function(item){
//                            return (item.value == realValue)
//                        });
//                        if(filterdArr.length){
//                            realValue = filterdArr[0].text;
//                        }
//                        else{
//                            realValue = '';
//                        }
//                        console.log(realValue)
//                    }
                    break;
                case Column.COLUMN_TYPES.IDENTITY:
//                    console.log(realValue)
                    break;
                case Column.COLUMN_TYPES.DECIMAL:
                    realValue = parseFloat(realValue);
                    break;
                default:
                    break;
            }
            return realValue;
        },
        parseGetFromParentConditionItemValue: function(parentCondition, parentSubModule, parentDataRow){
            var obj = null;
            if(parentSubModule.module.id === parentCondition.moduleId && parentSubModule.id === parentCondition.subModuleId){
                var parentValue = parentDataRow[parentCondition.columnId];
                if(parentValue && typeof parentValue === 'object'){
                    parentValue = parentValue.value;
                }
                obj = parentValue;
            }
            return obj;
        }
    },
    _format: {
        formatDisplayValue: function(column, value){
            if(typeof(value) ==='object'){
                return value.text;
            }
            else if(value === undefined){
                return '';
            }
            else{
                return value;
            }
        },
        formatEditValue: function(column, value){
            if(typeof(value) ==='object'){
                return value.text;
            }
            else if(value === undefined){
                return '';
            }
            else{
                return value;
            }
        }
    },

    getFormViewPosition: function(type){
        var self = this;
        return self.formView[type];
    },
    getFormViewElement: function(type){
        var self = this;
        if(self.formViewElements[type])
            return self.formViewElements[type];
        else{
            self.formViewElements[type] = self._creation.createFormViewElement(self, type);
            setTimeout(function(){
                self.bindFormViewElementEvents(type);
            }, 0);
            return self.formViewElements[type];
        }
    },
    bindFormViewElementEvents: function(formViewMode){
        var self = this;
        var element = self.formViewElements[formViewMode];
        var formView = self.columnManager.subModule.formView;
        if(self.validations.unique){
            element.on('change.'+formViewMode, function(){
                formView.validateUnique(self, element);
            });
        }

        element.on('change.'+formViewMode+'_auto', function(){
            formView.handle_normal_column_value_changed(self, element);
        });

        switch (formViewMode){
            case FormView.CREATE_MODE:
                if(self.validations.customSql_Create && self.validations.customSql_Create.isEnabled){
                    element.on('change.'+formViewMode, function(){
                        formView.validateCustomSql(self, element);
                    });
                }
                if(self.events && self.events.onChangeOnCreate && self.events.onChangeOnCreate.isEnabled){
                    element.on('change.'+formViewMode, function(){
                        formView.executeCustomOnChangeEventFunction(self, element, self.customEventsFunctions.onChangeOnCreate);
                    });
                }
                break;
            case FormView.EDIT_MODE:
                if(self.validations.customSql_Update && self.validations.customSql_Update.isEnabled){
                    element.on('change.'+formViewMode, function(){
                        formView.validateCustomSql(self, element);
                    });
                }
                if(self.events && self.events.onChangeOnUpdate && self.events.onChangeOnUpdate.isEnabled){
                    element.on('change.'+formViewMode, function(){
                        formView.executeCustomOnChangeEventFunction(self, element, self.customEventsFunctions.onChangeOnUpdate);
                    });
                }
        }
        return self;
    },
    getFormViewElementTextValue:function(formView){
        var self = this;
        var value;
        var element;
        element = self.getFormViewElement(formView.mode);
        switch (self.type){
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                value = element.prop('checked');
                break
            case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                value = element.prop('checked')? self.typeSpecific.checkedValue: self.typeSpecific.uncheckedValue;
                break
            case Column.COLUMN_TYPES.DATETIME:
                value = element.val();
                if(value.length){
//                    console.log(value)
                    //value = moment(value, self.typeSpecific.momentEditFormat).toJSON();
                }
                break
            case Column.COLUMN_TYPES.IMAGE:
                value = self.hasImage[formView.mode].imgElement.attr('title');
                break;
            case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
            case Column.COLUMN_TYPES.CHOICE:
                if(self.typeSpecific.appearAsRadioButtonGroup){
                    value = element.find(':checked').attr('data-display-text');
                }
                else{
                    value = element.find(':selected').text();
                }
                break;
            default :
                if(element){
                    value = element.val();
                }
                break;
        }
        return value;
    },
    getFormViewElementValue: function(formView){
        var self = this;
        var value;
        var element;
        element = self.getFormViewElement(formView.mode);
        switch (self.type){
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                value = element.prop('checked');
                break
            case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                value = element.prop('checked')? self.typeSpecific.checkedValue: self.typeSpecific.uncheckedValue;
                break
            case Column.COLUMN_TYPES.DATETIME:
                value = element.val();
                console.error('datetime not implemented yet');
                if(value.length){
//                    console.log(value)
                    //value = moment(value, self.typeSpecific.momentEditFormat).toJSON();
                }
                break;
            case Column.COLUMN_TYPES.IMAGE:
                value = self.hasImage[formView.mode].imgElement.attr('title');
                break;
            case Column.COLUMN_TYPES.DOCUMENT:
                value = self.hasDocument[formView.mode].documentElement.attr('title');
                break;
            case Column.COLUMN_TYPES.DECIMAL:
                value = parseFloat(element.val());
                break;
            case Column.COLUMN_TYPES.INTEGER:
                value = parseInt(element.val());
                break;
            case Column.COLUMN_TYPES.MULTIPLE_CHOICE:
                value = {};
                var selectedValues = element.val() || [];
                selectedValues.forEach(function (selectedValue) {
                    if(selectedValue.length){
                        value[selectedValue] = true;
                    }
                });
                break;
            case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                value = element.val();
                if(self.typeSpecific.setNumeric){
                    value = parseFloat(element.val());
                }
                break;
            case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
                if(self.selectionMode == 'multiple'){
                    var selectedValues = element.val() || [];
                    value = [];
                    selectedValues.forEach(function (selectedValue) {
                        if(!selectedValue){
                            return;
                        }
                        value.push({
                            text : element.children('[value="'+selectedValue+'"]').text(),
                            value : parseInt( selectedValue )
                        });
                    });
                }
                else{
                    if(self.typeSpecific.appearAsRadioButtonGroup){
                        value = element.find(':checked').val();
                    }
                    else{
                        value = element.val();
                    }
                }
                break;
            case Column.COLUMN_TYPES.DATE:
                value = element.val();
                if(self.typeSpecific.hideDatePart && value){
                    value = value + '-01';
                }
                break;
            case Column.COLUMN_TYPES.MULTILINE:
                if(self.allowHTMLEditor && self.isHtmlEditorInitialized[formView.mode]){
                    if(tinymce.editors[element.attr('id')].initialized){
                        value = tinymce.editors[element.attr('id')].getContent();
                    }
                    else{
                        value = element.val();
                    }
                }
                else{
                    value = element.val();
                }
                break;
            default :
                if(element){
                    value = element.val();
                }
                break;
        }

        return value;
    },

    addPrefixAndPostfix: function(value){
        var self = this;
        switch(self.type){
            case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
            case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
            case Column.COLUMN_TYPES.LOOKUP_LABEL:
            case Column.COLUMN_TYPES.DATE:
            case Column.COLUMN_TYPES.DATETIME:
            case Column.COLUMN_TYPES.TIME:
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
            case Column.COLUMN_TYPES.CHECKBOX_VALUE:
            case Column.COLUMN_TYPES.BLOG_VIEW:
            case Column.COLUMN_TYPES.HYPERLINK:
                break;
            default :

                if(value){
                    value = value.toString();
                    if(!value.startsWith(self.prefix)){
                        value = self.prefix + value
                    }
                    if(!value.endsWith(self.postfix)){
                        value = value + self.postfix;
                    }
                }
        }
        return value;
    },
    validateFormViewElement: function(formView){
        var self = this;
        return self._validation.validateFormViewElement(self, formView);
    },
    bindFormViewElementCalculatedValueEvents: function(formView, mode, childColumn){
        var self = this;
        var element = self.getFormViewElement(mode);
        if(self.type == Column.COLUMN_TYPES.HYPERLINK){
            setTimeout(function(){
                self.simpleDataTables[mode] && self.simpleDataTables[mode].addOnChangeHandler(mode, function(simpleDataTable, options){
                    formView.calculatedValueParentChanged(self, options);
                }, childColumn);
            }, 100);
        }
        else{
            element.on('change.calculatedvalue', function(eve, options){
                if(!options){
                    options = {};
                }
                options.childColumn = childColumn;
                options.mode = mode;
                formView.calculatedValueParentChanged(self, options);
            });
            element.on('keyup.calculatedvalue', function(){
                //need to prevent trigger if tab/enter/esc
                var options = {};
                options.childColumn = childColumn;
                options.mode = mode;
                formView.calculatedValueParentChanged(self, options);
            });
        }
    },
    bindFormViewElementDisableFunctions: function(formView, mode, childColumn){
        var self = this;
        var element = self.getFormViewElement(mode);
        if(self.type == Column.COLUMN_TYPES.HYPERLINK){
            setTimeout(function(){
                self.simpleDataTables[mode] && self.simpleDataTables[mode].addOnChangeHandler(mode, function(simpleDataTable, options){
                    formView.disableFunctionParentChanged(self, options);
                }, childColumn);
            }, 100);
        }
        else{
            element.on('change.disableFunction', function(eve, options){
                if(!options){
                    options = {};
                }

                options.childColumn = childColumn;
                options.mode = mode;
                formView.disableFunctionParentChanged(self, options);
            });
            element.on('keyup.disableFunction', function(){
                //need to prevent trigger if tab/enter/esc
                var options = {};
                options.childColumn = childColumn;
                options.mode = mode;
                formView.disableFunctionParentChanged(self, options);
            });
        }
    },
    triggerFormViewElementDisableFunctionChangeEvent: function(mode, childColumn){
        var self = this;
        var element = self.getFormViewElement(mode);
        element.trigger('change.disableFunction');
        return self;
    },
    bindAutoPostBackEvents: function(formView, mode){
        var self = this;
        var element = self.getFormViewElement(mode);
        element.on('change.autopostback', function(eve, options){
            if(!options){
                options = {};
            }
            options.mode = mode;
            formView.lookUpParentChanged(self, options);
        });
    },
    hide_form_view_element_due_to_parent_button: function(formViewMode){
        var self = this;
        const form_view_column_holder_element = self.getFormViewElement(formViewMode).closest('.formview-column-holder').addClass('hidden_due_to_parent_button');
        const parent = form_view_column_holder_element.parent();
        form_view_column_holder_element.detach();
        return {parent_element: parent, form_view_column_holder_element, column: this};
    },
    reset_form_view_element_hidden_status_due_to_parent_button: function(hidden_info){
        var self = this;
        hidden_info.form_view_column_holder_element.removeClass('hidden_due_to_parent_button').appendTo(hidden_info.parent_element);
        return self;
    },
    enableFormViewElement: function(formViewMode){
        var self = this;
        self.getFormViewElement(formViewMode).prop('disabled', false);
        return self;
    },
    disableFormViewElement: function(formViewMode){
        var self = this;
        self.getFormViewElement(formViewMode).prop('disabled', true);
        return self;
    },
    isDisabledInFormView: function(formViewMode){
        var self = this;
        var ret = false;
        if(self.disableCondition.disabled){
            ret = true;
        }
        else if(self.disableCondition.disableOnceCreated && formViewMode == FormView.EDIT_MODE){
            ret = true
        }
        return ret;
    },
    triggerFormViewElementChange: function(mode, options){
        var self = this;
        self.getFormViewElement(mode).trigger('change', [options]);
        return self;
    },
    setFormViewLookupData: function(data, mode, options){
        var self = this;
        var element = self.getFormViewElement(mode);
        options = options || {};
//        console.log(self.id, data, mode);
        switch (self.type){
            case Column.COLUMN_TYPES.LOOKUP_LABEL:
                if(data){
                    if(!Array.isArray(data)){
                        if(data[self.id]){
                            data = data[self.id];
                        }
                    }
                }

                self.setFormViewEditValue(null, mode, data, options);
                break;
            case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                if(options && options.options && options.options.fromCode){
                    return self;
                }
                options.triggerChange = true;
                self.setFormViewEditValue(null, mode, data, options);
                break;
            default:
                var currentValue = element.val();
                // console.log('data : ' , data);
                if(self.typeSpecific.enableFilterableView){
                    self.lookUpDataBackUp = data[0] || [];
                    var filterConfigurationArr = data[1]  || [];
                    self.lookUpDataBackUp_filterConfiguration = {};
                    filterConfigurationArr.forEach(function (filterRow) {
                        self.lookUpDataBackUp_filterConfiguration[filterRow.id] = filterRow;
                    });
                    data = self.lookUpDataBackUp;
                }
                else{
                    self.lookUpDataBackUp = data;
                }

                if(self.typeSpecific.appearAsRadioButtonGroup){
                    self._creation.setRadioOptions(true, element, data);
                }
                else{
                    self._creation.setSelectOptions(true, element, data);

                    var realValue = element.data('value');
                    if(realValue){
                        element.removeData('value');
                        element.val(realValue);
                    }
                    else if(currentValue){
                        element.val(currentValue);
                    }

                    if(self.typeSpecific.setFirstItemAsSelected){
                        if(data && data[0]){
                            element.val(data[0].value);
                            element.data('value', realValue);
                        }
                    }
                    else{
                        var defaultValueIndex = data && data.findIndex(function(item){
                            return item.isDefault;
                        });
                        if(defaultValueIndex != -1){
                            element.val(data[defaultValueIndex].value);
                            element.data('value', realValue);
                        }
                    }

                    if(self.hasChosen && self.hasChosen[mode]){
                        element.trigger('chosen:updated');
                    }

                    self.triggerFormViewElementChange(mode);
                }



                break;
        }
        return self;
    },
    setFormViewDisplayValue: function(dataRow, mode){
        var self = this;
        var value = self.parseDisplayValue(dataRow);
//        console.log(dataRow)
        var element = self.getFormViewElement(mode);

        value = self.addPrefixAndPostfix(value);

        switch(self.type){
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                element.find('input[type="checkbox"]')
                    .prop('checked',value);
                break;
            case Column.COLUMN_TYPES.BLOG_VIEW:
                //No need to set value since its using child window
                break;
            case Column.COLUMN_TYPES.HYPERLINK:
                //No need to set value since its using child window
                break;
            case Column.COLUMN_TYPES.IMAGE:
                var imageElements = self.hasImage[mode];
                imageElements.imgElement.attr('title', value.value || '');
                var url = self.getImageColumnPublicURL(dataRow);
                if(url){
                    imageElements.imgElement.css('background-image', 'url('+ url + ')');
                }
                break;
            case Column.COLUMN_TYPES.DOCUMENT:
                var downloadElement = self.hasDocument[mode].downloadElement;
                var documentElement = self.hasDocument[mode].documentElement;
                var downloadURL = self.getDocumentColumnPublicURL(dataRow);
                var iconURL = self.getDocumentColumnIconURL( dataRow );
                $(documentElement).css({
                    "background-image": iconURL? "url("+iconURL+")" : ''
                });
                var filename = self.getDocumentColumnFriendlyFilename(dataRow);
                $(downloadElement).attr({
                    href: downloadURL || '',
                    download: filename || '',
                    title: filename || ''
                });
                break;
            case Column.COLUMN_TYPES.MULTILINE:
                if(self.typeSpecific.isJson){
                    try{
                        element
                            .JSONView(value || '', { collapsed: true });
                    }
                    catch(jsonErr){
                        console.log('json view err', jsonErr, value)
                        element.html(value || '');
                    }

                }
                else{
                    element.html(value || '');
                }
                break;
            case Column.COLUMN_TYPES.INTEGER:

                if(value !== undefined){
                    try{
                        if(self.config.typeSpecific.isTimestampInUtc){
                            element
                                .text( moment( parseInt(value) ).format('DD MMM YYYY hh:mm a') )
                                .attr('title', value);
                        }
                        else{
                            element.text( value );
                        }
                    }
                    catch(timeErr){
                        element.text( value );
                    }
                }
                else{
                    element.text('');
                }
                break;
            case Column.COLUMN_TYPES.MULTIPLE_CHOICE:
                element.text( value );
                break;
            case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
                if(self.selectionMode == 'multiple'){
                    var valuesArr = (dataRow[self.id] || {}).value;
                    element.empty();
                    var ul = self._creation.createMultipleSelectionDisplayValueItem(self, valuesArr || []);
                    element.append(ul);
                }
                else{
                    element.html( value );
                }

                break;
            default:
                element.text(value);
        }

        if(self.customEventsFunctions.onSetDisplayValueInViewMode){
            self.customEventsFunctions.onSetDisplayValueInViewMode.apply(self, [dataRow, value, self.subModule, self, element, 'setFormViewDisplayValue', function(err){
                //
            }]);
        }

        return self;
    },
    setFormViewEditValue: function(dataRow, mode, value, options){
        var self = this;
        var realValue;
        if(!options){
            options = {};
        }

        var element = self.getFormViewElement(mode);
        if(value === undefined){
            value = self.parseEditValue(dataRow);
        }
//        if(Array.isArray(value)){
//            if(value.length === 1){
//                value = value[0];
//            }
//        }
        if(value !== null && typeof(value) ==='object'){

        }
        else{
            realValue = value;
        }

        if(self.isDisabledInFormView(mode)){
            switch (self.type){
                case Column.COLUMN_TYPES.LOOKUP_LABEL:
                    var finalValue;
                    if(value === undefined || value === null){
                        finalValue = '';
                    }
                    else{
                        finalValue = value.text;
                    }
                    if(self.typeSpecific.showImage){
                        if(finalValue){
                            var dataRow = {};
                            dataRow[self.typeSpecific.dataSource.columnId] = value;
                            var url = self.erp.allModules[self.typeSpecific.dataSource.moduleId]
                                .subModules[self.typeSpecific.dataSource.subModuleId]
                                .columnManager.columns[self.typeSpecific.dataSource.columnId]
                                .getImageColumnPublicURL(value.text, value.value);
                        }
                        element.attr('src', url || '');
                    }
                    else if(self.typeSpecific.formatAsDate && self.typeSpecific.formatAsDate.isEnabled){
                        if(finalValue){
                            element.text(moment(finalValue).format(self.typeSpecific.formatAsDate.formatAsDate));
                        }
                        else{
                            element.text('');
                        }
                    }
                    else{
                        element.text(finalValue);
                    }
                    break;
                case Column.COLUMN_TYPES.DATETIME:
                case Column.COLUMN_TYPES.DATE:
                case Column.COLUMN_TYPES.TIME:
                    if(value){
                        value = moment(value).format(self.typeSpecific.displayFormat)
                    }
                    element.text(value);
                    break;
                case Column.COLUMN_TYPES.INTEGER:
                    if(realValue){
                        element.text(realValue.toLocaleString());
                    }
                    else{
                        element.text(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.DECIMAL:
                    if(realValue){
                        element.text(realValue.toLocaleString());
                    }
                    else{
                        element.text(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.CHOICE:
                    if(realValue){
                        var filterdArr = self.typeSpecific.datalist.filter(function(item){
                            return (item.value == realValue)
                        });
                        if(filterdArr.length){
                            realValue = filterdArr[0].text;
                        }
                        else{
                            realValue = '';
                        }
                    }
                    element.text(realValue || '');
                    break;

                case Column.COLUMN_TYPES.MULTIPLE_CHOICE:
                    element.text(realValue);
                    // console.log('disabled element mul choice', realValue);
                    break;

                case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                    element.text(realValue);
                    element.data('value', realValue);
                    break;
                case Column.COLUMN_TYPES.BLOG_VIEW:
                    //no need to set hyperlink value since childWindow is appended
                    break;
                case Column.COLUMN_TYPES.HYPERLINK:
                    //no need to set hyperlink value since childWindow is appended
                    break;
                case Column.COLUMN_TYPES.MULTILINE:
                    if(self.allowHTMLEditor){
                        if(tinymce.editors[element.attr('id')].initialized){
                            tinymce.editors[element.attr('id')].setContent(realValue);
                        }
                        else{
                            element.val(realValue);
                        }
                    }
                    else{
                        element.text(realValue);
                    }
                    break;
                default :
                    element.text(realValue|| '');
                    break;
            }
        }
        else{
            switch (self.type){
                case Column.COLUMN_TYPES.CHECKBOX_BIT:
                case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                    element.prop('checked', realValue);
                    break;
                case Column.COLUMN_TYPES.INTEGER:
                    element.val(realValue);
                    break;
                case Column.COLUMN_TYPES.DECIMAL:
                    if(realValue){
                        if(self.typeSpecific.decimalPoint && self.typeSpecific.decimalPoint.isEnabled){
                            element.val(realValue.toFixed(self.typeSpecific.decimalPoint.decimalPoint));
                        }
                        else{
                            element.val(realValue);
                        }
                    }
                    else{
                        element.val(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.DATE:
                    if(realValue && realValue.length){
                        if(self.typeSpecific.hideDatePart){
                            realValue = moment(realValue).format('YYYY-MM');
                        }
                        else{
                            realValue = moment(realValue).format('YYYY-MM-DD');
                        }
                        element.val(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.TIME:
                    if(realValue && realValue.length){
                        if(realValue.indexOf('-') == -1){
                            realValue = '1970-01-01 ' + realValue;
                        }
                        realValue = moment(realValue).format('HH:mm:ss');
                        element.val(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.DATETIME:
                    if(realValue && realValue.length){
                        element.val(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.CHOICE:
                    if(!realValue){
                        realValue = '';
                    }
                    element.val(realValue);
                    break;

                case Column.COLUMN_TYPES.MULTIPLE_CHOICE:


                    realValue = dataRow[self.id].value;

                    // element.children('[selected]').removeAttr('selected');
                    // for(var itemKey in realValue){
                    //     if(realValue[itemKey]){
                    //         element.children('[value="'+ itemKey +'"]').attr('selected', 'selected');
                    //     }
                    // }
                    var valuesToSet = [];
                    for(var itemKey in realValue){
                        if(realValue[itemKey]){
                            valuesToSet.push( itemKey);
                        }
                    }
                    element.val(valuesToSet);

                    // value = {};
                    // element.val().forEach(function (selectedValue) {
                    //     if(selectedValue.length){
                    //         value[selectedValue] = true;
                    //     }
                    // });
                    break;

                case Column.COLUMN_TYPES.IMAGE:
                    var url = self.getImageColumnPublicURL(dataRow);
                    var imageElements = self.hasImage[mode];
                    imageElements.inputElement.removeData('changed').val(null);
                    if(url){
                        imageElements.imgElement.css('background-image', 'url('+url+')').attr('title', realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.DOCUMENT:
                    var downloadURL = self.getDocumentColumnPublicURL(dataRow);
                    var iconURL = self.getDocumentColumnIconURL( dataRow );
                    var documentElements = self.hasDocument[mode];
                    documentElements.inputElement.removeData('changed').val(null);
                    if(downloadURL){
                        documentElements.documentElement
                            .css('background-image', 'url('+iconURL+')')
                            .attr('data-download', downloadURL)
                            .attr('title', realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
                    if(self.selectionMode == 'multiple'){
                        realValue = dataRow[self.id].value;
                        var valuesToSet = [];
                        realValue.forEach(function (item) {
                            valuesToSet.push( item.value);
                        });
                        element.val(valuesToSet);
                        // console.log(' 1111 ', realValue, valuesToSet);
                        // element.children('[selected]').removeAttr('selected');
                        // realValue.forEach(function (item) {
                        //     element.children('[value="'+item.value+'"]').attr('selected', 'selected');
                        // });
                        element.data('value', realValue);
                    }
                    else{
                        if(self.typeSpecific.appearAsRadioButtonGroup){
                            element.children(':checked')
                                .prop('checked', false);
                            element.children('[value="'+ realValue +'"]')
                                .prop('checked', true);
                            element.data('value', realValue);
                        }
                        else{
                            element.val(realValue);
                            element.data('value', realValue);
                        }
                    }

                    break;
                case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                    if(value !== null && typeof(value) ==='object'){
                        if(typeof value === 'undefined'){
                            realValue = '';
                        }
                        else{
                            realValue = value.value;
                        }
                    }
                    element.val(realValue);
                    element.data('value', realValue);
                    break;
                case Column.COLUMN_TYPES.MULTILINE:

                    if(self.allowHTMLEditor){
                        if(tinymce.editors[element.attr('id')].initialized){
                            tinymce.editors[element.attr('id')].setContent(realValue || '');
                        }
                        else{
                            element.val(realValue);
                        }
                    }
                    else{
                        element.val(realValue);
                    }
                    break;
                default :
                    element.val(realValue);
                    break;
            }
        }
        if(self.hasChosen && self.hasChosen[mode]){
            element.trigger('chosen:updated');
        }
        if(options.triggerChange){
//            console.log('setFormViewEditValue', self.id, realValue)
            self.triggerFormViewElementChange(mode, {selected: value.toString()})
        }
        return self;
    },
    setFormViewDefaultValue: function(formView){
        var self = this;
        var getFromParentValue = self.parseGetFromParentCondition(formView);
        if(getFromParentValue !== null){
            self.setFormViewEditValue(null, formView.mode, getFromParentValue, {triggerChange: true});
        }
        else if(self.defaultValue!== undefined && self.defaultValue!== null && self.defaultValue.toString().length){
            switch(self.type){
                case "date":
                    if(self.defaultValue == 'getDate'){
                        self.setFormViewEditValue(null, formView.mode, moment(new Date()).format('YYYY-MM-DD'));
                    }
                    break;
                case "time":
                case "dateTime":
                    if(self.defaultValue == 'getDate'){
                        self.setFormViewEditValue(null, formView.mode, moment(new Date()).format('YYYY-MM-DD HH:mm:00'));
                    }
                    break;
                case "decimal":
                    self.setFormViewEditValue(null, formView.mode, parseFloat(self.defaultValue));
                    break;
                case "integer":
                    self.setFormViewEditValue(null, formView.mode, parseInt(self.defaultValue));
                    break;
                default:
                    self.setFormViewEditValue(null, formView.mode, self.defaultValue);
            }
        }
        return self;
    },

    parseGetFromParentCondition: function(parentView){
        var self = this;
        var obj = null;
        var parentDataRow;
        var parentSubModule;

        if(parentView instanceof FormView){
            parentDataRow= self.subModule.parentDataRow;
            parentSubModule= self.subModule.parentSubModule;
        }
        else{
            parentSubModule = parentView.parentSubModule;
            parentDataRow = parentView.parentFormView.getFormData();
        }

        if(parentView.dynamicCallBacks.ignoreParentCondition){
        }
        else if(parentSubModule){
            if(self.getFromParentCondition1 && self.getFromParentCondition1.isEnabled && self.getFromParentCondition1.getFromParentCondition1.subModuleId === parentSubModule.id){
                obj = self._parse.parseGetFromParentConditionItemValue(self.getFromParentCondition1.getFromParentCondition1, parentSubModule, parentDataRow);
            }
            else if(self.getFromParentCondition2 && self.getFromParentCondition2.isEnabled && self.getFromParentCondition2.getFromParentCondition2.subModuleId === parentSubModule.id){
                obj = self._parse.parseGetFromParentConditionItemValue(self.getFromParentCondition2.getFromParentCondition2, parentSubModule, parentDataRow);
            }
            else if(self.getFromParentCondition3 && self.getFromParentCondition3.isEnabled && self.getFromParentCondition3.getFromParentCondition3.subModuleId === parentSubModule.id){
                obj = self._parse.parseGetFromParentConditionItemValue(self.getFromParentCondition3.getFromParentCondition3, parentSubModule, parentDataRow);
            }
            else if(self.getFromParentCondition4 && self.getFromParentCondition4.isEnabled && self.getFromParentCondition4.getFromParentCondition4.subModuleId === parentSubModule.id){
                obj = self._parse.parseGetFromParentConditionItemValue(self.getFromParentCondition4.getFromParentCondition4, parentSubModule, parentDataRow);
            }
            else if(self.getFromParentCondition5 && self.getFromParentCondition5.isEnabled && self.getFromParentCondition5.getFromParentCondition5.subModuleId === parentSubModule.id){
                obj = self._parse.parseGetFromParentConditionItemValue(self.getFromParentCondition5.getFromParentCondition5, parentSubModule, parentDataRow);
            }
        }
        return obj;
    },
    setGridValue: function(element, dataRow){
        var self = this;
        if(self.typeSpecific.editInDisplay){
            self.setGridEditValue(element, dataRow);
        }
        else{
            self.setGridDisplayValue(element, dataRow);
        }
        return self;
    },
    bindGridViewEditInDisplayElementEvents: function(element, dataRow){
        var self = this;
        element.on('change.gridViewEditInDisplayElement', function(){
            self.gridViewEditInDisplayElementChanged(element, dataRow);
        });
        return self;
    },
    gridViewEditInDisplayElementChanged: function(element, dataRow){
        var self = this;
//        self.subModule.grid.selectRowSelector(dataRow);
        self.subModule.updateEditInDisplayColumn(self, self.getGridViewEditInDisplayElementValue(dataRow), dataRow);
        self.setGridViewEditInDisplayElementAsLoading(dataRow, element);
        return self;
    },
    setGridViewEditInDisplayElementAsLoading: function(dataRow){
        var self = this;
        var element = self.getEditInDisplayElement(dataRow);
        element.addClass('loading').prop('readonly', true);
        return self;
    },
    setGridViewEditInDisplayElementAsNormal: function(dataRow){
        var self = this;
        var element = self.getEditInDisplayElement(dataRow);
        element.removeClass('loading').prop('readonly', false);
        return self;
    },
    saveEditInDisplayColumnDone: function(data){
        var self = this;
        if(data.success){
            if(self.typeSpecific && self.typeSpecific.singleSelectionMode && self.typeSpecific.singleSelectionMode.isEnabled){
                var valueToParse = {};
                valueToParse[self.id] = self.typeSpecific.singleSelectionMode.singleSelectionMode.multipleValue;
                var valueToSet = {};
                valueToSet[self.id] = self.parseEditValue(valueToParse);

                self.subModule.grid.saveColumnDataInConfig(self, valueToSet, null, true);

                valueToParse = {};
                valueToParse[self.id] = data.result.value;
                valueToSet = {};
                valueToSet[self.id] = self.parseEditValue(valueToParse);
                self.subModule.grid.saveColumnDataInConfig(self, valueToSet, data.result.rowId, true);
            }

            self.setGridViewEditInDisplayElementAsNormal(data.result.rowId);
            self.subModule.grid.data[data.result.rowId][self.id].value = data.result.value;
        }
        else{
            console.log(data.errorMessage || 'Error Saving Data For '+ self.id, data);
        }
        return self;
    },
    getGridViewEditInDisplayElementValue: function(dataRow){
        var self = this;
        var value;
        var element ;
        element = self.getEditInDisplayElement(dataRow);
        switch (self.type){
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                value = element.prop('checked');
                break;
            case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                value = element.prop('checked')? self.typeSpecific.checkedValue: self.typeSpecific.uncheckedValue;
                break;
            case Column.COLUMN_TYPES.DECIMAL:
                value = parseFloat(element.val());
                break;
            case Column.COLUMN_TYPES.INTEGER:
                value = parseInt(element.val());
                break;
            default :
                if(element){
                    value = element.val();
                }
                break;
        }
        return value;
    },
    setGridEditValue: function(element, dataRow){
        var self = this;
        var value = self.parseEditValue(dataRow);
        switch(self.type){
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                element.prop('checked', value);
                break;
            default:
                element.val(value);
        }
        return self;
    },
    getEditInDisplayElement: function(rowId){
        var self = this;
        var element;
        if(rowId.id){
            element = self.elements.editInDisplay[rowId.id];
        }
        else{
            element = self.elements.editInDisplay[rowId];
        }
        return element;
    },
    setGridDisplayValue: function(element, dataRow){
        var self = this;
        var value = self.parseDisplayValue(dataRow);

        value = self.addPrefixAndPostfix(value);

        if(self.typeSpecific.partialString && self.typeSpecific.partialString.isEnabled){
            var fullValue = value.toString();
            var limit = self.typeSpecific.partialString.partialString||10;
            if(fullValue.length > limit){
                element.attr({title: fullValue.replace(new RegExp('<br />'), '\n')});
                value = value.substring(0, limit) + '...';
            }
        }
        switch(self.type){
            case Column.COLUMN_TYPES.LOOKUP_LABEL:
                if(self.typeSpecific.formatAsDate && self.typeSpecific.formatAsDate.isEnabled){
                    if(value){
                        element.text(moment(value).format(self.typeSpecific.formatAsDate.formatAsDate));
                    }
                    else{
                        element.text('');
                    }
                }
                else{
                    element.html(value);
                }
                break;
            case Column.COLUMN_TYPES.DECIMAL:
                element.html(value);
                break;

            case Column.COLUMN_TYPES.INTEGER:

                if(value !== undefined){
                    try{
                        if(self.config.typeSpecific.isTimestampInUtc){
                            element
                                .text( moment( parseInt(value) ).format('DD MMM YYYY hh:mm a') )
                                .attr('title', value);
                        }
                        else{
                            element.text( value );
                        }
                    }
                    catch(timeErr){
                        element.text( value );
                    }
                }
                else{
                    element.text('');
                }

                break;

            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                element.prop('checked',value);
                break;
            case Column.COLUMN_TYPES.BLOG_VIEW:
                element.html(value);
                break;
            case Column.COLUMN_TYPES.HYPERLINK:
                element.html(value);
                break;
            case Column.COLUMN_TYPES.IMAGE:
                var url = self.getImageColumnPublicURL(dataRow);
                if(url){
                    element.css('background-image', 'url('+ url +')');
                }
                break;
            case Column.COLUMN_TYPES.SINGLELINE:
                if(self.typeSpecific.customInputType && self.typeSpecific.customInputType.isEnabled){
                    switch(self.typeSpecific.customInputType.customInputType){
                        case "url":
                            element.html(value)
                                .attr('href', value);
                            break;
                        default:
                            element.html(value);
                    }
                }
                else{
                    element.html(value);
                }
                break;
            case Column.COLUMN_TYPES.DOCUMENT:
                var iconURL = self.getDocumentColumnIconURL( dataRow );
                var downloadURL = self.getDocumentColumnPublicURL(dataRow);
                var filename = self.getDocumentColumnFriendlyFilename(dataRow);
                if(downloadURL){
                    element.css('background-image', 'url('+iconURL+')')
                        .attr('href', downloadURL)
                        .attr('download', filename)
                        .attr('title', filename);
                }
                break;
            case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:

                if(self.selectionMode == 'multiple'){
                    var valuesArr = (dataRow[self.id] || {}).value;
                    element.empty();
                    var ul = self._creation.createMultipleSelectionDisplayValueItem(self, valuesArr || []);
                    element.append(ul);
                }
                else{
                    element.text( value );
                }
                break;
            default:
                element.html(value);
        }

        if(self.customEventsFunctions.onSetDisplayValueInViewMode){
            self.customEventsFunctions.onSetDisplayValueInViewMode.apply(self, [dataRow, value, self.subModule, self, element, 'setGridDisplayValue', function(err){
                //
            }]);
        }
        //formView.executeCustomOnChangeEventFunction(self, element, self.customEventsFunctions.onChangeOnUpdate);



        return self;
    },

    getImageColumnPublicURL: function(dataRow, idValue){
        var self = this;
        var str = '';
        if(idValue){
            str = '/uploads';
            str +='/'+ self.module.id;
            str +='/'+ self.subModule.id;
            str += '/'+ idValue;
            str += '_'+ self.id;
            if( dataRow.indexOf('{') == 0){
                str += '.'+ JSON.parse( dataRow ).extension;
            }
            else{
                str += '.'+ dataRow.substring(dataRow.lastIndexOf('.')+1);
            }

        }
        else if( dataRow[self.id] && dataRow[self.id].value){
            if(dataRow[self.id].url){
                str = dataRow[self.id].url;
            }
            else{
                str = '/uploads';
                str +='/'+ self.module.id;
                str +='/'+ self.subModule.id;
                str += '/'+ dataRow['id'];
                str += '_'+ self.id;
                str += '.'+ dataRow[self.id].value.substring(dataRow[self.id].value.lastIndexOf('.')+1);
            }

        }
        else if(dataRow.value){
            if(dataRow.url){
                str = dataRow[self.id].url;
            }
            else{
                str = '/uploads';
                str +='/'+ self.module.id;
                str +='/'+ self.subModule.id;
                str += '/'+ dataRow.value;
                str += '_'+ self.id;
                str += '.'+ dataRow.text.substring(dataRow.text.lastIndexOf('.')+1);
            }
        }
        if(str.length){
            str += '?_='+Math.random();
        }
        return str;
    },
    getDocumentColumnIconURL: function(dataRow){
        var self = this;
        var extension = '';
        if( dataRow[self.id] && dataRow[self.id].value && dataRow[self.id].value.extension){
            extension =dataRow[self.id].value.extension;
        }
        else if( dataRow[self.id] && dataRow[self.id].value){
            extension = dataRow[self.id].value.substring(dataRow[self.id].value.lastIndexOf('.')+1);
        }
        else if(dataRow.value){
            extension += dataRow.text.substring(dataRow.text.lastIndexOf('.')+1);
        }
        if(!extension){
            return;
        }
        return   '/images/documentIcons/'+ extension +'.png';
    },
    getImageColumnFriendlyFilename: function(dataRow){
        var self = this;
        var str = '';
        if( dataRow[self.id] && dataRow[self.id].value && dataRow[self.id].value.filename){
            str = dataRow[self.id].value.filename;
        }
        else{
            str += dataRow[self.id].value;
        }
        return str;
    },
    getDocumentColumnFriendlyFilename: function(dataRow){
        var self = this;
        var str = '';
        if( dataRow[self.id] && dataRow[self.id].value && dataRow[self.id].value.filename){
            str = dataRow[self.id].value.filename;
        }
        else{
            str += dataRow[self.id].value || '';
        }
        return str;
    },
    getDocumentColumnPublicURL: function(dataRow){
        var self = this;
        var str = '';
        if( dataRow[self.id] && dataRow[self.id].value && dataRow[self.id].value.extension){
            str = '/uploads';
            str +='/'+ self.module.id;
            str +='/'+ self.subModule.id;
            str += '/'+ dataRow['id'];
            str += '_'+ self.id;
            str += '.'+dataRow[self.id].value.extension;
        }
        else if( dataRow[self.id] && dataRow[self.id].value){
            str = '/uploads';
            str +='/'+ self.module.id;
            str +='/'+ self.subModule.id;
            str += '/'+ dataRow['id'];
            str += '_'+ self.id;
            str += '.'+ dataRow[self.id].value.substring(dataRow[self.id].value.lastIndexOf('.')+1);
        }
        else if(dataRow.value){
            str = '/uploads';
            str +='/'+ self.module.id;
            str +='/'+ self.subModule.id;
            str += '/'+ dataRow.value;
            str += '_'+ self.id;
            str += '.'+ dataRow.text.substring(dataRow.text.lastIndexOf('.')+1);
        }

        let url = self.erp.backend_root_url + str;
        return url;
    },
    getToolTipData: function(dataRow){
        var self = this;
        self.columnManager.subModule.getToolTipData(self, dataRow);
        return self;
    },
    setToolTipData: function(data){
        var self = this;
        if(!self.isMouseOver){
            return self;
        }
        if(self.mouseOverRowId != data.rowId){
            return self;
        }
        var arr = data.data;
        if(self.elements.toolTipContainer){
            self.elements.toolTipContainer.remove();
        }
        var columnGridViewElement = self.columnManager.subModule.grid.getColumnElementForRow(self, data.rowId);
        var position = columnGridViewElement.offset();
        self._creation.createToolTipDataContainer(self, arr);
        self.elements.toolTipContainer.appendTo(document.body);
        position.top += columnGridViewElement.height();
        position.left += columnGridViewElement.width()/2;
        position.left -= self.elements.toolTipContainer.width()/2;
        position.marginTop = '12px';
        self.elements.toolTipContainer.css(position);
        setTimeout(function(){
            if(self.elements.toolTipContainer){
                self.elements.toolTipContainer.addClass('showAnimation');
            }
        },0);
        return self;
    },
    removeToolTipData: function(){
        var self = this;
        if(self.elements.toolTipContainer){
            self.elements.toolTipContainer.remove();
            delete self.elements.toolTipContainer;
        }
        return self;
    },

    setSuggestionsData: function(data){
        var self = this;
        self.suggestionsData = data;
        var datalist = self._creation.createDatalistElement(self, data);
        if(self.elements.datalist){
            self.elements.datalist.remove();
        }
        self.elements.datalist = datalist;
        datalist.appendTo(document.body);
        return self;
    },

    createGridElement: function(dataRow){
        var self = this;
        var element;
        if(self.typeSpecific.editInDisplay){
            element = self._creation.createGridViewEditInDisplayElement(self, dataRow);
            self.bindGridViewEditInDisplayElementEvents(element, dataRow);
            self.elements.editInDisplay[dataRow.id] = element;
        }
        else{
            switch(self.type){
                case Column.COLUMN_TYPES.BLOG_VIEW:
                    element = document.createElement('a');
                    break;
                case Column.COLUMN_TYPES.HYPERLINK:
                    element = document.createElement('a');
                    break;
                case Column.COLUMN_TYPES.IMAGE:
                    element = document.createElement('div');
                    element.classList.add('gridViewImgElement');
                    break;
                case Column.COLUMN_TYPES.DOCUMENT:
                    element = document.createElement('a');
                    element.target = '_blank';
                    element.classList.add('gridViewDocumentElement');
                    break;
                case Column.COLUMN_TYPES.SINGLELINE:
                    if(self.typeSpecific.customInputType && self.typeSpecific.customInputType.isEnabled){
                        switch(self.typeSpecific.customInputType.customInputType){
                            case "url":
                                element = document.createElement('a');
                                element.target = '_blank';
                                element.classList.add('gridViewSingleLineURLElement');
                                break;
                            default:
                                element = document.createElement('span');
                        }
                    }
                    else{
                        element = document.createElement('span');
                    }
                    break;
                case Column.COLUMN_TYPES.CHECKBOX_BIT:
                    element = document.createElement('input');
                    element.type = 'checkbox';
                    element.disabled = true;
                    break;
                default:
                    element = document.createElement('span');
            }
            element.classList.add('grid-data-item');
            element.id = 'item_'+ self.id;
            element.setAttribute('data-id', self.id);
        }
        return $(element);
    },
    initializeFormViewChosen: function(formView, mode){
        var self = this;
        self.isChosenInitialized[mode] = true;
        var element = self.getFormViewElement(mode);
        if(self.typeSpecific.allowQuickAdd){
            element.chosen({
                width: "86%",
                search_contains: true,
                allow_single_deselect: !self.validations.mandatory,
                "no_results_text": "No result found. Click to Add",
                onNoResultsClick: function(searchValue){
                    self.quickAddBtnClicked(searchValue, element.next(), self.subModule.formView.getFormData());
                },
                onNoResultsEnter: function(searchValue){
                    self.quickAddBtnClicked(searchValue, element.next(), self.subModule.formView.getFormData());
                }
            });
            var quickAddBtn = self._creation.createQuickAddButton(self);
            element.next().after(quickAddBtn);
            quickAddBtn.on('click', function(){
                self.quickAddBtnClicked({}, element.next(), self.subModule.formView.getFormData());
            });
        }
        else{
            element.chosen({
                width: "100%",
                search_contains: true,
                allow_single_deselect: !self.validations.mandatory
            });
        }

        if(self.typeSpecific.enableFilterableView) {
            var showFilterableViewBtn = self._creation.createShowFilterableViewBtn(self);
            element.next().after(showFilterableViewBtn);
            showFilterableViewBtn.on('click', function(){
                self.showFilterableView(mode);
                // self.showFilterableView(element.next(), self.subModule.formView.getFormData());
            });

            var filterableViewContainer = self._creation.createFilterableViewContainer(self, mode);
            showFilterableViewBtn.after(filterableViewContainer);

            self.filterableViews = self.filterableViews || {};
            self.filterableViews[mode] = filterableViewContainer;
        }
        return self;
    },
    getFilterableView:function(mode){
        var self = this;

        // if(self.filterableViews[mode]){
        //     return self.filterableViews[mode];
        // }

        return self.filterableViews[mode];
    },
    showFilterableView:function(mode){
        var self = this;


        var container = self.getFilterableView(mode);
        window._col = self;

        FilterableViewHelper.show(self, container, mode, self.getFormViewElementValue(self.subModule.formView), {
            onSave: function (selectedItems) {
                // console.log('onSave', self.id, selectedItems);
                var dRow = {};
                dRow[self.id] = { value : selectedItems };
                self.setFormViewEditValue(dRow, mode, selectedItems)
            },
            onCancel: function () {
                // console.log('onCancel', self.id)
            }
        });


        return self;
    },
    quickAddBtnClicked:function(searchValue, parentColumnElement, formData){
        var self = this;
        self.quickAdd(searchValue, parentColumnElement, formData);
        return self;
    },
    quickAdd: function(searchValue, parentColumnElement, formData){
        var self = this;
        var dataSource = self.typeSpecific.dataSource;
        var targetSubModule = self.erp.allModules[dataSource.moduleId]
            .subModules[dataSource.subModuleId];
        var targetColumn = targetSubModule.columnManager.columns[dataSource.columnId];
        var customCreateModeValues = {};
        var parentDataRowForQuickAdd = {};
        //console.log('quickAdd', searchValue, parentColumnElement.get(0), formData);

        if(self.typeSpecific.parentColumns){
            self.typeSpecific.parentColumns.forEach(function(parentColumnId){
                var parentColumn = self.columnManager.columns[parentColumnId];
                var targetColumnWithSameUniqueName = targetSubModule.columnManager
                    .columnsByUniqueName[parentColumn.uniqueName];
                if(targetColumnWithSameUniqueName){
                    customCreateModeValues[targetColumnWithSameUniqueName.id] = formData[parentColumn.id]
                }

                //console.log('parentColumn', parentColumn.id, targetColumnWithSameUniqueName.id, formData[parentColumn.id]);

                if(parentColumn.type == Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST){
                    var parentColumnDataSource = parentColumn.typeSpecific.dataSource;
                    var parentColumnDataSourceSubModule = self.erp.allModules[parentColumnDataSource.moduleId]
                        .subModules[parentColumnDataSource.subModuleId];
                    var parentColumnDataSourceOriginalColumn = parentColumnDataSourceSubModule
                        .columns[parentColumnDataSource.columnId];

                    var correctParentCondition;
                    targetSubModule.columnManager.forEachColumn(function(targetSubModuleChildColumn){
                        if(correctParentCondition){
                            return;
                        }
                        correctParentCondition = targetSubModuleChildColumn.getCurrentFormViewGetDataFromParentCondition(parentColumnDataSourceSubModule);

                        //console.log('correctParentCondition', parentColumnDataSourceOriginalColumn, correctParentCondition, formData[parentColumn.id]);


                        if(correctParentCondition){
                            parentDataRowForQuickAdd[correctParentCondition.columnId] = formData[parentColumn.id]
                        }

                    });




                    //var currentColumnDataSource = parentColumn.typeSpecific.dataSource;
                    //var currentColumnDataSourceOriginalColumn = self.erp.allModules[currentColumnDataSource.moduleId]
                    //    .subModules[currentColumnDataSource.subModuleId]
                    //    .columns[currentColumnDataSource.columnId];
                    //
                    //if(self.getFromParentCondition1)
                    //self.compareGetDataFromParentConditionToSubModule();
                }


            });
//            console.log(formData, customCreateModeValues);
        }

        targetSubModule.showFormViewForQuickAdd({
            onAfterInsert: function(data){
                var rowId = data.rowId;
                self.setFormViewEditValue(null, self.subModule.formView.mode, rowId, {});
                var formViewObj = {};
                formViewObj.mode = self.subModule.formView.mode;
                formViewObj.data = self.subModule.formView.getFormData();
                self.getLookUpDataFromServerViaAjax(formViewObj, function(result){
                    if(!result.success){
                        console.log(result);
                        return;
                    }
                    self.setFormViewLookupData(result.result, self.subModule.formView.mode, {});
                    setTimeout(function(){
                        if(targetColumn.hasChosen && targetColumn.hasChosen[self.subModule.formView.mode]){
                            targetColumn.hasChosen[self.subModule.formView.mode].activate_field();
                        }
                    }, 100);
                });
            },
            parentDataRowForQuickAdd: parentDataRowForQuickAdd,
            customCreateModeValues: customCreateModeValues,
            parentColumnElement: parentColumnElement,
            showQuickAddView: true
        });

        if(targetColumn){
            targetColumn.setFormViewEditValue(null, targetSubModule.formView.mode, searchValue, {});
        }
        return self;
    },
    simpleDataTableRowQuickAddBtnClicked:function(searchValue, parentColumnElement, formData, simpleDataTableRow, isChosen){
        var self = this;
        self.simpleDataTableRowQuickAdd(searchValue, parentColumnElement, formData, simpleDataTableRow, isChosen);
        return self;
    },
    simpleDataTableRowQuickAdd: function(searchValue, parentColumnElement, formData, simpleDataTableRow, isChosen){
        var self = this;
        var dataSource = self.typeSpecific.dataSource;
        var targetSubModule = self.erp.allModules[dataSource.moduleId]
            .subModules[dataSource.subModuleId];
        var targetColumn = targetSubModule.columnManager.columns[dataSource.columnId];
        var customCreateModeValues = {};
        var parentDataRowForQuickAdd = {};

        if(self.typeSpecific.parentColumns){
            self.typeSpecific.parentColumns.forEach(function(parentColumnId){
                var parentColumn = self.columnManager.columns[parentColumnId];
                var targetColumnWithSameUniqueName = targetSubModule.columnManager.columnsByUniqueName[parentColumn.uniqueName];

                if(targetColumnWithSameUniqueName){
                    //console.log('yatheendraRaj',parentColumn.id,parentColumn,formData)
                    customCreateModeValues[targetColumnWithSameUniqueName.id] = formData[parentColumn.id]
                }


                //console.log('parentColumn', parentColumn.id, targetColumnWithSameUniqueName.id, formData[parentColumn.id]);

                if(parentColumn.type == Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST){
                    var parentColumnDataSource = parentColumn.typeSpecific.dataSource;
                    var parentColumnDataSourceSubModule = self.erp.allModules[parentColumnDataSource.moduleId]
                        .subModules[parentColumnDataSource.subModuleId];
                    var parentColumnDataSourceOriginalColumn = parentColumnDataSourceSubModule
                        .columns[parentColumnDataSource.columnId];

                    var correctParentCondition;
                    targetSubModule.columnManager.forEachColumn(function(targetSubModuleChildColumn){
                        if(correctParentCondition){
                            return;
                        }
                        correctParentCondition = targetSubModuleChildColumn.getCurrentFormViewGetDataFromParentCondition(parentColumnDataSourceSubModule);

                        //console.log('correctParentCondition', parentColumnDataSourceOriginalColumn, correctParentCondition, formData[parentColumn.id]);


                        if(correctParentCondition){
                            parentDataRowForQuickAdd[correctParentCondition.columnId] = formData[parentColumn.id]
                        }

                    });




                    //var currentColumnDataSource = parentColumn.typeSpecific.dataSource;
                    //var currentColumnDataSourceOriginalColumn = self.erp.allModules[currentColumnDataSource.moduleId]
                    //    .subModules[currentColumnDataSource.subModuleId]
                    //    .columns[currentColumnDataSource.columnId];
                    //
                    //if(self.getFromParentCondition1)
                    //self.compareGetDataFromParentConditionToSubModule();
                }






            });


        }



        //console.log('parentDataRowForQuickAdd', parentDataRowForQuickAdd)



        var parentPositioningElement = ''
        if(isChosen){
            parentPositioningElement = parentColumnElement.closest('div');
        }
        targetSubModule.showFormViewForQuickAdd({
            onAfterInsert: function(data){
                var rowId = data.rowId;
                var formViewObj = {};
                formViewObj.mode = self.subModule.formView.mode;
                formViewObj.data = self.subModule.formView.getFormData();
                self.getLookUpDataFromServerViaAjax(formViewObj, function(result){
                    if(!result.success){
                        console.log(result);
                        return;
                    }
                    self.setSimpleDataTableRowLookupData(result.result, simpleDataTableRow, {});
                    //self.setFormViewLookupData(result.result, self.subModule.formView.mode, {});
                    self.setSimpleDataTableRowEditValue(null, simpleDataTableRow, data.rowId, {});

                    setTimeout(function(){
                        if(targetColumn.hasChosen && targetColumn.hasChosen[self.subModule.formView.mode]){
                            targetColumn.hasChosen[self.subModule.formView.mode].activate_field();
                        }
                    }, 100);
                });
            },
            isChosen: isChosen,
            customCreateModeValues: customCreateModeValues,
            parentDataRowForQuickAdd: parentDataRowForQuickAdd,
            parentColumnElement: parentColumnElement,
            parentPositioningElement: parentPositioningElement,
            showQuickAddView: true
        });

        if(targetColumn && searchValue){
            targetColumn.setFormViewEditValue(null, targetSubModule.formView.mode, searchValue, {});
        }
        return self;
    },
    _creation : {
        createMultipleSelectionDisplayValueItem: function(column, valuesArr){
            var self = this;

            var ul = $(document.createElement('ul')).attr('class', 'multipleSelectionDisplayValueList');
            valuesArr.forEach(function (obj) {
                var li = $(document.createElement('li')).attr('class', 'multipleSelectionDisplayValueListItem')
                    .html('<li></li>');
                // li.find('span')
                li.text(obj.text);
                li.attr('data-value', obj.value)

                ul.append(li);
            });

            if(valuesArr.length){
                ul.attr('data-items-count', valuesArr.length);
            }

            return ul;
        },
        createDatalistElement: function(column, data){
            var self = this;
            var datalist = $(document.createElement('datalist'))
                .attr('id', 'datalist_'+column._id);
            data.forEach(function(item){
                var option = document.createElement('option');
                option.value = item;
                datalist.append(option);
            });
            return datalist;
        },

        createShowFilterableViewBtn: function(column, data){
            var self = this;
            var btn = $(document.createElement('div'))
                .attr(column.constants.showFilterableViewButton);
            return btn;
        },
        createFilterableViewContainer: function(column, mode){
            var self = this;
            var div = $(document.createElement('div'))
                .attr(column.constants.filterableViewContainer)
                .attr('data-mode', mode);

            var defaultHtmlStr = `
            
            <div class="filterableViewMain">
            
            <div class="filterableViewHeader">
            <div class="filterableViewHeaderDisplayName"></div>            
</div>
<div class="filterableViewFilters"></div>
<div class="filterableViewResults">
    <table class="filterableViewResultsTableMain">
    <thead>
    <th></th>
    <th>Text</th>
    </thead>
    <tbody></tbody>
</table>
</div>
<div class="filterableViewButtonPanel">
    <button class="filterableViewSaveButton">Save</button>
    <button class="filterableViewCancelButton">Cancel</button>
</div>
</div>
            
            
            `;

            div.html( defaultHtmlStr );

            return div;
        },

        createQuickAddButton: function(column, data){
            var self = this;
            var btn = $(document.createElement('div'))
                .attr(column.constants.quickAddButton);
            return btn;
        },
        createToolTipDataContainer: function(column, data){
            var self = this;
            var container = $(document.createElement('div')).attr(column.constants.toolTipContainer);
            var table = $(document.createElement('table')).appendTo(container);
            table.append(self.createTableHead(column, data));
            table.append(self.createTableBody(column, data));
            column.elements.toolTipContainer = container;
            return container;
        },
        createTableHead: function(column, data){
            var self = this;
            var thead = $(document.createElement('thead'));
            var dataRow = data[0];
            if(data){
                var tr = document.createElement('tr');
                for(var key in dataRow){
                    var th = document.createElement('th');
                    var element = document.createElement('span');
                    element.innerHTML = key;
                    th.appendChild(element);
                    tr.appendChild(th);
                }
                thead.append(tr);
            }
            return thead;
        },
        createTableBody: function(column, data){
            var self = this;
            var tbody;
            if(Object.keys(data).length){
                tbody = self.createDataRows(column, data);
            }
            else{
                tbody = self.createNoDataMessageRow(column, data);
            }
            return tbody;
        },
        createNoDataMessageRow: function(column){
            var self = this;
            var tbody = document.createElement('tbody');
            var tr = document.createElement('tr');
            var td = document.createElement('td');
//            td.colSpan = list.columnOrder.length+1;
            td.className = 'list-no-data-message-row';
            var span = document.createElement('span');
            span.innerHTML = column.noDataMessage || 'No Data To Display';
            td.appendChild(span);
            tr.appendChild(td);
            tbody.appendChild(tr);
            return tbody;
        },
        createDataRows: function(column, data){
            var self = this;
            var tbody = document.createElement('tbody');
            data.forEach(function(dataRow){
                var tr = document.createElement('tr');
                for(var key in dataRow){
                    var td = document.createElement('td');
                    var element = document.createElement('span');
                    element.innerHTML = dataRow[key];
                    td.appendChild(element);
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            });
            return tbody;
        },
        createFormElement: function(column, mode){
            var self = this;
            var element;
            var disabled = false;
            if(column.disableCondition.disabled){
                disabled = true;
            }
            else if(mode === FormView.EDIT_MODE && column.disableCondition.disableOnceCreated){
                disabled = true;
            }
            if(!disabled){
                switch (column.type){
                    case Column.COLUMN_TYPES.SINGLELINE:
                        element = self.createSingleLine(column, mode);
                        break;
                    case Column.COLUMN_TYPES.MULTILINE:
                        element = self.createMultiLine(column, mode);
                        break;
                    case Column.COLUMN_TYPES.INTEGER:
                        element = self.createInteger(column, mode);
                        break;
                    case Column.COLUMN_TYPES.DECIMAL:
                        element = self.createDecimal(column, mode);
                        break;
                    case Column.COLUMN_TYPES.CHOICE:
                        element = self.createChoice(column, mode);
                        break;
                    case Column.COLUMN_TYPES.MULTIPLE_CHOICE:
                        element = self.createMultipleChoice(column, mode);
                        break;
                    case Column.COLUMN_TYPES.IMAGE:
                        element = self.createImage(column, mode);
                        break;
                    case Column.COLUMN_TYPES.DOCUMENT:
                        element = self.createDocument(column, mode);
                        break;
                    case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
                        element = self.createLookUpDropDownList(column, mode);
                        break;
                    case Column.COLUMN_TYPES.LOOKUP_LABEL:
                        element = self.createLookUpLabel(column, mode);
                        break;
                    case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                        element = self.createLookUpTextbox(column, mode);
                        break;
                    case Column.COLUMN_TYPES.IDENTITY:
                        element = self.createIdentity(column, mode);
                        break;
                    case Column.COLUMN_TYPES.CHECKBOX_BIT:
                        element = self.createCheckBoxBit(column, mode);
                        break;
                    case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                        element = self.createCheckBoxValue(column, mode);
                        break;
                    case Column.COLUMN_TYPES.DATE:
                        element = self.createDate(column, mode);
                        break;
                    case Column.COLUMN_TYPES.TIME:
                        element = self.createTime(column, mode);
                        break;
                    case Column.COLUMN_TYPES.DATETIME:
                        element = self.createDateTime(column, mode);
                        break;
                    //May be need to add for hyperlink
                }
            }

            if(disabled){
                if(column.type == Column.COLUMN_TYPES.HYPERLINK){
                    element = self.createHyperLinkElement(column, mode);
                }
                else{
                    element = self.createDisabledElement(column, mode);
                }
            }
            else{
                if(column.readOnly){
                    element.prop({
                        readonly: true,
                        tabindex: -1
                    });
                }
                else{
                    element.addClass('editable');
                }
                element.attr('data-column-id', column.id);
                if(column.tooltip){
                    element.attr('title', column.tooltip);
                }
                self.addHtml5Validations(column, element);
            }

            element.attr('data-form_view_mode', mode);

            return element;
        },
        createFormViewElement: function(column, mode){
            var self = this;
            var element;
            if(!column.hasChosen){
                column.hasChosen = {};
                column.isChosenInitialized = {};
            }
            switch(mode){
                case FormView.VIEW_MODE:
                    element = self.createViewElement(column, mode);
                    break;
                case FormView.CREATE_MODE:
                    element = self.createFormElement(column, mode);
                    break;
                case FormView.EDIT_MODE:
                    element = self.createFormElement(column, mode);
                    break;
            }
            return element;
        },
        createHyperlinkViewElement: function(column, mode){
            var self = this;
            var element = document.createElement('div');
            if(column.formView[mode].isHidden){
                return element;
            }

            return element;
        },

        //Simple Data Table Row-------------------------
        createSimpleDataTableRowFormElement: function(column, simpleDataTableRow, mode){
            var self = this;
            var element;
            var disabled = false;
            if(column.disableCondition.disabled){
                disabled = true;
            }
            else if(mode === SimpleDataTableRow.EDIT_MODE && column.disableCondition.disableOnceCreated){
                disabled = true;
            }
            if(!disabled){
                switch (column.type){
                    case Column.COLUMN_TYPES.SINGLELINE:
                        element = self.createSingleLine(column, mode);
                        break;
                    case Column.COLUMN_TYPES.MULTILINE:
                        element = self.createMultiLine(column, mode);
                        break;
                    case Column.COLUMN_TYPES.INTEGER:
                        element = self.createInteger(column, mode);
                        break;
                    case Column.COLUMN_TYPES.DECIMAL:
                        element = self.createDecimal(column, mode);
                        break;
                    case Column.COLUMN_TYPES.CHOICE:
                        element = self.createChoice(column, mode);
                        break;
                    case Column.COLUMN_TYPES.IMAGE:
                        element = self.createImage(column, mode);
                        break;
                    case Column.COLUMN_TYPES.DOCUMENT:
                        element = self.createDocument(column, mode);
                        break;
                    case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
                        element = self.createLookUpDropDownList(column, mode, null, simpleDataTableRow);
                        break;
                    case Column.COLUMN_TYPES.LOOKUP_LABEL:
                        element = self.createLookUpLabel(column, mode);
                        break;
                    case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                        element = self.createLookUpTextbox(column, mode);
                        break;
                    case Column.COLUMN_TYPES.IDENTITY:
                        element = self.createIdentity(column, mode);
                        break;
                    case Column.COLUMN_TYPES.CHECKBOX_BIT:
                        element = self.createCheckBoxBit(column, mode);
                        break;
                    case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                        element = self.createCheckBoxValue(column, mode);
                        break;
                    case Column.COLUMN_TYPES.DATE:
                        element = self.createDate(column, mode);
                        break;
                    case Column.COLUMN_TYPES.TIME:
                        element = self.createTime(column, mode);
                        break;
                    case Column.COLUMN_TYPES.DATETIME:
                        element = self.createDateTime(column, mode);
                        break;
                    //May be need to add for hyperlink
                }
            }

            if(disabled){
                if(column.type == Column.COLUMN_TYPES.HYPERLINK){
                    element = self.createHyperLinkElement(column, mode);
                }
                else{
                    element = self.createDisabledElement(column, mode);
                }
            }
            else{
                element.addClass('simpleDataRowFormElement');
                if(column.readOnly){
                    element.prop({
                        readonly: true,
                        tabindex: -1
                    });
                }
                else{
                    element.addClass('editable');
                }
                if(column.tooltip){
                    element.attr('title', column.tooltip);
                }
                self.addHtml5Validations(column, element);
            }
            simpleDataTableRow.formElements[column.id] = element;

            setTimeout(function(){
                column.bindSimpleDataTableRowElementEvents(simpleDataTableRow);
            }, 0);

            return element;
        },
        createSimpleDataTableRowElement: function(column, simpleDataTableRow, mode){
            var self = this;
            var element;
            if(!column.hasChosen){
                column.hasChosen = {};
                column.isChosenInitialized = {};
            }
            switch(mode){
                case SimpleDataTableRow.VIEW_MODE:
                    element = self.createViewElement(column, simpleDataTableRow, mode);
                    break;
                case SimpleDataTableRow.CREATE_MODE:
                    element = self.createSimpleDataTableRowFormElement(column, simpleDataTableRow, mode);
                    break;
                case SimpleDataTableRow.EDIT_MODE:
                    element = self.createSimpleDataTableRowFormElement(column, simpleDataTableRow, mode);
                    break;
            }
            return element;
        },
        //----------------------------------------------------------------

        createViewElement: function(column, mode){
            var self = this;
            var div = $(document.createElement('div'))
                .addClass('formview-column-display-value');
            var element;

            switch(column.type){
                case Column.COLUMN_TYPES.IMAGE:
                    element = self.createImage(column, mode);
                    break;
                case Column.COLUMN_TYPES.DOCUMENT:
                    element = self.createDocument(column, mode);
                    break;
                case Column.COLUMN_TYPES.HYPERLINK:
                    element = self.createHyperlinkViewElement(column, mode);
                    break;
                case Column.COLUMN_TYPES.CHECKBOX_BIT:
                    element = document.createElement('input');
                    element.type = 'checkbox';
                    element.disabled = true;
                    break;
                default:
                    element = document.createElement('span');
                    break;
            }
            element = $(element).attr({id: mode+'_'+column.id});
            div.append(element);
            return div;
        },
        createGridViewEditInDisplayElement: function(column, dataRow){
            var self = this;
            var element;

            switch (column.type){
                case Column.COLUMN_TYPES.SINGLELINE:
                    element = self.createSingleLine(column, dataRow);
                    break;
                case Column.COLUMN_TYPES.MULTILINE:
                    element = self.createMultiLine(column, dataRow);
                    break;
                case Column.COLUMN_TYPES.INTEGER:
                    element = self.createInteger(column, dataRow);
                    break;
                case Column.COLUMN_TYPES.DECIMAL:
                    element = self.createDecimal(column, dataRow);
                    break;
                case Column.COLUMN_TYPES.CHOICE:
                    element = self.createChoice(column, dataRow);
                    break;
                case Column.COLUMN_TYPES.CHECKBOX_BIT:
                    element = self.createCheckBoxBit(column, dataRow);
                    break;
                case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                    element = self.createCheckBoxValue(column, dataRow);
                    break;
            }
            element.addClass('gridViewEditInDisplayElement');
            element.attr('data-id', column.id);
            return element;
        },
        createHyperLinkElement: function(column, mode){
            var element = $(document.createElement('div'))
                .attr({id: mode+'_'+column.id});
            if(!column.typeSpecific.displayAsSubForm){
                return element;
            }
            if(mode != 'create'){
                return element;
            }
            element.addClass('formView-subForm_'+mode)
                .data('id', column.id);
            setTimeout(function(){
                var dataSource = column.typeSpecific.dataSource;
                var targetSubModule = column.erp.allModules[dataSource.moduleId].subModules[dataSource.subModuleId];
                var config = {columns: {}};
                targetSubModule.forEachColumn(function(column){
                    config.columns[column.id] = column;
                }, function(column){
                    var ret = false;
                    if(!column.formView.create.isHidden){
                        ret = true;
                    }
                    return ret;
                });
                if(!column.simpleDataTables){
                    column.simpleDataTables = {};
                }

                config.mode = mode;
                config.column = column;
                config.subModule = targetSubModule;
                config.formView = targetSubModule.formView;
                config.formViewConfig = targetSubModule.formViewConfig;
                config.parentFormView = column.subModule.formView;
                config.parentSubModule = column.subModule;
//                config.onAdd = function(){
////                    column.subModule.formView.hyperLinkElementClicked(column,element)
//                    column.subModule.formView.addSubFormRow(column, column.simpleDataTables[mode]);
//                }
//                config.onEdit = function(dataRow, tr){
//                    column.subModule.formView.hyperLinkElementClicked(column, dataRow, tr)
//                }
                column.simpleDataTables[mode] = new SimpleDataTable(config, column);
                column.subModule.formView.simpleDataTables[mode][column.id] = column.simpleDataTables[mode];
                element.append(column.simpleDataTables[mode].container)
            }, 0);
            return element;
        },
        createDisabledElement: function(column, type){
            var element;
            if(column.typeSpecific && column.typeSpecific.showImage){
                element = $(document.createElement('img'))
                    .attr({id: type+'_'+column.id, "class": "formView-disabled-column"});
            }
            else{
                element = $(document.createElement('div'))
                    .attr({id: type+'_'+column.id, "class": "formView-disabled-column"});
            }
            return element;
        },
        createSingleLine: function(column, type){
            var element = $(document.createElement('input'));
            var typeStr = 'text';
            if(column.typeSpecific.customInputType && column.typeSpecific.customInputType.isEnabled){
                typeStr = column.typeSpecific.customInputType.customInputType;
            }
            element.attr({
                id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id,
                type: typeStr
            });
            if(column.hint){
                element.attr('placeholder', column.hint);
            }
            var typeSpecific = column.typeSpecific;
//            if(typeSpecific.maxLength){
//                element.attr('maxlength', typeSpecific.maxLength);
//            }
            if(typeSpecific.maxLength || typeSpecific.minLength){
                var patternStart = '.';
                var limitPattern = '';

                if(typeSpecific.minLength){
                    limitPattern += typeSpecific.minLength;
//                    titleStr = titleMinOnly;
                }
                if(typeSpecific.maxLength){
                    if(!limitPattern){
                        limitPattern = '0,'+typeSpecific.maxLength;
//                        titleStr = titleMaxOnly;
                    }
                    else{
                        limitPattern += ','+typeSpecific.maxLength;
//                        titleStr = titleBetween;
                    }
                }
                else{
                    limitPattern +=',';
                }
                element.attr('pattern', patternStart+'{'+ limitPattern +'}');
//                element.attr('error-title', titleStr);
            }
            element.attr('step', typeSpecific.step|| 1);
            if(typeSpecific.setNumeric){
                element.setNumeric(true, { allowPoint: true, allowMinus: true });
            }
            if(typeSpecific.showSuggestionsFromPreviousEntries){
                element.attr('list', 'datalist_'+column._id);
            }
            return element;
        },
        createMultiLine: function(column, type){
            var idToSet = (type.id || type)+'_'+column.id;
            if(column.subModule.randomId){
                idToSet += '_'+column.subModule.randomId;
            }
            var element = $(document.createElement('textarea')).attr({id: idToSet});
            if(column.hint){
                element.attr('placeholder', column.hint);
            }
            var typeSpecific = column.typeSpecific;

            if(typeSpecific.maxLength || typeSpecific.minLength){
                var patternStart = '.';
                var limitPattern = '';

                if(typeSpecific.minLength){
                    limitPattern += typeSpecific.minLength;
//                    titleStr = titleMinOnly;
                }
                if(typeSpecific.maxLength){
                    if(!limitPattern){
                        limitPattern = '0,'+typeSpecific.maxLength;
//                        titleStr = titleMaxOnly;
                    }
                    else{
                        limitPattern += ','+typeSpecific.maxLength;
//                        titleStr = titleBetween;
                    }
                }
                else{
                    limitPattern +=',';
                }
                element.attr('pattern', patternStart+'{'+ limitPattern +'}');
//                element.attr('error-title', titleStr);
            }
            if(typeSpecific.setNumeric){
                element.setNumeric(true, { allowPoint: false, allowMinus: true });
            }
            return element;
        },
        createInteger: function(column, type){
            var element = $(document.createElement('input')).attr({id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id, type: 'number'});
            if(column.hint){
                element.attr('placeholder', column.hint);
            }
            if(column.typeSpecific.range){
                var range = column.typeSpecific.range;
                var pattern = '\\d';
                var limitPattern = '';
                if(range.rangeStart){
                    limitPattern += range.rangeStart;
                }
                if(range.rangeEnd){
                    if(!limitPattern){
                        limitPattern = '0,'+range.rangeEnd;
                    }
                    else{
                        limitPattern += ','+range.rangeEnd;
                    }
                }
                else{
                    limitPattern +=',';
                }
                element.attr('pattern', pattern+'{'+ limitPattern +'}');
                if(range.rangeStart != undefined){
                    element.attr('min', range.rangeStart);
                }
                if(range.rangeEnd != undefined){
                    element.attr('max', range.rangeEnd);
                }
                element.attr('step', range.step|| 1);
            }
            if(column.defaultValue){
                element.val(column.defaultValue);
            }
            element.setNumeric({allowPoint:false});
            return element;
        },
        createDecimal: function(column, type){
            //var pattern = '^[0-9]+(\.[0-9]{1,2})?$';^[1-9]d*(.d*){6000,12000}
            var element = $(document.createElement('input'))
                .attr({
                    id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id,
                    type: 'number'
                });
            if(column.hint){
                element.attr('placeholder', column.hint);
            }
            if(column.typeSpecific.range){
                var range = column.typeSpecific.range;
                var pattern = '^[1-9]d*(.d*)';
                var limitPattern = '';
                if(range.rangeStart){
                    limitPattern += range.rangeStart;
                }
                if(range.rangeEnd){
                    if(!limitPattern){
                        limitPattern = '0,'+range.rangeEnd;
                    }
                    else{
                        limitPattern += ','+range.rangeEnd;
                    }
                }
                else{
                    limitPattern +=',';
                }
                element.attr('pattern', pattern+'{'+ limitPattern +'}');
                if(range.rangeStart != undefined){
                    element.attr('min', range.rangeStart);
                }
                if(range.rangeEnd != undefined){
                    element.attr('max', range.rangeEnd);
                }
                element.attr('step', range.step|| 'any');
            }
            if(column.defaultValue){
                element.val(column.defaultValue);
            }
            element.setNumeric({allowPoint:true});
            return element;
        },
        createChoice: function(column, type){
            var self = this;
            var element = $(document.createElement('select')).attr({id: (type.id || type)+'_'+column.id});
            //self.setSelectOptions(!column.validations.mandatory, element, column.typeSpecific.datalist);
            self.setSelectOptions(true, element, column.typeSpecific.datalist);
            column.hasChosen[type] = true;

            return element;
        },
        createMultipleChoice: function(column, type){
            var self = this;
            var element = $(document.createElement('select')).attr({id: (type.id || type)+'_'+column.id, multiple : 'multiple'});
            //self.setSelectOptions(!column.validations.mandatory, element, column.typeSpecific.datalist);
            self.setSelectOptions(true, element, column.typeSpecific.datalist);
            column.hasChosen[type] = true;

            return element;
        },
        createDocument: function(column, type){
            var self = this;
            if(!column.hasDocument){
                column.hasDocument = {};
            }
            var element = $(document.createElement('div'));
            var inputElement = $(document.createElement('input')).attr({
                "type": "file",
                "class": "documentInputElement"
//                "accept": "*/*"
            }).appendTo(element);
            var documentElement = $(document.createElement('div'))
                .attr({"class": "documentElement"})
                .appendTo(element);
            var btnRemove = $(document.createElement('button'))
                .attr({"class": "btnRemoveDocument"})
                .text('X')
                .appendTo(element);
            var bar = $(document.createElement('progress'))
                .attr('max',100).addClass('progressBar')
                .hide()
                .appendTo(element/*inputElement.parent().parent()*/);
            column.hasDocument[type] = {
                inputElement: inputElement,
                documentElement: documentElement,
                btnRemove: btnRemove
            };
            if(type != 'view'){
                documentElement.on('click', function(){
                    inputElement.click();
                });
                btnRemove.on('click', function(){
                    if(documentElement.get(0).style.backgroundImage != ''){
                        inputElement.data('changed', true);
                        bar.attr('value',0);
                    }
                    documentElement.attr('title','');
                    documentElement.get(0).style.backgroundImage = '';
                    inputElement.val(null);
                });
                inputElement.on('change', function(){
                    var files = inputElement.get(0).files;
                    if(!files.length){
                        btnRemove.addClass('hidden');
                    }
                    else if(files[0].size/1024/1024 > (column.typeSpecific.maxSize || 2)){
                        column.subModule.notifier.showErrorNotification('File size can\'t be more than '+ (column.typeSpecific.maxSize || 2) +' MB');
                        btnRemove.addClass('hidden');
                    }
                    else if(column.typeSpecific.enableDocumentType && column.typeSpecific.enableDocumentType.isEnabled && files[0].type != (column.typeSpecific.enableDocumentType.enableDocumentType.substring(0, column.typeSpecific.enableDocumentType.enableDocumentType.lastIndexOf('.')))){
                        column.subModule.notifier.showErrorNotification('Expected File Must be a ' + column.typeSpecific.enableDocumentType.enableDocumentType.substring(column.typeSpecific.enableDocumentType.enableDocumentType.lastIndexOf('.') + 1));
                        btnRemove.addClass('hidden');
                    }
                    else{
                        btnRemove.removeClass('hidden');
                        inputElement.data('changed', true);
                        var url = column.getDocumentColumnIconURL({
                            value: files[0].name,
                            text: files[0].name
                        });
                        documentElement
                            .attr('title', files[0].name)
                            .css('background-image', 'url('+ url +')');
                        column.subModule.formView.disableSaveButton();
                        column.columnManager.subModule.uploadFile(files[0], {
                            onProgress: function(progress){
                                bar.show();
                                bar.attr('value',progress)
                            },
                            onLoad: function(response){
                                documentElement.data('fs', response);
                                setTimeout(function(){
                                    bar.hide();
                                }, 300);
                                column.subModule.formView.enableSaveButton();
                            }
                        });
                    }
                });
            }
            else{
                var downloadElement = document.createElement('a')
                element.append($(downloadElement));
                documentElement.on('click', function(){
                    if(downloadElement.getAttribute('download')){
                        downloadElement.click();
                    }
                });
                column.hasDocument[type].downloadElement = downloadElement
                bar.hide();
            }

            return element;
        },


        createImage: function(column, type){
            var self = this;
            if(!column.hasImage){
                column.hasImage = {};
            }
            var element = $(document.createElement('div'));
            var inputElement = $(document.createElement('input'))
                .attr({
                    "type": "file",
                    "class": "imageInputElement",
                    "accept": "image/*"
                }).appendTo(element);
            var imgElement = $(document.createElement('div'))
                .attr({"class": "imgElement"}).appendTo(element);
            var btnRemove = $(document.createElement('button'))
                .attr({"class": "btnRemoveImage"})
                .text('X').appendTo(element);
            var bar = $(document.createElement('progress'))
                .attr('max',100).addClass('progressBar')
                .hide()
                .appendTo(element/*inputElement.parent().parent()*/);
            column.hasImage[type] = {
                inputElement: inputElement,
                imgElement: imgElement,
                btnRemove: btnRemove
            };
            if(type != 'view'){
                imgElement.on('click', function(){
                    inputElement.click();
                });
                btnRemove.on('click', function(){
                    if(imgElement.get(0).style.backgroundImage != ''){
                        inputElement.data('changed', true);
                        bar.attr('value',0);
                    }
                    imgElement.attr('title','');
                    imgElement.get(0).style.backgroundImage = '';
                    inputElement.val(null);
                });
                inputElement.on('change', function(){
                    var files = inputElement.get(0).files;
                    if(!files[0]){
                        btnRemove.addClass('hidden');
                    }
                    else if(files[0].size/1024/1024 > (column.typeSpecific.maxSize || 2)){
                        column.subModule.notifier.showErrorNotification('File size can\'t be more than '+ (column.typeSpecific.maxSize || 2) +' MB');
                        btnRemove.addClass('hidden');
                    }
                    else{
                        var reader = new FileReader();
                        btnRemove.removeClass('hidden');
                        reader.onloadend = function () {
                            imgElement.get(0).style.backgroundImage = 'url('+ reader.result+ ')';
                            var image = new Image();

                            image.src = reader.result;

                            image.onload = function() {
                                var dimensionObj = {width : image.width, height: image.height};
                                if(image.width > image.height){
                                    dimensionObj.orientation = 'landscape';
                                }
                                else{
                                    dimensionObj.orientation = 'portrait';
                                }
                                imgElement.data('dimension', dimensionObj);
                            };

                        }
                        inputElement.data('changed', true);
                        imgElement.attr('title', files[0].name);
                        column.subModule.formView.disableSaveButton();
                        reader.readAsDataURL(files[0] );
                        column.columnManager.subModule.uploadFile(files[0], {
                            onProgress: function(progress){
                                bar.show();
                                bar.attr('value',progress)
                            },
                            onLoad: function(response){
                                imgElement.data('fs', response);
                                setTimeout(function(){
                                    bar.hide();
                                }, 300)
                                column.subModule.formView.enableSaveButton();
                            }
                        });
                    }
                });
            }
            else{
                bar.hide();
            }

            return element;
        },


        createLookUpDropDownList: function(column, type, formView, simpleDataTableRow){
            var self = this;
            var element;

            if(column.selectionMode == 'multiple'){
                element = $(document.createElement('select'))
                    .attr({
                        id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id,
                        multiple: true,
                        "data-placeholder": "Choose "+ column.displayName+'...'
                    });
            }
            else{
                if(column.typeSpecific.appearAsRadioButtonGroup){
                    element = $(document.createElement('radiogroup'))
                        .attr({
                            id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id,
                            "data-placeholder": "Choose "+ column.displayName+'...',
                            'class' : 'horizontal'
                        });
                    if(simpleDataTableRow){
                        element.attr('id', element.attr('id') + '_' + simpleDataTableRow.id);
                    }
                }
                else{
                    element = $(document.createElement('select'))
                        .attr({
                            id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id,
                            "data-placeholder": "Choose "+ column.displayName+'...'
                        });
                }
            }


            if(column.hasLocalStorage && column.lookUpDataBackUp.length == 0){
                var lookUpName = column.module.id + '_' +column.subModule.id + '_' + column.id + '_lookUpData'
                column.lookUpDataBackUp = column.erp.lookUpDataConfig[lookUpName] || [];
            }
            var updatedLookUpData = column.lookUpDataBackUp;
            if(self.hasUniqueValueInSubForm){
                updatedLookUpData = self.removeCurrentSelectedValuesFromLookUpData(column.lookUpDataBackUp || [])
            }

            if(column.selectionMode == 'multiple'){
                self.setSelectOptions(true, element, updatedLookUpData || []);
                column.hasChosen[type] = true;
            }
            else{
                if(column.typeSpecific.appearAsRadioButtonGroup){
                    self.setRadioOptions(true, element, updatedLookUpData || []);
                    column.hasChosen[type] = false;
                    element.on('change', 'input[type="radio"]', function () {
                        element.trigger('change');
                    });
                }
                else{
                    self.setSelectOptions(true, element, updatedLookUpData || []);
                    column.hasChosen[type] = true;
                }
            }


            return element;
        },
        createLookUpLabel: function(column, type){
            var element;
            var isImage = false;
            console.log(column.subModule.erp.allModules[column.typeSpecific.dataSource.moduleId]
                .subModules[column.typeSpecific.dataSource.subModuleId].columnManager.columns[column.typeSpecific.dataSource.columnId])
            if( column.subModule.erp.allModules[column.typeSpecific.dataSource.moduleId]
                .subModules[column.typeSpecific.dataSource.subModuleId].columnManager.columns[column.typeSpecific.dataSource.columnId]){
            }
            if(isImage){

            }
            else{
                $(document.createElement('input'))
                    .attr({id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id, type: 'text', disabled: 'disabled'});
            }
            return element;
        },
        createLookUpTextbox: function(column, type){
            if(column.dataType == "nvarchar(4000)")
            {
                var element = $(document.createElement('textarea')).attr({id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id, type: 'text'});
            }
            else{
                var element = $(document.createElement('input')).attr({id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id, type: 'text'});
            }
            if(column.hint){
                element.attr('placeholder', column.hint);
            }
            if(column.typeSpecific.setNumeric){
                element.setNumeric(true, { allowPoint: true, allowMinus: true });
            }
            if(column.typeSpecific.showSuggestionsFromPreviousEntries){
                element.attr('list', 'datalist_'+column._id);
            }
            return element;
        },
        createIdentity: function(column, type){
            var element = $(document.createElement('input')).attr({id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id, type: 'text', disabled: 'disabled'});
            return element;
        },
        createCheckBoxBit: function(column, type){
            var element = $(document.createElement('input')).attr({id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id, type: 'checkbox'});
            return element;
        },
        createCheckBoxValue: function(column, type){
            var element = $(document.createElement('input')).attr({id: column.subModule.id + '_'+  (type.id || type)+'_'+column.id, type: 'checkbox'});
            return element;
        },
        createDate: function(column, type){
            var element = $(document.createElement('input'))
                .attr({id: (type.id || type)+'_'+column.id});
            //
            var dateStr = '';
            var options = {};
            options.showTimepicker = false;
            options.timeOnly = false;
            options.dateFormat = column.typeSpecific.jqueryEditDateFormat;//change here
            options.changeMonth = true;
            options.changeYear= true;
            if(column.typeSpecific.hideDatePart){
                dateStr = 'month';
            }
            else{
                dateStr = 'date';
            }
            element.attr({type: dateStr});
            return element;
        },
        createTime: function(column, type){
            var element = $(document.createElement('input'))
                .attr({id: (type.id || type)+'_'+column.id});
            //
            var timeStr = '';
            var options = {};
            options.hasTimePicker = true;
            options.timeFormat = column.typeSpecific.jqueryEditTimeFormat;
            timeStr = 'time';
            options.timeOnly = true;
            if(column.typeSpecific.hideSeconds){
                element.addClass('hideSeconds');
            }
            if(column.typeSpecific.range){
                if(column.typeSpecific.range.rangeStart != undefined){
                    element.attr('min', column.typeSpecific.range.rangeStart);
                }
                if(column.typeSpecific.range.rangeEnd != undefined){
                    element.attr('max', column.typeSpecific.range.rangeEnd);
                }
            }

            //console.log(options)
            element.attr({type: timeStr})
//            element.datetimepicker(options);
            return element;
        },
        createDateTime: function(column, type){
            var element = $(document.createElement('input')).attr({id: (type.id || type)+'_'+column.id});
            //
            var typeStr = '';
            var timeStr = '',
                dateStr = '';
            var options = {};
            if (column.typeSpecific.hasTimePicker){
                options.hasTimePicker = true;
                options.timeFormat = column.typeSpecific.jqueryEditTimeFormat;
                timeStr = 'time';
            }
            else{
                options.showTimepicker = false;
            }
            if(column.typeSpecific.hasDatePicker){
                options.timeOnly = false;
                options.dateFormat = column.typeSpecific.jqueryEditDateFormat;//change here
                options.changeMonth = true;
                options.changeYear= true;
                dateStr = 'date';
                if(column.typeSpecific.hasTimePicker){
                    timeStr += '-local';
                }
            }
            else{
                options.timeOnly = true;
            }
            typeStr = dateStr + timeStr;
            //console.log(options)
            element.attr({type: typeStr})
//            element.datetimepicker(options);
            return element;
        },
        addHtml5Validations: function(column, element){
            var validations = column.validations;
            if(!validations){
                return self;
            }
            if(validations.mandatory){
                element.prop('required', true);
            }
            return self;
        },

        setRadioOptions: function(addAll, element, arr){
            var self = this;

            var inputElements = [];
            arr.forEach(function(item){

                var inputElement =  document.createElement('input');
                inputElement.type = 'radio';
                inputElement.name = element.attr('id');
                inputElement.id = element.attr('id') + '_' + item.value;
                inputElement.setAttribute('value', item.value);
                // inputElement.setAttribute('display-value', item.value);
                inputElement.setAttribute('data-display-text', item.text);

                if(item.shortText){
                    inputElement.setAttribute('shorttext', item.shortText);
                }
                inputElements.push(inputElement);



                var labelElement =  document.createElement('label');
                labelElement.setAttribute('for', element.attr('id') + '_' + item.value) ;
                labelElement.innerHTML = item.text;
                if(item.shortText){
                    labelElement.setAttribute('shorttext', item.shortText);
                }

                inputElements.push(labelElement);
            });
            if(addAll){

                console.warn('Add adl not supported in Radio button mode right now', element.attr('id'))

                // var labelElement =  document.createElement('label');
                // labelElement.for = element.attr('id') + '_' ;
                // labelElement.innerHTML = 'None';
                // inputElements.unshift(labelElement);
                //
                //
                // var inputElement =  document.createElement('input');
                // inputElement.type = 'radio';
                // inputElement.name = element.attr('id');
                // inputElement.value = '';
                // inputElement.innerHTML = '';
                // inputElements.unshift(inputElement);
            }
            element.empty().append(inputElements);
        },

        setSelectOptions: function(addAll, element, arr){
            var options = [];

            const has_grouping = arr[0]?.group_name != null;

            if(has_grouping){
                const grouped_options = {};
                arr.forEach(item => {
                    const group = item.group_name || 'Ungrouped';
                    if (!grouped_options[group]) {
                        grouped_options[group] = [];
                    }
                    grouped_options[group].push(item);
                });

                Object.keys(grouped_options).forEach(group_name => {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = group_name;

                    grouped_options[group_name].forEach(option_data => {
                        const option = document.createElement('option');
                        option.value = option_data.value;
                        option.textContent = option_data.text;
                        optgroup.appendChild(option);
                    });

                    options.push(optgroup);

                    // select_element.appendChild(optgroup);
                });

            }
            else{
                arr.forEach(function(item){
                    var option =  document.createElement('option');
                    option.value = item.value;
                    option.innerHTML = item.text;

                    //item.shortText = item.text + ' - short' ;

                    if(item.shortText){
                        option.setAttribute('shorttext', item.shortText);
                    }

                    options.push(option);
                });
            }

            if(addAll){
                var option =  document.createElement('option');
                option.value = '';
                option.innerHTML = '';
                options.unshift(option);
            }
            element.empty().append(options);
        }
    },
    gridElementClicked: function(dataRow){
        var self = this;
        switch (self.type){
            case Column.COLUMN_TYPES.BLOG_VIEW:
                self._events.blogViewGridElementClicked(self, dataRow);
                break;
            case Column.COLUMN_TYPES.HYPERLINK:
                self._events.hyperlinkGridElementClicked(self, dataRow);
                break;
            case Column.COLUMN_TYPES.IMAGE:
                var value = self.getImageColumnPublicURL(dataRow);
                var filename = self.getImageColumnFriendlyFilename(dataRow);
                if(value){
                    self.showImage(value,filename);
                }
                break;
        }
        return self;
    },
    gridElementMouseOver: function(dataRow){
        var self = this;
        if(self.tooltipSql && self.tooltipSql.isEnabled){
            self.isMouseOver = true;
            self.mouseOverRowId = dataRow.id;
            self.getToolTipData(dataRow);
        }
        return self;
    },
    gridElementMouseOut: function(dataRow){
        var self = this;
        self.isMouseOver = false;
        self.removeToolTipData();
        return self;
    },
    _events   : {
        blogViewGridElementClicked: function(column, dataRow){
            column.columnManager.subModule.openBlogViewWindow(column, dataRow);
        },
        hyperlinkGridElementClicked: function(column, dataRow){
            column.columnManager.subModule.openChildWindow(column, dataRow);
        }
    },
    _ui       : {
        resetFormViewHolder: function(column, formViewMode){
            var self = this;
            column.formViewElements[formViewMode].closest('.formview-column-holder').css('border', '');
            return self;
        }
    },
    resetFormViewHolder: function(formViewMode){
        var self = this;
        self._ui.resetFormViewHolder(self, formViewMode);
        return self;
    },
    getLookUpDataFromServerViaAjax: function(formViewConfig, getLookUpDataFromServerCallBack){
        var self = this;
        var obj = {};
        obj.columnId = self.id;
        obj.formView = formViewConfig;
        if(!formViewConfig.isForDataSourceMaker){
            obj.dataTimestamp = self.dataTimestamp;
        }

        // var url = '/ajax/' + self.module.id + '/' +self.subModule.id + '/getLookUpDataForColumn/'+ self.id;
        var url = self.subModule.getAjaxUrl('getLookUpDataForColumn', self.id);
//        console.log(self.id, url, obj);
        $.ajax({
            url: url,
            type: 'POST',
            data: obj
        }).done(function(data){
            if(data && data.success){
                if(!formViewConfig.isForDataSourceMaker){
                    self.dataTimestamp = data.timestamp;
                }
            }
            getLookUpDataFromServerCallBack && getLookUpDataFromServerCallBack(data);
        });
        return self;
    },
    getLookUpDataFromServer: function(formViewConfig, getLookUpDataFromServerCallBack){
        var self = this;
        var obj = {};
        obj.columnId = self.id;
        obj.formView = formViewConfig;
        var socket = self.getSocket();
        socket.emit(self.socketEvents.getLookUpDataForColumn, obj);
        socket.once(self.socketEvents.getLookUpDataForColumnDone, function(data){
            getLookUpDataFromServerCallBack(data);
        });
        return self;
    },

    getOptionalGridElement: function(dataRow){
        var self = this;
        var element;
        switch (self.type){
            case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
                if(self.selectionMode !== 'multiple'){
                    element = self.createGridViewShortCutElementForLookUpDropDownList(dataRow);
                }
                break;
            case Column.COLUMN_TYPES.SINGLELINE:
            case Column.COLUMN_TYPES.MULTILINE:
            case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                if(self.typeSpecific.showGoogleMapLink){
                    element = self.createGridViewGoogleMapLink(dataRow);
                }
                break;
        }
        return element;
    },
    createGridViewGoogleMapLink: function(dataRow){
        var self = this;
        var editValue = self.parseEditValue(dataRow);
        var element = $(document.createElement('a'))
            .attr({
                target: "_blank",
                href: "http://maps.google.co.in/maps?q="+ editValue
            });
        element.attr(self.constants.googleMapLink);
        return element;
    },
    createGridViewShortCutElementForLookUpDropDownList: function(dataRow){
        var self = this;
        var displayValue = self.parseDisplayValue(dataRow);
        var editValue = self.parseEditValue(dataRow);

        if(!self.typeSpecific.dataSource){
            return;
        }
        var targetModule = self.erp.allModules[self.typeSpecific.dataSource.moduleId];
        if(!targetModule){
            return;
        }
        var subModule = targetModule.subModules[self.typeSpecific.dataSource.subModuleId];

        var element = $(document.createElement('div'));
        element.attr(self.constants.lookUpViewModeShortCut)
            .text('');
        element.on('click', function(eve){
            subModule.showFormViewInViewMode({
                dataRow: {id:editValue},
                onAfterUpdate: function(data){
                    console.log('updated', data);
                    self.subModule.setDisplayMode();
                }
            });
        });
        return element;
    },

//Simple Data Table Row ----------------------------
    initializeSimpleDataTableRowChosen: function(simpleDataTableRow){
        var self = this;
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        if(self.typeSpecific.allowQuickAdd){
            element.chosen({
                width: "80%",
                allow_single_deselect: !self.validations.mandatory,
                search_contains: true,
                "no_results_text": "No result found. Click to Add",
                onNoResultsClick: function(searchValue){
                    self.simpleDataTableRowQuickAddBtnClicked(searchValue, element, simpleDataTableRow.getFormData(), simpleDataTableRow, true);
                },
                onNoResultsEnter: function(searchValue){
                    self.simpleDataTableRowQuickAddBtnClicked(searchValue, element, simpleDataTableRow.getFormData(), simpleDataTableRow, true);
                }
            });
            var quickAddBtn = self._creation.createQuickAddButton(self);
            element.next().after(quickAddBtn);
            quickAddBtn.on('click', function(){
                self.simpleDataTableRowQuickAddBtnClicked({}, element.next(), simpleDataTableRow.getFormData(), simpleDataTableRow);
            });
        }
        else{
            element.chosen({
                width: "80%",
                search_contains: true,
                allow_single_deselect: !self.validations.mandatory
            });
        }
        return self;
    },

    getSimpleDataTableRowPosition: function(type){
        var self = this;
        return self.simpleDataTableRow[type];
    },
    createSimpleDataTableRowElement: function(type, simpleDataTableRow){
        var self = this;
        var element = self._creation.createSimpleDataTableRowElement(self, simpleDataTableRow, type);
        element.data('simpleDataTableRow', simpleDataTableRow);
        return element;
    },
    bindSimpleDataTableRowElementEvents: function(simpleDataTableRow){
        var self = this;
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);

        if(self.typeSpecific.showTotal){
            //need to do keyup also
            element.on('change', function(){
                simpleDataTableRow.triggerChange();
            });
            element.on('keyup', function(){
                simpleDataTableRow.triggerChange();
            });
        }

//        if(self.validations.unique){
//            element.on('change.'+simpleDataTableRowMode, function(){
//                simpleDataTableRow.validateUnique(self, element);
//            });
//        }
//        switch (simpleDataTableRowMode){
//            case SimpleDataTableRow.CREATE_MODE:
//                if(self.validations.customSql_Create && self.validations.customSql_Create.isEnabled){
//                    element.on('change.'+simpleDataTableRowMode, function(){
//                        simpleDataTableRow.validateCustomSql(self, element);
//                    });
//                }
//                break;
//            case SimpleDataTableRow.EDIT_MODE:
//                if(self.validations.customSql_Update && self.validations.customSql_Update.isEnabled){
//                    element.on('change.'+simpleDataTableRowMode, function(){
//                        simpleDataTableRow.validateCustomSql(self, element);
//                    });
//                }
//        }
        return self;
    },
    getSimpleDataTableRowElementTextValue:function(simpleDataTableRow){
        var self = this;
        var value;
        var element;
        element = self.getSimpleDataTableRowElement(simpleDataTableRow.mode);
        switch (self.type){
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                value = element.prop('checked');
                break
            case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                value = element.prop('checked')? self.typeSpecific.checkedValue: self.typeSpecific.uncheckedValue;
                break
            case Column.COLUMN_TYPES.DATETIME:
                value = element.val();
                if(value.length){
//                    console.log(value)
                    //value = moment(value, self.typeSpecific.momentEditFormat).toJSON();
                }
                break
            case Column.COLUMN_TYPES.IMAGE:
                value = self.hasImage[simpleDataTableRow.mode].imgElement.attr('title');
                break;
            case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
            case Column.COLUMN_TYPES.CHOICE:
                if(self.typeSpecific.appearAsRadioButtonGroup){
                    value = element.find(':checked').attr('data-display-name');
                }
                else{
                    value = element.find(':selected').text();
                }
                break;
            default :
                if(element){
                    value = element.val();
                }
                break;
        }
        return value;
    },
    getSimpleDataTableRowElementValue: function(simpleDataTableRow){
        var self = this;
        var value;
        var element;
        element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        switch (self.type){
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                value = element.prop('checked');
                break
            case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                value = element.prop('checked')? self.typeSpecific.checkedValue: self.typeSpecific.uncheckedValue;
                break
            case Column.COLUMN_TYPES.DATETIME:
                value = element.val();
                if(value.length){
//                    console.log(value)
                    //value = moment(value, self.typeSpecific.momentEditFormat).toJSON();
                }
                break;
            case Column.COLUMN_TYPES.IMAGE:
                value = self.hasImage[simpleDataTableRow.mode].imgElement.attr('title');
                break;
            case Column.COLUMN_TYPES.DOCUMENT:
                value = self.hasDocument[simpleDataTableRow.mode].documentElement.attr('title');
                break;
            case Column.COLUMN_TYPES.DECIMAL:
                value = parseFloat(element.val());
                break;
            case Column.COLUMN_TYPES.INTEGER:
                value = parseInt(element.val());
                break;
            case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                value = element.val();
                if(self.typeSpecific.setNumeric){
                    value = parseFloat(element.val());
                }
                break;
            case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
                if(self.typeSpecific.appearAsRadioButtonGroup){
                    value = element.find(':checked').val();
                }
                else{
                    value = element.val();
                }
                break;
            case Column.COLUMN_TYPES.DATE:
                value = element.val();
                if(self.typeSpecific.hideDatePart && value){
                    value = value + '-01';
                }
                break;
            case Column.COLUMN_TYPES.MULTILINE:
                if(self.allowHTMLEditor){
                    if(tinymce.editors[element.attr('id')].initialized){
                        value = tinymce.editors[element.attr('id')].getContent();
                    }
                    else{
                        value = element.val();
                    }
                }
                else{
                    value = element.val();
                }
                break;
            default :
                if(element){
                    value = element.val();
                }
                break;
        }
        return value;
    },


    getSimpleDataTableRowElement: function(simpleDataTableRow){
        var self = this;
        return simpleDataTableRow.formElements[self.id];
    },
    getSimpleDataTableRowElementHolder: function(simpleDataTableRow){
        var self = this;
        return simpleDataTableRow.formElements[self.id].closest('.simpleDataTableRow-column-holder');
    },
    bindSimpleDataTableRowEvents: function(simpleDataTableRow){
        var self = this;
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        if(self.validations.unique){
            element.on('change.'+simpleDataTableRow.mode, function(){
                simpleDataTableRow.validateUnique(self, element);
            });
        }
        switch (simpleDataTableRow.mode){
            case FormView.CREATE_MODE:
                if(self.validations.customSql_Create && self.validations.customSql_Create.isEnabled){
                    element.on('change.'+simpleDataTableRow.mode, function(){
                        simpleDataTableRow.validateCustomSql(self, element);
                    });
                }
                break;
            case FormView.EDIT_MODE:
                if(self.validations.customSql_Update && self.validations.customSql_Update.isEnabled){
                    element.on('change.'+simpleDataTableRow.mode, function(){
                        simpleDataTableRow.validateCustomSql(self, element);
                    });
                }
        }
        return self;
    },
    getSimpleDataTableRowTextValue:function(simpleDataTableRow){
        var self = this;
        var value;
        var element;
        element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        switch (self.type){
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                value = element.prop('checked');
                break
            case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                value = element.prop('checked')? self.typeSpecific.checkedValue: self.typeSpecific.uncheckedValue;
                break
            case Column.COLUMN_TYPES.DATETIME:
                value = element.val();
                if(value.length){
//                    console.log(value)
                    //value = moment(value, self.typeSpecific.momentEditFormat).toJSON();
                }
                break
            case Column.COLUMN_TYPES.IMAGE:
                value = self.hasImage[formView.mode].imgElement.attr('title');
                break;
            case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
            case Column.COLUMN_TYPES.CHOICE:
                value = element.find(':selected').text()
                break;
            default :
                if(element){
                    value = element.val();
                }
                break;
        }
        return value;
    },
    getSimpleDataTableRowValue: function(simpleDataTableRow){
        var self = this;
        var value;
        var element;
        element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        switch (self.type){
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                value = element.prop('checked');
                break
            case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                value = element.prop('checked')? self.typeSpecific.checkedValue: self.typeSpecific.uncheckedValue;
                break
            case Column.COLUMN_TYPES.DATETIME:
                value = element.val();
                if(value.length){
//                    console.log(value)
                    //value = moment(value, self.typeSpecific.momentEditFormat).toJSON();
                }
                break;
            case Column.COLUMN_TYPES.IMAGE:
                value = self.hasImage[formView.mode].imgElement.attr('title');
                break;
            case Column.COLUMN_TYPES.DECIMAL:
                value = parseFloat(element.val());
                break;
            case Column.COLUMN_TYPES.INTEGER:
                value = parseInt(element.val());
                break;
            case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                value = element.val();
                if(self.typeSpecific.setNumeric){
                    value = parseFloat(element.val());
                }
                break;
            default :
                if(element){
                    value = element.val();
                }
                break;
        }
        return value;
    },
    validateSimpleDataTableRowElement: function(simpleDataTableRow){
        var self = this;
        return self._validation.validateSimpleDataTableRowElement(self, simpleDataTableRow);
    },
    bindSimpleDataTableRowCalculatedValueEvents: function(simpleDataTableRow, mode, childColumn){
        var self = this;
//        simpleDataTableRow.calculatedValueParentChanged(self, options);
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        element.on('change.calculatedvalue', function(eve, options){
            if(!options){
                options = {};
            }
            options.childColumn = childColumn;
            options.mode = mode;
            simpleDataTableRow.calculatedValueParentChanged(self, options);
        });
        element.on('keyup.calculatedvalue', function(){
            element.trigger('change');
        });
    },
    bindSimpleDataTableRowDisableFunctionEvents: function(simpleDataTableRow, mode, childColumn){
        var self = this;
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        element.on('change.disableFunction', function(eve, options){
            if(!options){
                options = {};
            }
            options.childColumn = childColumn;
            options.mode = mode;
            simpleDataTableRow.disableFunctionParentChanged(self, options);
        });
        element.on('keyup.disableFunction', function(){
            element.trigger('change');
        });
    },
    triggerSimpleDataTableRowDisableFunctionChangeEvent: function(simpleDataTableRow){
        var self = this;

        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        element.trigger('change.disableFunction');
        return self;
    },
    bindSimpleDataTableRowChangeEvent: function(simpleDataTableRow){
        var self = this
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        element.on('change.uniqueValueSubForm', function(eve, options){
            if(self.hasUniqueValueInSubForm && element.val() && element.val().length){
                self.uniqueColumnValuesInSubForm[simpleDataTableRow.id] = element.val()
                simpleDataTableRow.refreshUniqueColumnElementsInSubForm(self)
            }
        })
        return self;
    },
    bindSimpleDataTableRowValueCarryForwardChangeEvent: function(simpleDataTableRow){
        var self = this
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        element.on('change.valueCarryForwardInSubForm', function(eve, options){
            self.updateCarryForwardValueInSubForm(element)
        })
        return self;
    },
    bindSimpleDataTableRowAutoPostBackEvents: function(simpleDataTableRow){
        var self = this;
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        element.on('change.autopostback', function(eve, options){
            if(!options){
                options = {};
            }

            options.mode = simpleDataTableRow.mode;
            simpleDataTableRow.lookUpParentChanged(self, options);
        });
    },

    updateCarryForwardValueInSubForm: function(element){
        var self = this;
        self.carryForwardValueInSubForm = element.val();
        return self;
    },
    clearCarryForwardValue: function(){
        var self = this;
        self.carryForwardValueInSubForm = '';
        return self;
    },

    clearUniqueColumnValuesInSubForm: function(value){
        var self = this;
        if(value){
            for(var key in self.uniqueColumnValuesInSubForm){
                if(self.uniqueColumnValuesInSubForm[key] == value){
                    delete self.uniqueColumnValuesInSubForm[key];
                }
            }
        }
        else{
            self.uniqueColumnValuesInSubForm = {};
        }
    },
    removeCurrentSelectedValuesFromLookUpData: function(currentLookUpData){
        var self = this;
        var updatedLookUpData = [];
        currentLookUpData.forEach(function(obj, index){
            var value = obj.value && obj.value.toString();
            if(!self.erp.getKeyFromValueOfObject(value, self.uniqueColumnValuesInSubForm)){
                updatedLookUpData.push(obj)
            }
        });
        return updatedLookUpData;
    },
    enableSimpleDataTableRowElement: function(simpleDataTableRow){
        var self = this;
        self.getSimpleDataTableRowElement(simpleDataTableRow).prop('disabled', false);
        return self;
    },
    disableSimpleDataTableRowElement: function(simpleDataTableRow){
        var self = this;
        self.getSimpleDataTableRowElement(simpleDataTableRow).prop('disabled', true);
        return self;
    },
    isDisabledInSimpleDataTableRow: function(simpleDataTableRow){
        var self = this;
        var ret = false;
        if(self.disableCondition.disabled){
            ret = true;
        }
        else if(self.disableCondition.disableOnceCreated && simpleDataTableRow.mode == FormView.EDIT_MODE){
            ret = true
        }
        return ret;
    },

    triggerSimpleDataTableRowElementChange: function(simpleDataTableRow, options){
        var self = this;
        self.getSimpleDataTableRowElement(simpleDataTableRow).trigger('change', [options]);
        return self;
    },
    setSimpleDataTableRowLookupData: function(data, simpleDataTableRow, options){
        var self = this;
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        options = options || {};
        switch (self.type){
            case Column.COLUMN_TYPES.LOOKUP_LABEL:
                if(data){
                    if(!Array.isArray(data)){
                        if(data[self.id]){
                            data = data[self.id];
                        }
                    }
                }
                self.setSimpleDataTableRowEditValue(null, simpleDataTableRow, data, options);
                break;
            case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                if(options && options.options && options.options.fromCode){
                    return self;
                }
                options.triggerChange = true;
                self.setSimpleDataTableRowEditValue(null, simpleDataTableRow, data, options);
                break;
            default:
                var currentValue = element.val();
                self.lookUpDataBackUp = data;


                if(self.typeSpecific.appearAsRadioButtonGroup){
                    // many of the following options are skipped for radio button for now
                    self._creation.setRadioOptions(true, element, data);
                }
                else {

                    var updatedLookUpData = data;
                    if (!simpleDataTableRow[self.id]) {
                        simpleDataTableRow[self.id] = {};
                    }
                    simpleDataTableRow[self.id].lookUpDataBackUp = updatedLookUpData;
                    if (self.hasUniqueValueInSubForm) {
                        updatedLookUpData = self.removeCurrentSelectedValuesFromLookUpData(data || [])
                    }

                    //bug fix: when adding all elements in sub form

                    self._creation.setSelectOptions(true, element, updatedLookUpData);

                    var realValue = element.data('value');
                    if (realValue) {
                        element.removeData('value');
                        element.val(realValue);
                    }
                    else if (currentValue) {
                        element.val(currentValue);
                    }
                    if (self.typeSpecific.setFirstItemAsSelected) {
                        if (updatedLookUpData && updatedLookUpData[0]) {
                            element.val(updatedLookUpData[0].value);
                            element.data('value', realValue);
                        }
                    }
                    if (self.hasValueCarryForwardInSubForm && self.carryForwardValueInSubForm) {
                        self.setSimpleDataTableRowEditValue(null, simpleDataTableRow, self.carryForwardValueInSubForm)
                    }
                    if (self.hasChosen && self.hasChosen[simpleDataTableRow.mode]) {
                        element.trigger('chosen:updated');
                    }
                    self.triggerSimpleDataTableRowElementChange(simpleDataTableRow);
                    break;

                }

        }
        return self;
    },
    setSimpleDataTableRowDisplayValue: function(dataRow, simpleDataTableRow){
        var self = this;
        var value = self.parseDisplayValue(dataRow);
//        console.log(dataRow)
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);

        value = self.addPrefixAndPostfix(value);

        switch(self.type){
            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                element.find('input[type="checkbox"]').prop('checked',value);
                break;
            case Column.COLUMN_TYPES.IMAGE:
                console.warn('Image column is disabled in SimpleDataTableRow')
//                var imageElements = self.hasImage[mode];
//                imageElements.imgElement.attr('title', value.value || '');
//                imageElements.imgElement.css('background-image', 'url('+self.getImageColumnPublicURL(dataRow)+ ')');
                break;
            default:
                element.html(value);
        }

        return self;
    },
    setSimpleDataTableRowEditValue: function(dataRow, simpleDataTableRow, value, options){
        var self = this;
        var realValue;
        if(!options){
            options = {};
        }
        if(!simpleDataTableRow){
            console.trace();
        }
        var element = self.getSimpleDataTableRowElement(simpleDataTableRow);
        if(value === undefined){
            value = self.parseEditValue(dataRow);
        }

        if(value !== null && typeof(value) ==='object'){

        }
        else{
            realValue = value;
        }

        if(self.isDisabledInSimpleDataTableRow(simpleDataTableRow)){
            switch (self.type){
                case Column.COLUMN_TYPES.LOOKUP_LABEL:
                    var finalValue;
                    if(value === undefined || value === null){
                        finalValue = '';
                    }
                    else{
                        finalValue = value.text;
                    }
                    if(self.typeSpecific.showImage){
                        if(value){
                            var dataRow = {};
                            dataRow[self.typeSpecific.dataSource.columnId] = { value: value.value};
                            var url = self.erp.allModules[self.typeSpecific.dataSource.moduleId]
                                .subModules[self.typeSpecific.dataSource.subModuleId]
                                .columnManager.columns[self.typeSpecific.dataSource.columnId]
                                .getImageColumnPublicURL(value);
                        }
                        element.attr('src', url || '');
                    }
                    else if(self.typeSpecific.formatAsDate && self.typeSpecific.formatAsDate.isEnabled){
                        if(finalValue){
                            element.text(moment(finalValue).format(self.typeSpecific.formatAsDate.formatAsDate));
                        }
                        else{
                            element.text('');
                        }
                    }
                    else{
                        element.text(finalValue);
                    }
                    break;
                case Column.COLUMN_TYPES.DATETIME:
                    if(realValue && realValue.length){
                        var date = new Date(realValue);
                        element.val(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.INTEGER:
                    if(realValue){
                        element.text(realValue.toLocaleString());
                    }
                    else{
                        element.text(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.DECIMAL:
                    if(realValue){
                        element.text(realValue.toLocaleString());
                    }
                    else{
                        element.text(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.CHOICE:
                    if(realValue){
                        var filterdArr = self.typeSpecific.datalist.filter(function(item){
                            return (item.value == realValue)
                        });
                        if(filterdArr.length){
                            realValue = filterdArr[0].text;
                        }
                        else{
                            realValue = '';
                        }
                    }
                    element.text(realValue || '');
                    break;
                case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                    element.text(realValue);
                    element.data('value', realValue);
                    break;
                case Column.COLUMN_TYPES.MULTILINE:
                    if(self.allowHTMLEditor){
                        if(tinymce.editors[element.attr('id')].initialized){
                            tinymce.editors[element.attr('id')].setContent(realValue || '');;
                        }
                        else{
                            element.text(realValue);
                        }
                    }
                    else{
                        element.text(realValue);
                    }
                    break;
                default :
                    element.text(realValue|| '');
                    break;
            }
        }
        else{
            switch (self.type){
                case Column.COLUMN_TYPES.CHECKBOX_BIT:
                case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                    element.prop('checked', realValue);
                    break;
                case Column.COLUMN_TYPES.INTEGER:
                    element.val(realValue);
                    break;
                case Column.COLUMN_TYPES.DECIMAL:
                    if(realValue){
                        if(self.typeSpecific.decimalPoint && self.typeSpecific.decimalPoint.isEnabled){
                            element.val(realValue.toFixed(self.typeSpecific.decimalPoint.decimalPoint));
                        }
                        else{
                            element.val(realValue);
                        }
                    }
                    else{
                        element.val(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.DATE:
                    if(realValue && realValue.length){
                        if(self.typeSpecific.hideDatePart){
                            realValue = moment(realValue).format('YYYY-MM');
                        }
                        else{
                            realValue = moment(realValue).format('YYYY-MM-DD');
                        }
                        element.val(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.TIME:
                    if(realValue && realValue.length){
                        if(realValue.indexOf('-') == -1){
                            realValue = '1970-01-01 ' + realValue;
                        }
                        realValue = moment(realValue).format('HH:mm:ss');
                        element.val(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.DATETIME:
                    if(realValue && realValue.length){
                        element.val(realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.CHOICE:
                    if(!realValue){
                        realValue = '';
                    }
                    element.val(realValue);
                    break;
                case Column.COLUMN_TYPES.IMAGE:
                    var url = self.getImageColumnPublicURL(dataRow);
                    var imageElements = self.hasImage[mode];
                    imageElements.inputElement.removeData('changed').val(null);
                    if(url){
                        imageElements.imgElement.css('background-image', 'url('+url+')').attr('title', realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.DOCUMENT:
                    var downloadURL = self.getDocumentColumnPublicURL(dataRow);
                    var iconURL = self.getDocumentColumnIconURL( dataRow );
                    var documentElements = self.hasDocument[mode];
                    documentElements.inputElement.removeData('changed').val(null);
                    if(downloadURL){
                        documentElements.documentElement
                            .css('background-image', 'url('+iconURL+')')
                            .attr('data-download', downloadURL)
                            .attr('title', realValue);
                    }
                    break;
                case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
                    element.val(realValue);
                    element.data('value', realValue);
                    break;
                case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                    if(value !== null && typeof(value) ==='object'){
                        if(typeof value === 'undefined'){
                            realValue = '';
                        }
                        else{
                            realValue = value.value;
                        }
                    }
                    element.val(realValue);
                    element.data('value', realValue);
                    break;
                case Column.COLUMN_TYPES.MULTILINE:
                    if(self.allowHTMLEditor){
                        if(tinymce.editors[element.attr('id')].initialized){
                            tinymce.editors[element.attr('id')].setContent(realValue);
                        }
                        else{
                            element.val(realValue);
                        }
                    }
                    else{
                        element.val(realValue);
                    }
                    break;
                default :
                    if(!element){
                        console.trace()
                    }
                    element.val(realValue);
                    break;
            }
        }
        if(self.hasChosen && self.hasChosen[simpleDataTableRow.mode]){
            element.trigger('chosen:updated');
        }
        if(options.triggerChange){
            self.triggerSimpleDataTableRowElementChange(simpleDataTableRow)
        }
        return self;
    },
    setSimpleDataTableRowDefaultValue: function(simpleDataTableRow){
        var self = this;
        var getFromParentValue = self.parseGetFromParentCondition(simpleDataTableRow);
        if(getFromParentValue !== null && getFromParentValue !== undefined){
            self.setSimpleDataTableRowEditValue(null, simpleDataTableRow, getFromParentValue);
        }
        else if(self.defaultValue!== undefined && self.defaultValue!== null && self.defaultValue.toString().length){
            switch(self.type){
                case "date":
                    if(self.defaultValue == 'getDate'){
                        self.setSimpleDataTableRowEditValue(null, simpleDataTableRow, moment(new Date()).format('YYYY-MM-DD'));
                    }
                    break;
                case "time":
                case "dateTime":
                    if(self.defaultValue == 'getDate'){
                        self.setSimpleDataTableRowEditValue(null, simpleDataTableRow, moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));
                    }
                    break;
                case "decimal":
                    self.setSimpleDataTableRowEditValue(null, simpleDataTableRow, parseFloat(self.defaultValue));
                    break;
                case "integer":
                    self.setSimpleDataTableRowEditValue(null, simpleDataTableRow, parseInt(self.defaultValue));
                    break;
                default:
                    self.setSimpleDataTableRowEditValue(null, simpleDataTableRow, self.defaultValue);
            }
        }
        return self;
    },
    bindSimpleDataTableRowGetDataFromParentEvents: function(simpleDataTableRow, eventHandler){
        var self = this;
        var currentParentCondition = self.getCurrentSimpleDataTableRowGetDataFromParentCondition(simpleDataTableRow);
        if(!currentParentCondition){
            return self;
        }
        var column = self.erp.allModules[currentParentCondition.moduleId].subModules[currentParentCondition.subModuleId].columnManager.columns[currentParentCondition.columnId];
        var element = column.getFormViewElement(simpleDataTableRow.mode);
        element.on('change.'+ simpleDataTableRow.id, function(){
            eventHandler && eventHandler();
        });
        element.on('keyup.'+ simpleDataTableRow.id, function(){
            eventHandler && eventHandler();
        });
        return self;
    },
    unBindSimpleDataTableRowGetDataFromParentEvents: function(simpleDataTableRow, eventHandler){
        var self = this;
        var currentParentCondition = self.getCurrentSimpleDataTableRowGetDataFromParentCondition(simpleDataTableRow);
        var column = self.erp.allModules[currentParentCondition.moduleId].subModules[currentParentCondition.subModuleId].columnManager.columns[currentParentCondition.columnId];
        var element = column.getFormViewElement(simpleDataTableRow.mode);
        element.off('change.'+ simpleDataTableRow.id);
        return self;
    },
    compareGetDataFromParentConditionToSubModule: function(getDataFromParentCondition, subModule){
        var self = this;
        return subModule.module.id === getDataFromParentCondition.moduleId && subModule.id === getDataFromParentCondition.subModuleId;
    },
    getCurrentSimpleDataTableRowGetDataFromParentCondition: function(simpleDataTableRow){
        var self = this;
        var parentSubModule = simpleDataTableRow.parentSubModule;

        if(self.getFromParentCondition1 && self.getFromParentCondition1.isEnabled && self.compareGetDataFromParentConditionToSubModule(self.getFromParentCondition1.getFromParentCondition1, parentSubModule )){
            return self.getFromParentCondition1.getFromParentCondition1;
        }
        else if(self.getFromParentCondition2 && self.getFromParentCondition2.isEnabled && self.compareGetDataFromParentConditionToSubModule(self.getFromParentCondition2.getFromParentCondition2, parentSubModule )){
            return self.getFromParentCondition2.getFromParentCondition2;
        }
        else if(self.getFromParentCondition3 && self.getFromParentCondition3.isEnabled && self.compareGetDataFromParentConditionToSubModule(self.getFromParentCondition3.getFromParentCondition3, parentSubModule )){
            return self.getFromParentCondition3.getFromParentCondition3;
        }
        else if(self.getFromParentCondition4 && self.getFromParentCondition4.isEnabled && self.compareGetDataFromParentConditionToSubModule(self.getFromParentCondition4.getFromParentCondition4, parentSubModule )){
            return self.getFromParentCondition4.getFromParentCondition4;
        }
        else if(self.getFromParentCondition5 && self.getFromParentCondition5.isEnabled && self.compareGetDataFromParentConditionToSubModule(self.getFromParentCondition5.getFromParentCondition5, parentSubModule )){
            return self.getFromParentCondition5.getFromParentCondition5;
        }
        return null;
    },


    getCurrentFormViewGetDataFromParentCondition: function(parentSubModule){
        var self = this;

        if(self.getFromParentCondition1 && self.getFromParentCondition1.isEnabled && self.compareGetDataFromParentConditionToSubModule(self.getFromParentCondition1.getFromParentCondition1, parentSubModule )){
            return self.getFromParentCondition1.getFromParentCondition1;
        }
        else if(self.getFromParentCondition2 && self.getFromParentCondition2.isEnabled && self.compareGetDataFromParentConditionToSubModule(self.getFromParentCondition2.getFromParentCondition2, parentSubModule )){
            return self.getFromParentCondition2.getFromParentCondition2;
        }
        else if(self.getFromParentCondition3 && self.getFromParentCondition3.isEnabled && self.compareGetDataFromParentConditionToSubModule(self.getFromParentCondition3.getFromParentCondition3, parentSubModule )){
            return self.getFromParentCondition3.getFromParentCondition3;
        }
        else if(self.getFromParentCondition4 && self.getFromParentCondition4.isEnabled && self.compareGetDataFromParentConditionToSubModule(self.getFromParentCondition4.getFromParentCondition4, parentSubModule )){
            return self.getFromParentCondition4.getFromParentCondition4;
        }
        else if(self.getFromParentCondition5 && self.getFromParentCondition5.isEnabled && self.compareGetDataFromParentConditionToSubModule(self.getFromParentCondition5.getFromParentCondition5, parentSubModule )){
            return self.getFromParentCondition5.getFromParentCondition5;
        }
        return null;
    },




    setFormViewImageValue: function(obj, formViewMode){
        var self = this;
        if(obj == null){
            self.hasImage[formViewMode].btnRemove.trigger('click');
        }
        else{
            self.hasImage[formViewMode].inputElement.get(0).files[0] = obj;
            self.hasImage[formViewMode].inputElement.trigger('change');
        }
        return self;
    },
    createHTMLEditor: function(formView){
        var self = this;
        var element = self.getFormViewElement(formView.mode);
        if(self.isHtmlEditorInitialized[formView.mode]){
            return self;
        }
        try{
            self.isHtmlEditorInitialized[formView.mode] = true;
            tinymce.init({
                selector: "#" + self.subModule.id + '_form_view[data-full-id="'+formView.fullId+'"] .formview-'+formView.mode+' #'+ element.attr('id'),
                theme: "modern",
                plugins: [
                    "advlist autolink lists link charmap print preview hr anchor pagebreak",
                    "searchreplace wordcount visualblocks visualchars code fullscreen",
                    "insertdatetime nonbreaking save table contextmenu directionality",
                    "emoticons template paste textcolor colorpicker textpattern"
                ],
                toolbar1: " undo redo | styleselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                toolbar2: "print preview media | forecolor backcolor emoticons",
                image_advtab: true,
                templates: [
                    {title: 'Test template 1', content: 'Test 1'},
                    {title: 'Test template 2', content: 'Test 2'}
                ]
            });
        }
        catch(err){
        }
        return self;
    },
    clearHTMLEditor: function(mode){
        var self = this;
        if(tinymce.editors[self.getFormViewElement(mode).attr('id')].initialized){
            tinymce.editors[self.getFormViewElement(mode).attr('id')].setContent('')
        }
        else{
            self.getFormViewElement(mode).val('');
        }
        return self;
    },


    getQueryBuilderConfiguration: function () {
        var self = this;
        var qConfig = {
            id: self.id,
            label: self.displayName,
            field: self.databaseName,
            type: 'string',
            optgroup : self.subModule.module.displayName + ' - ' + self.subModule.displayName,
            data: {
                moduleId : self.subModule.module.id,
                subModuleId : self.subModule.id,
                columnId : self.id,
                columnType : self.type,
                columnDataType : self.dataType
            }
        };

        switch (self.type){
            case Column.COLUMN_TYPES.SINGLELINE:
            case Column.COLUMN_TYPES.MULTILINE:
                qConfig.type = 'string';
                break;

            case Column.COLUMN_TYPES.INTEGER:
                qConfig.type = 'integer';
                qConfig.input = 'number';
                break;
            case Column.COLUMN_TYPES.DECIMAL:
                qConfig.type = 'double';
                qConfig.input = 'number';
                break;

            // -- multiple choice not supported yet
            case Column.COLUMN_TYPES.CHOICE:
                qConfig.type = 'string';
                qConfig.input = 'select';
                qConfig.values = {};
                self.typeSpecific.datalist.forEach(function (item) {
                    qConfig.values[item.value] = item.text;
                });
                break;

            case Column.COLUMN_TYPES.DATE:
                qConfig.type = 'date';
                qConfig.input = 'text';
                qConfig.plugin = "showCalender";
                break;

            case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                switch(self.dataType){
                    case 'int':
                    case 'integer':
                        qConfig.type = 'integer';
                        qConfig.input = 'number';
                        break;
                    case 'dec':
                    case 'dec(10,2)':
                    case 'dec(12,4)':
                        qConfig.type = 'double';
                        qConfig.input = 'number';
                        break;
                }
                break;


            case Column.COLUMN_TYPES.CHECKBOX_BIT:
                qConfig.type = 'boolean';
                qConfig.input = 'checkbox';
                qConfig.values = [{0: 'No'}, {1: 'Yes'}];
                break;
            case Column.COLUMN_TYPES.CHECKBOX_VALUE:
                qConfig.type = 'string';
                qConfig.input = 'select';
                qConfig.values = [self.typeSpecific.checkedValue, self.typeSpecific.unCheckedValue];
                break;

            case Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST:
                qConfig.type = 'integer';
                qConfig.input = 'select';
                qConfig.values = {'_holder' : '---'};
                qConfig.getDataFromAjax = true;
                break;

        }


        return qConfig;
    }


}

Column.prototype.socketEvents = {
    "getLookUpDataForColumn": "getLookUpDataForColumn",
    "getLookUpDataForColumnDone": "getLookUpDataForColumnDone"
}

