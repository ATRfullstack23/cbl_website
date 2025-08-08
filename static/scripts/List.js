/**
 * Created by Akhil Sekharan on 12/5/13.
 */
/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function List(config, parentObject) {
    var self = this;
    self.config = config;

    // temp aki for accounts demo -- need to remove later and move this configuration at usc level
    if(config.id === 'profit_and_loss_account'){
        // manual override aki
        config.is_wysiwyg_table = true;
        config.wysiwyg_table_settings = {
            number_of_columns: 6,

        };
    }

    if(config.id === 'trial_balance'){
        // manual override aki
        config.is_wysiwyg_table = true;
        config.wysiwyg_table_settings = {
            number_of_columns: 3,

        };
    }

    if(config.id === 'project_wise_p_and_l_report'){
        // manual override aki
        config.is_wysiwyg_table = true;
        config.wysiwyg_table_settings = {
            number_of_columns: 3,

        };
    }

    if(config.id === 'vertical_profit_and_loss_account'){
        // manual override aki
        config.is_wysiwyg_table = true;
        config.wysiwyg_table_settings = {
            number_of_columns: 3,

        };
    }

    self.listManager = parentObject;
    self.subReport = self.listManager.parentObject;
    self.report = self.listManager.parentObject.parentObject;
    self.erp = self.subReport.erp;
    self.parentObject = parentObject;
    self.initialize();
    return self;
}

List.prototype = {
    constants: {
        container: {
            "class": "list-container subReportItem"
        },
        mainContainer:{
            "class": "mainContainer"
        },
        spanDisplayName: {
            "class": "list-spanDisplayName"
        },
        divHeader: {
            "class": "list-divHeader divHandle"
        },
        btnExportToExcel:{
            "class": "list-btnExportToExcel"
        },
        btnExportToPdf:{
            "class": "list-btnExportToPdf"
        },
        divContent: {
            "class": "list-divContent"
        },
        tableMain: {
            "class": "list-tableMain"
        }
    },
    initialize: function () {
        var self = this;
        self.config.dataTables = self.config.dataTables || {
            enableFilters: true,
            enableSorting: true
        };

        if(self.config.is_wysiwyg_table){
            self.is_wysiwyg_table = true;
            self.config.dataTables = self.dataTables = null;
        }

        for(var key in self.config){
            self[key] = self.config[key];
        }
        self.createElements().bindEvents();
        self.setDeviceTypeDisplayMode();
        return self;
    },
    setDeviceTypeDisplayMode: function(){
        var self = this;
        self.container.addClass(self.erp.deviceType);
        return self;
    },
    setPositionAndSize: function(positionObj){
        var self = this;
        if(!positionObj){
            return;
        }
//        self.container.css({left: positionObj.left, top: positionObj.top});
        self.container.width(positionObj.width);
        self.container.height(positionObj.height);
        self.container.attr('data-row',positionObj['data-row']);
        self.container.attr('data-col',positionObj['data-col']);
        self.container.attr('data-sizex',positionObj['data-sizex']);
        self.container.attr('data-sizey',positionObj['data-sizey']);
    },
    getPositionAndSize: function(){
        var self = this;
        var obj = self.container.position();
        obj.width =self.container.width();
        obj.height =self.container.height();
        obj['data-row'] = self.container.attr('data-row');
        obj['data-col'] = self.container.attr('data-col');
        obj['data-sizex'] = self.container.attr('data-sizex');
        obj['data-sizey'] = self.container.attr('data-sizey');
        return obj;
    },
    setToNormalMode: function(){
        var self = this;
        self.isInReorderMode = false;
        self.container.resizable('destroy').draggable('destroy');
        return self;
    },
    setToReorderMode: function(){
        var self = this;
        self.isInReorderMode = true;
        self.container.resizable().draggable({ containment: self.subReport.container, scroll: false },{handle :'.divHandle'});
        return self;
    },
    bindEvents: function () {
        var self = this;
        self.elements.btnExportToExcel.on('click', function(){
            self.exportToExcel();
        });
        // if(self.enablePdfDownload && self.enablePdfDownload.enable){
        self.elements.btnExportToPdf.on('click', function(){
            self.exportToPdf();
        });
        // }

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
            case List.FILTER_TYPES.FREE_SEARCH:
                value = self.getListFormElement().val();
                break;
        }
        return value;
    },
    setCurrentEditValue: function(value){
        var self = this;
        switch(self.type){
            case List.FILTER_TYPES.FREE_SEARCH:
                self.getListFormElement().val(value);
                break;
        }
        return value;
    },
    resetValues: function(){
        var self = this;
        self.showLoadingOverLay();
        return self;
    },
    showLoadingOverLay: function(){
        var self = this;
        self.hideOverLay();
        self.elements.container
            .addClass('showLoadingOverlay');
        return self;
    },
    showErrorOverlay: function(errorMessage){
        var self = this;
        self.hideOverLay();
        self.elements.container
            .addClass('showErrorOverlay');
        if(errorMessage && errorMessage.message){
            self.container.attr('data-error-message', errorMessage.message);
        }
        else if(errorMessage){
            self.container.attr('data-error-message', errorMessage);
        }
        return self;
    },
    hideOverLay: function(){
        var self = this;
        self.elements.container
            .removeClass('showLoadingOverlay')
            .removeClass('showErrorOverlay');
        self.container.removeClass('errorMode');
        return self;
    },
    setToErrorMode: function(errorMessage){
        var self = this;
        self.showErrorOverlay(errorMessage);
        self.container.addClass('errorMode');
        return self;
    },

    refreshDataFromServer: function(parentReportFilter){
        var self = this;
        var parentReportFilterId = undefined;
        if(parentReportFilter){
            parentReportFilterId = parentReportFilter.id;
            self.latestParentReportFilterId = parentReportFilterId;
        }
        else{
            self.latestParentReportFilterId = undefined;
        }
        var url = self.erp.backend_root_url + '/ajax/reports/' + self.report.id + '/' +self.subReport.id + '/getListData/'+ self.id;
        self.resetValues();
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                parentReportFilterId :parentReportFilterId,
                config: {
                    filterCondition : self.subReport.reportFilterManager.getFilterValues()
                }
            }
        }).done(function(data){

            if(data.success){
                self.listDataReceived(data.result);
            }
            else{
                self.setToErrorMode(data.errorMessage);
                //self.subReport.notifier.showReportableErrorNotification('Error getting data for '+ self.displayName+'('+ data.errorMessage +')');
            }
        });
        return self;
    },


    exportToPdf: function(){
        var self = this;

        self.showLoadingOverLay();

        var parentReportFilterId = self.latestParentReportFilterId;
        var url = '/export/reports/' + self.report.id + '/' +self.subReport.id + '/getListData/'+ self.id;
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                parentReportFilterId :parentReportFilterId,
                config: {
                    filterCondition : self.subReport.reportFilterManager.getFilterValues()
                }
            }
        }).always(function(data, status){

            self.hideOverLay();

            console.log('export to pdf done', data)

            if(data && data.result && data.result.url){
                var newWin = window.open(data.result.url, '', 'width=1000,height=500');
            }
            else{
                self.subReport.notifier.showErrorNotification('Failed to export to pdf');
            }

        });
        return self;
    },


    setup_wysiwyg_table: function(data){
        const self = this;
        const table_data = [];
        table_data.push(...data);
        self.data = table_data;

        table_data.shift();
        console.log('table_data', table_data)
        console.log('list self', self)
        window.__list = self;

        self.tbody = self._creation.createTableBody(self);

        self.elements.tableMain.empty();
        // self.elements.tableMain.append(self.thead);
        self.elements.tableMain.append(self.tbody);
        self.elements.tableMain.addClass('wysiwyg_table');

        for(const data_row of table_data){
            for(const data_column_value in data_row){

            }
        }


    },

    listDataReceived: function(data){
        var self = this;
        self.hideOverLay();
        var listData = [];
        var dataRowId = 1;
        data = data || [];


        if(self.is_wysiwyg_table){
            self.setup_wysiwyg_table(data);
            return;
        }


        if(self.config.dataTables.enableSorting){
            data.reverse().forEach(function(dataRow){
                dataRow.id = dataRowId;
                listData.push(dataRow);
                dataRowId = dataRowId + 1;
            });
        }
        else{
            data.forEach(function(dataRow){
                dataRow.id = dataRowId;
                listData.push(dataRow);
                dataRowId = dataRowId + 1;
            });
        }
        if(data.length){
            var noOfColumns = Object.keys(data[0]).length;
            if(noOfColumns == self.noOfColumns){
                self.dataTableInitialized = true;
            }
            else{
                self.noOfColumns = Object.keys(data[0]).length;
                self.dataTableInitialized = false;
                self.elements.tableMain.fnDestroy && self.elements.tableMain.fnDestroy();
            }
        }
        self.data = listData;
        var idIndex = Object.keys(data[0] || {}).length - 1;
//////////////////////////////yathi//////////////////////////////////////////////////////////////////

        if(!self.dataTableInitialized && data.length){
            self.thead = self._creation.createTableHead(self);
            self.tbody = self._creation.createTableBody(self);
            self.elements.tableMain.empty();
            self.elements.tableMain.append(self.thead);
            self.elements.tableMain.append(self.tbody);
            self.elements.tableMain.addClass('dataTableSearch');
            if(self.config.dataTables.enableFilters){
                self.elements.tableMain.find('thead th').each(function(){
                    var searchContainer = $(this);
                    var columnName = self.elements.tableMain.find('thead th').eq($(this).index()).text();
                    if(!searchContainer.find('input').get(0)){
                        var searchInput = $(document.createElement('input'))
                            .attr({'type':'text','placeholder':'search by ' +columnName})
                            .css({'display':'block'});
                        searchInput.on('click',function(event){
                            event.stopPropagation();
                        });
                        searchContainer.append(searchInput);
                    }
                });
            }

            self.elements.tableMain.dataTable({
                "aLengthMenu": [[10, 25, 50,75,100, -1], [10,25, 50, 75,100, "All"]],
                "order": [[ idIndex, "desc" ]],
                "columnDefs": [
                    {
                        "targets": [ idIndex ],
                        "visible": false
                    }
                ],
                bSort: self.config.dataTables.enableSorting
            });

            if(!self.dataTables.enableColumnHeading) {
                self.container.find('th span').detach();
            }

            self.elements.tableMain.on('keyup', 'input', function(){
                var inputElement = $(this);
                var searchValue = inputElement.val();
                var index = inputElement.parent().index();
                self.dataTableAPI.column(index).search(searchValue).draw();
            });

            self.dataTableAPI = self.elements.tableMain.api();
            self.dataTableInitialized = true;

        }
        else if (self.dataTableInitialized){
            self.dataTableAPI.clear().draw();
            self.data.forEach(function(values){
                var rowValueArray = [];
                for (var key in values){
                    rowValueArray.push(values[key]);
                }
                self.dataTableAPI.row.add(rowValueArray);
            });
            if(idIndex != -1){
                self.dataTableAPI.order(idIndex, 'desc').draw();
            }
        }


        return self;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    isDisabledNow: function(){
        var self = this;
        return self.getListFormElement().prop('disabled');
    },
    triggerEvent: function(listMode, eventType){
        var self = this;
        if(!self.isDisabledNow(listMode)){
            self.getElement(listMode).trigger(eventType);
        }
        return self;
    },
    show      : function () {
        var self = this;
        return self;
    },
    hide      : function () {
        var self = this;
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
    exportToExcel: function(){
        var self = this;
        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table align="center">{table}</table></body></html>'
            , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
        var inputs = self.elements.tableMain.find('input').each(function(){
            $(this).data('parentNode', $(this).parent());
        }).detach();

        if(self.config.listTitle == ''){
            var excelTitle = prompt('Excel Title (Optional)', self.displayName);
        }
        else{
            var excelTitle = prompt('Excel Title (Optional)', self.config.listTitle);
        }
        var titleTr;
        var fileName = excelTitle || (self.displayName + ' ' +moment().format('DD-MMM-YYYY hh:mm:ss a'));

//        if(excelTitle){
//            var thead = self.elements.tableMain.find('thead');
//            var colSpan = thead.children().children().length;
//            titleTr = $(document.createElement('tr'))
//                .html('<td colspan="'+colSpan+'" align="center" style="font-size:30px;">'+ excelTitle +'</td>')
//                .prependTo(thead);
//        }
        //////////////////////////////////yathi///////////////////////////////////////
        if(self.config.printFilterWithHeading){
            var filterArr = [];
            var reportFiltersObj = self.subReport.reportFilters;
            for(var reportFiltersKey in reportFiltersObj){
                if(reportFiltersObj[reportFiltersKey].type != 'lookUp' && self.subReport.reportFilterManager.reportFilters[reportFiltersKey].editValue != ''){
                    filterArr.push(reportFiltersObj[reportFiltersKey].displayName +' : ' + self.subReport.reportFilterManager.reportFilters[reportFiltersKey].editValue)
                }
                if(reportFiltersObj[reportFiltersKey].type == 'lookUp' && self.subReport.reportFilterManager.reportFilters[reportFiltersKey].editValue != ''){
                    filterArr.push(reportFiltersObj[reportFiltersKey].displayName +' : ' + self.subReport.reportFilterManager.reportFilters[reportFiltersObj[reportFiltersKey].id].container.find('span').text())
                }
            }
            var filterValue = '('+ filterArr.join() + ')';
        }


        if(filterValue == undefined){
            var thead = self.elements.tableMain.find('thead');
            var colSpan = thead.children().children().length;
            titleTr = $(document.createElement('tr'))
                .html('<td colspan="'+colSpan+'"> <div align="center"> <span style="font-size:30px;"> '+ excelTitle +' </span> </div> </td>')
                .prependTo(thead);
        }
        else {
            var thead = self.elements.tableMain.find('thead');
            var colSpan = thead.children().children().length;
            titleTr = $(document.createElement('tr'))
                .html('<td colspan="'+colSpan+'"> <div align="center"> <span style="font-size:30px;"> '+ excelTitle +' </span> <span align="right" style="font-size:15px; color: dimgray;"> '+ filterValue +' </span> </div> </td>')
                .prependTo(thead);
        }
////////////////////////////////////////////////////////////////////////////


        var tableHtml = self.elements.tableMain.html();
        titleTr && titleTr.remove();
        var options = {
            worksheet: self.displayName || 'Worksheet', table: tableHtml
        }
        var blob = new Blob([format(template, options)],
            {type: uri});
        saveAs( blob,  fileName+'.xls');
        inputs.each(function(){
            $(this).appendTo($(this).data('parentNode'));
        });
        return self;
    },

    _creation : {
        createContainer: function(list){
            var div = $(document.createElement('li')).attr({'data-row':"1", 'data-col':"1", 'data-sizex':"1",'data-sizey':"1",id: list.id, class: list.constants.container.class});
            return div;
        },
        createMainContainer: function(list){
            var div = $(document.createElement('div')).attr(list.constants.mainContainer);
            return div;
        },
        createHeader: function(list){
            var divHeader = $(document.createElement('div'))
                .attr(list.constants.divHeader);
            list.elements.divHeader = divHeader;

            var spanDisplayName = $(document.createElement('span'))
                .attr(list.constants.spanDisplayName)
                .text(list.displayName).appendTo(divHeader);
            list.elements.spanDisplayName = spanDisplayName;

            var btnExportToExcel = $(document.createElement('div'))
                .attr(list.constants.btnExportToExcel)
                .appendTo(divHeader);
            list.elements.btnExportToExcel = btnExportToExcel;

            var btnExportToPdf = $(document.createElement('div'))
                .attr(list.constants.btnExportToPdf)
                .appendTo(divHeader);
            list.elements.btnExportToPdf = btnExportToPdf;
            if(list.enablePdfDownload && list.enablePdfDownload.enable){
            }
            else{
                btnExportToPdf.hide();
            }

            return divHeader;
        },

        createContentContainer: function(list){
            var self = this;
            var divContent = $(document.createElement('div'))
                .attr(list.constants.divContent);
            list.elements.divContent = divContent;

            var tableMain = $(document.createElement('table'))
                .attr(list.constants.tableMain)
                .appendTo(divContent);
            list.elements.tableMain = tableMain;

            return divContent;
        },
        createElements: function(list){
            var self = this;
            var container = self.createContainer(list);

            list.elements = {};
            list.container = container;
            list.elements.container = container;

            var divMainContainer = self.createMainContainer(list);
            var divHeader = self.createHeader(list);
            var divContent = self.createContentContainer(list);

            if(list.hidden){
                container.addClass('hidden');
            };
            divMainContainer.append(divHeader).append(divContent);

            container.append(divMainContainer);
            return self;
        },
        createTableHead: function(list){
            var self = this;
            var data = list.data;
            var thead = $(document.createElement('thead'));
            var dataRow = list.data[0];
            if(list.showHeaderColumns && dataRow){
                var tr = document.createElement('tr');
                for(var key in dataRow){
                    var th = document.createElement('th');
                    var element = document.createElement('span');
                    let table_header_name = key;
                    table_header_name = table_header_name.replaceAll('_', ' ');
                    element.innerHTML = table_header_name;
                    th.appendChild(element);
                    tr.appendChild(th);
                }
                thead.append(tr);
            }
            return thead;
        },
        createTableBody: function(list){
            var self = this;
            var data = list.data;
            var tbody;
            if(Object.keys(data).length){
                tbody = self.createDataRows(list);
            }
            else{
                tbody = self.createNoDataMessageRow(list);
            }
            return tbody;
        },
        createNoDataMessageRow: function(list){
            var self = this;
            var tbody = document.createElement('tbody');
            var tr = document.createElement('tr');
            var td = document.createElement('td');
//            td.colSpan = list.columnOrder.length+1;
            td.className = 'list-no-data-message-row';
            var span = document.createElement('span');
            span.innerHTML = list.noDataMessage || 'No Data To Display';
            td.appendChild(span);
            tr.appendChild(td);
            tbody.appendChild(tr);
            return tbody;
        },
        createDataRows: function(list){
            var self = this;
            var tbody = document.createElement('tbody');

            if(list.is_wysiwyg_table){
                list.data.forEach(function(dataRow){
                    var tr = document.createElement('tr');

                    const actual_arr = dataRow['`'] || dataRow['~'];
                    if(actual_arr.length === 3 && list.config.wysiwyg_table_settings.number_of_columns === 6){
                        actual_arr.unshift('');
                        actual_arr.unshift('');
                        actual_arr.unshift('');
                    }


                    console.log('actual_arr.length', actual_arr.length)
                    console.log('list.config.wysiwyg_table_settings.number_of_columns', list.config.wysiwyg_table_settings.number_of_columns)
                    console.log('dataRow', actual_arr)

                    for(var item_value of actual_arr){
                        var td = document.createElement('td');
                        var element = document.createElement('span');
                        element.innerHTML = item_value;
                        td.appendChild(element);
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);
                });
            }
            else{
                list.data.forEach(function(dataRow){
                    var tr = document.createElement('tr');
                    for(var key in dataRow){
                        var td = document.createElement('td');
                        var element = document.createElement('span');
                        element.innerHTML = dataRow[key];
                        td.appendChild(element);
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);
                });
            }


            return tbody;
        }
    },
    _events   : {
    },
    _ui       : {
    }
};
