/**
 * User: Akhil Sekharan
 * Timestamp: 6/23/139:17 PM
 */

function ValidationError(config, parentObject) {
    var self = this;
    self.parentObject = parentObject;
    self.validationErrorManager = parentObject;
    self.config = config;
    for(var key in config){
        self[key] = config[key];
    }
    self.initialize();
    return self;
}

ValidationError.prototype = {
    initialize: function () {
        var self = this;

        return self;
    },
    setDeviceTypeDisplayMode: function(formView){
        var self = this;
        self.container.addClass(formView.erp.deviceType);
        switch(formView.erp.deviceType){
            case ERP.DEVICE_TYPES.PC:
                break;
            default:

                break;
        }
        return self;
    },
    bindEvents: function () {
        var self = this;
        self.element.on('click', function(){
            self.element.remove();
        });
        return self;
    },
    remove: function(){
        var self = this;
        self.container && self.container.remove();
        return self;
    },
    show: function (formView) {
        var self = this;
        var target = self.column.getFormViewElement(formView.mode)
            .closest('.formview-column-holder');
        target.css('border', '1px solid red');
        var alignLeft = target.closest('td')
            .data('position').toString().split(',')[1] == '0';
        var div = self._creation.createElement(alignLeft);
        div.find('#popupMessage').text(self.message);



        switch(formView.erp.deviceType){
            case ERP.DEVICE_TYPES.PC:
                formView.container.append(div);
                break;
            case ERP.DEVICE_TYPES.MOBILE:
                target.append(div);
                break;
        }
        self.element = div;
        self.container = div;
        self.bindEvents();
        self.setDeviceTypeDisplayMode(formView);

        switch(formView.erp.deviceType){
            case ERP.DEVICE_TYPES.PC:
                var offset = target.offset();
                if (alignLeft){
                    div.css('left', offset.left - div.outerWidth(true) - 5);
                }
                else{
                    div.css('left', offset.left + target.outerWidth(true) + 5);
                }
                div.css('top', offset.top + target.height() / 2 - div.height() / 2);
                break;
            case ERP.DEVICE_TYPES.MOBILE:
                break;
        }

        return self;
    },
    hide      : function () {
        var self = this;
        self.container && self.container.hide();
        return self;
    },
    cancel    : function () {
        var self = this;
        return self;
    },
    _creation : {
        createElement: function (alignLeft) {
            var leftHtml = '<div class="popup-message" id="popupMessage" title="Click To Dismiss"></div><div id="popupArrowBorder" class="arrow-left-border"></div><div id="popupArrow" class="arrow-left"></div>';
            var rightHtml = '<div class="popup-message" id="popupMessage" title="Click To Dismiss"></div><div id="popupArrowBorder" class="arrow-right-border"></div><div id="popupArrow" class="arrow-right"></div>';
            var div = $(document.createElement('div')).attr('class', 'error-popup');
            if (!alignLeft)
                div.html(leftHtml);
            else
                div.html(rightHtml);
            return div;
        }
    },
    _events   : {
    },
    _ui       : {
    }
}