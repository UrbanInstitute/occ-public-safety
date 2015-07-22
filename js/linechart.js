var mobile_threshold = 617;
var data;
var linechart_data_url = "data/linerates.csv";

var linechart_aspect_width = 1;
var linechart_aspect_height = 1.5;

var options,
    $homchart,
    $linechart;

var yearf = d3.format("02d");

function formatYear(d) {
    return "'" + yearf(Math.abs(2000 - d));
}

function leftdraw_dc() {
    $linechart = $('#linedc');
    options = {
        years: [2000, 2013.5],
        max: 1000,
        numticks: 13,
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
        numticks: 13,
        max: 50,
        axlabel: " per 100,000 residents"
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
        numticks: 6,
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
        numticks: 6,
        max: 4,
        axlabel: " per 1,000 residents"
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
        numticks: 6,
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
        numticks: 6,
        max: 4,
        axlabel: " per 1,000 residents"
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
    };
    var width = $linechart.width() - margin.left - margin.right,
        height = Math.ceil((width * linechart_aspect_height) / linechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $linechart.empty();

    var formatAxis = d3.format(',0f');
    var labcolor = d3.scale.ordinal()
        .range(["#54b849", "#fdbf11"])
    var labels = ["Robbery", "Aggravated assault"];

    var x = d3.scale.linear()
        .range([padding, width])
        .domain(options.years);

    var y = d3.scale.linear()
        .domain([0, options.max])
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .domain(["assaultrate", "robrate"])
        .range(["#fdbf11", "#54b849"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(formatYear)
        .ticks(options.numticks);

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
        return key == "assaultrate" | key == "robrate";
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
            return labcolor(d);
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
    };
    var width = $homchart.width() - margin.left - margin.right,
        height = Math.ceil((width * linechart_aspect_height) / linechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $homchart.empty();

    var formatAxis = d3.format('.0f');
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
        .tickFormat(formatYear)
        .ticks(options.numticks);

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

function linecharts() {
    leftdraw_dc();
    homdraw_dc();
    leftdraw_l();
    homdraw_l();
    leftdraw_h();
    homdraw_h();
}