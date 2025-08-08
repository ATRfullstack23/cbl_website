/**
 * Created by Akhil Sekharan on 12/4/13.
 */

function Navigation(config, parentObject) {
    var self = this;
    self.parentObject = parentObject;
    self.config = config;
    self.app = parentObject;
    self.initialize();
    return self;
}

Navigation.prototype = {
    constants:{
        moduleGroupMainContainer: {
            "class" : "module-group-main-container"
        },
        moduleGroupContainer: {
            "class" : "module-group-container"
        },
        moduleGroupTitleDiv: {
            "class" : "module-group-title-div"
        },
        groupCloseButtons: {
            "class" : "group-close-buttons"
        },
        groupsContainerLi:{
            "class": "groupsContainerLi"
        }
    },
    initialize: function () {
        var self = this;
        self.options = self.config.options;
        self.hiddenTranslateX = 200;
        self.deviceType = self.config.deviceType;
        self.defaultValue = self.config.defaultValue || self.config.options[0];


        if(self.deviceType == ERP.DEVICE_TYPES.PC){
            self.displayMode = self.config.displayMode || 'default';
        }
        else if(self.deviceType == ERP.DEVICE_TYPES.MOBILE){
            self.displayMode = 'mobileSwipe';
        }
        else{
            self.displayMode = 'default';
        }

        self.contentsContainer = $(self.config.contentsContainer);
        self.container = self._creation.createElement(self);
        self.addExtraHeight = self.config.addExtraHeight;
        if(self.config.classes){
            self.config.classes.container && self.container.addClass(self.config.classes.container);
        }
        if(self.config.parentContainers){
            self.elements.parentContainer = $(self.config.parentContainers[self.displayMode]);
            self.container.appendTo(self.elements.parentContainer);
            // console.log('appended ', self.container.get(0) ,' to ', self.elements.parentContainer.get(0))
        }
        self.bindEvents();

        self.setDisplayMode();

        return self;
    },
    setDisplayMode: function(newDisplayMode){
        var self = this;
        if(newDisplayMode){
            if(self.displayMode){
                self.container.removeClass(self.displayMode);
            }
            self.displayMode = newDisplayMode;
        }
        switch(self.displayMode){
            case 'dock':
                self.setFishEye();
                break;
            case 'mobileSwipe':
                self.setMobileSwipe();
                break;
            case 'accordionLeft':
                self.setAccordion();
                break;
            default:
                self.container.addClass('default');
                break;
        }
        return self;
    },
    setAccordion: function(){
        var self = this;
        self.container.addClass('accordionLeft');
        return self;
    },
    setMobileSwipe: function(){
        var self = this;
        self.container.addClass('mobileSwipe');
        var swipeTarget = self.config.swipeTarget || self.elements.parentContainer;
        self.swipeTarget = swipeTarget;
        if(self.config.swipeClickTarget){

            self.config.swipeClickTarget.on('mouseenter', function(eve){
                setTimeout(function(){
                    self.showMobileSwipeNavigation();
                },10);
                return false;
            });

//            Hammer(self.config.swipeClickTarget.get(0)).on('tap', function(eve){
//                setTimeout(function(){
//                    self.showMobileSwipeNavigation();
//                },10)
//                eve.gesture && eve.gesture.preventDefault();
//                return false;
//            });
        };

        var hammerSwipeElement = Hammer(swipeTarget.get(0));

        hammerSwipeElement.on('dragright', function(eve){
//            console.log(eve.gesture.deltaX, (200 - eve.gesture.deltaX));
            if(eve.gesture.deltaX >= 200){
                self.showMobileSwipeNavigation();
            }
            else{
                var translateStr = 'translateX(-'+ (200 - (eve.gesture.deltaX*1)) +'px)';
                self.container.css({
                    webkitTransform: translateStr,
                    webkitTransition: "none"
                });
            }
            eve.gesture.preventDefault();
        });

        hammerSwipeElement.on('dragend', function(eve){
            if(!self.isMenuShown){
                self.hideMobileSwipeNavigation();
            }
            eve.gesture.preventDefault();
        });
        return self;
    },
    showMobileSwipeNavigation: function(){
        var self = this;
        var translateStr = '';
        self.container.css({
            webkitTransform: translateStr,
            webkitTransition: ""
        });
        self.isMenuShown = true;
        self.container.addClass('navigationMenuShown');
        self.swipeTarget.addClass('navigationMenuBlur');

        self.swipeTarget.parent().on('click', function(eve){
            if($(eve.target).closest('.mobileSwipe').length){
                return;
            }
            if($(eve.target).is(self.config.swipeClickTarget)){
                return;
            }
            //eve.preventDefault();
            setTimeout(function(){
                self.hideMobileSwipeNavigation();
            },100)
            return false;
        });
        return self;
    },
    hideMobileSwipeNavigation: function(){
        var self = this;
        self.isMenuShown = false;
        var translateStr = '';
        self.container.css({
            webkitTransform: translateStr,
            webkitTransition: ""
        });
        self.container.removeClass('navigationMenuShown');
        self.swipeTarget.removeClass('navigationMenuBlur');
        self.swipeTarget.parent().off('click');
        return self;
    },
    setFishEye: function(){
        var self = this;
        self.container.addClass('dock');
        self.elements.ulMain.on('mouseenter', 'li', function(){
            var li = $(this);
            li.prev().addClass('fish-eye-prev');
        });
        self.elements.ulMain.on('mouseleave', 'li', function(){
            var li = $(this);
            li.prev().removeClass('fish-eye-prev');
        });
        return self;
    },
    destroy: function(){
        var self = this;
        self.container.remove();
        return self;
    },
    bindEvents: function () {
        var self = this;
        var toggle = true;

        self.container.on('click', 'li[value]', function(){
            var li = $(this);
            self.parentObject.helpBox && self.parentObject.helpBox.hide();
            var newValue = li.get(0).getAttribute('value');
            if(self.selectedElement){
                self.selectedElement.removeClass('selected');
                self.contentsContainer.children('#'+self.selectedValue).hide();
            }
            if(self.selectedFormView){
                // console.log($(document.body).find('#'+self.selectedFormView).get(0))
                $(document.body).find('#'+self.selectedFormView).hide();
            }
            self.selectedValue = newValue;
            self.selectedElement = li;
            li.addClass('selected');

            self.contentsContainer.children('#'+self.selectedValue).show();
            //self._ui.setPointerPosition(self, li, newValue);
            self.config.onChange.apply(self, [newValue]);
            if(self.displayMode == 'mobileSwipe'){
                self.hideMobileSwipeNavigation();
            }
        });
        self.forEachItem(function(item){
            if(item instanceof Module){
                var subModule = item.defaultSubModule;
                if(subModule && subModule.notification && subModule.notification.countSql && subModule.notification.countSql.sql && subModule.notification.interval){
                    subModule.on(SubModule.EVENTS.notificationCountReceived, function(notificationCount){
                        self.setNotificationCount(item, notificationCount);
                    });
                    subModule.getNotificationCount();
                }
            }
        });
//        if(self.config.displayMode == 'leftAlign'){
//            $(document.body).on('mousemove', function(event){
//                if(event.pageX < 20){
//                    toggle = true;
//                    self.showNavMenuContainer()
//                }
//
//            });
////            self.elements.parentContainer.on('mouseover', function(){
////                self.elements.parentContainer.addClass('leftAlignReportNavContainer_in')
////                self.contentsContainer.addClass('shrinkReportContentContainer')
////            });
//
//        }

        if(self.config.showHideToggleButton && self.config.deviceType == ERP.DEVICE_TYPES.PC){

            self.config.showHideToggleButton.on('click', function(){
                if(toggle){
                    toggle = false;
                    self.hideNavMEnuContainer();
                    self.config.showHideToggleButton.addClass('navigationHidden');
                }
                else{
                    toggle = true;
                    self.config.showHideToggleButton.removeClass('navigationHidden');
                    self.showNavMenuContainer()
                }
            });
            self.config.showHideToggleButton.prev().css({
                cursor: "pointer"
            })
            self.config.showHideToggleButton.prev().on('click', function(){
                if(toggle){
                    toggle = false;
                    self.hideNavMEnuContainer();
                }
                else{
                    toggle = true;
                    self.showNavMenuContainer()
                }
            })
        }

        if(self.config.enableSearch){
            self.elements.searchBox.on('keyup input', function () {
                self.doSearch();
            });
        }

        return self;
    },
    doSearch: function(){
        var self = this;
        var newValue = self.elements.searchBox.val();

        if(!newValue){
            self.forEachItem(function (item) {
                self.itemElements[item.id].removeClass('hiddenBySearch');
            });
            return;
        }
        newValue = newValue.toLowerCase();

        self.forEachItem(function (item) {
            if(item.displayName.toLowerCase().indexOf(newValue) == -1){
                self.itemElements[item.id].addClass('hiddenBySearch');
            }
            else{
                self.itemElements[item.id].removeClass('hiddenBySearch');
            }
        });
    },
    showNavMenuContainer: function(){
        var self = this;

        self.elements.parentContainer.addClass('leftAlignReportNavContainer_in')
        self.contentsContainer.addClass('shrinkReportContentContainer');
        return self;
    },
    hideNavMEnuContainer: function(){
        var self = this;
        self.elements.parentContainer.removeClass('leftAlignReportNavContainer_in')
        self.contentsContainer.removeClass('shrinkReportContentContainer');
        return self;
    },
    setNotificationCount: function(item, count){
        var self = this;
        var li = self.itemElements[item.id];
        li.attr('data-notification-count', count);
        return self;
    },
    get numberOfItems(){
        const self = this;
        let count = 0;
        for(var key in self.options){
            var option = self.options[key];
            if(!option.hiddenFromMainNavigation){
                count++;
            }
        }
        return count;
    },
    forEachItem: function(eachFunction){
        var self = this;
        for(var key in self.options){
            var option = self.options[key];
            if(!option.hiddenFromMainNavigation){
                eachFunction.apply(option, [option]);
            }
        }
        return self;
    },
    setDefaultValue: function(){
        var self = this;
        self.container.find('[value="'+ self.defaultValue +'"]').click();
        return self;
    },
    setValue: function(value, trigger){
        var self = this;
        var li = self.container.find('[value="'+ value +'"]')
        if(trigger){
            li.click();
        }
        else{
            self.selectedElement = li;
            self.selectedValue = value;
            li.addClass('selected');
        }
//        if(trigger){
//            setTimeout(function(){
//                self._ui.setPointerPosition(self, li, value);
//            }, 100)
//        }
        return self;
    },
    show      : function () {
        var self = this;
        self.container.removeClass('displayNone');
        return self;
    },
    hide      : function () {
        var self = this;
        self.container.addClass('displayNone');
        return self;
    },
    cancel    : function () {
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    _creation : {
        createElement: function(nav){
            var self = this;
            nav.elements = {};
            nav.itemElements = {};
            var container = $(document.createElement('div')).addClass('nav-container');


            if(nav.config.enableSearch){
                container.append( self.createSearchArea(nav) );
            }


            var ul = $(document.createElement('ul')).addClass('nav-element');
            nav.elements.ulMain = ul;

            ul.append(self.createLiElements(nav));


//            var groupsContainerLi = $(document.createElement('li'))
//                .attr(nav.constants.groupsContainerLi);
            for(var key in nav.config.order){
                if(key === 'groups'){
                    self.createGroupsList(nav.config.order.groups,ul,nav);
                }
            }
//            ul.append(groupsContainerLi);
//            nav.elements.groupsContainerLi = groupsContainerLi;

            nav.elements.container = container;
            container.append(ul);
            return container;
        },
        createSearchArea: function(nav){
            var self = this;
            var searchBox = $(document.createElement('input'))
            searchBox.attr('type', 'search');
            searchBox.attr('placeholder', 'Search');
            nav.elements.searchBox = searchBox;

            return searchBox;
        },
        createGroupsList: function(groups,mainContainer,nav){
            var self = this;
//            console.log(groups)
//            console.log(nav.options);
            for(var key in groups){
                var data = groups[key];
//                console.log(data)
                var id = data.id;
//                if(data){}
                var containers = $(document.createElement('li')).attr(nav.constants.moduleGroupMainContainer).attr('id',id)
                    .appendTo(mainContainer);
                var container = $(document.createElement('ul')).attr(nav.constants.moduleGroupContainer).attr('id',id).attr('value',key).appendTo(containers);
                for(var key1 in data){
                    var mainData = data[key1];
                    if(typeof mainData == 'object'){
                        var module = nav.options[mainData.id];

                        if(!module){
                            continue;
                        }

                        var li = $(document.createElement('li'))
                            .attr('value',module.id).appendTo(container);
                        nav.itemElements[module.id] = $(li);
                        var divImage = $(document.createElement('div'))
                            .addClass('div-icon').attr('value',key)
                            .appendTo(li);
//                        console.log(nav.config);
                        if(nav.config.displayMode == 'leftAlign'){
                            li.addClass('setLiToLeftAlign');
                        }
                        if(module.customIcon && module.customIcon.originalName){
                            divImage.css('background-image','url(iconsGenerated/'+module.id+'_'+module.customIcon.originalName.replace(/\(|\)| /g, '')+')');
                        }
                        else if(module.icon){
                            divImage.css('background-image','url(pics/'+module.icon+')');
                        }

                        var span = $(document.createElement('span'))
                            .text( module.displayName)
                            .appendTo(li);
                    }
                }
                var childLength = Object.keys(data).length-1;
                if(childLength >= 7){
                    containers.attr('data-size-x', 4 );
                    containers.attr('data-size-y', 2 );
                }
                if(childLength >= 5){
                    containers.attr('data-size-x', 3 );
                    containers.attr('data-size-y', 2 );
                }
                else if(childLength >= 2){
                    containers.attr('data-size-x', 2 );
                    if(childLength >2){
                        containers.attr('data-size-y', 2 );
                    }
                }
                else{
                    containers.attr('data-size-x', 1 );
                    containers.attr('data-size-y', 1 );
                }
                var titleDiv =  $(document.createElement('div'))
                    .attr(nav.constants.moduleGroupTitleDiv)
                if(window.deviceType == ERP.DEVICE_TYPES.PC){
                    titleDiv.appendTo(containers);
                }
                else{
                    titleDiv.prependTo(containers);
                }


                var titlespan =  $(document.createElement('span')).text(key).appendTo(titleDiv);
                var closebutton = $(document.createElement('span')).text('X').appendTo(titleDiv).attr(nav.constants.groupCloseButtons);
                self.bindCloseButton(closebutton, containers, nav);
            }
//            return containers;
        },
        bindCloseButton: function(closeButton, containers, nav){
            var self = this;
            closeButton.on('click',function(){
                var ul = nav.parentObject.elements.sortableNavWindow.children('div').children('ul');
                containers.find('li').each(function(){
                    var oldLi = $(this);
                    ul.append(oldLi);
                });

                containers.remove();
                nav.parentObject.saveModulePositionConfig(nav.parentObject.createModulePositionConfig(nav.parentObject.elements.sortableNavWindow.find('ul')));
            });
            return self;
        },
        createOrderByConfig: function(nav){
            let modules_to_sort = {};
            for(var itemKey in nav.config.options){
                let targetObject = nav.config.options[itemKey];
                let order_by_index_new_value = targetObject.orderByIndex || 1000;
                order_by_index_new_value = order_by_index_new_value * 100;

                while(modules_to_sort[order_by_index_new_value]){
                    order_by_index_new_value++;
                }
                modules_to_sort[order_by_index_new_value] = targetObject;
                // self.appendModuleBox(module);
            }


            let index_keys = Object.keys(modules_to_sort);
            index_keys.sort((a, b)=>{
                return parseInt(a) - parseInt(b);
            });


            var new_index = 0;
            const new_order = {};
            for(const index of index_keys){
                let target_item = modules_to_sort[index];
                new_order[target_item.id] = {index: new_index, name: target_item.id};
                new_index++;
            }
            return new_order;
        },
        createLiElements: function(nav){
            var liElements = [];
            var order = nav.config.order || {};
            //var order = {};

            if(!Object.keys(order).length){
                order = this.createOrderByConfig(nav);
                // var index = 0;
                // for(var key in nav.config.options){
                //     if(nav.config.classes && nav.config.classes.container === "settingModulesNavElement"){
                //         console.log(key, index)
                //     }
                //     order[key] = {index: index, name: key};
                //     index++;
                // }
            }

            //else if(Object.keys(order).length != Object.keys(nav.config.options).length - 1){
            if(true){
                var newIndexStart = Object.keys(order).length;
                for(var itemKey in nav.config.options){
                    if(!order[itemKey]){
                        var isInsideGroup = false;
                        for(var groupKey in order.groups){
                            if(order.groups[groupKey][itemKey]){
                                isInsideGroup = true;
                            }
                        }
                        if(!isInsideGroup){
                            order[itemKey] = {
                                name: itemKey,
                                index: newIndexStart++
                            }
                        }
                    }
                }
            }
            var check ;

            var hasCustomIcon = false;

            nav.forEachItem(function(item){
                var li = document.createElement('li');

                nav.itemElements[item.id] = $(li);

                if(nav.config.addTitleToListItems){
                    nav.itemElements[item.id].attr('title', item.displayName);
                }

//                if(nav.displayMode == 'dock'){
                var divImage = document.createElement('div');
                divImage.className = 'div-icon';
                if(item.customIcon && item.customIcon.originalName){
                    hasCustomIcon = true;
                    if(nav.config.type === 'subReport'){
                        divImage.style.backgroundImage = 'url(iconsGenerated/'+item.parentObject.id+'/'+item.id+'_'+item.customIcon.originalName.replace(/\(|\)| /g, '')+')';
                    }
                    else{
                        divImage.style.backgroundImage = 'url(iconsGenerated/'+item.id+'_'+item.customIcon.originalName.replace(/\(|\)| /g, '')+')';
						//yathi//divImage.style.backgroundImage = 'url(iconsGenerated/'+item.id+'_'+item.customIcon.name.replace(/\(|\)| /g, '')+')';
                    }
                }
                else{
                    divImage.style.backgroundImage = 'url(pics/'+ item.icon+')';
                }

                if(item.icon && item.icon.originalName){
//                    console.log(item.icon.originalName);
                    divImage.style.backgroundImage = 'url(iconsGenerated/'+item.id+'_'+item.icon.originalName.replace(/\(|\)| /g, '')+')';
                }
                li.appendChild(divImage);
//                }
//                console.log('nav.config.displayMode', nav.config.displayMode);
                if(nav.config.displayMode == 'leftAlign'){
                    $(li).addClass('setLiToLeftAlign');
                }
                else if(nav.config.displayMode == 'blocksInline'){
                    $(li).addClass('setLiToInline');
                }

                var span = document.createElement('span');
                var name = item.displayName;
                span.innerHTML = name;
                li.appendChild(span);
                li.setAttribute('value', item.id);
                for(var key in order){
                    if(order[key].name == item.id){
                        check = true;
                        if(order && order[item.id]){
                            liElements[order[item.id].index] = li;
                        }
                        else{
                            liElements.push(li);
                        }
                    }
                }
//                if(item.icon){
//                    console.log(li)
//                }

            });

            if(hasCustomIcon){
                nav.elements.ulMain.addClass('withCustomIcon')
            }
            else{
                nav.elements.ulMain.addClass('withoutCustomIcon')
            }

            if(check){
                return liElements;
            }
            else{
                // console.log('check is false',liElements);
            }
        }
    },
    _events   : {
    },
}