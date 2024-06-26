/**
 * User: Akhil Sekharan
 * Timestamp: 6/23/139:17 PM
 */

function SimpleDataTableRowValidationError(attrs, parentObject) {
    var self = this;
    self.config = attrs;
    self.parentObject = parentObject;
    self.validationErrorManager = parentObject;
    for(var key in attrs){
        self[key] = attrs[key];
    }
    self.initialize();
    return self;
}

SimpleDataTableRowValidationError.prototype = {
    constants: {
        container: {
            "class": "simpleDataTableRowValidationError"
        }
    },
    initialize: function () {
        var self = this;
        return self;
    },
    setDeviceTypeDisplayMode: function(simpleDataTableRow){
        var self = this;
        self.container.addClass(simpleDataTableRow.erp.deviceType);
        switch(simpleDataTableRow.erp.deviceType){
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
        self.element.remove();
        return self;
    },
    show: function (simpleDataTableRow) {
        var self = this;
        var target = self.column.getSimpleDataTableRowElement(simpleDataTableRow).closest('.simpleDataTableRow-column-holder');
        target.css('border', '1px solid red');
        var div = self.createElement(true);
        div.text(self.message);

        switch(simpleDataTableRow.erp.deviceType){
            case ERP.DEVICE_TYPES.PC:
                simpleDataTableRow.container.append(div);
                break;
            case ERP.DEVICE_TYPES.MOBILE:
                target.append(div);
                break;
        }
        self.element = div;
        self.container = div;
        self.bindEvents();
        self.setDeviceTypeDisplayMode(simpleDataTableRow);
        switch(simpleDataTableRow.erp.deviceType){
            case ERP.DEVICE_TYPES.PC:
                target.append(div);
            case ERP.DEVICE_TYPES.MOBILE:
                break;
        }
        return self;
    },
    hide      : function () {
        var self = this;
        return self;
    },
    cancel    : function () {
        var self = this;
        return self;
    },
    createElement: function () {
        var self = this;
        var div = $(document.createElement('div'))
            .attr(self.constants.container);
        return div;
    },
    _events   : {
    },
    _ui       : {
    }
}