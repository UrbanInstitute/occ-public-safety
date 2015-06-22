var mobile_threshold = 600;
var data;
var linechart_data_url = "data/dcrates.csv";

var $homchart = $('#homchart');
var $linechart = $('#linechart');
var linechart_aspect_width = 0.7;
var linechart_aspect_height = 1;

$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart

        d3.csv(linechart_data_url, function (error, rates) {
            data = rates;

            linecharts();
            window.onresize = linecharts;
        });

    }
});