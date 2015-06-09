function linedraw() {
    var margin = {
            top: 50,
            right: 150,
            bottom: 35,
            left: 10
        },
        numticks = 6;
    if ($linechart.width() < mobile_threshold) {
        margin.top = 70;
        margin.right = 20;
        margin.left = 20;
    }
    var width = $linechart.width() - margin.left - margin.right,
        height = Math.ceil((width * linechart_aspect_height) / linechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $linechart.empty();

    var formatAxis = d3.format('.0f');
    var labels = ["Robbery", "Aggravated Assault"];

    var x = d3.scale.linear()
        .range([padding, width])
        .domain([1999, 2013.5]);

    var y = d3.scale.linear()
        .domain([0, 1000])
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#1696d2", "#666666"])
        .domain(labels);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .orient("bottom")
        .tickFormat(formatYAxis)
        .ticks(numticks);

    var line = d3.svg.line()
        //.interpolate("basis")
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.rate);
        });

    var svg = d3.select("#linechart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(d3.keys(data[0]).filter(function (key) {
        return key == "robrate" | key == "aggrate";
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

    var legend = svg.selectAll("g.legend")
        .data(labels)
        .enter().append("g");

    var l_h = 4;

    legend.append("rect")
        .attr("id", function (d) {
            return d;
        })
        .attr("x", 10)
        .attr("y", function (d, i) {
            return -40 - (25 * i);
        })
        .attr("width", 20)
        .attr("height", l_h)
        .style("fill", function (d, i) {
            return color(d);
        });

    legend.append("text")
        .attr("id", function (d) {
            return d;
        })
        .attr("x", 40)
        .attr("y", function (d, i) {
            return -33 - (25 * i);
        })
        .attr("class", "axis")
        .text(function (d, i) {
            return labels[i];
        });

    function formatYAxis(d) {
        var s = formatAxis(d);
        return d === y.domain()[1] ? s + " per 100,000" : s;
    }
}

function homdraw() {
    var margin = {
            top: 50,
            right: 150,
            bottom: 35,
            left: 10
        },
        numticks = 6;
    if ($linechart.width() < mobile_threshold) {
        margin.top = 70;
        margin.right = 20;
        margin.left = 20;
    }
    var width = $linechart.width() - margin.left - margin.right,
        height = Math.ceil((width * linechart_aspect_height) / linechart_aspect_width) - margin.top - margin.bottom,
        padding = 30;

    $homchart.empty();

    var formatAxis = d3.format('.0f');
    var labels = ["Homicide"];

    var x = d3.scale.linear()
        .range([padding, width])
        .domain([1999, 2013.5]);

    var y = d3.scale.linear()
        .domain([0, 50])
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#1696d2", "#666666"])
        .domain(labels);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .orient("bottom")
        .tickFormat(formatYAxis)
        .ticks(numticks);

    var line = d3.svg.line()
        //.interpolate("basis")
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.rate);
        });

    var svg = d3.select("#homchart").append("svg")
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

    function formatYAxis(d) {
        var s = formatAxis(d);
        return d === y.domain()[1] ? s + " per 100,000" : s;
    }
}