/**
 * Created by Akhil Sekharan on 12/5/13.
 *
 * Sample Data Config
 var config = {
            left: 20,
            top: 54,
            width: 300,
            height: 180,
            data:{
                valuePosition: [[1, 2, 3, 4, 5, 6, 7],[3.5, 4.5, 5.5, 6.5, 7, 8],[2,5, 5.8, 7,8.6, 9, 11]],
                valueToDisplay: [[12, 32, 23, 15, 17, 27, 22], [10, 20, 30, 25, 15, 28],[9,34, 39, 49, 58, 65, 37]]
            }
        }
 */

function Graph(config, parentObject) {
    var self = this;
    self.config = config;
    self.graphManager = parentObject;
    self.subReport = self.graphManager.parentObject;
    self.report = self.subReport.parentObject;
    self.parentObject = parentObject;
    self.erp = self.subReport.erp;
    self.initialize();
    return self;
}

Graph.GRAPH_TYPES = {};
Graph.GRAPH_TYPES.PIE = 'pie';
Graph.GRAPH_TYPES.LINE = 'line';
Graph.GRAPH_TYPES.BAR = 'bar';

Graph.prototype = {
    constants: {
        container: {
            "class": "graph-container subReportItem"
        },
        mainContainer:{
            "class": "mainContainer"
        },
        spanDisplayName: {
            "class": "graph-spanDisplayName"
        },
        divHeader: {
            "class": "graph-divHeader divHandle"
        },
        btnExportToImage:{
            "class": "graph-btnExportToImage icon"
        },
        divContent: {
            "class": "graph-divContent"
        },
        spanTextContent: {
            "class": "graph-spanTextContent"
        },
        spanQueryContent: {
            "class": "graph-spanQueryContent text-loading"
        }
    },
    initialize: function () {
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }

        self.createElements().bindEvents();
        self.setDeviceTypeDisplayMode();
        self.elements.btnExportToImage.hide();//Not Working
        return self;
    },
    setDeviceTypeDisplayMode: function(){
        var self = this;
        self.container.addClass(self.erp.deviceType);
        return self;
    },
    bindEvents: function () {
        var self = this;
        self.elements.btnExportToImage.on('click', function(){
            self.saveGraphAsImage();
        });
        return self;
    },
    saveGraphAsImage: function(){
        var self = this;
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        var svg = self.chart.elements.chart.find('svg').get(0);
        window.svg = svg;
        canvas.width = svg.clientWidth;
        canvas.setAttribute('height', svg.clientHeight);
        canvg(canvas, '<svg>'+svg.innerHTML+ '</svg>');
        window.c = canvas;
        setTimeout(function(){
            canvas.toBlob(function(blob){
                saveAs(blob, self.displayName + ' ' +moment().format('DD-MMM-YYYY hh:mm:ss a')+'.png');
            }, 'image/png');
        }, 500);
        return self;
    },
    setPositionAndSize: function(positionObj){
        var self = this;
        if(!positionObj){
            return;
        }
        self.positionObj = positionObj;
//        self.container.css({left: positionObj.left, top: positionObj.top});
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
        self.positionObj = obj;
        return obj;
    },
    setToNormalMode: function(){
        var self = this;
        self.isInReorderMode = false;
        self.container.resizable('destroy').draggable('destroy');
        return self;
    },
    setToReorderMode: function(){
        var self = this;
        self.isInReorderMode = true;
        self.container.resizable().draggable({ containment: self.subReport.container, scroll: false },{handle :'.divHandle'});
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
            case Graph.FILTER_TYPES.FREE_SEARCH:
                value = self.getGraphFormElement().val();
                break;
        }
        return value;
    },
    setCurrentEditValue: function(value){
        var self = this;
        switch(self.type){
            case Graph.FILTER_TYPES.FREE_SEARCH:
                self.getGraphFormElement().val(value);
                break;
        }
        return value;
    },
    resetValues: function(){
        var self = this;
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
        var url = '/ajax/reports/' + self.report.id + '/' +self.subReport.id + '/getGraphData/'+ self.id;
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
                self.graphDataReceived(data.result);
                //self.dataTimestamp = data.timestamp;
            }
            else{
                self.setToErrorMode(data.errorMessage);
                //self.subReport.notifier.showReportableErrorNotification('Error getting data for '+ self.displayName+'('+ data.errorMessage +')');
            }
        });
        return self;
    },

    graphDataReceived: function(data){
        var self = this;
        self.hideOverLay();
        self.currentData = data;
        self.removeChart();
        self.createChart();
        return self;
    },
    createChart: function(){
        var self = this;
        switch (self.type){
            case Graph.GRAPH_TYPES.PIE:
                self.createPieChart();
                break;
            case Graph.GRAPH_TYPES.LINE:
                self.createLineChart();
                break;
            case Graph.GRAPH_TYPES.BAR:
                self.createBarChart();
                break;
        }
        return self;
    },
    removeChart: function(){
        var self = this;
        if(self.chart){
            self.chart.container.remove();
        }
        return self;
    },
    redraw: function(){
        var self = this;
        self.removeChart();
        self.createChart();
        return self;
    },
    createPieChart: function(){
        var self = this;
        var config = {};
        config.addPercent = true;
        config.data = self.currentData.data;
        config.parentContainer = self.elements.divContent;

        var radiusX = 0;
        var radiusY = 0;
        var divContentWidth = self.elements.divContent.width();
        var divContentHeight = self.elements.divContent.height();
        radiusX = (divContentWidth-150)/2;
        radiusY = divContentHeight/2.5;
        if(radiusX < radiusY){
            config.pieRadius = radiusX;
        }
        else{
            config.pieRadius = radiusY;
        }
        config.posX = config.pieRadius+25;
        config.posY = divContentHeight/2;
        window.config = config;
        config.canvasWidth = divContentWidth - 25;
        config.canvasHeight = divContentHeight - 25;
        var pieChart = new PieChart(config);
        self.chart = pieChart;
        return self;
    },
    createLineChart_Old: function(){
        var self = this;

        var items = [];
        self.currentData.data.forEach(function(item){
            var tempArr = [];
            var d = new Date();
            var m = moment(item.date);
            d.setMonth(m.month());
            d.setDate(m.date());
            d.setYear(m.year());
            tempArr[0] = d;
            tempArr[1] = item.value;
            items.push(tempArr);
        });
        var config = {
            left: 20,
            top: 50,
            data: items
        }
        config.canvasWidth = self.elements.divContent.width() - 25;
        config.canvasHeight = self.elements.divContent.height() - 25;
        config.width = config.canvasWidth-60;
        config.height = config.canvasHeight-60;
        config.parentContainer = self.elements.divContent;

        var lineChart = new LineChart(config);
        self.chart = lineChart;
        return self;
    },
    createLineChart: function(){
        var self = this;
        var config = {
            data: self.currentData.data,
            dateFormat: self.typeSpecific.dateFormat
        };
        config.width = self.elements.mainContainer.width();
        config.height = self.elements.mainContainer.height();
        config.parentContainer = self.elements.divContent;

        var lineChart = new LineChart(config);
        self.chart = lineChart;
        return self;
    },
    createBarChart: function(){
        var self = this;
        var config = {
            data: self.currentData.data,
            dateFormat: self.typeSpecific.dateFormat
        };
        config.width = self.elements.mainContainer.width();
        config.height = self.elements.mainContainer.height();
        config.parentContainer = self.elements.divContent;

        var barChart = new BarChart(config);
        self.chart = barChart;
        return self;
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self);
        return self;
    },
    isDisabledNow: function(){
        var self = this;
        return self.getGraphFormElement().prop('disabled');
    },
    triggerEvent: function(graphMode, eventType){
        var self = this;
        if(!self.isDisabledNow(graphMode)){
            self.getElement(graphMode).trigger(eventType);
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



//    getGraphFormElement: function(index){
//        var self = this;
//        return self.elements.formElements.element;;
//    },
    _creation : {
        createContainer: function(graph){
            var div = $(document.createElement('li')).attr({'data-row':"1", 'data-col':"1", 'data-sizex':"1",'data-sizey':"1",id: graph.id, class: graph.constants.container.class});
            return div;
        },
        createMainContainer: function(graph){
            var div = $(document.createElement('div')).attr(graph.constants.mainContainer);
            return div;
        },
        createHeader: function(graph){
            var divHeader = $(document.createElement('div'))
                .attr(graph.constants.divHeader);
            graph.elements.divHeader = divHeader;

            var spanDisplayName = $(document.createElement('span'))
                .attr(graph.constants.spanDisplayName)
                .text(graph.displayName).appendTo(divHeader);
            graph.elements.spanDisplayName = spanDisplayName;

            var btnExportToImage = $(document.createElement('div'))
                .attr(graph.constants.btnExportToImage)
                .appendTo(divHeader);
            graph.elements.btnExportToImage = btnExportToImage;
            return divHeader;
        },
        createSpanTextContent: function(item, graph){
            var div = $(document.createElement('span'))
                .attr(graph.constants.spanTextContent)
                .text(item.value);
            return div;
        },
        createSpanQueryContent: function(item, graph){
            var div = $(document.createElement('span'))
                .attr(graph.constants.spanQueryContent)
                .attr({id: item.id})
                .text('...');
            return div;
        },
        createContentContainer: function(graph){
            var self = this;
            var divContent = $(document.createElement('div'))
                .attr(graph.constants.divContent);
            graph.elements.divContent = divContent;

            return divContent;
        },
        createElements: function(graph){
            var self = this;
            var container = self.createContainer(graph);

            graph.elements = {};
            graph.container = container;
            graph.elements.container = container;

            var divMainContainer = self.createMainContainer(graph);
            var divHeader = self.createHeader(graph);
            var divContent = self.createContentContainer(graph);

            if(graph.hidden){
                container.addClass('hidden');
            };

            divMainContainer.append(divHeader).append(divContent);


            container.append(divMainContainer);
            graph.elements.mainContainer = divMainContainer;
            return self;
        },
        createFreeSearch: function(graph){
            var self = this;
            var element = $(document.createElement('input')).attr({id: 'graph_'+graph.id, "type": "text"});
            graph.elements.formElements.element = element;
            return element;
        }
    },
    _events   : {
    },
    _ui       : {
    }
}