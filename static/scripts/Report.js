/**
 * Created by Akhil Sekharan on 12/4/13.
 */

function Report(config, parentObject){
    var self = this;
    self.parentObject = parentObject;
    self.erp = parentObject;
    self.config = config;
    self.initialize();
    return self;
}

Report.prototype = {
    initialize: function(){
        var self = this;
        for(var key in self.config){
            self[key] = self.config[key];
        }

        self.initializeSubReports();

        self.subReportNavPointer = new Navigation({
            options: self.subReports,
            defaultValue: self.defaultSubReport,
            contentsContainer: self.container,
            displayMode: 'blocksInline',
			type: 'subReport',

            onChange: function(subReport){
//                var gridster = $('#'+self.id+' ul').gridster(
//                    {
//                        widget_margins: [5, 5],
//                        widget_base_dimensions: [250, 150],
//                        avoid_overlapped_widgets: true,
//                        resize: {
//                            enabled: true   ,
//                            axes: ['x', 'y', 'both'],
//                            handle_append_to: '',
//                            max_size: [Infinity, Infinity],
//                            stop: function(event, ui){
//                                var report = self;
//                                report.getSelectedSubReport().savePositionAndSize();
//                                var subReport =  report.getSelectedSubReport();
//                                if(subReport.graphManager.graphs){
//                                    var container = $(event.toElement.offsetParent).attr('id');
//                                    var div = $(event.toElement.offsetParent).find('.graph-divContent');
//                                    console.log(div)
//                                    for(var key in subReport.graphManager.graphs){
//                                        if(key ===container){
//                                            console.log(key)
//                                            $(div).children().remove();
//                                            subReport.graphManager.graphs[key].clearPieChart();
//                                            subReport.graphManager.graphs[key].createPieChart();
//                                            break;
//                                        }
//                                    }
//                                }else{
//                                    var report = self;
//                                    report.getSelectedSubReport().savePositionAndSize();
//                                }
//                            }
//                        },
//                        draggable:{
//                            enabled: true,
//                            axes: ['x', 'y', 'both'],
//                            stop: function(event, ui){
//                                console.log('draggable');
//                                var report = self;
//                                report.getSelectedSubReport().savePositionAndSize();
//                            }
//                        }
//                    });
                self.setSelectedSubReport(subReport);
            },
            classes: {
                element: 'subReports-nav-panel',
                divPointer: 'subReports-nav-pointer'
            }
        }, self);

        if(self.defaultSubReport){
            self.defaultSubReport = self.subReports[self.defaultSubReport];
        }
        else{
            var firstVisibleSubReport = self.getFirstVisibleSubReport(self.subReports);
            self.defaultSubReport = self.subReports[firstVisibleSubReport];
            //self.defaultSubReport = self.subReports[Object.keys(self.subReports)[0]];

        }
        self.selectedSubReport = self.defaultSubReport;


//$(self.subReportNavPointer.container[0].children[0])
//    .css({'width': '163px', 'top': '0px', 'left': '147px', 'height': '42px'});
//$(self.subReportNavPointer.container[0].children[1].children[0]).addClass('selected');

        self.getDefaultSubReport();
        if(self.selectedSubReport){
            self.subReportNavPointer.setValue(self.selectedSubReport.id, false);
        }
        self.createElements();
//        document.title = self.displayName;

        if(self.config.disableNavigation){
            self.elements.divNavigation.hide();
        }


        return self;
    },
    initializeSubReports: function(){
        var self = this;
        self.subReports = {};
        for(var key in self.config.subReports){
            var subReportConfig = $.extend({}, self.config.subReports[key]);
            if(self.randomId){
                subReportConfig.randomId = self.randomId;
            }
            if(self.isInFloatingWindow){
                subReportConfig.isInFloatingWindow = true;
            }
            self.subReports[subReportConfig.id] = new SubReport(subReportConfig, self);
        }
        return self;
    },
    bindEvents: function () {
        var self = this;
        return self;
    },
    show      : function () {
        var self = this;
        self.container.removeClass('hidden');
        return self;
    },
    hide      : function () {
        var self = this;
        self.container.addClass('hidden');
        return self;
    },
    getElement: function(){
        var self = this;
        return self.container;
    },
    forEachSubReport: function(eachFunction, filterFunction){
        var self = this;
        for(var key in self.subReports){
            var subReport = self.subReports[key];
            if(filterFunction){
                if(filterFunction(subReport)){
                    eachFunction.apply(subReport, [subReport]);
                }
            }
            else{
                eachFunction.apply(subReport, [subReport]);
            }
        }
        return self;
    },
    getSelectedSubReport: function(){
        var self = this;
        return self.selectedSubReport;
    },
    getDefaultSubReport: function(){
        var self = this;
        return self.defaultSubReport;
    },
    setSelectedSubReport: function(subReport, fromTrigger){
        var self = this;
        window._subReport = self.selectedSubReport;
        if(fromTrigger){
//            self.navPointer.setValue(subReport.id, true);
            self.selectedSubReportChanged(true);
            return;
        }
        if(self.selectedSubReport){
            self.selectedSubReport.hide();
        }
        if(!subReport.id){
            subReport = self.subReports[subReport];
        }
        self.selectedSubReport = subReport;
        self.selectedSubReport.show();
        self.selectedSubReportChanged();
        return self;
    },
    getFirstVisibleSubReport:function(subReportsObj){
        var self = this;
        var activeSubReports = {}
        for (var subReportsKey in subReportsObj){
            if(!subReportsObj[subReportsKey].hiddenFromMainNavigation){
                activeSubReports[subReportsKey] = subReportsObj[subReportsKey]
            }
        }
        var firstVisibleReport = Object.keys(activeSubReports)[0];
        return firstVisibleReport;
    },
    selectedSubReportChanged: function(fromTrigger){
        var self = this;
        var subReport = self.selectedSubReport;
        subReport.show();
        if(subReport.isInChildWindow){
            if( self.parentWindow){
                var value = self.parentDataRow[self.parentColumn.typeSpecific.referenceColumns.columnId];
                if(typeof value === 'object'){
                    if(value.text){
                        value = value.text;
                    }
                    else if(value.value){
                        value = value.value;
                    }
                }
                self.parentWindow.headerMessage = value;
            }
//            else{
//                console.log(self)
//            }
        }
        if(!fromTrigger){
//            subReport.grid.getData();
//            setTimeout(function(){
                subReport.refreshAllItems();
//            }, 1000);
        }
        return self;
    },
    _socket: {
        initialize: function(report){
            var self = this;
        }
    },
    createElements: function(){
        var self = this;
        self._creation.createElements(self)
        return self;
    },
    _creation : {
        createContainer: function(report){
            var div = $(document.createElement('div')).attr({id: report.id, class: 'report-panel hidden'});
            return div;
        },
        createElements: function(report){
            var self = this;

            var elements = {};

            var container = self.createContainer(report);

            var divNavigation = document.createElement('div');
            divNavigation.className = 'subReportNavigationContainer';
            divNavigation.appendChild(report.subReportNavPointer.getElement().get(0));
            container.append(divNavigation);

            var divSubReports = document.createElement('div');
            divSubReports.id = report.id+'_subReports-panel';
            divSubReports.className = 'subReports-panel';
            var noOfVisibleSubReports = 0;
            report.forEachSubReport(function(subReport){
                if(!subReport.hiddenFromMainNavigation){
                    noOfVisibleSubReports++;
                }
                divSubReports.appendChild(subReport.getElement().get(0));
            });
            container.append(divSubReports);

            if(report.erp.deviceType != ERP.DEVICE_TYPES.PC){
                if(noOfVisibleSubReports <= 1){
                    report.subReportNavPointer.hide();
                    divSubReports.classList.add('singleSubReportOnly');
                }
            }

            elements.divNavigation = $(divNavigation);
            elements.divSubReports = $(divSubReports);
            elements.container = container;
            report.elements = elements;
            report.container = container;
            return container;
        }
    },
    _events   : {
    },
    _ui       : {
    }
}

 
