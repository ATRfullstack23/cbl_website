/**
 * Created by Akhil Sekharan on 12/6/13.
 */

ValidationManager = function ( parentObject ) {
    var self = this;
    self.formView = parentObject;
    self.columns = self.formView.subModule.columnManager.columns;
    self.subModule = self.formView.subModule;
    self.erp = self.subModule.erp;
    self.parentObject = parentObject;
    self.initialize();
    return self;
}

ValidationManager.prototype = {
    initialize: function () {
        var self = this;
        self.intializeSocketEventsObject();
        return self;
    },
    validate: function () {
        var self = this;
        var arr;
        switch(self.formView.mode){
            case FormView.CREATE_MODE:
                arr = self.validateCreateMode(self.formView);
                break;
            case FormView.EDIT_MODE:
                arr = self.validateEditMode(self.formView);
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
        var socket = self.formView.getSocket();
        socket.once(self.socketEvents.validateUniqueDone, function(data){
            if(data.success){
                if(data.result.isUnique){
                    self.removeValidationErrorForColumn(column);
                    column.resetFormViewHolder(self.formView.mode);
                    self.formView.enableSaveButton();
                }
                else{
                    self.formView.disableSaveButton();
                    var validationError = new ValidationError({
                        column: column,
                        message: column.displayName +" should be unique"
                    }, self);
                    self.addValidationError(validationError);
                    validationError.show(self.formView);
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
        var socket = self.formView.getSocket();
        socket.once(self.formView.socketEvents['customSqlValidationDone_'+column.id], function(data){
            if(data.success){
                if(data.result.error){
                    self.formView.disableSaveButton();
                    var validationError = new ValidationError({
                        column: column,
                        message: data.result.errorMessage
                    }, self);
                    self.addValidationError(validationError);
                    validationError.show(self.formView);
                }
                else{
                    self.removeValidationErrorForColumn(column);
                    column.resetFormViewHolder(self.formView.mode);
                    self.formView.enableSaveButton();
                }
            }
        });
        config.columnId = column.id;
        socket.emit(self.formView.socketEvents['customSqlValidation_'+column.id], config);
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
    validateCreateMode: function(formView){
        var self = this;
        var arr= [];
        formView.forEach(function(column){
                var err = column.validateFormViewElement(self.formView);
                if ( err){
                    arr.push( err);
                }
            },
            function(column){
                return !column.disabled;
            });
        return arr;
    },
    validateEditMode: function(formView){
        var self = this;
        var arr= [];
        formView.forEach(function(column){
            var err = column.validateFormViewElement(self.formView);
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
	show: function(tabId){
        var self = this;
        var tabErrorCount = {};
        self.currentErros = self.currentErros || [];
        var tab;
        if(tabId){
            if(tabId.id){
                tab = tabId;
                tabId = tab.id;
            }
            self.currentErros.forEach(function(err){
                if(!tabErrorCount[err.tabId]){
                    tabErrorCount[err.tabId] = 0;
                }
                tabErrorCount[err.tabId]++;
                if(err.tabId == tabId){
                    err.show(self.formView);
                }
                else{
                    if(self.formView.tabbers[self.formView.mode].stickyTab && self.formView.tabbers[self.formView.mode].stickyTab.id == err.tabId){
                        //err.hide(self.formView);
                    }
                    else{
                        err.hide(self.formView);
                    }
                }
            });
        }
        else{
            self.currentErros.forEach(function(err){
                err.show(self.formView);
            });
        }
        return tabErrorCount;
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