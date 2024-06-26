/**
 * Created by Akhil Sekharan on 1/8/14.
 */

function SimpleDataTable(config, parentObject) {
    var self = this;
    self.config = config;
    self.mode = self.config.mode;
    self.parentObject = parentObject;
    self.parentColumn = parentObject;
    self.parentFormView = config.parentFormView;
    self.parentSubModule = config.parentSubModule;
    self.column = parentObject;
    self.subModule = config.subModule;
    self.erp = self.parentSubModule.erp;
    self.initialize();
    self.notifier = new Notifier({
        container: $(document.body),
        subModule: self.parentSubModule,
        bugReportManager: self.erp.bugReportManager
    });
    return self;
}

SimpleDataTable.prototype = {
    constants: {
        container: {
            "class": "simpleDataTable-container"
        },
        btnRemove:{
            "class": "simpleDataTable-btnRemove"
        },
        btnEdit:{
            "class": "simpleDataTable-btnEdit"
        }
    },
    initialize: function () {
        var self = this;
        self.userConfiguration = self.erp.getUserSetting(self.subModule.id + '_'+ self.column.id + '_simpleDataTableConfiguration') || {};
        self.createElements().bindEvents();
        self.onChangeEventHandlers = {
            create: [],
            edit: []
        };
        self.simpleDataTableRows = {};
        return self;
    },

    createElements: function () {
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    forEachColumn: function(eachFunction, filterFunction){
        var self = this;
        for(var key in self.config.columns){
            var column = self.config.columns[key];
            if(filterFunction){
                if(filterFunction(column)){
                    eachFunction.apply(column, [column]);
                }
            }
            else{
                eachFunction.apply(column, [column]);
            }
        }
        return self;
    },
    bindEvents: function () {
        var self = this;
        self.elements.btnAdd.on('click', function(){
            self.addNewRow();
        });
        self.elements.table.on('click', '.'+ self.constants.btnEdit.class, function(){
            var btn = $(this);
            var tr = btn.closest('tr');
            self.config.onEdit.apply(self, [tr.data('dataRow'), tr]);
        });
        self.elements.table.on('click', '.'+ self.constants.btnRemove.class, function(){
            var btn = $(this);
            btn.closest('tr.simpleDataTableRowContainer').remove();
            self.updateFooterRow();
        });
//        self.elements.table.on('keydown.simpleDataTable', 'input[type="text"]', function(eve){
//            if(eve.keyCode == 13){
//                eve.preventDefault();
//                eve.stopPropagation();
//                self.addNewRow();
//            }
//        });
        self.elements.table.on('keydown.simpleDataTable', '[id][class]input[type="text"],[id][class]input[type="number"]', function(eve){
            self.handleKeyDown($(this), eve);
        });
        return self;
    },
    handleKeyDown: function(element, eve){
        var self = this;
        var stop = false;
        switch (eve.keyCode){
            case ERP.KEY_CODES.ENTER:
                var nextRow = element.closest('.simpleDataTableRowContainer').next('.simpleDataTableRowContainer');
                if(nextRow.length){
                    nextRow.find('#'+element.attr('id')).focus();
                }
                else{
                    self.addNewRow();
                    nextRow = element.closest('.simpleDataTableRowContainer').next('.simpleDataTableRowContainer');
                    nextRow.find('#'+element.attr('id')).focus();
                }
                break;
            case ERP.KEY_CODES.ESC:
                var prevRow = element.closest('.simpleDataTableRowContainer').prev('.simpleDataTableRowContainer');
                if(prevRow.length){
                    prevRow.find('#'+element.attr('id')).focus();
                }
                if(!self.parentColumn.validations.mandatory){
                    element.closest('tr.simpleDataTableRowContainer').remove();
                }
                break;
            case ERP.KEY_CODES.UP:
                var prevRow = element.closest('.simpleDataTableRowContainer').prev('.simpleDataTableRowContainer');
                if(prevRow.length){
                    prevRow.find('#'+element.attr('id')).focus();
                }
                break;
            case ERP.KEY_CODES.DOWN:
                var nextRow = element.closest('.simpleDataTableRowContainer').next('.simpleDataTableRowContainer');
                if(nextRow.length){
                    nextRow.find('#'+element.attr('id')).focus();
                }
                break;
            case ERP.KEY_CODES.LEFT:
                var ret = true;
                if(element.get(0).selectionStart == 0){
                    ret = false;
                }
                if(!ret) {
                    element.closest('td').prevAll().each(function () {
                        var elements = $(this).find('.simpleDataRowFormElement.editable');
                        if (elements.length) {
                            elements.focus();
                            return false;
                        }
                    });
                    stop = true;
                }
                break;
            case ERP.KEY_CODES.RIGHT:
                var ret = true;
                if(element.get(0).selectionStart == element.val().length){
                    ret = false;
                }
                if(!ret) {
                    element.closest('td').nextAll().each(function () {
                        var elements = $(this).find('.simpleDataRowFormElement.editable');
                        if (elements.length) {
                            elements.focus();
                            return false;
                        }
                    });
                    stop = true;
                }
                break;
        }
        if(stop){
            eve.preventDefault();
            eve.stopPropagation();
        }
    },
    addOnChangeHandler: function (mode, eventHandler, childColumn) {
        var self = this;
        self.onChangeEventHandlers[mode].push({
            handler: eventHandler,
            column: childColumn
        });
        return self;
    },
    itemsChanged: function () {
        var self = this;
        self.onChangeEventHandlers[self.mode].forEach(function(handlerObj){
            handlerObj.handler.apply(self, [self, {childColumn: handlerObj.column, mode: self.mode}])
        });
        self.updateFooterRow();
        return self;
    },
    deleteLastRow: function(){
        var self=  this;
        var rowCount = self.container.find('.simpleDataTableRowContainer').length;
        var lastRowContainer = self.container.find('.simpleDataTableRowContainer')[rowCount-1];
        var lastRowId = $(lastRowContainer).attr('id');
        lastRowContainer.remove();
        delete self.simpleDataTableRows[lastRowId];
        return self;
    },
    clearUniqueColumnValue: function(simpleDataTableRow){
        var self = this;
        self.forEachColumn(function(column){
            var value = column.getSimpleDataTableRowValue(simpleDataTableRow)
            if(value){
                column.clearUniqueColumnValuesInSubForm(value);
            }
            self.refreshUniqueColumnElementsInSubForm(column)

        }, function(column){
            return column.hasUniqueValueInSubForm
        })
    },
    refreshUniqueColumnElementsInSubForm: function(column){
        var self = this;
        self.forEachSimpleDataTableRow(function(simpleDataTableRow){
            if(!column.getSimpleDataTableRowValue(simpleDataTableRow)){
                column.setSimpleDataTableRowLookupData(
                    (simpleDataTableRow[column.id] && simpleDataTableRow[column.id]
                        .lookUpDataBackUp) || column.lookUpDataBackUp, simpleDataTableRow)
            }
        })
    },
    addNewRow: function(){
        var self = this;
        self.config.formViewConfig.subModule = self.config.subModule;
        self.config.formViewConfig.mode = self.config.mode;
        self.config.formViewConfig.parentFormView = self.parentFormView;
        self.config.formViewConfig.parentSubModule = self.parentSubModule;
        self.config.formViewConfig.buttons ={
            create: {
                remove: {
                    id: "remove",
                    displayName: "X",
                    onClick: function(simpleDataTableRow){
                        self.clearUniqueColumnValue(simpleDataTableRow)
                        simpleDataTableRow.destroy();
                        delete self.simpleDataTableRows[simpleDataTableRow.id];
                        self.itemsChanged();
                    }
                }
            }
        }
        self.config.formViewConfig.onChange = function(simpleDataTableRow, options){
            self.itemsChanged();
        }
        var simpleDataTableRow = new SimpleDataTableRow(self.config.formViewConfig, self);
        self.simpleDataTableRows[simpleDataTableRow.id] = simpleDataTableRow;
        self.elements.table.append(simpleDataTableRow.container);
        simpleDataTableRow.show(self.config.mode, null, null, self.config.parentSubModule.buttonManager.getDefaultButton('create'), {
            onBeforeInsert: function(formData, formTextData, targetFormViewObj){

            },
//            executeBeforeSqlOnly: column.typeSpecific.executeBeforeSqlOfTargetButton,
            ignoreParentCondition: true,
            parentSubModule: self.config.subModule,
            parentFormView: self.config.parentFormView
        });

        return self;
    },
    updateFooterRow: function(){
        var self = this;
        var arr = self.getFormData();
        var footerDataRow = {};
        var hasFooterColumns = false;
        arr.forEach(function(dataRow){
            self.forEachColumn(function(column){
                hasFooterColumns = true;
                var value;
                if(!footerDataRow[column.id]){
                    footerDataRow[column.id] = 0;
                }
                if(column.type == Column.COLUMN_TYPES.INTEGER){
                    value = parseInt(dataRow[column.id]);
                }
                else if(column.type == Column.COLUMN_TYPES.DECIMAL){
                    value = parseFloat(dataRow[column.id]);
                }
				else if(column.type == Column.COLUMN_TYPES.LOOKUP_TEXTBOX){
                    value = parseFloat(dataRow[column.id]);
                }
                if(!isNaN(value)){
                    footerDataRow[column.id] += value;
                }
            }, function(column){
                return column.typeSpecific.showTotal;
            });
        });
        var trFooter = self._creation.createFooterRow(self, footerDataRow);

        self.elements.table.find('tfoot').remove();
        var tFoot = $(document.createElement('tfoot'));
        tFoot.append(trFooter);
        self.elements.table.append(tFoot);
        return self;
    },
    forEachSimpleDataTableRow: function(eachFunction, filterFunction){
        var self = this;
        var count = 0;
        for(var key in self.simpleDataTableRows){
            var simpleDataTableRow = self.simpleDataTableRows[key];
            if(filterFunction){
                if(filterFunction(simpleDataTableRow)){
                    eachFunction.apply(simpleDataTableRow, [simpleDataTableRow, count++]);
                }
            }
            else{
                eachFunction.apply(simpleDataTableRow, [simpleDataTableRow, count++]);
            }
        }
        return self;
    },
    validate: function(){
        var self = this;
        var ret = true;
        self.forEachSimpleDataTableRow(function(simpleDataTableRow){
            if(ret && !simpleDataTableRow.validate(true)){
                ret = false;
            }
        });
        return ret;
    },
    getFormData: function(){
        var self = this;
        var arr = [];
        self.forEachSimpleDataTableRow(function(simpleDataTableRow){
            var dataRow = simpleDataTableRow.getFormData();
            dataRow._simpleDataTableRowId = simpleDataTableRow.id;
            arr.push(dataRow);
        });
        if(arr.indexOf(null) != -1){
            return null;
        }
        else{
            return arr;
        }
    },
    getFormDataDepreceated: function(getFormDataCallBack){
        var self = this;
        var arr = [];
        self.forEachSimpleDataTableRow(function(simpleDataTableRow){
            simpleDataTableRow.save(function(formData, simpleDataTableRow){
                arr.push(formData);
                if(arr.length == Object.keys(self.simpleDataTableRows).length){
                    if(arr.indexOf(null) != -1){
                        getFormDataCallBack(null);
                    }
                    else{
                        getFormDataCallBack(arr);
                    }
                }
            });
        });
    },
    showErrorMessage: function(data){
        var self = this;
        self.simpleDataTableRows[data.simpleDataTableRowId]
            .container.addClass('error');
        self.notifier.showReportableErrorNotification(data.errorMessage)
        return self;
    },
    clearErrorMessage: function(){
        var self = this;
        self.forEachSimpleDataTableRow(function(simpleDataTableRow){
            simpleDataTableRow.container.removeClass('error');
        });
        return self;
    },
    clear: function(){
        var self = this;
        self.forEachSimpleDataTableRow(function(simpleDataTableRow){
            simpleDataTableRow.destroy();
            delete self.simpleDataTableRows[simpleDataTableRow.id]
        });
        //Need to check and make sure if this is the correct position for addChildRowOnCreate
        if(self.parentColumn.typeSpecific.addChildRowOnCreate){
            self.addNewRow();
        }
        self.updateFooterRow();
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
    _creation:{
        createElements: function(simpleDataTable){
            var self = this;
            simpleDataTable.elements = {};
            var table = document.createElement('table');
            table.id= 'simpleDataTable';
            table.appendChild(self.createTableHead(simpleDataTable));
            table = $(table);
            table.attr(simpleDataTable.constants.container);
            simpleDataTable.elements.table = table;
            simpleDataTable.elements.container = table;
            simpleDataTable.container = table;
            return simpleDataTable;
        },
        createTableHead: function(simpleDataTable){
            var self = this;
            var mode = 'create';
            var thead = document.createElement('thead');
            var tr = document.createElement('tr');
            var arr = [];
            var index= 0;
            simpleDataTable.forEachColumn(function(column){
                var th = document.createElement('th');
                th.setAttribute('data-column-id', column.id);
                if(simpleDataTable.userConfiguration.columnWidths && simpleDataTable.userConfiguration.columnWidths[column.id]){
                    th.style.width = simpleDataTable.userConfiguration.columnWidths[column.id] + 'px';
                }

                var div = document.createElement('div');
                div.setAttribute('data-column-id', column.id);
                div.innerHTML = column.displayName;
                if(column.validations.mandatory){
                    div.className = 'mandatory';
                }
                th.appendChild(div);
                th.columnId = column.id;
                if(column.tooltip){
                    th.title  = column.tooltip;
                }
//                tr.appendChild(th);
                if(column.formView[mode] && !column.formView[mode].isHidden){
                    if(!arr[column.formView[mode].position.row]){
                        arr[column.formView[mode].position.row] = {};
                    }
                    arr[column.formView[mode].position.row][column.formView[mode].position.col] = th;
                }
                index++;
            });



            arr.forEach(function(childArr){
                if(childArr[0]){
                    tr.appendChild(childArr[0]);
                }
                if(childArr[1]){
                    tr.appendChild(childArr[1]);
                }
				if(childArr[2]){
                    tr.appendChild(childArr[2]);
                }
                if(childArr[3]){
                    tr.appendChild(childArr[3]);
                }
                if(childArr[4]){
                    tr.appendChild(childArr[4]);
                }
                if(childArr[5]){
                    tr.appendChild(childArr[5]);
                }
            });


            simpleDataTable.forEachColumn(function(column) {
                if(!column.mergedColumnsInSubForm){
                    return;
                }

                if(!column.mergedColumnsInSubForm.isEnabled){
                    return;
                }
//                console.log('mergedColumnsInSubForm for parent : '+ column.id, column.mergedColumnsInSubForm.mergedColumnsInSubForm.config)
                var columnsToMerge = column.mergedColumnsInSubForm.mergedColumnsInSubForm.config;

                columnsToMerge.forEach(function(obj){
                    var th = tr.querySelector('th[data-column-id="'+ obj.value +'"]');
                    if(th){
                        th.style.display = 'none';
                    }
                })

            });


            var btnAdd = $(document.createElement('div'))
                .addClass('simpleDataTableAddButton');
            var th = document.createElement('th');
            th.style.width = '50px';
            th.appendChild(btnAdd.get(0));
            tr.appendChild(th);
            thead.appendChild(tr);
            simpleDataTable.elements.btnAdd = btnAdd;
            return thead;
        },
        createFooterRow: function(simpleDataTable, footerRow){
            var self = this;
            var tr = document.createElement('tr');

            var arr = [];
            var index= 0;
            simpleDataTable.forEachColumn(function(column){
                var th = document.createElement('th');
				th.setAttribute('data-column-id', column.id);
				
                var div = document.createElement('div');
                div.setAttribute('data-column-id', column.id);
                if(footerRow[column.id] == undefined){
                    div.innerHTML = '';
                }
                else{
///////////////////////////////////////////////////////////////
					if(column.typeSpecific.decimalPoint && column.typeSpecific.decimalPoint.decimalPoint){
                        var decimalPointsToRound = parseInt(column.typeSpecific.decimalPoint.decimalPoint)
                    }
                    var columnValueSum = footerRow[column.id].toFixed(decimalPointsToRound);
                    div.innerHTML = columnValueSum;
///////////////////////////////////////////////////////////////
				//                    div.innerHTML = footerRow[column.id];
                }
                th.appendChild(div);
                th.columnId = column.id;
                if(column.tooltip){
                    th.title  = column.tooltip;
                }
                if(column.formView[simpleDataTable.mode] && !column.formView[simpleDataTable.mode].isHidden){
                    if(!arr[column.formView[simpleDataTable.mode].position.row]){
                        arr[column.formView[simpleDataTable.mode].position.row] = {};
                    }
                    arr[column.formView[simpleDataTable.mode].position.row][column.formView[simpleDataTable.mode].position.col] = th;
                }
                index++;
            });
            arr.forEach(function(childObj){
                for(var childObjkey in childObj){

                    if(childObj[childObjkey]){
                        tr.appendChild(childObj[childObjkey]);
                    }
                }
            });
            tr.appendChild(document.createElement('th'));
			
			
			simpleDataTable.forEachColumn(function(column) {
                if(!column.mergedColumnsInSubForm){
                    return;
                }

                if(!column.mergedColumnsInSubForm.isEnabled){
                    return;
                }
//                console.log('mergedColumnsInSubForm for parent : '+ column.id, column.mergedColumnsInSubForm.mergedColumnsInSubForm.config)
                var columnsToMerge = column.mergedColumnsInSubForm.mergedColumnsInSubForm.config;

                columnsToMerge.forEach(function(obj){
                    var th = tr.querySelector('th[data-column-id="'+ obj.value +'"]');
                    if(th){
                        th.style.display = 'none';
                    }
                })

            });
			
            return tr;
        },
        createDataRow: function(simpleDataTable, dataRow, dataRowText){
            var self = this;
            var tr = document.createElement('tr');
            $(tr).data('dataRow', dataRow);
            if(!dataRowText){
                dataRow = dataRowText;
            }
            simpleDataTable.forEachColumn(function(column){
                var td = document.createElement('td');
                var div = document.createElement('div');
                div.setAttribute('data-column-id', column.id);
                var value = dataRowText[column.id];
                if(value != undefined){
                    div.innerHTML = value;
                }
                td.appendChild(div);
                if(column.tooltip){
                    td.title  = column.tooltip;
                }
                tr.appendChild(td);
            });
            var btnEdit = self.createButton(simpleDataTable, 'Edit').attr(simpleDataTable.constants.btnEdit);
            var btnRemove = self.createButton(simpleDataTable, 'Remove').attr(simpleDataTable.constants.btnRemove);

            var td = document.createElement('td');
            td.appendChild(btnEdit.get(0))
            td.appendChild(btnRemove.get(0))
            tr.appendChild(td);
            return tr;
        },
        createButton: function(simpleDataTable, text){
            var button = $(document.createElement('button'))
                .text(text);
            return button;
        }
    },
    setToReSizeMode: function(){
        var self = this;
        var columnResized = false;
        var tr = self.container.find('thead tr');
        tr.children().resizable({
            stop: function(){
                columnResized = true;
            },
            handles: 'e'
        });
        tr.children().resizable('enable');
        tr.expose();
        self.container.addClass('resizeMode');
        $(document.body).one('expose:overlay:removed', function(){
            if(columnResized){
                self.saveSimpleDataTableConfiguration();
            }
            self.setToNormalMode();
        });
        return self;
    },
    saveSimpleDataTableConfiguration: function(){
        var self = this;
        var obj = {};
        self.container.find('thead tr th').each(function(){
            var element = $(this);
            obj[element.children('[data-column-id]').attr('data-column-id')] = element.width();
        });
        self.erp.saveSimpleDataTableConfiguration(self.subModule, self.column, {
            columnWidths: obj
        });
        return self;
    },
    setToNormalMode: function(){
        var self = this;
        self.container.removeClass('resizeMode');
        self.container.find('thead tr th').resizable('destroy');
        return self;
    }
}
