/**
 * Created by Jithu on 7/5/14.
 */
function DirectActionButton(config){
    var self = this;
    self.config = config;
    self.id = config.id;
    self.isAppended = false;
    self.initialize();
    return self;
}
DirectActionButton.prototype = {
    constants: {
        container: {
            class: "directActionButtonMainContainer"
        },
        directActionIconContainer: {
            class: "directActionIconContainer"
        },
        directActionIcon: {
            class: "directActionIcon"
        },
        directActionNameContainer: {
            class: "directActionNameContainer"
        },
        directActionName: {
            class: "directActionName"
        },
        directActionButtonButtonContainer: {
            class: "directActionButtonButtonContainer"
        },
        directActionButtonButton: {
            class: "directActionButtonButton"
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
        self.container.on('click', function(){
            self.config.onClick.apply(self.config.context, [self.config.context]);
        });
        return self;
    },
    _creation: {
        createElements: function(directActionButton){
            var self = this;
            var container = self.createContainer(directActionButton);
            directActionButton.container = container;
            return self;
        },
        createContainer: function(directActionButton){
            var config = directActionButton.config;

            var li = $(document.createElement('li')).attr({class: "directActionMenuLi"});
            var icon = $(document.createElement('img'))
                .attr({src: "pics/"+config.iconName, class: directActionButton.constants.directActionIcon.class})
                .appendTo(li);
            li.attr({title: config.iconTitle});


            var button = $(document.createElement('div'))
                .attr({class: directActionButton.constants.directActionButtonButton.class})
                .text(config.buttonName)
                .appendTo(li);


            directActionButton.elements.icon = icon;
            directActionButton.elements.button = button;
            return li;
        }
    }
}
