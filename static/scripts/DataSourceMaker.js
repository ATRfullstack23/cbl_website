/**
 * Created by Akhil on 18-Dec-17.
 */



function DataSourceMaker(config, parentObject) {
    var self = this;

    self.config = config;
    self.dashboardManager = parentObject;
    self.erp = parentObject.erp;

    window.PopupBase.apply(this, [config, parentObject]);
    self.initialize();
    return self;
}

DataSourceMaker.prototype = Object.create(PopupBase.prototype);
DataSourceMaker.prototype.constructor = DataSourceMaker;
DataSourceMaker.prototype.super = PopupBase.prototype;



DataSourceMaker.prototype.initialize = function () {
    var self = this;
    self.super.initialize.apply(self);
    window._dsm = self;

    self.notifier = new Notifier({
        container: self.container
    });

    return self;
}
DataSourceMaker.prototype.getId = function () {
    return "dataSourceMaker"
}
DataSourceMaker.prototype.getHeaderDisplayName = function () {
    return "Data Source Maker"
}
DataSourceMaker.prototype.getButtons = function () {
    return [
        {
            id : "save",
            displayName : "Save",
        },
        {
            id : "cancel",
            displayName : "Cancel",
        }
    ]
}
DataSourceMaker.prototype.handleOnButtonClickEvent = function (buttonElement) {
    var self = this;
    switch (buttonElement.attr('data-id')) {
        case 'save':

            self.validateAndReturnConfiguration();

            // if(self.mode == 'create'){
            //     self.validateAndCreateNewDashboardItem();
            // }
            // else{
            //     self.validateAndUpdateExistingDashboardItem();
            // }
            break;
        case 'reset':
            self.createForm();
            break;
        case 'cancel':
            self.cancel();
            break;
    }
}


DataSourceMaker.prototype.createElements = function () {
    var self = this;
    self.super.createElements.apply(self);

    self.createForm();
},
DataSourceMaker.prototype.createForm = function () {
    var self = this;

    self.elements.popupContent.empty();

    var form = $(DataSourceMaker.Templates.dataSourceMakerFormTemplate ({
        id : "dataSourceMaker"
    }));
    self.elements.form = form;
    self.elements.fakeFormSubmitButton = $(document.createElement('input')).attr('type', 'submit').hide();
    self.elements.form.append(self.elements.fakeFormSubmitButton);
    self.elements.popupContent.append(form);

    self.setupPrimaryDataSourcesView();
    self.setupColumnsAndDisplayView();
    self.setupWhereConditionView();

}

DataSourceMaker.prototype.bindEvents = function () {
    var self = this;
    self.super.bindEvents.apply(self);

    self.elements.container.on('click', '.dataSourceMakerTabs li', function(){
        self.setSelectedTab($(this).attr('value'));
    });

}

DataSourceMaker.prototype.setSelectedTab = function (newTabId) {
    var self = this;

    if(newTabId != 'dataSources'){
        if(!self.getSelectedPrimarySubModule()){
            return;
        }
    }

    self.elements.popupContent.find('.dataSourceMakerTabs li')
        .removeClass('selected')
        .filter('[value="'+newTabId+'"]')
        .addClass('selected');

    self.elements.popupContent.find('#dataSourceMakerContents > [data-scope]')
        .removeClass('visible')
        .filter('[data-scope="'+newTabId+'"]')
        .addClass('visible');

    self.onSelectedTabChanged(newTabId);
}

DataSourceMaker.prototype.validateAndReturnConfiguration = function () {
    var self = this;
    var form = self.elements.form;

    // var isValid = form.get(0).checkValidity();
    //
    // if(!isValid){
    //     self.elements.fakeFormSubmitButton.click();
    //     return;
    // }



    var formData = self.getFormData();
    if(!formData){
        return;
    }

    self.showOptions.onSaveCallback && self.showOptions.onSaveCallback(formData);

    self.hide();

}


DataSourceMaker.prototype.setEditModeValue = function () {
    var self = this;
    if(!self.editModeValue){
        return self;
    }
    if(!self.editModeValue.primaryDataSource){
        return self;
    }

    var editModeValue = self.editModeValue;

    self.elements.ddlChoosePrimaryModule
        .val(editModeValue.primaryDataSource.moduleId)
        .trigger('change');
    self.elements.ddlChoosePrimarySubModule
        .val(editModeValue.primaryDataSource.subModuleId)
        .trigger('change');

    if(!self.showOptions.hideAggregateColumns && editModeValue.aggregatedColumn){
        self.elements.ddlChooseAggregateColumn.val(editModeValue.aggregatedColumn.columnId)
        self.elements.ddlChooseAggregateFunction.val(editModeValue.aggregatedColumn.aggregateFunction)
    }

    if(!self.showOptions.hideChooseVisibleColumns && editModeValue.columnsToShow){

        editModeValue.columnsToShow.forEach(function (columnObj) {
            self.elements.allColumnsToShowTable.find('input' +
                '[data-module-id="'+columnObj.moduleId+'"]'+
                '[data-sub-module-id="'+columnObj.subModuleId+'"]'+
                '[data-column-id="'+columnObj.columnId+'"]'
            ).prop('checked', true);
        });


    }

    if(!self.showOptions.hideConditionMaker && editModeValue.whereCondition){
        self.updateQueryBuilderOnSelect = true;
        self.reInitializeQueryBuilder();
        self.elements.queryBuilderElement.queryBuilder('setRules', editModeValue.whereCondition.rules || []);
    }

}

DataSourceMaker.prototype.getFormData = function () {
    var self = this;

    var formData = {};

    if(!self.getSelectedPrimarySubModule()){
        self.notifier.showErrorNotification('Please select a primary data source');
        return;
    }

    formData.primaryDataSource  = {
        moduleId : self.getSelectedPrimaryModule().id,
        subModuleId : self.getSelectedPrimarySubModule().id,
        databaseName : self.getSelectedPrimarySubModule().databaseName,
    }

    if(!self.showOptions.hideAggregateColumns){
        var aggregateColumn = self.getSelectedAggregateColumn();
        formData.aggregatedColumn  = {
            columnId : aggregateColumn.id,
            columnDatabaseName : aggregateColumn.databaseName,
            aggregateFunction : self.getSelectedAggregateFunction()
        }
    }

    if(!self.showOptions.hideChooseVisibleColumns){
        // -- implementing in future
        var columnsToShow = [];
        self.elements.allColumnsToShowTable.find('input:checked').each(function () {
            var inputElement = $(this);

            var obj = {
                moduleId : inputElement.attr('data-module-id'),
                subModuleId : inputElement.attr('data-sub-module-id'),
                columnId : inputElement.attr('data-column-id'),
            };

            columnsToShow.push(obj);
        });

        if(columnsToShow.length == 0){
            self.setSelectedTab('columnsAndDisplay');
            self.notifier.showErrorNotification('Please select at least one column');
            return;
        }

        formData.columnsToShow = columnsToShow;

    }


    if(!self.showOptions.hideConditionMaker){
        var whereCondition = {};

        var rules = self.elements.queryBuilderElement.queryBuilder('getRules');

        if(!rules){
            return;
        }

        whereCondition.rules = rules;
        whereCondition.query = self.elements.queryBuilderElement.queryBuilder('getSQL', 'named(@)');

        formData.whereCondition = whereCondition;

    }


    return formData;
}

DataSourceMaker.prototype.show = function (options) {
    var self = this;
    self.createForm();

    self.showOptions = options || {};

    self.super.show.apply(self);

    self.setSelectedTab('dataSources');

    if(self.showOptions.hideChooseVisibleColumns){
        self.elements.allColumnsToShowTableContainer.addClass('hidden');
    }
    if(self.showOptions.hideAggregateColumns){
        self.elements.aggregateColumnSelectionContainer.addClass('hidden');
    }

    self.editModeValue = options.currentValue;
    self.setEditModeValue();

    // self.elements.form.find('input').first().focus();

}
DataSourceMaker.prototype.resetForm = function () {
    var self = this;

    self.elements.allColumnsToShowTableContainer.removeClass('hidden');

    // self.elements.form.get(0).reset();
    // -- need to work on this
}

DataSourceMaker.prototype.cancel = function () {
    var self = this;
    self.resetForm();
    delete self.selectedDashboardItem;
    self.hide();
}




DataSourceMaker.prototype.getSelectedPrimaryModule = function () {
    var self = this;
    var module = self.erp.modules[self.elements.ddlChoosePrimaryModule.val()];
    return module;
}
DataSourceMaker.prototype.getSelectedPrimarySubModule = function () {
    var self = this;
    var module = self.getSelectedPrimaryModule()
    var subModule = module.subModules[self.elements.ddlChoosePrimarySubModule.val()];
    return subModule;
}

DataSourceMaker.prototype.setupPrimaryDataSourcesView = function () {
    var self = this;

    var viewContainer = self.elements.popupContent.find('.dataSources');

    self.elements.dataSourcesContainer = viewContainer;

    self.elements.ddlChoosePrimaryModule = viewContainer.find('#ddlChoosePrimaryModule');
    self.elements.ddlChoosePrimarySubModule = viewContainer.find('#ddlChoosePrimarySubModule');

    self.elements.ddlChoosePrimaryModule
        .empty()
        .append(self.erp.getModulesListAsSelectOptions(true));


    self.elements.ddlChoosePrimaryModule.on('change', function () {
        var module = self.getSelectedPrimaryModule();
        self.elements.ddlChoosePrimarySubModule.empty()
            .append(module.getSubModulesListAsSelectOptions(true));
    });

    self.elements.ddlChoosePrimarySubModule.on('change', function () {
        self.onPrimarySubModuleChanged();
    });


}


DataSourceMaker.prototype.setupColumnsAndDisplayView = function () {
    var self = this;

    var viewContainer = self.elements.popupContent.find('.columnsAndDisplay');

    self.elements.columnsAndDisplayContainer = viewContainer;

    self.elements.aggregateColumnSelectionContainer = viewContainer.find('#aggregateColumnSelectionContainer');

    self.elements.ddlChooseAggregateColumn = viewContainer.find('#ddlChooseAggregateColumn');
    self.elements.ddlChooseAggregateFunction = viewContainer.find('#ddlChooseAggregateFunction');

    self.elements.allColumnsToShowTableContainer = viewContainer.find('#allColumnsToShowTableContainer');
    self.elements.allColumnsToShowTable = viewContainer.find('#allColumnsToShowTable');

}

DataSourceMaker.prototype.getSelectedAggregateColumn = function () {
    var self = this;
    return self.getSelectedPrimarySubModule().columnManager.columns[self.elements.ddlChooseAggregateColumn.val()];
}
DataSourceMaker.prototype.getSelectedAggregateColumnId = function () {
    var self = this;
    return self.elements.ddlChooseAggregateColumn.val();
}
DataSourceMaker.prototype.getSelectedAggregateFunction = function () {
    var self = this;
    return self.elements.ddlChooseAggregateFunction.val();
}




DataSourceMaker.prototype.setupWhereConditionView = function () {
    var self = this;

    var viewContainer = self.elements.popupContent.find('.whereCondition');

    self.elements.whereConditionContainer = viewContainer;

    self.elements.queryBuilderElement = viewContainer.find('#queryBuilderElement');

}


DataSourceMaker.prototype.reInitializeQueryBuilder = function () {
    var self = this;

    if(self.elements.queryBuilderElement.hasClass('query-builder')){

        if(!self.updateQueryBuilderOnSelect){
            return;
        }
        self.elements.queryBuilderElement.queryBuilder('destroy');
    }

    self.updateQueryBuilderOnSelect = false;


    var filters = [];

    var subModule = self.getSelectedPrimarySubModule();

    filters = filters.concat(subModule.getColumnsListAsFiltersForQueryBuilder());

    // 'showCalender'
    // 'chosen-selectpicker'
    self.elements.queryBuilderElement.queryBuilder({
        plugins: ['bt-tooltip-errors', ],
        allow_empty : true,
        filters : filters
    });

    window._qb = self.elements.queryBuilderElement;

    self.elements.queryBuilderElement.on('afterUpdateRuleFilter.queryBuilder', function (eve, rule) {
        // console.log(rule.filter);

        var element = $(this);

        var filter = rule.filter;
        if(!filter.getDataFromAjax){
            return;
        }

        if(filter.isGetDataFromAjaxDone){
            return;
        }

        filter.isGetDataFromAjaxDone = true;

        var column = self.erp.modules[filter.data.moduleId]
            .subModules[filter.data.subModuleId]
            .columnManager.columns[filter.data.columnId];

        // if(column.lookUpDataBackUp && column.lookUpDataBackUp.length){
        //     // console.log('lookUpDataBackUp found', column.lookUpDataBackUp);
        //     return;
        // }

        var formViewConfig = {
            mode : 'create',
            data : {},
            isForDataSourceMaker : true
        };

        column.getLookUpDataFromServerViaAjax(formViewConfig, function (data) {
            console.log('getLookUpDataFromServerViaAjax done', data);

            if(!data.success){
                filter.isGetDataFromAjaxDone = false;
                return;
            }

            column.lookUpDataBackUp = data.result;
            column.dataTimestamp = data.timestamp;

            filter.values.pop();

            data.result.forEach(function (item) {
                filter.values.push({
                    value : item.value,
                    label : item.text,
                    optgroup : null
                });
            });

            // console.log(element.get(0), element.find('select[name*=_value_0]').get(0));
            setTimeout(function () {
                element.find('select[name*=_filter]').trigger('change');
            }, 10);

            // column.lookUpDataBackUp = data;
        });

    });


};

DataSourceMaker.prototype.onSelectedTabChanged = function (newTabId) {
    var self = this;

    if(newTabId == 'whereCondition'){
        self.reInitializeQueryBuilder();
    }
}

DataSourceMaker.prototype.onPrimarySubModuleChanged = function () {
    var self = this;
    self.elements.ddlChooseAggregateColumn
        .empty()
        .append(self.getSelectedPrimarySubModule().getColumnsListAsSelectOptions(false, function (column) {
            // console.log('col type : ' + column.type + ' - ['+column.dataType+']');
            switch (column.type){
                case Column.COLUMN_TYPES.INTEGER:
                case Column.COLUMN_TYPES.DECIMAL:
                case Column.COLUMN_TYPES.IDENTITY:
                    return true;

                case Column.COLUMN_TYPES.LOOKUP_TEXTBOX:
                    if(column.dataType == 'int' || column.dataType == 'dec(10,2)' || column.dataType == 'dec(12,4)'){
                        return true;
                    }
                    break;
            }
            return false;
        }));
    // need to change this to support multiple tables after inner join

    self.elements.allColumnsToShowTable
        .find('tbody')
        .empty()
        .append(self.getSelectedPrimarySubModule().getColumnsListAsCheckableTableRows());

    self.updateQueryBuilderOnSelect = true;

}

DataSourceMaker.Templates = {
    popupBaseTemplate : Handlebars.compile ($("#popupBaseTemplate").html()),
    dataSourceMakerFormTemplate : Handlebars.compile ($("#dataSourceMakerFormTemplate").html()),
}

