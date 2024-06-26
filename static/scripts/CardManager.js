/**
 * Created by Akhil Sekharan on 12/5/13.
 */

function CardManager(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.subReport = parentObject;
    self.report = self.subReport.report;
    self.erp = self.report.erp;
    self.id = self.subReport.id +'_card_manager';
    self.initialize();
    return self;
}

CardManager.prototype = {
    constants: {
        container: {
            "class": "card-panel"
        },
        divButtonPanel: {
            "class": "card-button-panel"
        },
        btnSearch: {
            "class": "card-button-search"
        },
        btnClear: {
            "class": "card-button-clear"
        },
        cardTableMain: {
            "class": "card-manager-table-main hundred-percent"
        }
    },
    initialize: function () {
        var self = this;
        self.cards = {};
        for(var key in self.config){
            var card = new Card(self.config[key], self);
            self.cards[card.id] = card;
        }
        self.cardsOrder = [];
        self.forEachCard(function(card, index){
            self.cardsOrder[index] = card;
        });
        self.intializeSocketEventsObject();
        self.createElements().bindEvents();
        self._socket.initialize(self);
        return self;
    },
    intializeSocketEventsObject: function(){
        var self = this;
        self.socketEvents = $.extend({}, self.socketEvents);
        for(var key in self.socketEvents){
            self.socketEvents[key] += '_'+ self.subReport.id;
            if(self.subReport.randomId){
                self.socketEvents[key] += '_'+  self.subReport.randomId;
            }
        }
        self.forEachCard(function(column){
            var listenStr = 'getCardDataDone_'+ self.subReport.id +'_'+ column.id;
            var emitStr = 'getCardData_'+ self.subReport.id +'_'+ column.id;
            if(self.randomId){
                listenStr += '_'+  self.subReport.randomId;
                emitStr += '_'+  self.subReport.randomId;
            }
            var listenKey = 'getCardDataDone_'+ column.id;
            var emitKey = 'getCardData_'+ column.id;
            self.socketEvents[listenKey] = listenStr;
            self.socketEvents[emitKey] = emitStr;
        });
        return self;
    },
    bindEvents: function () {
        var self = this;
//        self.elements.btnSearch.on('click', function(){
//            self.doSearch();
//        });
//        self.elements.btnClear.on('click', function(){
//            self.clearSearch();
//        });
//        self.forEachCard(function(card){
//            if(card.getCardFormElement()){
//                card.getCardFormElement().bindEnterButton(self.elements.btnSearch);
//            }
//        });
        return self;
    },
    getSocket: function(){
        var self = this;
        return self.erp.socket;
    },
    _socket: {
        initialize: function(cardManager){
            var self = this;
            var socket = cardManager.getSocket();

            cardManager.forEachCard(function(card){
                var listenStr = cardManager.socketEvents['getCardDataDone_'+card.id];
                socket.on(listenStr, function(data){
                    self.getCardDataDone_done(cardManager, card, data, {});
                });
            });

            return self;
        },
        getCardDataDone_done: function(cardManager, card, data, options){
            var self = this;
            if(data.success){
                card.cardDataReceived(data.result);
            }
            else{
                cardManager.subReport.notifier.showReportableErrorNotification('Error getting data for '+ card.displayName);
                //console.log('Error getting data for '+ card.displayName, data);
            }
        }
    },
    resetCardValues: function(){
        var self = this;
        var obj = {};
        self.forEachCard(function(card){
            card.resetValues();
        });
        return obj;
    },
    getCardValues: function(){
        var self = this;
        var obj = {};
        self.forEachCard(function(card){
            obj[card.id] = card.editValue;
        }, function(card){
            var ret = true;
            if(!card.editValue){
                ret = false;
            }
            return ret;
        });
        return obj;
    },
    createElements: function () {
        var self = this;
        self._creation.createElements(self);
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
    forEachCard: function(eachFunction, cardFunction){
        var self = this;
        var count = 0;
        for(var key in self.cards){
            var card = self.cards[key];
            if(cardFunction){
                if(cardFunction(card)){
                    eachFunction.apply(card, [card, count++]);
                }
            }
            else{
                eachFunction.apply(card, [card, count++]);
            }
        }
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    cardClicked: function(card, type){
        var self = this;
        self._events.cardClicked(self, card, type);
        return self;
    },
    _creation : {
        createContainer: function(cardManager){
            var div = $(document.createElement('div')).attr({id: cardManager.id, class: cardManager.constants.container.class});
            return div;
        },
        createElements: function(cardManager){
            var self = this;
            var container = self.createContainer(cardManager);
            var elements = {};
            elements.container = container;
            cardManager.elements = elements;
            cardManager.container = container;
            var table = $(document.createElement('table'));
            var tr = $(document.createElement('tr'))
                .attr(cardManager.constants.cardTableMain)
                .appendTo(table);
            cardManager.forEachCard(function(card){
                var td = $(document.createElement('td')).appendTo(tr);
                card.container.appendTo(td);
            });
            table.appendTo(container);
        }
    },
    _events   : {
        cardClicked: function(cardManager, card, type){
            var self = this;
            if(type === Card.BUTTON_MODES.GRID){
                self.gridViewCardClicked(cardManager, card)
            }
            else if(type === Card.BUTTON_MODES.FORM){
                self.formViewCardClicked(cardManager, card)
            }
            return this;
        },
        gridViewCardClicked: function(cardManager, card){
            var self = this;
            switch (card.type){
                case Card.BUTTON_TYPES.INSERT:
                    self.insertCardClicked(cardManager, card);
                    break;
                case Card.BUTTON_TYPES.VIEW:
                    self.viewCardClicked(cardManager, card);
                    break;
                case Card.BUTTON_TYPES.DELETE:
                    self.deleteCardClicked(cardManager, card);
                    break;
                case Card.BUTTON_TYPES.STATUS_CHANGE:
                    self.statusChangeCardClicked(cardManager, card);
                    break;
            }
            return self;
        },
        formViewCardClicked: function(cardManager, card){
            var self = this;
            switch (card.type){
                case Card.BUTTON_TYPES.EDIT:
                    self.editCardClicked(cardManager, card);
                    break;
            }
            return self;
        },
        editCardClicked: function(cardManager, card){
            var self = this;
            var subReport = cardManager.getWebpage();
            subReport.formView.show(FormView.EDIT_MODE, {}, card);
            return self;
        },
        insertCardClicked: function(cardManager, card){
            var self = this;
            var subReport = cardManager.subReport;
            subReport.formView.show(FormView.CREATE_MODE, null, card);
            return self;
        },
        viewCardClicked: function(cardManager, card){
            var self = this;
            var subReport = cardManager.getWebpage();
            console.log(cardManager.subReport.grid.data[cardManager.selectedRows[0]])
            subReport.formView.show(FormView.VIEW_MODE, cardManager.subReport.grid.data[cardManager.selectedRows[0]]);
            return self;
        },
        deleteCardClicked: function(cardManager, card){
            var self = this;
            var subReport = cardManager.getWebpage();
            if(card.confirmationMessage){
                if(!confirm(card.confirmationMessage.replace('@row_count@', cardManager.selectedRowsCount))){
                    return;
                }
            }
            subReport._db.deleteRow(subReport, cardManager.selectedRows, card);
            return this;
        },
        statusChangeCardClicked:function(cardManager, card){
            var self = this;
            var subReport = cardManager.getWebpage();
            if(!confirm(card.confirmationMessage.replace('@row_count@', cardManager.selectedRowsCount))){
                return;
            }
            var data = {};
            data.id = cardManager.selectedRows;
            data.cardId = card.id;
            subReport._db.statusChange(subReport, card, data);
            return this;
        }
    },
    _ui       : {
    }
}

CardManager.prototype.socketEvents = {
    search: "search",
    clearSearch: "clearSearch"
}
