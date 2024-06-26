
function DashboardManager(config, parentObject) {
    var self = this;
    self.parentObject = parentObject;
    self.erp = parentObject;
    self.socket = self.erp.socket;
    self.config = config;
    self.initialize();
    return self;
}

DashboardManager.prototype = {
    initialize: function () {
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }

        self.notifier = new Notifier({
            container: $(document.body)
        });

        if(self.erp.isMobileDevice){
            return;
        }

        self.createElements();
        self.initializeGroups();
        self.initializeItems();

        self.bindEvents();
        self.initializeContextMenu();

        self.setSelectedGroup('1000000', true);
        window._dm = self;
        return self;
    },
    bindEvents: function () {
        var self = this;
        self.eventHandlers = {};
        // self.eventHandlers[DashboardManager.EVENTS.notificationCountReceived] = {};

        self.elements.btnReArrangeDashboardItems.on('click', function(){
            if(self.isInReorderMode){
                self.setToNormalMode();
            }
            else{
                self.setToReorderMode();
            }
        });

        self.elements.btnAddNewDashboardItem.on('click', function () {
            self.showCreateDashboardItemWindow();
        });
        return self;
    },

    initializeContextMenu: function(){
      var self = this;
        var targetAreas = [
            {
                selector: "[data-configurable]",
                getOptions: function(actualElement, contextMenu, targetElement){
                    var options = {};

                    var option = {};
                    option.displayName = actualElement.attr('data-configure-message');
                    option.id = actualElement.attr('data-configurable');
                    option.data = {
                        dashboardItemId : actualElement.closest('.dashboardItem').attr('data-id')
                    };
                    option.onClick = function(){
                        self.items[option.data.dashboardItemId].handleConfigureElementClickEvent(option.id);
                    }
                    options[option.id] = option;


                    return options;
                }
            },
            {
                selector: ".dashboardItemHeader",
                getOptions: function(actualElement, contextMenu, targetElement){
                    var options = {};

                    var option = {};
                    option.displayName = 'Edit Display Name';
                    option.id = 'editDashboardItemDisplayName';
                    option.data = {
                        dashboardItemId : actualElement.closest('.dashboardItem').attr('data-id')
                    };
                    option.onClick = function(){
                        self.showEditDashboardItemWindow(self.items[option.data.dashboardItemId]);
                    }
                    options[option.id] = option;


                    option = {};
                    option.displayName = 'Delete Item';
                    option.id = 'deleteDashboardItem';
                    option.data = {
                        dashboardItemId :actualElement.closest('.dashboardItem').attr('data-id')
                    };
                    option.onClick = function(){
                        self.confirmAndDeleteDashboardItem(self.items[option.data.dashboardItemId]);
                    }
                    options[option.id] = option;


                    return options;
                }
            }
        ];

        if(DashboardItem_StatusCard.CONTEXT_MENU_TARGET_AREAS){
            targetAreas = targetAreas.concat(DashboardItem_StatusCard.CONTEXT_MENU_TARGET_AREAS);
        }
        if(DashboardItem_Table.CONTEXT_MENU_TARGET_AREAS){
            targetAreas = targetAreas.concat(DashboardItem_Table.CONTEXT_MENU_TARGET_AREAS);
        }
        if(DashboardItem_List.CONTEXT_MENU_TARGET_AREAS){
            targetAreas = targetAreas.concat(DashboardItem_List.CONTEXT_MENU_TARGET_AREAS);
        }

        self.contextMenu = new ContextMenu({
            targetContainer: self.container,
            targetAreas: targetAreas
        }, self);
    },
    isEmpty: function(){
        var self = this;
        return Object.keys(self.items).length == 0;
    },


    setToNormalMode: function(){
        var self = this;
        self.isInReorderMode = false;
        self.getSelectedGroup().container.sortable('destroy');

        self.elements.btnReArrangeDashboardItems.text('Re Arrange');
        self.elements.btnAddNewDashboardItem.removeClass('hidden');

        if(self.isCurrentOrderChanged){
            self.saveOrderOfDashboardItems();
        }

        self.isCurrentOrderChanged = false;
        $('.expose-overlay').remove();


        return self;
    },
    saveOrderOfDashboardItems: function(){
        var self = this;
        var positionObj = {};
        var index = 0;
        self.getSelectedGroup().container.children().each(function () {
            positionObj[ $(this).attr('data-id') ] = index;
            index++;
        });

        // console.log('pos ', positionObj);

        var url = DashboardManager.API_ENDPOINTS.UPDATE_DASHBOARD_ITEMS_ORDER;
        // self.showLoadingOverlay();

        $.ajax({
            url: url,
            type: 'POST',
            data: {
                _source : JSON.stringify({
                    config: {
                        positionInfo : positionObj
                    }
                })
            }
        }).always(function(data, status){

            console.log('done update order by index to server ', data, status);

            // self.hideLoadingOverlay();

        });
        return self;
    },
    setToReorderMode: function(){
        var self = this;
        self.isInReorderMode = true;
        // self.container.css('min-height', (window.innerHeight-100)+'px');

        var group = self.getSelectedGroup();
        group.container.sortable({
            update : function () {
                self.isCurrentOrderChanged = true;
            }
        });

        self.elements.dashboardContentContainer.expose({
            static : true
        });

        self.elements.btnReArrangeDashboardItems.text('Save Order');
        self.elements.btnAddNewDashboardItem.addClass('hidden');

        return self;
    },


    initializeSingleDashboardItem: function (dashboardItemRawInfo) {
        var self = this;

        var dashboardItem;

        switch (dashboardItemRawInfo.type){
            case 'table':
                dashboardItem = new DashboardItem_Table(dashboardItemRawInfo, self);
                break;
            case 'list':
                dashboardItem = new DashboardItem_List(dashboardItemRawInfo, self);
                break;
            case 'statusCard':
                dashboardItem = new DashboardItem_StatusCard(dashboardItemRawInfo, self);
                break;
        }

        var targetContainer = self.groups[dashboardItem.config.parentGroup].container;

        if(dashboardItem.config.orderByIndex){
            if(dashboardItem.config.orderByIndex === 0) {
                targetContainer
                    .prepend(dashboardItem.container);
                // console.log(' === appending ' + dashboardItem.displayName + ' @ 0')
            }
            else{
                if(dashboardItem.config.orderByIndex > targetContainer.children().length){
                    targetContainer
                        .append(dashboardItem.container);
                    // console.log(' === appending ' + dashboardItem.config.displayName + ' @ ' + (dashboardItem.config.orderByIndex - 1));
                }
                else{
                    targetContainer
                        .children()
                        .eq(dashboardItem.config.orderByIndex - 1)
                        .after(dashboardItem.container);
                    // console.log(' === appending ' + dashboardItem.config.displayName + ' @ ' + (dashboardItem.config.orderByIndex - 1));
                }
            }
        }
        else{
            dashboardItem.container.appendTo(targetContainer);
        }

        self.items[dashboardItemRawInfo.id] = dashboardItem;

        return dashboardItem;
    },
    initializeItems: function () {
        var self = this;

        var indexesArr = [];
        for(var key in self.items) {
            var index = self.items[key].orderByIndex;
            if(index === undefined || index === null){
                index = 100;
            }
            indexesArr.push({
                key : key,
                orderByIndex : index
            });

            // var dashboardItem;
            //
            // switch (self.items[key].type){
            //     case 'table':
            //         dashboardItem = new DashboardItem_Table(self.items[key], self);
            //         break;
            //     case 'list':
            //         dashboardItem = new DashboardItem_List(self.items[key], self);
            //         break;
            //     case 'statusCard':
            //         dashboardItem = new DashboardItem_StatusCard(self.items[key], self);
            //         break;
            // }
            //
            // dashboardItem.container.appendTo(self.groups[dashboardItem.config.parentGroup].container);
            //
            // self.items[key] = dashboardItem;
        }


        indexesArr.sort(function (a, b) {
            return a.orderByIndex - b.orderByIndex;
        }).forEach(function (obj) {
            // console.log('sorted : ' + self.items[obj.key].displayName + ' @ ' + obj.orderByIndex );
            self.initializeSingleDashboardItem(self.items[obj.key]);
        });

        return self;
    },
    initializeGroups: function () {
        var self = this;


        for(var key in self.groups) {

            var group = self.groups[key];
            // group.elements = {};
            group.container = $(DashboardManager.Templates.dashboardGroupElementTemplate(group ));

            group.container.appendTo(self.elements.dashboardContents);
        }



        self.groupsNavigationManager = new Navigation({
            id : 'groupsNavigationManager',
            options: self.groups,
            deviceType: self.erp.deviceType,
            contentsContainer: self.elements.dashboardContents,
            parentContainers: {
                "accordionLeft": self.elements.container,
            },
            displayMode: 'accordionLeft',
            onChange: function(group){
                self.setSelectedGroup(group);
            }
        }, self);


        return self;
    },
    getSelectedGroup: function () {
        var self = this;
        return self.selectedGroup;
    },
    setSelectedGroup: function (newGroupId, isFromTrigger) {
        var self = this;
        console.log('set group : ' + newGroupId);

        if(isFromTrigger){
            self.groupsNavigationManager.setValue(newGroupId, true);
        }

        self.selectedGroup = self.groups[newGroupId];
        self.elements.dashboardContents.children('.dashboardGroupElement.visible')
            .removeClass('visible');
        self.selectedGroup.container.addClass('visible');

        return self;
    },

    createElements: function () {
        var self = this;



        var elements = {};
        elements.container = self.config.container;

        var container = elements.container;

        var dashboardContentContainer = container.find('#dashboardContentContainer');
        elements.dashboardContentContainer = dashboardContentContainer;

        var dashboardContents = container.find('#dashboardContents');
        elements.dashboardContents = dashboardContents;

        var dashboardButtons = container.find('#dashboardButtons');
        elements.dashboardButtons = dashboardButtons;

        elements.btnAddNewDashboardItem = dashboardButtons.find('#btnAddNewDashboardItem');
        elements.btnReArrangeDashboardItems = dashboardButtons.find('#btnReArrangeDashboardItems');

        self.elements = elements;
        self.container = container;

        return container;
    },


    forEachItem: function(eachFunction, filterFunction){
        var self = this;
        var count = 0;
        for(var key in self.items){
            var item = self.items[key];
            if(filterFunction){
                if(filterFunction(item)){
                    eachFunction.apply(item, [item, count++]);
                }
            }
            else{
                eachFunction.apply(item, [item, count++]);
            }
        }
        return self;
    },
    forEachGroup: function(eachFunction, filterFunction){
        var self = this;
        var count = 0;
        for(var key in self.groups){
            var group = self.groups[key];
            if(filterFunction){
                if(filterFunction(group)){
                    eachFunction.apply(group, [group, count++]);
                }
            }
            else{
                eachFunction.apply(group, [group, count++]);
            }
        }
        return self;
    },




    confirmAndDeleteDashboardItem : function (dashboardItem) {
        var self = this;

        if(!confirm('Are you sure to delete ' + dashboardItem.displayName + '. This action is irreversible.')){
            return;
        }

        var url = DashboardManager.API_ENDPOINTS.DELETE_DASHBOARD_ITEM;
        dashboardItem.showLoadingOverlay();

        $.ajax({
            url: url,
            type: 'POST',
            data: {
                _source : JSON.stringify({
                    config: {
                        id : dashboardItem.id,
                    }
                })
            }
        }).always(function(response, status){

            console.log('done delete dashboard item in server ', response, status);

            dashboardItem.hideLoadingOverlay();

            delete self.items[dashboardItem.id];
            delete self.config.items[dashboardItem.id];
            dashboardItem.remove();

        });


        return self;
    },
    showCreateDashboardItemWindow: function (parentGroupId) {
        var self = this;
        if(!self.createOrEditDashboardItemComponent){
            self.initializeCreateOrEditDashboardItemComponent();
        }

        if(parentGroupId){
            self.createOrEditDashboardItemComponent.show(null, parentGroupId);
        }
        else{
            self.createOrEditDashboardItemComponent.show();
        }
    },

    showEditDashboardItemWindow: function (dashboardItem) {
        var self = this;
        if(!self.createOrEditDashboardItemComponent){
            self.initializeCreateOrEditDashboardItemComponent();
        }
        self.createOrEditDashboardItemComponent.show(dashboardItem);
    },

    initializeCreateOrEditDashboardItemComponent: function () {
        var self = this;
        self.createOrEditDashboardItemComponent = new CreateOrEditDashboardItemComponent({
            onNewDashboardItemCreated : function (newDashboardItemInfo) {
                console.log('onNewDashboardItemCreated createOrEditDashboardItemComponent', newDashboardItemInfo);

                self.items[newDashboardItemInfo.id] = newDashboardItemInfo;
                self.initializeSingleDashboardItem(newDashboardItemInfo);
                // loadLatestReportsFromServer(newReportInfo.Id_Report);
            },
            onDashboardItemUpdated : function (updatedConfig) {

                var actualDashboardItem = self.items[updatedConfig.id];

                actualDashboardItem.config.displayName = updatedConfig.displayName;
                actualDashboardItem.config.description = updatedConfig.description;
                actualDashboardItem.setHeaderDisplayName(updatedConfig.displayName);
                // need to update description as well

                console.log('onDashboardItemUpdated createOrEditDashboardItemComponent', updatedConfig);

                // loadLatestReportsFromServer(reportInfo.Id_Report);
            }
        }, self);
    },





    onSetAsCurrentMainView: function () {
        var self = this;

        if(self.erp.isSocketConnected){
            self.refreshItemsDataFromServer(); // -- need to reset items in selected group only
        }


        return self;
    },
    // resetAllItems: function(){
    //     var self = this;
    //     var obj = {};
    //     self.forEachItem(function(item){
    //         item.refreshDataFromServer && item.refreshDataFromServer();
    //     });
    //     return self;
    // },
    refreshItemsDataFromServer: function(){
        var self = this;
        self.forEachItem(function(item){
            item.refreshDataFromServer && item.refreshDataFromServer();
        });
        return self;
    },


    show      : function () {
        var self = this;
        self.container.removeClass('hidden');
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
    getSocket: function(){
        var self = this;
        return self.erp.socket;
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
    }

};


DashboardManager.API_ENDPOINTS = {
    ROOT : "/ajax/dashboard"
}
DashboardManager.API_ENDPOINTS.UPDATE_DASHBOARD_ITEM_INFO = DashboardManager.API_ENDPOINTS.ROOT +  "/updateDashboardItemInfo";
DashboardManager.API_ENDPOINTS.CREATE_DASHBOARD_ITEM = DashboardManager.API_ENDPOINTS.ROOT + "/createDashboardItem";
DashboardManager.API_ENDPOINTS.DELETE_DASHBOARD_ITEM = DashboardManager.API_ENDPOINTS.ROOT + "/deleteDashboardItem";

DashboardManager.API_ENDPOINTS.GET_ITEM_DATA = DashboardManager.API_ENDPOINTS.ROOT + "/getItemData";
DashboardManager.API_ENDPOINTS.UPDATE_DASHBOARD_ITEM_CONFIGURATION = DashboardManager.API_ENDPOINTS.ROOT + "/updateDashboardItemConfiguration";
DashboardManager.API_ENDPOINTS.UPDATE_DASHBOARD_ITEMS_ORDER = DashboardManager.API_ENDPOINTS.ROOT + "/updateDashboardItemsOrder";

DashboardManager.Templates = {
    dashboardGroupElementTemplate : Handlebars.compile ($("#dashboardGroupElementTemplate").html()),
}