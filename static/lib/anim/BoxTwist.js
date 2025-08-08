/**
 * Created by Jithu Jose on 12/24/13.
 */

function BoxTwistAnimation(config){
    var self = this;
    self.config = config;
    self.initialize();
    return self;
}

BoxTwistAnimation.prototype = {
    initialize: function(){
        var self =this;
        return self;
    },
    show: function(config, options){
        var self = this;
        var container = $(config.container);
        var absorbContainer = $(config.absorbContainer);
        container.css('-webkit-transform')//Fix for not opening with 3d transfrom for the first time in chrome

        self._animations.showAnimation(self, container, absorbContainer, options);
        return self;
    },
    hide: function(config, options){
        var self = this;
        var container = $(config.container);
        var absorbContainer = $(config.absorbContainer);
        self._animations.hideAnimation(self, container, absorbContainer, options);
        return self;
    },
    _animations:{
        showAnimation: function(boxTwist, container, absorbContainer, options){
            var self = this;
            self.hideAnimation(boxTwist, container, absorbContainer, {preventAnimation: true});
            if(options.preventAnimation){
                container.removeClass('box_twist_animation');
            }
            else{
                container.addClass('box_twist_animation');
            }
            // container.css('-webkit-transform', 'rotateY(0deg) scale(1,1)');
            return self;
        },
        hideAnimation: function(boxTwist, container, absorbContainer, options){
            var self = this;
            if(options.preventAnimation){
                container.removeClass('box_twist_animation');
            }
            else{
                container.addClass('box_twist_animation');
            }
            var position = boxTwist.translateDistanceFinder(container, absorbContainer);
//            console.log(absorbContainer.get(0), position)
//            container.css('-webkit-transform', 'translateX('+position.translateX+'px) translateY('+position.translateY+'px) rotateY(-200deg) scale(0.0,0.0)');
//             container.css('-webkit-transform', ' scale(1.0,0.0)');
//            if(options.preventAnimation){
//                container.addClass('box-twist-animation');
//            }
            return self;
        }
    },

//    this function will find the dimension needed to be specify in the translate function of transform attribute
//    And the value returned from this function is calculated by using the
//    height, width, position of the container to hide and the position of absorbing container
    translateDistanceFinder: function(container, absorbContainer){
        var self = this;
        if(!absorbContainer.length){
            absorbContainer = $(document.body);//Dirty fix. need to remove
        }
        var absorbLeft = absorbContainer.position().left;
        var absorbTop = absorbContainer.position().top;
        var containerHeight = container.height();
        var containerWidth = container.width();
        var containerTop = container.position().top;
        var containerLeft = container.position().left;
        var translateObj = {};

//        the calculations to get the translated position
        var left =  ((containerLeft-11)+(containerWidth/2))*(-1);
        var top = ((containerTop-11)+(containerHeight/2))*(-1);
        left = left + absorbLeft;
        top = top + absorbTop;
        translateObj.translateX = left;
        translateObj.translateY = top;
        return translateObj
    }
}

