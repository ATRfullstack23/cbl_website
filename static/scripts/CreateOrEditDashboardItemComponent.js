/**
 * Created by Akhil on 18-Dec-17.
 */



function CreateOrEditDashboardItemComponent(config, parentObject) {
    var self = this;
    window.PopupBase.apply(this, [config, parentObject]);
    self.initialize();
    return self;
}

CreateOrEditDashboardItemComponent.prototype = Object.create(PopupBase.prototype);
CreateOrEditDashboardItemComponent.prototype.constructor = CreateOrEditDashboardItemComponent;
CreateOrEditDashboardItemComponent.prototype.super = PopupBase.prototype;



CreateOrEditDashboardItemComponent.prototype.initialize = function () {
    var self = this;
    self.super.initialize.apply(self);
    return self;
}
CreateOrEditDashboardItemComponent.prototype.getId = function () {
    return "createOrEditDashboardItemComponent"
}
CreateOrEditDashboardItemComponent.prototype.getHeaderDisplayName = function () {
    return "Create New Dashboard Item"
}
CreateOrEditDashboardItemComponent.prototype.getButtons = function () {
    return [
        {
            id : "save",
            displayName : "Save",
        },
        {
            id : "cancel",
            displayName : "Cancel",
        }
    ]
}
CreateOrEditDashboardItemComponent.prototype.handleOnButtonClickEvent = function (buttonElement) {
    var self = this;
    switch (buttonElement.attr('data-id')) {
        case 'save':
            if(self.mode == 'create'){
                self.validateAndCreateNewDashboardItem();
            }
            else{
                self.validateAndUpdateExistingDashboardItem();
            }
            break;
        case 'reset':
            self.resetForm();
            break;
        case 'cancel':
            self.cancel();
            break;
    }
}


CreateOrEditDashboardItemComponent.prototype.createElements = function () {
    var self = this;
    self.super.createElements.apply(self);

    self.createForm();
},
CreateOrEditDashboardItemComponent.prototype.createForm = function () {
        var self = this;

        var form = $(CreateOrEditDashboardItemComponent.Templates.createOrEditDashboardItemComponentFormTemplate ({
            id : "createOrEditDashboardItemComponent"
        }));
        self.elements.form = form;
        self.elements.fakeFormSubmitButton = $(document.createElement('input')).attr('type', 'submit').hide();
        self.elements.form.append(self.elements.fakeFormSubmitButton);
        self.elements.popupContent.append(form);

    }
CreateOrEditDashboardItemComponent.prototype.bindEvents = function () {
    var self = this;
    self.super.bindEvents.apply(self);
}

CreateOrEditDashboardItemComponent.prototype.validateAndCreateNewDashboardItem = function () {
    var self = this;
    var form = self.elements.form;
    var isValid = form.get(0).checkValidity();

    if(!isValid){
        self.elements.fakeFormSubmitButton.click();
        return;
    }
    var formData = {
        displayName : form.find('[name="displayName"]').val(),
        description : form.find('[name="description"]').val(),
        type : form.find('[name="type"]:checked').val(),
    }

    if(self.selectedParentFolder){
        formData.parentGroup = self.selectedParentFolder;
    }

    self.showLoadingOverlay();
    $.ajax({
        url : DashboardManager.API_ENDPOINTS.CREATE_DASHBOARD_ITEM,
        type : "POST",
        contentType: "application/x-www-form-urlencoded",
        data: {
            _source : JSON.stringify({config : formData})
        }
    }).always(function (response, status) {
         console.log('validateAndCreateNewDashboardItem done ', response, status);
        self.hideLoadingOverlay();
        if(response.success){
            self.hide();
            self.config.onNewDashboardItemCreated && self.config.onNewDashboardItemCreated(response.result);
            return;
        }
        alert(response.error + " \n" + response.errorMessage)
    });

}

CreateOrEditDashboardItemComponent.prototype.validateAndUpdateExistingDashboardItem = function () {
    var self = this;
    var form = self.elements.form;
    var isValid = form.get(0).checkValidity();

    if(!isValid){
        self.elements.fakeFormSubmitButton.click();
        return;
    }


    var formData = {
        id : self.selectedDashboardItem.id,
        selectedItemId : self.selectedDashboardItem.id,
        displayName : form.find('[name="displayName"]').val(),
        description : form.find('[name="description"]').val()
    }

    self.showLoadingOverlay();
    $.ajax({
        url : DashboardManager.API_ENDPOINTS.UPDATE_DASHBOARD_ITEM_INFO,
        type : "POST",
        contentType: "application/x-www-form-urlencoded",
        data: {
            _source : JSON.stringify({config : formData})
        }
    }).always(function (response, status) {
        console.log('UPDATE_DASHBOARD_ITEM_INFO done', response, status);
        self.hideLoadingOverlay();
        if(response.success){
            self.hide();
            self.config.onDashboardItemUpdated && self.config.onDashboardItemUpdated(response.result);
            return;
        }
        alert(response.error + " \n" + response.errorMessage)
    });
}

CreateOrEditDashboardItemComponent.prototype.show = function (selectedDashboardItem, parentFolder) {
    var self = this;
    self.resetForm();

    self.selectedDashboardItem = selectedDashboardItem;
    self.selectedParentFolder = parentFolder;

    if(selectedDashboardItem){
        self.mode = 'edit';
        self.elements.form.find('[name="displayName"]').val(selectedDashboardItem.config.displayName);
        self.elements.form.find('[name="description"]').val(selectedDashboardItem.config.description);
        self.elements.form.find('[name="type"][value="'+selectedDashboardItem.type+'"]').prop('checked', true);

        self.setHeaderDisplayName('Edit Dashboard Item');
    }
    else{
        self.setHeaderDisplayName('Create Dashboard Item');
        self.mode = 'create';
    }

    self.elements.form
        .removeClass('create')
        .removeClass('edit')
        .addClass(self.mode);

    self.super.show.apply(self);

    self.elements.form.find('input').first().focus();

}
CreateOrEditDashboardItemComponent.prototype.resetForm = function () {
    var self = this;
    self.elements.form.get(0).reset();
}

CreateOrEditDashboardItemComponent.prototype.cancel = function () {
    var self = this;
    self.resetForm();
    delete self.selectedDashboardItem;
    self.hide();
}





CreateOrEditDashboardItemComponent.Templates = {
    popupBaseTemplate : Handlebars.compile ($("#popupBaseTemplate").html()),
    createOrEditDashboardItemComponentFormTemplate : Handlebars.compile ($("#createOrEditDashboardItemComponentFormTemplate").html()),
}

