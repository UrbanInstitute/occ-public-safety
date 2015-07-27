var $clustergraphs = $('#clustergraphs');

var barchart_data_url = "data/clusters_violentcrime.csv";
var $barchart = $('#barchart');
var barchart_aspect_width = 3;
var barchart_aspect_height = 1;

var clustermap_data_url = "data/neighborhoods.json";
var $clustermap = $('#clustermap');
var clustermap_aspect_width = 1;
var clustermap_aspect_height = 0.7;

var $legend = $('#legend');
var legend_aspect_width = 1;
var legend_aspect_height = 1.9;

var colors = ["#18507d", "#0096d2", "#82c2e7", "#d7e8f6", "#ffedcd", "#ffda91", "#fcb918"],
    breaks = [-20, -10, -1, 0, 1, 10],
    legend_num = [1, 2, 3, 4, 5, 6, 7];
//shared color ramp for both bar chart and map
var color = d3.scale.threshold()
    .domain(breaks)
    .range(colors);

//small desktop #clustermaps width = 617

function legenddraw() {
    var margin = {
        top: 5,
        right: 2,
        bottom: 5,
        left: 2
    };

    var width = $legend.width() - margin.left - margin.right,
        height = 180;

    if ($clustergraphs.width() < mobile_threshold & $clustergraphs.width() !=617 & $clustergraphs.width() !=720) {
        height = 30;
    }

    $legend.empty();

    var svg = d3.select("#legend").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if ($clustergraphs.width() < mobile_threshold & $clustergraphs.width() !=617& $clustergraphs.width() !=720) {

        var lp_h = 18,
            ls_w = width / 7;

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
            ls_w = 20,
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

    data = ratechange;

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
        .attr("x", x.rangeBand() * 3)
        .attr("y", function (d) {
            return y(11);
        })
        .text(function (d) {
            return "Increase in crime";
        })
        .attr("class", "legend");

    svg.append("text")
        .attr("x", width * 0.53)
        .attr("y", function (d) {
            return y(-13);
        })
        .text(function (d) {
            return "Decrease in crime";
        })
        .attr("class", "legend");


    function type(d) {
        d.rawchange14 = +d.rawchange14;
        return d;
    }

}

function mapdraw(id) {

    var formatnum = d3.format('.0f');

    var margin = {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        },
        padding = 300;
    
    //desktops
    if ($clustergraphs.width() >= mobile_threshold | $clustergraphs.width() ==720) {
        clustermap_aspect_height = 0.7;
        padding = 300;
    }
        //small desktop
    else if ($clustergraphs.width() ==617) {
        clustermap_aspect_height = 0.8;
        padding = 200;
    }
    else if ($clustergraphs.width() < mobile_threshold & $clustergraphs.width() !=617 & $clustergraphs.width() !=720) {
        padding = 1;
        clustermap_aspect_height = 1.1;
    }


    //mw = map width - padding on the side is for tooltip
    var width = $clustermap.width() - margin.left - margin.right,
        height = Math.ceil((width * clustermap_aspect_height) / clustermap_aspect_width) - margin.top - margin.bottom;


    $clustermap.empty();

    var mw = width - padding;
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
        s = .95 / Math.max((b[1][0] - b[0][0]) / mw, (b[1][1] - b[0][1]) / height),
        t = [(mw - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
        .scale(s)
        .translate(t);

    svg.selectAll("path")
        .data(topojson.feature(dc, dc.objects.neighborhood_clusters).features)
        .enter().append("path")
        .attr('id', function (d) {
            return "v" + d.properties.cluster;
        })
        .attr('change', function (d) {
            return d.properties.crimechange;
        })
        .attr("class", "boundary")
        .attr("fill", function (d) {
            return color(d.properties.crimechange);
        })
        .attr("d", path);

    //"tooltips" have opacity = 0 when not selected, = 1 when selected aka the corresponding polygon or bar is hovered - basically they're all sitting there just not visible

    var tooltip = svg.selectAll("text")
        .data(topojson.feature(dc, dc.objects.neighborhood_clusters).features)
        .enter()
        .append("g");

    tooltip.append("text")
        .attr("class", "tooltip-num")
        .text(function (d) {
            return formatLabel(d.properties.crimechange);
        })
        .attr("id", function (d) {
            return "v" + d.properties.cluster;
        })
        .attr("x", width * 0.4)
        .attr("y", 40);

    tooltip.append("text")
        .attr("class", "tooltip-label")
        .text(function (d) {
            return formatLabel2(d.properties.crimechange);
        })
        .attr("id", function (d) {
            return "v" + d.properties.cluster;
        })
        .attr("x", width * 0.4)
        .attr("y", 63);

    tooltip.append("text")
        .attr("class", "tooltip-name")
        .text(function (d) {
            return d.properties.name;
        })
        .attr("id", function (d) {
            return "v" + d.properties.cluster;
        })
        .attr("fill", "#666")
        .attr("x", width * 0.4)
        .attr("y", 90)
        .call(wrap, width * 0.35);

    function wrap(text, lwidth) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy"));
            var tspan = text.text(null)
                .append("tspan")
                .attr("x", width * 0.4)
                .attr("y", y)
                .attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > lwidth) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", width * 0.4)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * 16)
                        .text(word);
                }
            }
        });
    }

    function formatLabel(d) {
        var s = formatnum(d);
        if (d <= -0.5) {
            return d = -s + " fewer";
        } else if (d > -0.5 & d <= 0.5) {
            return d = "No change in crime";
        } else if (d > 0.5) {
            return d = s + " more";
        }
    }

    function formatLabel2(d) {
        if (d <= -1.5 | d > 1.5) {
            return d = " violent crimes per 1,000 residents";
        } else if ((d > -1.5 & d <= -0.5) | (d > 0.5 & d <= 1.5)) {
            return d = " violent crime per 1,000 residents";
        } else if (d > -0.5 & d <= 0.5) {
            return d = "";
        }
    }

}

function clusterslide() {
    if ($clustergraphs.width() < mobile_threshold & $clustergraphs.width() !=617 & $clustergraphs.width() !=720) {
        legenddraw();
        mapdraw("#clustermap");
    } else {
        legenddraw();
        bardraw("#barchart");
        mapdraw("#clustermap");

        var allbars = d3.selectAll("rect,path,.tooltip-num,.tooltip-label,.tooltip-name");
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
}