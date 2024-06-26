/**
 * Created by Akhil on 18-Dec-17.
 */



function BetterPrompt(config, parentObject) {
    var self = this;
    window.PopupBase.apply(this, [config, parentObject]);
    self.initialize();
    return self;
}

BetterPrompt.prototype = Object.create(PopupBase.prototype);
BetterPrompt.prototype.constructor = BetterPrompt;
BetterPrompt.prototype.super = PopupBase.prototype;



BetterPrompt.prototype.CONTAINER_Z_INDEX = 4000;



BetterPrompt.prototype.initialize = function () {
    var self = this;
    // self.options = {};
    self.super.initialize.apply(self);
    return self;
}

BetterPrompt.prototype.getId = function () {
    return "betterPrompt"
}

BetterPrompt.prototype.getHeaderDisplayName = function () {
    var self = this;
    return self.config.headerDisplayName || '';
}

BetterPrompt.prototype.getButtons = function () {
    return [
        {
            id : "ok",
            displayName : "Ok",
        },
        {
            id : "cancel",
            displayName : "Cancel",
        }
    ]
}

BetterPrompt.prototype.handleOnButtonClickEvent = function (buttonElement) {
    var self = this;
    switch (buttonElement.attr('data-id')) {
        case 'ok':
            self.onOkButtonClicked();
            break;
        case 'reset':
            self.resetForm();
            break;
        case 'cancel':
            self.onCancelButtonClicked();
            break;
    }
}


BetterPrompt.prototype.onCancelButtonClicked = function () {
    var self = this;
    self.config.onCancel && self.config.onCancel();
    self.cancel();
}

BetterPrompt.prototype.onOkButtonClicked = function () {
    var self = this;
    self.config.onOk && self.config.onOk(self.getInputElementValue());
    self.hide();
}

BetterPrompt.prototype.getInputElement = function () {
    var self = this;
    return self.elements.form.find('input[type="text"]');
}

BetterPrompt.prototype.getInputElementValue = function () {
    var self = this;
    return self.elements.form.find('input[type="text"]').val() || '';
}

BetterPrompt.prototype.setInputElementValue = function (newValue) {
    var self = this;
    return self.elements.form.find('input[type="text"]').val(newValue || '') ;
}

BetterPrompt.prototype.createElements = function () {
    var self = this;
    self.super.createElements.apply(self);

    self.createForm();
}

BetterPrompt.prototype.createForm = function () {
    var self = this;

    self.elements.popupContent.empty();

    var form = $(BetterPrompt.Templates.betterPromptFormTemplate({
        id: "betterPrompt",
        description : self.config.description || '',
        inputDisplayName : self.config.inputDisplayName || ''
    }));
    self.elements.form = form;
    self.elements.fakeFormSubmitButton = $(document.createElement('input')).attr('type', 'submit').hide();
    self.elements.form.append(self.elements.fakeFormSubmitButton);
    self.elements.popupContent.append(form);

    self.setInputElementValue(self.config.defaultValue || '');
    self.setHeaderDisplayName(self.getHeaderDisplayName())
}
BetterPrompt.prototype.bindEvents = function () {
    var self = this;
    self.super.bindEvents.apply(self);
}

BetterPrompt.prototype.show = function (options) {
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

    self.elements.container.css('z-index', ++BetterPrompt.prototype.CONTAINER_Z_INDEX);

    self.elements.form.find('input').first().focus();
}

BetterPrompt.prototype.resetForm = function () {
    var self = this;
    self.createForm();
}

BetterPrompt.prototype.cancel = function () {
    var self = this;
    self.resetForm();
    self.hide();
}





BetterPrompt.Templates = {
    popupBaseTemplate : Handlebars.compile ($("#popupBaseTemplate").html()),
    betterPromptFormTemplate : Handlebars.compile ($("#betterPromptFormTemplate").html()),
}


window.betterPrompt = new BetterPrompt({}, window);