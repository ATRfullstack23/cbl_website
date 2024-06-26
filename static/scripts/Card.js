/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function Card(config, parentObject) {
    var self = this;
    self.config = config;
    self.cardManager = parentObject;
    self.subReport = self.cardManager.parentObject;
    self.report = self.subReport.parentObject;
    self.erp = self.subReport.erp;
    self.parentObject = parentObject;
    self.initialize();
    return self;
}

Card.prototype = {
    constants: {
        container: {
            "class": "card-container subReportItem"
        },
        spanDisplayName: {
            "class": "card-spanDisplayName"
        },
        divHeader: {
            "class": "card-divHeader divHandle"
        },
        divContent: {
            "class": "card-divContent"
        },
        spanTextContent: {
            "class": "card-spanTextContent"
        },
        spanQueryContent: {
            "class": "card-spanQueryContent text-loading"
        }
    },
    initialize: function () {
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }
        self.createElements().bindEvents();
        self.setDeviceTypeDisplayMode();
        return self;
    },
    bindEvents: function () {
        var self = this;
        return self;
    },
    setToReorderMode: function(){
        var self = this;
        self.isInReorderMode = true;
        self.container.resizable().draggable({ containment: self.subReport.container, scroll: false },{handle :'.divHandle'});
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
//        self.container.resizable('destroy').draggable('destroy');
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
            case Card.FILTER_TYPES.FREE_SEARCH:
                value = self.getCardFormElement().val();
                break;
        }
        return value;
    },
    setCurrentEditValue: function(value){
        var self = this;
        switch(self.type){
            case Card.FILTER_TYPES.FREE_SEARCH:
                self.getCardFormElement().val(value);
                break;
        }
        return value;
    },
    resetValues: function(){
        var self = this;
        for(var key in self.elements.dataSourceElements){
            var element = self.elements.dataSourceElements[key];
            element.addClass('text-loading').text('...');
        }
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
        }
        var url = '/ajax/reports/' + self.report.id + '/' +self.subReport.id + '/getCardData/'+ self.id;
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
                self.cardDataReceived(data.result);
                self.dataTimestamp = data.timestamp;
            }
            else{
                self.setToErrorMode(data.errorMessage);
                //self.subReport.notifier.showReportableErrorNotification('Error getting data for '+ self.displayName+'('+ data.errorMessage +')');
            }
        });
        return self;
    },

    cardDataReceived: function(data){
        var self = this;
        self.hideOverLay();
        for(var key in self.elements.dataSourceElements){
            var element = self.elements.dataSourceElements[key];
            var value = data.dataSources[key];
            element.text(value).removeClass('text-loading');
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
        return self.getCardFormElement().prop('disabled');
    },
    triggerEvent: function(cardMode, eventType){
        var self = this;
        if(!self.isDisabledNow(cardMode)){
            self.getElement(cardMode).trigger(eventType);
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
//    getCardFormElement: function(index){
//        var self = this;
//        return self.elements.formElements.element;;
//    },
    _creation : {
        createContainer: function(card){
            var div = $(document.createElement('li')).attr({'data-row':"1", 'data-col':"1", 'data-sizex':"1",'data-sizey':"1",id: card.id, class: card.constants.container.class});
            return div;
        },

        createHeader: function(card){
            var divHeader = $(document.createElement('div'))
                .attr(card.constants.divHeader);
            card.elements.divHeader = divHeader;

            var spanDisplayName = $(document.createElement('span'))
                .attr(card.constants.spanDisplayName)
                .text(card.displayName).appendTo(divHeader);
            card.elements.spanDisplayName = spanDisplayName;

            return divHeader;
        },

        createSpanTextContent: function(item, card){
            var div = $(document.createElement('span'))
                .attr(card.constants.spanTextContent)
                .text(item.value);
            return div;
        },
        createSpanQueryContent: function(item, card){
            var div = $(document.createElement('span'))
                .attr(card.constants.spanQueryContent)
                .attr({id: item.id})
                .text('...');
            return div;
        },
        createContentContainer: function(card){
            var self = this;
            var divContent = $(document.createElement('div'))
                .attr(card.constants.divContent);
            card.elements.divContent = divContent;
            card.elements.dataSourceElements = {};

            card.typeSpecific.smartText.config.forEach(function(item){
                switch(item.type){
                    case "text":
                        divContent.append(self.createSpanTextContent(item, card));
                        break;
                    case "query":
                        card.elements.dataSourceElements[item.value.id] = self.createSpanQueryContent(item.value, card);
                        divContent.append(card.elements.dataSourceElements[item.value.id] );
                        break;
                }
            });

            return divContent;
        },
        createElements: function(card){
            var self = this;
            var container = self.createContainer(card);

            card.elements = {};
            card.container = container;
            card.elements.container = container;

            var divHeader = self.createHeader(card);
            var divContent = self.createContentContainer(card);

            if(card.hidden){
                container.addClass('hidden');
            };
            container.append(divHeader).append(divContent);
            return self;
        },
        createFreeSearch: function(card){
            var self = this;
            var element = $(document.createElement('input')).attr({id: 'card_'+card.id, "type": "text"});
            card.elements.formElements.element = element;
            return element;
        }
    },
    _events   : {
    },
    _ui       : {
    }
}