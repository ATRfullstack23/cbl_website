/**
 * Created by Akhil Sekharan on 1/16/14.
 */

function FloatingWindow(config, parentObject) {
    var self = this;
    self.config = config;
    self.erp = parentObject;
    self.initialize();
    return self;
}

FloatingWindow.prototype = {
    constants: {
        container: {
            "class": "floatingWindowContainer"
        },
        childWindowContainer: {
            "class": "childWindowContainer"
        },
        childWindowHeader:{
            "class": "childWindowHeader"
        },
        notificationCount:{
            "class": "notificationCount"
        },
        recycleBin:{
            "class": "recycleBin"
        }
    },
    initialize: function () {
        var self = this;
        self.createElements().bindEvents();
        self.childWindowPosition = self.config.position.childWindowPosition || {};
        self.isChildWindowVisible = false;
        self.isLeft = self.config.position.isLeft;
        var reportConfig =  JSON.parse( JSON.stringify(self.erp.config.reports[self.config.dataSource.reportId]));
        reportConfig.disableNavigation = true;
        reportConfig.isInFloatingWindow = true;
        self.report = new Report(reportConfig, self.erp);
        self.subReport = self.report.subReports[self.config.dataSource.subReportId];

        self.report.container
            .appendTo(self.elements.childWindowContainer);

        self.subReport.on(SubReport.EVENTS.notificationCountReceived, function(notificationCount){
            self.setNotificationCount(notificationCount);
        });
        self.subReport.getNotificationCount();


        self.container.attr({title: self.subReport.tooltip || self.subReport.displayName});

        self.elements.childWindowContainer.appendTo(document.body);
        self.elements.recycleBin.appendTo(document.body);
        self.container.appendTo(document.body)
            .css({'transition': "right .5s ease"})
            .transition({right: "-10px"}, 500, function(){
                self.container.css({'transition': ""});
            });
        if(self.subReport.customIcon && self.subReport.customIcon.originalName){
            self.container.css({"backgroundImage": "url(iconsGenerated/"+self.subReport.parentObject.id+"/"+self.subReport.id+"_"+self.subReport.customIcon.originalName+")"});
        }
        else if(self.subReport.icon){
            self.container.css({backgroundImage: 'url(pics/'+ self.subReport.icon+')'});
        }
        setTimeout(function(){
            if(self.config.position){
                if(!self.config.position.isLeft){
                    delete self.config.position.left;
                }
                if(self.config.position.top){
                    if(self.config.position.top > window.innerHeight){
                        self.config.position.top = parseInt(Math.random() * window.innerHeight);
                    }
                }
//                console.log(self.subReport.id, self.config.position)
                if(self.isLeft){
                    self.container.css({left: "0px", top: self.config.position.top});
                }
                else{
                    self.container.css({right: "0px", top: self.config.position.top});
                }
            }
            if(self.childWindowPosition.height){
                self.elements.childWindowContainer.height(self.childWindowPosition.height)
            }
            if(self.childWindowPosition.width){
                self.elements.childWindowContainer.width(self.childWindowPosition.width);
            }
            if(self.childWindowPosition.left){
                if(self.isLeft){
                    self.elements.childWindowContainer.css({left: "0px"})
                }
                else{
                    self.elements.childWindowContainer.css({right: "0px"})
                }

            }
            if(self.childWindowPosition.top){
                self.elements.childWindowContainer.css({top: self.childWindowPosition.top + 'px'})
            }
        }, 100);
        self.setDeviceTypeDisplayMode();
        if(self.config.position && self.config.position.isEnabled !== undefined){
            if(!self.config.position.isEnabled){
                self.container.hide();
				self.isInRecycleBin = true;
            }
        }
        if(self.subReport.bindToModule && self.subReport.bindToModule.isEnabled){
            var moduleId = self.subReport.bindToModule.bindToModule.moduleId;
            if(self.erp.modules[moduleId]){
                self.erp.modules[moduleId].addChildFloatingReport(self);
                self.hide();
            }
        }
        return self;
    },
    setDeviceTypeDisplayMode: function(){
        var self = this;
        self.container.addClass(self.erp.deviceType);
        switch(self.erp.deviceType){
            case ERP.DEVICE_TYPES.MOBILE:
                self.hide()
                break;
            default:
                break;
        }
        return self;
    },
    destroy: function(){
        var self = this;

        for(var key in self.elements){
            self.elements[key].remove();
        }

        return self;
    },
    setNotificationCount: function (notificationCount) {
        var self = this;
        self.currentNotificationCount = notificationCount;
        if(notificationCount == 0){
            self.elements.notificationCount.text(notificationCount)
                .removeClass('visible');
        }
        else{
            self.elements.notificationCount.text(notificationCount)
                .addClass('visible');
        }

        return self;
    },
    createElements: function () {
        var self = this;

        self._creation.createElements(self);

        return self;
    },
    bindEvents: function () {
        var self = this;
        self.container.draggable({
            containment: document.body,
            start: function(){
//                self.hideChildWindow();
                self.elements.recycleBin.show();
                self.container.removeClass('animateLeft animateRight').css({right: ""});
            },
            stop: function(){
                self.elements.recycleBin.hide();
                self.setContainerPosition();
            }
        }).css({position: ''});
        self.container.on('click', function(){
           self.toggleWindowVisibility();
        });
        self.elements.childWindowContainer. draggable({
            containment: document.body,
            handle: ".childWindowHeader",

            drag:function(eve, obj){

            },
            start:function(){
                self.container.hide();
                console.log(self.isLeft)
                if(self.isLeft){
                    self.elements.childWindowContainer.removeClass('animateLeft');
                }
                else{
                    self.elements.childWindowContainer.removeClass('animateRight animateLeft');
                }
            },
            stop:function(eve, obj){
                self.container.show();
                var newTop = self.elements.childWindowContainer.offset().top - 10;
                var newLeft = self.elements.childWindowContainer.offset().left + self.elements.childWindowContainer.width() - 75;

                self.childWindowPosition.left = self.elements.childWindowContainer.offset().left;
                self.childWindowPosition.top = self.elements.childWindowContainer.offset().top;
                if(self.isLeft){
                    self.container.css({top: newTop + 'px', left: newLeft + 'px'});
                    self.elements.childWindowContainer.addClass('animateLeft');
                }
                else{
                    self.container.css({top: newTop + 'px', right: (window.innerWidth - (newLeft + 85)) + 'px'});
                    self.elements.childWindowContainer.addClass('animateRight');
                }
            }
        }).css({position: ''});
        self.elements.childWindowContainer.resizable({
            containment: document.body,

            stop: function(){
                var newTop = self.elements.childWindowContainer.offset().top - 10;
                var newLeft = self.elements.childWindowContainer.offset().left + self.elements.childWindowContainer.width() - 75;
                if(self.isLeft){
                    self.container.css({top: newTop + 'px', left: newLeft + 'px'});
                }
                else{
                    self.container.css({top: newTop + 'px', right: (window.innerWidth - (newLeft + 85)) + 'px'});
                }

                self.childWindowPosition.width = self.elements.childWindowContainer.width();
                self.childWindowPosition.height = self.elements.childWindowContainer.height()
            }

        });
        self.elements.recycleBin.droppable({
            accept: '.'+ self.constants.container.class,
            hoverClass: 'recycleBinAllowDrop',
            drop: function(){
                self.droppedToRecycleBin();
            }
        });
        return self;
    },
    droppedToRecycleBin: function(){
        var self = this;
        self.elements.container.hide();
        var obj = self.config.position || {};
        obj.isEnabled = false;
        self.isInRecycleBin = true;

        self.erp.saveUserSetting(self.subReport.id + '_floatingWindow', obj, function(){

        });
        return self;
    },
    setContainerPosition: function(){
        var self = this;
        var pos = self.container.offset();
        var isLeft = true;
        if(pos.left > (window.innerWidth/2)){
            isLeft = false;
        }
        self.isLeft = isLeft;

        if(self.isLeft){
            self.container.addClass('animateLeft');
            setTimeout(function(){
                self.container.css({left: "0px", right: ""});
                setTimeout(function(){
                    self.saveContainerPosition();
                }, 1500);
            }, 10);
        }
        else{
            self.container.css({right: (window.innerWidth - pos.left) + 'px', left: ""});
            setTimeout(function(){
                self.container.addClass('animateRight');
            }, 10);
            setTimeout(function(){
                self.container.css({right: "0px" });
                setTimeout(function(){
                    self.saveContainerPosition();
                }, 1500);
            }, 20);
        }
        return self;
    },
    saveChildWindowPosition: function(){
        var self = this;
        var pos = self.config.position;
        var isLeft = true;

        if(pos.left > (window.innerWidth/2)){
            isLeft = false;
        }
        if(pos.left != 0 && !pos.left){
            isLeft = false;
        }

        self.isLeft = isLeft;
        if(self.isInRecycleBin){
            return self;
        }

        var str = self.subReport.id + '_floatingWindow';
        var config = self.config.position;
        config.isLeft = self.isLeft;
        config.childWindowPosition = self.childWindowPosition;

        self.erp.saveUserSetting(str, config, function(){
//            self.erp.notifier.show('saved')
        });
        return self;
    },

    saveContainerPosition: function(){
        var self = this;
        if(self.isInRecycleBin){
            return self;
        }
        var str = self.subReport.id + '_floatingWindow';
        var config = self.container.position();
        config.isLeft = self.isLeft;
        config.childWindowPosition = self.childWindowPosition;        
        self.erp.saveUserSetting(str, config, function(){
//            self.erp.notifier.show('saved')
        });
        return self;
    },
    toggleWindowVisibility: function () {
        var self = this;
        if(self.isChildWindowVisible){
            self.hideChildWindow();
        }
        else{
            self.showChildWindow();
        }
        return self;
    },
    hideChildWindow: function () {
        var self = this;
        self.isChildWindowVisible = false;
        var childWindowContainer = self.elements.childWindowContainer;
        self.saveChildWindowPosition();
        self.container.css(self.lastContainerPosition);
        if(self.isLeft){
            self.container.css({left: "0px", right: ""});
            childWindowContainer.addClass('animateLeft');
            setTimeout(function(){
                childWindowContainer.css({left: "0px", opacity: 0});
            }, 10);
        }
        else{
            self.container.css({left: "", right: "0px"});

            childWindowContainer.addClass('animateRight');
            console.log(window.innerWidth)
            setTimeout(function(){
                childWindowContainer.css({right: "0px", opacity: 0});
            }, 10);
        }
        setTimeout(function(){
            childWindowContainer.removeClass('childWindowVisible');
        }, 500);


        setTimeout(function(){
            self.container.removeClass('smallForm');
        }, 300)
        self.container.draggable('enable').attr({title: "Click To Open"});
        return self;
    },
    showChildWindow: function () {
        var self = this;
        self.isChildWindowVisible = true;
        var childWindowContainer = self.elements.childWindowContainer;
        childWindowContainer.addClass('childWindowVisible');
        self.report.show().setSelectedSubReport(self.subReport);
        console.log(self.subReport.id, self.config.position)
        childWindowContainer
            //.css({height: window.innerHeight-100, left: "", right: ""})
            .css({left: "", right: ""})
            .removeClass('animateLeft animateRight');
//        console.log(self.childWindowPosition.left, self.childWindowPosition.left + self.elements.childWindowContainer.width() - 75)
        console.log('is left', self.isLeft);
        if(self.isLeft){
            childWindowContainer.addClass('animateLeft');
            setTimeout(function(){
                childWindowContainer.css({left: (self.childWindowPosition.left || '110') + "px", opacity: 1});
            }, 10);
        }
        else{
            childWindowContainer.addClass('animateRight');
            setTimeout(function(){
                if(self.childWindowPosition.left){
                    childWindowContainer.css({right: (window.innerWidth - (self.childWindowPosition.left + self.elements.childWindowContainer.width())) + 'px', opacity: 1});
                }
                else{
                    childWindowContainer.css({right: "110px", opacity: 1});
                }
            }, 10);
        }

        var newContainerPos = {};
        var childWindowContainerPos = childWindowContainer.offset();
        newContainerPos.top = childWindowContainerPos.top - 10 + 'px';
        self.container.addClass('smallForm');

        self.lastContainerPosition = {};
        self.lastContainerPosition.top = self.container.offset().top + 'px';
        self.lastContainerPosition.left = '';

        if(self.isLeft){
            newContainerPos.left = childWindowContainerPos.left + childWindowContainer.outerWidth(true) + 50;
            newContainerPos.left = newContainerPos.left + 'px';
            if(self.childWindowPosition.left){
                newContainerPos.left = self.childWindowPosition.left + self.elements.childWindowContainer.width() - 75 + 'px';
            }
            self.lastContainerPosition.left = self.container.offset().left + 'px';

            setTimeout(function(){
                self.container.css({ right: ""});
                self.container.css(newContainerPos);
            }, 10);
        }
        else{
//            newContainerPos.right = childWindowContainer.css('right') + 50;
            if(self.childWindowPosition.left){
                newContainerPos.right = (window.innerWidth - (self.childWindowPosition.left + self.elements.childWindowContainer.width() + 10)) + 'px';
            }
            else{
                newContainerPos.right = '100px';
                newContainerPos.left = '';
            }

            self.lastContainerPosition.right = self.container.css('right');
            setTimeout(function(){
                self.container.css(newContainerPos);
            }, 10);
        }

        self.container.draggable('disable').attr({title: "Click To Close"});
        return self;
    },
    show: function () {
        var self = this;
        self.container.show();
        return self;
    },
    hide: function () {
        var self = this;
        self.container.hide();
        return self;
    },
    _creation: {
        createContainer: function(floatingWindow){
            var div = $(document.createElement('div')).attr({id: floatingWindow.id, class: floatingWindow.constants.container.class});
            return div;
        },
        createNotificationCount: function(floatingWindow){
            var div = $(document.createElement('div')).attr(floatingWindow.constants.notificationCount);
            return div;
        },
        createWindowContainer: function(floatingWindow){
            var self = this;
            var div = $(document.createElement('div')).attr({class: floatingWindow.constants.childWindowContainer.class});
            var header = self.createChildWindowHeader(floatingWindow);
            header.appendTo(div).text(floatingWindow.config.headerText);
            floatingWindow.elements.childWindowHeader = header;
            return div;
        },
        createChildWindowHeader: function(floatingWindow){
            var div = $(document.createElement('div')).attr({class: floatingWindow.constants.childWindowHeader.class});
            return div;
        },
        createRecycleBin: function(floatingWindow){
            var div = $(document.createElement('div')).attr({ class: floatingWindow.constants.recycleBin.class});
            return div;
        },
        createElements: function (floatingWindow) {
            var self = this;
            var container = self.createContainer(floatingWindow);
            floatingWindow.elements = {container: container};
            floatingWindow.container = container;
            floatingWindow.elements.childWindowContainer = self.createWindowContainer(floatingWindow);
            floatingWindow.elements.recycleBin = self.createRecycleBin(floatingWindow);
            floatingWindow.elements.notificationCount = self.createNotificationCount(floatingWindow).appendTo(container);
            return self;
        }
    }
}

