/**
 * Created by Akhil Sekharan on 12/4/13.
 */
import {
    generate_main_navigation_configuration,
    get_main_navigation_configuration
} from "$lib/client_scripts/NavigationUtils.js";

export class ERP{

    constructor(config, options) {
        var self = this;
        self.windowWidth = window.screen.width;
        self.windowHeigth = window.screen.height;
        self.config = config;
        self.user = options.user;
        self.id = config.appSettings.id;
        self.lookUpDataConfig = {};
        // var script = $(document.createElement('script')).attr({type: "text/javascript", src: "/socket.io/socket.io.js"});
        // script.appendTo(document.body);
        // self.initialize();
        return self;
    }


    async get_navigation_configuration() {
        if (!this.main_navigation_configuration) {
            this.main_navigation_configuration = await generate_main_navigation_configuration(this);
        }
        return this.main_navigation_configuration;
    }


    getLocalStorageLookUps(){
        var self = this;
        try{
            var lookUpDataConfig = JSON.parse(localStorage[self.id]);
            self.lookUpDataConfig = lookUpDataConfig;
        }
        catch(err){
            console.log(err.message);
        }

        return self;
    }
    addLookUpsToLocalStorage(){
        var self = this;
        var localStorageName = '';
        self.forEachModule(function(module){
            module.forEachSubModule(function(subModule){
                subModule.forEachColumn(function(column){
                    localStorageName = column.module.id + '_' +column.subModule.id + '_' + column.id + '_lookUpData'
                    self.lookUpDataConfig[localStorageName] = column.lookUpDataBackUp;
                }, function(column){
                    var ret = false;
                    if(column.hasLocalStorage){
                        ret = true;
                    }
                    return ret;
                });
                subModule.filterManager.forEachFilter(function(filter){
                    localStorageName = module.id + '_' + subModule.id + '_' + filter.id + '_lookUpData_filter';
                    self.lookUpDataConfig[localStorageName] = filter.filterData;
                }, function(filter){
                    var ret = false;
                    if(filter.hasLocalStorage){
                        ret = true;
                    }
                    return ret;
                })
            })
        });
        localStorage[self.id] = JSON.stringify(self.lookUpDataConfig);
        return self;
    }
    async initialize(){
        var self = this;
        if(!self.config.appSettings.idleTimeout){
            self.config.appSettings.idleTimeout = 60;
        }

        for(var key in self.config){
            self[key] = self.config[key];
        }

        jQuery.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${self.user.userDetails.sessionId}`);
            }
        });

        self.configureSocket();
        self.initializeDeviceType();
        self.floatingReports = {};

        globalElements.body.trigger('erp_initialization_started');

        self.notifier = new Notifier({
            container: $(document.body)
        });
        self.getLocalStorageLookUps();
        self.createDirectActionMenu();

        self.visibilitySettings = {
            moduleVisibility: self.user.userDetails.roleSettings.moduleVisibility || {},
            columnButtonFilterVisibility: self.user.userDetails.roleSettings.columnButtonFilterVisibility || {},
            reportVisibility: self.user.userDetails.roleSettings.reportVisibility || {}
        };

        await self.initializeModules();
        await self.initializeReports();



        globalElements.body.trigger('erp_initialization_layout_created');


        var directActionMenuOrder = self.getUserSetting('direct-action-menu-order');
        self.directActionMenu.appendDirectActionButtons(directActionMenuOrder);
        self.createElements();

        var moduleNavDisplayMode = self.user.userDetails.settings.module_navigation_mode || 'dock';
        // if(moduleNavDisplayMode == 'accordionLeft'){
        //     moduleNavDisplayMode = 'accordionLeft';
        // }
        self.moduleNavPointer = new Navigation({
            id : 'moduleNavPointer',
            options: self.modules,
            order: self.user.userDetails.settings.modulesNavigationArrangementHorizontal,
            deviceType: self.deviceType,
            contentsContainer: self.container,
            swipeClickTarget: self.elements.titleElement,
            swipeTarget: self.elements.bodyWrapper,
            parentContainers: {
                dock: self.elements.content,
                "default": self.elements.content,
                "accordionLeft": self.elements.content,
                mobileSwipe: self.elements.documentWrapper
            },
            displayMode: moduleNavDisplayMode,
            onChange: function(module){
                self.setSelectedModule(module);
            }
        }, self);


        if(self.directActionMenu.length() == 0){
            self.elements.directActionButton.remove();
            self.directActionMenu.container.remove()
        }

        self.setModuleNavigationPostion();


        self.reportsNavPointer = new Navigation({
            options: self.reports,
            deviceType: self.deviceType,
            swipeClickTarget: self.elements.reportsTitle,
            swipeTarget: self.elements.reportsContentContainer,
            contentsContainer: self.elements.reportsContentContainer,
            displayMode: "leftAlign",
            showHideToggleButton: $('#reportsContainer header'),
            parentContainers: {
                dock: document.body,
                "default": self.elements.reportsNavPointerContainer,
                mobileSwipe: self.elements.reportsContainer,
                "leftAlign": self.elements.leftAlignReportNavContainer
            },
            addTitleToListItems : true,
            enableSearch: true,
            onChange: function(report){
                self.setSelectedReport(report);
            }
        }, self);


        self.settingModulesNavPointer = new Navigation({
            options: self.settingModules,
            deviceType: self.deviceType,
//            swipeClickTarget: self.elements.settingModulesTitle,
            swipeTarget: self.elements.settingModulesContentContainer,
            contentsContainer: self.elements.settingModulesContentContainer,
            displayMode: "default",
            classes:{
                container: "settingModulesNavElement"
            },
            parentContainers: {
                dock: document.body,
                "default": self.elements.settingModulesNavPointerContainer
            },
            onChange: function(report){
                self.setSelectedSettingModule(report);
            }
        }, self);

        if(self.settingModulesNavPointer.numberOfItems === 0){
            self.elements.preferencesButton.parent().detach();
        }

//        self.reportsNavPointer.container.appendTo(self.elements.reportsNavPointerContainer);
//         self.bugReportManager = new BugReportManager({
//             container: self.selectors.bugReportContainer
//         }, self);

        self.addElementsToAppSettingsContainer();
        if(self.user.userDetails.userName === 'admin'){
            self.createVisibilitySettingsContainer();
            self.addContentsToAdministratorWindow();
        }
        self.socket.emit('get_logged_in_users', self.user.userDetails.userName);
        self.socket.on('remove_logouted_user', function(user){
            console.log(user);
            $('#'+user.userName).removeClass('onlineUser');
            $('#'+user.userName).addClass('offlineUser');
        });
        self.user.configureSocket(self.socket, self);

        self.elements.userName.text(self.user.userDetails.userName);
/////////////////yathi///////////////////////
        var currentLoginUserId = self.user.userDetails.id;
        var userIcon = self.elements.userImage;
        try{
            if(self.user.users[currentLoginUserId]){
                var extensionArr = self.user.users[currentLoginUserId].image.split('.');
                var extension = extensionArr[extensionArr.length-1];
                var userIcon = self.elements.userImage;
                userIcon.css({background: "url('uploads/_users/_users/"+currentLoginUserId+"_image."+extension+"')no-repeat", "background-size": "100%","height":"30px","width":"30px"});
            }
            else{
                userIcon.css({background: "url('uploads/_users/_users/"+currentLoginUserId+"_image.png')no-repeat", "background-size": "100%","height":"30px","width":"30px"});
            }
        }
        catch(e){

        }
//////////////////////////////////////////////

        // self.createReportsSplitLayout();

        self.initializeDashboardManager();
        self.initializeTopNavigation();

        self.initializeDefaultModule();
        self.initializeDefaultSettingModule();
        self.initializeMiscSettings();


        $.fx.speeds._default = 250;
        self.addButtonsToButtonSortingWindow();
        self.addDetailsToProfileWindow();
        self.createEasyAccessingReports();
        self.bindEvents();
        self.socket.on('get_logged_in_users_done', function(data){
            self.loginUsers={};
            self.loginUsers = data;
//            console.log(data)
//            self.addOnlineUsersToContainer(data);
            if(self.elements.showUserWindow){
                self.elements.showUserWindow.remove();
            }
            /*   for(var key in data){
             if(key != 'admin'){
             $('#'+key).removeClass('offLineUser');
             $('#'+key).addClass('onlineUser');
             }
             }*/
            self.createUserDetailsContainer(self.elements.userWindow,data);
        });
        document.title = self.displayName;

        //setTimeout(function(){
        //self.setDefaultModule();
        //}, 100);

//        self.setDefaultTheme();

        self.initializeFloatingWindows();
        self.container.css({opacity:.1});
        setTimeout(function(){
            self.container.transition({opacity: 1}, 1000);
        }, 0);

//        self.addUltoSortableNavWindow();
        self.elements.managePassword.trigger('click');
        self.createBarcodeContainerInFormView();
        self.initializeHelpBox();
        self.initializeContextMenu();


        if(self.dashboards_arr.length === 0){
            self.removeTopLevelNavigationItem('dashboard');
            self.setSelectedTopNavigationMode('modules');
        }
        else{
            self.setSelectedTopNavigationMode('dashboard');
        }

        globalElements.body.trigger('erp_initialization_complete');

        return self;
    }
/////////////////////////////////////////yathi//////////////////////////////////////////////////
    createEasyAccessingReports(){
        var self = this;
        self.forEachReport(function(report){
            report.forEachSubReport(function(subReport){
                var subModule = self.modules[subReport.bindReportToSubModule.bindReportToSubModule.moduleId].subModules[subReport.bindReportToSubModule.bindReportToSubModule.subModuleId];
                subModule.addChildSubReport(subReport);
            }, function(subReport){
                var ret = false;

                if(subReport.bindReportToSubModule && subReport.bindReportToSubModule.isEnabled){
                    ret = true;
                }
                return ret;
            })
        });

        self.forEachModule(function(module){
            module.forEachSubModule(function(subModule){
                subModule.buttonManager.initializeChildReports();
            });
        });
        return self;
    }
///////////////////////////////////////////////////////////////////////////
    initializeHelpBox(){
        var self = this;
        self.helpBox = new HelpBox(self);
        self.elements.documentWrapper.append(self.helpBox.container);
        return self;
    }
    setModuleNavigationPostion(){
        var self = this;
        var mode = self.getUserSetting('module_navigation_mode');
        self.moduleNavPointer.container.addClass(mode || 'bottom');
        self.elements.documentWrapper.addClass('navigationMode_'+ mode || 'dock')
        return self;
    }
    initializeDashboardManager(){
        var self = this;

        var dashboards_config = self.user.userDetails.dashboards || [];

        // config.groups = config.groups || [];
        // config.items = config.items || [];
        //
        // if(!config.groups['1000000']){
        //     config.groups = {};
        //     config.groups['1000000'] = {
        //         displayName : 'Home',
        //         id : 1000000
        //     }
        // }

        //
        //
        //
        // config.items.numberOfReportedBugs = {
        //     id : 'numberOfReportedBugs',
        //     displayName : 'Bugs Reported',
        //     type : 'statusCard',
        //     groupId : 'home',
        //     mainValue : {
        //         textColor : '#FF5722',
        //         dataSource : {
        //             targets : {
        //                 "feedback.feedback" : {
        //                     moduleId : 'feedback',
        //                     subModuleId : 'feedback',
        //                     databaseName : 'feedback',
        //                     isPrimary : true,
        //                     whereCondition : {
        //                         "condition": "AND",
        //                         "rules": [
        //                             {
        //                                 "id": "type",
        //                                 "field": "type",
        //                                 "type": "string",
        //                                 "input": "text",
        //                                 "operator": "equal",
        //                                 "value": "Report Bug"
        //                             }
        //                         ],
        //                         "valid": true
        //                     }
        //                 },
        //                 compiledSql : "select count(f.id) as count from feedback f where type = 'Report Bug'"
        //             }
        //         },
        //     },
        //     infoText : 'bugs'
        // };
        //
        // config.items.numberOfRequestedMemes = {
        //     id : 'numberOfReportedBugs',
        //     displayName : 'Requested Memes',
        //     type : 'statusCard',
        //     groupId : 'home',
        //     mainValue : {
        //         textColor : '#607D8B',
        //         dataSource : {
        //             targets : {
        //                 "feedback.feedback" : {
        //                     moduleId : 'feedback',
        //                     subModuleId : 'feedback',
        //                     databaseName : 'feedback',
        //                     isPrimary : true,
        //                     whereCondition : {
        //                         "condition": "AND",
        //                         "rules": [
        //                             {
        //                                 "id": "type",
        //                                 "field": "type",
        //                                 "type": "string",
        //                                 "input": "text",
        //                                 "operator": "equal",
        //                                 "value": "Request Meme"
        //                             }
        //                         ],
        //                         "valid": true
        //                     }
        //                 },
        //                 compiledSql : "select count(f.id) as count from feedback f where type = 'Request Meme'"
        //             }
        //         },
        //     },
        //     infoText : 'requests'
        // };
        //
        // config.items.numberOfSuggestions = {
        //     id : 'numberOfSuggestions',
        //     displayName : 'Suggestions',
        //     type : 'statusCard',
        //     groupId : 'home',
        //     mainValue : {
        //         textColor : '#795548',
        //         dataSource : {
        //             targets : {
        //                 "feedback.feedback" : {
        //                     moduleId : 'feedback',
        //                     subModuleId : 'feedback',
        //                     databaseName : 'feedback',
        //                     isPrimary : true,
        //                     whereCondition : {
        //                         "condition": "AND",
        //                         "rules": [
        //                             {
        //                                 "id": "type",
        //                                 "field": "type",
        //                                 "type": "string",
        //                                 "input": "text",
        //                                 "operator": "equal",
        //                                 "value": "Suggestion"
        //                             }
        //                         ],
        //                         "valid": true
        //                     }
        //                 },
        //                 compiledSql : "select count(f.id) as count from feedback f where type = 'Suggestion'"
        //             }
        //         },
        //     },
        //     infoText : 'items'
        // };
        //
        // config.items.latestFiveFeedback = {
        //     id : 'latestFiveFeedback',
        //     displayName : 'Latest 5 Feedback',
        //     type : 'table',
        //     groupId : 'home',
        //     tableDataSource : {
        //         "feedback.feedback" : {
        //             moduleId : 'feedback',
        //             subModuleId : 'feedback',
        //             databaseName : 'feedback',
        //             isPrimary : true,
        //             columns : {
        //                 message : {
        //                     id : 'message',
        //                     displayName : 'Message',
        //                     databaseName : 'message',
        //                     type : 'multipleLine',
        //                     dataType : "nvarchar(max)",
        //                     index : 0,
        //                 },
        //                 type : {
        //                     id : 'type',
        //                     displayName : 'Type',
        //                     databaseName : 'type',
        //                     type : 'choice',
        //                     dataType : "nvarchar(255)",
        //                     index : 1,
        //                 }
        //             },
        //             limit : {
        //                 isEnabled : true,
        //                 value : 5
        //             },
        //             whereCondition : {
        //                 "condition": "AND",
        //                 "rules": [
        //                     {
        //                         "id": "type",
        //                         "field": "type",
        //                         "type": "string",
        //                         "input": "text",
        //                         "operator": "equal",
        //                         "value": "Report Bug"
        //                     }
        //                 ],
        //                 "valid": true
        //             }
        //         }
        //     },
        //     compiledSql : "select top 5 message, type from feedback order by id desc"
        // };


        self.dashboards_arr = [];
        self.dashboards = {};


        // config.container = self.elements.dashboardContainer;
        // self.dashboardManager = new DashboardManager(config, self);

        return self;
    }
    removeTopLevelNavigationItem(itemIdToRemove){
        var self = this;

        self.elements.topLevelNavigation.children('#' + itemIdToRemove).remove();
        if(self.elements.topLevelNavigation.children().length  == 1){
            self.elements.topLevelNavigation.hide();
        }

        return self;
    }
    initializeTopNavigation(){
        var self = this;
        var topNavigationUl = $(self.selectors.topLevelNavigation);
        self.elements.topLevelNavigation = topNavigationUl;

        topNavigationUl.on('click', 'li', function () {
            self.setSelectedTopNavigationMode($(this).attr('id'));
        });
    }
    setSelectedTopNavigationMode(newMode){
        var self = this;
        self.elements.topLevelNavigation.children('.selected').removeClass('selected');
        self.elements.topLevelNavigation.children('#' + newMode).addClass('selected');

        self.selectedTopNavigationMode = newMode;

        switch (newMode){
            case 'dashboard':
                self.elements.modulesContainer.addClass('hidden');
                self.elements.reportsContainer.addClass('hidden');

                self.elements.dashboardContainer.removeClass('hidden');
                // self.dashboardManager.onSetAsCurrentMainView && self.dashboardManager.onSetAsCurrentMainView();
                break;
            case 'reports':
                self.elements.modulesContainer.addClass('hidden');
                self.elements.dashboardContainer.addClass('hidden');

                self.elements.reportsContainer.removeClass('hidden');

                if(!self.selectedReport){
                    self.setDefaultReport();
                }

                self.onSetAsCurrentMainView && self.onSetAsCurrentMainView();
                break;
            case 'modules':
                self.elements.reportsContainer.addClass('hidden');
                self.elements.dashboardContainer.addClass('hidden');

                self.elements.modulesContainer.removeClass('hidden');
                // if(self.isSocketConnected){
                //     if(self.selectedModule){
                //         erp.setSelectedModule( erp.getSelectedModule() );
                //     }
                //     else{
                //         self.setDefaultModule();
                //     }
                // }
                // else{
                //     setTimeout(function () {
                //         if(self.selectedModule){
                //             erp.setSelectedModule( erp.getSelectedModule() );
                //         }
                //         else{
                //             self.setDefaultModule();
                //         }
                //     }, 1000);
                // }
                self.onSetAsCurrentMainView && self.onSetAsCurrentMainView();
                break;
        }
    }
    onSocketConnected(){
        var self = this;
        self.isSocketConnected = true;
        setTimeout(function () {
            if(self.selectedTopNavigationMode == 'dashboard'){
                self.dashboardManager.refreshItemsDataFromServer();
            }
            else if(self.selectedTopNavigationMode == 'modules'){
                if(self.getSelectedModule() != null && self.getSelectedModule().getSelectedSubModule() != null){
                    self.getSelectedModule().getSelectedSubModule()
                        .filterManager.getAllFilterDataFromServer();
                }
            }
        }, 1000);

    }
    onSocketDisconnected(){
        var self = this;
        self.isSocketConnected = false;
    }

    changeModuleNavigationPosition(newMode){
        var self = this;

        self.saveUserSetting('module_navigation_mode', newMode, function(data){
            // if(data.success){
            //     self.elements.documentWrapper.removeClass('navigationOn_top navigationOn_bottom navigationOn_left navigationOn_right');
            //     self.moduleNavPointer.container.removeClass('bottom top left right')
            //     self.moduleNavPointer.container.addClass(position);
            //     self.elements.documentWrapper.addClass('navigationOn_'+position)
            // }
            // else{
            //     self.notifier.showErrorNotification('Error In Changing Navigation Position')
            // }

            if(data.success){
                // self.elements.documentWrapper.removeClass('dock');
                self.elements.documentWrapper.removeClass('navigationMode_accordionLeft');
                self.elements.documentWrapper.removeClass('navigationMode_dock');

                self.elements.documentWrapper.addClass('navigationMode_'+newMode);
                self.moduleNavPointer.setDisplayMode(newMode);

            }
            else{
                self.notifier.showErrorNotification('Error In Changing Navigation Position');
            }
        });

        return self;
    }
    initializeContextMenu(){
        var self = this;
        if(self.deviceType != ERP.DEVICE_TYPES.MOBILE){
            self.contextMenu = new ContextMenu({
                targetContainer: $(document.body),
                targetAreas: [
                    {
                        selector: ".directActionMenuContainer",
                        getOptions: function(actualElement, contextMenu, targetElement){
                            var options = {};
                            var option = {};
                            option.displayName = 'Re-Order';
                            option.id = 'reOrderDirectAction';
                            option.onClick = function(){
                                self.directActionMenu.setToReArrangeMode(self);
                            }
                            options[option.id] = option;
                            if(targetElement.data('help')){
                                option = {};
                                option.displayName = 'Help';
                                option.id = 'help';
                                option.onClick = function(clickedElementContainer, contextMenu, rightClickedEvent){
                                    var containerData = $(rightClickedEvent.target).data('help');
                                    self.helpBox.show(rightClickedEvent.pageX, rightClickedEvent.pageY, containerData);
                                }
                                options[option.id] = option;
                            }
                            return options;
                        }
                    },
                    {
                        selector: "#documentWrapper",
                        getOptions: function(actualElement, contextMenu, targetElement){
                            var options = {};
                            if(targetElement.data('help')){
                                var option = {};
                                option.displayName = 'Help';
                                option.id = 'help';
                                option.onClick = function(clickedElementContainer, contextMenu, rightClickedEvent){
                                    var containerData = $(rightClickedEvent.target).data('help');
                                    self.helpBox.show(rightClickedEvent.pageX, rightClickedEvent.pageY, containerData);
                                }
                                options[option.id] = option;
                            }

                            return options;
                        }
                    },

                    {
                        selector: "#applicationSettings",
                        getOptions: function(actualElement, contextMenu, targetElement){
                            var options = {};
                            if(targetElement.data('help')){
                                var option = {};
                                option.displayName = 'Help';
                                option.id = 'help';
                                option.onClick = function(clickedElementContainer, contextMenu, rightClickedEvent){
                                    var containerData = $(rightClickedEvent.target).data('help');
                                    self.helpBox.show(rightClickedEvent.pageX, rightClickedEvent.pageY, containerData);
                                }
                                options[option.id] = option;
                            }
                            return options;
                        }
                    },

                    {
                        selector: ".nav-container .nav-element",
                        getOptions: function(actualElement, contextMenu, targetElement){
                            var options = {};

                            for(var key in moduleNavMenuConfig){
                                var option = {};
                                var mainConfig = moduleNavMenuConfig[key]
                                option.id = mainConfig.id;
                                option.displayName = mainConfig.displayName;
                                option.hasSubMenu = true;
                                option.subMenu = {};
                                for(var subKey in mainConfig.subMenuConfig){
                                    var subOption = {}
                                    var subConfig = mainConfig.subMenuConfig[subKey];
                                    subOption.id = subConfig.id
                                    subOption.displayName = subConfig.displayName;
                                    subOption.onClick = function(clickedElementContainer, contextMenu, rightClickedEvent){
                                        self.changeModuleNavigationPosition(clickedElementContainer.id)
                                    }
                                    option.subMenu[subConfig.id] = subOption;
                                }
                                if(self.moduleNavPointer.container.find('.module-group-container').get(0)){
                                    delete option.subMenu.left;
                                    delete option.subMenu.right;
                                }
                                options[option.id] = option;
                            }
                            return options;
                        }
                    }
                ]
            }, self);
        }

        return self;
    }

    createBarcodeContainerInFormView(){
        var self = this;
        self.forEachModule(function(module){
            module.forEachSubModule(function(subModule){
                subModule.formView.createContainerForBarcode();
            }, function(subModule){
                var ret = false;
                if(subModule.barcodeSubModule && subModule.barcodeSubModule.isEnabled){
                    ret = true;
                }
                return ret;
            })
        })
        return self;
    }
    initializeSocketIO(){
        var self = this;
        var script = document.createElement('script');
        script.src = '/socket.io/socket.io.js';
        script.id = 'socket_io';
        $('#socket_io').remove();
        document.body.appendChild(script)
    }
    initializeMiscSettings(){
        var self = this;
        var settings = self.user.userDetails.settings || {};
        $(document.body).addClass((settings.applicationFontSize || 'small') + 'FontSize');
        return self;
    }
    initializeDefaultSettingModule(){
        var self = this;
        var defaultModule = Object.keys(self.settingModules)[0];
        if(defaultModule){
            self.defaultSettingModule = self.settingModules[defaultModule];
        }
        return self;
    }
    get isMobileDevice(){
        var self = this;
        return self.deviceType == ERP.DEVICE_TYPES.MOBILE;
    }
    initializeDefaultModule(){
        var self = this;
        var settings = self.user.userDetails.settings;
        var defaultModule = '';
        if(location.hash){
            defaultModule = location.hash.substring(1);
        }
        else{
            switch(self.deviceType){
                case ERP.DEVICE_TYPES.PC:
                    defaultModule = settings.defaultModuleForPC;
                    break;
                case ERP.DEVICE_TYPES.TABLET:
                    defaultModule = settings.defaultModuleForTablet;
                    break;
                case ERP.DEVICE_TYPES.MOBILE:
                    defaultModule = settings.defaultModuleForMobile;
                    break;
            }
            if(!defaultModule){
                defaultModule = self.defaultModule;
            }
        }

        if(defaultModule){
            self.defaultModule = self.modules[defaultModule];
        }
        else{
            if(self.modules){
                self.defaultModule = self.modules[Object.keys(self.modules)[0]];
            }
        }
        return self;
    }
    initializeDeviceType(){
        var self = this;
        if( window.screen.width <= 480 ) {
            self.deviceType = ERP.DEVICE_TYPES.MOBILE;
        }
        else if(window.screen.width >480 && window.screen.width < 800){
            self.deviceType = ERP.DEVICE_TYPES.TABLET;
        }
        else{
            self.deviceType = ERP.DEVICE_TYPES.PC;
        }
        if(self.deviceType !== ERP.DEVICE_TYPES.MOBILE){
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                self.deviceType = ERP.DEVICE_TYPES.MOBILE;
            }
        }
        document.body.classList.add(self.deviceType);
//        self.container.addClass(self.deviceType);
        return self;
    }
    initializePCUIElements(){
        var self = this;
        self.elements.titleElement.text(self.appSettings.displayName);
        self.elements.titleElement.text(self.appSettings.displayName);
        return self;
    }
    initializeDeviceOrientationType(){
        var self = this;
        switch(self.deviceOrientation){
            case ERP.DEVICE_ORIENTATIONS.PORTRAIT:
                self.elements.titleElement.text(self.appSettings.shortName);
                self.elements.applicationDisplayNameFooterElement.text(self.appSettings.displayName);
                break;
            case ERP.DEVICE_ORIENTATIONS.LANDSCAPE:
                self.elements.titleElement.text(self.appSettings.displayName);
                self.elements.applicationDisplayNameFooterElement.text(self.appSettings.shortName);
                break;
        }
        document.body.classList.remove(ERP.DEVICE_ORIENTATIONS.PORTRAIT);
        document.body.classList.remove(ERP.DEVICE_ORIENTATIONS.LANDSCAPE);
        document.body.classList.add(self.deviceOrientation);
        return self;
    }
    destroy(){
        var self = this;
        self.elements.reportsContentContainer.find('div').each(function(){
            $(this).remove();
        });
        self.elements.reportsNavPointerContainer.find('div').each(function(){
            $(this).remove();
        });
        self.elements.buttonSortingWindow.find('div').each(function(){
            $(this).remove();
        });
        self.elements.profileWindow.find('div').each(function(){
            $(this).remove();
        });
        self.directActionMenu.container.remove();

//            console.log($(this))
//            self.moduleNavPointer.container.remove();
//        });

//        });
        self.forEachFloatingReport(function(floatingReport){
            floatingReport.destroy();
        });

        self.moduleNavPointer.destroy();
        self.settingModulesNavPointer.destroy();
        self.elements.settingModulesContentContainer.children().remove();
        self.container.remove();
        if(self.user.userDetails.userName === 'admin'){
            self.elements.userButtonContainer.remove();
            self.elements.VisibilityButtonContainer.remove();
            self.elements.adminWindow.remove();
            self.elements.userWindow.remove();
            self.elements.visibilityWindow.remove();
        }
        self.elements.profileWindow.hide();
        self.elements.sortableNavWindow.hide();

        return self;
    }
    addElementsToAppSettingsContainer(){
        var self = this;
        if(self.user.userDetails.userName === 'admin'){
            var adminDiv = $(document.createElement('div')).attr(({id: "adminWindow", class: "hide-settings-window"})).appendTo(document.body);
            self.elements.adminWindow = adminDiv;

            var userDiv = $(document.createElement('div')).attr({id: "userWindow", class: "hide-settings-window"}).appendTo(document.body);
            self.elements.userWindow = userDiv;
            var titleContainer = $(document.createElement('div')).attr({class: "user-details-title-container"}).appendTo(self.elements.userWindow);
            var title = $(document.createElement('div')).attr({class: "user-details-title"}).appendTo(titleContainer);
            title.text('User Details Window');

            var visiblityDiv = $(document.createElement('div')).attr({id: "visibilityWindow", class: "hide-settings-window"}).appendTo(document.body);
            self.elements.visibilityWindow = visiblityDiv;

            var divVisibility = $(document.createElement('div')).attr({class: "app-settings-button-container"}).prependTo(self.elements.applicationSettingsContainer);
            var divUser = $(document.createElement('div')).attr({class: "app-settings-button-container"}).prependTo(self.elements.applicationSettingsContainer);

//            var divAdmin = $(document.createElement('div')).attr({class: "app-settings-button-container"}).prependTo(self.elements.applicationSettingsContainer);
//            var adminButton = $(document.createElement('div')).attr({class: "app-settings-button"}).appendTo(divAdmin);
//            var adminSpam = $(document.createElement('span')).text('Administrator').attr({class: "settings-content"}).appendTo(adminButton);

            var userButton = $(document.createElement('div')).attr({class: "app-settings-button"}).appendTo(divUser);
            var userSpan = $(document.createElement('span')).text('User').attr({class: "settings-content"}).appendTo(userButton);
            var visibilityButton = $(document.createElement('div')).attr({class: "app-settings-button"}).appendTo(divVisibility);
            var visibilitySpan = $(document.createElement('span')).text('Visibility').attr({class: "settings-content"}).appendTo(visibilityButton);

            var visibilityIcon = $(document.createElement('div')).attr({id: "visibilityIcon", class: "app-setting-icon"}).appendTo(divVisibility);
//            var adminIcon = $(document.createElement('div')).attr({id: "adminIcon", class: "app-setting-icon"}).appendTo(divAdmin);
            var userIcon = $(document.createElement('div')).attr({id: "userIcon", class: "app-setting-icon"}).appendTo(divUser);

            $('.app-settings-button').addClass('windows8tabs');
//            self.elements.adminButtonContainer = divAdmin
            self.elements.userButtonContainer = divUser
            self.elements.VisibilityButtonContainer = divVisibility

//            self.elements.adminButton = adminButton;
            self.elements.userSettingsButton = userButton;
            self.elements.visibilityButton = visibilityButton;

            self.elements.visibilityIcon = visibilityIcon;
//            self.elements.adminIcon = adminIcon;
            self.elements.userIcon = userIcon;
        }
        return self;
    }
    initializeColumnAndModuleVisibility(userConfig){
        var self = this;
        var config = {
            moduleVisibilityConfig:{
                displayName: "Module Visibility Manager",
                roles: {}
            },
            columnButtonFilterVisibilityConfig:{
                displayName: "Column Button Filter Visibility Manager",
                roles: {}
            },
            reportVisibilityConfig:{
                displayName: "Report Visibility Manager",
                roles: {}
            }
        };
        userConfig.data.forEach(function(role){
            config.moduleVisibilityConfig.roles[role.id] = {
                id: role.id,
                displayName: role.roleName,
                modules: JSON.parse(role.moduleVisibility || '{}')
            }
            config.columnButtonFilterVisibilityConfig.roles[role.id] = {
                id: role.id,
                displayName: role.roleName,
                modules: JSON.parse(role.columnButtonFilterVisibility || '{}')
            }
            config.reportVisibilityConfig.roles[role.id] = {
                id: role.id,
                displayName: role.roleName,
                reports: JSON.parse(role.reportVisibility || '{}')
            }
        });

        self.columnVisibilityManager = new ColumnVisibilityManager(config.columnButtonFilterVisibilityConfig, self.config, self);
        self.moduleVisibilityManager = new ModuleVisibilityManager(config.moduleVisibilityConfig, self.config, self);
        self.reportVisibilityManager = new ReportVisibityManager(config.reportVisibilityConfig, self.config, self);
        self.columnVisibilityManager.container.hide();
        self.reportVisibilityManager.container.hide();
        self.moduleVisibilityManager.container.hide();
        self.columnVisibilityManager.container.appendTo(self.elements.contentContainer);
        self.moduleVisibilityManager.container.appendTo(self.elements.contentContainer);
        self.reportVisibilityManager.container.appendTo(self.elements.contentContainer);
        return self;
    }
    createVisibilitySettingsContainer(){
        var self = this;
        var container = $(document.createElement('div')).attr(self.constants.visibilitySettingsContainer);
        var tableContainer = $(document.createElement('div')).attr({class: "visibility-table-container"}).appendTo(container);
        var table = $(document.createElement('table')).attr({class: "visibility-table"}).appendTo(tableContainer);
        var tr = $(document.createElement('tr')).appendTo(table);
        var td = $(document.createElement('td')).appendTo(tr);
        var titleContainer = $(document.createElement('div'))
            .attr({class: "visibility-title-container"}).appendTo(container);
        var title = $(document.createElement('span')).attr({class: "visibility-title"}).appendTo(titleContainer);
        title.text('Visibility Settings Window');

        var buttonTr = $(document.createElement('tr')).appendTo(table);
        var buttonTd = $(document.createElement('td')).appendTo(buttonTr);
        var buttonContainer = $(document.createElement('div')).attr({class: "visibility-button-container"}).appendTo(buttonTd);
        var columnVisibilityButtonContainer = $(document.createElement('div')).attr({class: "column-visibility-button-container"}).appendTo(buttonContainer);
        var columnVisibilityButton = $(document.createElement('button')).attr({class: "column-visibility-button"}).appendTo(columnVisibilityButtonContainer);
        columnVisibilityButton.text('Column Visibility')
        self.elements.columnVisibilityButton = columnVisibilityButton;
        var moduleVisibilityButtonContainer = $(document.createElement('div')).attr({class: "module-visibility-button-container"}).appendTo(buttonContainer);
        var moduleVisibilityButton = $(document.createElement('button')).attr({class: "module-visibility-button"}).appendTo(moduleVisibilityButtonContainer);
        moduleVisibilityButton.text('Module Visibility')
        self.elements.moduleVisibilityButton = moduleVisibilityButton;
        var reportVisibilityButtonContainer = $(document.createElement('div')).attr({class: "report-visibility-button-container"}).appendTo(buttonContainer);
        var reportVisibilityButton = $(document.createElement('button')).attr({class: "report-visibility-button"}).appendTo(reportVisibilityButtonContainer);
        reportVisibilityButton.text('Report Visibility');
        self.elements.reportVisibilityButton = reportVisibilityButton;

        var applyButtonContainer = $(document.createElement('div')).attr({class: "visibility-applychange-button-container"}).appendTo(buttonContainer);
        var applyButton = $(document.createElement('button')).attr({class: "column-visibility-button"}).appendTo(applyButtonContainer);
        applyButton.text('Apply Change');
        self.elements.applyButton = applyButton;

        var saveButtonContainer = $(document.createElement('div')).attr({class: "visibility-save-button-container"}).appendTo(buttonContainer);
        var saveButton = $(document.createElement('button')).attr({class: "column-visibility-button"}).appendTo(saveButtonContainer);
        saveButton.text('Save');
        self.elements.saveButton = saveButton;

        var contentTr = $(document.createElement('tr')).appendTo(table);
        var contentTd = $(document.createElement('td')).appendTo(contentTr);
        var contentContainer = $(document.createElement('div')).attr({class: "visibility-content-container"}).appendTo(contentTd);
        self.elements.contentContainer = contentContainer;
        self.elements.visibilitySettingsContentContainer = contentContainer;
        self.elements.visibilityWindow.append(container);
        self.elements.visibilitySettingsContainer = container;
        return self;
    }
    addContentsToAdministratorWindow(){
        var self = this;
        var adminWindow = self.elements.adminWindow;
        var userNamesContainer = $(document.createElement('div')).attr({class: "admin-window-user-names-container"}).appendTo(adminWindow);
        self.elements.adminWindowUserNamesContainer = userNamesContainer;
        var findOnlineUsersContainer = $(document.createElement('div')).attr({class: "find-online-users-container"}).appendTo(userNamesContainer);
        self.elements.findOnlineUsersContainer = findOnlineUsersContainer;
        var findOnlineUsersButton = $(document.createElement('div')).attr({class: "find-online-users-button"}).appendTo(findOnlineUsersContainer);
        findOnlineUsersButton.text('Online Users');
        self.elements.findOnlineUsersButton = findOnlineUsersButton;
        var onlineUsersContainer = $(document.createElement('div')).attr({class: "online-users-container"}).appendTo(userNamesContainer);
        self.elements.onlineUsersContainer = onlineUsersContainer;
        return self;
    }
    addOnlineUsersToContainer(onlineUsers){
        var self = this;
        self.elements.onlineUsersContainer.children().each(function(){
            var ele = $(this);
            ele.remove();
        });
        for(var key in onlineUsers){
            if(key === self.user.userDetails.userName){

            }
            else{
                var userObj = onlineUsers[key];
                var userContainer = $(document.createElement('div')).attr({id: userObj.userName, class: "admin-user-container"}).appendTo(self.elements.onlineUsersContainer);
                var userPicContainer = $(document.createElement('div')).attr({class: "user-pic-container"}).appendTo(userContainer);
                var userPic = $(document.createElement('div')).attr({class: "user-pic"}).appendTo(userPicContainer);

                var userNameContainer = $(document.createElement('div')).attr({class: "admin-window-user-name-container"}).appendTo(userContainer);
                var user = $(document.createElement('div')).attr({class: "admin-window-user"}).appendTo(userNameContainer);
                user.text(userObj.userName);
                var userDetailsContainer = new UserDetailsContainer(userObj, self);
                userDetailsContainer.container.appendTo(document.body);
                userDetailsContainer.container.hide();
                self.userDetailsContainers[userObj.userName] = userDetailsContainer;

                self.bindUserContainerClick(userContainer, userObj);
                if(!userObj.isAdmin){
//                    var adminLogoutButtonContainer = $(document.createElement('div')).attr({class: "admin-logout-button-container"}).appendTo(userContainer);
//                    var adminLogoutButton = $(document.createElement('div')).attr({class: "admin-logout-button"}).appendTo(adminLogoutButtonContainer);
//                    self.bindAdminLogout(adminLogoutButton, userObj);
                }
                else{
//                    userNameContainer.css({top: '0px'});
//                    userContainer.css({top: '-9px'});
//                    user.css({"min-width": "98px"})
                }
            }

        }
        return self;
    }
    bindUserContainerClick(userContainer, user,userName){
        var self = this;

        userContainer.on('click', function(){
            if(confirm('Force Logout: '+ user.userName)){
                userContainer.off('click');
                self.socket.emit('forced_logout', user);
            }
        });
        return self;
    }
    /*bindAdminLogout: function(button, user){
     var self = this;
     button.on('click', function(){
     self.socket.emit('forced_logout', user);
     });
     return self;
     },*/
    addDetailsToProfileWindow(){
        var self = this;
        var profileWindow = self.elements.profileWindow;
        var windowTitleContainer = $(document.createElement('div')).attr({class: "profile-window-title-container"}).appendTo(profileWindow);
        var windowTitle = $(document.createElement('div')).attr({class: "profile-window-title"}).appendTo(windowTitleContainer);
        windowTitle.text('Profile Manager window');
        var titleContainer = $(document.createElement('div')).attr({class: "profile-title-container"}).appendTo(profileWindow);
        var title = $(document.createElement('div')).attr({class: "profile-title-name"}).appendTo(titleContainer);
        title.text(self.user.userDetails.userName+'\'s profile');
        var container = $(document.createElement('div')).attr({class: "password-editing--container"}).appendTo(profileWindow)
        var passwordContainer = $(document.createElement('div')).attr({class: "password-container"}).appendTo(container);
        var managePasswordContainer = $(document.createElement('div')).attr({class: "manage-password-container"}).appendTo(passwordContainer);
        var managePassword = $(document.createElement('div')).attr({class: "manage-password"}).appendTo(managePasswordContainer);
        self.elements.managePassword = managePassword;
        self.elements.passwordContainer = passwordContainer;
        self.elements.managePasswordContainer = managePasswordContainer;
        return self;
    }
    managePassWordInProfileWindow(){
        var self = this;
        var container = $(document.createElement('div')).attr({class: "password-changing-container"}).appendTo(self.elements.passwordContainer);

        var oldPasWordContainer = $(document.createElement('div')).attr({class: "old-password-container"}).appendTo(container);
        var newPassWordContainer = $(document.createElement('div')).attr({class: "new-password-container"}).appendTo(container);
        var reEneteringContainer = $(document.createElement('div')).attr({class: "re-enter-password-container"}).appendTo(container);
        var changeContainer = $(document.createElement('div')).attr({class: "change-container"}).appendTo(container);
        var backContainer= $(document.createElement('div')).attr({class: "back-container"}).appendTo(container);

        var name1 = $(document.createElement('div')).attr({class: "password-names"}).text('Old Password').appendTo(oldPasWordContainer);
        var name2 = $(document.createElement('div')).attr({class: "password-names"}).text('New Password').appendTo(newPassWordContainer);
        var name3 = $(document.createElement('div')).attr({class: "password-names"}).text('Re-enter Password').appendTo(reEneteringContainer);

        var oldpassWord = $(document.createElement('input')).attr({class: "password-boxes"}).attr({type: "password"}).appendTo(oldPasWordContainer);
        var newPassword = $(document.createElement('input')).attr({class: "password-boxes"}).attr({type: "password", placeholder: "minimum 4 charectors"}).appendTo(newPassWordContainer);
        var reEnterPassWord = $(document.createElement('input')).attr({class: "password-boxes"}).attr({type: "password"}).appendTo(reEneteringContainer);
        var changeButton = $(document.createElement('button')).text('Change').appendTo(changeContainer);
        var backButton = $(document.createElement('button')).text('Back').appendTo(backContainer);
        self.elements.changeButton = changeButton;
        self.elements.passwordBackButton = backButton;
        self.elements.oldpassWord = oldpassWord;
        self.elements.newPassword = newPassword;
        self.elements.reEnterPassWord = reEnterPassWord;
        self.elements.passwordChangingContainer = container;
        backButton.hide();
        return self;
    }
    changePassword(){
        var self = this;
        var newPassword = self.elements.newPassword.val();
        var reEnteredPassword = self.elements.reEnterPassWord.val();
        var oldPassword = self.elements.oldpassWord.val();

        if(newPassword.length < 4){
            self.user.notifier.showErrorNotification('too short password');
            self.elements.newPassword.val('');
            self.elements.reEnterPassWord.val('');
            return;
        }
        else{
            if(newPassword != reEnteredPassword){
                self.elements.newPassword.val('');
                self.elements.reEnterPassWord.val('');
                self.user.notifier.showErrorNotification('re-entered password bot matching');
            }
            else{
                var data = {};
                data.password = newPassword;
                data.userName = self.user.userDetails.userName;
                data.oldPassword = oldPassword;
                self.socket.emit('change_password', data);
            }
        }
        return self;
    }
    saveModulePositionConfig(config){
        var self = this;
        self.saveUserSetting('modulesNavigationArrangementHorizontal', config, function(data){
//            console.log(data)
        });
        return self;
    }
    addButtonsToButtonSortingWindow(){
        var self = this;

        var tableContainer = $(document.createElement('div')).attr({class: "button-sorting-window-table-container"}).appendTo(self.elements.buttonSortingWindow);
        var table = $(document.createElement('table')).attr({class: "button-sorting-window-table"}).appendTo(tableContainer);
        var titleTr = $(document.createElement('tr')).appendTo(table);
        var selectorTr = $(document.createElement('tr')).appendTo(table);
        var gridTr = $(document.createElement('tr')).appendTo(table);
        var formTr = $(document.createElement('tr')).appendTo(table);
        var filterTr = $(document.createElement('tr')).appendTo(table);
        var titleTd = $(document.createElement('td')).appendTo(titleTr);
        var selectorTd = $(document.createElement('td')).appendTo(selectorTr);
        var gridTd = $(document.createElement('td')).appendTo(gridTr);
        var formTd = $(document.createElement('td')).appendTo(formTr);
        var filterTd = $(document.createElement('td')).appendTo(filterTr);
        var conatiner = $(document.createElement('div'))
            .attr({class: "button-window-title-container"}).appendTo(tableContainer);
        var container1 = $(document.createElement('div')).attr({class: "button-sorting-window-in-heading-container"}).appendTo(selectorTd);
        var container2 = $(document.createElement('div')).attr({class: "button-sorting-window-grid-container"}).appendTo(gridTd)
        var container3 = $(document.createElement('div')).attr({class: "button-sorting-window-formview-container"}).appendTo(formTd)
        var container4 = $(document.createElement('div')).attr({class: "button-sorting-window-filter-container"}).appendTo(filterTd);

        var title = $(document.createElement('div')).text('Button Sorting Window').attr({class: "button-window-title"}).appendTo(conatiner);
        var selectorContainer = $(document.createElement('div')).attr({class: "button-sort-window-selector-container"}).appendTo(container1);
        var selectortable = self.createSelectorTableForButtonSorting();
        selectortable.appendTo(selectorContainer);
        var saveButtonContainer = $(document.createElement('div')).attr({class: "save-button-positions-container"}).appendTo(container1)
        var saveButtonPositionsButton = $(document.createElement('button')).attr({class: "save-buttonposition-button"}).text('Save').appendTo(saveButtonContainer);
        self.elements.saveButtonPositionsButton = saveButtonPositionsButton;
        var buttonsContainer = $(document.createElement('div')).attr({class: "buttons-container-in-sorting-window"}).appendTo(container2);
        var gridTitleContainer = $(document.createElement('div')).attr({class: "grid-view-title-container"}).appendTo(buttonsContainer)
        var title = $(document.createElement('div')).attr({class: "grid-view-title"}).text('Grid View Buttons').appendTo(gridTitleContainer);
        self.elements.buttonsContainerInSortingWindow = buttonsContainer;
        var formViewButtonsContainer = $(document.createElement('div')).attr({class: "formview-buttons-container-in-sorting-window"}).appendTo(container3);
        var formTitleContainer = $(document.createElement('div')).attr({class: "form-view-title-container"}).appendTo(formViewButtonsContainer)
        var title = $(document.createElement('div')).attr({class: "form-view-title"}).text('Form View Buttons').appendTo(formTitleContainer);
        self.elements.formViewButtonsContainerInSortingWindow = formViewButtonsContainer;
        var filtersContainer = $(document.createElement('div')).attr({class: "filters-container-in-sorting-window"}).appendTo(container4);
        var filtersTitleContainer = $(document.createElement('div')).attr({class: "filters-title-container"}).appendTo(filtersContainer)
        var title = $(document.createElement('div')).attr({class: "filters-title"}).text('Filters').appendTo(filtersTitleContainer);
        self.elements.filtersContainerInSortingWindow = filtersContainer;
        return self;
    }
    createSelectorTableForButtonSorting(){
        var self = this;
        var table = $(document.createElement('table')).attr({class: "button-sorting-window-selector-table"});
        var tr = $(document.createElement('tr')).appendTo(table);
        var tdModule = $(document.createElement('td')).appendTo(tr);
        var tdSubModule = $(document.createElement('td')).appendTo(tr);
//        var tdColumn = $(document.createElement('td')).appendTo(tr);

        var moduleSelect = $(document.createElement('select')).attr({class: "button-sorting-window-module-select"}).appendTo(tdModule);
        var subModuleSelect = $(document.createElement('select')).attr({class: "button-sorting-window-submodule-select"}).appendTo(tdSubModule);
//        var columnSelect = $(document.createElement('select')).attr(self.columnVisibilityManager.constants.columnSelect).appendTo(tdColumn);

        for(var key in self.config.modules){
            var module = self.config.modules[key];
            var moduleOption = $(document.createElement('option')).text(module.displayName).val(module.id);
            moduleOption.appendTo(moduleSelect);
        }

        moduleSelect.on('change', function(){
            subModuleSelect.empty();
            var selectedModule = moduleSelect.val();
            for(var key in self.config.modules[selectedModule].subModules){
                var subModule = self.config.modules[selectedModule].subModules[key];
                var subModuleOption = $(document.createElement('option')).text(subModule.displayName).val(subModule.id);
                subModuleOption.appendTo(subModuleSelect);
            }
            subModuleSelect.trigger('change');
//            columnSelect.trigger('change');
        });
        moduleSelect.trigger('change');

        self.elements.buttonSortingWindowSubmoduleSelect = subModuleSelect;
        self.elements.buttonSortingWindowModuleSelect = moduleSelect;

//        var columnOption1 = $(document.createElement('option')).text('Column').val('column');
//        var columnOption2 = $(document.createElement('option')).text('Button').val('button');
//        columnSelect.append(columnOption1).append(columnOption2);

//        columnVisibilityManager.elements.selectorTable = table;
//        columnVisibilityManager.elements.moduleSelect = moduleSelect;
//        columnVisibilityManager.elements.subModuleSelect = subModuleSelect;
//        columnVisibilityManager.elements.columnSelect = columnSelect;
        return table;
    }

    logOut(logout_callback){
        var self = this;
        $.ajax({
            url: self.backend_root_url + "/logout",
            type: "POST"
        }).done(function(data){
            if(data.success){
                clearInterval(self.idleInterval);
                self.addLookUpsToLocalStorage();
                self.unBindEvents();
                self.destroy();
                self.elements.sortableNavWindow.css('display','');
                self.elements.profileWindow.css('display','');
                self.hideAppSettingsContainer();
//                    self.elements.applicationSettingsContainer.hide();
                self.elements.documentWrapper.find('button').off();
                self.elements.applicationSettingsContainer.find('div').each(function(){
                    var ele = $(this);
                    ele.find('div').off();
                });
                // self.reportsSplitLayout.destroy();
                // self.user.clearUserConfig();

                // self.user.showLoginScreen(self.user.isDirectLogin);
                // self.initializeSocketIO();
                // self.moduleNavPointer.destroy();
                logout_callback && logout_callback();
            }
        });
    }

    unBindEvents(){
        var self  =this;
        self.elements.logoutButton.off('click');
        self.elements.directActionButton.off('click');
        return self;
    }
    initializeUser(){
        var self = this;

        return self;
    }
    async initializeModules(){
        var self = this;
        self.modules = {};
        self.hiddenModules = {};
        self.settingModules = {};
        self.disabledModules = {};
        self.allModules = {};


        var moduleVisibilitySettings = self.visibilitySettings.moduleVisibility;


        for(var key in moduleVisibilitySettings){
            var moduleConfig = moduleVisibilitySettings[key];
            if(moduleConfig.isVisible === false){
                self.hiddenModules[moduleConfig.id] = self.config.modules[moduleConfig.id];
                delete self.config.modules[moduleConfig.id];
            }
        }
        for(var key in self.config.modules){
            var moduleConfig =  self.config.modules[key];
            if(moduleConfig.disabled){
                self.disabledModules[moduleConfig.id] = self.config.modules[moduleConfig.id];
                delete self.config.modules[moduleConfig.id];
            }
            else if(moduleConfig.type == 'settings'){
                self.allModules[moduleConfig.id] = self.settingModules[moduleConfig.id] = new Module(self.config.modules[moduleConfig.id], self);
                //delete self.config.modules[moduleConfig.id];
            }
            else{
                self.allModules[moduleConfig.id] = self.modules[moduleConfig.id] = new Module(moduleConfig, self);
            }
            if(self.allModules[moduleConfig.id]){
                await self.allModules[moduleConfig.id].initialize();
            }
        }
        return self;
    }
    initializeFloatingWindows(){
        var self = this;
        if(self.deviceType == ERP.DEVICE_TYPES.MOBILE){
            return self;
        }
        var newFloatingReports = {};
        for( var key in self.floatingReports){
            var subReport = self.floatingReports[key];
            var dataSource = {
                reportId: subReport.report.id,
                subReportId: subReport.id
            }
            newFloatingReports[key] = new FloatingWindow({
                dataSource: dataSource,
                headerText: subReport.displayName,
                position: self.user.userDetails.settings[subReport.id + '_floatingWindow'] || {
                    isLeft: true
                }
            }, self);
        }
        self.floatingReports = newFloatingReports;
        return self;
    }
    forEachFloatingReport(eachFunction, filterFunction){
        var self = this;
        var count = 0;
        for(var key in self.floatingReports){
            var floatingReport = self.floatingReports[key];
            if(filterFunction){
                if(filterFunction(floatingReport)){
                    eachFunction.apply(floatingReport, [floatingReport, count++]);
                }
            }
            else{
                eachFunction.apply(floatingReport, [floatingReport, count++]);
            }
        }
        return self;
    }
    createElements(){
        var self = this;
        self.elements = {};
        self.userDetailsContainers = {};
        self.gridViewButtonsPositionConfig = {
            modules: {}
        }
        self.formViewButtonsPositionConfig = {
            modules: {}
        }
        self.filtersPositionConfig = {
            modules: {}
        }
//        self.selectedVisibility;
        self.visibilityConfig = {};
        self.elements.titleElement  = $(self.selectors.titleElement);
        self.elements.applicationDisplayNameFooterElement  = $(self.selectors.applicationDisplayNameFooterElement);
        self.elements.showReportsButton  = $(self.selectors.showReportsButton);
        self.elements.moduleNavPointerContainer  = $(self.selectors.moduleNavPointerContainer);
        self.elements.reportsContainer = $(self.selectors.reportsContainer);
        self.elements.reportsContentContainer = self.elements.reportsContainer.find(self.selectors.reportsContentContainer);
        self.elements.reportsNavPointerContainer  = $(self.selectors.reportsNavPointerContainer);
        self.elements.selectThemeChooser  = $(self.selectors.selectThemeChooser);
        self.elements.switchStyle  = $(self.selectors.switchStyle);
        self.elements.dashboardContainer = $(self.selectors.dashboardContainer);
        self.elements.userName = $(self.selectors.userName);
        self.elements.userImage= $(self.selectors.userImage);
        self.elements.content = $(self.selectors.contentContainer);
        self.elements.applicationSettingsContainer = $(self.selectors.applicationSettingsContainer);
        self.elements.appSettingsIcon = $(self.selectors.appSettingsIcon);
//        self.elements.profileButton = $(self.selectors.profileButton);
//        self.elements.preferencesButton = $(self.selectors.preferencesButton);
        self.elements.sortableNavButton = $(self.selectors.sortableNavButton);
        self.elements.logoutButton = $(self.selectors.logoutButton);
        self.elements.appSettingsBackButton = $(self.selectors.appSettingsBackButton);
        self.elements.profileWindow = $(self.selectors.profileWindow);
        self.elements.sortableNavWindow = $(self.selectors.sortableNavWindow);
        self.elements.bodyWrapper = $(self.selectors.bodyWrapper);
        self.elements.documentWrapper = $(self.selectors.documentWrapper);
        self.elements.pdf = $(self.selectors.pdf);
        self.elements.buttonSortingWindow = $(self.selectors.buttonSortingWindow);

        self.elements.reportBugButton = $(self.selectors.reportBugButton);
        self.elements.reportsTitle = $(self.selectors.reportsTitle);

        self.elements.saveModuleNavigationMode = $(self.selectors.saveModuleNavigationMode);
        self.elements.moduleNavigationModeForMobile = $(self.selectors.moduleNavigationModeForMobile);
        self.elements.moduleNavigationModeForTablet = $(self.selectors.moduleNavigationModeForTablet);
        self.elements.moduleNavigationModeForPC = $(self.selectors.moduleNavigationModeForPC);

        self.elements.saveDefaultModule = $(self.selectors.saveDefaultModule);
        self.elements.defaultModuleForMobile = $(self.selectors.defaultModuleForMobile);
        self.elements.defaultModuleForTablet = $(self.selectors.defaultModuleForTablet);
        self.elements.defaultModuleForPC = $(self.selectors.defaultModuleForPC);

        self.elements.saveMiscSettings = $(self.selectors.saveMiscSettings);
        self.elements.applicationFontSize = $(self.selectors.applicationFontSize);


        self.elements.floatingReportsCheckboxes = $(self.selectors.floatingReportsCheckboxes);
        self.elements.saveFloatingReportsSelection = $(self.selectors.saveFloatingReportsSelection);

        self.elements.buttonsSortingWindowIcon = $(self.selectors.buttonsSortingWindowIcon);
        self.elements.sortableNavIcon = $(self.selectors.sortableNavIcon);
        self.elements.appSettingsBackButtonIcon = $(self.selectors.appSettingsBackButtonIcon);
        self.elements.profileIcon = $(self.selectors.profileIcon);
        self.elements.profileButton = $(self.selectors.profileButton);
        self.elements.preferencesIcon = $(self.selectors.preferencesIcon);
        self.elements.settingModulesNavPointerContainer = $(self.selectors.settingModulesNavPointerContainer);
        self.elements.settingModulesContentContainer = $(self.selectors.settingModulesContentContainer);
        self.elements.preferencesButton = $(self.selectors.preferencesButton);
        self.elements.preferencesWindow = $(self.selectors.preferencesWindow);

        self.elements.sortableNavButton = $(self.selectors.sortableNavButton);
        self.elements.buttonsSortingWindowButton = $(self.selectors.buttonsSortingWindowButton);
        self.elements.appSettingsBackButton = $(self.selectors.appSettingsBackButton);

        self.elements.leftAlignReportNavContainer = $(self.selectors.leftAlignReportNavContainer);

        self.elements.directActionButton = $(self.selectors.directActionButton);

        self.elements.userName.text(self.user.userDetails.fullName);

        self._creation.createElements(self)
        return self;
    }
    setDefaultModuleValues(){
        var self = this;

        var options = [];
        self.forEachModule(function(module){
            var option = document.createElement('option');
            option.innerHTML = module.displayName;
            option.value = module.id;
            options.push(option);
        });

        var userSettings = self.user.userDetails.settings;
        self.elements.defaultModuleForMobile.append($(options).clone()).val(userSettings.defaultModuleForMobile);
        self.elements.defaultModuleForTablet.append($(options).clone()).val(userSettings.defaultModuleForTablet);
        self.elements.defaultModuleForPC.append($(options).clone()).val(userSettings.defaultModuleForPC);


        return self;
    }
    getDefaultModuleValues(){
        var self = this;
        var obj = {};
        obj.defaultModuleForMobile = self.elements.defaultModuleForMobile.val();
        obj.defaultModuleForTablet = self.elements.defaultModuleForTablet.val();
        obj.defaultModuleForPC = self.elements.defaultModuleForPC.val();
        return obj;
    }
    setMiscSettingsValues(){
        var self = this;
        var settings = self.user.userDetails.settings || {};
        self.elements.applicationFontSize.val(settings.applicationFontSize || 'small');
        return self;
    }
    getUserSetting(settingName){
        var self = this;
        return self.user.userDetails.settings[settingName];
    }
    getMiscSettingsValues(){
        var self = this;
        var obj = {};
        obj.applicationFontSize = self.elements.applicationFontSize.val();
        return obj;
    }
    saveDefaultModuleValues(){
        var self = this;
        var obj = self.getDefaultModuleValues();
        for(var key in obj){
            self.saveUserSetting(key, obj[key]);
        }
        self.notifier.showSuccessNotification('Default Module Saved Successfully');
        return self;
    }

    saveMiscSettingsValues(){
        var self = this;
        var obj = self.getMiscSettingsValues();
        for(var key in obj){
            self.saveUserSetting(key, obj[key]);
        }
        self.notifier.showSuccessNotification('Settings Saved Successfully');
        return self;
    }

    setFloatingReportsSelectionValues(){
        var self = this;
        self.elements.floatingReportsCheckboxes.empty();
        for(var key in self.floatingReports){
            var floatingReport = self.floatingReports[key];
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            var chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.checked = true;
            chk.id = floatingReport.subReport.id+'_chk';
            chk.value = floatingReport.subReport.id;
            if(floatingReport.config.position && floatingReport.config.position.isEnabled !== undefined){
                chk.checked = floatingReport.config.position.isEnabled == true;
            }
            var label = document.createElement('label');
            label.setAttribute('for', chk.id) ;
            label.innerHTML = floatingReport.subReport.displayName;
            tr.appendChild(td);
            td.appendChild(chk);
            td.appendChild(label);
            self.elements.floatingReportsCheckboxes.append(tr);
        }

        return self;
    }
    getFloatingReportsSelectionValues(){
        var self = this;
        var obj = {};
        self.elements.floatingReportsCheckboxes.find('input:checkbox').each(function(){
            obj[this.value] = this.checked;
        });
        return obj;
    }
    saveFloatingReportsSelectionValues(){
        var self = this;
        var obj = self.getFloatingReportsSelectionValues();
        for(var key in obj){
            var config = self.user.userDetails.settings[key + '_floatingWindow'] || {};
            config.isEnabled = obj[key];
            self.saveUserSetting(key + '_floatingWindow', config, function(){
            });
        }
        self.notifier.showSuccessNotification('Floating Reports Settings Saved Successfully');
        return self;
    }

    setNavigationModeValues(){
        var self = this;
        var settings = self.user.userDetails.settings;
        self.elements.moduleNavigationModeForMobile.val(settings.moduleNavigationModeForMobile);
        self.elements.moduleNavigationModeForTablet.val(settings.moduleNavigationModeForTablet);
        self.elements.moduleNavigationModeForPC.val(settings.moduleNavigationModeForPC);
        return self;
    }
    getNavigationModeValues(){
        var self = this;
        var obj = {};
        obj.moduleNavigationModeForMobile = self.elements.moduleNavigationModeForMobile.val();
        obj.moduleNavigationModeForTablet = self.elements.moduleNavigationModeForTablet.val();
        obj.moduleNavigationModeForPC = self.elements.moduleNavigationModeForPC.val();

        return obj;
    }
    saveNavigationModeValues(){
        var self = this;
        var obj = self.getNavigationModeValues();
        for(var key in obj){
            self.saveUserSetting(key, obj[key]);
        }
        self.notifier.showSuccessNotification('Navigation Modes Saved Successfully');
        return self;
    }
    saveButtonsOrder(){
        var self = this;
        var buttonsPosition = {
            gridViewButtonsOrder: self.createButtonsPositionJson(self.elements.buttonsContainerInSortingWindow, self.gridViewButtonsPositionConfig),
            formViewButtonsOrder: self.createButtonsPositionJson(self.elements.formViewButtonsContainerInSortingWindow, self.formViewButtonsPositionConfig),
            /* filtersOrder: self.createButtonsPositionJson(self.elements.filtersContainerInSortingWindow, self.filtersPositionConfig)*/
        }
        var settingName = self.elements.buttonSortingWindowSubmoduleSelect.val()+ '_buttonsOrder';
        self.saveUserSetting(settingName, buttonsPosition, function(data){
            if(data.success){
                self.notifier.showSuccessNotification('Buttons Order Saved Successfully');
            }
        });
        return self;
    }
    saveGridOrder(subModule, json){
        var self = this;
        var settingName = subModule.id + '_gridOrder';
        self.saveUserSetting(settingName, json, function(data){
            if(data.success){
                self.notifier.showSuccessNotification('Grid Order Saved Successfully');
            }
        });
        return self;
    }
    saveInlineFiltersOrder(subModule, obj){
        var self = this;
        var settingName = subModule.id+ '_inlineFiltersOrder';
        self.saveUserSetting(settingName, obj, function(data){
            if(data.success){
                self.notifier.showSuccessNotification('Filters Order Saved Successfully');
            }
        });
        return self;
    }
    saveFormViewConfiguration(subModule, mode, obj){
        var self = this;
        var settingName = subModule.id+ '_'+ mode + '_formViewConfiguration';
        self.saveUserSetting(settingName, obj, function(data){
//            if(data.success){
//                self.notifier.showSuccessNotification('FormView Width Saved Successfully');
//            }
        });
        return self;
    }
    saveSimpleDataTableConfiguration(subModule, column, obj){
        var self = this;
        var settingName = subModule.id+ '_'+ column.id + '_simpleDataTableConfiguration';
        self.saveUserSetting(settingName, obj, function(data){
//            if(data.success){
//                self.notifier.showSuccessNotification('Simple Data Table Configuration Saved Successfully');
//            }
        });
        return self;
    }
    saveUserSetting(settingName, settingValue, saveUserSettingCallBack){
        var self = this;

        var data = {
            config: JSON.stringify(settingValue),
            settingName: settingName
        };
        self.socket.emit('save_user_setting', data);
        self.socket.once('save_user_setting_done', function(data){
            saveUserSettingCallBack && saveUserSettingCallBack(data);
        });
        return self;
    }
    saveRoleSetting(settingName, settingValue, saveRoleSettingCallBack){
        var self = this;

        var data = {
            config: JSON.stringify(settingValue),
            settingName: settingName
        };
        self.socket.emit('save_role_setting', data);
        self.socket.once('save_role_setting_done', function(data){
            saveRoleSettingCallBack && saveRoleSettingCallBack(data);
        });
        return self;
    }
    saveRoleSettingForSpecificRole(roleId, settingName, settingValue, saveRoleSettingForSpecificRoleCallBack){
        var self = this;
        var data = {
            roleId: roleId,
            config: JSON.stringify(settingValue),
            settingName: settingName
        };
        self.socket.emit('save_role_for_specific_role_setting', data);
        self.socket.once('save_role_for_specific_role_setting_done', function(data){
            saveRoleSettingForSpecificRoleCallBack && saveRoleSettingForSpecificRoleCallBack(data);
        });
        return self;
    }
    saveVisibilityConfig(){
        var self = this;
        var obj = self.getVisibilityConfig();

        var moduleVisibilityRoles = obj[(self.visibilitySettingSelected || 'moduleVisibility')].roles;
        for(var key in moduleVisibilityRoles){
            var roleName = key;
            var value = moduleVisibilityRoles[key].modules || moduleVisibilityRoles[key].reports;
            self.saveRoleSettingForSpecificRole(roleName, self.visibilitySettingSelected, value, function(data){
                self.notifier.showSuccessNotification('Visibility Settings Saved Successfully');
            });
        }
        return self;
    }
    getVisibilityConfig(){
        var self = this;
        var obj = {
            moduleVisibility: self.moduleVisibilityManager.moduleVisibilityJson,
            columnButtonFilterVisibility: self.columnVisibilityManager.columnVisibilityJson,
            reportVisibility: self.reportVisibilityManager.reportVisiblityJson
        };

//        self.visibilityConfig.moduleVisibilityConfig = moduleVisibility;
//        self.visibilityConfig.columnVisibilityConfig = columnVisibility;
//        self.visibilityConfig.reportVisibilityConfig = reportVisibility;

        return obj;
    }
    initializeReports(){
        var self = this;
        self.reports = {};

        self.hiddenReports = {};
        self.disabledReports = {};
        self.allReports = {};
        var disableReportsAccess = self.user.userDetails.roleSettings.disableReportsAccess || false;

        var reportVisibilitySettings = self.visibilitySettings.reportVisibility;


        for(var key in reportVisibilitySettings){
            var reportConfig = reportVisibilitySettings[key];
            if(reportConfig.isVisible === false){
                self.hiddenReports[reportConfig.id] = self.config.reports[reportConfig.id];
                delete self.config.reports[reportConfig.id];
            }
        }

        if(disableReportsAccess){
            setTimeout(function(){
                self.elements.showReportsButton.hide();
                self.removeTopLevelNavigationItem('reports');
            }, 100);

            return self;
        }
        else{
            setTimeout(function(){
                self.elements.showReportsButton.show();
            }, 100);
        }


        for(var key in self.config.reports){
            var reportConfig = self.config.reports[key];
            self.reports[reportConfig.id] = new Report(reportConfig, self);
        }
        return self;
    }
    createReportsSplitLayout(){
        var self = this;

//         var reportsSplitLayoutConfig = {
//             container: self.elements.reportsContainer,
//             targetContainer: 'body',
//             direction: 'bottom',
//             zIndex: 999,
//             pageSize: "100%",
//             closeButton: ".hideReportsButton",
//             onShowForFirstTime(){
//                 self.setDefaultReport();
//             },
//             onAfterShow(splitLayout){
// //        console.log('hiding')
//             },
//             onAfterHide(splitLayout){
//             }
//         }
//         self.reportsSplitLayout = new SplitLayout(reportsSplitLayoutConfig, self);

        return self;
    }
    configureSocket(){
        var self = this;
        self._socket.configureSocket(self);
        return self;
    }
    setDefaultModule(){
        var self = this;
        // console.log(self.getDefaultModule().container.attr('style'))
        self.setSelectedModule(self.getDefaultModule(), {fromTrigger: false});
        // console.log(self.getDefaultModule().container.attr('style'))
        return self;
    }
    setDefaultReport(){
        var self = this;
        self.setSelectedReport(self.getDefaultReport(), true);
        return self;
    }

    userLoggedIn(user){
        var self = this;
        //self.moduleNavPointer.setDefaultValue();
        self.setSelectedModule(self.getDefaultModule(), {fromTrigger: true});
        return self;
    }
    addUltoSortableNavWindow(){
        var self=  this;
        var modulesIndock = self.moduleNavPointer.container;

        self.elements.sortableNavWindow.append(modulesIndock);
        var modulesUl = self.elements.sortableNavWindow.find('ul');
        var moduleGroupContainer = modulesUl.find('.module-group-main-container');
//        modulesUl.css({width: "100%"})
        if(!self.elements.sortableNavWindow.find('.'+ self.constants.addModuleGroup.class).length){
            var addGroup = $(document.createElement('div'))
                .attr(self.constants.addModuleGroup).val('Add Group');
            var imageDiv =  $(document.createElement('div')).addClass('div-icon')
                .css({'background-image':'url(pics/add_group.png)'}).appendTo(addGroup);
            var addGroupSpan = $(document.createElement('span')).text('Add Group').appendTo(addGroup);
            modulesIndock.append(addGroup);
            self.elements.addGroup = addGroup;
            self.elements.addGroup.on('click',function(){
                self.showPopupMenu();
            });
        }

        modulesIndock.addClass('modules-in-sorting-window');
        modulesIndock.css({
            position: "relative",
            background: "white",
            width: "95%%",
            left: "25px",
            margin: "25px",
            "box-shadow": "1px 1px 0px 1px rgba(122, 122, 122, 0.43)"
        });
        modulesUl.sortable({
            connectWith: ".module-group-container",
//            axis: 'x',
            stop(){
                self.saveModulePositionConfig(self.createModulePositionConfig(modulesUl));
            }
        });

        modulesUl.find('.module-group-container').sortable({
            connectWith: modulesUl
        });

//        modulesUl.find('li').each(function(){
//            var li = $(this);
//            li.css({'color': '#fffff', padding: "8px", opacity: "1"});
//            li.addClass('module-names-in-sort-window');
//        })
        return self;
    }
    showPopupMenu(){
        var self = this;
        var getGroupName = $(document.createElement('div')).appendTo(self.elements.sortableNavWindow).attr(self.constants.popUpMenu);
        var table = $(document.createElement('table')).appendTo(getGroupName);
        var tr = $(document.createElement('tr')).appendTo(table);
        var td = $(document.createElement('td')).appendTo(tr);
        var nameSpan = $(document.createElement('span')).text('Group Name').appendTo(td);

        var td1= $(document.createElement('td')).appendTo(tr);
        var nametextArea = $(document.createElement('input')).attr('type','text').appendTo(td1);
        var tr1 = $(document.createElement('tr')).appendTo(table);
        var td2= $(document.createElement('td')).appendTo(tr1);
        var IDSpan = $(document.createElement('span')).text('Group ID').appendTo(td2);
        var td3= $(document.createElement('td')).appendTo(tr1);
        var IDtextArea = $(document.createElement('input')).attr('type','text').appendTo(td3);
        var buttonContainer = $(document.createElement('div')).appendTo(getGroupName);
        var addButton = $(document.createElement('button')).text('Add Group').appendTo(buttonContainer);
        var cancelButton = $(document.createElement('button')).text('Cancel').appendTo(buttonContainer);

        addButton.on('click',function(){
            if(nametextArea.val() && IDtextArea.val()){
                var container = self.createGroupContainer(nametextArea.val(),IDtextArea.val());
                container.appendTo(self.moduleNavPointer.elements.ulMain);
                getGroupName.remove();
//                self.elements.sortableNavWindow.find('ul').sortable('disable')
                (self.elements.sortableNavWindow.find('ul')).sortable({
                    connectWith: ".nav-element",
                    stop(){
                        self.saveModulePositionConfig(self.createModulePositionConfig(self.elements.sortableNavWindow.find('ul')));
                    }
                });
            }else{
                if(!IDtextArea.val()){
                    IDtextArea.css('background-color','red');
                }else{
                    nametextArea.css('background-color','red');
                }
            }
        });
        cancelButton.on('click',function(){
            getGroupName.remove();
        });

    }
    createGroupContainer(groupname,id){
        var self = this;
        var containers = $(document.createElement('div')).attr(self.constants.moduleGroupMainContainer).attr('id',id);
        var container = $(document.createElement('ul')).attr(self.constants.moduleGroupContainer).attr('id',id)
            .addClass('nav-element')
            .attr('value',groupname).appendTo(containers);
        var titleDiv =  $(document.createElement('div')).attr(self.constants.moduleGroupTitleDiv).appendTo(containers);
        var titlespan =  $(document.createElement('span')).text(groupname).appendTo(titleDiv);
        var closebutton = $(document.createElement('span')).text('X').appendTo(titleDiv).attr(self.constants.groupCloseButtons);
//        var groupUl =  $(document.createElement('ul')).appendTo(container).attr('class','sortableUl');

        closebutton.on('click',function(){
            container.find('li')
                .appendTo(self.elements.sortableNavWindow.children('div').children('ul'));
            containers.remove();
            self.saveModulePositionConfig(self.createModulePositionConfig(self.elements.sortableNavWindow.find('ul')));
        });
        return containers;
    }
    removeUlBackToHeader(){
        var self = this;
        var element = self.elements.sortableNavWindow.find('.modules-in-sorting-window');
        element.removeClass('modules-in-sorting-window');
        var modulesUl = element.find('ul');
        modulesUl.sortable('destroy');
        self.moduleNavPointer.container.css({bottom: "",
            background: "",
            position: "",
            width: "",
            left: "",
            "border-radius": "",
            "box-shadow": ""});

        self.moduleNavPointer.container.appendTo(document.body)
//        modulesUl.find('li').each(function(){
//            var li = $(this);
//            li.css({'color': '', padding: "8px"});
//            li.removeClass('module-names-in-sort-window');
//        });
//        self.elements.moduleNavPointerContainer.find('.navigation-pointer').show();
        return self;
    }
    createModulePositionConfig(modulesUl){
        var self = this;
        var modulePositions = {};
        var posCount = 0;
        var mo = {};
        var group = {};
        modulesUl.each(function(){
            var ul = $(this);
//            var t = ul.find('.module-group-title-div')

            if(ul.hasClass('module-group-container')){
                var module = {};
                ul.children().each(function(){
                    var dd = $(this);
                    module[dd.attr('value')] = {
                        name:dd.find('span').text() ,
                        id: dd.attr('value'),
                        index: posCount
                    }
                    posCount++;
                });
                group[ul.attr('value')]= module;
                group[ul.attr('value')]['id'] =  ul.attr('id');
            }else{
                ul.children('[value]').each(function(){
                    var dd = $(this);
                    mo[dd.attr('value')] = {
                        name: dd.attr('value'),
                        index: posCount
                    }
                    posCount++;
                });
            }
        })
        mo['groups'] = group;
        /* modulesUl.children().each(function(){
         var li = $(this);
         modulePositions[li.attr('value')] = {
         name: li.attr('value'),
         index: posCount
         }
         posCount++;
         });*/
        return mo;
    }
    hideAllFloatingReports(){
        var self = this;
        self.forEachFloatingReport(function(floatingReport){
            floatingReport.hide();
        }, function(floatingReport){
            return !floatingReport.isInRecycleBin;
        });
        return self;
    }
    showAllFloatingReports(){
        var self = this;
        self.forEachFloatingReport(function(floatingReport){
            floatingReport.show();
        }, function(floatingReport){
            return !floatingReport.isInRecycleBin;
        });
        return self;
    }
    showAppSettingsContainer(){
        var self = this;
        self.elements.applicationSettingsContainer.addClass('show-app-settings-container');
        self.elements.documentWrapper.addClass('body-wrapper-hide-partially');
        self.addUltoSortableNavWindow();
        self.hideAllFloatingReports();
        return self;
    }
    hideAppSettingsContainer(){
        var self = this;
        $(document.body).children('.show-settings-window').removeClass('show-settings-window');
        self.elements.documentWrapper.removeClass('body-wrapper-hide');
        self.elements.applicationSettingsContainer.removeClass('show-app-settings-container');
        self.elements.documentWrapper.removeClass('body-wrapper-hide-partially');
        self.showAllFloatingReports();
        return self;
    }
    showButtonsInWindow(){
        var self= this;
        var selectedModule = self.elements.buttonSortingWindowModuleSelect.val();
        var selectedSubModule = self.elements.buttonSortingWindowSubmoduleSelect.val();
        var buttonContainers = self.elements.buttonsContainerInSortingWindow.children();
        var formViewButtonContainer = self.elements.formViewButtonsContainerInSortingWindow.children();
        var filtersContainer = self.elements.filtersContainerInSortingWindow.children();
        if(buttonContainers && buttonContainers.get(0)){
            buttonContainers.each(function(){
                var ul = $(this);
                if(ul.attr('class') === 'grid-view-title-container'){

                }
                else{
                    ul.remove();
                }
            });
        }
        if(formViewButtonContainer && formViewButtonContainer.get(0)){
            formViewButtonContainer.each(function(){
                var ul = $(this);
                if(ul.attr('class') === 'form-view-title-container'){

                }
                else{
                    ul.remove();
                }
            });
        }
        if(filtersContainer && filtersContainer.get(0)){
            filtersContainer.each(function(){
                var ul = $(this);
                if(ul.attr('class') === 'filters-title-container'){

                }
                else{
                    ul.remove();
                }
            });
        }

        var buttons = self.modules[selectedModule].subModules[selectedSubModule].buttonManager.gridViewButtons;
        var formViewButtons = self.modules[selectedModule].subModules[selectedSubModule].buttonManager.formViewButtons;
        var filters = self.modules[selectedModule].subModules[selectedSubModule].filterManager.filters;
        var repeatingButtonUl = self.elements.buttonsContainerInSortingWindow.find('#'+selectedSubModule);
        var repeatingFormViewButtonUl = self.elements.formViewButtonsContainerInSortingWindow.find('#'+selectedSubModule);
        var repeatingFiltersButtonUl = self.elements.filtersContainerInSortingWindow.find('#'+selectedSubModule);

        if(repeatingButtonUl && repeatingButtonUl.get(0)){
            repeatingButtonUl.show();
        }
        else{
            var ulButtons = $(document.createElement('ul')).attr({id: selectedSubModule, class: "ul-button-sorting", module: selectedModule}).appendTo(self.elements.buttonsContainerInSortingWindow);
            ulButtons.sortable({
                axis: 'x'
            })
            for(var key in buttons){
                var li = $(document.createElement('li')).attr({class: "button-in-ul-sorting-window"}).appendTo(ulButtons);
                li.text(buttons[key].displayName);
            }
        }

        if(repeatingFormViewButtonUl && repeatingFormViewButtonUl.get(0)){
            repeatingFormViewButtonUl.show();
        }
        else{
            var ulButtons = $(document.createElement('ul')).attr({id: selectedSubModule, class: "ul-button-sorting", module: selectedModule}).appendTo(self.elements.formViewButtonsContainerInSortingWindow);
            ulButtons.sortable({
                axis: 'x'
            })
            for(var key in formViewButtons){
                var li = $(document.createElement('li')).attr({class: "button-in-ul-sorting-window"}).appendTo(ulButtons);
                li.text(formViewButtons[key].displayName);
            }
        }
        if(repeatingFiltersButtonUl && repeatingFiltersButtonUl.get(0)){
            repeatingFiltersButtonUl.show();
        }
        else{
            var ulButtons = $(document.createElement('ul')).attr({id: selectedSubModule, class: "ul-button-sorting", module: selectedModule}).appendTo(self.elements.filtersContainerInSortingWindow);
            ulButtons.sortable({
                axis: 'x'
            })
            for(var key in filters){
                var filter = filters[key];
                if(filter.showAsInlineElement){
                    var li = $(document.createElement('li')).attr({class: "button-in-ul-sorting-window"}).appendTo(ulButtons);
                    li.text(filter.displayName);
                }

            }
        }
        return self;
    }
    createButtonsPositionJson(buttonUlContainer, buttonPosJson){
        var self = this;
        buttonUlContainer.children().each(function(){
            var ul = $(this);
            if(ul.attr('class') != 'grid-view-title-container' && ul.attr('class') != 'form-view-title-container' && ul.attr('class') != 'filters-title-container'){
                buttonPosJson = ul.sortable('toArray');
            }
        });
        return buttonPosJson;
    }

    bindIdleTimeEvents(){
        var self = this;
        var idleTimeout = 0;

        self.idleInterval = setInterval(function(){
            idleTimeout++;
            if(idleTimeout >= self.config.appSettings.idleTimeout){
                idleTimeout = 0;
                console.log('inside');
                clearInterval(self.idleInterval);
                self.logOut();
            }
        }, (60 * 1000));

        $(document).on('mousemove', function(){
//            console.log('mousemove', idleTimeout)
            idleTimeout = 0;
        });
        $(document).on('keypress', function(){
//            console.log('keypress', idleTimeout)
            idleTimeout = 0;
        });


        return self;
    }

    showAboutUsPopup  () {
        var self = this;
        var aboutUsContainer = self.elements.aboutUsContainer;
        if(!aboutUsContainer){
            aboutUsContainer = globalElements.body.find('#aboutUsContainer');

            aboutUsContainer.find('#aboutUsAppDisplayName').text(self.displayName);
            aboutUsContainer.find('#aboutUsAppDescription').text(self.appSettings.description || '');
            aboutUsContainer.find('#aboutUsAppExtendedDescription').html(self.appSettings.extendedDescription || '');

            self.elements.aboutUsContainer = aboutUsContainer;
            aboutUsContainer.on('click', function (eve) {
                if($(eve.target).is('.overlay')){
                    aboutUsContainer.fadeOut();
                }
            });
        }

        aboutUsContainer.fadeIn();

    }

    bindEvents () {
        var self = this;
        var showDirectAction = true;
        self.visibilitySettingSelected = '';

        self.bindIdleTimeEvents();

        $(window).on('unload', function(){
            self.addLookUpsToLocalStorage();
        })

        self.elements.reportBugButton.click(function () {
            // self.bugReportManager.show();
            self.showAboutUsPopup();
        });

        self.socket.on('get_Main_users_done',function(data){
            self.usersData = data;

        });
        if(self.user.userDetails.userName === 'admin'){
            self.socket.on('get_logged_in_users_done', function(data){
                self.addOnlineUsersToContainer(data);
            });
            self.socket.on('remove_logouted_user', function(user){
                $('#'+user.userName).addClass('offLineUser')
            });
        }


        self.socket.on('consoleLog',function(data){
            var arr = [];
            for(var key in data){
                arr.push(data[key]);
            }
            console.info.apply(console, arr);
        });

        self.socket.on('session_expired', function(){
            self.user.notifier.showErrorNotification('your session has expired')
            setTimeout(function(){
                self.logOut();
            }, 0)
        });
        self.socket.on('forced_logout_done', function(){

            self.logOut();
        });
        self.socket.on('change_password_done', function(data){
            if(data.success){
//                self.elements.passwordChangingContainer.remove();
                self.user.notifier.showSuccessNotification(data.successMessage);

//                self.elements.managePassword.removeClass('remove-pointer-events');
            }
            else{
                self.user.notifier.showReportableErrorNotification(data.errorMessage);
                self.elements.oldpassWord.val('');
            }
        });
        self.elements.passwordContainer.on('click', '.change-container', function(){
            self.changePassword();
        });
        self.elements.passwordContainer.on('click', '.back-container', function(){
//            self.elements.passwordChangingContainer.remove();
//            self.elements.managePassword.removeClass('remove-pointer-events');
        })
        self.elements.managePassword.on('click', function(){
            self.elements.managePassword.addClass('remove-pointer-events');
            self.managePassWordInProfileWindow();
        });
        self.elements.saveButtonPositionsButton.on('click', function(){
            self.saveButtonsOrder();
        });
        self.elements.buttonSortingWindowSubmoduleSelect. on('change', function(){
            self.showButtonsInWindow();
        });

//         self.elements.content.on('click', function(){
// /////////////////////////////////////yathi/////////////////////////////////////////
//             self.removeClickFunctionsInAppSettings('');
//             self.removeUlBackToHeader();
//             self.hideAppSettingsContainer();
//             $('.'+self.constants.groupCloseButtons.class).hide();
//             $('.'+self.constants.addModuleGroup.class).remove();
// /////////////////////////////////////////////////////////////////////////////////
//
//         });

        self.elements.appSettingsIcon.on('click', function(){
            $('.windows8tabs').removeClass('demoshow');
            self.socket.emit('get_Main_users');

            self.showAppSettingsContainer();
        });
        if(self.user.userDetails.userName === 'admin'){
//            self.elements.adminButton.on('click', function(){
//                self.showAdminWindow();
//            });
            self.elements.userSettingsButton.on('click', function(){
                self.showUserWindow();
                self.removeClickFunctionsInAppSettings($(this));
            });
            self.elements.visibilityButton.on('click', function(){
                self.showVisibilityWindow();
                self.removeClickFunctionsInAppSettings($(this));
            });
            self.elements.columnVisibilityButton.on('click', function(){
                self.visibilitySettingSelected = 'columnButtonFilterVisibility';
                self.moduleVisibilityManager.container.hide();
                self.reportVisibilityManager.container.hide();
                self.columnVisibilityManager.container.show();
                self.selectedVisibility = self.columnVisibilityManager;
            });

            self.elements.moduleVisibilityButton.on('click', function(){
                self.visibilitySettingSelected = 'moduleVisibility';
                self.columnVisibilityManager.container.hide();
                self.reportVisibilityManager.container.hide();
                self.moduleVisibilityManager.container.show();
                self.selectedVisibility = self.moduleVisibilityManager
            });

            self.elements.reportVisibilityButton.on('click', function(){
                self.visibilitySettingSelected = 'reportVisibility';
                self.moduleVisibilityManager.container.hide();
                self.columnVisibilityManager.container.hide();
                self.reportVisibilityManager.container.show();
                self.selectedVisibility = self.reportVisibilityManager;
            });
            self.elements.applyButton.on('click', function(){
                console.log(self.selectedVisibility)
                self.selectedVisibility.createJSON();
                self.notifier.showSuccessNotification('json created successfully');
            });
            self.elements.saveButton.on('click', function(){
                self.saveVisibilityConfig();
            });
        }
        self.elements.preferencesButton.on('click', function(){
            self.showPreferencesWindow();
            self.removeClickFunctionsInAppSettings($(this));
        });
        self.elements.profileButton.on('click', function(){
            self.showProfileWindow();
            self.removeClickFunctionsInAppSettings($(this));
        });
        self.elements.sortableNavButton.on('click', function(){
            self.removeClickFunctionsInAppSettings($(this));
            self.addUltoSortableNavWindow();
            self.showsortableNavWindow();
            self.setNavigationModeValues();
            self.setDefaultModuleValues();
            self.setMiscSettingsValues();
            self.setFloatingReportsSelectionValues();
        });
        self.elements.buttonsSortingWindowButton.on('click', function(){
            self.removeClickFunctionsInAppSettings($(this));
            self.elements.buttonSortingWindowModuleSelect.trigger('change');
            self.showButtonSortingWindow();
        })
        self.elements.logoutButton.on('click', function(){
            self.logOut();
            setTimeout(function(){
                location.reload();
            },1500)
        });
        self.elements.appSettingsBackButton.on('click', function(){
            self.removeClickFunctionsInAppSettings('');
            self.removeUlBackToHeader();
            self.hideAppSettingsContainer();
            $('.'+self.constants.groupCloseButtons.class).hide()
            $('.'+self.constants.addModuleGroup.class).remove();
        });


        self.elements.pdf.on('click', function(){
            self.socket.emit('create_pdf');
        });
//        self.elements.columnVisibilityButton.on('click', function(){
//            self.moduleVisibilityManager.container.hide();
//            self.columnVisibilityManager.container.show();
//        });
//
//        self.elements.moduleVisibilityButton.on('click', function(){
//            self.columnVisibilityManager.container.hide();
//            self.moduleVisibilityManager.container.show();
//        });
//
//        self.elements.cancelButton.on('click', function(){
//            self.elements.visibilitySettingsContainer.hide();
//        });
        $(document.body).on('keydown.erp', function(eve){
            return self.handleKeyDown(eve.keyCode, eve);
        });
        $(document.body).on('keyup.erp', function(eve){
            return self.handleKeyUp(eve.keyCode, eve);
        });

        // self.elements.showReportsButton.on('click', function(){
        //     self.elements.directActionButton.hide();
        //     self.reportsSplitLayout.show();
        //     self.reportsNavPointer.showNavMenuContainer();
        // });

        self.elements.selectThemeChooser.on('change',function(){
            self.setSelectedTheme(self.elements.selectThemeChooser.val());
        });
        self.elements.saveModuleNavigationMode.on('click', function(){
            self.saveNavigationModeValues();
        });
        self.elements.saveDefaultModule.on('click', function(){
            self.saveDefaultModuleValues();
        });
        self.elements.saveMiscSettings.on('click', function(){
            self.saveMiscSettingsValues();
        });
        self.elements.saveFloatingReportsSelection.on('click', function(){
            self.saveFloatingReportsSelectionValues();
        });
        if(self.deviceType !== ERP.DEVICE_TYPES.PC){
            if(window.screen.height > window.screen.width){
                self.deviceOrientation = ERP.DEVICE_ORIENTATIONS.PORTRAIT;
            }
            else{
                self.deviceOrientation = ERP.DEVICE_ORIENTATIONS.LANDSCAPE;
            }
            $(window).on('orientationchange.erp', function(eve){
//                console.log('changed', eve)
//                self.deviceOrientation = eve.orientation;
                if(window.screen.height > window.screen.width){
                    self.deviceOrientation = ERP.DEVICE_ORIENTATIONS.PORTRAIT;
                }
                else{
                    self.deviceOrientation = ERP.DEVICE_ORIENTATIONS.LANDSCAPE;
                }
                self.getSelectedModule().getSelectedSubModule().deviceOrientationChanged(self.deviceOrientation);
                self.initializeDeviceOrientationType();
            });
            self.initializeDeviceOrientationType();
        }
        else{
            self.initializePCUIElements();
        }
        self.elements.directActionButton.on('click', function(event){
            event.stopPropagation();
            if(showDirectAction){
                showDirectAction = false;
                self.elements.directActionButton.addClass('directActionButtonClicked');
                self.directActionMenu.show();

            }
            else{
                showDirectAction = true;
                self.elements.directActionButton.removeClass('directActionButtonClicked');
                self.directActionMenu.hide();
            }


        });
        self.elements.documentWrapper.on('click.directActionMenu', function(){
            showDirectAction = true;
            self.elements.directActionButton.removeClass('directActionButtonClicked');
            self.directActionMenu.hide();
            self.helpBox.hide();
        });
        return self;
    }
    createDirectActionMenu(){
        var self = this;
        var directActionMenu = new DirectActionMenu(self);
        directActionMenu.container.appendTo( globalElements.documentWrapper );
        directActionMenu.hide();
        self.directActionMenu = directActionMenu;
        return self;
    }
    removeClickFunctionsInAppSettings(button){
        var self = this;
        self.elements.applicationSettingsContainer.children().each(function(){
            var buttonContainer = $(this);
            var buttonEle = buttonContainer.find('.app-settings-button');
            var iconEle = buttonContainer.find('.app-setting-icon');
            buttonEle.removeClass('app-settings-button-clicked');
            buttonEle.parent().removeClass('selected');
            iconEle.removeClass('app-setting-icon-clicked');
        });
        if(button){
            var icon = button.closest('.app-settings-button-container')
                .find('.app-setting-icon');
            button.addClass('app-settings-button-clicked');
            icon.addClass('app-setting-icon-clicked');
            button.parent().addClass('selected');
        }
        return self;
    }
    showAdminWindow(){
        var self = this;
        $('.windows8tabs').removeClass('demoshow')
        self.elements.adminButton.addClass('demoshow')
        self.elements.documentWrapper.addClass('body-wrapper-hide');
        self.elements.adminWindow.addClass('show-settings-window');
        self.elements.userWindow.removeClass('show-settings-window');
        self.elements.profileWindow.removeClass('show-settings-window');
        self.elements.sortableNavButton.removeClass('show-settings-window');
        self.elements.visibilityWindow.removeClass('show-settings-window');
        self.elements.buttonSortingWindow.removeClass('show-settings-window');
        return self;
    }
    showUserWindow(){
        var self = this;
        $('.windows8tabs').removeClass('demoshow')
        self.elements.userSettingsButton.addClass('demoshow')
        self.elements.documentWrapper.addClass('body-wrapper-hide');
        self.elements.userWindow.addClass('show-settings-window');
        self.elements.adminWindow.removeClass('show-settings-window');
        self.elements.profileWindow.removeClass('show-settings-window');
        self.elements.preferencesWindow.removeClass('show-settings-window');
        self.elements.sortableNavButton.removeClass('show-settings-window');
        self.elements.visibilityWindow.removeClass('show-settings-window');
        self.elements.buttonSortingWindow.removeClass('show-settings-window');
        if(self.elements.showUserWindow){
            self.elements.showUserWindow.remove();
        }
        $('.user-details-container').remove();

        self.createUserDetailsContainer(self.elements.userWindow);
        return self;
    }
    createUserDetailsContainer(userWindow,data){
        var self = this;
        var container = $(document.createElement('div')).addClass('user-details-container').appendTo(userWindow);
        self.createHeader(container);
        if(self.user.userDetails.userName === 'admin'){

            self.socket.on('remove_logouted_user', function(user){
                $('#'+user.userName).removeClass('onlineUser');
                $('#'+user.userName).addClass('offlineUser');
            });
        }
        var table = $(document.createElement('table')).appendTo(container);
        var tr = $(document.createElement('tr')).appendTo(table);
        var tr1 = $(document.createElement('tr')).appendTo(table);
        self.enterUserDetails(tr1,table,data);
        self.elements.showUserWindow = container;
        return self;
    }
    createHeader(tr){
        var self = this ;

//        var div = $(document.createElement('div')).appendTo(tr);
//        var titleDiv = $(document.createElement('div')).addClass('user-details').appendTo(tr);
//        titleDiv.text('User Details');
    }
    enterUserDetails(tr,table,loginUsers){
        var self = this;
        var i =0;
        if(!self.usersData){
            return self;
        }
        for(var key in self.usersData.data){
            var user = self.usersData.data[key];
            if(i === 9){
                tr = $(document.createElement('tr')).appendTo(table)
            }
            if(user.roleName != 'admin'){
                var td = $(document.createElement('td')).appendTo(tr);
                var container = $(document.createElement('div')).attr({class: "user-window-user-container"}).appendTo(td);
//                var userDivName = $(document.createElement('tr')).appendTo(td)
                var userName = $(document.createElement('div')).text(user.roleName).appendTo(container);
                var logoutContainer = $(document.createElement('div')).attr({class: "logout-span-container"}).appendTo(container);
                var logout = $(document.createElement('div')).attr({"class": "logoutspan", title: "force logout button"}).appendTo(logoutContainer);
                /*logout.on('click',function(){
                 var userdata = {}
                 userdata.userName = user.roleName;
                 userdata.roleId = user.role_id;
                 self.socket.emit('forced_logout', userdata);
                 });*/
                if(user.status === 'active'){

                }else{
                    container.css({background: "rgba(128, 128, 128, 0.56)"});
                    var tab = $(document.createElement('div')).addClass('inactive').prependTo(container);
                }
                var loginUsersList = loginUsers || self.loginUsers;
                for(var key1 in loginUsersList){
                    userName.addClass('offLineUser');
                    if(key1 === 'admin'){

                    }
                    else{
                        if(key1 === user.roleName){
                            userName.addClass('onlineUser');
                            userName.attr('id',user.roleName);
                            userName.removeClass('offLineUser');
                            var userdata = {}
                            userdata.userName = user.roleName;
                            userdata.roleId = user.role_id;
//                            var userDetailsContainer = new UserDetailsContainer(userdata, self,logout);
//                            userDetailsContainer.container.appendTo(document.body);
//                            userDetailsContainer.container.hide();
//                            self.userDetailsContainers[user.roleName] = userDetailsContainer;
                            self.bindUserContainerClick(logout, userdata);
                            break;
                        }else{
                            if(userName.attr('class') != 'onlineUser'){
                                userName.addClass('offLineUser');
                            }
                        }
                    }
                }
                var img = $(document.createElement('div')).css({"background":"url(pics/user.jpg)no-repeat", "background-size": "100%"}).addClass('image').appendTo(container)
                var changeButton = $(document.createElement('button')).text('Change Password').appendTo(container);
                self.bindUserChangePassword(changeButton,user);
            }

            i++;
        }

        return self;
    }
    bindUserChangePassword(button,user){
        var self = this;
        button.on('click',function(){
            self.changeUserPasswordWindow(user);
        })
        return self;
    }
    changeUserPasswordWindow(user){
        var self = this;
        var container =  $(document.createElement('div')).addClass('changeUserPasswordContainer').appendTo(document.body);
        var dataContainer =  $(document.createElement('div')).addClass('changeUserPasswordDataContainer').appendTo(container)
        var table = $(document.createElement('table')).appendTo(dataContainer);
        var tr = $(document.createElement('tr')).appendTo(table);
        var td = $(document.createElement('td')).appendTo(tr);
        $(document.createElement('span')).text('New Password').appendTo(td);
        var newPassword =  $(document.createElement('input')).attr('type','password').appendTo(td);
        var tr1 =  $(document.createElement('tr')).appendTo(table);
        var td1 = $(document.createElement('td')).css('text-align', 'center').appendTo(tr1);
        var changeButton = $(document.createElement('button')).text('Set Password').appendTo(td1);
        var cancelButton = $(document.createElement('button')).text('Cancel').appendTo(td1);
        changeButton.on('click',function(){
            console.log(user)
            console.log(user.roleName)
            if(newPassword.val()){
                var userData = {
                    role_name :user.roleName,
                    password :newPassword.val()
                }
                var checker = self.adminChecker(userData);
                if(checker === 'true'){

                }else{
                    container.remove();
                }
                self.socket.on('forceChangeUserPassword_done',function(){
                    container.remove();
                })
            }else{
                alert('Please enter a password to change')
            }

        });
        cancelButton.on('click',function(){
            newPassword.text();
            container.remove();
        });
        return self;
    }
    adminChecker(userData){
        var self = this;
        var container =  $(document.createElement('div')).addClass('changeUserPasswordContainer').appendTo(document.body);
        var dataContainer =  $(document.createElement('div')).addClass('changeUserPasswordDataContainer').appendTo(container)
        var table = $(document.createElement('table')).appendTo(dataContainer);
        var tr0 = $(document.createElement('tr')).css('text-align', 'center').text('Admin password').appendTo(table);
        var tr = $(document.createElement('tr')).appendTo(table);
        var td = $(document.createElement('td')).appendTo(tr);
        $(document.createElement('span')).text('Password').appendTo(td);
        var newPassword =  $(document.createElement('input')).attr('type','password').appendTo(td);
        var tr1 =  $(document.createElement('tr')).appendTo(table);
        var td1 = $(document.createElement('td')).css('text-align', 'center').appendTo(tr1);
        var changeButton = $(document.createElement('button')).text('Set Password').appendTo(td1);
        var cancelButton = $(document.createElement('button')).text('Cancel').appendTo(td1);
//        console.log(self.user.userDetails.userName);
        changeButton.on('click',function(){
            if(newPassword.val()){
                var data = {
                    user_name :self.user.userDetails.userName,
                    password :newPassword.val()

                }


                self.socket.emit('checkUserPassword',data);
            }else{
                alert('Enter admin password')
            }

            self.socket.on('checkUserPassword_done',function(data){
                if(data === 'true'){
//                    console.log(data)
                    self.socket.emit('forceChangeUserPassword',userData);
                    container.remove();
                    return true;
                }else{
                    alert('Invalid '+self.user.userDetails.userName+' password');
                }
            });
        });
        cancelButton.on('click',function(){
            container.remove();
            return false;
        });

        return false;
    }
    showVisibilityWindow(){
        var self = this;
        $('.windows8tabs').removeClass('demoshow')
        self.elements.visibilityButton.addClass('demoshow')
        self.elements.documentWrapper.addClass('body-wrapper-hide');
        self.elements.visibilityWindow.addClass('show-settings-window');
        self.elements.adminWindow.removeClass('show-settings-window');
        self.elements.userWindow.removeClass('show-settings-window');
        self.elements.profileWindow.removeClass('show-settings-window');
        self.elements.sortableNavButton.removeClass('show-settings-window');
        self.elements.buttonSortingWindow.removeClass('show-settings-window');
        return self;
    }
    showPreferencesWindow(){
        var self = this;
        $('.windows8tabs').removeClass('demoshow');
        self.elements.preferencesButton.addClass('demoshow');
        self.elements.documentWrapper.addClass('body-wrapper-hide');
        self.elements.preferencesWindow.addClass('show-settings-window');
        self.elements.profileWindow.removeClass('show-settings-window');
        self.elements.sortableNavWindow.removeClass('show-settings-window');
        self.elements.buttonSortingWindow.removeClass('show-settings-window');
        if(self.user.userDetails.userName === 'admin'){
            self.elements.adminWindow.removeClass('show-settings-window');
            self.elements.userWindow.removeClass('show-settings-window');
            self.elements.visibilityWindow.removeClass('show-settings-window');
        }
        self.setSelectedSettingModule(self.defaultSettingModule, true);
        return self;
    }
    showProfileWindow(){
        var self = this;
        $('.windows8tabs').removeClass('demoshow');
        self.elements.profileButton.addClass('demoshow')
        self.elements.documentWrapper.addClass('body-wrapper-hide');
        self.elements.profileWindow.addClass('show-settings-window');
        self.elements.sortableNavWindow.removeClass('show-settings-window');
        self.elements.preferencesWindow.removeClass('show-settings-window');
        self.elements.buttonSortingWindow.removeClass('show-settings-window');
        if(self.user.userDetails.userName === 'admin'){
            self.elements.adminWindow.removeClass('show-settings-window');
            self.elements.userWindow.removeClass('show-settings-window');
            self.elements.visibilityWindow.removeClass('show-settings-window');
        }
        return self;
    }
    showsortableNavWindow(){
        var self = this;
        $('.windows8tabs').removeClass('demoshow');
        self.elements.sortableNavButton.addClass('demoshow')
        self.elements.documentWrapper.addClass('body-wrapper-hide');
        self.elements.sortableNavWindow.addClass('show-settings-window');
        self.elements.preferencesWindow.removeClass('show-settings-window');
        self.elements.profileWindow.removeClass('show-settings-window');
        self.elements.buttonSortingWindow.removeClass('show-settings-window');
        if(self.user.userDetails.userName === 'admin'){
            self.elements.adminWindow.removeClass('show-settings-window');
            self.elements.userWindow.removeClass('show-settings-window');
            self.elements.visibilityWindow.removeClass('show-settings-window');
        }
        return self;
    }
    showButtonSortingWindow(){
        var self = this;
        $('.windows8tabs').removeClass('demoshow');
        self.elements.buttonsSortingWindowButton.addClass('demoshow')
        self.elements.documentWrapper.addClass('body-wrapper-hide');
        self.elements.buttonSortingWindow.addClass('show-settings-window');
        self.elements.preferencesWindow.removeClass('show-settings-window');
        self.elements.sortableNavWindow.removeClass('show-settings-window');
        self.elements.profileWindow.removeClass('show-settings-window');
        if(self.user.userDetails.userName === 'admin'){
            self.elements.adminWindow.removeClass('show-settings-window');
            self.elements.userWindow.removeClass('show-settings-window');
            self.elements.visibilityWindow.removeClass('show-settings-window');
        }
        return self
    }

    disableNavigation(){
        var self = this
        document.body.style.pointerEvents = 'none';
        return self;
    }
    enableNavigation(){
        var self = this;
        document.body.style.pointerEvents = '';
        return self;
    }
    setSelectedTheme(theme){
        var self = this;
        self.elements.switchStyle.attr("href", "/styles/"+theme+".css");
        self.selectedTheme = theme;
        return self;
    }
    setDefaultTheme(theme){
        var self = this;
        var theme = self.defaultTheme || self.elements.selectThemeChooser.val();
        self.setSelectedTheme(theme);
        return self;
    }
    getSelectedTheme(theme){
        var self = this;
        return self.selectedTheme;
    }
    handleCtrlKeyUpEvent(eve){
        var self = this;
        self.container.removeClass('ctrlKeyDown');
        self.getTopMostModuleInViewPlane().getTopMostSubModuleInViewPlane().handleCtrlKeyUpEvent(eve);
        return self;
    }
    handleCtrlKeyDownEvent(eve){
        var self = this;
        self.container.addClass('ctrlKeyDown');
        self.getTopMostModuleInViewPlane().getTopMostSubModuleInViewPlane().handleCtrlKeyDownEvent(eve);
        return self;
    }
    handleKeyUp(keyCode, eve){
        var self = this;
        var ret = true;
        if(keyCode == ERP.KEY_CODES.CTRL){
            self.isCtrlDown = false;
            self.handleCtrlKeyUpEvent(eve);
        }
        return ret;
    }
    handleKeyDown(keyCode, eve){
        var self = this;
        var ret = true;

        if(eve.target && (eve.target.tagName == 'INPUT' || eve.target.tagName == 'TEXTAREA')){
            return true;
        }
        if(keyCode == ERP.KEY_CODES.CTRL){
            self.isCtrlDown = true;
            self.handleCtrlKeyDownEvent(eve);
            ret = false;
        }
        else{
            switch(keyCode){
                case ERP.KEY_CODES.LEFT:
                    break;
                case ERP.KEY_CODES.RIGHT:
                    break;
                case ERP.KEY_CODES.UP:
                    break;
                case ERP.KEY_CODES.DOWN:
                    break;
            }
        }


        for(var key in ERP.KEY_CODES){
            if(eve.keyCode == ERP.KEY_CODES[key]){
                ret = false;
            }
        }
        if(ret){
            ret = self.getTopMostModuleInViewPlane().getTopMostSubModuleInViewPlane().handleKeyDown(eve.keyCode);
        }
        return ret;
    }
    getTopMostModuleInViewPlane(){
        var self = this;
        return self.topMostModuleInViewPlane;
    }
    getSelectedModule(){
        var self = this;
        return self.selectedModule;
    }
    show       () {
        var self = this;
        self.container.show();
        return self;
    }
    hide       () {
        var self = this;
        self.container.hide();
        return self;
    }
    getElement(){
        var self = this;
        return self.element;
    }
    forEachReport(eachFunction, filterFunction){
        var self = this;
        for(var key in self.reports){
            var report = self.reports[key];
            if(filterFunction){
                if(filterFunction(report)){
                    eachFunction.apply(report, []);
                }
            }
            else{
                eachFunction.apply(report, [report]);
            }
        }
        return self;
    }
    forEachSettingModule(eachFunction, filterFunction){
        var self = this;
        for(var key in self.settingModules){
            var module = self.settingModules[key];
            if(filterFunction){
                if(filterFunction(module)){
                    eachFunction.apply(module, []);
                }
            }
            else{
                eachFunction.apply(module, [module]);
            }
        }
        return self;
    }
    forEachModule(eachFunction, filterFunction){
        var self = this;
        for(var key in self.modules){
            var module = self.modules[key];
            if(filterFunction){
                if(filterFunction(module)){
                    eachFunction.apply(module, []);
                }
            }
            else{
                eachFunction.apply(module, [module]);
            }
        }
        return self;
    }
    setSelectedSettingModule(module, fromTrigger){
        var self = this;
        if(fromTrigger){
            self.settingModulesNavPointer.setValue(module.id, true);
            return;
        }
        if(self.selectedSettingModule){
            self.selectedSettingModule.hide();
            self.selectedSettingModule.hideFloatingReports();
        }
        if(!module.id){
            module = self.settingModules[module];
        }
        self.selectedSettingModule = module;
        window._settingModule = module;
        self.selectedSettingModule.show();
        self.selectedSettingModuleChanged();
        return self;
    }
    selectedSettingModuleChanged(){
        var self = this;
        var module = self.selectedSettingModule;
        module.setSelectedSubModule(module.getSelectedSubModule(), false);
        module.showFloatingReports();
        return self;
    }
    setSelectedModule(module, view_options){
        var self = this;
        const fromTrigger = view_options?.fromTrigger || false;

        if(fromTrigger){
            self.moduleNavPointer.setValue(module.id, true);
            return;
        }
        if(self.selectedModule){
            self.selectedModule.hide();
            self.selectedModule.hideFloatingReports();
        }
        if(!module.id){
            module = self.modules[module];
        }
        self.selectedModule = module;
        self.topMostModuleInViewPlane = module;

        window._module = module;

        if(self.selectedTopNavigationMode !== 'modules'){
            self.setSelectedTopNavigationMode('modules');
        }

        self.selectedModule.show();
        location.hash = module.id;
        self.selectedModuleChanged();
        return self;
    }
    selectedModuleChanged(){
        var self = this;
        var module = self.selectedModule;
        module.setSelectedSubModule(module.getSelectedSubModule(), false);
        module.subModuleNavPointer.setValue(module.getSelectedSubModule().id, false);
        module.showFloatingReports();
        return self;
    }

    setSelectedReport(report, fromTrigger){
        var self = this;
        if(fromTrigger){
            self.reportsNavPointer.setValue(report.id, true);
            return;
        }
        if(self.selectedReport){
            self.selectedReport.hide();
        }
        if(!report.id){
            report = self.reports[report];
        }
        self.selectedReport = report;
        window._report = report;
        if(self.selectedTopNavigationMode !== 'reports'){
            self.setSelectedTopNavigationMode('reports');
        }
        self.selectedReport.show();
        self.selectedReportChanged();
        return self;
    }
    selectedReportChanged(){
        var self = this;
        var report = self.selectedReport;
        report.setSelectedSubReport(report.getSelectedSubReport(), false);
        // report.subReportNavPointer.updatePointerPosition();
        return self;
    }

    selectedDashboardChanged(){
        var self = this;
        var dashboard = self.selectedDashboard;
        dashboard.refresh_data().then(()=>{});
        return self;
    }
    setSelectedDashboard(dashboard, fromTrigger){
        var self = this;

        if(self.selectedDashboard){
            self.selectedDashboard.hide();
        }
        if(!dashboard.id){
            dashboard = self.dashboards[dashboard];
        }
        self.selectedDashboard = dashboard;
        self.topMostDashboardInViewPlane = dashboard;

        window._dashboard = dashboard;
        if(self.selectedTopNavigationMode !== 'dashboard'){
            self.setSelectedTopNavigationMode('dashboard');
        }
        self.selectedDashboard.show();
        location.hash = dashboard.unique_id;
        self.selectedDashboardChanged();
        return self;
    }

    getDefaultModule(){
        var self = this;
        if(self.defaultModule){
            return self.defaultModule;
        }
        else{
            return self.modules[Object.keys(self.modules)[0]];
        }
        return self;
    }
    getDefaultReport(){
        var self = this;
        if(self.defaultReport){
            return self.defaultReport;
        }
        else{
            var firstVisibleReport = self.getFirstVisibleReport();
            return self.reports[firstVisibleReport];
        }
        return self;
    }
    getFirstVisibleReport(){
        var self = this;
        var activeReports = {}
        for (var reportKey in self.reports){
            if(!self.reports[reportKey].hiddenFromMainNavigation){
                activeReports[reportKey] = self.reports[reportKey]
            }
        }
        var firstVisibleReport = Object.keys(activeReports)[0];
        return firstVisibleReport;
    }
    executeQuery(str){
        var self = this;
        self.socket.emit('executeQuery', {query: str});
        self.socket.once('executeQuery_done', function(data){
//            console.log(data)
            window.data = data;
        })
        return self;
    }




    getModulesListAsSelectOptions(addAll){
    var self = this;
    var options = [];
    self.forEachModule(function(module){
        var option = document.createElement('option');
        option.value = module.id;
        option.innerHTML = module.displayName;
        options.push(option);
    });
    if(addAll){
        var addAllOption = document.createElement('option');
        addAllOption.value = '';
        addAllOption.innerHTML = '--Please Select--';
        options.unshift(addAllOption);
    }
    return $(options);
}


    registerChildWindow(subModule, column, dataRow, registerChildWindowCallBack){
        var self = this;
        var erp = subModule.erp;
        // var socket = erp.socket;
        var data = {
            config: column.typeSpecific.dataSource,
            parentSubModuleId: subModule.id,
            parentModuleId: subModule.module.id
        };
        data.config.dataRow = dataRow;
        data.config.randomId = crypto.getRandomValues(new Uint16Array(1))[0];
        // socket.childWindow.events[data.config.randomId] = registerChildWindowCallBack;
        // socket.emit(erp.socketEvents.registerChildWindow, data);
        var url = subModule.getAjaxUrl('registerChildWindow');
        $.ajax({
            type: 'POST',
            data: data,
            url: url,
        }).always(function (responseObj, status) {
            console.log( 'registerChildWindow_Done', responseObj, status);
            //grid._db.getData_done(grid, responseObj);
            registerChildWindowCallBack && registerChildWindowCallBack(responseObj)
        });

        return self;
    }
    getKeyFromValueOfObject(value, obj){
        var self = this;

        for(var key in obj){
            if(obj[key] == value){
                return key;
            }
        }
    }
    get_user_setting_value(key){
        const str_value = this.user.userDetails?.settings[key];
        if(str_value !== undefined && str_value.length){
            // not efficient, update later
            try{
                return JSON.parse(str_value)
            }
            catch(errr){
                return str_value;
            }
        }
        return str_value;
    }
}


ERP.prototype.selectors = {
    bodyWrapper: "#body_wrapper",
        documentWrapper: "#documentWrapper",
        topLevelNavigation: "#topLevelNavigation",
        titleElement: "#header_title_message",
        applicationDisplayNameFooterElement: "#applicationDisplayName",
        moduleNavPointerContainer: "#documentWrapper #moduleNavPointerContainer",
        reportsNavPointerContainer: "#reportsNavPointerContainer",
        dashboardContainer: "#dashboardContainer",
        reportsContainer: "#reportsContainer",
        reportsContentContainer: "#reportsContentContainer",
        showReportsButton: "#showReports",
        selectThemeChooser: "#themeChooser",
        switchStyle: "#switchStyle",
        logOutButton: "#logOutButton",
        reportBugButton: "#reportBugButton",
        contentContainer: "#body_wrapper > #content",
        applicationSettingsContainer: "#applicationSettings",
        appSettingsIcon: "#appSettingsIcon",
        profileButton: "#profileButton",
        preferencesButton: "#preferencesButton",
        preferencesIcon: "#preferencesIcon",
        sortableNavButton: "#sortableNavButton",
        logoutButton: "#logoutButton",
        appSettingsBackButton: "#appSettingsBackButton",
        profileWindow: "#profileWindow",
        preferencesWindow: "#preferencesWindow",
        sortableNavWindow: "#sortableNavWindow",
        settingModulesContentContainer: "#settingModulesContentContainer",
        settingModulesNavPointerContainer: "#settingModulesNavPointerContainer",
        userName: "#userName",
        userImage:"#userImage",
        pdf: "#pdf",
        buttonSortingWindow: "#buttonSortingWindow",
        buttonsSortingWindowButton: "#buttonsSortingWindowButton",

        saveModuleNavigationMode: "#saveModuleNavigationMode",
        moduleNavigationModeForMobile: "#moduleNavigationModeForMobile",
        moduleNavigationModeForTablet: "#moduleNavigationModeForTablet",
        moduleNavigationModeForPC: "#moduleNavigationModeForPC",

        saveDefaultModule: "#saveDefaultModule",
        defaultModuleForMobile: "#defaultModuleForMobile",
        defaultModuleForTablet: "#defaultModuleForTablet",
        defaultModuleForPC: "#defaultModuleForPC",

        saveMiscSettings: "#saveMiscSettings",
        applicationFontSize: "#applicationFontSize",

        saveFloatingReportsSelection: "#saveFloatingReportsSelection",
        floatingReportsCheckboxes: "#floatingReportsCheckboxes",

        bugReportContainer: "#bugReportContainer",
        reportsTitle:"#reportsTitle",

        buttonsSortingWindowIcon: "#buttonsSortingWindowIcon",
        sortableNavIcon: "#sortableNavIcon",
        appSettingsBackButtonIcon: "#appSettingsBackButtonIcon",
        directActionButton: "#directActionButton",

        leftAlignReportNavContainer: "#leftAlignReportNavContainer"
}
ERP.prototype.constants = {
    container: {
        "class": "application"
    },
    reportsContainer:{
        "class": "reports-container"
    },
    accountDetailsContainer: {
        "class": "account-details-container"
    },
    visibilitySettingsContainer: {
        "class": "visibility-settings-container"
    },
    addModuleGroup: {
        "class": "add-module-group"
    },
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
    popUpMenu: {
        "class" : "pop-up-menu"
    }
}



ERP.prototype._socket = {
    configureSocket: function(erp){
        var self = this;
        let socket_url = location.protocol + '//' + location.host + '?sessionId=' + erp.user.config.user.sessionId;
        if(erp.config.backend_root_url){
            socket_url = erp.config.backend_root_url + `/socket.io/socket.io.js?sessionId=${erp.user.config.user.sessionId}`;
        }
        console.log('socket_url', socket_url)
        var socket = io(socket_url, {'userId' : 'aki143s'});
        socket.connect();

        socket.on("disconnect", (reason, details) => {
            // the reason of the disconnection, for example "transport error"
            console.log(reason);

            // the low-level reason of the disconnection, for example "xhr post error"
            console.log(details.message);

            // some additional description, for example the status code of the HTTP response
            console.log(details.description);

            // some additional context, for example the XMLHttpRequest object
            console.log(details.context);
        });

        socket.formView = {};
        socket.formView.events = {};
        socket.gridView = {};
        socket.gridView.events = {};
        socket.thumbNailView = {};
        socket.thumbNailView.events = {};
        socket.simpleDataTableRow = {};
        socket.simpleDataTableRow.events = {};
        socket.subModule = {};
        socket.subModule.events = {};
        socket.childWindow = {};
        socket.childWindow.events = {};
        erp.socket = socket;
        self.bindSocketEvents(erp);
        return erp;
    },
    bindSocketEvents: function(erp){
        var self = this;
        var socket = erp.socket;
        socket.on('connect', function(){
            // erp.setDefaultModule();
            console.log('socket connected 1')
            erp.elements.container.css({opacity: 1});
            console.log('socket connected')

            erp.onSocketConnected();

        });
        socket.on('disconnect', function(err, data){
            console.log('socket disconnected')
            setTimeout(function(){

                erp.onSocketDisconnected();

                if(erp.user.userDetails){
                    var str = 'Connection to server lost. Reload to retry.'
                    erp.notifier.showErrorNotification(str, {
                        buttons: {
                            reload: {
                                displayName: "Reload",
                                onClick: function(){
                                    location.reload();
                                }
                            }
                        }
                    } );
                    $('.window-container:visible').hide();
                    erp.elements.container.transition({opacity:.25}, 1000);
                }
            }, 1000);
        });

        // socket.on(erp.socketEvents.registerChildWindowDone, function(data){
        //     self.registerChildWindow_done(erp, data);
        // });

        return self;
    },
// registerChildWindow_done: function(erp, data){
//     var self = this;
//     var callback = erp.socket.childWindow.events[data.randomId];
//     callback && callback(data);
//     delete erp.socket.childWindow.events[data.randomId]
//     return self;
// }
}




ERP.prototype._creation = {
    createContainer: function(erp){
        var div = $(document.createElement('div')).attr({id: erp.id}).attr(erp.constants.container);
        return div;
    },
    createElements: function(erp){
        var self = this;
        var container = self.createContainer(erp);


        const modules_container = $(document.createElement('div')).attr({"class": "modules_container hidden"});
        // const dashboards_container = $(document.createElement('div')).attr({"class": "dashboards_container hidden"});


        erp.forEachModule(function(module){
            modules_container.append(module.getElement());
        });

        // for(const d_svelte_instance of erp.dashboards_arr){
        //     dashboards_container.append(d_svelte_instance.container_element);
        // }

        erp.elements.modulesContainer = modules_container;
        // erp.elements.dashboardContainer = dashboards_container;

        container.append(modules_container);
        // container.append(dashboards_container);


        erp.forEachSettingModule(function(module){
            erp.elements.settingModulesContentContainer.append(module.getElement());
        });
        erp.forEachReport(function(report){
            erp.elements.reportsContentContainer.append(report.getElement());
        });
        erp.container = container;
//            erp.elements.reportsContainer = self.createReportsContainer(erp).appendTo(document.body);
        erp.elements.container = container;
        return erp;
    }
}
ERP.prototype._events = {
}
ERP.prototype._ui = {
}


ERP.KEY_CODES = {
    CTRL: 17,
    ENTER: 13,
    ESC: 27,
    RIGHT: 39,
    LEFT: 37,
    UP: 38,
    DOWN: 40,
    ALT: 18,
    MINUS: 189,
    EQUAL: 187
}
ERP.DEVICE_ORIENTATIONS = {
    PORTRAIT: "portrait",
    LANDSCAPE: "landscape"
}
ERP.DEVICE_TYPES = {
    MOBILE: "mobile",
    TABLET: "tablet",
    PC: "pc"
}

// ERP.prototype = {
//
// }

ERP.HELPER_FUNCTIONS = {
    createImageFromText: function(text, options, getImageFromTextCallBack){
        if(!ERP.HELPER_FUNCTIONS.isWaitingForImageCreation){
            ERP.HELPER_FUNCTIONS.isWaitingForImageCreation = true;
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var span = $(document.createElement('span')).text(text)
                .appendTo(document.body)

            canvas.width = (span.width() * 3) || 350;
            canvas.height = 60;
            ctx.font = (options.fontSize || 30) + " Georgia";
            ctx.fillText(text,10,40);
            span.remove();
            canvas.toBlob(function(blob){
                getImageFromTextCallBack(blob);
            });
        }
    }
}

ERP.prototype.socketEvents = {
    registerChildWindow: "registerChildWindow",
    registerChildWindowDone: "registerChildWindowDone"
};

var moduleNavMenuConfig = {
    mode: {
        id: "mode",
        displayName: "Mode",
        subMenuConfig:{
            dock:{
                id: "dock",
                displayName: "Dock"
            },
            accordionLeft:{
                id: "accordionLeft",
                displayName: "Accordion"
            }
        }
    }
}
