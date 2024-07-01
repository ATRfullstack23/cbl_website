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
            self.boxTwistAnimation = new BoxTwistAnimation();
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
            self.container.show();
        }
        else{
            self.boxTwistAnimation.show(animObj, config || {});
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
            self.container.show();
        }

        self.isOpen = true;

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
            self.container.hide();
        }
        else{
            self.boxTwistAnimation.hide(animObj, config || {});
        }

        if(self.inlineMode){
            self.container.hide();
        }

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

            var container = self.createContainer(childWindow);

            var header = self.createHeader(childWindow);
            if(childWindow.initialDisplayMode != 'inline'){
                header.appendTo(container);
            }

            var content = self.createContent(childWindow).appendTo(container);

            var inlineModePointer = self.createInlineModePointer(childWindow).appendTo(container);
            var inlineModeCloseButton = self.createInlineModeCloseButton(childWindow).appendTo(container);



            childWindow.container = container;
            childWindow.elements.container = container;
            childWindow.elements.header = header;
            childWindow.elements.content = content;
            childWindow.elements.inlineModePointer = inlineModePointer;
            childWindow.elements.inlineModeCloseButton = inlineModeCloseButton;

            return container;
        },
        createContent: function(childWindow){
            var self = this;
            if(childWindow.initialDisplayMode == 'inline'){
                var div = $(document.createElement('td')).attr({"class": "window-content", id: 'window_content'});
                return div;
            }
            else{
                var div = $(document.createElement('div')).attr({"class": "window-content", id: 'window_content'});
                return div;
            }


        },
        createInlineModePointer: function(childWindow){
            var self = this;
            var div = $(document.createElement('div')).attr({"class": "inline-mode-pointer", id: 'inlineModePointer'});
            return div;
        },
        createInlineModeCloseButton: function(childWindow){
            var self = this;
            var div = $(document.createElement('div')).attr({"class": "inline-mode-close-button", id: 'inlineModeCloseButton'}).html('X');
            return div;
        },
        createHeader: function(childWindow){
            var self = this;
            var header = $(document.createElement('header'));
            var table = $(document.createElement('table')).addClass('hundred-percent');
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var divReferenceMessage =  $(document.createElement('div')).attr({id: 'reference_message', "class": 'reference-message'})
                .text('Reference Message');
            divReferenceMessage.appendTo(td1);
            var divWindowButtons =  $(document.createElement('div')).attr({id: 'window_buttons', "class": 'window-buttons'});
            var closeButton = $(document.createElement('button')).attr({title: 'close'}).html('X').appendTo(divWindowButtons);
            divWindowButtons.appendTo(td2);
            tr.appendChild(td1);
            tr.appendChild(td2);
            table.append(tr);
            header.append(table);

            childWindow.elements.divReferenceMessage = divReferenceMessage;
            childWindow.elements.closeButton = closeButton;
            childWindow.elements.divWindowButtons = divWindowButtons;

            return header;
        }
    },
    _events   : {
    },
    _ui       : {
    }
}