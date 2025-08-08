/**
 * Created by Akhil Sekharan on 12/17/13.
 */

function ChildWindow(config, parentObject) {
    var self = this;
    self.parentObject = parentObject;
    self.subModule = parentObject;
    self.module = self.subModule.module;
    self.erp = self.module.erp;
    self.config = config;
    self.initialize();
    return self;
}

ChildWindow.prototype = {
    initialize: function () {
        var self = this;
        for (var key in self.config) {
            self[key] = self.config[key];
        }
        if(self.column){
            self.parentItem = self.column;
        }
        else if(self.button){
            self.parentItem = self.button;
        }
        if(!self.preventAnimation){
            // self.boxTwistAnimation = new BoxTwistAnimation();
        }

        // if(self.config.displayMode){
        //     self.displayMode = displayMode;
        // }

        self.createElements();

        if(self.hideControls){
            self.elements.closeButton.hide();
        }

        self.elements.content.append(self.childModule.getElement());
        self.childSubModule = self.childModule.getSelectedSubModule();
        self.childModule.setSelectedSubModule(self.childSubModule, {fromTrigger: true});
        self.childSubModule.parentChildWindow = self;

        self.container.attr('data-child-sub-module-id', self.childSubModule.id);

        self.bindEvents();

        self.contextMenu = new ContextMenu({
            targetContainer: self.container,
            targetAreas: [

                {
                    selector: ".window-buttons",
                    getOptions: function(actualElement, contextMenu, targetElement){
                        var options = {};

                        var option = {};
                        option.displayName = 'Edit Popup Settings';
                        option.id = 'edit_child_window_settings';
                        option.onClick = function(){
                            self.show_edit_child_window_settings_popup();
                        }
                        options[option.id] = option;

                        return options;

                    }
                }

            ]
        }, self);

        return self;
    },
    bindEvents: function () {
        var self = this;
        self.elements.closeButton.on('click', function(){
            self.close();
        });

        self.elements.inlineModeCloseButton.on('click', function(){
            self.close();
        });

        return self;
    },
    get headerMessage(){
        var self = this;
        return self.elements.divReferenceMessage.text();
    },
    set headerMessage(newHeaderMessage){
        var self = this;
        self.elements.divReferenceMessage.text(newHeaderMessage);
    },
    show: function (config) {
        var self = this;
//        self.container.show();
        self.currentConfig = config || {};
        if(config && config.absorbContainer){
            self.currentAbsorbContainer = config.absorbContainer;
        }
        var animObj = {container: self.container, absorbContainer: self.currentAbsorbContainer};

        if(self.preventAnimation){
            self.container.addClass('child_window_visible_without_animation');
            // self.container.show();
        }
        else{
            self.container.addClass('child_window_visible_with_animation');
            // self.boxTwistAnimation.show(animObj, config || {});
        }
        if(self.onShow){
            self.onShow.apply(self, [self]);
        }
		
		var subModule = self.childModule.getSelectedSubModule();
        subModule.clearReceivedData();
        if(config.onBeforeSetDisplayMode){
            subModule.setDynamicCallBack('onBeforeSetDisplayMode', config.onBeforeSetDisplayMode);
        }

        if(self.inlineMode){
            container.addClass('child_window_visible_without_animation');
            // self.container.show();
        }

        self.isOpen = true;

        self.erp.current_active_child_window = self; // need to take care of multiple level child windows

        return self;
    },
    removeQuickViewMode: function(){
        var self = this;
        self.container.removeClass('quickViewMode').addClass('defaultMode')
            .appendTo(document.body);
        self.quickViewMode = false;
        return self;
    },
    setAsQuickViewMode: function(element, options){
        var self = this;
        options = options || {};
        self.container.addClass('quickViewMode').removeClass('defaultMode')
            .appendTo(element);
        if(options.viewOnlyMode){
            self.childSubModule.viewOnlyMode = true;
        }
        else{
            self.childSubModule.viewOnlyMode = false;
        }
        self.quickViewMode = true;
        return self;
    },
    setAsInlineViewMode: function(rowElement, columnElement, options){
        var self = this;
        options = options || {};
        self.container
            .addClass('quickViewMode')
            .addClass('inlineViewMode')
            .removeClass('defaultMode');
        self.elements.content.attr('colspan', rowElement.children().length);

        self.elements.inlineModePointer.css('left', columnElement.offset().left);

        rowElement.after(self.container);
        if(options.viewOnlyMode){
            self.childSubModule.viewOnlyMode = true;
        }
        else{
            self.childSubModule.viewOnlyMode = false;
        }
        self.quickViewMode = true;
        self.inlineMode = true;

        var childWindowsOfRow = rowElement.data('childWindows') || {};
        childWindowsOfRow[self.parentItem.id] = self;
        rowElement.data('childWindows', childWindowsOfRow);

        self.inlineViewModeParentRowElement = rowElement;
        self.inlineViewModeParentColumnElement = columnElement;

        // self.container.show();

        return self;
    },
    setAsDataChanged: function(){
        var self = this;
        self.hasDefaultSubModuleDataChanged = true;
    },
    close: function(){
        var self = this;
        if(self.onClose){
            self.onClose();
        }

        self.hasDefaultSubModuleDataChanged = false;
        self.isOpen = false;

        if( self.inlineViewModeParentRowElement && self.inlineViewModeParentRowElement.data('childWindows')){
            delete self.inlineViewModeParentRowElement.data('childWindows')[self.parentItem.id];
            delete self.inlineViewModeParentRowElement;
            delete self.inlineViewModeParentColumnElement;
        }

        self.hide();
        return self;
    },
    hide: function (config) {
        var self = this;
        if(self.onHide){
            self.onHide(self);
        }

        self.hasDefaultSubModuleDataChanged = false;
        self.isOpen = false;

        if(self.currentConfig && self.currentConfig.onBeforeSetDisplayMode){
            self.childSubModule.removeDynamicCallBack('onBeforeSetDisplayMode');
        }
        delete self.currentConfig;

        if(config && config.absorbContainer){
            self.currentAbsorbContainer = config.absorbContainer;
        }
        var animObj = {container: self.container, absorbContainer: self.currentAbsorbContainer};
        if(self.preventAnimation){
            // self.container.hide();
            self.container.removeClass('child_window_visible_without_animation');
        }
        else{
            // self.boxTwistAnimation.hide(animObj, config || {});
            self.container.addClass('child_window_hiding_with_animation');
            self.container.removeClass('child_window_visible_with_animation');
            setTimeout(()=>{
                self.container.removeClass('child_window_hiding_with_animation');
            }, 300);
        }

        if(self.inlineMode){
            self.container.removeClass('child_window_visible_without_animation');
            // self.container.hide();
        }

        self.erp.current_active_child_window = null; // multiple level, pls take care later

        return self;
    },
    createElements: function () {
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    _creation : {
        createContainer: function(childWindow){
            if(childWindow.initialDisplayMode == 'inline'){
                var div = $(document.createElement('tr'))
                    .attr({"class": "window-container quickViewMode inlineViewMode", id:  childWindow.parentItem.id});
                return div;
            }
            else{
                var div = $(document.createElement('div'))
                    .attr({"class": "window-container defaultMode", id:  childWindow.parentItem.id});
                return div;
            }

        },
        createElements: function (childWindow) {
            var self = this;
            var elements = {};
            childWindow.elements = {};

            const svelte_instance = window.mount_child_window_element(childWindow, childWindow.get_child_window_settings_from_user());

            var container = self.createContainer(childWindow);

            if(childWindow.initialDisplayMode === 'inline'){
                console.error('inline mode is not supported in new ui framework yet', childWindow);
            }

            // var header = self.createHeader(childWindow);
            // if(childWindow.initialDisplayMode != 'inline'){
            //     header.appendTo(container);
            // }

            // var content = self.createContent(childWindow).appendTo(container);
            //
            // var inlineModePointer = self.createInlineModePointer(childWindow).appendTo(container);
            // var inlineModeCloseButton = self.createInlineModeCloseButton(childWindow).appendTo(container);


            childWindow.svelte_element_instance = svelte_instance;

            childWindow.container = svelte_instance.container_element_jquery;
            childWindow.elements.container = svelte_instance.container_element_jquery;

            // childWindow.container = container;
            // childWindow.elements.container = container;

            childWindow.elements.header = childWindow.container.find('header');
            childWindow.elements.content = childWindow.container.find('.window-content');
            childWindow.elements.inlineModePointer = childWindow.container.find('.inline-mode-pointer');
            childWindow.elements.inlineModeCloseButton = childWindow.container.find('.inline-mode-close-button');

            childWindow.elements.divReferenceMessage = childWindow.elements.header.find('.reference-message');
            childWindow.elements.closeButton = childWindow.elements.header.find('.child_window_close_button');
            childWindow.elements.divWindowButtons = childWindow.elements.header.find('.window-buttons');
            return container;
        },
        // createContent: function(childWindow){
        //     var self = this;
        //     if(childWindow.initialDisplayMode == 'inline'){
        //         var div = $(document.createElement('td')).attr({"class": "window-content", id: 'window_content'});
        //         return div;
        //     }
        //     else{
        //         var div = $(document.createElement('div')).attr({"class": "window-content", id: 'window_content'});
        //         return div;
        //     }
        //
        //
        // },
        // createInlineModePointer: function(childWindow){
        //     var self = this;
        //     var div = $(document.createElement('div')).attr({"class": "inline-mode-pointer", id: 'inlineModePointer'});
        //     return div;
        // },
        // createInlineModeCloseButton: function(childWindow){
        //     var self = this;
        //     var div = $(document.createElement('div')).attr({"class": "inline-mode-close-button", id: 'inlineModeCloseButton'}).html('X');
        //     return div;
        // },
        // createHeader: function(childWindow){
        //     var self = this;
        //     var header = $(document.createElement('header'));
        //     var table = $(document.createElement('table')).addClass('hundred-percent');
        //     var tr = document.createElement('tr');
        //     var td1 = document.createElement('td');
        //     // var td2 = document.createElement('td');
        //     var divReferenceMessage =  $(document.createElement('div')).attr({id: 'reference_message', "class": 'reference-message'})
        //         .text('Reference Message');
        //     divReferenceMessage.appendTo(td1);
        //     var divWindowButtons =  $(document.createElement('div')).attr({id: 'window_buttons', "class": 'window-buttons'});
        //     var closeButton = $(document.createElement('button')).attr({title: 'close'})
        //         .html('<span class="fa fa-icon fa-arrow-left"></span>').appendTo(divWindowButtons);
        //     divWindowButtons.prependTo(td1);
        //     tr.appendChild(td1);
        //     // tr.appendChild(td2);
        //     table.append(tr);
        //     header.append(table);
        //
        //     childWindow.elements.divReferenceMessage = divReferenceMessage;
        //     childWindow.elements.closeButton = closeButton;
        //     childWindow.elements.divWindowButtons = divWindowButtons;
        //
        //     return header;
        // }
    },
    _events   : {
    },
    _ui       : {
    }
}