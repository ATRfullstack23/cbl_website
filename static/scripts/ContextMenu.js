/**
 * Created by Akhil Sekharan on 1/16/14.
 */

function ContextMenu(config){
    var self =this;
    self.config =config;
    self.initialize();
}
ContextMenu.prototype={
    constants:{
        container:{
            "class": "contextMenuContainer"
        },
        menuUl:{
            "class": "menuItems",
            "id": "menu_items"
        }
    },
    initialize: function(){
        var self = this;
        self.createElements().bindEvents();
        return self;
    },
    createElements: function(){
        var self = this;
        self.elements = {};
        self.subMenuElements = {}
        self._creation.createElements(self);
        return self;
    },
    _creation:{
        createElements: function(contextMenu){
            var self = this;
            var container = self.createContainer(contextMenu).appendTo(document.body);
            var rightClickMenuUl = self.createRightClickMenu(contextMenu).appendTo(container);
            contextMenu.elements.rightClickMenuUl = rightClickMenuUl;
            contextMenu.elements.container = container;
            contextMenu.container = container;
            return self;
        },
        createContainer: function(contextMenu){
            var container = $(document.createElement('div')).attr(contextMenu.constants.container);
            return container;
        },
        createRightClickMenu: function(contextMenu, options){
            var self = this;
            var ul = $(document.createElement('ul'))
                .attr(contextMenu.constants.menuUl);
            return ul;
        },
        createRightClickMenuOptions: function(contextMenu, options){
            var self = this;
            var arr = [];
            for(var key in options){
                var option = options[key];
                var li = $(document.createElement('li'))
                    .attr('id',option.id).text(option.displayName);
                if(option.hasSubMenu){
                    li.attr('class', 'hasSubMenu');
                    var ul = $(document.createElement('ul'))
                        .attr({class: "subMenu"})
                        .data('parent-id', option.id)
                        .appendTo(li);
                    for(var subKey in option.subMenu){
                        var subOption = option.subMenu[subKey];
                        var subLi = $(document.createElement('li'))
                            .attr({id:subOption.id, class: "subMenuItem"})
                            .text(subOption.displayName)
                            .appendTo(ul)
                    }
                    ul.hide();
                    contextMenu.subMenuElements[option.id] = ul;
                }
                arr.push(li);
            }
            return arr;
        }
    },
    bindEvents: function(){
        var self =this;
        self.contextMenuClickEvent = '';
        $(self.config.targetContainer).on('contextmenu', function (e) {
            self.contextMenuClickEvent = e;
            e.preventDefault();
            e.stopPropagation();
            if(self.disabled){
                return;
            }
            var options = self.validateClick($(e.target), e);
            if(options && Object.keys(options).length){
                self.currentOptions = options;
                self.showContextMenu(e, options);
            }
        });
        self.elements.rightClickMenuUl.on('click', 'li', function(liEvent){
            var li = $(this);
            var option;
            liEvent.stopPropagation();
            console.log()
            if(li.hasClass('subMenuItem')){
                var parentId = li.closest('ul').data('parent-id');
                option = self.currentOptions[parentId].subMenu[li.attr('id')]
            }
            else{
                option = self.currentOptions[li.attr('id')];
            }
            option.onClick.apply(self, [option, self, self.contextMenuClickEvent, liEvent]);
            self.elements.container.hide();
            self.isVisible = false;
        });
        self.elements.rightClickMenuUl.on('mouseenter', 'li.hasSubMenu', function(liEvent){
            var mainMenuItem = $(this);
            liEvent.stopPropagation();
            self.showSubMenu(mainMenuItem)
        });
        self.elements.rightClickMenuUl.on('mouseleave', 'li.hasSubMenu', function(liEvent){
            var mainMenuItem = $(this);
            liEvent.stopPropagation();
            self.hideSubMenu(mainMenuItem);
        });
        return self;
    },

    validateClick: function(element, event){
        var self = this;
        var options = {};
        var actualElement = null;
        for(var i=0; i< self.config.targetAreas.length; i++){
            var targetArea = self.config.targetAreas[i];
            var isCurrent = false;
            actualElement = element.closest(targetArea.selector);
            if(element.is(targetArea.selector)){
                isCurrent = true;
                actualElement = element;
            }
            else if(actualElement.length){
                isCurrent = true;
            }
            if( isCurrent){
                self.currentTargetArea = targetArea;
                self.currentTargetAreaElement = actualElement;
                targetArea.onContextMenu && targetArea.onContextMenu.apply(self, [actualElement, self, element, event]);
                var newOptions = targetArea.getOptions.apply(self, [actualElement, self, element, event]);

                for(var newKey in newOptions){
                    options[newKey] = newOptions[newKey];
                }
                // break;
            }
        }
        return options;
    },
    showContextMenu: function(e, options){
        var self = this;
        if(e.pageX > (window.innerWidth-50)){
            self.elements.container.css('left', (e.pageX-70));
            self.elements.container.css('top', e.pageY);
        }
        else if(e.pageY > (window.innerHeight-100)){
            self.elements.container.css('left', e.pageX);
            self.elements.container.css('top', window.innerHeight-110);
        }
        else{
            self.elements.container.css('left', e.pageX);
            self.elements.container.css('top', e.pageY);
        }
        self.elements.rightClickMenuUl
            .empty()
            .append(self._creation.createRightClickMenuOptions(self, options));
        self.elements.container.show();
        self.startFocusOut();
        return self;
    },
    showSubMenu: function(mainMenuItem){
        var self = this;
        self.subMenuElements[mainMenuItem.attr('id')].css({
            left: self.container.width(),
            display: "inline-block"
        });
        if(self.elements.container.offset().left + self.subMenuElements[mainMenuItem.attr('id')].width() > window.innerWidth - 50){
            self.elements.container.css({
                left: self.elements.container.offset().left - self.subMenuElements[mainMenuItem.attr('id')].width()
            })
        }
        return self;
    },
    hideSubMenu: function(mainMenuItem){
        var self = this;
        self.subMenuElements[mainMenuItem.attr('id')].hide();
        return self;
    },
    startFocusOut:function() {
        var self = this;
        self.isVisible = true;
        $(document).on('mousedown.contextmenu', function (eve) {
            if(self.isVisible){
                if($(eve.target).closest('.'+ self.constants.container.class).length){
                    return;
                }
                self.currentTargetArea.onContextMenuHide && self.currentTargetArea.onContextMenuHide.apply(self, [self.currentTargetAreaElement, self]);
                self.elements.container.hide();
                self.isVisible = false;
            }
        });
    }
};