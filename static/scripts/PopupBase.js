/**
 * Created by Akhil on 18-Dec-17.
 */



function PopupBase(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    // self.initialize();
    return self;
}


PopupBase.prototype = {
    initialize: function () {
        var self = this;
        self.id = self.config.id || self.getId();

        self.elements = {};
        self.elements.container = self.config.container;

        self.createElements();
        self.bindEvents();

        if (self.config.targetContainer) {
            self.elements.container.appendTo(self.config.targetContainer);
        } else {
            self.elements.container.appendTo(document.body);    
        }
        
        return self;
    },
    createElements: function () {
        var self = this;
        var container = $(PopupBase.Templates.popupBaseTemplate ({
            id : self.getId(),
            headerDisplayName : this.getHeaderDisplayName(),
            buttons : this.getButtons()
        }));
        container.addClass('popupBase');
        container.addClass(self.getId());

        self.elements.container = container;
        self.elements.popupContent = container.find('.popupContent');
        self.elements.buttonPanel = container.find('.popupFooterButtonPanel');

    },

    bindEvents: function () {
        var self = this;
        self.elements.container.on('click', '.popupCloseButton', function (eve) {
            self.cancel();
        });
        self.elements.buttonPanel.on('click', 'button[data-id]', function (eve) {
            var element = $(this);
            self.handleOnButtonClickEvent(element);
        });
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
        self.elements.container.find('.popupHeaderDisplayName').html(newDisplayName);
    },

    cancel: function () {
        var self = this;
        self.hide();
    },
    hide: function () {
        var self = this;
        return self.elements.container.removeClass('visible');
    },

}





PopupBase.Templates = {
    popupBaseTemplate : Handlebars.compile ($("#popupBaseTemplate").html()),
}

