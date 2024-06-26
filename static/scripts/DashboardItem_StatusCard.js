

function DashboardItem_StatusCard(config, parentObject) {
    var self = this;
    window.DashboardItem.apply(this, [config, parentObject]);
    self.initialize();
    return self;
}

DashboardItem_StatusCard.prototype = Object.create(DashboardItem.prototype);
DashboardItem_StatusCard.prototype.constructor = DashboardItem_StatusCard;
DashboardItem_StatusCard.prototype.super = DashboardItem.prototype;



DashboardItem_StatusCard.prototype.CONTAINER_Z_INDEX = 4000;



DashboardItem_StatusCard.prototype.initialize = function () {
    var self = this;
    self.options = {};
    self.super.initialize.apply(self);
    return self;
}

DashboardItem_StatusCard.prototype.getId = function () {
    var self = this;
    return self.config.id;
}

DashboardItem_StatusCard.prototype.getItemTypeName = function () {
    return 'dashboardItem_StatusCard';
}



// DashboardItem_StatusCard.prototype.getButtons = function () {
//     return [
//         {
//             id : "ok",
//             displayName : "Ok",
//         },
//         {
//             id : "cancel",
//             displayName : "Cancel",
//         }
//     ]
// }

// DashboardItem_StatusCard.prototype.handleOnButtonClickEvent = function (buttonElement) {
//     var self = this;
//     switch (buttonElement.attr('data-id')) {
//         case 'ok':
//             self.onOkButtonClicked();
//             break;
//         case 'reset':
//             self.resetForm();
//             break;
//         case 'cancel':
//             self.onCancelButtonClicked();
//             break;
//     }
// }
//
//
// DashboardItem_StatusCard.prototype.onOkButtonClicked = function () {
//     var self = this;
//     self.options.onOk && self.options.onOk(self.getInputElementValue());
//     self.hide();
// }

DashboardItem_StatusCard.prototype.createElements = function () {
    var self = this;
    self.super.createElements.apply(self);

    self.createContentElement();
}

DashboardItem_StatusCard.prototype.createContentElement = function () {
    var self = this;

    self.elements.dashboardItemContent.empty();

    var itemMainElement = $(DashboardItem_StatusCard.Templates.dashboardItemElementTemplate_StatusCard(self.config));
    self.elements.itemMainElement = itemMainElement;
    self.elements.dashboardItemContent.append(itemMainElement);

    self.elements.statusCardMainValue = itemMainElement.find('.statusCardMainValue');
    self.elements.statusCardMainValueInfoText = itemMainElement.find('.statusCardMainValueInfoText');

    if(!self.config.mainValue){
        self.setElementAsNotConfigured(self.elements.statusCardMainValue);
    }

    if(!self.config.infoText){
        self.setElementAsNotConfigured(self.elements.statusCardMainValueInfoText);
    }

    self.elements.itemMainElement.find('[data-not-configured]').each(function () {
        var element = $(this);
        element.attr('title', element.attr('data-configure-message'));
    })

}
DashboardItem_StatusCard.prototype.bindEvents = function () {
    var self = this;


    self.super.bindEvents.apply(self);


}

DashboardItem_StatusCard.prototype.show = function (options) {
    var self = this;

    self.options = options || {};

    // self.defaultValue = defaultValue || '';
    // self.isMandatory = options.mandatory || false;
    // self.callbacks = {
    //     onOk : options.onOkCallback,
    //     onCancel : options.onCancelCallback,
    // }

    self.resetForm();

    self.super.show.apply(self);

    self.elements.container.css('z-index', ++DashboardItem_StatusCard.prototype.CONTAINER_Z_INDEX);

    self.elements.form.find('input').first().focus();
}

DashboardItem_StatusCard.prototype.resetContentElement = function () {
    var self = this;
    self.createContentElement();
}



DashboardItem_StatusCard.prototype.refreshDataFromServer = function(parentReportFilter){
    var self = this;
    var parentReportFilterId = undefined;

    if(parentReportFilter){
        parentReportFilterId = parentReportFilter.id;
        self.latestParentReportFilterId = parentReportFilterId;
    }
    else{
        self.latestParentReportFilterId = undefined;
    }

    var url = DashboardManager.API_ENDPOINTS.GET_ITEM_DATA + '/'+ self.id;
    self.showLoadingOverlay();
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            parentReportFilterId :parentReportFilterId,
            config: {
                _dashboard : true
            }
        }
    }).always(function(data, status){

        // console.log('done get dash item data', data, status);

        self.hideLoadingOverlay();

        if(data.success){
            self.dataFromServerReceived(data.result);
        }
        else{
            console.error('failed get dash item data', data, status);
            self.setToErrorMode(data.errorMessage);
            //self.subReport.notifier.showReportableErrorNotification('Error getting data for '+ self.displayName+'('+ data.errorMessage +')');
        }
    });
    return self;
};

DashboardItem_StatusCard.prototype.dataFromServerReceived = function(result){
    var self = this;
    var mainValueCount = result.mainValue.count;

    self.elements.statusCardMainValue.text(mainValueCount);
};






DashboardItem_StatusCard.prototype.getChangedValuesInConfiguration = function(){
    var self = this;
    return {
        infoText : self.config.infoText,
        mainValue : self.config.mainValue
    };
}


DashboardItem_StatusCard.prototype.showEditInfoTextWindow = function(){
    var self = this;
    window.betterPrompt.show({
        headerDisplayName: 'Edit Info Text',
        inputDisplayName: 'Enter Text Content',
        defaultValue : self.config.infoText || '',
        onOk: function (newInfoText) {
            if (!newInfoText) {
                return;
            }
            newInfoText = newInfoText.trim();

            if(newInfoText === self.config.infoText){
                return;
            }

            self.config.infoText = newInfoText;
            self.elements.statusCardMainValueInfoText.text(newInfoText);
            self.setElementAsConfigured(self.elements.statusCardMainValueInfoText);

            self.updateCurrentConfigurationToServer();
        },
        onCancel: function () {
            // self.cancel();
        }
    });
}


DashboardItem_StatusCard.prototype.showConfigureMainValueDataSourceWindow = function () {
    var self = this;

    self.initializeDataSourceMakerComponent();

    var currentDataSource = {};

    if(self.config.mainValue){
        currentDataSource = self.config.mainValue.dataSource;
    }

    self.parentObject.dataSourceMaker.show({
        hideChooseVisibleColumns : true,
        currentValue : currentDataSource,
        onSaveCallback : function (newDataSourceConfiguration) {
            console.log('new config', newDataSourceConfiguration);
            if(!self.config.mainValue){
                self.config.mainValue = {
                }
            }

            self.config.mainValue.dataSource = newDataSourceConfiguration;

            self.updateCurrentConfigurationToServer(function (updateErr) {
                self.setElementAsConfigured(self.elements.statusCardMainValue);

                self.refreshDataFromServer();
            });
        }
    });
},

DashboardItem_StatusCard.prototype.handleConfigureElementClickEvent = function(itemId){
    var self = this;

    switch (itemId){
        case 'infoText':
            self.showEditInfoTextWindow();
            break;
        case 'statusCardMainValue':
            self.showConfigureMainValueDataSourceWindow();
            break;
    }

}



DashboardItem_StatusCard.Templates = {
    dashboardItemElementTemplate_StatusCard : Handlebars.compile ($("#dashboardItemElementTemplate_StatusCard").html()),
}

