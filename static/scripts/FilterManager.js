/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function FilterManager(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.subModule = parentObject;
    self.module = self.subModule.module;
    self.erp = self.module.erp;
    self.id = self.subModule.id +'_filter_manager';
    self.initialize();
    return self;
}

FilterManager.prototype = {
    constants: {
        container: {
            "class": "filter-panel"
        },
        divButtonPanel: {
            "class": "filter-button-panel"
        },
        btnSearch: {
            "class": "filter-button-search"
        },
        btnClear: {
            "class": "filter-button-clear"
        },
        btnCancel:{
            "class":"filter-button-cancel"
        },
        divHeader:{
            "class": "filter-divHeader"
        },
        filterTableMain: {
            "class": "filter-manager-table-main hundred-percent"
        },
        inlineTabFilterPanel:{
            "class": "filter-inlineTabFilterPanel"
        },
        tabFilterPanel:{
            "class": "filter-tabPanel"
        },
        reArrangeButton: {
            "class": "reArrangeButton visibleOnCtrlKeyDown"
        }
    },
    initialize: function () {
        var self = this;
        self.initializeFilters();

        self.filtersOrder = [];
        self.filter_styling_config = self.erp.get_role_setting_value(self.subModule.id + '__filter_styling');
        // self.inlineFiltersOrder = self.erp.getUserSetting(self.subModule.id + '_inlineFiltersOrder') || [];
        // if(self.inlineFiltersOrder){
        //     if(typeof self.inlineFiltersOrder === 'string'){
        //         self.inlineFiltersOrder = JSON.parse(self.inlineFiltersOrder)
        //     }
        // }
        self.forEachFilter(function(filter, index){
            self.filtersOrder[index] = filter;
        });
        self.intializeSocketEventsObject();
        self.createElements().bindEvents();
        self.hide();
        self.container.draggable({handle: self.elements.divHeader});
        self._socket.initialize(self);
        self.setDeviceTypeDisplayMode();
        return self;
    },

    initializeFilters: function(){
        var self = this;
        self.filters = {};
        self.visibilitySettings = self.subModule.visibilitySettings['filters'] || {};


        for(var key in self.config){
            var filterConfig = self.config[key];
            if(self.visibilitySettings[filterConfig.id]){
                if(!self.visibilitySettings[filterConfig.id].isVisible){
                    continue;
                }
            }
            var filter = new Filter(filterConfig, self);
            self.filters[filter.id] = filter;
        }

        if(self.subModule.module.isInChildWindow && self.subModule.module.parentDataRow) {
            self.forEachFilter((filter) => {
                filter.hide();
            }, (filter) => {
                if (filter.typeSpecific && filter.typeSpecific.disableInsideParentWindow) {
                    return true;
                }
            });
        }

    },

    setDeviceTypeDisplayMode: function(){
        var self = this;
        self.container.addClass(self.erp.deviceType);
        switch(self.erp.deviceType){
            case ERP.DEVICE_TYPES.MOBILE:
                self.setDeviceDisplayModeToMobile();
                break;
            default:
                self.setDeviceDisplayModeToPC();
                break;
        }
        return self;
    },
    setDeviceDisplayModeToMobile: function(){
        var self = this;
        self.container.css({position: 'fixed'})
        return self;
    },
    setDeviceDisplayModeToPC: function(){
        var self = this;
        self.container.css({position: 'absolute'})
        return self;
    },
    intializeSocketEventsObject: function(){
        var self = this;
        self.socketEvents = $.extend({}, self.socketEvents);
        for(var key in self.socketEvents){
            self.socketEvents[key] += '_'+ self.subModule.id;
            if(self.subModule.randomId){
                self.socketEvents[key] += '_'+  self.subModule.randomId;
            }
        }

        self.forEachFilter(function(filter){
            var listenStr = 'getFilterDataDone_'+ self.subModule.id +'_'+ filter.id;
            var emitStr = 'getFilterData_'+ self.subModule.id +'_'+ filter.id;
            if(self.subModule.randomId){
                listenStr += '_'+  self.subModule.randomId;
                emitStr += '_'+  self.subModule.randomId;
            }
            var listenKey = 'getFilterDataDone_'+ filter.id;
            var emitKey = 'getFilterData_'+ filter.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        });

        //Need to do for look up also
        self.forEachTabFilter(function(filter){
            var listenStr = 'getFilterDataDone_'+ self.subModule.id +'_'+ filter.id;
            var emitStr = 'getFilterData_'+ self.subModule.id +'_'+ filter.id;
            if(self.subModule.randomId){
                listenStr += '_'+  self.subModule.randomId;
                emitStr += '_'+  self.subModule.randomId;
            }
            var listenKey = 'getFilterDataDone_'+ filter.id;
            var emitKey = 'getFilterData_'+ filter.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        });
        return self;
    },
    initializeChosen: function(){
        var self = this;
//        self.forEachFilter(function(filter){
//            filter.initializeChosen();
//        }, function(filter){
//            return filter.hasChosen;
//        });
    },
    bindEvents: function () {
        var self = this;
        self.elements.btnSearch.on('click', function(){
            self.doSearch();
        });
        self.elements.btnClear.on('click', function(){
            self.clearSearch();
        });
        self.elements.btnCancel.on('click', function(){
            self.hide();
        });
        self.forEachFilter(function(filter){
            if(filter.getFilterFormElement()){
                filter.getFilterFormElement().bindEnterButton(self.elements.btnSearch);
            }
        });
        return self;
    },
    getSocket: function(){
        var self = this;
        return self.erp.socket;
    },
    updateSearchValueAndSearch: function(new_filter_config){
        var self = this;
        self.resetFilterValues();
        for(const filter_id in new_filter_config){
            const filter = self.filters[filter_id];
            filter.editValue = new_filter_config[filter_id];
        }
        self.doSearch();
        return self;
    },
    doSearch: function(){
        var self = this;
        var config = self.getFilterValues();
        var socket = self.getSocket();
        var data = {config: config};
        self.hide();
        // socket.emit(self.socketEvents.search, data);
        // console.log('search ', self.socketEvents.search, data);

        self.subModule.do_ajax_request('search', data, function(ajax_err, responseObj){
            // console.log('search requested', data, responseObj);
            self.subModule.setDisplayMode(self.subModule.displayMode, true);
        });

        self.getAllFilterDataFromServer();
        self.subModule.buttonManager.showClearSearchButton();
        return self;
    },
    doTabFilterSearch: function(filter){
        var self = this;
        var config = {};
        config = self.getFilterValues();
        config[filter.id] = filter.selectedValue;
        var socket = self.getSocket();
        var data = {config: config};
        // socket.emit(self.socketEvents.search, data);
        self.subModule.do_ajax_request('search', data, function(ajax_err, responseObj){
            // console.log('search requested', data, responseObj);
            self.subModule.setDisplayMode(self.subModule.displayMode, true);
        });

        return self;
    },
    clearSearch: function(){
        var self = this;
        var socket = self.getSocket();
        var data = {config: {}};
        self.resetFilterValues();
        self.hide();
        self.subModule.buttonManager.hideClearSearchButton();
        socket.emit(self.socketEvents.clearSearch, data);
        self.getAllFilterDataFromServer();
        return self;
    },
    resetFilterValues: function(){
        var self = this;
        var obj = {};
        self.forEachFilter(function(filter){
            filter.resetEditValue();
        }, function(filter){
            return filter.type != Filter.FILTER_TYPES.TAB_FILTER;
        });
        return obj;
    },
    getFilterValues: function(){
        var self = this;

        var obj = {};
        self.forEachFilter(function(filter){
            obj[filter.id] = filter.editValue;
        }, function(filter){
            var ret = true;
            if(filter.type == Filter.FILTER_TYPES.HIDDEN){
                ret = false;
            }
            else{
                if(!filter.editValue){
                    ret = false;
                }
            }
            return ret;
        });
        return obj;
    },
    getFilterValuesForAPI: function(){
        var self = this;
        var config = {
            filterCondition: {},
            tabFilterCondition: {}
        };
        self.forEachFilter(function(filter){
            config.filterCondition[filter.id] = filter.editValue;
        }, function(filter){
            var ret = true;
            if(filter.type == Filter.FILTER_TYPES.HIDDEN){
                ret = false;
            }
            else if(filter.type == Filter.FILTER_TYPES.TAB_FILTER){
                ret = false;
            }
            else{
                if(!filter.editValue){
                    ret = false;
                }
            }
            return ret;
        });

        self.forEachFilter(function(filter){
            config.tabFilterCondition[filter.id] = filter.editValue;
        }, function(filter){
            var ret = true;
            if(filter.type != Filter.FILTER_TYPES.TAB_FILTER){
                ret = false;
            }
            else{
                if(!filter.editValue){
                    ret = false;
                }
            }
            return ret;
        });

        return config;
    },
    createElements: function () {
        var self = this;
        self._creation.createElements(self);
        self.createTabFilterPanel();
        return self;
    },
    createTabFilterPanel: function(){
        var self = this;

        var divInlineTabFilterPanel = $(document.createElement('div'))
            .attr(self.constants.inlineTabFilterPanel)
            .attr('id', self.id);

        var div = $(document.createElement('div'))
            .attr(self.constants.tabFilterPanel)
            .attr('id', self.id);

        let icon = $('<span class="show-icon"><i class="fa-regular fa-circle-left"></i></span>')
        let heading = $('<div class="filter-heading"><i class="fa-solid fa-filter"></i><span>Filters</span></div>')
        div.append(icon).append(heading)

        var reArrangeButton = $(document.createElement('div'))
            .attr(self.constants.reArrangeButton)
            .appendTo(div);

        let filter_styling_config = self.filter_styling_config || {
            inline_filter_order : [],
            external_filter_order : []
        };
        let show_all_filters_as_inline = false;
        if(self.get_filter_count() < 3){
            show_all_filters_as_inline = true;
        }

        var is_filter_order_specified = false;
        if(!filter_styling_config.inline_filter_order.length){
            is_filter_order_specified = true;
        }

        self.forEachTabFilter(function(filter){
            self.hasTabFilterPanelFilters = true;
            if(is_filter_order_specified){
                if(filter_styling_config.inline_filter_order.indexOf(filter.id) === -1){
                    filter_styling_config.inline_filter_order.push(filter.id);
                }
            }
            else{
                filter_styling_config.inline_filter_order.push(filter.id);
            }
        });

        self.forEachFilter(function(filter){
            self.hasTabFilterPanelFilters = true;

            if(show_all_filters_as_inline){
                if(is_filter_order_specified){
                    if(filter_styling_config.inline_filter_order.indexOf(filter.id) === -1){
                        filter_styling_config.inline_filter_order.push(filter.id);
                    }
                }
                else{
                    filter_styling_config.inline_filter_order.push(filter.id);
                }
            }
            else{
                if(is_filter_order_specified){
                    if(filter_styling_config.external_filter_order.indexOf(filter.id) === -1){
                        filter_styling_config.external_filter_order.push(filter.id);
                    }
                }
                else{
                    filter_styling_config.external_filter_order.push(filter.id);
                }
            }
        }, function(filter){
            var ret = true;
            // if( filter.showAsInlineElement){
            //     ret = true;
            // }
            if(filter.type == 'tabFilter' || filter.type == 'hidden'){
                ret = false;
            }
            return ret;
        });


        filter_styling_config.inline_filter_order.forEach(function(filterId){
            var filter = self.filters[filterId];
            if(!filter){
                return;
            }
            divInlineTabFilterPanel.append(filter.getElement());
        });

        filter_styling_config.external_filter_order.forEach(function(filterId){
            var filter = self.filters[filterId];
            if(!filter){
                return;
            }
            div.append(filter.getElement());
        });

        if(filter_styling_config.external_filter_order.length === 0){
            div.addClass('no_filters_to_show');
        }

        self.elements.tabFilterPanel = div;
        self.elements.inlineTabFilterPanel = divInlineTabFilterPanel;
        self.elements.reArrangeButton = reArrangeButton;

        return self;
    },

    setFilterDataFromLocalStorage: function(){
        var self = this;
        self.forEachFilter(function(filter){
            if(filter.filterData){
                filter.setLookUpDataForLookUpFilter();
            }
        }, function(filter){
            var ret = false;
            if(filter.type === Filter.FILTER_TYPES.LOOKUP && filter.hasLocalStorage){
                ret = true;
            }
            return ret;
        })
        return self;
    },

    getAllFilterDataFromServer: function(){
        var self = this;
        self.setFilterDataFromLocalStorage();
//        self.getSocket().emit(self.socketEvents.getAllFilterData, {});


        self.forEachFilter(function(filter){
            filter.getLookUpData();
        }, function(filter){
            return filter.type == Filter.FILTER_TYPES.LOOKUP || filter.type == Filter.FILTER_TYPES.TAB_FILTER;
        });

        return self;
    },
    _socket: {
        initialize: function(filterManager){
            var self = this;
            var socket = filterManager.getSocket();
//            filterManager.forEachTabFilter(function(filter){
//                var listenStr = filterManager.socketEvents['getFilterDataDone_'+filter.id];
//                console.log(listenStr)
//                socket.on(listenStr, function(data){
//                    self.getFilterDataDone_done(filterManager, filter, data, {});
//                });
//            });
            filterManager.forEachFilter(function(filter){
                var listenStr = filterManager.socketEvents['getFilterDataDone_'+filter.id];
                socket.on(listenStr, function(data){
                    self.getFilterDataDone_done(filterManager, filter, data, {});
                }, function(filter){
                    var ret = false;
                    if(filter.type == Filter.FILTER_TYPES.LOOKUP){
                        ret = true;
                    }
                    return ret;
                });
            });
            return self;
        },
        getFilterDataDone_done: function(filterManager, filter, data, options){
            var self = this;
            if(data.success){
                filter.filterDataReceived(data.result);
            }
            else{
                filterManager.subModule.notifier.showReportableErrorNotification('Error getting data for '+ filter.displayName+'('+ data.errorMessage +')');
            }
        }
    },
    forEachTabFilter: function(eachFunction){
        var self = this;
        self.forEachFilter(eachFunction, function(filter){
            return filter.type == 'tabFilter';
        });
        return self;
    },
    show: function (preventEventBinding) {
        var self = this;
        self.container.show();
        setTimeout(function(){
            self.container.addClass('filter-panel-shown');
        },0);
        if(!preventEventBinding){
            $(document.body).on('mousedown.filterPanel', function(eve){
                if(!$(eve.target).closest(self.container).length){
                    self.hide();
                }
            });
        }
        return self;
    },
    hide: function () {
        var self = this;
        self.container.removeClass('filter-panel-shown');
        setTimeout(function(){
            self.container.hide();
        },200);
        $(document.body).off('mousedown.filterPanel');
        return self;
    },
    cancel    : function () {
        var self = this;
        return self;
    },
    get_visible_filter_count: function (){
        return Object.keys(this.filters).length; // can ignore hidden for visible filter count later
    },
    get_filter_count: function (){
        return Object.keys(this.filters).length;
    },
    forEachFilter: function(eachFunction, filterFunction){
        var self = this;
        var count = 0;
        for(var key in self.filters){
            var filter = self.filters[key];
            if(filterFunction){
                if(filterFunction(filter)){
                    eachFunction.apply(filter, [filter, count++]);
                }
            }
            else{
                eachFunction.apply(filter, [filter, count++]);
            }
        }
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    filterClicked: function(filter, type){
        var self = this;
        self._events.filterClicked(self, filter, type);
        return self;
    },
    _creation : {
        createContainer: function(filterManager){
            var div = $(document.createElement('div')).attr({id: filterManager.id, class: filterManager.constants.container.class});
            return div;
        },
        createElements: function(filterManager){
            var self = this;
            var container = self.createContainer(filterManager);
            var elements = {};
            elements.container = container;
            filterManager.elements = elements;
            filterManager.container = container;


            var div_inline_filters = $(document.createElement('div')).attr({
                "class": "inline_filters"
            });

            let use_all_inline_filters = false;
            if(filterManager.get_filter_count() <= 3){
                use_all_inline_filters = true;
            }
            filterManager.use_all_inline_filters = use_all_inline_filters;

            var table = $(document.createElement('table')).attr({
                "class": "hundred-percent-x"
            });

            var trHeader = $(document.createElement('tr')).appendTo(table);
            var tdHeader = $(document.createElement('td'))
                .appendTo(trHeader)
                .attr({colspan: Object.keys(filterManager.filters).length});
            var divHeader = $(document.createElement('div'))
                .attr(filterManager.constants.divHeader)
                .appendTo(tdHeader)
                .text('Search');

            elements.divHeader = divHeader;

            var tr = $(document.createElement('tr'))
                .attr(filterManager.constants.filterTableMain)
                .appendTo(table);

            var hasFilterPanelFilters = false;

            if(filterManager.erp.deviceType === ERP.DEVICE_TYPES.MOBILE){
                filterManager.forEachFilter(function(filter){
                    hasFilterPanelFilters = true;
                    var td = $(document.createElement('td')).appendTo(tr);
                    filter.container.appendTo(td);
                    tr = $(document.createElement('tr'))
                        .attr(filterManager.constants.filterTableMain)
                        .appendTo(table);
                }, function(filter){
                    var ret = true;
                    if(filter.type == 'tabFilter' || filter.type == 'hidden'){
                        ret = false;
                    };
                    if(ret && filter.showAsInlineElement){
                        ret = false;
                    }
                    return ret;
                });
            }
            else{
                filterManager.forEachFilter(function(filter){
                    hasFilterPanelFilters = true;
                    var td = $(document.createElement('td')).appendTo(tr);
                    filter.container.appendTo(td);
                }, function(filter){
                    var ret = true;
                    if(filter.type == 'tabFilter' || filter.type == 'hidden'){
                        ret = false;
                    };
                    if(ret && filter.showAsInlineElement){
                        ret = false;
                    }
                    return ret;
                });
            }

            var trButtonsContainer = $(document.createElement('tr')).appendTo(table);
            var td = $(document.createElement('td'))
                .append(self.createButtonsContainer(filterManager))
                .appendTo(trButtonsContainer);
            table.appendTo(container);

            filterManager.hasFilterPanelFilters = hasFilterPanelFilters;
        },
        createButtonsContainer: function(filterManager){
            var div = $(document.createElement('div')).attr(filterManager.constants.divButtonPanel);

            var btnSearch = $(document.createElement('button'))
                .attr(filterManager.constants.btnSearch)
                .text('Search')
                .appendTo(div);
            var btnClear = $(document.createElement('button'))
                .attr(filterManager.constants.btnClear)
                .text('Clear')
                .appendTo(div);
            var btnCancel = $(document.createElement('button'))
                .attr(filterManager.constants.btnCancel)
                .text('Cancel')
                .appendTo(div);

            filterManager.elements.divButtonPanel = div;
            filterManager.elements.btnSearch = btnSearch;
            filterManager.elements.btnClear = btnClear;
            filterManager.elements.btnCancel = btnCancel;

            return div;
        }
    },
    _events   : {
        filterClicked: function(filterManager, filter, type){
            var self = this;
            if(type === Filter.BUTTON_MODES.GRID){
                self.gridViewFilterClicked(filterManager, filter)
            }
            else if(type === Filter.BUTTON_MODES.FORM){
                self.formViewFilterClicked(filterManager, filter)
            }
            return this;
        },
        gridViewFilterClicked: function(filterManager, filter){
            var self = this;
            switch (filter.type){
                case Filter.BUTTON_TYPES.INSERT:
                    self.insertFilterClicked(filterManager, filter);
                    break;
                case Filter.BUTTON_TYPES.VIEW:
                    self.viewFilterClicked(filterManager, filter);
                    break;
                case Filter.BUTTON_TYPES.DELETE:
                    self.deleteFilterClicked(filterManager, filter);
                    break;
                case Filter.BUTTON_TYPES.STATUS_CHANGE:
                    self.statusChangeFilterClicked(filterManager, filter);
                    break;
            }
            return self;
        },
        formViewFilterClicked: function(filterManager, filter){
            var self = this;
            switch (filter.type){
                case Filter.BUTTON_TYPES.EDIT:
                    self.editFilterClicked(filterManager, filter);
                    break;
            }
            return self;
        },
        editFilterClicked: function(filterManager, filter){
            var self = this;
            var subModule = filterManager.getWebpage();
            subModule.formView.show(FormView.EDIT_MODE, {}, filter);
            return self;
        },
        insertFilterClicked: function(filterManager, filter){
            var self = this;
            var subModule = filterManager.subModule;
            subModule.formView.show(FormView.CREATE_MODE, null, filter);
            return self;
        },
        viewFilterClicked: function(filterManager, filter){
            var self = this;
            var subModule = filterManager.getWebpage();
            console.log(filterManager.subModule.grid.data[filterManager.selectedRows[0]])
            subModule.formView.show(FormView.VIEW_MODE, filterManager.subModule.grid.data[filterManager.selectedRows[0]]);
            return self;
        },
        deleteFilterClicked: function(filterManager, filter){
            var self = this;
            var subModule = filterManager.getWebpage();
            if(filter.confirmationMessage){
                if(!confirm(filter.confirmationMessage.replace('@row_count@', filterManager.selectedRowsCount))){
                    return;
                }
            }
            subModule._db.deleteRow(subModule, filterManager.selectedRows, filter);
            return this;
        },
        statusChangeFilterClicked:function(filterManager, filter){
            var self = this;
            var subModule = filterManager.getWebpage();
            if(!confirm(filter.confirmationMessage.replace('@row_count@', filterManager.selectedRowsCount))){
                return;
            }
            var data = {};
            data.id = filterManager.selectedRows;
            data.filterId = filter.id;
            subModule._db.statusChange(subModule, filter, data);
            return this;
        }
    },
    _ui       : {
    },
    setToReArrangeMode: function(buttonManager){
        var self = this;
        buttonManager.contextMenu.disabled = true;
        self.filterPositionsUpdated = false;
        self.elements.tabFilterPanel.sortable({
            update: function(){
                self.filterPositionsUpdated = true;
            }
        });
        self.elements.tabFilterPanel.sortable('enable');
        self.elements.tabFilterPanel.expose();
        $(document.body).one('expose:overlay:removed', function(){
            if(self.filterPositionsUpdated){
                self.saveFilterArrangementOrder();
            }
            self.setToNormalMode(buttonManager);
        });
        return self;
    },
    saveFilterArrangementOrder: function(){
        var self = this;
        self.erp.saveInlineFiltersOrder(self.subModule, self.elements.tabFilterPanel.sortable('toArray').filter(function(item){
            return item;
        }));
        return self;
    },
    setToNormalMode: function(buttonManager){
        var self = this;
        buttonManager.contextMenu.disabled = false;
        self.elements.tabFilterPanel.sortable('disable');
        return self;
    }
}

FilterManager.prototype.socketEvents = {
    search: "search",
    clearSearch: "clearSearch",
    getAllFilterData: "getAllFilterData"
}