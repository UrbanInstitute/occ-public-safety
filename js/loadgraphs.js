var mobile_threshold = 600;
var data;
var linechart_data_url = "data/linerates.csv";

var linechart_aspect_width = 1;
var linechart_aspect_height = 1.5;

var options,
    $homchart,
    $linechart;

function leftdraw_dc() {
    $linechart = $('#linedc');
    options = {
        years: [2000, 2013.5],
        max: 1000,
        axlabel: " per 100,000 residents"
    };
    data = data_cl.filter(function (d) {
        return d.cluster == 0;
    });
    linedraw("#linedc");
}

function homdraw_dc() {
    $homchart = $('#homdc');
    options = {
        years: [2000, 2013.5],
        max: 50,
        axlabel: " per 100,000 residents",
        yformat: '.0f'
    };
    data = data_cl.filter(function (d) {
        return d.cluster == 0;
    });
    homdraw("#homdc");
}

function leftdraw_l() {
    $linechart = $('#linel');
    options = {
        years: [2000, 2014.5],
        max: 40,
        axlabel: " per 1,000 residents"
    };
    data = data_cl.filter(function (d) {
        return d.cluster == 27;
    });
    linedraw("#linel");
}

function homdraw_l() {
    $homchart = $('#homl');
    options = {
        years: [2000, 2014.5],
        max: 4,
        axlabel: " per 1,000 residents",
        yformat: '.1f'
    };
    data = data_cl.filter(function (d) {
        return d.cluster == 27;
    });
    homdraw("#homl");
}

function leftdraw_h() {
    $linechart = $('#lineh');
    options = {
        years: [2000, 2014.5],
        max: 40,
        axlabel: " per 1,000 residents"
    };
    data = data_cl.filter(function (d) {
        return d.cluster == 29;
    });
    linedraw("#lineh");
}

function homdraw_h() {
    $homchart = $('#homh');
    options = {
        years: [2000, 2014.5],
        max: 4,
        axlabel: " per 1,000 residents",
        yformat: '.1f'
    };
    data = data_cl.filter(function (d) {
        return d.cluster == 29;
    });
    homdraw("#homh");
}

function linedraw(div) {
    var margin = {
            top: 50,
            right: 5,
            bottom: 25,
            left: 5
        },
        numticks = 6;
    var width = $linechart.width() - margin.left - margin.right,
        height = Math.ceil((width * linechart_aspect_height) / linechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $linechart.empty();

    var formatAxis = d3.format('.0f');
    var labels = ["Robbery", "Aggravated Assault"];

    var x = d3.scale.linear()
        .range([padding, width])
        .domain(options.years);

    var y = d3.scale.linear()
        .domain([0, options.max])
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#54b849", "#fdbf11"])
        .domain(labels);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(formatAxis)
        .ticks(numticks);

    var line = d3.svg.line()
        //.interpolate("basis")
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.rate);
        });

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(d3.keys(data[0]).filter(function (key) {
        return key == "robrate" | key == "assaultrate";
    }));

    var types = color.domain().map(function (name) {
        return {
            name: name,
            values: data.map(function (d) {
                return {
                    year: d.year,
                    rate: +d[name]
                };
            })
        };
    });

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(width)
        .tickFormat(formatYAxis)
        .orient("right")
        .ticks(6);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    gy.selectAll("g").filter(function (d) {
            return d;
        })
        .classed("minor", true);

    gy.selectAll("text")
        .attr("x", 0)
        .attr("dy", -4);

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis);

    var type = svg.selectAll(".type")
        .data(types)
        .enter().append("g")
        .attr("class", "type");

    type.append("path")
        .attr("class", "chartline")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            return color(d.name);
        });

    var legend = svg.selectAll("g.legend")
        .data(labels)
        .enter().append("g");

    var l_h = 9;

    legend.append("rect")
        .attr("id", function (d) {
            return d;
        })
        .attr("x", function (d, i) {
            return 5 + (100 * i);
        })
        .attr("y", -45)
        .attr("width", 15)
        .attr("height", l_h)
        .style("fill", function (d, i) {
            return color(d);
        });

    legend.append("text")
        .attr("id", function (d) {
            return d;
        })
        .attr("x", function (d, i) {
            return 23 + (100 * i);
        })
        .attr("y", -35)
        .attr("class", "axis")
        .text(function (d, i) {
            return labels[i];
        });

    function formatYAxis(d) {
        var s = formatAxis(d);
        return d === y.domain()[1] ? s + options.axlabel : s;
    }
}

function homdraw(div) {
    var margin = {
            top: 50,
            right: 5,
            bottom: 25,
            left: 5
        },
        numticks = 6;
    var width = $homchart.width() - margin.left - margin.right,
        height = Math.ceil((width * linechart_aspect_height) / linechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $homchart.empty();

    var formatAxis = d3.format(options.yformat);
    var formatXAxis = d3.format('.0f');
    var labels = ["Homicide"];

    var x = d3.scale.linear()
        .range([padding, width])
        .domain(options.years);

    var y = d3.scale.linear()
        .domain([0, options.max])
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#ec008b"])
        .domain(labels);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(formatXAxis)
        .ticks(numticks);

    var line = d3.svg.line()
        //.interpolate("basis")
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.rate);
        });

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(d3.keys(data[0]).filter(function (key) {
        return key == "homrate";
    }));

    var types = color.domain().map(function (name) {
        return {
            name: name,
            values: data.map(function (d) {
                return {
                    year: d.year,
                    rate: +d[name]
                };
            })
        };
    });

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(width)
        .tickFormat(formatYAxis)
        .orient("right")
        .ticks(4);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    gy.selectAll("g").filter(function (d) {
            return d;
        })
        .classed("minor", true);

    gy.selectAll("text")
        .attr("x", 0)
        .attr("dy", -4);

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxis);

    var type = svg.selectAll(".type")
        .data(types)
        .enter().append("g")
        .attr("class", "type");

    type.append("path")
        .attr("class", "chartline")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            return color(d.name);
        });


    function formatYAxis(d) {
        var s = formatAxis(d);
        return d === y.domain()[1] ? s + options.axlabel : s;
    }
}

var mobile_threshold = 768;
var $clustergraphs = $('#clustergraphs');

var barchart_data_url = "data/clusters_violentcrime.csv";
var $barchart = $('#barchart');
var barchart_aspect_width = 3;
var barchart_aspect_height = 1;

var clustermap_data_url = "data/neighborhoods.json";
var $clustermap = $('#clustermap');
var clustermap_aspect_width = 1;
var clustermap_aspect_height = 1.1;

var $legend = $('#legend');
var legend_aspect_width = 1;
var legend_aspect_height = 1.9;

var colors = ["#001634", "#18507d", "#0096d2", "#82c2e7", "#d7e8f6", "#ffedcd", "#ffda91", "#fcb918"],
    breaks = [-30, -20, -10, -1, 0, 1, 10],
    legend_num = [1, 2, 3, 4, 5, 6, 7, 8];
//shared color ramp for both bar chart and map
var color = d3.scale.threshold()
    .domain(breaks)
    .range(colors);

function legenddraw() {
    var margin = {
        top: 5,
        right: 2,
        bottom: 5,
        left: 2
    };
    var width = $legend.width() - margin.left - margin.right,
        height = Math.ceil((width * legend_aspect_height) / legend_aspect_width) - margin.top - margin.bottom;

    $legend.empty();

    var svg = d3.select("#legend").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if ($clustergraphs.width() < mobile_threshold) {

        var lp_h = 18,
            ls_w = width / 8;

        var legend = svg.selectAll("g.legend")
            .data(legend_num)
            .enter().append("g")
            .attr("class", "legend");

        legend.append("text")
            .data(breaks)
            .attr("x", function (d, i) {
                return (i * ls_w) + ls_w - 5;
            })
            .attr("y", 30)
            .text(function (d, i) {
                return d;
            });

        legend.append("rect")
            .attr("y", 0)
            .attr("x", function (d, i) {
                return (i * (ls_w));
            })
            .attr("width", ls_w)
            .attr("height", lp_h)
            .attr("z-index", 10)
            .style("fill", function (d, i) {
                return colors[i];
            })
    } else {

        var lp_h = 20,
            ls_w = 40,
            ls_h = 22;

        var legend = svg.selectAll("g.legend")
            .data(legend_num)
            .enter().append("g")
            .attr("class", "legend");

        legend.append("text")
            .data(breaks)
            .attr("x", ls_w + 5)
            .attr("y", function (d, i) {
                return height - ((i * ls_h) + lp_h - 2);
            })
            .text(function (d, i) {
                return d;
            });

        legend.append("rect")
            .attr("x", 0)
            .attr("y", function (d, i) {
                return height - ((i * ls_h) + lp_h);
            })
            .attr("width", ls_w)
            .attr("height", lp_h)
            .attr("z-index", 10)
            .style("fill", function (d, i) {
                return colors[i];
            })
    }
}

function bardraw(id) {
    
    data = data_bar;
    var margin = {
        top: 5,
        right: 35,
        bottom: 5,
        left: 15
    };
    var width = $barchart.width() - margin.left - margin.right,
        height = Math.ceil((width * barchart_aspect_height) / barchart_aspect_width) - margin.top - margin.bottom;

    $barchart.empty();

    var svg = d3.select(id).append("svg")
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
        .domain([-46, 13]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("right")
        .tickSize(width)
        .tickValues([10, 0, -10, -20]);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    gy.selectAll("g").filter(function (d) {
            return d;
        })
        .classed("minor", true);

    gy.selectAll("text")
        .attr("class", "baraxis")
        .attr("dx", 4);

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
        .attr("class", "bar")
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

    svg.append("text")
        .attr("x", x.rangeBand() * 2)
        .attr("y", function (d) {
            return y(11);
        })
        .text(function (d) {
            return "Increase in crime";
        })
        .attr("fill", "#fcb918")
        .attr("class", "legend");

    svg.append("text")
        .attr("x", width * 0.53)
        .attr("y", function (d) {
            return y(-13);
        })
        .text(function (d) {
            return "Decrease in crime";
        })
        .attr("fill", "#18507d")
        .attr("class", "legend");


    function type(d) {
        d.rawchange14 = +d.rawchange14;
        return d;
    }

}

function mapdraw(id) {
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

    var svg = d3.select(id).append("svg")
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
        .attr('id', function (d) {
            return "v" + d.properties.cluster;
        })
        .attr("class", "boundary")
        .attr("fill", function (d) {
            return color(d.properties.crimechange);
        })
        .attr("d", path);
}

$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart


    }
});

function linecharts() {
    leftdraw_dc();
    homdraw_dc();
    leftdraw_l();
    homdraw_l();
    leftdraw_h();
    homdraw_h();
}

function clusterslide() {
    legenddraw();
    bardraw("#barchart");
    mapdraw("#clustermap");

    var allbars = d3.selectAll("rect,path");
    allbars.on("mouseover", function () {
        var moused_id = this.id;
        allbars.classed("selected", function () {
            return this.id === moused_id;
        });
    })

    allbars.on("mouseout", function () {
        allbars.classed("selected", false);
    })
}

function drawall() {
    linecharts();
    clusterslide();
}

$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        d3.csv(linechart_data_url, function (error, line) {
            data_cl = line;
            d3.csv(barchart_data_url, function (error, rates) {
                data_bar = rates;
                d3.json(clustermap_data_url, function (error, dc2) {
                    if (error) throw error;
                    dc = dc2;
                    drawall();
                    window.onresize = drawall();
                });
            });
        });
    }
});