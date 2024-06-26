/**
 * Created by Jithu on 6/13/14.
 */
function NewUser(config, parentObject){
    var self = this;
    self.parentObject = parentObject;
    self.config = config;
    self.id = config.id;
	self.image = config.image;
    self.initialize();
    self.elements.password.val('1234');
    return self;
}

NewUser.prototype = {
    constants: {
        container : {
            class: "user-container"
        },
        user: {
            class: "user"
        },
        userNameContainer: {
            class: "user-name-container"
        },
        userPasswordContainer: {
            class: "user-password-container"
        },
        userIconContainer: {
            class: "user-icon-container"
        },
        buttonContainer: {
            class: "login-buttons-container"
        },
        loginButtonContainer: {
            class: "login-button-container"
        },
        loginButton: {
            class: "login-button"
        }
    },
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
    bindEvents: function(){
        var self = this;
        self.elements.password.bindEnterButton(self.elements.loginButton);
        self.elements.userName.bindEnterButton(self.elements.loginButton);
        self.elements.loginButton.on('click', function(eve){
            eve.stopPropagation();
            self.loginButtonClicked();
        });
        if(self.id != 'unknown'){
            self.container.on('click', function(eve){
                eve.stopPropagation();
                self.setSelectedUser();
            });
        }

        return self;
    },
    unsetSelectedUser: function(){
        var self = this;
        self.showPassWordAndLoginButton();
        self.container.removeClass('user-main-container-selected');
        return self;
    },
    setSelectedUser: function(){
        var self = this;
        for(var key in self.parentObject.users){
            var user = self.parentObject.users[key];
            user.container.addClass('user-main-container-not-selected');
            user.container.removeClass('user-main-container-selected');

            user.elements.userContainer.addClass('user-container-not-selected');
            user.elements.userContainer.removeClass('user-container-selected');
            user.elements.userName.addClass('login-user-name-not-selected');
            user.hidePassWordAndLoginButton();

            user.elements.userIcon.removeClass('login-icon-selected');
            user.elements.userIconContainer.removeClass('user-icon-container-selected');
            user.elements.userNameContainer.removeClass('user-name-container-selected');
        }
        setTimeout(function(){
            self.showPassWordAndLoginButton();
        }, 250);
        self.container.removeClass('user-main-container-not-selected');
        self.container.addClass('user-main-container-selected');

        self.elements.userNameContainer.addClass('user-name-container-selected');

        self.elements.userContainer.removeClass('user-container-not-selected');
        self.elements.userContainer.addClass('user-container-selected');
        self.elements.userName.removeClass('login-user-name-not-selected');
        self.elements.userIcon.addClass('login-icon-selected');
        self.elements.userIconContainer.addClass('user-icon-container-selected');
        self.parentObject.setPositionOfUsers();
        return self;
    },
    showPassWordAndLoginButton: function(){
        var self = this;
        self.elements.userPassWordContainer.show();
        if(self.id == 'unknown'){
            self.elements.userName.focus();
        }
        else{
            self.elements.password.focus();
        }

        self.elements.buttonContainer.show();
        return self;
    },
    hidePassWordAndLoginButton: function(){
        var self = this;
        self.elements.userPassWordContainer.hide();
        self.elements.buttonContainer.hide();
        return self;
    },
    loginButtonClicked: function(){
        var self = this;
        if(self.checkLoginContainer()){
            var userName = '';
            if(self.id == 'unknown'){
                userName = self.elements.userName.val();
                self.config.userName = userName;
            }
            else{
                userName = self.elements.userName.text()
            }
            var data = {
                userName: userName,
                password: self.elements.password.val()
            };
            self.parentObject.login(data, self);

        }
        return self;
    },
    checkLoginContainer: function(){
        var self = this;
        var ret = false;
        if(self.elements.password.val()){
            ret = true;
        }
        return ret;
    },
    _creation: {
        createElements: function(newUser){
            var self = this;
            var container = self.createContainer(newUser);
            var userIconContainer = self.createUserIconContainer(newUser);
            var userNameContainer = self.createUserNameContainer(newUser);
            var userPassWordContainer = self.createUserPassWordContainer(newUser);
            var buttonContainer = self.createButtonContainer(newUser);
            userPassWordContainer.hide();
            buttonContainer.hide();

            newUser.elements.user.append(userIconContainer);
            container.append(userNameContainer);
            var passwordButtonContainer = $(document.createElement('div')).appendTo(container);
            if(newUser.id === 'unknown'){
                passwordButtonContainer.attr({class: "password-button-container-unknown"});
            }
            else{
                passwordButtonContainer.attr({class: "password-button-container"});
            }
            passwordButtonContainer.append(userPassWordContainer);
            passwordButtonContainer.append(buttonContainer);
            newUser.elements.userIconContainer = userIconContainer;
            newUser.elements.userNameContainer = userNameContainer;
            newUser.elements.userPassWordContainer = userPassWordContainer;
            newUser.elements.buttonContainer = buttonContainer;
            newUser.container = container;
            return self;
        },
        createContainer: function(newUser){
            var container = $(document.createElement('div')).attr({class: "user-main-container"});
            var userContainer = $(document.createElement('div')).attr(newUser.constants.container).appendTo(container);
            var user = $(document.createElement('div')).attr(newUser.constants.user);

            newUser.elements.user = user;
            newUser.elements.userContainer = userContainer;
            userContainer.append(user);
            return container;
        },
        createUserIconContainer: function(newUser){
            var userIconContainer = $(document.createElement('div')).attr(newUser.constants.userIconContainer);
            var loginIcon = $(document.createElement('div')).attr({class: "login-icon"}).appendTo(userIconContainer);
            newUser.elements.userIcon = loginIcon;
			if(newUser.image && newUser.id != 'unknown'){
				var extensionArr = newUser.image.split('.');
				var extension = extensionArr[extensionArr.length-1];
				loginIcon.css({background: "url('uploads/_users/_users/"+newUser.id+"_image."+extension+"')no-repeat", "background-size": "100%"});
			}			
            return userIconContainer;
        },
        createUserNameContainer: function(newUser){
            var userNameContainer = $(document.createElement('div')).attr(newUser.constants.userNameContainer);
            var userName = $(document.createElement('div')).attr({class: "login-user-name"}).appendTo(userNameContainer);
            if(newUser.id == 'unknown'){
                var name = $(document.createElement('input')).attr({class: "login-name-input"}).appendTo(userName);
           }
            else{
                var name = $(document.createElement('span')).attr({class: "login-name"}).appendTo(userName);
                name.text(newUser.config.userName);
            }
            newUser.elements.userName = name;
            return userNameContainer;
        },
        createUserPassWordContainer: function(newUser){
            var userPasswordContainer = $(document.createElement('div')).attr(newUser.constants.userPasswordContainer);
            var userPassword = $(document.createElement('div')).attr({class: "login-user-password"}).appendTo(userPasswordContainer);
            var password = $(document.createElement('input')).attr({class: "login-password", type: "password"}).appendTo(userPassword);
            newUser.elements.password = password
            return userPasswordContainer;
        },
        createButtonContainer: function(newUser){
            var buttonContainer = $(document.createElement('div')).attr(newUser.constants.buttonContainer);
            var loginButton = $(document.createElement('div')).attr(newUser.constants.loginButtonContainer).appendTo(buttonContainer);

//            loginButton.text('Login');
            newUser.elements.loginButton = loginButton;
            return buttonContainer;
        }
    }
}
