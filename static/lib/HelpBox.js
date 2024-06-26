/**
 * Created by Jithu on 7/17/14.
 */
function HelpBox(parentObject){
    var self = this;
    self.erp = parentObject;
    self.initialize();
    return self;
}

HelpBox.prototype = {
    constants: {
        container: {
            class: "helpBoxContainer"
        },
        helpBoxElement: {
            class: "helpBox"
        }
    },
    initialize: function(){
        var self = this;
        self.createElements().bindEvents();
        return self;
    },
    createElements: function(){
        var self = this;
        self.elements = {};
        self._creation.createElements(self);
        return self;
    },
    bindEvents: function(){
        var self = this;
        return self;
    },
    _creation: {
        createElements: function(helpBox){
            var self = this;
            var container = document.createElement('div');
            container.className = helpBox.constants.container.class;

            var arrow = document.createElement('div');
            arrow.className = 'helpBoxArrow';
            container.appendChild(arrow);

            var helpBoxElement = document.createElement('div');
            helpBoxElement.className = helpBox.constants.helpBoxElement.class;
            container.appendChild(helpBoxElement);

            helpBox.container = $(container);
            helpBox.elements.helpBoxElement = helpBoxElement;
        }
    },
    show: function(left, top, data){
        var self = this;
        (top < 17) && (top = 17); // to adjust top to screen top

        var adjustedTop = top - 17;//to get arrow position to clicked place
        var adjustedLeft = left + 12;//to get arrow position to clicked place

        if(data && data != 'undefined'){
            self.elements.helpBoxElement.innerHTML = data;
        }
        else{
            self.elements.helpBoxElement.innerHTML = 'to understand this part no help is needed'
        }

        var containerWidth = self.container.width();
        //to adjust position to screen size
        (adjustedLeft + containerWidth) > self.erp.windowWidth && (adjustedLeft = self.erp.windowWidth - containerWidth);

        self.container.show();
        self.container.css({left: adjustedLeft+"px", top: adjustedTop+"px"});
        setTimeout(function(){
            self.container.addClass('showHelpBox');
        }, 0);
        return self;
    },
    hide: function(){
        var self = this;
        self.container.css({left:"", top: ""});
        self.container.removeClass('showHelpBox');
        setTimeout(function(){
            self.container.hide()
        }, 350);
        return self;
    }
}
