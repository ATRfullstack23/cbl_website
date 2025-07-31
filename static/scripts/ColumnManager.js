/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function ColumnManager(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.subModule = parentObject;
    self.module = self.subModule.module;
    self.erp = self.module.erp;
    self.id = self.subModule.id +'_column_manager';
    self.initialize();
    return self;
}

ColumnManager.prototype = {
    initialize: function () {
        var self = this;

        self.initializeColumns();

        self.forEachColumn(function(column){
            column.initializeLookUp();
        }, function(column){
            var ret = false;
            if(column.type == Column.COLUMN_TYPES.LOOKUP_DROPDOWNLIST || column.type == Column.COLUMN_TYPES.LOOKUP_LABEL || column.type == Column.COLUMN_TYPES.LOOKUP_TEXTBOX){
                ret = true;
            }
            return ret;
        });

        self.createElements();

        self.forEachColumn(function(column){
            self.hasFooterColumns = true;
        }, function(column){
            var ret = false;
            if(column.typeSpecific && column.typeSpecific.showTotal){
                ret = true;
            }
            return ret;
        });

        return self;
    },
    initializeColumns: function () {
        var self = this;

        self.columns = {};
        self.columnsByUniqueName = {};
        self.visibilitySettings = self.subModule.visibilitySettings['columns'] || {};


        for(var key in self.config){
            var columnConfig = self.config[key];
            if(self.visibilitySettings[columnConfig.id]){
                if(!self.visibilitySettings[columnConfig.id].isVisible){
                    columnConfig.gridView.isHidden = true;
                    for(var key in columnConfig.formView){
                        columnConfig.formView[key].isHidden = true;
                    }
                }
            }
            var column = new Column( columnConfig, self);
            self.columns[column.id] = column;
            self.columnsByUniqueName[column.uniqueName] = column;
        }

        return self;
    },    createElements: function () {
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    bindEvents: function () {
        var self = this;

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
    createHTMLEditor: function(formView){
        var self = this;
        self.forEachColumn(function(column){
            column.createHTMLEditor(formView)
            // column.createHTMLEditor(FormView.CREATE_MODE)
            // column.createHTMLEditor(FormView.EDIT_MODE)
        }, function(column){
            return column.type === Column.COLUMN_TYPES.MULTILINE && column.allowHTMLEditor;
        })
        return self;
    },
    get_column_from_id: function(column_id){
        return this.columns[column_id];
    },
    forEachColumn: function(eachFunction, filterFunction){
        var self = this;
        for(var key in self.columns){
            var column = self.columns[key];
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
    forEachColumnType: function(columnType, eachFunction, filterFunction){
        var self = this;
        columnType = columnType.split(',');
        self.forEachColumn(function(column){
                eachFunction.apply(column, [column]);
            },
            function(column){
                var ret = false;
                if(columnType.indexOf(column.type) !== -1){
                    if(filterFunction){
                        ret = true;
                    }
                    else{
                        ret = true;
                    }
                }
                return ret;
            })
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    _creation : {
        createContainer: function(columnManager){
            var div = $(document.createElement('div')).attr({id: columnManager.id});
            return div;
        },
        createElements: function(columnManager){
            var self = this;
            var elements = {};

            var container = self.createContainer(columnManager);
            columnManager.forEachColumn(function(column){
                container.append(column.getElement());
            });
            elements.container = container;
            columnManager.container = container;
            return container;
        }
    },
    _events   : {
    },
    _ui       : {
    }
}

