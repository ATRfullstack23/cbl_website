/**
 * Created by Jithu on 1/8/14.
 */

function ModuleVisibilityManager(config, data, parentObject){
    var self = this;
    self.config = config;
    self.data = data;
    self.parentObject = parentObject;
    self.erp = parentObject;
    self.initialize();
    return self;
}

ModuleVisibilityManager.prototype = {
    constants: {
        container: {
            class: "module-visibility-manager"
        },
        tableContainer: {
            class: "module-visibility-table-container"
        },
        table: {
            class: "module-visibility-table"
        },
        titleContainer: {
            class: "title-container"
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
        contentContainer: {
            class: "content-container"
        },
        contentTableContainer: {
            class: "content-table-container"
        },
        moduleContentTable: {
            class: "column-content-table"
        },
        moduleTableColumn: {
            class: "column-table-column"
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
        self.elements.buttonsContainer.hide();
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

            var buttonTr = $(document.createElement('tr')).appendTo(table);
            var buttonTd = $(document.createElement('td')).appendTo(buttonTr);
            var buttonContainer = self.createButtonContainer(columnVisibilityManager);
            buttonContainer.appendTo(buttonTd);

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


        createContentContainer: function(columnVisibilityManager){
            var self = this;
            var container = $(document.createElement('div')).attr(columnVisibilityManager.constants.contentContainer);
            var tableContainer = $(document.createElement('div')).attr(columnVisibilityManager.constants.contentTableContainer).appendTo(container)
            var moduleTable = $(document.createElement('table')).attr(columnVisibilityManager.constants.moduleContentTable).appendTo(tableContainer)
            columnVisibilityManager.elements.moduleTable = moduleTable;
            columnVisibilityManager.appendToContentContainer();
            return container;
        },
        createButtonContainer: function(columnVisibilityManager){
            var self = this;
            var container = $(document.createElement('div')).attr(columnVisibilityManager.constants.buttonContainer);
            var buttonElement3 = $(document.createElement('div')).attr(columnVisibilityManager.constants.buttonElement).appendTo(container);
            var buttonElement1 = $(document.createElement('div')).attr(columnVisibilityManager.constants.buttonElement).appendTo(container);
//            var buttonElement2 = $(document.createElement('div')).attr(columnVisibilityManager.constants.buttonElement).appendTo(container);
            var saveButton = $(document.createElement('button')).attr(columnVisibilityManager.constants.saveButton).appendTo(buttonElement1);
//            var cancelButton = $(document.createElement('button')).attr(columnVisibilityManager.constants.cancelButton).appendTo(buttonElement2);
            var applyButton = $(document.createElement('button')).attr(columnVisibilityManager.constants.applyButton).appendTo(buttonElement3);
            saveButton.text('Save');
//            cancelButton.text('Cancel');
            applyButton.text('Apply');
            columnVisibilityManager.elements.buttonsContainer = container;
            columnVisibilityManager.elements.saveButton = saveButton;
//            columnVisibilityManager.elements.cancelButton = cancelButton;
            columnVisibilityManager.elements.applyButton = applyButton;
            return container;
        }
    },
    bindEvents: function(){
        var self = this;



        self.elements.saveButton.on('click', function(){
            console.log(JSON.stringify(self.columnVisibilityConfig, null, 2));

        })

        self.elements.applyButton.on('click', function(){
            self.createJSON();
        })

//        self.elements.cancelButton.on('click', function(){
//            self.container.hide();
//        })
        return self;
    },
    appendToContentContainer: function(config){
        var self = this;
        self.elements.moduleTable.find('tr').each(function(){
            var ele = $(this);
            ele.remove();
        });

        var trColumn = $(document.createElement('tr')).appendTo(self.elements.moduleTable);

        var tdHead = $(document.createElement('td')).appendTo(trColumn);
        var divColumn = $(document.createElement('div')).attr(self.constants.moduleTableColumn).appendTo(tdHead);
        var spanColumn = $(document.createElement('span')).appendTo(divColumn);
        spanColumn.text('Role');

        for(var key in self.data.modules){
            var column = self.data.modules[key];
            var td = $(document.createElement('td')).appendTo(trColumn);
            var divColumn = $(document.createElement('div')).attr(self.constants.moduleTableColumn).appendTo(td);
            var spanColumn = $(document.createElement('span')).appendTo(divColumn);
            spanColumn.attr({id: column.id}).text(column.displayName)
        }

        for(var key in self.config.roles){
            var role = self.config.roles[key];
            var moduleVisibilityConfig = role.modules || {};

            var tr = $(document.createElement('tr')).appendTo(self.elements.moduleTable);
            var td = $(document.createElement('td')).appendTo(tr);
            var span = $(document.createElement('span')).attr({id: role.id}).text(role.displayName).appendTo(td);

            for(var key in self.data.modules){
                var module = self.data.modules[key];
                var tdEle = $(document.createElement('td')).appendTo(tr);
                var checkBox = $(document.createElement('input')).attr({type: "checkbox", class: module.id}).appendTo(tdEle);
                checkBox.prop('checked', true);
                if(moduleVisibilityConfig[module.id] && moduleVisibilityConfig[module.id].isVisible === false){
                    checkBox.prop('checked', false);
                }
            }
        }

    },
    get moduleVisibilityJson(){
        var self = this;
        return self.columnVisibilityConfig;
    },
    createConfig: function(){
        var self = this;
        self.columnVisibilityConfig = self.config;
        return self;
    },
    createJSON: function(){
        var self = this;
        var columnVisibilityConfig = self.columnVisibilityConfig;
        var columnsTemp = {};
        var trColumn = self.elements.moduleTable.find('tr').eq(0);
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



        var modules = {};

        var tr = self.elements.moduleTable.find('tr');
        tr = tr.not(tr.eq(0));

        tr.each(function(){
            var row = $(this);
            if(row.find('span').get(0).id){
                var id = row.find('span').get(0).id
                columnVisibilityConfig.roles[id].modules;

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
            columnVisibilityConfig.roles[id].modules = columns;
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



