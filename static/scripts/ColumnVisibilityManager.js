/**
 * Created by Jithu Jose on 24/12/13.
 */

function ColumnVisibilityManager(config, data, parentObject){
    var self = this;
    self.config = config;
    self.data = data;
    self.parentObject = parentObject;
    self.initialize();
    return self;
}

ColumnVisibilityManager.prototype = {
    constants: {
        container: {
            class: "column-visibility-manager"
        },

        tableContainer: {
            class: "column-visibility-table-container"
        },

        table: {
            class: "column-visibility-table"
        },

        titleContainer: {
            class: "title-container-column"
        },

        titleNameContainer: {
            class: "title-name-container"
        },

        titleName: {
            class: "title-name"
        },

        selectorContainer: {
            class: "selector-container"
        },

        selectorTableContainer: {
            class: "selector-table-container"
        },

        selectorTable: {
            class: "selector-table"
        },

        moduleSelect: {
            class: "module-select"
        },

        subModuleSelect: {
            class: "subModule-select"
        },

        columnSelect: {
            class: "column-select"
        },

        contentContainer: {
            class: "content-container"
        },

        contentTableContainer: {
            class: "content-table-container"
        },

        columnContentTable: {
            class: "column-content-table"
        },

        columnTableColumn: {
            class: "column-table-column"
        },
        filterTableColumn: {
            class: "filter-table-column"
        },

        buttonContentTable: {
            class: "button-content-table"
        },

        filterContentTable: {
            class: "filter-content-table"
        },

        buttonTableColumn: {
            class: "button-table-column"
        },

        buttonContainer: {
            class: "button-container"
        },

        buttonElement: {
            class: "button-element"
        },

        saveButton: {
            class: "save-button"
        },

        cancelButton: {
            class: "cancel-button"
        },

        applyButton: {
            class: "apply-button"
        }
    },

    initialize: function(){
        var self = this;
        self.elements = {};

        self.createElements().bindEvents().createConfig();
        self.elements.moduleSelect.trigger('change');
        return self;
    },

    createElements: function(){
        var self = this;
        self._creation.createElements(self)
        return self;
    },

    _creation: {
        createElements: function(columnVisibilityManager){
            var self = this;
//            var container = self.createContainer(columnVisibilityManager);
//            columnVisibilityManager.container = container;

            var tableContainer = self.createTableContainer(columnVisibilityManager);
            columnVisibilityManager.container = tableContainer;
//            tableContainer.draggable();
            columnVisibilityManager.elements.tableContainer = tableContainer;

            var table = self.createTable(columnVisibilityManager);
            table.appendTo(tableContainer);
            columnVisibilityManager.elements.table = table;

            return self;
        },

        createContainer: function(columnVisibilityManager){
            var self = this;
            var container = $(document.createElement('div')).attr(columnVisibilityManager.constants.container);
            return container;
        },

        createTableContainer: function(columnVisibilityManager){
            var self = this;
            var container = $(document.createElement('div')).attr(columnVisibilityManager.constants.tableContainer);
            return container;
        },

        createTable: function(columnVisibilityManager){
            var self = this;
            var table = $(document.createElement('table')).attr(columnVisibilityManager.constants.table);
            var titleTr = $(document.createElement('tr')).appendTo(table);
            var titleTd = $(document.createElement('td')).appendTo(titleTr);
            var titleContainer = self.createTitleContainer(columnVisibilityManager);
            titleContainer.appendTo(titleTd);

            var contentTr = $(document.createElement('tr')).appendTo(table);
            var contentTd = $(document.createElement('td')).appendTo(contentTr);
            var contentContainer = self.createContentContainer(columnVisibilityManager);
            contentContainer.appendTo(contentTd);

            var selectTr = $(document.createElement('tr')).appendTo(table);
            var selectTd = $(document.createElement('td')).appendTo(selectTr);
            var selectorContainer = self.createSelectorContainer(columnVisibilityManager);
            selectorContainer.appendTo(selectTd);

//            var buttonTr = $(document.createElement('tr')).appendTo(table);
//            var buttonTd = $(document.createElement('td')).appendTo(buttonTr);
//            var buttonContainer = self.createButtonContainer(columnVisibilityManager);
//            buttonContainer.appendTo(buttonTd);

            return table;
        },

        createTitleContainer: function(columnVisibilityManager){
            var self = this;
            var container = $(document.createElement('div')).attr(columnVisibilityManager.constants.titleContainer);
            var titleNameContainer = $(document.createElement('div')).attr(columnVisibilityManager.constants.titleNameContainer);
            titleNameContainer.appendTo(container);
            var titleName = $(document.createElement('span')).attr(columnVisibilityManager.constants.titleName);
            titleName.appendTo(titleNameContainer).text(columnVisibilityManager.config.displayName);

            columnVisibilityManager.elements.titleContainer = container
            return container;
        },
        createSelectorContainer: function(columnVisibilityManager){
            var self = this;
            var container = $(document.createElement('div')).attr(columnVisibilityManager.constants.selectorContainer);
            var tableContainer = $(document.createElement('div')).attr(columnVisibilityManager.constants.selectorTableContainer).appendTo(container)
            var selectorTable = self.createSelectorTable(columnVisibilityManager);
            selectorTable.appendTo(tableContainer);
            return container;
        },
        createSelectorTable: function(columnVisibilityManager){
            var self =this;
            var table = $(document.createElement('table')).attr(columnVisibilityManager.constants.selectorTable);
            var tr = $(document.createElement('tr')).appendTo(table);
            var tdModule = $(document.createElement('td')).appendTo(tr);
            var tdSubModule = $(document.createElement('td')).appendTo(tr);
            var tdColumn = $(document.createElement('td')).appendTo(tr);

            var moduleSelect = $(document.createElement('select')).attr(columnVisibilityManager.constants.moduleSelect).appendTo(tdModule);
            var subModuleSelect = $(document.createElement('select')).attr(columnVisibilityManager.constants.subModuleSelect).appendTo(tdSubModule);
            var columnSelect = $(document.createElement('select')).attr(columnVisibilityManager.constants.columnSelect).appendTo(tdColumn);

            for(var key in columnVisibilityManager.data.modules){
                var module = columnVisibilityManager.data.modules[key];
                var moduleOption = $(document.createElement('option')).text(module.displayName).val(module.id);
                moduleOption.appendTo(moduleSelect);
            }

            moduleSelect.on('change', function(){
                subModuleSelect.empty();
                var selectedModule = moduleSelect.val();
                for(var key in columnVisibilityManager.data.modules[selectedModule].subModules){
                    var subModule = columnVisibilityManager.data.modules[selectedModule].subModules[key];
                    var subModuleOption = $(document.createElement('option')).text(subModule.displayName).val(subModule.id);
                    subModuleOption.appendTo(subModuleSelect);
                }
                subModuleSelect.trigger('change');
                columnSelect.trigger('change');
            });
            moduleSelect.trigger('change');

            var columnOption1 = $(document.createElement('option')).text('Column').val('column');
            var columnOption2 = $(document.createElement('option')).text('Button').val('button');
            var columnOption3 = $(document.createElement('option')).text('Filter').val('filter');
            columnSelect.append(columnOption1).append(columnOption2).append(columnOption3);

            columnVisibilityManager.elements.selectorTable = table;
            columnVisibilityManager.elements.moduleSelect = moduleSelect;
            columnVisibilityManager.elements.subModuleSelect = subModuleSelect;
            columnVisibilityManager.elements.columnSelect = columnSelect;
            return table
        },

        createContentContainer: function(columnVisibilityManager){
            var self = this;
            var container = $(document.createElement('div')).attr(columnVisibilityManager.constants.contentContainer);
            var tableContainer = $(document.createElement('div')).attr(columnVisibilityManager.constants.contentTableContainer).appendTo(container)
            var columnTable = $(document.createElement('table')).attr(columnVisibilityManager.constants.columnContentTable).appendTo(tableContainer)
            var buttonTable = $(document.createElement('table')).attr(columnVisibilityManager.constants.buttonContentTable).appendTo(tableContainer)
            var filterTable = $(document.createElement('table')).attr(columnVisibilityManager.constants.buttonContentTable).appendTo(tableContainer)


            columnVisibilityManager.elements.columnTable = columnTable;
            columnVisibilityManager.elements.buttonTable = buttonTable;
            columnVisibilityManager.elements.filterTable = filterTable;

            return container;
        }
//        createButtonContainer: function(columnVisibilityManager){
//            var self = this;
//            var container = $(document.createElement('div')).attr(columnVisibilityManager.constants.buttonContainer);
//            var buttonElement3 = $(document.createElement('div')).attr(columnVisibilityManager.constants.buttonElement).appendTo(container);
//            var buttonElement1 = $(document.createElement('div')).attr(columnVisibilityManager.constants.buttonElement).appendTo(container);
////            var buttonElement2 = $(document.createElement('div')).attr(columnVisibilityManager.constants.buttonElement).appendTo(container);
//            var saveButton = $(document.createElement('button')).attr(columnVisibilityManager.constants.saveButton).appendTo(buttonElement1);
////            var cancelButton = $(document.createElement('button')).attr(columnVisibilityManager.constants.cancelButton).appendTo(buttonElement2);
//            var applyButton = $(document.createElement('button')).attr(columnVisibilityManager.constants.applyButton).appendTo(buttonElement3);
//            saveButton.text('Save');
////            cancelButton.text('Cancel');
//            applyButton.text('Apply');
//
//            columnVisibilityManager.elements.saveButton = saveButton;
////            columnVisibilityManager.elements.cancelButton = cancelButton;
//            columnVisibilityManager.elements.applyButton = applyButton;
//            return container;
//        }
    },


    bindEvents: function(){
        var self = this;
        self.elements.subModuleSelect.on('change', function(){
            var selectedSubModule = self.elements.subModuleSelect.val();
            var selectedModule = self.elements.moduleSelect.val();
            if(selectedModule && selectedSubModule){
                self.appendToContentContainer(selectedModule,selectedSubModule, self.columnVisibilityConfig);
            }
        })

        self.elements.columnSelect.on('change', function(){
            var colButtonValue = self.elements.columnSelect.val();
            self.showContentContainer(colButtonValue);
        });

//        self.elements.saveButton.on('click', function(){
//            console.log(JSON.stringify(self.columnVisibilityConfig, null, 2));
//
//        })
//
//        self.elements.applyButton.on('click', function(){
//            self.createJSON();
//        })

//        self.elements.cancelButton.on('click', function(){
//            self.container.hide();
//        })
        return self;
    },

    appendToContentContainer: function(selectedModule,selectedSubModule, config){
        var self = this;
        self.elements.columnTable.find('tr').each(function(){
            var ele = $(this);
            ele.remove();
        });
        self.elements.buttonTable.find('tr').each(function(){
            var ele = $(this);
            ele.remove();
        });
        self.elements.filterTable.find('tr').each(function(){
            var ele = $(this);
            ele.remove();
        });
        var subModule = self.data.modules[selectedModule].subModules[selectedSubModule];

        var trColumn = $(document.createElement('tr')).appendTo(self.elements.columnTable);
        var trButton = $(document.createElement('tr')).appendTo(self.elements.buttonTable);
        var trFilter = $(document.createElement('tr')).appendTo(self.elements.filterTable);

        var tdHead = $(document.createElement('td')).appendTo(trColumn);
        var divColumn = $(document.createElement('div')).attr(self.constants.columnTableColumn).appendTo(tdHead);
        var spanColumn = $(document.createElement('span')).appendTo(divColumn);
        spanColumn.text('Role');
        var columnTdCount = 0;
        var buttonTdCount = 0;
        var filterTdCount = 0;
        for(var key in subModule.columns){
            columnTdCount++;
            var column = subModule.columns[key];
            var td = $(document.createElement('td')).appendTo(trColumn);
            var divColumn = $(document.createElement('div')).attr(self.constants.columnTableColumn).appendTo(td);
            var spanColumn = $(document.createElement('span')).appendTo(divColumn);
            spanColumn.attr({id: column.id}).text(column.displayName)
        }

        var tdHead1 = $(document.createElement('td')).appendTo(trButton);
        var divButton = $(document.createElement('div')).attr(self.constants.buttonTableColumn).appendTo(tdHead1);
        var spanButton = $(document.createElement('span')).attr({type: "text"}).appendTo(divButton);
        spanButton.text('Role');
        for(var key in subModule.buttons){
            buttonTdCount++;
            var button = subModule.buttons[key];
            var td = $(document.createElement('td')).appendTo(trButton);
            var divButton = $(document.createElement('div')).attr(self.constants.buttonTableColumn).appendTo(td);
            var spanButton = $(document.createElement('span')).attr({type: "text"}).appendTo(divButton);
            spanButton.attr({id: button.id}).text(button.displayName);
        }

        var tdHead2 = $(document.createElement('td')).appendTo(trFilter);
        var divButton = $(document.createElement('div')).attr(self.constants.buttonTableColumn).appendTo(tdHead1);
        var spanButton = $(document.createElement('span')).attr({type: "text"}).appendTo(divButton);
        spanButton.text('Role');
        for(var key in subModule.filters){
            filterTdCount++;
            var filter = subModule.filters[key];
            var td = $(document.createElement('td')).appendTo(trFilter);
            var divButton = $(document.createElement('div')).attr(self.constants.buttonTableColumn).appendTo(td);
            var spanButton = $(document.createElement('span')).attr({type: "text"}).appendTo(divButton);
            spanButton.attr({id: filter.id}).text(filter.displayName);
        }


        for(var key in self.config.roles){
            var role = self.config.roles[key];
            var modules = role.modules;

            var tr = $(document.createElement('tr')).appendTo(self.elements.columnTable);
            var td = $(document.createElement('td')).appendTo(tr);
            var span = $(document.createElement('span')).attr({id: role.id}).text(role.displayName).appendTo(td);
            if(modules[selectedModule]){

                if(modules[selectedModule].subModules[selectedSubModule]){
                    var columnVisibilityConfig = modules[selectedModule]
                        .subModules[selectedSubModule].columns;
                }
            }
            for(var key in subModule.columns){
                var column = subModule.columns[key];
                var tdEle = $(document.createElement('td')).appendTo(tr);
                var checkBox = $(document.createElement('input')).attr({type: "checkbox", class: column.id})
                    .appendTo(tdEle);
                checkBox.prop('checked', true);
                if(columnVisibilityConfig){
                    if(columnVisibilityConfig[column.id]){
                        checkBox.prop('checked', false);
                    }
                }
            }
        }

        for(var key in self.config.roles){
            var role = self.config.roles[key];
            var modules = role.modules;
            var tr = $(document.createElement('tr')).appendTo(self.elements.buttonTable);
            var td = $(document.createElement('td')).appendTo(tr);
            var span = $(document.createElement('span')).attr({id: role.id}).text(role.displayName).appendTo(td);
            if(modules[selectedModule]){
                if(modules[selectedModule].subModules[selectedSubModule]){
                    var buttonVisibilityConfig = modules[selectedModule].subModules[selectedSubModule].buttons;
                }
            }
            for(var key in subModule.buttons){
                var button = subModule.buttons[key];
                var tdEle = $(document.createElement('td')).appendTo(tr);
                var checkBox = $(document.createElement('input')).attr({type: "checkbox", class: button.id}).appendTo(tdEle);
                checkBox.prop('checked', true)
                if(buttonVisibilityConfig){
                    if(buttonVisibilityConfig[button.id]){
                        checkBox.prop('checked', false);
                    }                                   }
            }
        }
        for(var key in self.config.roles){
            var role = self.config.roles[key];
            var modules = role.modules;
            var tr = $(document.createElement('tr')).appendTo(self.elements.filterTable);
            var td = $(document.createElement('td')).appendTo(tr);
            var span = $(document.createElement('span')).attr({id: role.id}).text(role.displayName).appendTo(td);
            if(modules[selectedModule]){
                if(modules[selectedModule].subModules[selectedSubModule]){
                    var filterVisibilityConfig = modules[selectedModule].subModules[selectedSubModule].filters;
                }
            }

            for(var key in subModule.filters){
                var filter = subModule.filters[key];
                var tdEle = $(document.createElement('td')).appendTo(tr);
                var checkBox = $(document.createElement('input')).attr({type: "checkbox", class: filter.id}).appendTo(tdEle);
                checkBox.prop('checked', true)
                if(filterVisibilityConfig){
                    if(filterVisibilityConfig[filter.id]){
                        checkBox.prop('checked', false);
                    }                                   }
            }
        }

        self.elements.columnTable.hide();
        self.elements.buttonTable.hide();
        self.elements.filterTable.hide();
        self.elements.columnSelect.trigger('change');


    },

    showContentContainer: function(value){
        var self = this;
        switch (value){
            case 'column':
                self.elements.columnTable.show();
                self.elements.buttonTable.hide();
                self.elements.filterTable.hide();
                break;
            case 'button':
                self.elements.buttonTable.show();
                self.elements.columnTable.hide();
                self.elements.filterTable.hide();
                break;
            case 'filter':
                self.elements.filterTable.show();
                self.elements.columnTable.hide();
                self.elements.buttonTable.hide();
                break;
        }
        return self;
    },

    createConfig: function(){
        var self = this;
        self.columnVisibilityConfig = self.config;
        return self;
    },

    get columnVisibilityJson(){
        var self = this;
        return self.columnVisibilityConfig;
    },

    createJSON: function(){
        var self = this;
        var selectedModule = self.elements.moduleSelect.val();
        var selectedSubModule = self.elements.subModuleSelect.val();
        var columnVisibilityConfig = self.columnVisibilityConfig;

        var columnsTemp = {};
        var buttonsTemp = {};
        var filtersTemp = {};
        var trColumn = self.elements.columnTable.find('tr').eq(0);
        trColumn.find('td').each(function(){
            var td = $(this);
            if(td.find('span').get(0).id){
                var span = td.find('span');
                var id = span.attr('id');
                columnsTemp[id] = {
                    id: id,
                    displayName: span.text()
                }
            }
        });

        var trButton = self.elements.buttonTable.find('tr').eq(0);
        trButton.find('td').each(function(){
            var td = $(this);

            if(td.find('span').get(0).id){
                var span = td.find('span');
                var id = span.attr('id');
                buttonsTemp[id] = {
                    id: id,
                    displayName: span.text()
                }
            }
        });

        var trFilter = self.elements.filterTable.find('tr').eq(0);
        trFilter.find('td').each(function(){
            var td = $(this);

            if(td.find('span').get(0)){
                if(td.find('span').get(0).id){
                    var span = td.find('span');
                    var id = span.attr('id');
                    filtersTemp[id] = {
                        id: id,
                        displayName: span.text()
                    }
                }
            }

        });

        var modules = {};

        var tr = self.elements.columnTable.find('tr');
        tr = tr.not(tr.eq(0));

        tr.each(function(){
            var row = $(this);
            if(row.find('span').get(0).id){
                var id = row.find('span').get(0).id
                modules = columnVisibilityConfig.roles[id].modules;
                if(!modules[selectedModule]){

                    modules[selectedModule] = {
                        id: selectedModule,
                        subModules: {

                        }
                    }
                    var subModules = modules[selectedModule].subModules;
                    subModules[selectedSubModule] = {
                        id: selectedSubModule,
                        columns: {},
                        buttons: {},
                        filters: {}
                    }
                }
                else if(!modules[selectedModule].subModules[selectedSubModule]){
                    modules[selectedModule].subModules[selectedSubModule] = {
                        id: selectedSubModule,
                        columns: {},
                        buttons: {},
                        filters: {}
                    }
                }
                columnVisibilityConfig.roles[id].modules = modules;
            }
            var columns = {};

            row.find('input').each(function(){
                var checkbox = $(this);
                var checkValue = checkbox.prop('checked');
                if(!checkValue){
                    var columnId = checkbox.attr('class');
                    columns[columnId] = columnsTemp[columnId];
                    columns[columnId].isVisible = checkValue;
                }
            });
            columnVisibilityConfig.roles[id].modules[selectedModule].subModules[selectedSubModule].columns = columns;
        });


        var tr = self.elements.buttonTable.find('tr');
        tr = tr.not(tr.eq(0));
        tr.each(function(){
            var row = $(this);
            if(row.find('span').get(0).id){
                var id = row.find('span').get(0).id
                modules = columnVisibilityConfig.roles[id].modules;
                if(!modules[selectedModule]){

                    modules[selectedModule] = {
                        id: selectedModule,
                        subModules: {

                        }
                    }
                    var subModules = modules[selectedModule].subModules;
                    subModules[selectedSubModule] = {
                        id: selectedSubModule,
                        columns: {},
                        buttons: {},
                        filters: {}
                    }
                }
                else if(!modules[selectedModule].subModules[selectedSubModule]){
                    modules[selectedModule].subModules[selectedSubModule] = {
                        id: selectedSubModule,
                        columns: {},
                        buttons: {},
                        filters: {}
                    }
                }
                columnVisibilityConfig.roles[id].modules = modules
            }

            var buttons = {};

            row.find('input').each(function(){
                var checkbox = $(this);
                var checkValue = checkbox.prop('checked');
                if(!checkValue){
                    var buttonId = checkbox.attr('class');
                    buttons[buttonId] = buttonsTemp[buttonId];
                    buttons[buttonId].isVisible = checkValue;
                }
            })

            columnVisibilityConfig.roles[id].modules[selectedModule].subModules[selectedSubModule].buttons = buttons;
        });

        var tr = self.elements.filterTable.find('tr');
        tr = tr.not(tr.eq(0));
        tr.each(function(){
            var row = $(this);
            if(row.find('span').get(0).id){
                var id = row.find('span').get(0).id
                modules = columnVisibilityConfig.roles[id].modules;
                if(!modules[selectedModule]){

                    modules[selectedModule] = {
                        id: selectedModule,
                        subModules: {

                        }
                    }
                    var subModules = modules[selectedModule].subModules;
                    subModules[selectedSubModule] = {
                        id: selectedSubModule,
                        columns: {},
                        buttons: {},
                        filters: {}
                    }
                }
                else if(!modules[selectedModule].subModules[selectedSubModule]){
                    modules[selectedModule].subModules[selectedSubModule] = {
                        id: selectedSubModule,
                        columns: {},
                        buttons: {},
                        filters: {}
                    }
                }
                columnVisibilityConfig.roles[id].modules = modules
            }

            var filters = {};

            row.find('input').each(function(){
                var checkbox = $(this);
                var checkValue = checkbox.prop('checked');
                if(!checkValue){
                    var buttonId = checkbox.attr('class');
                    filters[buttonId] = filtersTemp[buttonId];
                    filters[buttonId].isVisible = checkValue;
                }
            })

            columnVisibilityConfig.roles[id].modules[selectedModule].subModules[selectedSubModule].filters = filters;
        });

        self.columnVisibilityConfig = columnVisibilityConfig;
        return self;
    },

    show: function(){
        var self = this;
        self.container.show();
        return self;
    },

    hide: function(){
        var self = this;
        self.container.hide();
        return self;
    }
}


