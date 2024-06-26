/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function Filter(config, parentObject) {
    var self = this;
    self.config = config;
    self.filterManager = parentObject;
    self.parentObject = parentObject;
    self.subModule = self.parentObject.subModule;
    self.module = self.parentObject.module;
    self.erp = self.filterManager.erp;
    self.initialize();
    return self;
}

Filter.FILTER_TYPES = {};
Filter.FILTER_TYPES.FREE_SEARCH = 'freeSearch';
Filter.FILTER_TYPES.NUMBER = 'number';
Filter.FILTER_TYPES.CHECKBOX = 'checkbox';
Filter.FILTER_TYPES.DATE = 'date';
Filter.FILTER_TYPES.CHOICE = 'choice';
Filter.FILTER_TYPES.TAB_FILTER = 'tabFilter';
Filter.FILTER_TYPES.LOOKUP = 'lookUp';
Filter.FILTER_TYPES.HIDDEN = 'hidden';

Filter.prototype = {
    constants: {
        container: {
            "class": "filter-container"
        },
        divDisplayName: {
            "class": "filter-display-name"
        },
        divFormElements: {
            "class": "filter-form-elements"
        },
        filterTableMain: {
            "class": "filter-table-main"
        },
        tabFilterOptions:{
            "class": "filter-tabOptions"
        }
    },
    initialize: function () {
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }

        self.createElements().bindEvents();
        self.setDeviceTypeDisplayMode();
        return self;
    },
    initializeChosen: function(){
        var self = this;
        if(self.isChosenInitialized){
            return self;
        }
        self.getFilterFormElement().chosen({
            allow_single_deselect: true,
			search_contains: true
        });
        self.isChosenInitialized = true;
        return self;
    },
    setDeviceTypeDisplayMode: function(){
        var self = this;
        self.container.addClass(self.erp.deviceType);
        switch(self.erp.deviceType){
            case ERP.DEVICE_TYPES.MOBILE:
                self.showAsInlineElement = self.config.showAsInlineElement = false;
                break;
            default:
                break;
        }
        return self;
    },
    bindEvents: function () {
        var self = this;
        var formElement = self.getFilterFormElement();
        if(self.showAsInlineElement){
            if(formElement){
                formElement.on('change', function(){
                   self.filterManager.doSearch();
                });
            }
        }
        if(self.tooltip){
            switch (self.type){
                case Filter.FILTER_TYPES.FREE_SEARCH:
                case Filter.FILTER_TYPES.NUMBER:
                case Filter.FILTER_TYPES.DATE:
                    formElement.on('focus', function(){
                        self.showTitle();
                    });
                    formElement.on('blur', function(){
                        self.hideTitle();
                    });
            }
        }

        return self;
    },
    showTitle: function () {
        var self = this;
        self.elements.divFormElements.addClass('showTitle');
        return self;
    },
    hideTitle: function () {
        var self = this;
        self.elements.divFormElements.removeClass('showTitle');
        return self;
    },
    get editValue(){
        var self = this;
        return self.getCurrentEditValue();
    },
    set editValue(newEditValue){
        var self = this;
//        throw 'not implemented exception';
        self.setCurrentEditValue(newEditValue);
    },
    resetEditValue: function(){
        var self = this;
        var value;
        if(self.defaultValue){
            value = self.defaultValue;
        }
        self.editValue = value;
        return self;
    },
    getCurrentEditValue: function(){
        var self = this;
        var value;
        switch(self.type){
            case Filter.FILTER_TYPES.FREE_SEARCH:
                value = self.getFilterFormElement().val();
                break;
            case Filter.FILTER_TYPES.NUMBER:
                value = self.getFilterFormElement().val();
                break;
            case Filter.FILTER_TYPES.DATE:
                value = self.getFilterFormElement().val();
                break;
            case Filter.FILTER_TYPES.CHECKBOX:
                value = self.getFilterFormElement().prop('checked');
                break;
            case Filter.FILTER_TYPES.CHOICE:
                value = self.getFilterFormElement().val();
                break;
            case Filter.FILTER_TYPES.LOOKUP:
                if(self.typeSpecific.allowMultipleSelection){
                    value = self.getFilterFormElement().val();
                }
                else{
                    value = self.getFilterFormElement().val();
                }
                break;
            case Filter.FILTER_TYPES.TAB_FILTER:
                value = self.selectedValue;
                break;
            default:
                throw 'get Edit Value for '+ filter.type + ' is not defined';
        }
        return value;
    },
    setCurrentEditValue: function(value){
        var self = this;
        switch(self.type){
            case Filter.FILTER_TYPES.FREE_SEARCH:
            case Filter.FILTER_TYPES.CHECKBOX:
            case Filter.FILTER_TYPES.DATE:
            case Filter.FILTER_TYPES.LOOKUP:
                self.getFilterFormElement().val(value);
                break;
            default:
                throw 'set Edit Value for '+ self.type + ' is not defined';
        }
        if(self.hasChosen){
            self.elements.formElements.element.trigger('chosen:updated');
        }
        return value;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    isDisabledNow: function(){
        var self = this;
        return self.getFilterFormElement().prop('disabled');
    },
    triggerEvent: function(filterMode, eventType){
        var self = this;
        if(!self.isDisabledNow(filterMode)){
            self.getElement(filterMode).trigger(eventType);
        }
        return self;
    },
    show      : function () {
        var self = this;
        self.container.show();
        return self;
    },
    hide      : function () {
        var self = this;
        self.container.hide();
        return self;
    },
    cancel    : function () {
        var self = this;
        return self;
    },
    getElement: function(type){
        var self = this;
        return self.container;
    },
    getFilterFormElement: function(index){
        var self = this;
        return self.elements.formElements.element;;
    },

    getLookUpData: function(){
        var self = this;
        // var url = '/ajax/' + self.module.id + '/' +self.subModule.id + '/getFilterData/'+ self.id;
        var url = self.subModule.getAjaxUrl('getFilterData', self.id);
		var dataTimestamp;
		if(self.type != Filter.FILTER_TYPES.TAB_FILTER){
			dataTimestamp = self.dataTimestamp;
		}
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                dataTimestamp: dataTimestamp,
                config: {
                }
            }
        }).done(function(data){
            if(data.success){
                if(data.result.isClientDataLatest){
                    return;
                }
                self.filterDataReceived(data.result);
                self.dataTimestamp = data.timestamp;
            }
            else{
                self.subModule.notifier.showReportableErrorNotification('Error getting data for '+ self.displayName+'('+ data.errorMessage +')');
            }
        })
        return self;
    },

    set selectedValue(newValue){
        var self = this;
        self._selectedValue = newValue;
    },
    get selectedValue(){
        var self = this;
        return self._selectedValue;
    },
    selectedValueChanged: function(){
        var self = this;
        self.parentObject.doTabFilterSearch(self);
        return self;
    },
    filterDataReceived: function(data){
        var self = this;
        self.filterData = data;
        switch(self.type){
            case Filter.FILTER_TYPES.TAB_FILTER:
                self.setLookUpDataForTabFilter();
                break;
            case Filter.FILTER_TYPES.LOOKUP:
                self.setLookUpDataForLookUpFilter();
                break;
        }

        return self;
    },
    setLookUpDataForTabFilter: function(){
        var self = this;
        if(self.elements.tabFilterOptions){
//            self.elements.tabFilterOptions.buttonset('destroy')
            self.elements.tabFilterOptions.remove();
        }

        self._creation.createTabFilterOptions(self, self.filterData);


        if(!self.selectedValue && self.typeSpecific.customGroupBySql && self.typeSpecific.customGroupBySql.isEnabled){
            self.typeSpecific.customGroupBySql.customGroupBySql.forEach(function(customCondition){
                if(customCondition.text === self.defaultValue){
                    self.selectedValue = customCondition.id;
                    return;
                }
            })
        }

        if(self.selectedValue){
            if(self.typeSpecific.allowMultipleSelection){
                self.selectedValue.forEach(function(selectedValueItem){
                    self.elements.tabFilterOptions
                        .children('[value="'+ selectedValueItem+'"]')
                        .prop('checked', true);
                });
            }
            else{
                self.elements.tabFilterOptions
                    .children('[value="'+ self.selectedValue+'"]')
                    .prop('checked', true);
            }
        }

        self.elements.tabFilterOptions.children().on('change', function(eve){
            if(self.typeSpecific.allowMultipleSelection){
                var arr = [];
                self.elements.tabFilterOptions.find('input:checkbox:checked').each(function(){
                    arr.push(this.getAttribute('value'));
                });
                self.selectedValue = arr;
            }
            else{
                self.selectedValue = $(this).data('item').id;
            }
            self.selectedValueChanged();
        });
        self.elements.tabFilterOptions.buttonset();
        return self;
    },
    setLookUpDataForLookUpFilter: function(){
        var self = this;
        self.elements.formElements.element.setSelectOptions(self.filterData, !self.typeSpecific.allowMultipleSelection, '');
        if(!self.isChosenInitialized){
            self.initializeChosen();
        }
        else{
            self.elements.formElements.element.trigger('chosen:updated');
        }
        return self;
    },
    _creation : {
        createTabFilterOptions: function(filter, data){
            var self = this;
            var div = $(document.createElement('div'))
                .attr(filter.constants.tabFilterOptions)
                .attr('id', filter.id);

            filter.typeSpecific.customGroupBySql.customGroupBySql.forEach(function(item, index){
                var input = $(document.createElement('input')).appendTo(div)
                    .data('item', item)
                    .attr({name: "radio_"+filter.filterManager.subModule.id + '_'+filter.id, id: "radio_"+filter.filterManager.subModule.id + '_'+filter.id+"_"+index, value: item.id});
                if(filter.typeSpecific.allowMultipleSelection){
                    input.attr('type', 'checkbox');
                }
                else{
                    input.attr('type', 'radio');
                }
                var label = $(document.createElement('label'))
                    .text(item.text + ' ('+ data[item.id]+ ')')
                    .attr({ "for":  "radio_"+filter.filterManager.subModule.id + '_'+filter.id+"_"+index}).appendTo(div);
            });
            filter.elements.tabFilterOptions = div;
            filter.elements.divFormElements.append(div);
        },
        createContainer: function(filter){
            var div = $(document.createElement('div')).attr({id: filter.id, class: filter.constants.container.class});
            div.data('help', filter.helpMessage);
            return div;
        },
        createDisplayNameContainer: function(filter){
            var div = $(document.createElement('div'))
                .attr(filter.constants.divDisplayName)
                .text(filter.displayName);
            return div;
        },
        createFormElementsContainer: function(filter){
            var div = $(document.createElement('div'))
                .attr(filter.constants.divFormElements);
            return div;
        },
        createElements: function(filter){
            var self = this;
            var container = self.createContainer(filter);
            filter.elements = {};
            filter.container = container;
            filter.elements.container = container;
            filter.elements.divDisplayName = self.createDisplayNameContainer(filter);
            filter.elements.divFormElements = self.createFormElementsContainer(filter);
            if(filter.tooltip){
                filter.elements.divFormElements.attr('title', filter.tooltip);
            }
            filter.elements.formElements = {};
            switch(filter.type){
                case Filter.FILTER_TYPES.FREE_SEARCH:
                    self.createFreeSearch(filter);
                    break;
                case Filter.FILTER_TYPES.NUMBER:
                    self.createNumber(filter);
                    break;
                case Filter.FILTER_TYPES.CHECKBOX:
                    self.createCheckbox(filter);
                    break;
                case Filter.FILTER_TYPES.DATE:
                    self.createDate(filter);
                    break;
                case Filter.FILTER_TYPES.CHOICE:
                    self.createChoice(filter);
                    break;
                case Filter.FILTER_TYPES.LOOKUP:
                    self.createLookUp(filter);
                    break;
                //Need to do the rest
            }
            for(var key in filter.elements.formElements){
                filter.elements.formElements[key]
                    .appendTo(filter.elements.divFormElements);
//                if(filter.tooltip){
//                    filter.elements.formElements[key].attr('title', filter.tooltip);
//                }
                if(filter.hint){
                    filter.elements.formElements[key].attr('placeholder', filter.hint);
                }
            }
			if(filter.icon && filter.icon.originalName){
                var imagePath = 'iconsGenerated/' + filter.module.id + '/' + filter.subModule.id + '/' + filter.id + '_' + filter.icon.name;
                var imageContainer = document.createElement('img');
                imageContainer.className = 'filterImageContainer';
                imageContainer.setAttribute('src', imagePath);
                $(imageContainer).appendTo(filter.container);
            }
            if(filter.hidden){
                //container.hide();
                container.addClass('hidden');
            }
            var table = $(document.createElement('table'))
                .attr(filter.constants.filterTableMain);
            var tr = $(document.createElement('tr'))
                .appendTo(table);
            var td1 = $(document.createElement('td')).appendTo(tr).append(filter.elements.divDisplayName);
            var td2 = $(document.createElement('td')).appendTo(tr).append(filter.elements.divFormElements);
            table.appendTo(filter.container);

            return self;
        },
        createFreeSearch: function(filter){
            var self = this;
            var element = $(document.createElement('input'))
                .attr({id: 'filter_'+filter.id, "type": "search"});
            filter.elements.formElements.element = element;
            return element;
        },
        createNumber: function(filter){
            var self = this;
            var element = $(document.createElement('input'))
                .attr({id: 'filter_'+filter.id, "type": "number"});
            element.setNumeric();
            filter.elements.formElements.element = element;
            return element;
        },
        createCheckbox: function(filter){
            var self = this;
            var element = $(document.createElement('input'))
                .attr({id: 'filter_'+filter.id, "type": "checkbox"});
            element.setNumeric();
            filter.elements.formElements.element = element;
            return element;
        },
        createDate: function(filter){
            var self = this;
            var element = $(document.createElement('input')).attr({id: 'filter_'+filter.id, "type": "date"});
            filter.elements.formElements.element = element;
            return element;
        },
        createChoice: function(filter){
            var self = this;
            var element = $(document.createElement('select')).attr({id: 'reportFilter_'+filter.id});
            filter.typeSpecific.datalist.forEach(function(item){
                item.value = item.id;
            });
            element.setSelectOptions(filter.typeSpecific.datalist, true);
            filter.elements.formElements.element = element;
            return element;
        },
        createLookUp: function(reportFilter){
            var self = this;
            var element = $(document.createElement('select')).attr({id: 'filter_'+reportFilter.id, "type": "text"});
//            element.prop('multiple', true)
            reportFilter.elements.formElements.element = element;
            if(reportFilter.hasLocalStorage && !reportFilter.filterData){

                var localStorageName = reportFilter.module.id + '_' + reportFilter.subModule.id + '_' + reportFilter.id + '_lookUpData_filter';
                reportFilter.filterData = reportFilter.erp.lookUpDataConfig[localStorageName] || [];
//                console.log(reportFilter.filterData);

            }

            if(reportFilter.typeSpecific.allowMultipleSelection){
                element.prop('multiple', true);
            }
            reportFilter.hasChosen = true;
            return element;
        }
    },
    _events   : {
    },
    _ui       : {
    }
}