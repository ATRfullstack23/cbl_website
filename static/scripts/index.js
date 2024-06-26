
	(function (){       
		console.log('IS_LOADED_FROM_LOCAL_CACHE', IS_LOADED_FROM_LOCAL_CACHE);
	   if(window.IS_LOADED_FROM_LOCAL_CACHE){
			$.ajax({
				url: window.LOCAL_CACHE_SERVER_ROOT_URL + '/public/local_cache_trimmed_body.html',
				cache: false,
				async: false,
				type: 'GET'
			}).success(function(data){
					console.log('IS_LOADED_FROM_LOCAL_CACHE Ajax Done', data);
					document.body.innerHTML = data;				   
				});
	   }
    })();


    (function initializeUser(){
        var isInSession = false;
        var isUsersPanelCreated = false;
        var isDirectLogin = false;
        var userData = '';
        $.ajax({
            url: '/getAllUsers',
            type: 'GET'
        }).done(function(responseData){
            if(!responseData.error){
                window.usersPanel = new UsersPanel({
                    config: responseData.data,
                    onLogin: function(userData, usersPanel){
                        $.ajax({
                            url: '/login',
                            type: 'POST',
                            data: userData
                        }).done(function(data){
                            if(data.success){
                                setTimeout(function(){
                                    usersPanel.initializeErp(data.user);
                                }, 200);
                                usersPanel.setLoginSreenToLoggedInMode();
                            }
                            else{
                                if(userData.userName){
                                    usersPanel.showMessage(data);
                                }
                                console.log(data);
                                usersPanel.falseLogin(data);
//                                                user.showAnimation('loginFormIn');
                            }
                        });
                    }
                });

                if(responseData.data.length == 0){
                    isDirectLogin = true;
                }
                else{
                    isDirectLogin = false;
                }

                if(!isInSession){
                    isUsersPanelCreated = true;
                    window.usersPanel.showLoginScreen(isDirectLogin);
                }
                else{
                    window.usersPanel.container.addClass('remove-pointer-events');
                    usersPanel.isDirectLogin = isDirectLogin;
                    usersPanel.initializeErp(userData.user);
                }
            }
            else{
                console.log('error in database connection', responseData.errorMessage)
            }
        });

        if(window.userLoginStatus ){
            validateSessionCheck(window.userLoginStatus);
        }
        else{
            $.ajax({
                url: "/sessionCheck",
                type: "POST"
            }).done(function(data){
                validateSessionCheck(data);
            });
        }

        function validateSessionCheck(data){
            if(data.success){
                isInSession = true;
                userData = data;
                if(isUsersPanelCreated){
                    usersPanel.isDirectLogin = isDirectLogin;
                    usersPanel.container.addClass('remove-pointer-events');
                    usersPanel.initializeErp(userData.user);
                }
            }
        }

    })();

    (function initializeCryptoShim(){
		window.getRandomId = function(){
            var arr = crypto.getRandomValues(new Uint32Array(2));
            return arr[0] +''+ arr[1];
        }

        if(!window.crypto){
            window.crypto = {};
            window.crypto.getRandomValues = function(){
                return [Math.floor(Math.random(100000000)*100000000)];
            }
            window.getRandomId = function(){
                var arr = crypto.getRandomValues(new Uint32Array(2));
                return Math.floor(Math.random(10000000000000000)*10000000000000000);
            }
        }        

        if (!String.prototype.startsWith) {
            Object.defineProperty(String.prototype, 'startsWith', {
                enumerable: false,
                configurable: false,
                writable: false,
                value: function(searchString, position) {
                    position = position || 0;
                    return this.lastIndexOf(searchString, position) === position;
                }
            });
        }

        if (!String.prototype.endsWith) {
            String.prototype.endsWith = function(searchString, position) {
                var subjectString = this.toString();
                if (position === undefined || position > subjectString.length) {
                    position = subjectString.length;
                }
                position -= searchString.length;
                var lastIndex = subjectString.indexOf(searchString, position);
                return lastIndex !== -1 && lastIndex === position;
            };
        }

        if (!Array.prototype.findIndex) {
            Object.defineProperty(Array.prototype, 'findIndex', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: function(predicate) {
                    if (this == null) {
                        throw new TypeError('Array.prototype.find called on null or undefined');
                    }
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }
                    var list = Object(this);
                    var length = list.length >>> 0;
                    var thisArg = arguments[1];
                    var value;

                    for (var i = 0; i < length; i++) {
                        if (i in list) {
                            value = list[i];
                            if (predicate.call(thisArg, value, i, list)) {
                                return i;
                            }
                        }
                    }
                    return -1;
                }
            });
        }
    })();

    (function(){
        if(window.mozRequestAnimationFrame){
            window.browser = 'moz';
        }
        else if(window.webkitRequestAnimationFrame){
            window.browser = 'chrome';
        }
        else if(window.msRequestAnimationFrame){
            window.browser = 'msie';
        }
        else{
            window.browser = 'chrome';
        }
        document.body.classList.add(window.browser);
    })();



    var printToConsoleContent = (function(){
        /*
         ,---,
         ,---,     ,---.'|
         ,-+-. /  |    |   | :               .--.--.              .--.--.
         ,---.  ,--.'|'   |    |   | |   ,--.--.    /  /    '       .--, /  /    '
         /     \|   |  ,"' |  ,--.__| |  /       \  |  :  /`./     /_ ./||  :  /`./
         /    /  |   | /  | | /   ,'   | .--.  .-. | |  :  ;_    , ' , ' :|  :  ;_
         .    ' / |   | |  | |.   '  /  |  \__\/: . .  \  \    `./___/ \: | \  \    `.
         '   ;   /|   | |  |/ '   ; |:  |  ," .--.; |   `----.   \.  \  ' |  `----.   \
         '   |  / |   | |--'  |   | '/  ' /  /  ,.  |  /  /`--'  / \  ;   : /  /`--'  /
         |   :    |   |/      |   :    :|;  :   .'   \'--'.     /   \  \  ;'--'.     /
         \   \  /'---'        \   \  /  |  ,     .-./  `--'---'     :  \  \ `--'---'
         `----'               `----'    `--`---'                    \  ' ;
         `--`

         Hi there. Good to see you.
         Intrested in knowing more about Endasys. Check out, http://www.endasys.com.
         Looking forward to have a career with us. write to us at careers@endasys.com															  */
    }).toString();
    if(location.hostname == 'endasys.in'){
        console.log(printToConsoleContent.substring(25, printToConsoleContent.length - 15))
    }
