/**
 * Created by Akhil Sekharan on 12/23/13.
 */

/**
 * ------------------------------------------------------------------------
 * Pie Chart - Created by Sanal K S on 12/23/13.
 * Allow Html5 create Pie Chart using jquery
 * ---------------------------------------------------------------------------------------------------
 * Dependencies
 *      raphael-min.js
 *      g.raphael-min.js
 *      g.pie-min.js
 *      jquery.min.js
 * ---------------------------------------------------------------------------------------------------
 * jquery
 * ---------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------
 * Configuration
 * ---------------------------------------------------------------------------------------------------
 *  {
 *  data:{
            sanal:20,
            sa:30,
            jithu:40,
            vishnu:10
        }
    }
 * ----------------------------------------------------------------------------------------------------
 */
function PieChart(config){
    var self = this;
    self.config = config;
    self.initialize();
    return self;
}
PieChart.prototype={
    constants:{
        pieChart:{
            "id": "pieChart"
        }
    },
    initialize: function(){
        var self = this;
        self.elements = {};
        self.createPieChart(self.config);
        return self;
    },
    createPieChart: function(config){
        var self = this;
        var pieChart = $(document.createElement('div'))
            .attr(self.constants.pieChart)
            .appendTo(self.config.parentContainer);
        self.container = pieChart;
        self.elements.container = pieChart;
        var arrValues = [];
        var arrNames = [];
        config.data.forEach(function(item){
            arrValues.push(item.percent);
            if(self.config.addPercent){
                arrNames.push( item.text+ '('+ (item.value || '') + ') - %%.%%');
            }
            else{
                arrNames.push(key);
            }
        });

//        for(var key in config.data){
//            var data = config.data[key];
//            arrValues.push(data);
//            if(self.config.addPercent){
//                arrNames.push( key + ' - %%.%%');
//            }
//            else{
//                arrNames.push(key);
//            }
//        }
        self.createChart(arrValues, arrNames);
        return self;
    },
    createChart: function(values, names){
        var self = this;
//        console.log(names)
        var paper = Raphael(self.container.get(0));
        var pie = paper.piechart(
            self.config.posX || 150, // pie center x coordinate
            self.config.posY || 125, // pie center y coordinate
            self.config.pieRadius || 100,  // pie radius
            values, // values
            {
                legend: names //names for values
            }
        );

        pie.hover(function () {
            this.sector.stop();
            this.sector.scale(1.01, 1.01, this.cx, this.cy);
            if (this.label) {
                this.label[0].stop();
                this.label[0].attr({ r: 9 });
                this.label[1].attr({ "font-weight": 800 });
            }
        }, function () {
            this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy },700, "bounce out");
            if (this.label) {
                this.label[0].animate({ r: 5 }, 700, "bounce out");
                this.label[1].attr({ "font-weight": 400 });
            }
        });
        paper.canvas.setAttribute('width', self.config.canvasWidth || 350);
        paper.canvas.setAttribute('height', self.config.canvasHeight || 250);
        paper.canvas.style.display = '';
        self.elements.svg = paper.canvas;
        return self
    }
}
//$(function () {
//    /*  var paper = Raphael("pie");
//     var arr = [18.373, 18.686, 30.867, 23.991,9.592, 99.213,110];
//     var arr1 = ["Windows/Windows Live", "Server/Tools", "Online Services", "Business", "Entertainment/Devices", "test","Unallocated/Other"];
//     pie = paper.piechart(
//     600, // pie center x coordinate
//     200, // pie center y coordinate
//     120,  // pie radius
//     arr, // values
//     {
//     legend: arr1 //names for values
//     //            colors: ["#000038", "#000066", "#0000ff", "#c7c7ff", "#a4a4b7", "#e0e0ef", "green", "red"]
//     //            legendothers: "Other"  // in which group it should display all other content
//     //            maxSlices: 9           // Number of slice to show
//     }
//     );
//     pie.hover(function () {
//     this.sector.stop();
//     this.sector.scale(1.1, 1.1, this.cx, this.cy);
//
//     if (this.label) {
//     this.label[0].stop();
//     this.label[0].attr({ r: 9 });
//     this.label[1].attr({ "font-weight": 800 });
//     }
//     }, function () {
//     this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy },700, "bounce out");
//
//     if (this.label) {
//     this.label[0].animate({ r: 5 }, 700, "bounce out");
//     this.label[1].attr({ "font-weight": 400 });
//     }
//     });*/
//    var chart = new PieChart(configration);
//});
//var configration = {
//    data:{
//
//        sanal:20,
//        sa:30,
//        akhil:32,
//        jithu:40,
//        vishnu:10
//
//    }
//}

