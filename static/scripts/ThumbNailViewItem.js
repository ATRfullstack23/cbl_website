/**
 * Created by Akhil Sekharan on 1/3/14.
 */

function ThumbNailViewItem(config, parentObject) {
    var self = this;
    self.config = config;
    self.parentObject = parentObject;
    self.initialize();
    return self;
}

ThumbNailViewItem.prototype = {
    constants: {
        flipContainer: {
            "class": "flip-container"
        },
        thumbNailViewItemContainer: {
            "class": "thumb-nail-view-container"
        },
        thumbNailViewItemFrontContainer:{
            "class": "thumb-nail-view-front-container"
        },
        thumbNailViewItemBackContainer: {
            "class": "thumb-nail-view-back-container"
        },
        btnSave:{
            "class": "btn-save"
        },
        tableSmartTextRows:{
            "class": "table-smart-text-rows hundred-percent"
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
        btnDeleteRow:{
            "class": "btn-delete-row"
        }
    },
    initialize: function () {
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }
        self.createElements().bindEvents();
        return self;
    },
    createElements: function () {
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    bindEvents: function () {
        var self = this;
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    show: function () {
        var self = this;
        self.container.show();
        return self;
    },
    changeHeight: function(){
        var self = this;
        var flipContainer = self.container;
        var containerFront = flipContainer.find('.'+self.constants.thumbNailViewItemFrontContainer.class);
        var height = containerFront.height();
        var width = containerFront.width();

        var containerBack = flipContainer.find('.'+self.constants.thumbNailViewItemBackContainer.class);
        containerBack.css('min-height', height+'px');
        containerBack.css('min-width', width+'px');
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
                    var column = self.parentObject.subModule.columnManager.columns[item.value];
                    str += column.parseDisplayValue(dataRow);
                    break;
            }
        }
        return str;
    },
    _creation: {
        createElements: function(thumbNailViewItem){
            var self = this;
            var elements = {};
            thumbNailViewItem.elements = elements;
            var dataRow = thumbNailViewItem.config.dataRow;
            var flipContainer = $(document.createElement('div'))
                .attr(thumbNailViewItem.constants.flipContainer)
                .attr({id: dataRow.id});
            var thumbNailViewItemContainer = self.createThumbNailViewContainer(thumbNailViewItem);
            var thumbNailViewItemFrontContainer = self.createThumbNailViewFrontContainer(thumbNailViewItem, dataRow);

            var divHeader = self.createHeader(thumbNailViewItem, dataRow);
            var divContent = self.createFrontContentContainer(thumbNailViewItem, dataRow);

            thumbNailViewItemFrontContainer.append(divHeader).append(divContent)
                .appendTo(thumbNailViewItemContainer);


            var thumbNailViewItemBackContainer = self.createThumbNailBackContainer(thumbNailViewItem, dataRow);
            var divBackContent = self.createBackContentContainer(thumbNailViewItem, dataRow);
            thumbNailViewItemBackContainer.append(divBackContent)
                .appendTo(thumbNailViewItemContainer);
            flipContainer.append(thumbNailViewItemContainer);

            elements.container = flipContainer;
            thumbNailViewItem.container = flipContainer;
            elements.thumbNailViewItemContainer = thumbNailViewItemContainer;
            elements.thumbNailViewItemFrontContainer = thumbNailViewItemFrontContainer;
            elements.thumbNailViewItemBackContainer = thumbNailViewItemBackContainer;
            elements.divHeader = divHeader;
            elements.divContent = divContent;
            elements.divContent = divContent;
            elements.divBackContent = divBackContent;
        },
        createHeader: function(thumbNailView, dataRow){
            var divHeader = $(document.createElement('div'))
                .attr(thumbNailView.constants.divHeader);
            thumbNailView.elements.divHeader = divHeader;

            var spanDisplayName = $(document.createElement('span'))
                .attr(thumbNailView.constants.spanDisplayName)
                .text(thumbNailView.displayName).appendTo(divHeader);
            thumbNailView.elements.spanDisplayName = spanDisplayName;

            spanDisplayName.text(thumbNailView.parentObject.createSmartTextString(thumbNailView.headerSmartText, dataRow));

            return divHeader;
        },
        createThumbNailViewContainer: function(thumbNailView){
            var self = this;
            var container = $(document.createElement('div'))
                .attr(thumbNailView.constants.thumbNailViewItemContainer);
            return container;
        },
        createFrontContentContainer: function(thumbNailViewItem, dataRow){
            var self = this;
            var divFrontContent = $(document.createElement('div'))
                .attr(thumbNailViewItem.constants.divFrontContent);
            thumbNailViewItem.elements.divFrontContent = divFrontContent;
            thumbNailViewItem.elements.dataSourceElements = {};


            var tableSmartTextRows = $(document.createElement('table'))
                .attr(thumbNailViewItem.constants.tableSmartTextRows)
                .appendTo(divFrontContent);
            thumbNailViewItem.elements.tableSmartTextRows = tableSmartTextRows;

//
            for(var key in thumbNailViewItem.smartTextRows.frontTable){
                var smartTextRow = thumbNailViewItem.smartTextRows.frontTable[key];

                var tr = $(document.createElement('tr')).appendTo(tableSmartTextRows);
                var td = $(document.createElement('td')).appendTo(tr);
                td.text(thumbNailViewItem.createSmartTextString(smartTextRow, dataRow));

            }
            return divFrontContent;
        },
        createBackContentContainer: function(thumbNailViewItem, dataRow){
            var self = this;
            var divBackContent = $(document.createElement('div'))
                .attr(thumbNailViewItem.constants.divBackContent);
            thumbNailViewItem.elements.divBackContent = divBackContent;
            thumbNailViewItem.elements.dataSourceElements = {};


            var tableSmartTextRows = $(document.createElement('table'))
                .attr(thumbNailViewItem.constants.tableSmartTextRows)
                .appendTo(divBackContent);
            thumbNailViewItem.elements.tableSmartTextRows = tableSmartTextRows;

//
            for(var key in thumbNailViewItem.smartTextRows.backTable){
                var smartTextRow = thumbNailViewItem.smartTextRows.backTable[key];
                var tr = $(document.createElement('tr')).appendTo(tableSmartTextRows);
                var td = $(document.createElement('td')).appendTo(tr);
                td.text(thumbNailViewItem.createSmartTextString(smartTextRow, dataRow));
            }
            return divBackContent;
        },
        createThumbNailViewFrontContainer: function(thumbNailViewItem){
            var div = $(document.createElement('div')).attr({id: thumbNailViewItem.id, class: thumbNailViewItem.constants.thumbNailViewItemFrontContainer.class});
            return div;
        },
        createThumbNailBackContainer: function(thumbNailViewItem){
            var div = $(document.createElement('div')).attr({id: thumbNailViewItem.id, class: thumbNailViewItem.constants.thumbNailViewItemBackContainer.class});
            return div;
        }
    }
}