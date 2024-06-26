

function DashboardItem_Table(config, parentObject) {
    var self = this;
    window.DashboardItem.apply(this, [config, parentObject]);
    self.initialize();
    return self;
}

DashboardItem_Table.prototype = Object.create(DashboardItem.prototype);
DashboardItem_Table.prototype.constructor = DashboardItem_Table;
DashboardItem_Table.prototype.super = DashboardItem.prototype;



DashboardItem_Table.prototype.CONTAINER_Z_INDEX = 4000;



DashboardItem_Table.prototype.initialize = function () {
    var self = this;
    self.options = {};
    self.super.initialize.apply(self);
    return self;
}

DashboardItem_Table.prototype.getItemTypeName = function () {
    return 'dashboardItem_Table';
}

DashboardItem_Table.prototype.getId = function () {
    var self = this;
    return self.config.id;
}


// DashboardItem_Table.prototype.getButtons = function () {
//     return [
//         {
//             id : "ok",
//             displayName : "Ok",
//         },
//         {
//             id : "cancel",
//             displayName : "Cancel",
//         }
//     ]
// }

// DashboardItem_Table.prototype.handleOnButtonClickEvent = function (buttonElement) {
//     var self = this;
//     switch (buttonElement.attr('data-id')) {
//         case 'ok':
//             self.onOkButtonClicked();
//             break;
//         case 'reset':
//             self.resetForm();
//             break;
//         case 'cancel':
//             self.onCancelButtonClicked();
//             break;
//     }
// }
//
//
// DashboardItem_Table.prototype.onOkButtonClicked = function () {
//     var self = this;
//     self.options.onOk && self.options.onOk(self.getInputElementValue());
//     self.hide();
// }

DashboardItem_Table.prototype.createElements = function () {
    var self = this;
    self.super.createElements.apply(self);

    self.createContentElement();
}

DashboardItem_Table.prototype.createContentElement = function () {
    var self = this;

    self.elements.dashboardItemContent.empty();

    var itemMainElement = $(DashboardItem_Table.Templates.dashboardItemElementTemplate_Table(self.config));
    self.elements.itemMainElement = itemMainElement;
    self.elements.dashboardItemContent.append(itemMainElement);

    self.elements.mainTableContainer = itemMainElement.find('.mainTableContainer');
    self.elements.mainTable = itemMainElement.find('#mainTable');

    self.elements.mainTableHead = self.elements.mainTable.find('thead');
    self.elements.mainTableBody = self.elements.mainTable.find('tbody');
    self.elements.mainTableFoot = self.elements.mainTable.find('tfoot');


    if(!self.config.mainTable){
        self.setElementAsNotConfigured(self.elements.mainTableContainer);
    }

    self.elements.itemMainElement.find('[data-not-configured]').each(function () {
        var element = $(this);
        element.attr('title', element.attr('data-configure-message'));
    });
}
DashboardItem_Table.prototype.bindEvents = function () {
    var self = this;
    self.super.bindEvents.apply(self);
}

DashboardItem_Table.prototype.show = function (options) {
    var self = this;

    self.options = options || {};

    // self.defaultValue = defaultValue || '';
    // self.isMandatory = options.mandatory || false;
    // self.callbacks = {
    //     onOk : options.onOkCallback,
    //     onCancel : options.onCancelCallback,
    // }

    self.resetForm();

    self.super.show.apply(self);

    self.elements.container.css('z-index', ++DashboardItem_Table.prototype.CONTAINER_Z_INDEX);

    self.elements.form.find('input').first().focus();
}

DashboardItem_Table.prototype.resetContentElement = function () {
    var self = this;
    self.createContentElement();
}



DashboardItem_Table.prototype.refreshDataFromServer = function(parentReportFilter){
    var self = this;
    var parentReportFilterId = undefined;

    if(parentReportFilter){
        parentReportFilterId = parentReportFilter.id;
        self.latestParentReportFilterId = parentReportFilterId;
    }
    else{
        self.latestParentReportFilterId = undefined;
    }

    var url = DashboardManager.API_ENDPOINTS.GET_ITEM_DATA + '/'+ self.id;
    self.showLoadingOverlay();
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            parentReportFilterId :parentReportFilterId,
            config: {
                _dashboard : true
            }
        }
    }).always(function(data, status){

        // console.log('done get dash item data', data, status);

        self.hideLoadingOverlay();

        if(data.success){
            self.dataFromServerReceived(data.result);
        }
        else{
            console.error('failed get dash item data', data, status);
            self.setToErrorMode(data.errorMessage);
            //self.subReport.notifier.showReportableErrorNotification('Error getting data for '+ self.displayName+'('+ data.errorMessage +')');
        }
    });
    return self;
};

DashboardItem_Table.prototype.dataFromServerReceived = function(result){
    var self = this;

    self.latestDataFromServer = result.mainTable;


    if(self.isDataTableInitialized){
        self.dataTableAPI.destroy();
    }

    self.initializeTableHead();

    self.populateTableBody();


    // -- need to do more work for lazy loading using paging logic

    if(self.latestDataFromServer.length){

        self.elements.mainTable.dataTable({
            "aLengthMenu": [[10, 25, 50,75,100, -1], [10,25, 50, 75,100, "All"]],
            // "order": [[ idIndex, "desc" ]],
            // "columnDefs": [
            //     {
            //         "targets": [ idIndex ],
            //         "visible": false
            //     }
            // ],
            bSort: true
        });
        self.dataTableAPI = self.elements.mainTable.api();
        self.isDataTableInitialized = true;
    }

    return self;
};

DashboardItem_Table.prototype.initializeTableHead = function(){
    var self = this;
    var thead = self.elements.mainTableHead;

    thead.empty();

    var tr = $(document.createElement('tr'));

    self.config.mainTable.dataSource.columnsToShow.forEach(function (columnObj) {
        var th = $(document.createElement('th'));
        var span = $(document.createElement('span')).appendTo(th);

        var column = self.getColumnFromDataSourceObj(columnObj);

        span.text(column.displayName);
        span.attr('data-column-id', column.id);
        span.attr('data-module-id', column.subModule.module.id);
        span.attr('data-sub-module-id', column.subModule.id);

        tr.append(th);
    });

    thead.append(tr);

    return self;
};

DashboardItem_Table.prototype.populateTableBody = function(){
    var self = this;
    var data = self.latestDataFromServer;

    self.elements.mainTableBody.empty();

    if(data.length){
        self.createDataRows();
    }
    else{
        self.createNoDataMessageRow();
    }
    return self;
};

DashboardItem_Table.prototype.createNoDataMessageRow = function(){
    var self = this;
    var tbody = self.elements.mainTableBody;

    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.className = 'no-data-message-row';
    td.setAttribute('colspan', self.config.mainTable.dataSource.columnsToShow.length);

    var span = document.createElement('span');
    span.innerHTML = 'No Data To Display';

    td.appendChild(span);
    tr.appendChild(td);
    tbody.append(tr);

    return self;
};

DashboardItem_Table.prototype.createDataRows = function(){
    var self = this;
    var tbody = self.elements.mainTableBody;

    var data = self.latestDataFromServer;

    data.forEach(function(dataRow) {
        var tr = document.createElement('tr');

        self.config.mainTable.dataSource.columnsToShow.forEach(function (columnObj) {
            var column = self.getColumnFromDataSourceObj(columnObj);

            var td = document.createElement('td');

            var displayValue = column.parseDisplayValue(dataRow);
            var editValue = column.parseEditValue(dataRow);

            var element = document.createElement('span');
            element.innerHTML = displayValue;
            element.setAttribute('data-edit-value', editValue);

            td.appendChild(element);
            tr.appendChild(td);
        });
        tbody.append(tr);

    });

    return self;
}




DashboardItem_Table.prototype.getChangedValuesInConfiguration = function(){
    var self = this;
    return {
        mainTable : self.config.mainTable
    };
}


DashboardItem_Table.prototype.showConfigureMainTableDataSourceWindow = function () {
    var self = this;

    self.initializeDataSourceMakerComponent();

    var currentDataSource = {};

    if(self.config.mainTable){
        currentDataSource = self.config.mainTable.dataSource;
    }

    self.parentObject.dataSourceMaker.show({
        hideAggregateColumns : true,
        currentValue : currentDataSource,
        onSaveCallback : function (newDataSourceConfiguration) {
            console.log('new config', newDataSourceConfiguration);
            if(!self.config.mainTable){
                self.config.mainTable = {
                }
            }

            self.config.mainTable.dataSource = newDataSourceConfiguration;

            self.updateCurrentConfigurationToServer(function (updateErr) {
                self.setElementAsConfigured(self.elements.mainTableContainer);
                self.refreshDataFromServer();
            });
        }
    });
},

DashboardItem_Table.prototype.handleConfigureElementClickEvent = function(itemId){
    var self = this;

    switch (itemId){
        case 'mainTable':
            self.showConfigureMainTableDataSourceWindow();
            break;
    }

}



DashboardItem_Table.Templates = {
    dashboardItemElementTemplate_Table : Handlebars.compile ($("#dashboardItemElementTemplate_Table").html()),
}

