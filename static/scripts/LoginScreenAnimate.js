/**
 * Created by Jithu on 6/18/14.
 */
function LoginScreenAnimate(){
    var self = this;
    self.elements = {};
    self.message = '';
    self.initialize();
    return self;
}

LoginScreenAnimate.prototype = {
    constants: {
        container: {
            class: "login-animate-container"
        },
        animateContainer: {
            class: "animate-container"
        },
        animateContent: {
            class: "animate-content"
        }
    },
    initialize: function(){
        var self = this;
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
        return self;
    },
    _creation: {
        createElements: function(loginScreenAnimate){
            var self = this;
            var container = self.createContainer(loginScreenAnimate);
            container.appendTo(document.body);
            var dotPosition = loginScreenAnimate.elements.dot1.position()
            loginScreenAnimate.container = container;
            return self;
        },
        createContainer: function(loginScreenAnimate){
            var container = $(document.createElement('div')).attr(loginScreenAnimate.constants.container);
            var animateContainer = $(document.createElement('div')).attr(loginScreenAnimate.constants.animateContainer).appendTo(container);
            var animateContent = $(document.createElement('div')).attr(loginScreenAnimate.constants.animateContent).appendTo(animateContainer);
            var dot1 = $(document.createElement('span')).text(' . ').attr({class: "scroll-dot"}).appendTo(animateContainer);
            var dot2 = $(document.createElement('span')).text('. ').attr({class: "scroll-dot"}).appendTo(animateContainer);
            var dot3 = $(document.createElement('span')).text('.').attr({class: "scroll-dot"}).appendTo(animateContainer);
            loginScreenAnimate.elements.animateContainer = animateContainer;
            loginScreenAnimate.elements.animateContent = animateContent;

            loginScreenAnimate.elements.dot1 = dot1;
            loginScreenAnimate.elements.dot2 = dot2;
            loginScreenAnimate.elements.dot3 = dot3;
            return container;
        }
    },

    show: function(message){
        var self = this;
        clearTimeout(self.time1);
        clearTimeout(self.time2);
        clearTimeout(self.time3);

        self.container.removeClass('animate-scroll-in-container');
        self.elements.dot1.removeClass('animate-dot');
        self.elements.dot2.removeClass('animate-dot');
        self.elements.dot3.removeClass('animate-dot');        
        self.elements.animateContent.text(message);
        setTimeout(function(){
            self.container.addClass('animate-scroll-in-container');
            self.time1 = setTimeout(function(){
                self.elements.dot1.addClass('animate-dot');
                self.time2 = setTimeout(function(){
                    self.elements.dot2.addClass('animate-dot');
                    self.time3 = setTimeout(function(){
                        self.elements.dot3.addClass('animate-dot');
                    }, 1000)
                }, 1000)
            }, 900)
        }, 100);

        return self;
    },

    hide: function(){
        var self = this;
        self.container.addClass('login-animate-container-out');
        return self;
    }
}