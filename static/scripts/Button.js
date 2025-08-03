/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function Button(config, parentObject) {
    var self = this;
    self.config = config;
    self.buttonManager = parentObject;
    self.parentObject = parentObject;
    self.erp = parentObject.erp;
    self.directActionMenu = self.erp.directActionMenu;
    self.subModule = self.parentObject.subModule;
    self.module = self.subModule.parentObject;
    self.initialize();
    return self;
}


Button.prototype = {
    initialize: function () {
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }
        if(!self.disableCondition){
            self.disableCondition= {};
        }
        if(!self.disableCondition.gridView){
            self.disableCondition.gridView = {};
        }
        if(self.disableCondition.grid){
            self.disableCondition.gridView = self.disableCondition.grid;
        }
        self.grid_view_element_svelte_instance = self._creation.createElement(self, Button.BUTTON_MODES.GRID);
        self.gridViewElement = self.grid_view_element_svelte_instance.container_element_jquery;

        self.form_view_element_svelte_instance = self._creation.createElement(self, Button.BUTTON_MODES.FORM);
        self.formViewElement = self.form_view_element_svelte_instance.container_element_jquery;

        self.bindEvents();
        self.setDeviceTypeDisplayMode();
        if(self.showInDirectAction && self.showInDirectAction.isEnabled){

            var directActionConfig = self.createDirectActionMenuConfig();
            self.directActionMenu.push(directActionConfig);
        }

        self.initializeJavaScriptHandlers();

        return self;
    },
    createDirectActionMenuConfig: function(){
        var self = this;
        var config = {};
        config.id = self.module.id+'_'+self.subModule.id+'_'+self.id;
        config.buttonName = self.showInDirectAction.showInDirectAction;
        config.iconName = self.module.icon;
        config.iconTitle = self.module.displayName;
        config.onClick = function(){
            self.buttonManager.buttonClicked(self, Button.BUTTON_MODES.GRID);
        }
        config.context = self;
        return config;
    },
    setDeviceTypeDisplayMode: function(){
        var self = this;
        switch (self.erp.deviceType){
            case ERP.DEVICE_TYPES.MOBILE:
                self.hideButtonWhenDisabled = self.config.hideButtonWhenDisabled = true;
                break;
            default:
                break;
        }
        return self;
    },
    bindEvents: function () {
        var self = this;
        self.gridViewElement.on('click', function(){
            self.buttonManager.buttonClicked(self, Button.BUTTON_MODES.GRID);
        });
        self.formViewElement.on('click', function(){
            self.buttonManager.buttonClicked(self, Button.BUTTON_MODES.FORM);
        });
        return self;
    },
    isDisabledNow: function(buttonMode){
        var self = this;
        return self.getElement(buttonMode).prop('disabled');
    },
    triggerEvent: function(buttonMode, eventType){
        var self = this;
        if(!self.isDisabledNow(buttonMode)){
            self.getElement(buttonMode).trigger(eventType);
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
        var element;
        switch (type){
            case Button.BUTTON_MODES.GRID:
                element = self.gridViewElement;
                break;
            case Button.BUTTON_MODES.FORM:
                element = self.formViewElement;
                break;
        }
        return element;
    },

    initializeJavaScriptHandlers: function () {
        var self = this;
        self.javascriptHandlers = {};

        if(self.type != Button.BUTTON_TYPES.EXEC_JAVA_SCRIPT){
            return;
        }

        if(self.javascriptCodeMain){
            var str = self.javascriptCodeMain.text;
            str = '\n'+
                '   try{\n' +
                '       '+ str + ' \n    }\n'+
                '   catch(err){\n'+
                '       console.log(\'Error in exec Js Function for '+ self.id +' \');\n'+
                '       asyncCallBack(err)'+
                '   }\n';
            self.javascriptHandlers.javascriptCodeMain = new Function(['data', 'subModule', 'asyncCallBack'], str);
        }

        return self;
    },

    checkParentAdvancedDisableCondition: function(parentDataRow){
        var self = this;
        var disabled = false;
        self.disableCondition.parentAdvanced.parentAdvanced.filterConditions.forEach(function(parentAdvancedDisableCondition){
            if(disabled){
                return;
            }
            disabled = self.checkCondition(parentAdvancedDisableCondition, parentDataRow);
        });

        return disabled;
    },
    checkAdvancedDisableCondition: function(selectedRowsWithValues){
        var self = this;
        var disabled = false;
        selectedRowsWithValues.forEach(function(dataRow){
            if(disabled){
                return;
            }
            self.disableCondition.advanced.advanced.filterConditions.forEach(function(advancedDisableCondition){
                if(disabled){
                    return;
                }
                disabled = self.checkCondition(advancedDisableCondition, dataRow);
            });
        });
        return disabled;
    },
    checkCondition: function (disableCondition, dataRow) {
        var self = this;
        var disabled;
        var columnValue = dataRow[disableCondition.targetColumnId];
        if(typeof (columnValue.value) !== 'undefined' && columnValue.value !== null){
            columnValue = columnValue.value;
        }
        else{
            columnValue = '';
        }
        var filterValue = disableCondition.filterValue.toLowerCase();

        columnValue = columnValue.toString().toLowerCase();
        switch (disableCondition.condition) {
            case "equals":
                disabled = columnValue == filterValue;
                break;
            case "notEquals":
                disabled = columnValue != filterValue;
                break;
        }
        return disabled;
    },
    get disabled(){
        var self = this;
        var ret = false;
        if(self.gridViewElement && self.gridViewElement.prop('disabled')){
            ret = true;
        }
        if(self.formViewElement && self.formViewElement.prop('disabled')){
            ret = true;
        }
        return ret;
    },
    set disabled(isDisabled){
        var self = this;
        self.gridViewElement && self.gridViewElement.prop('disabled', isDisabled);
        self.formViewElement && self.formViewElement.prop('disabled', isDisabled);
        if(self.hideButtonWhenDisabled){
            if(isDisabled){
                self.gridViewElement && self.gridViewElement.hide();
                self.formViewElement && self.formViewElement.hide();
            }
            else{
                self.gridViewElement && self.gridViewElement.show();
                self.formViewElement && self.formViewElement.show();
            }
        }
        return self;
    },
    get unique_id(){
        return `btn_${this.module.id}__${this.subModule.id}__${this.id}`;
    },
    get loading(){
        var self = this;
        var ret = false;
        if(self.gridViewElement && self.gridViewElement.hasClass('loading')){
            ret = true;
        }
        if(self.formViewElement && self.formViewElement.hasClass('loading')){
            ret = true;
        }
        return ret;
    },
    set loading(isDisabled){
        var self = this;
        if(isDisabled){
            self.gridViewElement && self.gridViewElement.addClass('loading');
            self.formViewElement && self.formViewElement.addClass('loading');
        }
        else{
            self.gridViewElement && self.gridViewElement.removeClass('loading');
            self.formViewElement && self.formViewElement.removeClass('loading');
        }
        return self;
    },
    _creation : {
        createElement: function(button, type){


            const svelte_instance = window.mount_button_element(button, button.buttonManager.get_button_settings_from_user(button), type);

            // var element = $(document.createElement('button')).attr({id: type+'_'+button.id})
            //     .attr('data-button_id', button.id)
            //     .data({help: button.helpMessage});
            // if(button.icon && button.icon.originalName){
            //     var imagePath = 'iconsGenerated/' + button.module.id + '/' + button.subModule.id + '/' + button.id + '_' + button.icon.name;
            //     var image = $(document.createElement('img')).attr({class: "buttonImageContainer", src: imagePath})
            //     element.append(image);
            // }
            // element.append(button.displayName)

            return svelte_instance;
        }
    },
    _events   : {
    },
    _ui       : {
    }
}
