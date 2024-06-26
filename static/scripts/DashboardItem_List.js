

function DashboardItem_List(config, parentObject) {
    var self = this;
    window.DashboardItem.apply(this, [config, parentObject]);
    self.initialize();
    return self;
}

DashboardItem_List.prototype = Object.create(DashboardItem.prototype);
DashboardItem_List.prototype.constructor = DashboardItem_List;
DashboardItem_List.prototype.super = DashboardItem.prototype;



DashboardItem_List.prototype.CONTAINER_Z_INDEX = 4000;



DashboardItem_List.prototype.initialize = function () {
    var self = this;
    self.options = {};
    self.super.initialize.apply(self);
    return self;
}

DashboardItem_List.prototype.getItemTypeName = function () {
    return 'dashboardItem_List';
}

DashboardItem_List.prototype.getId = function () {
    var self = this;
    return self.config.id;
}



// DashboardItem_List.prototype.getButtons = function () {
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

// DashboardItem_List.prototype.handleOnButtonClickEvent = function (buttonElement) {
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
// DashboardItem_List.prototype.onOkButtonClicked = function () {
//     var self = this;
//     self.options.onOk && self.options.onOk(self.getInputElementValue());
//     self.hide();
// }

DashboardItem_List.prototype.createElements = function () {
    var self = this;
    self.super.createElements.apply(self);

    self.createContentElement();
}

DashboardItem_List.prototype.createContentElement = function () {
    var self = this;

    self.elements.dashboardItemContent.empty();

    var itemMainElement = $(DashboardItem_List.Templates.dashboardItemElementTemplate_List(self.config));
    self.elements.itemMainElement = itemMainElement;
    self.elements.dashboardItemContent.append(itemMainElement);

    self.setHeaderDisplayName(self.getHeaderDisplayName())
}
DashboardItem_List.prototype.bindEvents = function () {
    var self = this;
    self.super.bindEvents.apply(self);
}

DashboardItem_List.prototype.show = function (options) {
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

    self.elements.container.css('z-index', ++DashboardItem_List.prototype.CONTAINER_Z_INDEX);

    self.elements.form.find('input').first().focus();
}

DashboardItem_List.prototype.resetContentElement = function () {
    var self = this;
    self.createContentElement();
}




DashboardItem_List.prototype.refreshDataFromServer = function(parentReportFilter){
    var self = this;
    var parentReportFilterId = undefined;

    if(parentReportFilter){
        parentReportFilterId = parentReportFilter.id;
        self.latestParentReportFilterId = parentReportFilterId;
    }
    else{
        self.latestParentReportFilterId = undefined;
    }

    var url = '/ajax/dashboard/getItemData/'+ self.id;
    self.resetValues();
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            parentReportFilterId :parentReportFilterId,
            config: {
                _dashboard : true
            }
        }
    }).done(function(data){

        if(data.success){
            self.listDataReceived(data.result);
        }
        else{
            self.setToErrorMode(data.errorMessage);
            //self.subReport.notifier.showReportableErrorNotification('Error getting data for '+ self.displayName+'('+ data.errorMessage +')');
        }
    });
    return self;
};




DashboardItem_List.Templates = {
    dashboardItemElementTemplate_List : Handlebars.compile ($("#dashboardItemElementTemplate_List").html()),
}

