/**
 * Created by Jithu on 1/24/14.
 */
function UserDetailsContainer(config, parentObject){
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.initialize();
    return self;
}

UserDetailsContainer.prototype = {
    initialize: function(){
        var self = this;
        self.elements = {};
        self.createElements().bindEvents();
        return self;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    _creation: {
        createElements: function(userDetailsContainer){
            var container = $(document.createElement('div')).attr({class: "user-details-container-pop-up"});
            userDetailsContainer.container = container;
            var userContainer = $(document.createElement('div')).attr({class: "user-details-container"}).appendTo(container);

            var titleContainer = $(document.createElement('div')).attr({class: "user-details-title-container"}).appendTo(userContainer);
            var title = $(document.createElement('div')).attr({class: "user-details-title"}).appendTo(titleContainer);
            title.text(userDetailsContainer.config.userName);

            if(userDetailsContainer.config.isAdmin){
                var adminInfoContainer = $(document.createElement('div')).attr({class: "admin-info-container"}).appendTo(userContainer);
                var details = $(document.createElement('div')).attr({class: "admin-info"}).appendTo(adminInfoContainer);
                details.text(userDetailsContainer.config.userName+'is also a admin');
            }
            else{
                var adminLogoutButtonContainer = $(document.createElement('div')).attr({class: "admin-logout-button-container"}).appendTo(userContainer);
                var logoutTitle = $(document.createElement('div')).attr({class: "admin-logout-title"}).appendTo(adminLogoutButtonContainer);
                logoutTitle.text('Forced logout click here -->')
                var adminLogoutButton = $(document.createElement('div')).attr({class: "admin-logout-button"}).appendTo(adminLogoutButtonContainer);
                userDetailsContainer.elements.logoutButton = adminLogoutButton;
            }

            var closeButtonContainer = $(document.createElement('div')).attr({class: "user-details-close-button-container"}).appendTo(userContainer);
            var closeButton = $(document.createElement('div')).attr({class: "user-details-close-button"}).appendTo(closeButtonContainer);
            userDetailsContainer.elements.closeButton = closeButton;
        }
    },
    bindEvents: function(){
        var self = this;
        if(!self.config.isAdmin){
            self.elements.logoutButton.on('click', function(){
                console.log(self);
                self.container.hide();
                self.parentObject.socket.emit('forced_logout', self.config);

            });
        }
        self.elements.closeButton.on('click', function(){
            self.hide();
        });
        return self;
    },
    show: function(){
        var self = this;
        self.container.show();
        return self;
    },
    hide: function(){
        var self = this;
        self.container.hide();
        return self;
    }
}
