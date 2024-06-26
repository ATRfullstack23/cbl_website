/**
 * ------------------------------------------------------------------------
 * Line Chart - Created by Akhil Sekharan on 12/24/13.
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
function BarChart(config){
    var self = this;
    self.config = config;
    self.initialize();
    return self;
}
BarChart.prototype={
    constants: {
        container:{
            "class": "barChartContainer"
        },
        barChartDiv:{
            "class": "barChartDiv"
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
        var container = $(document.createElement('div')).attr(self.constants.container);
        self.container = container;

        var tooltipDiv = $(document.createElement('div'))
            .attr(self.constants.tooltipDiv);
        self.elements.tooltipDiv = tooltipDiv.appendTo(container);

        self.elements.container = container;
        self.container.appendTo(self.config.parentContainer)
        var barChart = self.createBarChart().appendTo(container);
        self.elements.chart = barChart;


        self.elements.chart.find('.'+ self.constants.floatingLabel.class).remove();

        setTimeout(function(){
            self.elements.chart.find('.ct-bar').each(function(){
                var bar = $(this),
                    value = bar.attr('ct:value');

                var floatingLabel = $(document.createElement('div'))
                    .attr(self.constants.floatingLabel)
                    .appendTo(container);
                floatingLabel
                    .html(value)
                    .css({
                        left: bar.position().left - floatingLabel.outerWidth()/2,
                        top: bar.position().top - floatingLabel.outerHeight() - 8
                    });
            });
        }, 100);
        return self;
    },
    createBarChart: function(){
        var self = this;
        var config = self.config;
        var barChartDiv = $(document.createElement('div'))
            .attr(self.constants.barChartDiv)
            .addClass('ct-chart');
        barChartDiv.appendTo(self.container);

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
        var chart = new Chartist.Bar(barChartDiv.get(0), data, options);
        self.chart = chart;
        return barChartDiv;
    },
    createBarChart_old_2: function(){
        var self = this;
        var config = self.config;
        var barChartDiv = $(document.createElement('div')).attr(self.constants.barChartDiv);
        barChartDiv.appendTo(self.container);
        var chart = new Charts.LineChart(barChartDiv.get(0),  {
            line_color: "90-#0a5200-#118800",
            label_min: false,
            show_grid: true,
            render: "bar",
            bar_width: 32
        });

        chart.add_line({
            data: config.data
        });
        chart.width = config.width;
        chart.height = config.height;
        window.chart = chart;
        chart.draw();
        chart.r.canvas.style.marginTop = config.top + 'px';
        chart.r.canvas.style.marginLeft = config.left + 'px';
        chart.r.canvas.setAttribute('width', config.canvasWidth || 350);
        chart.r.canvas.setAttribute('height', config.canvasHeight || 250);
        self.elements.svg = chart.r.canvas;
//        chart.r.canvas.style.position = '';
        return barChartDiv;
    },
    createBarChart_Old_1: function(){
        var self = this;
        var config = self.config;
        var barChartDiv = $(document.createElement('div')).attr(self.constants.barChartDiv);
        var r = Raphael(barChartDiv);
        var barchart = r.barchart(config.left, config.top, config.width, config.height, config.data.valuesArray, {})
            .hover(function(){
                this.flag = r.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
            }, function () {
                this.flag.animate({opacity: 0}, 300, function () {this.remove();});
            });
        barChartDiv.append(r.canvas);
        r.canvas.setAttribute('width', self.config.canvasWidth || 350);
        r.canvas.setAttribute('height', self.config.canvasHeight || 250);
        r.canvas.style.position = '';
        return barChartDiv;
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