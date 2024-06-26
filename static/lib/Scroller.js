/**
 * Created by Akhil Sekharan on 6/3/14.
 */

function Scroller(config){
    var self = this;
    self.config = config;
    self.initialize();
    return self;
}

Scroller.prototype = {
    initialize: function(){
        var self = this;
        self.createElements();
        self.bindEvents();
        self.selectedIndex = 0;
        return self;
    },
    triggerOnChange: function(){
        var self = this;
        if(self.config.onChange){
            self.config.onChange.apply(self, [self.elements.scroller.children().eq(self.selectedIndex)]);
        }
        return self;
    },
    constants: {
        container: {
            "class": "scroller-container"
        },
        scroller: {
            "class": "scroller"
        },
        btnLeft: {
            "class": "scroller-button scroller-left-button"
        },
        btnRight: {
            "class": "scroller-button scroller-right-button"
        },
        pageIndicator: {
            "class": "scroller-page-indicator"
        },
        pageIndicatorItem: {
            "class": "scroller-page-indicator-item"
        }
    },
    bindEvents: function(){
        var self = this;
        self.elements.btnRight.on('click', function(){
            var currentTranslate = self.currentTranslate || 0;
            currentTranslate -= (self.scrollerWidth + 100);
            self.currentTranslate = currentTranslate;
            if((currentTranslate* -1) >= self.elements.scroller.width()){
                self.currentTranslate = currentTranslate = 0;
                self.selectedIndex = 0;
            }
            else{
                self.selectedIndex++;
            }
            var translateStr = 'translateX('+ currentTranslate +'px)';
            self.elements.scroller.css('-webkit-transform', translateStr);
            if(self.config.onChange){
                setTimeout(function(){
                    self.config.onChange.apply(self, [self.elements.scroller.children().eq(self.selectedIndex)]);
                }, 500)
            }
        });
        self.elements.btnLeft.on('click', function(){
            var currentTranslate = self.currentTranslate || 0;
            if(currentTranslate == 0){
                self.currentTranslate = currentTranslate = -1 *( self.elements.scroller.width() - self.scrollerWidth - 100);
                self.selectedIndex = parseInt(self.elements.scroller.width()/ self.scrollerWidth) - 1;
            }
            else{
                currentTranslate += (self.scrollerWidth + 100);
                self.selectedIndex--;
                self.currentTranslate = currentTranslate;
            }
            var translateStr = 'translateX('+ currentTranslate +'px)';
            self.elements.scroller.css('-webkit-transform', translateStr);
            if(self.config.onChange){
                setTimeout(function(){
                    self.config.onChange.apply(self, [self.elements.scroller.children().eq(self.selectedIndex)]);
                }, 300)
            }
        });
        return self;
    },
    createElements: function(){
        var self = this;
        var elements = {};
        var scroller = $(self.config.container).attr(self.constants.scroller);
        scroller.wrap('<div></div>');
        var container = scroller.parent().attr(self.constants.container);

        var btnLeft = $(document.createElement('button')).html('<').attr(self.constants.btnLeft);
        var btnRight = $(document.createElement('button')).html('>').attr(self.constants.btnRight);
        elements.btnRight = btnRight.appendTo(container);
        elements.btnLeft = btnLeft.appendTo(container);
        var scrollerWidth = scroller.width();
        scroller.children().addClass('scroller-item').css({width: scrollerWidth});
        scroller.css({width: (scrollerWidth+100) * scroller.children().length});
        self.scrollerWidth = scrollerWidth;

        var pageIndicator = $(document.createElement('ul')).attr(self.constants.pageIndicator);
        self.noOfChildren = scroller.children().length;
        for(var i=0; i< self.noOfChildren; i++){
            var li = $(document.createElement('ul')).attr(self.constants.pageIndicatorItem);
            li.attr({index: i}).appendTo(pageIndicator);
        }
        elements.pageIndicator = pageIndicator;
        pageIndicator.appendTo(elements.container);

        elements.scroller = scroller;
        self.container = container;

        self.elements = elements;

        elements.container = container;
        return self;
    },
    creation: {
        createElements: function(){

        }
    },
    initializes: function(){
        var self = this;
        return self;
    }
}