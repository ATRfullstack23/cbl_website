/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function GroupedList(config, parentObject){
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.initialize();
    return self;
}

GroupedList.prototype = {
    constants:{
        container: {
            class: "groupedList"
        }
    },
    initialize: function(){
        var self = this;
        self.createElements();
        self.bindEvents();
        return self;
    },
    bindEvents: function(){
        var self = this;
        return self;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    forEachGroup: function(eachFunction, filterFunction){
        var self = this;
        for(var key in self.groups){
            var group = self.groups[key];
            if(filterFunction){
                if(filterFunction(group)){
                    eachFunction.apply(group, [group]);
                }
            }
            else{
                eachFunction.apply(group, [group]);
            }
        }
        return self;
    },
    _creation: {
        createContainer: function(groupedList){
            var div = $(document.createElement('div')).attr({id: groupedList.id}).attr(groupedList.constants.container);
            return div;
        },
        createElements: function(groupedList){
            var self = this;
            groupedList.elements = {};
            var container = self.createContainer(groupedList);
            groupedList.container = container;
            groupedList.elements.container = container;



            return groupedList;
        },
        createGroup: function(groupedList){
            var div = $(document.createElement('div')).attr({id: groupedList.id}).attr(groupedList.constants.container);
            return div;
        }
    }
}