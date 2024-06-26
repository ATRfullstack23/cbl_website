/**
 * Created by Jithu on 7/5/14.
 */
function DirectActionMenu(erp){
    var self = this;
    self.initialize();
    self.isEmpty = true;
    self.erp = erp;
    self.directActionButtons = {};
    return self;
}

DirectActionMenu.prototype = {
    constants: {
        container: {
            class: "directActionMenuContainer"
        },
        directActionMenu: {
            class: "directActionMenu"
        },
        directActionUL: {
            class: "directActionUL"
        },
        directMenuArrow: {
            class: "directMenuArrow"
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
        self._creation.createElements(self);
        return self;
    },
    bindEvents: function(){
        var self= this;

        return self;
    },
    _creation: {
        createElements: function(directActionMenu){
            var self = this;
            var container = self.createContainer(directActionMenu);
            directActionMenu.container = $(container);
            return self;
        },
        createContainer: function(directActionMenu){
            var container = document.createElement('div');
            container.className = directActionMenu.constants.container.class;

            var directMenuArrow = document.createElement('div');
            directMenuArrow.className = directActionMenu.constants.directMenuArrow.class;
            container.appendChild(directMenuArrow);

            var directMenu = document.createElement('div');
            directMenu.className = directActionMenu.constants.directActionMenu.class;
            container.appendChild(directMenu);

            var directActionUL = document.createElement('ul');
            directActionUL.className = directActionMenu.constants.directActionUL.class;
            directMenu.appendChild(directActionUL);

            directActionMenu.elements.directActionMenu = directMenu;
            directActionMenu.elements.directActionUL = directActionUL;
            return container;
        }
    },

    length: function(){
        var self = this;
        return Object.keys(self.directActionButtons).length;
    },
    push: function(config){
        var self = this;
        self.isEmpty = false;
        var directActionButton = new DirectActionButton(config);
        directActionButton.container.appendTo(self.elements.directActionUL)
        self.directActionButtons[directActionButton.id] = directActionButton;
        return self;
    },

    setToReArrangeMode: function(buttonManager){
        var self = this;
        buttonManager.contextMenu.disabled = true;
        self.directActionButtonPositionUpdated = false;
        $(self.elements.directMenuTable).sortable({
            stop: function(){
                self.directActionButtonPositionUpdated = true;
            }
        })
        $(self.elements.directMenuTable).sortable('enable');
        self.container.expose();
        $(document.body).one('expose:overlay:removed', function(){
            if(self.directActionButtonPositionUpdated){
                self.saveDirectActionButtonOrder();
            }
            self.setToNormalMode(buttonManager);
        });
        return self;
    },
    saveDirectActionButtonOrder: function(){
        var self = this;
        self.erp.saveUserSetting('direct-action-menu-order', $(self.elements.directMenuTable).sortable('toArray'), function(data){
            if(data.success){
                self.erp.notifier.showSuccessNotification('Direct Action Menu Order Saved Successfully');
            }
        })
        return self;
    },
    setToNormalMode: function(buttonManager){
        var self = this;
        buttonManager.contextMenu.disabled = false;
        $(self.elements.directMenuTable).sortable('disable');
        return self;
    },


    appendDirectActionButtons: function(directActionMenuOrder){
        var self = this;

        if(directActionMenuOrder){
            console.log(self.directActionButtons)
            directActionMenuOrder.forEach(function(element){
                if(self.directActionButtons[element]){
                    self.directActionButtons[element].isAppended = true;
                    self.directActionButtons[element].container.appendTo(self.elements.directMenuTable);
                }
            })
        }

        for(var key in self.directActionButtons){
            var directActionButton = self.directActionButtons[key];
            if(!directActionButton.isAppended){
                directActionButton.isAppended = true;
                directActionButton.container.appendTo(self.elements.directMenuTable);
            }

        }

        return self;
    },

    show: function(){
        var self = this;
        if(!self.isEmpty){
            self.container.show();
            setTimeout(function(){
                self.container.addClass('directActionMenuContainerIn');
            }, 0);
        }
        return self;
    },

    hide: function(){
        var self = this;
        setTimeout(function(){
            self.container.hide();
        }, 300);
        self.container.removeClass('directActionMenuContainerIn');

        return self;
    }
}