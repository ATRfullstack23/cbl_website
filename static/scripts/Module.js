/**
 * Created by Akhil Sekharan on 12/4/13.
 */


function Module(config, parentObject){
    var self = this;
    self.parentObject = parentObject;
    self.erp = parentObject;
    self.config = config;
    // self.initialize();
    return self;
}

Module.prototype = {
    initialize: async function(){
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }

        self.visibilitySettings = self.erp.visibilitySettings.columnButtonFilterVisibility[self.id] || {};


        self.subModuleNavPointer = new Navigation({
            options: self.subModules,
            defaultValue: self.defaultSubModule,
            contentsContainer: self.element,
            onChange: function(subModule){
                self.setSelectedSubModule(subModule);
            },
            classes: {
                element: 'subModules-nav-panel',
                divPointer: 'subModules-nav-pointer'
            }
        }, self);

        await self.createElements();

        await self.initializeSubModules();

        if(self.defaultSubModule){
            self.defaultSubModule = self.subModules[self.defaultSubModule];
        }
        else{
            self.defaultSubModule = self.subModules[Object.keys(self.subModules)[0]];
        }
        self.selectedSubModule = self.defaultSubModule;
        self.topMostSubModuleInViewPlane = self.defaultSubModule;

        if(!self.icon){
            self.icon = "billing.png";
        }
		
		try{
            if(self.config.enableSubModuleNavigation){
                self.elements.container.prepend(self.subModuleNavPointer.getElement());
            }
        }
        catch(err){

        }
		
//        document.title = self.displayName;


        return self;
    },
    initializeSubModules: async function(){
        var self = this;
        self.subModules = {};
        for(var key in self.config.subModules){
            var subModuleConfig = $.extend({}, self.config.subModules[key]);
            if(self.formViewOnlyMode){
                subModuleConfig.formViewOnlyMode = true;
                subModuleConfig.formViewMode = self.formViewMode;
				subModuleConfig.defaultDisplayMode = SubModule.DISPLAY_MODES.FORM_VIEW;
            }
            if(self.viewOnlyMode){
                subModuleConfig.viewOnlyMode = true;
            }

            if(self.randomId){
                subModuleConfig.randomId = self.randomId;
                subModuleConfig.parentItem = self.parentItem;
                subModuleConfig.parentSubModule = self.parentSubModule;
            }
            self.subModules[subModuleConfig.id] = new SubModule(subModuleConfig, self);
            await self.subModules[subModuleConfig.id].initialize();
        }
        return self;
    },
    bindEvents: function () {
        var self = this;
        return self;
    },
    show      : function () {
        var self = this;
        self.container.removeClass('hidden');
        return self;
    },
    hide      : function () {
        var self = this;
        self.container.addClass('hidden');
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    addChildFloatingReport: function(floatingReport){
        var self = this;
        if(!self.childFloatingReports){
            self.childFloatingReports = {};
        }
        self.childFloatingReports[floatingReport.subReport.id] = floatingReport;
        return self;
    },
    showFloatingReports: function(){
        var self = this;
        self.forEachFloatingReport(function(floatingReport){
            floatingReport.show();
        }, function(floatingReport){
            return !floatingReport.isInRecycleBin;
        });
        return self;
    },
    hideFloatingReports: function(){
        var self = this;
        self.forEachFloatingReport(function(floatingReport){
            if(floatingReport.isChildWindowVisible){
                floatingReport.hideChildWindow();
            }
            floatingReport.hide();
        }, function(floatingReport){
            return !floatingReport.isInRecycleBin;
        });
        return self;
    },
    forEachFloatingReport: function(eachFunction, filterFunction){
        var self = this;
        for(var key in self.childFloatingReports){
            var childFloatingReport = self.childFloatingReports[key];
            if(filterFunction){
                if(filterFunction(childFloatingReport)){
                    eachFunction.apply(childFloatingReport, [childFloatingReport]);
                }
            }
            else{
                eachFunction.apply(childFloatingReport, [childFloatingReport]);
            }
        }
        return self;
    },
    forEachSubModule: function(eachFunction, filterFunction){
        var self = this;
        for(var key in self.subModules){
            var subModule = self.subModules[key];
            if(filterFunction){
                if(filterFunction(subModule)){
                    eachFunction.apply(subModule, [subModule]);
                }
            }
            else{
                eachFunction.apply(subModule, [subModule]);
            }
        }
        return self;
    },
    getTopMostSubModuleInViewPlane: function(){
        var self = this;
        return self.topMostSubModuleInViewPlane;
    },
    getSelectedSubModule: function(){
        var self = this;
        self.navigationPositionEasyAccessReport();
        return self.selectedSubModule;
    },
    //////////////////////////////////////////////////yathi///////////////////////////////////////////////////////////////////////////
    navigationPositionEasyAccessReport: function(){
        var self = this;
        if(self.selectedSubModule.config.easyAccessReportView){
            $(document.body).addClass('easyAccessReportView');
        }
        else{
            $(document.body).removeClass('easyAccessReportView');
        }
        return self;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
},
    getSubModulesListAsSelectOptions: function(addAll){
        var self = this;
        var options = [];
        self.forEachSubModule(function(subModule){
            var option = document.createElement('option');
            option.value = subModule.id;
            option.innerHTML = subModule.displayName;
            options.push(option);
        });
        if(addAll){
            var addAllOption = document.createElement('option');
            addAllOption.value = '';
            addAllOption.innerHTML = '--Please Select--';
            options.unshift(addAllOption);
        }
        return $(options);
    },
    getDefaultSubModule: function(){
        var self = this;
        return self.defaultSubModule;
    },
    setSelectedSubModule: function(subModule, fromTrigger){
        var self = this;
        window._subModule = self.selectedSubModule;
        if(fromTrigger){
//            self.navPointer.setValue(subModule.id, true);
            self.selectedSubModuleChanged(true);
            return;
        }
        if(self.selectedSubModule){
            self.selectedSubModule.hide();
        }
        if(!subModule.id){
            subModule = self.subModules[subModule];
        }
        self.selectedSubModule = subModule;
        self.topMostSubModuleInViewPlane = subModule;

        self.selectedSubModule.show();
        self.selectedSubModuleChanged();
        return self;
    },
    selectedSubModuleChanged: function(fromTrigger){
        var self = this;
        var subModule = self.selectedSubModule;
        window._subModule = subModule;
        subModule.show();
        if(subModule.isInChildWindow){
            if( self.parentWindow && self.parentDataRow){

//                var value = self.parentDataRow[self.parentItem.typeSpecific.referenceColumns.columnId];
//                if(typeof value === 'object'){
//                    if(value.text){
//                        value = value.text;
//                    }
//                    else if(value.value){
//                        value = value.value;
//                    }
//                }

                var headerText = self.parentItem.subModule.getTextFromSmartTextConfig(self.parentItem.typeSpecific.referenceColumns, self.parentDataRow);
                self.parentWindow.headerMessage = subModule.displayName+ ' ('+headerText+')';
            }
            else if(self.parentWindow){
                self.parentWindow.headerMessage = self.parentItem.typeSpecific.referenceColumns.text;
            }

//            else{
//                console.log(self)
//            }
        }
        if(!fromTrigger){
            subModule.setDisplayMode();
        }
        return self;
    },
    _socket: {
        initialize: function(module){
            var self = this;
        }
    },
    createElements: async function () {
        var self = this;
        await self._creation.createElements(self)
        return self;
    },
    _creation : {
        createContainer: function(module){
            var div = $(document.createElement('div')).attr({id: module.id, class: 'module-panel hidden'});
            return div;
        },
        createElements: async function (module) {
            var self = this;

            var elements = {};

            // (async () => {
            // })();
            await window._add_module_instance_for_reference(module);

            var container = $(module.svelte_element_instance.container_element); // self.createContainer(module);
            // var table = document.createElement('table');
            // table.className = 'hundred-percent';

//            var trNav = document.createElement('tr');
//            var tdNav = document.createElement('td');
//            tdNav.style.paddingLeft = '5px';
//            tdNav.appendChild(module.navPointer.getElement().get(0));
//            trNav.appendChild(tdNav);
//            table.appendChild(trNav);

            // var trSubModules = document.createElement('tr');
            // var tdSubModules = document.createElement('td');
            // tdSubModules.id = module.id+'_subModules-panel';
            // module.forEachSubModule(function(subModule){
            //     tdSubModules.appendChild(subModule.getElement().get(0));
            // });
            // trSubModules.appendChild(tdSubModules);
            // table.appendChild(trSubModules);

            // container.append(table);
            elements.submodule_navigation_container = container.find('.submodule_navigation_container').eq(0);
            elements.submodules_container = container.find('.submodules_container').eq(0);

            // elements.submodule_navigation_container.append(module.subModuleNavPointer.getElement().get(0));

            // module.forEachSubModule(function(subModule){
            //     elements.submodules_container.appendChild(subModule.getElement().eq(0));
            // });

            elements.container = container
            module.elements = elements;
            module.container = container;
            return container;
        }
    },
    _events   : {
    },
    _ui       : {
    },

    getSubModulesListAsSelectOptions: function(addAll){
        var self = this;
        var options = [];
        self.forEachSubModule(function(subModule){
            var option = document.createElement('option');
            option.value = subModule.id;
            option.innerHTML = subModule.displayName;
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
}


