/**
 * ------------------------------------------------------------------------
 * Created by Akhil Sekharan on 11/5/13.
 * ------------------------------------------------------------------------
 * User
 * Creates Basic User authentication Interface and functions
 * ------------------------------------------------------------------------
 * Dependencies
 * ------------------------------------------------------------------------
 * Notifier
 * jquery.transit.js
 * ------------------------------------------------------------------------
 * ------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------
 *  {
        login: {
            formTitle: "Login",//The Login Title of the Form
            userNameHint: "username",//The Placeholder of the User name Textbox
            passwordHint: "password",//The Placeholder of the User name Textbox
            onLogin: function(user){// Called when user clicks login button
            },
            onInitialize: function(user){// Called when the object is Initialized
            }
        }
    }
 * -------------------------------------------------------------------------
 */


function User(config) {
    var self = this;
    self.config = config;
    self.initialize();
    self.elements.txtUserName.val('admin');
    self.elements.txtPassword.val('1234');
    //self.login();
    return self;
}

User.prototype = {
    initialize: function () {
        var self = this;
        self.createElements();
        self.notifier = new Notifier({
            container: self.elements.container
        });
        self.elements.btnLogout = $(document.body).find('#logout')
        self.bindEvents();
        if(self.config.login.onInitialize){
            self.config.login.onInitialize.apply(self, [self]);
        }
        // setTimeout(function () {
        //     self.elements.txtUserName.blur();
        // }, 100);
//      self.showAnimation('loginFormIn');


        if(globalElements.body.hasClass('mobile')){
            self.elements.formLogin.after(self.container.find('.leftcontent'));
        }

        return self;
    },
    configureSocket: function(socket, erp){
        var self = this;

        socket.on('get_users_done', function(responseObject){
            erp.initializeColumnAndModuleVisibility(responseObject);
        })
        return self;
    },

    initializeErp: function(user){
        var self = this;
        globalElements.body.removeClass('notLoggedIn');
        self.setUserConfig(user)
        $.ajax({
            url: '/configuration.json',
            cache: false,
            type: 'GET'
        }).success(function(data){
            window.erp = new ERP(data, {user: self});
            window.erp.elements.content.prepend(erp.container);
        });
        return self;
    },
    bindEvents: function () {
        var self = this;
        self.elements.formLogin.on('keyup focus', '#username,#password', function(){
            self.elements.btnLogin.prop('disabled', !self.validateForm());
        });
        self.elements.txtUserName.bindEnterButton(self.elements.btnLogin);
        self.elements.txtPassword.bindEnterButton(self.elements.btnLogin);
        self.elements.btnLogin.on('click', function(eve){
            eve.preventDefault();
            // self._animations.loginFormOutAnimation(self);
            self.login();
        });
        // self.elements.formLogin.draggable();

        self.elements.btnLogout.on('click', function(){
            self.logout();
            setTimeout(function(){
                location.href = location.href.substring(0, location.href.indexOf('#'));
            }, 1000);
        });



        if(globalElements.body.hasClass('mobile')){
            self.container.on('focus', 'input', function () {
                self.container.addClass('onScreenKeyboardShowing');
            });
            self.container.on('blur', 'input', function () {
                self.container.removeClass('onScreenKeyboardShowing');
            });

            if(self.config.allUsers.length){
                self.addAllUsersDatalistOptions();
            }

        }
        else{
            if(self.config.allUsers.length){
                self.elements.txtUserName.on('focus', function () {
                    self.showUserListPopup();
                });
                self.elements.txtUserName.on('blur', function () {
                    self.hideUserListPopup();
                });

                self.elements.userListPopup.on('click', 'li', function () {
                    self.elements.txtUserName.val( $(this).attr('data-user-name'));
                    self.elements.txtPassword.focus();
                });
                self.elements.txtUserName.on('input', ()=>{
                    self.filterUserListPopupItems();
                });
            }
        }

        return self;
    },
    filterUserListPopupItems: function(){
        const self = this;
        let to_filter = self.elements.txtUserName.val().toLowerCase().trim();
        if(!to_filter.length){
            self.elements.userListPopup.children().show();
            return;
        }
        self.elements.userListPopup.children().hide();
        self.elements.userListPopup.children().each(function () {
            let element = $(this);
            if(element.attr('data-user-name').toLowerCase().indexOf(to_filter) !== -1){
                element.show();
            }
        })
    },
    showUserListPopup: function(){
        var self = this;
        self.elements.userListPopup.fadeIn('fast');
        return;
    },
    hideUserListPopup: function(){
        var self = this;
        self.elements.userListPopup.fadeOut('fast');
        return;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);

        self.elements.appDisplayName.text(self.config.applicationInfo.displayName);
        self.elements.appDescription.html( self.config.applicationInfo.description + '<br/>' + self.elements.appDescription.html());

        return self;
    },
    logout: function(){
        var self = this;
        self.config.login.onLogout.apply(self, [self]);
        return self;
    },
    login:function(){
        var self = this;
        var data = {
            userName: self.elements.txtUserName.val(),
            password: self.elements.txtPassword.val()
        };
        var isOk = self.config.login.onLogin.apply(self, [data, self]);
        if(isOk){
            self._animations.loginFormOutAnimation(self);
        }
//        $.ajax({
//            type: 'POST',
//            url: '/login',
//            data: data
//        }).success(function(data){
//                if(data.error){
//                    self.notifier.show(data.errorMessage);
//                    self._animations.loginFormInAnimation(self);
//                }
//                else{
//                    self.user = data.user;
//                    self.notifier.show('Welcome '+ self.user.fullName);
////                    self.app.adminLoggedIn(self);
//                    setTimeout(function(){
//                        self._animations.loginContainerOutAnimation(self);
//                    }, 100);
//                }
//            });
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
                            var data = {
                                userName: self.elements.txtUserName.val(),
                                password: self.elements.txtPassword.val()
                            };
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
                                        self.login();
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
            self.showInlineMessage(data.errorMessage)
        }
        else{
            self.notifier.showSuccessNotification(data, options);
        }
        return self;
    },
    setUserConfig: function(userConifg){
        var self = this;
        self.config.user = userConifg;
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
    clearUserConfig: function(){
        var self = this;
        self.config.user = self.userDetails = null;
        return self;
    },
    showAnimation: function(animationType){
        var self = this;

        switch(animationType){
            case "loginFormIn":
                self._animations.loginFormInAnimation(self);
                break;
            case "loginFormOut":
                self._animations.loginContainerOutAnimation(self);
                break;
        }

        return self;
    },
    validateForm: function(){
        var self = this;
        if(!self.elements.txtUserName.val()){
            return false;
        }
        if(!self.elements.txtPassword.val()){
            return false;
        }
        return true;
    },
    showLoginScreen: function () {
        var self = this;
        self.container.show();
        self.elements.txtUserName.val('');
        self.elements.txtPassword.val('');
        self._ui.reset(self);
        self._animations.loginFormInAnimation(self);
        return self;
    },
    hideLoginScreen: function () {
        var self = this;
        self.container.hide();
//        $('#body_wrapper').show();
//        self.app.navPointer.setDefaultValue();
        return self;
    },
    cancel: function () {
        var self = this;
        return self;
    },
    _animations: {
        loginContainerOutAnimation: function(user){
            var container = user.container;
            container.transition({opacity: 0}, function(){
                user.hideLoginScreen();
            });
        },
        loginFormInAnimation: function(user){
            var sidebar = user.elements.sidebar;
            sidebar.transition({opacity: 1, right: 0});

            var formLogin = user.elements.formLogin;
            formLogin.transition({opacity: 1});
            formLogin.css( 'transform', 'translateX(0px)' );
        },
        loginFormOutAnimation: function(user){
            var formLogin = user.elements.formLogin;
            formLogin.transition({opacity: .50});


            var sidebar = user.elements.sidebar;
            sidebar.transition({right: '-20px'});
        }
    },
    addAllUsersDatalistOptions : function (user) {
        var self = this;

        var datalistId = 'allUsersDataList';
        var datalist = $(document.createElement('datalist'));
        datalist.attr('id', datalistId);
        self.config.allUsers.forEach(function (userInfo) {
            var option = $(document.createElement('option'));
            option.attr('value', userInfo.userName);
            option.appendTo(datalist);
        });
        self.elements.txtUserName.after(datalist);
        self.elements.txtUserName.attr('list', datalistId)
        return self;
    },
    _creation : {
        createElements: function(user){
            var self = this;
            var config = user.config.login;
            var elements = {};
            var container = $('#loginContainer');
            elements.container = container;
            elements.txtUserName = container.find('#txtUsername');
            elements.txtPassword = container.find('#txtPassword');
            elements.appDisplayName = container.find('#appDisplayName');
            elements.appDescription = container.find('#appDescription');
            elements.spanWelcomeMessage = container.find('#welcome_message');
            elements.sidebar = container.find('.sidebar');
            elements.formLogin = container.find('#loginForm');
            elements.btnLogin = container.find('#btnDoLogin');
//          elements.btnCreateNewApplication = container.find('#btnCreateNewApplication');
//          elements.ddlProject = container.find('#project');
            elements.divInlineMessage = container.find('#divInlineMessage');


            if(config.formTitle){
                elements.spanWelcomeMessage.text(config.formTitle);
            }
            if(config.userNameHint){
                elements.txtUserName.attr('placeholder',config.userNameHint);
            }
            if(config.passwordHint){
                elements.txtPassword.attr('placeholder',config.passwordHint);
            }
            if(config.btnLoginText){
                elements.btnLogin.text(config.btnLoginText);
            }
            user.container = container;
            user.elements = elements;

            self.createAllUsersList(user);

            return self;
        },
        allUsersListItemHtml: '<li class="user-list-item">'+
        '<img src="/pic/userIcon.jpg"><span></span>'+
        '</li>',

        createAllUsersList : function (user) {
            var self = this;

            var ul = $(document.createElement('ul'))
                .attr('id', 'userListPopup')

            user.config.allUsers.forEach(function (userInfo) {
                var div = $(self.allUsersListItemHtml);
                div.attr('data-user-name', userInfo.userName);

                // console.log('maknig',userInfo)

                if(userInfo.image){
                    div.children().eq(0).attr('src', userInfo.image.url);
                }
                div.children().eq(1).text(userInfo.userName);
                div.appendTo(ul);
            });

            ul.hide();
            user.elements.userListPopup = ul;
            user.elements.formLogin.append(ul)

            return self;
        }
    },
    showInlineMessage: function(message){
        var self = this;

        self.elements.divInlineMessage.css('opacity', 0);
        self.elements.divInlineMessage.text(message);

        // setTimeout(function () {
        self.elements.divInlineMessage.css('opacity', '1');
        // }, 10);
        return self;
    },
    showLoadingOverlay: function(){
        var self = this;
        self.elements.container.addClass('loading');
        return self;
    },
    hideLoadingOverlay: function(){
        var self = this;
        self.elements.container.removeClass('loading');
        return self;
    },
    _events   : {
    },
    _ui       : {
        reset: function(user){
            user.elements.formLogin.removeAttr('style');
            return user;
        }
    }
};
