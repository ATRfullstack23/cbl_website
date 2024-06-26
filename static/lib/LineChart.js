/**
 * ------------------------------------------------------------------------
 * Line Chart - Created by Sanal K S on 12/24/13.
 * Allow Html5 create Line Chart using jquery
 * ---------------------------------------------------------------------------------------------------
 * Dependencies
 *      raphael-min.js
 *      g.raphael-min.js
 *      g.line.js
 *      jquery.min.js
 * ---------------------------------------------------------------------------------------------------
 * jquery
 * ---------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------
 * Configuration
 * ---------------------------------------------------------------------------------------------------
 * {
        left: 200,      //left position
        top: 140,       //top position
        width: 300,     //width of chart
        height: 180,    //height of chart
        data:{
            valuePosition: [[1, 2, 3, 4, 5, 6, 7],[3.5, 4.5, 5.5, 6.5, 7, 8]],        //Position of value
            valueToDisplay: [[12, 32, 23, 15, 17, 27, 22], [10, 20, 30, 25, 15, 28]]  //Value to display
        }
   }
 * ----------------------------------------------------------------------------------------------------
 */
function LineChart(config){
    var self = this;
    self.config = config;
    self.initialize();
    return self;
}
LineChart.prototype={
    constants: {
        container:{
            "class": "lineChartContainer"
        },
        lineChartDiv:{
            "class": "lineChartDiv"
        },
        floatingLabel: {
            "class": "floatingLabel"
        },
        tooltipDiv: {
            "class": "tooltipDiv"
        }
    },
    initialize: function(){
        var self = this;
        self.createElements();
        return self;
    },
    createElements: function(){
        var self = this;
        self.elements = {};
        var container = $(document.createElement('div'))
            .attr(self.constants.container);
        self.container = container;
        self.elements.container = container;
        self.container.appendTo(self.config.parentContainer);

        var tooltipDiv = $(document.createElement('div'))
            .attr(self.constants.tooltipDiv);
        self.elements.tooltipDiv = tooltipDiv.appendTo(container);

        var lineChart = self.createLineChart()
	.appendTo(container);
	self.elements.chart = lineChart;
	
    	self.elements.chart
	.find('.'+ self.constants.floatingLabel.class).remove();
	
	setTimeout(function(){
	self.elements.chart.find('.ct-point').each(function(index){
		var point = $(this),
			value = point.attr('ct:value');
                var item = self.config.data[index];
                var floatingLabel = $(document.createElement('div'))
                    .attr(self.constants.floatingLabel)
                    .appendTo(container);
                if(item.title){
                    floatingLabel.attr('title', item.title);
                }

                floatingLabel
                    .html(value)
                    .css({
                        left: point.position().left - floatingLabel.outerWidth()/2,
                        top: point.position().top - floatingLabel.outerHeight() - 8
                    });
            });
        }, 100);

        return self;
    },
    createLineChart: function(){
        var self = this;
        var config = self.config;
        var lineChartDiv = $(document.createElement('div'))
            .attr(self.constants.lineChartDiv)
            .addClass('ct-chart');
        lineChartDiv.appendTo(self.container);

        var labels = [];
        var series1 = [];
        config.data.forEach(function(item){
            var label;
            if(item.date){
                labels.push( moment(item.date).format(self.config.dateFormat || 'DD-MMM-YYYY'));
            }
            else{
                labels.push(item.text);
            }
            series1.push(item.value);
        });


        var options = {
            width: config.width,
            height: config.height,
            showArea: true
        };
        var data = {
            labels: labels,
            series: [
                series1
            ]
        };
        var chart = new Chartist.Line(lineChartDiv.get(0), data, options);


        self.chart = chart;


//
//        chart.width = config.width;
//        chart.height = config.height;
//        chart.draw();
//        chart.r.canvas.style.marginTop = config.top + 'px';
//        chart.r.canvas.style.marginLeft = config.left + 'px';
//        chart.r.canvas.setAttribute('width', config.canvasWidth || 350);
//        chart.r.canvas.setAttribute('height', config.canvasHeight || 250);
//        self.elements.svg = chart.r.canvas;
//        chart.r.canvas.style.position = '';
        return lineChartDiv;
    },
    createLineChart_Old_2: function(){
        var self = this;
        var config = self.config;
        var lineChartDiv = $(document.createElement('div')).attr(self.constants.lineChartDiv);
        lineChartDiv.appendTo(self.container);
        var chart = new Charts.LineChart(lineChartDiv.get(0),  {
            line_width: 1,
            label_min: true,
            label_max: true,
            show_grid: true,
            area_opacity:.2,
            max_y_labels: 10
        });

        chart.add_line({
            data: config.data
        });
        chart.width = config.width;
        chart.height = config.height;
        chart.draw();
        chart.r.canvas.style.marginTop = config.top + 'px';
        chart.r.canvas.style.marginLeft = config.left + 'px';
        chart.r.canvas.setAttribute('width', config.canvasWidth || 350);
        chart.r.canvas.setAttribute('height', config.canvasHeight || 250);
        self.elements.svg = chart.r.canvas;
//        chart.r.canvas.style.position = '';
        return lineChartDiv;
    },
    createLineChart_Old_1: function(){
        var self = this;
        var config = self.config;
        var lineChartDiv = $(document.createElement('div')).attr(self.constants.lineChartDiv);
        var r = Raphael(lineChartDiv);
        var lines = r.linechart(config.left, config.top, config.width, config.height, config.data.valuePosition, config.data.valueToDisplay, { nostroke: false, shade: true, axis: "0 0 1 1", symbol: "circle", smooth: false })
            .hoverColumn(function () {
                this.tags = r.set();
                for (var i = 0, ii = this.y.length; i < ii; i++) {
                    this.tags.push(r.tag(this.x, this.y[i], this.values[i], 160, 10).insertBefore(this).attr([{ fill: "#fff" }, { fill: this.symbols[i].attr("fill") }]));
                }
            }, function () {
                this.tags && this.tags.remove();
            });
        lineChartDiv.append(r.canvas);
        r.canvas.setAttribute('width', self.config.canvasWidth || 350);
        r.canvas.setAttribute('height', self.config.canvasHeight || 250);
        r.canvas.style.position = '';
        return lineChartDiv;
    }
}

var configureation = {
    left: 200,
    top: 140,
    width: 300,
    height: 180,
    data:{
        valuePosition: [[1, 2, 3, 4, 5, 6, 7],[3.5, 4.5, 5.5, 6.5, 7, 8],[2,5, 5.8, 7,8.6, 9, 11]],
        valueToDisplay: [[12, 32, 23, 15, 17, 27, 22], [10, 20, 30, 25, 15, 28],[9,34, 39, 49, 58, 65, 37]]
    }
}
