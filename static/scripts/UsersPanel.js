/**
 * Created by Jithu on 6/13/14.
 */
function UsersPanel(config){
    var self = this;
    self.config = config;
    self.initialize();
    return self;
}

UsersPanel.prototype = {
    constants: {
        container: {
            id: "userPanelContainer",
            class: "user-panel-container"
        },
        usersPanel: {
            id: "usersPanel",
            class: "users-panel"
        },
        statusContainer:{
            class: "status-container"
        },
        status: {
            class: "status"
        },
        applicationLogo:{
            "class": "applicationLogo"
        },
        rayCloudSolutionsLogo:{
            "class": "rayCloudSolutionsLogo",
            "src": "images/binary_logo_dark_transparent.png"
        },
		companyLogo:{
            "class": "companyLogo",
            "src": "pic/companyLogo.png"
        }
    },
    initialize: function(){
        var self = this;
        self.elements = {};
        self.isDirectLogin = false;
        self.createElements();
        self.notifier = new Notifier({
            container: $(document.body)
        });
        self.bindEvents();
        var usersConfig = self.createUsersConfig();
        self.users = {}
        for(var key in usersConfig){
            var userConfig = usersConfig[key];
            var user = new NewUser(userConfig, self);
            self.elements.usersPanel.append(user.container);

//            user.container.css('left', user.container.position().left+'px');
            self.users[userConfig.id] = user;
        }
        self.setPositionOfUsers();
        self.hide();
        self.createDirectUser();
        self.setDefaultUser();
        self.animation = new LoginScreenAnimate();
        self.getApplicationDetails();
        return self
    },
    getApplicationDetails: function(){
        var self = this;
        $.ajax({
            type: 'POST',
            url: '/api/public/getApplicationDetails'
        }).success(function(response){
            if(response.success){
                self.elements.h1
                    .text(response.result.displayName)
                    .addClass('loadingDone');
                if(response.result.logoFileName){
                    self.elements.applicationLogo.attr('src', response.result.logoURL + response.result.logoFileName.substring(response.result.logoFileName.lastIndexOf('.')));
                }
            }
        }).fail(function(){
            $.ajax({
                type: 'POST',
                url: '/getApplicationPublicDetails'
            }).success(function(response) {
                if (response.success) {
                    self.elements.h1
                        .text(response.result.displayName)
                        .addClass('loadingDone');
                }
            });
        });
        return self;
    },
    setDefaultUser: function(){
        var self = this;
        if(Object.keys(self.users).length == 1){
            var user = self.users[Object.keys(self.users)];
            user.setSelectedUser();
        }
        return self;
    },

    setPositionOfUsers: function(){
        var self = this;
        for(var key in self.users){
            var user = self.users[key];
//            user.container.css({'-webkit-transform': 'translateX('+user.container.position().left+'px) translateY('+user.container.position().top+'px)'});
            user.container.css({left: user.container.position().left+'px', top: user.container.position().top+'px'});

        }
        return self;
    },
    createDirectUser: function(){
        var self=  this;
        var directUserConfig = {
            id: 'unknown',
            name: ''
        }
        self.directUser = new NewUser(directUserConfig, self);
        self.elements.directLoginPanel.append(self.directUser.container);
        return self;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    bindEvents: function(){
        var self = this;
        self.container.on('click', function(){
            self.setLoginScreenToInitialMode();
        });
        self.elements.showDirectLogin.on('click', function(){
            self.showDirectLogin();
        });
        self.elements.hideDirectLogin.on('click', function(){
            self.hideDirectLogin();
        })
        return self;
    },
    showDirectLogin: function(){
        var self = this;
        self.hasdirectLogin = true;
        self.directLoginContainer.addClass('direct-login-container-in');
        self.directUser.setSelectedUser();
		usersPanel.elements.usersPanel.css({ "opacity": 0})
        return self;
    },
    hideDirectLogin: function(){
        var self = this;
        self.hasdirectLogin = false;
        self.directLoginContainer.removeClass('direct-login-container-in');
        self.directUser.unsetSelectedUser();
		usersPanel.elements.usersPanel.css({ "opacity": 1})
        return self;
    },
    setLoginScreenToInitialMode: function(){
        var self = this;
        self.elements.statusContainer.removeClass('status-container-show');
        for(var key in self.users){
            var user = self.users[key];
            user.container.removeClass('user-main-container-selected');
            user.container.removeClass('user-main-container-not-selected');
            user.elements.userNameContainer.show();
            user.elements.userContainer.removeClass('user-container-not-selected');
            user.elements.userContainer.removeClass('user-container-selected');
            user.elements.userContainer.removeClass('user-container-logged-in');
            user.elements.userContainer.removeClass('user-container-active');
            user.elements.userNameContainer.removeClass('user-name-container-selected');
            user.elements.userIcon.removeClass('login-icon-selected');
            user.elements.userIconContainer.removeClass('user-icon-container-selected');

            user.elements.userName.removeClass('login-user-name-not-selected');
            user.hidePassWordAndLoginButton();
        }
        return self;
    },
    setLoginScreenToCheckInMode: function(){
        var self = this;

        self.selectedUser.elements.userContainer.addClass('user-container-active');
        for(var key in self.users){
            var user = self.users[key];
            if(user.id != self.selectedUser.id){
                user.elements.userNameContainer.hide();
                user.elements.userContainer.addClass('user-container-logged-in');
            }
        }
        return self;
    },
    setLoginSreenToLoggedInMode: function(){
        var self = this;
        self.animation.show('Welcome ' + self.selectedUser.config.userName);
        self.selectedUser.hidePassWordAndLoginButton();
        self.selectedUser.elements.userContainer.removeClass('user-container-active');
        self.selectedUser.elements.userContainer.removeClass('user-container-selected');
        self.selectedUser.elements.userContainer.addClass('user-container-after-logged-in');
        self.container.addClass('remove-pointer-events');
        self.loggedInInterval = setInterval(function(){
            self.animation.show('Loading Your Personal Settings');
        }, 5000);
        return self;
    },


    login: function(data, user){
        var self = this;
        self.selectedUser = user;
        self.userData = data;
        setTimeout(function(){
            self.config.onLogin.apply(self, [data, self]);
        }, 500);
        self.setLoginScreenToCheckInMode();
        return self;
    },

    falseLogin: function(data){
        var self = this;
        self.animation.show(data.errorMessage || 'Invalid Password');
        self.elements.usersPanel.addClass('user-panel-in');
        for(var key in self.users){
            var user = self.users[key];
            user.elements.userNameContainer.show();
        }
        self.selectedUser.elements.userContainer.removeClass('user-container-active');
        self.elements.usersPanel.children().children().removeClass('user-container-logged-in');
        return self;
    },

    showMessage: function(data){
        var self = this;
        var options = {};
        switch (data.errorCode){
            case 102:
                options.duration = 5000;
                options.buttons = {
                    forceLogout: {
                        id: "forceLogout",
                        context: self,
                        displayName: "Force Logout",
                        onClick: function(user, notifier){
                            var data = self.userData
                            $.ajax({
                                url: '/forceLogout',
                                type: 'POST',
                                data: data
                            }).done(function(data){
                                    if(data.error){
                                        self.notifier.showErrorNotification(data.errorMessage);
                                    }
                                    else{
                                        setTimeout(function(){
                                            self.login(self.userData, self.selectedUser);
                                        }, 100);
                                    }
                                });
                        }
                    }
                };
                break;
        }
        if(data.errorCode){
            self.notifier.showErrorNotification(data.errorMessage, options);
        }
        else{
            self.notifier.showSuccessNotification(data, options);
        }
        return self;
    },

    createUsersConfig: function(){
        var self = this;
        var usersConfig = {};
        self.config.config.forEach(function(user){
            usersConfig[user.id] = {
                id: user.id,
                userName: user.roleName,
				image: user.image
            }
        });
        return usersConfig
    },

    setUserConfig: function(userConfig){
        var self = this;
        self.config.user = userConfig;
        for(var key in self.config.user.settings){
            try{
                self.config.user.settings[key] = JSON.parse(self.config.user.settings[key]);
            }
            catch (err){
                console.log('Error parsing user setting: '+ key);
            }
        }
        for(var key in self.config.user.roleSettings){
            try{
                self.config.user.roleSettings[key] = JSON.parse(self.config.user.roleSettings[key]);
            }
            catch (err){
                console.log('Error parsing role setting: '+ key);
            }
        }
        self.userDetails = self.config.user;
        return self;
    },
    initializeErp: function(user){
        var self = this;
        self.setUserConfig(user)
		
		var getConfigurationUrl = '/configuration.json';
        if(window.IS_LOADED_FROM_LOCAL_CACHE){
            getConfigurationUrl = window.LOCAL_CACHE_SERVER_ROOT_URL + '/public/configuration.json';
        }
		
        $.ajax({
            url: getConfigurationUrl,
            cache: false,
            type: 'GET'
        }).success(function(data){
                window.erp = new ERP(data, {user: self});
                erp.elements.content.append(erp.container);
                self.hideLoginScreen();
                self.animation.hide();
                clearInterval(self.loggedInInterval);
            });
        return self;
    },
    configureSocket: function(socket, erp){
        var self = this;
        socket.on('get_users_done', function(responseObject){
            erp.initializeColumnAndModuleVisibility(responseObject);
        })
        return self;
    },
    clearUserConfig: function(){
        var self = this;
        self.config.user = self.userDetails = null;
        return self;
    },
    showLoginScreen: function (hasDirectLogin) {
        var self = this;
        self.show();
        self.setLoginScreenToInitialMode();
        if(hasDirectLogin){
            self.isDirectLogin = true;
            self.elements.showDirectLogin.hide();
            self.elements.hideDirectLogin.hide();
            self.showDirectLogin();
        }
        else{
            self.elements.showDirectLogin.show();
            self.elements.hideDirectLogin.show();
        }
        self.selectedUser && self.selectedUser.setSelectedUser();
        self.container.removeClass('remove-pointer-events');
        setTimeout(function(){
            self.container.addClass('user-panel-container-in');
            self.elements.usersPanel.addClass('user-panel-in');
        },0);

//        self._ui.reset(self);
//        self._animations.loginFormInAnimation(self);
        return self;
    },
    hideLoginScreen: function(){
        var self = this;
        if(self.hasdirectLogin){
            self.hideDirectLogin();
        }
        self.selectedUser && self.selectedUser.elements.password.val('');
        if(self.selectedUser && self.selectedUser.id == 'unknown'){
            self.selectedUser.elements.userName.val('');
        }
        self.container.removeClass('user-panel-container-in');
        setTimeout(function(){
            self.elements.usersPanel.removeClass('user-panel-in');
            self.setLoginScreenToInitialMode();
            self.elements.usersPanel.children().children().removeClass('user-container-logged-in');
            self.selectedUser && self.selectedUser.elements.userContainer.removeClass('user-container-active');
            self.selectedUser && self.selectedUser.elements.userContainer.removeClass('user-container-after-logged-in');
            self.hide();
        }, 500)
        return self;
    },
    _creation: {
        createElements: function(usersPanel){
            var self = this;

            var container = self.createContainer(usersPanel);
            var directLoginContainer = self.createDirectLoginContainer(usersPanel)

            var h1 = $(document.createElement('h1'));
            container.append(h1);

            var applicationLogo = $(document.createElement('a'))
                .text('Binary Technologies')
                .attr('href', 'https://binarytechs.in')
                .attr('target', '_blank')
                .attr(usersPanel.constants.applicationLogo);
            container.append(applicationLogo);


            var rayCloudSolutionsLogo = $(document.createElement('img'))
                .attr(usersPanel.constants.rayCloudSolutionsLogo);
            container.append(rayCloudSolutionsLogo);
			
			if(window.usersPanelPreferences && window.usersPanelPreferences.enableCompanyLogo){
                var companyLogo = $(document.createElement('img'))
                    .attr(usersPanel.constants.companyLogo);
                container.append(companyLogo);
            }

            container.appendTo(document.body);
            directLoginContainer.appendTo(document.body);

            usersPanel.container = container;
            usersPanel.directLoginContainer = directLoginContainer;
            usersPanel.elements.applicationLogo = applicationLogo;
            usersPanel.elements.rayCloudSolutionsLogo = rayCloudSolutionsLogo;
            usersPanel.elements.h1 = h1;

            return self;
        },
        createContainer: function(usersPanel){
            var self = this;
            var container = $(document.createElement('div')).attr(usersPanel.constants.container);
            var buttonContainer = self.createButtonContainer(usersPanel);
            container.append(buttonContainer);

            var panel = $(document.createElement('div')).attr(usersPanel.constants.usersPanel);
            panel.appendTo(container);
            var statusContainer = $(document.createElement('div')).attr(usersPanel.constants.statusContainer).appendTo(container);
            var status = $(document.createElement('div')).attr(usersPanel.constants.status).appendTo(statusContainer);
            usersPanel.elements.usersPanel = panel;
            usersPanel.elements.statusContainer = statusContainer;
            usersPanel.elements.status = status;
            return container;
        },
        createDirectLoginContainer: function(usersPanel){
            var directLoginContainer = $(document.createElement('div')).attr({class: "direct-login-container"});

            var buttonContainer = $(document.createElement('div')).attr({class: "user-panel-button-container"});
            var buttonElement = $(document.createElement('div')).attr({class: "user-panel-button-element"}).appendTo(buttonContainer);
            var button = $(document.createElement('button')).attr({class: "user-panel-button"}).appendTo(buttonElement)
            button.text('Close');
            usersPanel.elements.hideDirectLogin = button;
            buttonContainer .appendTo(directLoginContainer)
            var direcLoginPanel = $(document.createElement('div')).attr({class: "direct-login-panel"}).appendTo(directLoginContainer);

            usersPanel.elements.directLoginPanel = direcLoginPanel;
            return directLoginContainer;
        },
        createButtonContainer: function(usersPanel){
            var buttonContainer = $(document.createElement('div')).attr({class: "user-panel-button-container"});
            var buttonElement = $(document.createElement('div')).attr({class: "user-panel-button-element"}).appendTo(buttonContainer);
            var button = $(document.createElement('button')).attr({class: "user-panel-button"}).appendTo(buttonElement)
            button.text('Switch');
            usersPanel.elements.showDirectLogin = button;
            usersPanel.elements.buttonContainer = buttonContainer;
            return buttonContainer
        }
    },
    show: function(){
        var self = this;
        self.container.show();
        return self;
    },
    hide: function(){
        var self=  this;
        self.container.hide();
        return self;
    }
}