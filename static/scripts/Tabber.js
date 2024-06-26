/**
 * User: Akhil Sekharan
 * Timestamp: 7/5/1311:40 PM
 */


function Tabber(config, parentObject){
    var self = this;
    self.parentObject = parentObject;
    self.config = config;
    self.initialize();
    return self;
}

Tabber.prototype = {
    initialize: function(){
        var self = this;
        self.createElements()
            .bindEvents();
        if(self.config.classToAdd){
            self.container.addClass(self.config.classToAdd);
        }
        self.setFirstTabAsSelected(true);
        if(self.config.hiddenIfOnlyOne){
            if(self.config.tabs.length <= 1){
                self.hide();
            }
        }
        self.tabs = self.config.tabs;
        return self;
    },
    show: function(){
        var self = this;
        self.container.show();
        return self;
    },
    clearNotificationCount: function(tabId){
        var self = this;
        if(tabId){
            self.elements.tabsContainer.children('#'+tabId)
                .removeAttr('data-notification-count').removeClass('hasNotification');
        }
        else{
            self.elements.tabsContainer.children()
                .removeAttr('data-notification-count').removeClass('hasNotification');
        }

        return self;
    },
    setNotificationCount: function(tabId, count){
        var self = this;
        self.elements.tabsContainer.children('#'+tabId)
            .attr('data-notification-count', count).addClass('hasNotification');
        return self;
    },
    hide: function(){
        var self = this;
        self.container.hide();
        return self;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);
        self.config.targetContainer.children().addClass('hidden');

        if(self.config.setFirstItemAsSticky && self.config.tabs.length>2){
            self.stickyTab = self.config.tabs.shift();
            self.stickyTab.isStickyTab = true;
            self.stickyTab.tabElement.addClass("stickyTab");
            self.config.targetContainer.children()
                .filter('[id="'+self.stickyTab.id+'"]')
                .removeClass('hidden')
                .addClass(self.config.classToAdd)
                .appendTo(self.config.stickTabContentContainer);

        }

        return self;
    },
    bindEvents: function(){
        var self = this;
        self.elements.tabsContainer.on('click', 'li', function(){
            self.setSelectedTab(this.id);
        });
        return self;
    },
    get selectedTabId(){
        var self = this;
        return self.selectedTab && self.selectedTab.attr('id');
    },
    setFirstTabAsSelected: function(preventEvent){
        var self = this;
        self.setSelectedTab(self.config.tabs[0].id, preventEvent);
        return self;
    },
    setPreviousTabAsSelected: function(){
        var self = this;
        self.selectedTab.prev().click();
        return self;
    },
    setNextTabAsSelected: function(){
        var self = this;
        self.selectedTab.next().click();
        return self;
    },
    setSelectedTab: function(tabId, preventEvent){
        var self = this;
        self.selectedTab = self.elements.tabsContainer.children()
            .removeClass('tab-selected')
            .filter('[id="'+tabId+'"]')
            .addClass('tab-selected');
        self.config.targetContainer.children()
            .addClass('hidden')
            .filter('[id="'+tabId+'"]')
            .removeClass('hidden').find(self.config.elementToFocusAfterChange).eq(0).focus();
        if(!preventEvent){
            self.config.onAfterChange && self.config.onAfterChange(tabId);
        }
        return self;
    },
    _creation:{
        createContainer: function(tabber){
            var div = $(document.createElement('div'))
                .attr({id: tabber.id})
                .addClass('tabber-container');
            return div;
        },
        createElements: function(tabber){
            var self = this;
            var elements = {};
            tabber.elements = elements;

            var container = self.createContainer(tabber);
            elements.container = container;
            tabber.container = container;

            var tabElements  = document.createElement('ul');
            tabElements.className = 'tabber-tab-elements';

            tabber.config.tabs.forEach(function(tab){
                tabElements.appendChild(self.createTabElement(tab));
            });



            container.append(tabElements);

            tabber.elements.tabsContainer = $(tabElements);

            return container;
        },
        createTabElement: function(tab){
            var self = this;
            var li = document.createElement('li');
            li.className = 'tab-element';
            li.innerHTML = tab.displayName;
            li.value = tab.id;
            li.id = tab.id;
            tab.tabElement = $(li);
            return li;
        }
    }
}
