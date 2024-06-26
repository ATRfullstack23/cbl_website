/**
 * User: Akhil Sekharan
 * Timestamp: 6/25/1312:08 AM
 */

Notifier = function (config) {
    var self = this;
    self.config = config;
    self.initialize(config);
    return self;
};

Notifier.prototype = {
    _selectors: {

    },
    constants:{
        container:{
            "class": "notifierContainer",
            title: "click to dismiss"
        }
    },
    initialize: function (attrs) {
        var self = this;
        if(attrs){
            self.animate = attrs.animate || true;
            self.duration = attrs.duration || 4000;
            self.autoFadeOut = attrs.autoFadeOut || true;
            self.container = $(attrs.container) || $(document.body);
            self.subModule = attrs.subModule;
            self.bugReportManager = attrs.bugReportManager;
        }
        return self;
    },
    createButtons: function(buttons){
        var self = this;
        var btnsContainer = $(document.createElement('div'))
            .addClass('buttonsContainer');
        for(var key in buttons){
            var button = buttons[key];
            var btnElement = $(document.createElement('button'))
                .text(button.displayName)
                .addClass(button.type || 'primary')
                .appendTo(btnsContainer);
            btnElement.on('click', function(){
               button.onClick.apply(button.context, [button.context, self]);
            });
        }
        return btnsContainer;
    },
    show: function ( message, type, overrides) {
        var self = this;
        self.lastNotificationElement && self.removeNotification(self.lastNotificationElement);
        var div = self.createDiv();
        overrides = overrides || {};
        message = message || '';
        switch ( type ) {
            case 'info':
                div.addClass( 'information' );
                break;
            case 'warning':
                div.addClass( 'warning' );
                break;
            case 'error':
                div.addClass( 'error' );
                break;
            case 'success':
                div.addClass( 'success' );
                break;
            default:
                // console.trace && console.trace();
                div.addClass( 'success' );
        }
        div.find('.notifierMessage')
            .html( message.replace(/\n/g, '<br/>') );
        div.setCenter({
            axis: 'x'
        });
        if(overrides.buttons){
            div.find('.notifierButtons')
                .append(self.createButtons(overrides.buttons));
        }
        div.css( 'top', '50px' );
        div.addClass('animate')
        if ( self.autoFadeOut ) {
            setTimeout( function () {
                self.removeNotification(div);
            }, overrides.duration || self.duration );
        }
        self.lastNotificationElement = div;
        return div;
    },
    removeNotification: function(div){
        var self = this;
        div.removeClass('animate');
        delete self.lastNotificationElement;
        setTimeout(function(){
            div.remove();
        },1000);
        return self;
    },
    showSuccessNotification: function ( message, options ) {
        var self = this;
        self.show( message, 'success', options );
    },
    showInfoNotification: function ( message, options ) {
        var self = this;
        self.show( message, 'info', options );
    },
    showErrorNotification: function ( message, options ) {
        console.trace && console.trace()
        var self = this;
        self.show( message, 'error', options );
    },
    showReportableErrorNotification: function ( message, options ) {
        var self = this;
        options = options || {};
        if(!options.buttons){
            options.buttons = {
                report: {
                    displayName: "Report",
                    onClick: function(){
                        var subModule = self.subModule||window.erp.getSelectedModule().getSelectedSubModule();
                        var bugReportData = {
                            module: subModule.module.id,
                            subModule: subModule.id,
                            type: "bug",
                            bugSeverityLevel: "major",
                            content: message
                        };
                        subModule.erp.bugReportManager.show(bugReportData);
                    }
                }
            }
        }
        self.show( message, 'error', options );
    },
    showWarningNotification: function ( message ) {
        var self = this;
        self.show( message, 'warning' );
    },
    hide: function () {
    },
    createDiv: function () {
        var self = this;
        var html = '<div class="tableRow hundred-percent-x">' +
            '   <div class="tableCell"><div class="notifierImage"></div></div>' +
            '   <div class="tableCell notifierMessage"></div>' +
            '   <div class="tableCell notifierButtons"></div>' +
            '</div>';
        var div = $(document.createElement('div'))
            .attr(self.constants.container)
            .html(html);
        div.on('click', function(){
           div.remove();
        });
        $( self.container || document.body )
            .append( div );
        return div;
    }
}