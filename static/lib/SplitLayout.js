/**
 * Created by Akhil Sekharan on 11/11/13.
 */
//var platformSplitLayoutConfig = {
//    container: $('#platform_split_layout'),
//    targetContainer: 'body',
//    direction: 'bottom',
//    zIndex: 2,
//    pageSize: "100%",
//    closeButton: ".split-layout-close-button",
//    onShowForFirstTime: function(){
//        window.platformScroller.triggerOnChange();
//    },
//    onAfterShow: function(splitLayout){
////        console.log('hiding')
//        window.backgroundParallax.hide();
//    },
//    onAfterHide: function(splitLayout){
//        window.backgroundParallax.show();
//    }
//}
//window.platformSplitLayout = new SplitLayout(platformSplitLayoutConfig);


function SplitLayout(config, parentObject){
    var self = this;
    self.parentObject = parentObject;
    self.config = config || {};
    self.initialize();
    return self;
}

SplitLayout.prototype = {
    visibleSplitLayout: undefined,
    initialize: function(){
        var self = this;
        $.extend(self.config, self.defaultConfig);
        self.createElements();
        self.bindEvents();
        self.hide({preventAnimation: true});
        return self;
    },
    defaultConfig: {
        moveTarget: false,
        pageWidth: "100%"
    },
    constants: {
        container:{
            "class": "split-layout"
        },
        page:{
            "class": "split-layout-page"
        },
        targetContainer:{
            "class": "tranlate-margin-left-right"
        }
    },
    createElements: function(){
        var self = this;

        var elements = {};
        var container = $(document.createElement('div')).attr(self.constants.container);
        var page = $(self.config.container).addClass(self.constants.page.class);
        page.wrap(container);
        container = page.parent();

        if(self.config.zIndex){
            container.css({zIndex: self.config.zIndex});
        }
        if(self.config.pageSize){
            page.css({width: self.config.pageSize});
        }
        if(self.config.closeButton){
            elements.closeButton = page.find(self.config.closeButton);
        }

        elements.container = container;
        elements.targetContainer = $(self.config.targetContainer).addClass(self.constants.targetContainer.class);
        elements.page = page;
        self.container = container;

        container.addClass('split-layout-'+ self.config.direction);

        self.elements = elements;

        return self;
    },
    bindEvents: function(){
        var self = this;
        self.container.on('click', function(event){
            if($(event.target).is(self.container)){
                self.hide();
            }
        });
        $(document.body).on('keydown', function(event){
            if(!self.isVisible ){
                return;
            }
           if(event.keyCode == 27){
               self.hide();
           }
        });
        $(window).on('resize', function(){
            if(!self.isVisible ){
                self.hide({preventAnimation: true});
            }
        });
        if(self.elements.closeButton){
            self.elements.closeButton.on('click', function(){
                self.parentObject.elements.directActionButton.show();
                self.hide()
            });
        }
        return self;
    },
    destroy: function(){
        var self = this;
        self.config.container.appendTo(self.config.targetContainer);
        self.container.remove();
        return self;
    },
    show: function(){
        var self = this;
        self.isVisible = true;
        if(!self.isVisibleForFirstTime){
            self.isVisibleForFirstTime = true;
            if(self.config.onShowForFirstTime){
                self.config.onShowForFirstTime(self);
            }
        }
        if(SplitLayout.prototype.visibleSplitLayout){
            SplitLayout.prototype.visibleSplitLayout.hide();
        }
        SplitLayout.prototype.visibleSplitLayout = self;
        self.showAnimation('in');
//        var arr = [];
//        var zIndex = $('.'+ self.constants.container.class+'.visible').each(function(){
//            arr.push($(this).css('z-index'));
//        });
//        if(arr.length){
//            zIndex = arr.sort()[arr.length-1];
//        }
//        if(!zIndex){
//            zIndex = self.config.zIndex + 1;
//        }
//        else{
//            zIndex++;
//        }
        self.container.addClass('visible');

        self.container.css('z-index', self.config.zIndex+1);
        if(self.config.onAfterShow){
            self.config.onAfterShow(self);
        }
        return self;
    },
    hide: function(options){
        var self = this;
        options = options || {};
        if(self.config.onBeforeHide){
            self.config.onBeforeHide(self);
        }
        self.isVisible = false;
        self.container.css('z-index', self.config.zIndex);
        SplitLayout.prototype.visibleSplitLayout = undefined;
        self.showAnimation('out', options);
        if(self.config.onAfterHide){
            self.config.onAfterHide(self);
        }
        setTimeout(function(){
            self.container.removeClass('visible');
        }, 300);
        return self;
    },
    showAnimation: function(type, options){
        var self = this;
        self.animations.showAnimation(type, options, self);
        return self;
    },
    get isHorizontal(){
        var self  = this;
        if(self.config.direction == 'left' || self.config.direction == 'right'){
            return true;
        }
        else{
            return false;
        }
    },
    animations: {
        showAnimation: function(type, options, splitLayout){
            var self = this;
            if(options && options.preventAnimation){
                splitLayout.container.css('transition', 'none');
            }
            switch (type){
                case "in":
                    self.showInAnimation(splitLayout);
                    break;
                case "out":
                    self.showOutAnimation(splitLayout);
                    break;
            }
            if(options && options.preventAnimation){
                setTimeout(function(){
                    splitLayout.container.css('transition', '');
                }, 100);
            }
            return self;
        },
        showInAnimation: function( splitLayout){
            var self = this;
            var cssObj = {};
//            cssObj[splitLayout.config.direction] = "0px";
            switch (splitLayout.config.direction){
                case "bottom":
                case "top":
                    cssObj["-webkit-transform"] = "translateY(0%)";
                    cssObj["-moz-transform"] = "translateY(0%)";
                    cssObj["-ms-transform"] = "translateY(0%)";
                    break;
                case "left":
                case "right":
                    cssObj["-webkit-transform"] = "translateX(0%)";
                    cssObj["-moz-transform"] = "translateX(0%)";
                    cssObj["-ms-transform"] = "translateX(0%)";
                    break;
            }
            //cssObj['top'] = "0px";
            splitLayout.container.css(cssObj);
            cssObj={};
//            cssObj.opacity = .1;
//            if(splitLayout.config.direction === 'left'){
//                cssObj["margin-left"] = splitLayout.elements.page.width() +"px";
//            }
//            else{
//                cssObj["margin-left"] = "-"+splitLayout.elements.page.width()* .8 +"px";
//            }
//            splitLayout.elements.targetContainer.css(cssObj);
            return self;
        },
        showOutAnimation: function( splitLayout){
            var self = this;

            var value = 0;

            if(self.isHorizontal){
                value = splitLayout.container.width()*-1;
            }
            else{
                value = splitLayout.container.height()*-1;
            }

            var cssObj = {};

            switch (splitLayout.config.direction){
                case "bottom":
                    cssObj["-webkit-transform"] = "translateY(100%)";
                    cssObj["-moz-transform"] = "translateY(100%)";
                    cssObj["-ms-transform"] = "translateY(100%)";
                    break;
                case "top":
                    cssObj["-webkit-transform"] = "translateY(-100%)";
                    cssObj["-moz-transform"] = "translateY(-100%)";
                    cssObj["-ms-transform"] = "translateY(-100%)";
                    break;
                case "left":
                    cssObj["-webkit-transform"] = "translateX(-100%)";
                    cssObj["-moz-transform"] = "translateX(-100%)";
                    cssObj["-ms-transform"] = "translateX(-100%)";
                    break;
                case "right":
                    cssObj["-webkit-transform"] = "translateX(100%)";
                    cssObj["-moz-transform"] = "translateX(100%)";
                    cssObj["-ms-transform"] = "translateX(100%)";
                    break;
            }

            splitLayout.container.css(cssObj);

            return self;
        }
    }
}