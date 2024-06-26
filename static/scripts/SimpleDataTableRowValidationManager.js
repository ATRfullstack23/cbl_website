/**
 * Created by Akhil Sekharan on 12/6/13.
 */

SimpleDataTableRowValidationManager = function ( parentObject ) {
    var self = this;
    self.simpleDataTableRow = parentObject;
    self.columns = self.simpleDataTableRow.subModule.columnManager.columns;
    self.subModule = self.simpleDataTableRow.subModule;
    self.erp = self.subModule.erp;
    self.parentObject = parentObject;
    self.initialize();
    return self;
}

SimpleDataTableRowValidationManager.prototype = {
    initialize: function () {
        var self = this;
        self.intializeSocketEventsObject();
        return self;
    },
    validate: function () {
        var self = this;
        var arr;
        switch(self.simpleDataTableRow.mode){
            case FormView.CREATE_MODE:
                arr = self.validateCreateMode(self.simpleDataTableRow);
                break;
            case FormView.EDIT_MODE:
                arr = self.validateEditMode(self.simpleDataTableRow);
                break;
        }
        self.currentErros = arr;
        return self.currentErros.length == 0;
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
    validateUniqueColumn: function( column, element, config, validateUniqueColumnCallback){
        var self = this;
        var socket = self.simpleDataTableRow.getSocket();
        socket.once(self.socketEvents.validateUniqueDone, function(data){
            if(data.success){
                if(data.result.isUnique){
                    self.removeValidationErrorForColumn(column);
                    column.resetFormViewHolder(self.simpleDataTableRow.mode);
                    self.simpleDataTableRow.enableSaveButton();
                }
                else{
                    self.simpleDataTableRow.disableSaveButton();
                    var validationError = new ValidationError({
                        column: column,
                        message: column.displayName +" should be unique"
                    }, self);
                    self.addValidationError(validationError);
                    validationError.show(self.simpleDataTableRow);
                }
            }
        });
        config.value = element.val();
        config.columnId = column.id;
        socket.emit(self.socketEvents.validateUnique, {config: config});
        return self;
    },
    validateCustomSqlColumn: function( column, element, config, validateUniqueColumnCallback){
        var self = this;
        var socket = self.simpleDataTableRow.getSocket();
        socket.once(self.simpleDataTableRow.socketEvents['customSqlValidationDone_'+column.id], function(data){
            if(data.success){
                if(data.result.error){
                    self.simpleDataTableRow.disableSaveButton();
                    var validationError = new ValidationError({
                        column: column,
                        message: data.result.errorMessage
                    }, self);
                    self.addValidationError(validationError);
                    validationError.show(self.simpleDataTableRow);
                }
                else{
                    self.removeValidationErrorForColumn(column);
                    column.resetFormViewHolder(self.simpleDataTableRow.mode);
                    self.simpleDataTableRow.enableSaveButton();
                }
            }
        });
        config.columnId = column.id;
        socket.emit(self.simpleDataTableRow.socketEvents['customSqlValidation_'+column.id], config);
        return self;
    },
    removeValidationErrorForColumn: function(column){
        var self = this;
        var indexsToRemove = [];
        if(!self.currentErros){
            self.currentErros = [];
            return;
        }
        self.currentErros.forEach(function(validationError, index){
            if(validationError.column.id === column.id){
                validationError.remove();
                indexsToRemove.push(index);
                delete validationError;
            }
        });
        indexsToRemove.forEach(function(index){
           self.currentErros.splice(index, 1);
        });
        return self;
    },
    addValidationError: function(validationError){
        var self = this;
        if(!self.currentErros){
            self.currentErros = [];
        }
        self.currentErros.push(validationError);
        return self;
    },
    validateCreateMode: function(simpleDataTableRow){
        var self = this;
        var arr= [];
        simpleDataTableRow.forEach(function(column){
                var err = column.validateSimpleDataTableRowElement(self.simpleDataTableRow);
                if ( err){
                    arr.push( err);
                }
            },
            function(column){
                return !column.disabled;
            });
        return arr;
    },
    validateEditMode: function(simpleDataTableRow){
        var self = this;
        var arr= [];
        simpleDataTableRow.forEach(function(column){
            var err = column.validate(self.simpleDataTableRow);
            if ( err){
                arr.push(err);
            }
        }, function(column){
            var disabled = false;
            if(column.disabled){
                disabled = true;
            }
            else if(column.disabledInEditMode){
                disabled = true;
            }
            return !disabled;
        });
        return arr;
    },
    show: function(){
        var self = this;
        self.currentErros.forEach(function(err){
            err.show(self.simpleDataTableRow);
        });
        return self;
    },
    removeAll: function(){
        var self = this;
        if(!self.currentErros || !self.currentErros.length)
            return;
        self.currentErros.forEach(function(err){
            err.remove();
        });
        self.currentErros = [];
        return self;
    }
}

ValidationManager.prototype.socketEvents = {
    validateUnique: "validateUnique",
    validateUniqueDone: "validateUniqueDone"
}