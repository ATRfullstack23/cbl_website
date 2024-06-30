/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function Grid( config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.subModule = parentObject;
    self.module = self.subModule.module;
    self.erp = self.module.erp;
    self.id = self.subModule.id +'_grid';
    self.gridPositionConfig = {};
    self.initialize();
    return self;
}

Grid.CREATE_MODE = 'create';
Grid.EDIT_MODE = 'edit';
Grid.VIEW_MODE = 'view';

Grid.prototype = {
    constants: {
        columnChooserContainer: {
            class: "columnChooserContainer"
        },
        columnChooserOkButton: {
            class: "columnChooserOkButton"
        },
        columnChooserCancelButton: {
            class: "columnChooserCancelButton"
        },
    },
    initialize: function () {
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }
        self.columns = self.subModule.columnManager.columns;
        self.setColumnIndex();
        self.pager = new Pager(self.pager, self);
        self.notifier = new Notifier({
            container: $(document.body)
        });
        self.createElements();
        self.element = self.container;
        self.grid = self.container.find('#grid');
        //$(document.body).append(self.container);
        self.bindEvents();
        if(!self.defaultSort){
            self.defaultSort = {
                sortColumn: 'id',
                sortType: ''
            }
        }
        self.boxUpAnimation = new GridDataAnimation();
        self._sortCondition.initialize(self, self.defaultSort);

        self.intializeSocketEventsObject();
        self._db.initialize(self);
        self.setDeviceTypeDisplayMode();
        return self;
    },
    setColumnIndex: function(){
        var self = this;
        self.gridOrder = self.erp.getUserSetting(self.subModule.id + '_gridOrder');
        if(self.gridOrder && Object.keys(self.gridOrder).length){
            var gridOrderCount = 0;
            for(var key in self.gridOrder){
                var gridColumn = self.gridOrder[key];
                if(self.subModule.columnManager.config[gridColumn.id]){
                    gridOrderCount++;
                    self.subModule.columnManager.config[gridColumn.id].gridView.index = gridColumn.index;
                    self.subModule.columnManager.config[gridColumn.id].gridView.isAppended = true;
                    self.subModule.columnManager.columns[gridColumn.id].gridView.index = gridColumn.index;
                    self.subModule.columnManager.columns[gridColumn.id].gridView.isAppended = true;
                }
            }
            self.subModule.forEachColumn(function(column){
                if(!column.gridView.isHidden && !column.gridView.isAppended){
                    self.subModule.columnManager.config[column.id].gridView.index = gridOrderCount;
                    self.subModule.columnManager.config[column.id].gridView.isAppended = true;
                    self.subModule.columnManager.columns[column.id].gridView.index = gridOrderCount;
                    self.subModule.columnManager.columns[column.id].gridView.isAppended = true;
					gridOrderCount++;
                }
            });
        }
        return self;
    },
    setDeviceTypeDisplayMode: function(){
        var self = this;
        self.container.addClass(self.erp.deviceType);
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
        return self;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    unCheckAllRowSelector: function(){
        var self = this;
        self.elements.table.find('.grid-row-selector').prop('checked', false);
        return self;
    },
    columnChooserOkButtonClicked: function(){
        var self = this;
        var config = {
            selectedColumnArr: []
        }

        self.elements.columnChooserContainer.find('.columnChooser div').each(function(){
            var div = $(this);
            if(div.children('input').prop('checked')){
                config.selectedColumnArr.push(div.data('id'));
            }
        });
        config.excelHeading = self.elements.columnChooserExcelHeading.val();
        if(self.elements.columnChooserContainer.children('input').prop('checked')){
            config.currentPage = true;
        }
        self.exportGridToExcel(config);
        self.elements.columnChooserContainer.get(0).close();
        return self;
    },
    bindEvents: function () {
        var self = this;
        var grid = self.grid;

        self.elements.columnChooserContainer.on('click', '.'+self.constants.columnChooserOkButton.class, function(event){
            self.columnChooserOkButtonClicked()
        });
        self.elements.columnChooserContainer.on('click', '.'+self.constants.columnChooserCancelButton.class, function(event){
            self.elements.columnChooserContainer.get(0).close();
        });

        grid.on('change', '.grid-row-selector', function(eve){
            var item = $(this);

            // if(item.closest('.inlineViewMode').length){ // must be inside inline child window
            //     if(item.closest('.inlineViewMode').attr('data-child-sub-module-id') != self.subModule.id){
            //         console.log('returning', item.closest('.inlineViewMode').attr('id') , self.subModule.id)
            //         return;
            //     }
            // }

            self.subModule.getConfirmationQuote(self.data[item.closest('tr').attr('id')], function(){
                self.subModule.buttonManager.rowSelectorChanged($(this));
            });

            eve.stopPropagation();

        });
        self.elements.rowSelectorAll.on('change', function(eve){
            self.subModule.buttonManager.rowSelectorAllChanged($(this));
        });
        grid.on('dblclick', 'tbody > tr', function(eve){
            var element = $(this);

            // if(element.closest('.inlineViewMode').length){ // must be inside inline child window
            //     if(element.closest('.inlineViewMode').attr('data-child-sub-module-id') != self.subModule.id){
            //         return;
            //     }
            // }

            if($(eve.target).is('input')){
                return;
            }
            var checkbox = element.find('.grid-row-selector');
            if(!checkbox.length){
                return;
            }
            self.updateRowSelection(checkbox);
            var rowId = checkbox.data('id');
            var viewButton = self.subModule.buttonManager.buttons.view;
            if(viewButton){
                //self.subModule.formView.show(FormView.VIEW_MODE, self.data[rowId]);
                viewButton.triggerEvent(Button.BUTTON_MODES.GRID, 'click');
            }

            eve.stopPropagation();

        });
        grid.find('thead').on('click', '.grid-header-text-sortable', function(eve){
            var element = $(this);
            // if(element.closest('.inlineViewMode').length){ // must be inside inline child window
            //     if(element.closest('.inlineViewMode').attr('data-child-sub-module-id') != self.subModule.id){
            //         return;
            //     }
            // }

            if($(eve.target).is('input')){
                return;
            }
            self.sortGridView(self.columns[element.data('columnId')], element);
            eve.stopPropagation();
        });

        grid.on('click', '.grid-data-item', function(eve){
            var item = $(this);
            // if(item.closest('.inlineViewMode').length){ // must be inside inline child window
            //     if(item.closest('.inlineViewMode').attr('data-child-sub-module-id') != self.subModule.id){
            //         return;
            //     }
            // }
            var column = self.columns[item.data('id')];
            column.gridElementClicked(self.data[item.closest('tr').attr('id')]);
            eve.stopPropagation();
        });
        grid.on('mouseover', '.grid-data-item', function(eve){
            var item = $(this);
            // if(item.closest('.inlineViewMode').length){ // must be inside inline child window
            //     if(item.closest('.inlineViewMode').attr('data-child-sub-module-id') != self.subModule.id){
            //         return;
            //     }
            // }
            var column = self.columns[item.data('id')];
            column.gridElementMouseOver(self.data[item.closest('tr').attr('id')]);
            eve.stopPropagation();
        });
        grid.on('mouseout', '.grid-data-item', function(eve){
            var item = $(this);
            // if(item.closest('.inlineViewMode').length){ // must be inside inline child window
            //     if(item.closest('.inlineViewMode').attr('data-child-sub-module-id') != self.subModule.id){
            //         return;
            //     }
            // }
            var column = self.columns[item.data('id')];
            column.gridElementMouseOut(self.data[item.closest('tr').attr('id')]);
            eve.stopPropagation();
        });

        grid.on('keydown', 'input.gridViewEditInDisplayElement', function(eve){
            return self.handleColumnEditInDisplayElementKeyDown(eve, $(this));
        });
        return self;
    },
    handleColumnEditInDisplayElementKeyDown: function(eve, element){
        var self = this;
        var ret = true;
        switch(eve.keyCode){
            case ERP.KEY_CODES.LEFT:
                var ret = true;
                if(element.get(0).selectionStart == 0){
                    ret = false;
                }
                if(!ret){
                    self.handleArrowKeyLeftEditInDisplayElement(eve, element);
                }
                break;
            case ERP.KEY_CODES.RIGHT:
                var ret = true;
                if(element.get(0).selectionStart == element.val().length){
                    ret = false;
                }
                if(!ret){
                    self.handleArrowKeyRightEditInDisplayElement(eve, element);
                }
                return ret;
                break;
            case ERP.KEY_CODES.UP:
                self.handleArrowKeyUpEditInDisplayElement(eve, element);
                ret = false;
                break;
            case ERP.KEY_CODES.DOWN:
                self.handleArrowKeyDownEditInDisplayElement(eve, element);
                ret = false;
                break;
        }
        return ret;
    },
    handleArrowKeyLeftEditInDisplayElement: function(eve, element){
        var self = this;
        element.closest('td').prevAll().each(function(){
            var elements = $(this).find('.gridViewEditInDisplayElement');
            if(elements.length){
                elements.focus();
                return false;
            }
        });
        return self;
    },
    appendRowIngrid: function(data){
        var self = this;
        var dataRowId = data.result.rowId;
        var rowData = data.result.rowData.data;
        self.grid.find('#'+dataRowId).find('td').each(function(){
            var td = $(this);
            var columnElement;
            var columnId;
            var columnObj;
            var oldRowData = self.data[data.result.rowId];
            if(td.find('input').get(0)){
                columnElement = td.find('input');
                if(columnElement.attr('type') != 'checkbox'){
                    columnId = columnElement.attr('data-id');
                    columnObj = self.getColumnValue(rowData[columnId], oldRowData[columnId]);
                    columnElement.val(columnObj.columnValue);
                }
            }
            else if(td.find('span').get(0)){
                columnElement = td.find('span');
                columnId = columnElement.attr('data-id');
                columnObj = self.getColumnValue(rowData[columnId], oldRowData[columnId]);
                columnElement.val(columnObj.columnValue);
            }
//            console.log(columnObj, columnId)
            if(columnObj && !columnObj.isOldValue){
                columnElement.addClass('addEffectsToEditedColumn');
                setTimeout(function(){
                    columnElement.removeClass('addEffectsToEditedColumn');
                }, 2000)
            }
        });
        return self;
    },
    getColumnValue: function(obj, oldObj){
        var self = this;
        var ret = {};
        if(obj.text){
            ret.columnValue = obj.text;
            if(obj.text === oldObj.text){
                ret.isOldValue = true;
            }
        }
        else{
            ret.columnValue = obj.value;
            if(obj.value === oldObj.value){
                ret.isOldValue = true;
            }
        }
        if(ret.columnValue == null){
            ret.columnValue = '';
        }
        return ret;
    },
    saveRowDataInConfig: function(data){
        var self = this;
        var rowData = data.result.rowData.data;
        self.data[data.result.rowId] = rowData;
        return self;
    },
    saveColumnDataInConfig: function(column, value, rowId, setEditValue){
        var self = this;
        if(!rowId){
            self.dataArr.forEach(function(row){
                row[column.id] = value;
                if(setEditValue){
                    column.setGridValue(self.elements.rows[row.id].tr.find('[data-id="'+ column.id +'"]'), value);
                }
            });
        }
        else{
            self.data[rowId][column.id] = value;
            if(setEditValue){
                column.setGridValue(self.elements.rows[rowId].tr.find('[data-id="'+ column.id +'"]'), value);
            }
        }
        return self;
    },
    handleArrowKeyRightEditInDisplayElement: function(eve, element){
        var self = this;
        element.closest('td').nextAll().each(function(){
            var elements = $(this).find('.gridViewEditInDisplayElement');
            if(elements.length){
                elements.focus();
                return false;
            }
        });
        return self;
    },
    handleArrowKeyUpEditInDisplayElement: function(eve, element){
        var self = this;
        var nextTr = element.closest('tr[id]').prev();
        nextTr.find('.gridViewEditInDisplayElement[data-id="'+ element.attr('data-id') +'"]').focus();
        return self;
    },
    handleArrowKeyDownEditInDisplayElement: function(eve, element){
        var self = this;
        var nextTr = element.closest('tr[id]').next();
        nextTr.find('.gridViewEditInDisplayElement[data-id="'+ element.attr('data-id') +'"]').focus();
        return self;
    },
    updateRowSelection: function(element){
        var self = this;
        self.subModule.buttonManager.setSelectedRow(element);
        return self;
    },
    forEachDataRow: function(eachFunction, filterFunction){
        var self = this;
        for(var key in self.data){
            var dataRow = self.data[key];
            if(filterFunction){
                if(filterFunction(dataRow)){
                    eachFunction.apply(dataRow, []);
                }
            }
            else{
                eachFunction.apply(dataRow, [dataRow]);
            }
        }
        return self;
    },
    getElement: function(){
        var self = this;
        return self.element;
    },
    selectRowSelector: function(rowId){
        var self = this;
        var obj = self.elements.rows[rowId.id || rowId];
        if(obj){
            obj.rowSelector.prop('checked', true);
            self.subModule.buttonManager.rowSelectorChanged(obj.rowSelector);
        }
        return self;
    },
    hide: function(){
        var self = this;
        self.container.hide();
        return self;
    },
    show: function(){
        var self = this;
        self.container.show();
        return self;
    },
    getSocket: function(){
        var self = this;
        var socket = null;
        var current = self;
        while(true){
            if(current.socket){
                socket = current.socket;
                break;
            }
            else{
                current = current.parentObject;
            }
        }
        return socket;
    },
    getData: function(options){
        var self = this;
        self._db.getData(self, options);
        self.setFooterToLoadingMode();
        return self;
    },
    setFooterToNormalMode: function(){
        var self = this;
        if(!self.subModule.columnManager.hasFooterColumns){
            return;
        }
        self.subModule.columnManager.forEachColumn(function(column){
            column.elements.divGridFooterSubTotal.removeClass('text-loading');
            column.elements.divGridFooterGrandTotal.removeClass('text-loading');
        }, function(column){
            var ret = false;
            if(!column.gridView.isHidden && column.typeSpecific && column.typeSpecific.showTotal){
                ret = true;
            }
            return ret;
        });

        return self;
    },
    setFooterToLoadingMode: function(){
        var self = this;
        if(!self.subModule.columnManager.hasFooterColumns){
            return;
        }
        self.subModule.columnManager.forEachColumn(function(column){
            column.elements.divGridFooterSubTotal.addClass('text-loading');
            column.elements.divGridFooterGrandTotal.addClass('text-loading');
        }, function(column){
            var ret = false;
            if(!column.gridView.isHidden && column.typeSpecific && column.typeSpecific.showTotal){
                ret = true;
            }
            return ret;
        });
        return self;
    },
    setFooterData: function(){
        var self = this;
        if(!self.subModule.columnManager.hasFooterColumns){
            return;
        }
        self.subModule.columnManager.forEachColumn(function(column){
            //column.elements.divGridFooterSubTotal.text(self.footerData.subTotal[column.id]);  // footerSubTotal round to decimal point round
            //column.elements.divGridFooterGrandTotal.text(self.footerData.grandTotal[column.id]); // footerGrandTotal round to decimal point round
			   var subTotalFooter = 0;
            var grandTotalFooter = 0;
            if(column.typeSpecific && column.typeSpecific.decimalPoint && column.typeSpecific.decimalPoint.isEnabled){
                var decimalPoint = parseInt(column.typeSpecific.decimalPoint.decimalPoint);
                    subTotalFooter = self.footerData.subTotal[column.id].toFixed(decimalPoint);
                    grandTotalFooter = self.footerData.grandTotal[column.id].toFixed(decimalPoint);            }
            else{
                    subTotalFooter = self.footerData.subTotal[column.id];
                    grandTotalFooter = self.footerData.grandTotal[column.id];
            }

            column.elements.divGridFooterSubTotal.text(subTotalFooter);
            column.elements.divGridFooterGrandTotal.text(grandTotalFooter);
        }, function(column){
            var ret = false;
            if(!column.gridView.isHidden && column.typeSpecific && column.typeSpecific.showTotal){
                ret = true;
            }
            return ret;
        });
        return self;
    },
    setLookUpLabelData: function(data){
        var self = this;
        for(var key in data){
            var column = self.subModule.columnManager.columns[key];
            var columnDataArr = data[key];
            self.setColumnDataForEveryRow(column, columnDataArr);
        }
        return self;
    },
    getColumnElementForRow: function(column, rowId){
        var self = this;
        var tr = self.elements.rows[rowId].tr;
        return tr.find('.grid-data-item[data-id="'+ column.id +'"]');
    },
    setColumnDataForEveryRow: function(column, dataRows){
        var self = this;
        for(var key in dataRows){
            var value = dataRows[key];
            var columnElement = self.getColumnElementForRow(column, key);
            if(value.text !== undefined && value.text !== null){
                columnElement.text(value.text);
            }
            else if(value.value !== undefined && value.value !== null){
                columnElement.text(value.value);
            }
            else{
                columnElement.text('');
            }
        }
        return self;
    },
    sortGridView: function(column, element){
        var self = this;
        self.setSortCondition(column, element);
        self._db.getData(self);
        return this;
    },
    setSortCondition: function(column, element){
        var self = this;
        self._sortCondition.setSortCondition(self, column, element);
        return self;
    },
    getSortCondition: function(){
        var self = this;
        //var sortCondition = self._sortCondition.getTextValue(self);
        return self.sortCondition;
    },
    _sortCondition: {
        initialize: function(grid, defaultSort){
            //return;//Enable After Generation

            var column = grid.columns[defaultSort.sortColumn];
            var self = this;
            grid.sortCondition = {

            };
            self.setSortCondition(grid, column, grid.grid.find('thead [data-column-id="'+ defaultSort.sortColumn +'"]'))
        },
        inverse: function(grid){
            if(grid.sortCondition.sortType === 'DESC'){
                grid.sortCondition.sortType = 'ASC';
            }
            else{
                grid.sortCondition.sortType = 'DESC';
            }
        },
        getTextValue: function(grid){
            //console.log(grid)
            //return grid.sortCondition;
            return grid.sortCondition.sortType + grid.sortCondition.sortColumn.databaseName;
        },
        setSortCondition: function(grid, column, element){
            var self = this;
            if(!grid.sortCondition.sortColumn || grid.sortCondition.sortColumn.id !== column.id){
                grid.sortCondition.sortColumn = column;
                grid.sortCondition.sortType = 'DESC';
            }
            else{
                if(grid.sortCondition.sortColumn === column){
                    grid._sortCondition.inverse(grid);
                }
            }
            grid.grid.find('th .sorted-asc, th .sorted-desc').removeClass('sorted-asc sorted-desc');
            if(grid.sortCondition.sortType === 'DESC'){
                element.addClass('sorted-desc');
            }
            else{
                element.addClass('sorted-asc');
            }
            return self;
        }
    },
    _animations:{
        rowBlinkAnimation: function(grid, data, callback){
            var self = this;
            var elements = grid.elements[data.id];
            var background = elements.tr.css('background');
            elements.tr.css('background', '#c63f31');
            elements.tr.transition({background: background });
//            formView.container.css({opacity: .1});
//            formView.divMain.css({scale: 1, rotateX: '-70deg', rotateY: '0deg', translate:'0%'});
//            formView.divMain.transition({scale: 1, rotateX: '0deg', rotateY: '0deg', translate:'0%'}, callback);
//            formView.container.transition({opacity: 1});
        }
    },
	showDataHidingAnimation: function(){
        var self = this;
        if(self.elements.tbody){
            self.boxUpAnimation.hide(self.elements.tbody);
        }
        return self;
    },
    _db: {
        initialize: function(grid){
            var socket = grid.getSocket();

            socket.on(grid.socketEvents.getGridDataDone, function(data){
                grid._db.getData_done(grid, data);
            });
        },
        getData: function(grid, options){
            var self = this;
            //var filter = grid.filterManager.getFilter();
            var data = {};
            var socket = grid.getSocket();
            var pagerFilter = grid.pager.getPagerFilter();
            data.pageIndex = pagerFilter.pageIndex;
            data.pageSize = pagerFilter.pageSize;
            var sort = grid.getSortCondition();
            data.orderByColumn = sort.sortColumn.id;
            data.orderByType = sort.sortType;
            data.filter = {};
//            console.log(data)
            grid.lastRequestTime = new Date();

            if(options){
                var requestId = crypto.getRandomValues(new Uint16Array(1))[0];
                data.requestId = requestId;
                socket.gridView.events[requestId] = options;
            }

            // socket.emit(grid.socketEvents.getGridData, {config:data});

            // console.log(grid.socketEvents.getGridData, {config:data});

            var url = grid.subModule.getAjaxUrl('getGridData');

            $.ajax({
                type: 'POST',
                data: {config:data},
                url: url,
            }).always(function (responseObj, status) {
                // console.log(grid.socketEvents.getGridData + '_Done', responseObj, status);
                grid._db.getData_done(grid, responseObj);
            });


			grid.showDataHidingAnimation();

            return self;
        },
        getData_done: function(grid, data){
            var self = this;
            if(data.success){
                //console.log(new Date() - grid.lastRequestTime);

                if(grid.subModule.parentDataRow && grid.subModule.parentDataRow.id){
                    var currentParentDataRowId = grid.subModule.parentDataRow.id;
                    if(data.result && data.result.parentDataRowId){
                        if(data.result.parentDataRowId != currentParentDataRowId){
                            return;
                        }
                    }
                }

                grid.data = {};
                grid.dataArr = [];
                if(data.result && data.result.data && data.result.data.length){
                    data.result.data.forEach(function(dataRow){
                        grid.data[dataRow.id] = dataRow;
                    });
                    grid.dataArr = data.result.data;
                }

                grid.subModule.set_latest_display_data(grid.dataArr, grid.data);
                //                console.log(data.result)
                var toRestoreChildWindows = [];
                if(grid.elements.tbody){
                    grid.elements.tbody.children('tr.inlineViewMode').each(function () {
                        toRestoreChildWindows.push({
                            rowId : $(this).prev().attr('id'),
                            childWindows : $(this).prev().data('childWindows')
                        });
                    }).detach();
                    grid.elements.tbody.remove();
                }
                var tbody = $(grid._creation.createTableBody(grid));
                grid.elements.tbody = tbody;

                if(grid.erp.deviceType == ERP.DEVICE_TYPES.PC){
                    grid.boxUpAnimation.initializeElement(tbody);
                }

                grid.elements.table.append(tbody);

                toRestoreChildWindows.forEach(function (obj) {
                    for(var key in obj.childWindows){
                        // console.log('---', '#' + obj.rowId, '.grid-data-item[data-id="'+ key +'"]');
                        setTimeout(function () {
                            tbody.children('#' + obj.rowId).find('.grid-data-item[data-id="'+ key +'"]')
                                .trigger('click');
                        }, 300);

                    }
                });

                if(grid.subModule.columnManager.hasFooterColumns){
                    grid.footerData = {
                        subTotal: data.result.subTotal,
                        grandTotal: data.result.grandTotal
                    };
                    grid.setFooterToNormalMode();
                    grid.setFooterData();
                }
                if(grid.erp.deviceType == ERP.DEVICE_TYPES.PC){
                    setTimeout(function(){
                        grid.boxUpAnimation.show(tbody)
                    }, 0);
                }

                grid.pager.updateUi(data.result.pager);
                if(data.requestId){
                    var options = grid.getSocket().gridView.events[data.requestId];
                    if(options){
                        options.callback(grid, options.options);
                    }
                }
            }
            else{
                grid.notifier.showReportableErrorNotification(data.errorMessage);
            }
            grid.subModule.buttonManager.rowSelectorChanged($(this));
        }
    },
    setConditionColorSetting: function(currentCondition, tr){
        var self = this;
        tr = $(tr);
        tr.data('currentCondition', currentCondition);
        switch (currentCondition.actionToTake){
            case "colBackColor":
            case "colForeColor":
            case "colTextShadow":
                var td = tr.find('[data-id="'+ currentCondition.column +'"]').closest('td');
                switch (currentCondition.actionToTake){
                    case "colBackColor":
                        td.css('background', currentCondition.colorChooser);
                        break;
                    case "colForeColor":
                        td.css('color', currentCondition.colorChooser);
                        break;
                    case "colTextShadow":
                        td.css('text-shadow', '1px 1px '+currentCondition.colorChooser);
                        break;
                }
                break;
            case "rowBackColor":
            case "rowForeColor":
            case "rowTextShadow":
                switch (currentCondition.actionToTake){
                    case "rowBackColor":
                        tr.css('background', currentCondition.colorChooser);
                        break;
                    case "rowForeColor":
                        tr.css('color', currentCondition.colorChooser);
                        break;
                    case "rowTextShadow":
                        tr.css('text-shadow', '1px 1px '+currentCondition.colorChooser);
                        break;
                }
                break;
        }
        return self;
    },
    _getSet:{
        resetForm: function(grid){
            var self = this;
            grid.container.find('input,textarea,select').val(null);
            return self;
        },
        getFormData: function(grid){
            var self = this;
            var columns = grid.columns;
            var formData = {};
            grid.forEach(function(column){
                if(column.disabled){
                    formData[column.id] = column.defaultValue;
                }
                else{
                    formData[column.id] = column.getGridElement(grid.mode).val();
                }
            });
            return formData;
        }
    },

    _creation : {
        createTableBody: function(grid){
            var self = this;
            var data = grid.data;
            var tbody;
            if(Object.keys(data).length){
                tbody = self.createDataRows(grid);
            }
            else{
                tbody = self.createNoDataMessageRow(grid);
            }
            return tbody;
        },
        createNoDataMessageRow: function(grid){
            var self = this;
            var tbody = document.createElement('tbody');
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.colSpan = grid.columnOrder.length+1;
            td.className = 'grid-no-data-message-row';
            var span = document.createElement('span');
            span.innerHTML = 'No Data To Display';
            td.appendChild(span);
            tr.appendChild(td);

            tbody.appendChild(tr);
            return tbody;
        },
        createDataRows: function(grid){
            var self = this;
            var subModule = grid.parentObject;
            var tbody = document.createElement('tbody');
            grid.elements.rows = {};
            grid.elements.rowSelectors = {};
            var conditionColorSettings;
            if(grid.subModule.conditionColorSetting && grid.subModule.conditionColorSetting.isEnabled){
                conditionColorSettings = grid.subModule.conditionColorSetting.conditionColorSetting;
            }
            grid.dataArr.forEach(function(dataRow){
                var currentConditions = [];
                if(conditionColorSettings){
                    for(var conditionCount =0; conditionCount< conditionColorSettings.length; conditionCount++){
                        if(subModule.checkCondition(conditionColorSettings[conditionCount], dataRow)){
                            currentConditions.push(conditionColorSettings[conditionCount]);
                        }
                    }
                }

                grid.elements.rows[dataRow['id']] = {};
                var tr = document.createElement('tr');
                tr.className = 'gridDataRow single_data_row_of_submodule';
                tr.appendChild(self.createRowSelectorDataRow(grid.elements.rows[dataRow['id']], dataRow));
                grid.columnOrder.forEach(function(columnId){
                    var column = subModule.columnManager.columns[columnId];
                    if(!column.gridView.isHidden){
                        var th = document.createElement('td');
                        var div = document.createElement('div');
                        th.setAttribute('data-help', column.helpMessage);
                        div.setAttribute('class', 'gridDataRowCellElement');
                        div.classList.add('text-align-' + (column.gridViewTextAlign || 'left'));
                        var element = column.createGridElement(dataRow);
                        column.setGridValue(element, dataRow);
                        var customElement = column.getOptionalGridElement(dataRow);
                        if(customElement){
                            div.appendChild(customElement.get(0));
                        }
                        div.appendChild(element.get(0));
                        th.appendChild(div);
                        tr.appendChild(th);

                        th.setAttribute('data-column-type', column.type);
                        if(column.controlledMaxWidthInGridView && column.controlledMaxWidthInGridView.isEnabled){
                            th.setAttribute('data-column-max-width', column.controlledMaxWidthInGridView.controlledMaxWidthInGridView);
                        }
                    }
                });
                if(currentConditions.length){
                    currentConditions.forEach(function(currentCondition){
                        grid.setConditionColorSetting(currentCondition, tr);
                    });
                }
                grid.elements.rows[dataRow['id']].tr = $(tr).attr({id: dataRow['id']});
                tbody.appendChild(tr);
            });
            return tbody;
        },
        createContainer: function(grid){
            var div = $(document.createElement('div')).attr({id: grid.id});
            return div;
        },
        createElements: function(grid){
            var self = this;

            var elements = {};
            grid.elements = elements;


            var container = self.createContainer(grid).addClass('grid-container');
            var divMain = $(document.createElement('div')).attr('id', 'div_main').addClass('grid-main');
            var pagerElement = grid.pager.getElement().get(0);
            var gridElement = self.createGrid(grid);

            var table = document.createElement('table');
            table.className = 'hundred-percent-x';
//            $(table).dragtable();
            var trPager = document.createElement('tr');
            trPager.className =  'pager';
            var tdPager = document.createElement('td');
            var trGrid = document.createElement('tr');
            var tdGrid = document.createElement('td');

            var columnChooserContainer = self.createColumnChooserContainer(grid);

            trPager.appendChild(tdPager);
            tdPager.appendChild(pagerElement);

            trGrid.appendChild(tdGrid);
            tdGrid.appendChild(gridElement);

            table.appendChild(trPager);
            table.appendChild(trGrid);

            divMain.append(table);
            container.append(divMain);
            $(document.body).append(columnChooserContainer);
            grid.container= container;
            grid.elements.divMain = divMain;
            grid.elements.gridElement = $(gridElement);
            grid.elements.columnChooserContainer = columnChooserContainer;
            grid.elements.container = container;

            return container;
        },

        createColumnChooserContainer: function(grid){
            var self = this;
            var container = $(document.createElement('dialog'))
                .attr(grid.constants.columnChooserContainer);

            var titleContainer = $(document.createElement('div'))
                .attr({class: "titleContainer"})
                .appendTo(container);
            var title = $(document.createElement('div'))
                .text('Export To Excel')
                .attr({class: "title"})
                .appendTo(titleContainer);

            var headingColumnContainer = $(document.createElement('div'))
                .attr({class: "headingColumnContainer"})
                .appendTo(container);
            var headingColumnText = $(document.createElement('div'))
                .attr({class: "headingColumnText"})
                .text('Excel Page title')
                .appendTo(headingColumnContainer);
            var headingColumnValue = $(document.createElement('input'))
                .attr({class: "headingColumnValue", type: "search"})
                .appendTo(headingColumnContainer);


            var columnChooserTitleContainer = $(document.createElement('div'))
                .attr({class: "columnChooserTitleContainer"})
                .appendTo(container);
            var columnChooserTitle = $(document.createElement('div'))
                .text('Select Columns')
                .attr({class: "columnChooserTitle"})
                .appendTo(columnChooserTitleContainer);

            var columnChooser = $(document.createElement('div'))
                .attr({class: "columnChooser"})
                .appendTo(container);

            grid.columnOrder.forEach(function(columnId){
                var column = grid.subModule.columnManager.columns[columnId]
                if(column.type == 'hyperLink'){
                    return;
                }
                var li = $(document.createElement('div'))
                    .data('id', column.id)
                    .appendTo(columnChooser);

                var chooserBox = $(document.createElement('input'))
                    .attr({type: "checkbox"})
                    .prop('checked', true)
                    .appendTo(li)
                var chooserValue = $(document.createElement('span'))

                    .text(column.displayName)
                    .appendTo(li)
            });


            var currentPageDiv = $(document.createElement('div'))
                .addClass('currentPageOnlyDiv')
                .appendTo(container);

            var currentPageSpan = $(document.createElement('span'))
                .text('Export Current Page Only ')
                .appendTo(currentPageDiv);

            var currentPage = $(document.createElement('input'))
                .attr({type: "checkbox"})
                .appendTo(currentPageDiv);

            var okButton = $(document.createElement('button'))
                .text('OK')
                .attr(grid.constants.columnChooserOkButton)
                .appendTo(container)

            var cancelButton = $(document.createElement('button'))
                .attr(grid.constants.columnChooserCancelButton)
                .text('Cancel')
                .appendTo(container);

            grid.elements.columnChooserExcelHeading = headingColumnValue;
            return container;
        },
        createGrid: function(grid){
            var self = this;
            var div = document.createElement('div');
            var table = document.createElement('table');
            table.id= 'grid';
            table.appendChild(self.createTableHead(grid));
            if(grid.subModule.columnManager.hasFooterColumns){
                table.appendChild(self.createTableFoot(grid));
            }

            grid.elements.table = $(table);
            div.appendChild(table);


            grid.elements.gridTable = $(table);
            return div;
        },

        createTableHead: function(grid){
            var self = this;
            var thead = document.createElement('thead');
            thead.className = 'grid-header'
            var tr = document.createElement('tr');
            var trGroup = document.createElement('tr');
            var subModule = grid.parentObject;
            var thTemp = document.createElement('td')
            //if(grid.hasRowSelector){
            trGroup.appendChild(thTemp);
            tr.appendChild(self.createRowSelectorHeader(grid));
            //}
            var thObj = {};
            var thGroupObj = {};
            subModule.columnManager.forEachColumn(function(column){
                var th = document.createElement('th');

                th.setAttribute('data-column-type', column.type);

                if(column.controlledMaxWidthInGridView && column.controlledMaxWidthInGridView.isEnabled) {
                    th.setAttribute('data-column-max-width', column.controlledMaxWidthInGridView.controlledMaxWidthInGridView);
                }

                        var thGroup = document.createElement('td');
                var div = document.createElement('div');

                var imageContainer;
                if(column.icon && column.icon.originalName){
                    var imagePath = 'iconsGenerated/' + grid.module.id + '/' + grid.subModule.id + '/' + column.id + '_' + column.icon.name;
                    imageContainer = document.createElement('img');
                    imageContainer.className = 'gridHeadImageContainer';
                    imageContainer.setAttribute('src', imagePath);
                }
                var span = document.createElement('span');
                span.className = 'gridHeadSpan';
                if(!column.disableSort){
                    div.className = 'grid-header-text-sortable';
                }

                if(column.gridView.groupId){
                    thGroup.setAttribute('class', column.gridView.groupId)
                }
                else{
                    th.className = 'accept';
                }
                th.setAttribute('data-help', column.helpMessage);
                div.setAttribute('data-column-id', column.id);
                if(grid.erp.deviceType === ERP.DEVICE_TYPES.MOBILE){
                    span.innerHTML = column.shortName;
                }
                else{
                    span.innerHTML = column.displayName;
                }
                imageContainer && div.appendChild(imageContainer);
                div.appendChild(span);

                th.appendChild(div);

//                th.gridViewIndex = column.gridView.index;
                thGroup.gridViewIndex = column.gridView.index;
                th.columnId = column.id;
                if(column.tooltip){
                    th.title  = column.tooltip || column.displayName;
                }
                thObj[column.gridView.index] = th;
                thGroupObj[column.gridView.index] = thGroup;
            },function(column){
               var ret = !column.gridView.isHidden;
                //column.hideInMobileInterfaceGridView && console.log(column, grid.erp.deviceType);
                if(grid.erp.deviceType === ERP.DEVICE_TYPES.MOBILE){
                    if(column.hideInMobileInterfaceGridView){
                        ret = false;
                    }
                }
                return ret;
            });
            var columnOrder = [];
//            var orderedThObj = {};
//            Object.keys(thObj).sort().forEach(function(arrItem, index){
//                orderedThObj[index] = thObj[arrItem];
//            });
//            var orderedThGroup = {};
//            Object.keys(thGroupObj).sort().forEach(function(arrItem, index){
//                orderedThGroup[index] = thGroupObj[arrItem];
//            });
//            thArr.sort(function(a, b){
//                return a.gridViewIndex > b.gridViewIndex;
//            });

//            thGroupArr.sort(function(a, b){
//                return a.gridViewIndex > b.gridViewIndex;
//            });
            for(var key in thGroupObj){
                var thHead = thGroupObj[key];
                trGroup.appendChild(thHead);
            }
            for(var key in thObj){
                var th = thObj[key];
                columnOrder.push(th.columnId);
                delete th.columnId;
                tr.appendChild(th);
            }
            if(subModule.id === 'hydraulicHoses'){
                console.log(thObj);
//                console.log(orderedThObj);
            }
//            thGroupArr.forEach(function(th){
//                delete th.gridViewIndex;
//                trGroup.appendChild(th);
//            });
//            thArr.forEach(function(th){
//                columnOrder.push(th.columnId);
//                delete th.columnId;
//                delete th.gridViewIndex;
//                tr.appendChild(th);
//            });
            grid.columnOrder = columnOrder;
            thead.appendChild(trGroup);
            thead.appendChild(tr);
            var groupCount = {};
            var groupFlag = {}
            if(subModule.gridView && subModule.gridView.groups){
                for(var key in subModule.gridView.groups){
                    var group = subModule.gridView.groups[key];
                    if(!groupCount[group.id]){
                        groupCount[group.id] = {};
                    }
                    if(!groupFlag[group.id]){
                        groupFlag[group.id] = {}
                    }
                    groupFlag[group.id].flagCount = 0;
                    groupCount[group.id].count = 0;
                    $(trGroup).children().each(function(){
                        var th = $(this);
                        if(th.attr('class') === group.id){
                            groupCount[group.id].count++
                        }
                    });
                }
            }


            if(subModule.gridView && subModule.gridView.groups){
                for(var key in subModule.gridView.groups){
                    var group = subModule.gridView.groups[key];
                    var trChildren = tr.childNodes;
                    var thCount = 0;
                    $(trGroup).children().each(function(){
                        var th = $(this);

                        if(th.attr('class') === group.id){
                            for(var i = 1; i<groupCount[group.id].count; i++){
                                var trNext = th.next();
                                if(trNext.attr('class') === group.id){
                                    trNext.remove();
                                }
                            }
                            if(groupFlag[group.id].flagCount == 0){
                                th.html(group.displayName);
                                th.attr('colspan', groupCount[group.id].count);
//                                th.css({background: "rgb(226, 225, 225)", "color": "rgb(75, 62, 62)", "font-weight": "bold","text-align": "center"/*, *//*"border-bottom": "3px solid rgb(170, 170, 170)"*/, width: 150*(groupCount[group.id].count)+"px"});
                                th.addClass('th-group');
                                groupFlag[group.id].flagCount++;
                            }
                            else{
                                th.remove();
                            }
                        }
                    });
                }
            }
            return thead;
        },
        createTableFoot: function(grid){
            var self = this;

            var tfoot = document.createElement('tfoot');
            tfoot.appendChild(self.createTableFootSubTotal(grid));
            tfoot.appendChild(self.createTableFootGrandTotal(grid));

            return tfoot;
        },
        createTableFootSubTotal: function(grid){
            var self = this;
            var tr = document.createElement('tr');
            var th = document.createElement('th');
            var div = document.createElement('div');
            div.innerHTML = 'S.Total';
            th.appendChild(div);
            tr.appendChild(th);

            grid.columnOrder.forEach(function(columnId){
                var column = grid.subModule.columnManager.columns[columnId];
                var th = document.createElement('th');
                var div = document.createElement('div');
                div.setAttribute('data-column-id', column.id);
                if(column.typeSpecific && column.typeSpecific.showTotal){
                    div.innerHTML = '...';
                }
                th.appendChild(div);
                tr.appendChild(th);
                column.elements.divGridFooterSubTotal = $(div);
            });
            return tr;
        },
        createTableFootGrandTotal: function(grid){
            var self = this;
            var tr = document.createElement('tr');
            var th = document.createElement('th');
            var div = document.createElement('div');
            div.innerHTML = 'G.Total';
            th.appendChild(div);
            tr.appendChild(th);

            grid.columnOrder.forEach(function(columnId){
                var column = grid.subModule.columnManager.columns[columnId];
                var th = document.createElement('th');
                var div = document.createElement('div');
                div.setAttribute('data-column-id', column.id);
                if(column.typeSpecific && column.typeSpecific.showTotal){
                    div.innerHTML = '...';
                }
                th.appendChild(div);
                tr.appendChild(th);
                column.elements.divGridFooterGrandTotal = $(div);
            });
            return tr;
        },
        createRowSelectorHeader: function(grid){
            var self = this;
            var th = document.createElement('th');

            var span = document.createElement('div');
            span.className = 'grid-header-text-sortable';
            span.setAttribute('data-column-id', 'id');
            var chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.className = 'grid-row-selector-all';
            grid.elements.rowSelectorAll = $(chk);
            span.appendChild(chk);
            th.appendChild(span);
            return th;
        },
        createRowSelectorDataRow: function(obj, dataRow){
            var self = this;
            var th = document.createElement('td');
            var chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.setAttribute('data-id', dataRow.id);
            chk.className = 'grid-row-selector';
            chk.tabIndex = -1;
            obj.rowSelector = $(chk);

            th.appendChild(chk);
            return th;
        }
    },
    setToReArrangeMode: function(buttonManager){
        var self = this;
        self.gridIndexUpdated = false;
        buttonManager.contextMenu.disabled = true;
        self.elements.gridTable.find('.grid-header').on('mousedown.expose', function(){
            self.elements.gridTable.addClass('change-grid-data-color');
            self.elements.gridTable.parent().css('width', '95%');
            self.elements.gridTable.find('input[type=checkbox]').hide();
        });


//        self.elements.gridTable.find('.grid-header').on('mouseup.expose', function(){
//
//
//        });
        self.elements.gridTable.dragtable({
            dragaccept:'.accept',
            persistState: function(){
                self.gridIndexUpdated = true;
                self.elements.gridTable.removeClass('change-grid-data-color');
                self.elements.gridTable.parent().css('width', '');
                self.elements.gridTable.find('input[type=checkbox]').show();
            }
        });
        self.elements.gridTable.dragtable('enable');
        self.elements.gridTable.expose();
        $(document.body).one('expose:overlay:removed', function(){
            if(self.gridIndexUpdated){
                self.saveGridViewArrangementOrder();
            }
            self.setToNormalMode(buttonManager);
        });
        return self;
    },
    saveGridViewArrangementOrder: function(){
        var self = this;

        self.gridOrderConfig = {};
        self.columnOrder = [];
        var thArr = self.elements.gridTable.find('thead').find('th').eq(0).nextAll();
        var gridViewIndex = 0;
        var columns = self.subModule.columnManager.columns;
        var columnConfigs = self.subModule.columnManager.config;
        thArr.each(function(){
            var th = $(this);
            var columnId = th.children().attr('data-column-id');
            self.gridOrderConfig[columnId] = {
                id: columnId,
                index: gridViewIndex
            }
            self.columnOrder.push(columnId);
            columns[columnId].gridView.index = gridViewIndex;
            columnConfigs[columnId].gridView.index = gridViewIndex;
            gridViewIndex++;
        });

        self.erp.saveGridOrder(self.subModule, self.gridOrderConfig);
        return self;
    },
    setToNormalMode: function(buttonManager){
        var self = this;
        buttonManager.contextMenu.disabled = false;
        self.elements.gridTable.find('.grid-header').off('mousedown.expose');
        self.elements.gridTable.dragtable('destroy');

        self.elements.gridTable.removeClass('change-grid-data-color');
        self.elements.gridTable.parent().css('width', '');
        self.elements.gridTable.find('input[type=checkbox]').show();
        return self;
    },
    _events   : {
    },
    _ui       : {
        resetUi: function(grid){
            var self = this;
            grid._ui.resetFormUi(grid);
            grid._getSet.resetForm(grid);
            return self;
        },
        resetFormUi: function(grid){
            var self = this;
            grid.container.find('.formview-column-holder').css('border','');
            grid.validationManager.removeAll();
            return self;
        }
    },
    exportGridToExcel: function(excelconfig){
        var self = this;

        var config = self.subModule.filterManager.getFilterValuesForAPI();

        config.pageSize = self.pager.totalRows;
        if(excelconfig.currentPage){
            config.pageSize = self.pager.pageSize;
            config.pageIndex = self.pager.selectedPageIndex;
        }
        config.orderByColumn = self.pager.orderByColumn;
        config.orderByType = self.pager.orderByType;

        if(self.subModule.parentDataRow){
            config.parentDataRow = self.subModule.parentDataRow;
            config.parentFilterCondition = self.subModule.parentItem.typeSpecific.dataSource.filterConditions[0];
        }

        self.subModule.getPagedData(config, function(data){

            var htmlArr = [];

            var row = [];
            var totalHeadings = 0;
            excelconfig.selectedColumnArr.forEach(function(columnId) {
                totalHeadings++;
                var column = self.subModule.columnManager.columns[columnId];
                if (column.type == 'hyperLink') {
                    return;
                }
                row.push('<th style="padding-left:20px; padding-right:20px; font-size:16px;">'+ column.displayName +'</th>')
            });

            if(excelconfig.excelHeading){
                htmlArr.push('<tr><td colspan="'+ totalHeadings +'" align="center" style="font-size:30px;">'+ excelconfig.excelHeading  +'</td></tr>');
            }

            htmlArr.push('<tr>'+ row.join(' ') + '</tr>');


            data.data.forEach(function(dataRow){
                row = [];

                excelconfig.selectedColumnArr.forEach(function(columnId){
                    var column = self.subModule.columnManager.columns[columnId];

                    if(column.type == 'hyperLink'){
                        return;
                    }

                    var value = column.parseDisplayValue(dataRow);
                    row.push('<td style="font-size:13px;"> '+ value +' </td>')
                });
                htmlArr.push('<tr>'+ row.join(' ') + '</tr>');
            });
            var grantTotalRow = [];
            if(data.grandTotal){
                excelconfig.selectedColumnArr.forEach(function(columnId){

                    var grantTotalRowValue = ' ';
                    if(data.grandTotal[columnId]){
                        grantTotalRowValue = data.grandTotal[columnId]
                    }
                    grantTotalRow.push('<td style="font-size:13px; font-weight: bold;"> '+ grantTotalRowValue +' </td>');

                });
                htmlArr.push('<tr>'+ grantTotalRow.join(' ') + '</tr>');
            }

            self.saveTableDataAsExcel(htmlArr.join('\n'), excelconfig.excelHeading);
        });
        return self;
    },
    saveTableDataAsExcel: function(tableHTML, fileName){
        var self = this;
		if(!fileName){
			fileName = self.subModule.displayName + ' ' +moment().format('DD-MMM-YYYY hh:mm:ss a');
		}
		fileName += '.xls';
        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }

        var options = {
            worksheet: self.subModule.displayName || 'Worksheet', table: tableHTML
        }
        var blob = new Blob([format(template, options)],
            {type: uri});
        saveAs( blob, fileName );
        return self;
    }
};

Grid.prototype.socketEvents = {
    getGridData: "getGridData",
    getGridDataDone: "getGridDataDone"
};
