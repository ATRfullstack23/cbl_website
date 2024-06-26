/**
 * Created by Jithu Jose on 12/24/13.
 */

function BoxUpAnimation(){
    var self = this;
    self.initialize();
    return self;
}

BoxUpAnimation.prototype = {
    initialize: function(){
        var self =this;
        return self;
    },
    show: function(container, options){
        var self = this;
        self._animations.showAnimation(self, container, options);
        return self;
    },
    initializeElement: function(container){
        var self = this;
        container.addClass('box-up-animation');
    },
    hide: function(container, options){
        var self = this;
        self._animations.hideAnimation(self, container, options);
//        if(options && options.removeElement){
//            setTimeout(function(){
//                container.remove();
//            }, 300)
//        }
        return self;
    },
    _animations:{
        showAnimation: function(boxUp, container, options){
            var self = this;
            container.addClass('box-up-animation-visible');
            return self;
        },
        hideAnimation: function(boxUp, container, options){
            var self = this;
            container.removeClass('box-up-animation-visible');
            return self;
        }
    }
}




function GridDataAnimation(){
    var self = this;
    self.initialize();
    return self;
}

GridDataAnimation.prototype = {
    initialize: function(){
        var self =this;
        return self;
    },
    show: function(container, options){
        var self = this;
        self._animations.showAnimation(self, container, options);
        return self;
    },
    initializeElement: function(container){
        var self = this;
        container.addClass('grid-data-animation');
    },
    hide: function(container, options){
        var self = this;
        self._animations.hideAnimation(self, container, options);
//        if(options && options.removeElement){
//            setTimeout(function(){
//                container.remove();
//            }, 300)
//        }
        return self;
    },
    _animations:{
        showAnimation: function(boxUp, container, options){
            var self = this;
            container.addClass('grid-data-animation-visible');
            return self;
        },
        hideAnimation: function(boxUp, container, options){
            var self = this;
            container.removeClass('grid-data-animation-visible');
            return self;
        }
    }
}