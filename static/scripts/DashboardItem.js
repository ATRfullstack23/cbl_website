
function DashboardItem(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.dashboardManager = parentObject;
    self.erp = parentObject.erp;

    // self.initialize();
    return self;
}


DashboardItem.prototype = {
    initialize: function () {
        var self = this;
        self.id = self.config.id || self.getId();
        self.displayName = self.config.displayName || self.getId();

        self.elements = {};
        self.elements.container = self.config.container;

        self.createElements();
        self.bindEvents();

        
        return self;
    },
    createElements: function () {
        var self = this;
        var container = $(DashboardItem.Templates.dashboardItemElementTemplate (self.config));
        container.addClass(self.getItemTypeName());

        self.container = container;
        self.elements.container = container;
        self.elements.dashboardItemContent = container.find('.dashboardItemContent');
        self.elements.dashboardItemHeader = container.find('.dashboardItemHeader');
        self.elements.headerDisplayName = container.find('.headerDisplayName');
        self.elements.dashboardItemInlineButtons = container.find('.dashboardItemInlineButtons');
        self.elements.editDashboardItem = container.find('.editDashboardItem');
        self.elements.showDashboardItemContextMenu = container.find('.showDashboardItemContextMenu');

        self.setHeaderDisplayName(self.getHeaderDisplayName())

    },

    bindEvents: function () {
        var self = this;
        // self.elements.container.on('click', '.popupCloseButton', function (eve) {
        //     self.cancel();
        // });
        // self.elements.buttonPanel.on('click', 'button[data-id]', function (eve) {
        //     var element = $(this);
        //     self.handleOnButtonClickEvent(element);
        // });


        self.elements.itemMainElement.on('click', '[data-not-configured]', function () {
            self.handleConfigureElementClickEvent($(this).attr('data-configurable'));
        });

        // temp to refresh data on click
        self.elements.headerDisplayName.on('click', function () {
            self.refreshDataFromServer();
        });

        self.elements.showDashboardItemContextMenu.on('click', function () {
            self.showContextMenu();
        });

        // self.elements.container.on('contextmenu', function () {
        //     self.showDataSourceMakerWindow()
        // });

    },
    getContainer: function () {
        var self = this;
        return self.elements.container;
    },
    showLoadingOverlay: function () {
        var self = this;
        self.elements.container.addClass('showLoadingOverlay');
    },
    hideLoadingOverlay: function () {
        var self = this;
        self.elements.container.removeClass('showLoadingOverlay');
    },
    show: function () {
        var self = this;
        // console.log(this)
        return self.elements.container.addClass('visible');
    },
    setHeaderDisplayName: function (newDisplayName) {
        var self = this;
        self.elements.container.find('.headerDisplayName').html(newDisplayName);
    },

    getHeaderDisplayName: function () {
        var self = this;
        return self.config.displayName || '';
    },

    setElementAsConfigured: function (element) {
        var self = this;
        element.removeAttr('data-not-configured');
    },
    setElementAsNotConfigured: function (element) {
        var self = this;
        element.attr('data-not-configured', true);
    },




    remove: function(){
        var self = this;
        // self.destroy();

        self.container.remove();

        return self;
    },
    updateCurrentConfigurationToServer : function(updateCurrentConfigurationToServerCallback){
        var self = this;

        console.log('updateCurrentConfigurationToServer', self.config);

        var url = DashboardManager.API_ENDPOINTS.UPDATE_DASHBOARD_ITEM_CONFIGURATION;
        self.showLoadingOverlay();

        var changedValues = self.getChangedValuesInConfiguration();

        $.ajax({
            url: url,
            type: 'POST',
            data: {
                _source : JSON.stringify({
                    config: {
                        itemId : self.config.id,
                        changedValues : changedValues
                    }
                })
            }
        }).always(function(data, status){

            console.log('done update configuration to server ', data, status);

            self.hideLoadingOverlay();

            updateCurrentConfigurationToServerCallback && updateCurrentConfigurationToServerCallback();

        });
        return self;

    },

    cancel: function () {
        var self = this;
        self.hide();
    },
    hide: function () {
        var self = this;
        return self.elements.container.removeClass('visible');
    },




    getModuleFromDataSourceObj: function (obj) {
        var self = this;
        return self.erp.modules[obj.moduleId];
    },
    getSubModuleFromDataSourceObj: function (obj) {
        var self = this;
        return self.getModuleFromDataSourceObj(obj).subModules[obj.subModuleId];
    },
    getColumnFromDataSourceObj: function (obj) {
        var self = this;
        return self.getSubModuleFromDataSourceObj(obj).columnManager.columns[obj.columnId];
    },


    initializeDataSourceMakerComponent: function () {
        var self = this;
        if(self.parentObject.dataSourceMaker){
            return;
        }
        self.parentObject.dataSourceMaker = new DataSourceMaker({
            onNewDashboardItemCreated : function (newDashboardItemInfo) {
                console.log('onNewDashboardItemCreated DataSourceMaker', newDashboardItemInfo);

                // self.items[newDashboardItemInfo.id] = newDashboardItemInfo;
                // self.initializeSingleDashboardItem(newDashboardItemInfo);
                // loadLatestReportsFromServer(newReportInfo.Id_Report);
            },
            onDashboardItemUpdated : function (reportInfo) {
                console.log('onDashboardItemUpdated DataSourceMaker', reportInfo);

                // loadLatestReportsFromServer(reportInfo.Id_Report);
            }
        }, self.parentObject);
    },

    // showContextMenu : function () {
    //     var self = this;
    //
    //     console.log(this);
    //
    //     return self;
    // }

}





DashboardItem.Templates = {
    dashboardItemElementTemplate : Handlebars.compile ($("#dashboardItemElementTemplate").html()),
}

