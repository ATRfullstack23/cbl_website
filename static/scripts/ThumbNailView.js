/**
 * Created by Akhil Sekharan on 10/24/13.
 */

function ThumbNailView(config, parentObject) {
    var self = this;
    self.parentObject = parentObject;
    self.subModule = self.parentObject;
    self.config = config;
    self.erp = self.parentObject.erp;
    self.initialize();
    return self;
}

ThumbNailView.prototype = {
    constants: {
        container: {
            "class": "thumb-nail-view-manager-container"
        },
        flipContainer: {
            "class": "flip-container"
        },
        thumbNailViewContainer: {
            "class": "thumb-nail-view-container"
        },
        thumbNailViewFrontContainer:{
            "class": "thumb-nail-view-front-container"
        },
        thumbNailViewBackContainer: {
            "class": "thumb-nail-view-back-container"
        },
        btnSave:{
            "class": "btn-save"
        },
        tableSmartTextRows:{
            "class": "table-smart-text-rows hundred-percent"
        },
        btnAddSmartTextRow:{
            "class": "btn-add-smart-text-row"
        },
        spanDisplayName: {
            "class": "span-display-name"
        },
        divHeader: {
            "class": "div-header"
        },
        divFrontContent: {
            "class": "div-front-content"
        },
        divBackContent: {
            "class": "div-back-content"
        },
        spanTextContent: {
            "class": "span-text-content"
        },
        spanQueryContent: {
            "class": "span-query-content"
        },
        btnDeleteRow:{
            "class": "btn-delete-row"
        }
    },
    initialize: function () {
        var self = this;

        if(!self.config.headerSmartText){
            self.config.headerSmartText = {};
        }
        if(!self.config.smartTextRows){
            self.config.smartTextRows = [];
        }

        for(var key in self.config){
            self[key] = self.config[key];
        }

        self.createElements().bindEvents();
        self.intializeSocketEventsObject();
        self._db.initialize(self);
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
    createElements: function () {
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    getSocket: function(){
        var self = this;
        return self.erp.socket;
    },
    bindEvents: function () {
        var self = this;
        self.container.on('dblclick', '.'+self.constants.flipContainer.class, function(){
            var flipContainer = $(this)
            self.openFormViewManager(flipContainer.attr('id'));
        })
        return self;
    },
    openFormViewManager: function(dataRowId){
        var self = this;
        self.parentObject.formView.show('view', self.data[dataRowId]);
        return self;
    },
    updateThumbNailView: function(){
        var self = this;
        return self;
    },
    showAnimation: function(type){
        var self = this;
        switch(type){
            case 'in':
                self._animations.showInAnimation(self);
                break;
        }
        return self;
    },
    _animations: {
        showInAnimation: function(thumbNailView){
            var self = this;
            thumbNailView.container.css({transform: 'translate(50px)', opacity: 0});
            thumbNailView.container.transition({x: '0px', opacity: 1}, 500, function(){
                thumbNailView.container.css('-webkit-transform','');
            });
            return self;
        }
    },
    getData: function(options){
        var self = this;
        self._db.getData(self, options);
        return self;
    },
    _db: {
        initialize: function(thumbNailView){
            var socket = thumbNailView.getSocket();
            socket.on(thumbNailView.socketEvents.getThumbNailViewDataDone, function(data){
                thumbNailView._db.getData_done(thumbNailView, data);
            });
        },
        getData: function(thumbNailView, options){
            var self = this;
            //var filter = thumbNailView.filterManager.getFilter();
            var data = {};
            var socket = thumbNailView.getSocket();
//            console.log(data)
            thumbNailView.lastRequestTime = new Date();

            if(options){
                var requestId = crypto.getRandomValues(new Uint16Array(1))[0];
                data.requestId = requestId;
                socket.thumbNailView.events[requestId] = options;
            }

//            var str = 'getGridData_'+ thumbNailView.subModule.id;
//            console.log(thumbNailView.socketEvents.getGridData)
            socket.emit(thumbNailView.socketEvents.getThumbNailViewData, {config:data});
            return self;
        },
        getData_done: function(thumbNailView, data){
            var self = this;

            if(data.success){
                //console.log(new Date() - thumbNailView.lastRequestTime);
                thumbNailView.data = {};
                thumbNailView.dataArr = [];
                if(data.result && data.result.data && data.result.data.length){
                    data.result.data.forEach(function(dataRow){
                        thumbNailView.data[dataRow.id] = dataRow;
                    });
                    thumbNailView.dataArr = data.result.data;
                }

                thumbNailView.container.empty();
                thumbNailView._creation.createThumbNailItems(thumbNailView);
                thumbNailView.thumbNailViewItemsArr.forEach(function(thumbNailViewItem){
                    thumbNailView.container.append(thumbNailViewItem.getElement());
                    thumbNailViewItem.changeHeight();
                });
                thumbNailView.showAnimation('in');
                if(data.requestId){
                    var options = thumbNailView.getSocket().thumbNailView.events[data.requestId];
                    if(options){
                        options.callback(thumbNailView, options.options);
                    }
                }
            }
            else{
                thumbNailView.notifier.showReportableErrorNotification('Error Getting Data');
            }

            thumbNailView.subModule.buttonManager.rowSelectorChanged($(this));
        }
    },
    changeHeight: function(){
        var self = this;
//        self.elements.thumbNailViewItemsArr.each(function(){
//            var flipContainer = $(this);
//            var containerFront = flipContainer.find('.'+self.constants.thumbNailViewFrontContainer.class);
//            var height = containerFront.height();
//            var width = containerFront.width();
//
//            var containerBack = flipContainer.find('.'+self.constants.thumbNailViewBackContainer.class);
//            containerBack.css('min-height', height+'px');
//            containerBack.css('min-width', width+'px');
//        })
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
    createSmartTextString: function(smartText, dataRow){
        var self = this;
        var str = '';
        for(var key in smartText.config){
            var item = smartText.config[key];

            switch (item.type){
                case "text":
                    str += item.value;
                    break;
                case "column":
                    var column = self.subModule.columnManager.columns[item.value];
                    str += column.parseDisplayValue(dataRow);
                    break;
            }
        }
        return str;
    },
    _creation: {
        createContainer: function(thumbNailView){
            var div = $(document.createElement('div')).attr({id: thumbNailView.id, class: thumbNailView.constants.container.class});
            return div;
        },
        createThumbNailItems: function(thumbNailView){
            var self = this;
            var thumbNailViewItemsArr = [];
            var thumbNailViewItemsObj = {};

            thumbNailView.dataArr.forEach(function(dataRow){
                var thumbNailViewItem = new ThumbNailViewItem({
                    dataRow: dataRow,
                    smartTextRows: thumbNailView.smartTextRows,
                    headerSmartText: thumbNailView.headerSmartText
                }, thumbNailView);
                thumbNailViewItemsArr.push(thumbNailViewItem);
                thumbNailViewItemsObj[dataRow.id] = thumbNailViewItem;
            });
            thumbNailView.thumbNailViewItemsArr = thumbNailViewItemsArr;
            thumbNailView.thumbNailViewItemsObj = thumbNailViewItemsObj;
            return thumbNailViewItemsArr;
        },
        createElements: function(thumbNailView){
            var self = this;
            var container = self.createContainer(thumbNailView);

            thumbNailView.elements = {};
            thumbNailView.dataRowId = {};
            thumbNailView.container = container;
            thumbNailView.elements.container = container;

            return self;
        }
    }
}

ThumbNailView.prototype.socketEvents = {
    getThumbNailViewData: "getThumbNailViewData",
    getThumbNailViewDataDone: "getThumbNailViewDataDone"
};