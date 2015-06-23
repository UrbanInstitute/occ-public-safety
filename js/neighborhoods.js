var barchart_data_url = "data/clusters_violentcrime.csv";
var $barchart = $('#barchart');
var barchart_aspect_width = 3;
var barchart_aspect_height = 1;

var clustermap_data_url = "data/neighborhoods.json";
var $clustermap = $('#clustermap');
var clustermap_aspect_width = 1;
var clustermap_aspect_height = 1;

//shared color ramp for both bar chart and map
var color = d3.scale.threshold()
    .domain([-200, -100, -10, 0, 10, 100])
    .range(["#00578b", "#1696d2", "#82c4e9", "#e4eef9", "#ffecc5", "#ffda91", "#fcb918"]);

function clusterslide() {
    bardraw();
    mapdraw();
}

function bardraw() {
    var margin = {
        top: 5,
        right: 30,
        bottom: 30,
        left: 60
    };
    var width = $barchart.width() - margin.left - margin.right,
        height = Math.ceil((width * barchart_aspect_height) / barchart_aspect_width) - margin.top - margin.bottom;

    $barchart.empty();

    var svg = d3.select("#barchart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.sort(function (a, b) {
        return b.rawchange14 - a.rawchange14;
    });

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(data.map(function (d) {
            return d.cluster;
        }));

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([-455, 132]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width)
        .ticks(6);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    gy.selectAll("g").filter(function (d) {
            return d;
        })
        .classed("minor", true);

    var pctbar = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

    pctbar.append("rect")
        .attr('id', function (d) {
            return "v" + d.cluster;
        })
        .attr("fill", function (d) {
            return color(d.rawchange14);
        })
        .attr("class", "pctbar")
        .attr("x", function (d) {
            return x(d.cluster);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return Math.min(y(d.rawchange14), y(0));
        })
        .attr("height", function (d) {
            return Math.abs(y(0) - (y(d.rawchange14)));
        });


    function type(d) {
        d.rawchange14 = +d.rawchange14;
        return d;
    }

}

function mapdraw() {
    var margin = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    };
    var width = $clustermap.width() - margin.left - margin.right,
        height = Math.ceil((width * clustermap_aspect_height) / clustermap_aspect_width) - margin.top - margin.bottom;

    $clustermap.empty();

    var projection = d3.geo.mercator();

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#clustermap").append("svg")
        .attr("width", width)
        .attr("height", height);

    var neighborhoods = topojson.feature(dc, dc.objects.neighborhood_clusters);
    projection
        .scale(1)
        .translate([0, 0]);

    var b = path.bounds(neighborhoods),
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
        .scale(s)
        .translate(t);

    svg.append("g")
        .attr("class", "boundary")
        .selectAll("path")
        .data(topojson.feature(dc, dc.objects.neighborhood_clusters).features)
        .enter().append("path")
        .style("fill", function (d) {
            return color(d.properties.crimechange);
        })
        .attr("d", path);
}

$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart

        d3.csv(barchart_data_url, function (error, rates) {
            data = rates;
            d3.json(clustermap_data_url, function (error, dc2) {
                if (error) throw error;
                dc = dc2;
                clusterslide();
                window.onresize = clusterslide;
            });
        });
    }
});