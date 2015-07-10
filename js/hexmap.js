d3.helper = {};

d3.helper.tooltip = function (accessor) {
    return function (selection) {
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        selection.on("mouseover", function (d, i) {
                // Clean up lost tooltips
                d3.select('body').selectAll('div.tooltip').remove();
                // Append tooltip
                tooltipDiv = d3.select('body').append('div').attr('class', 'map-tooltip');
                var absoluteMousePos = d3.mouse(bodyNode);
                tooltipDiv.style('left', (absoluteMousePos[0]) + 'px')
                    .style('top', (absoluteMousePos[1]) + 'px')
                    .style('position', 'absolute')
                    .style('z-index', 1001);
                // Add text using the accessor function
                var tooltipText = accessor(d, i) || '';
            })
            .on('mousemove', function (d, i) {
                // Move tooltip
                var absoluteMousePos = d3.mouse(bodyNode);

                tooltipDiv.style('left', (absoluteMousePos[0]) + 'px')
                    .style('top', (absoluteMousePos[1]) + 'px');
                var tooltipText = accessor(d, i) || '';
                tooltipDiv.html(tooltipText);
            })
            .on("mouseout", function (d, i) {
                tooltipDiv.remove();
            });
    };
};

function crimemap(layers) {

    L.mapbox.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';
    var map = L.mapbox.map("map", 'urbaninstitute.iji12b2j', {
            zoomControl: false,
            fadeAnimation: false,
            maxZoom: 12,
            minZoom: 12
        })
        .setView([38.910, -77.010618], 12);

    map.attributionControl
        .addAttribution('<a href="http://www.urban.org/">&copy; Urban Institute</a>');

    var last_layer;

    var control = document.getElementById('layers');

    // Add a play button div
    var play_button = control.appendChild(document.createElement('a'))
    var pause = "&#9616;&#9616;";
    var play = "&#9654;";
    play_button.innerHTML = pause;
    play_button.id = "play_button";
    play_button.onclick = function () {
        if (nextInterval) {
            nextInterval = clearInterval(nextInterval);
            play_button.innerHTML = play;
        } else {
            highlightLayer(i++);
            nextInterval = animate();
            play_button.innerHTML = pause;
        }
    }

    layers.forEach(function (layer, n) {

        layer.button = control.appendChild(document.createElement('a'));
        layer.button.innerHTML = layers[n].name;
        layer.button.onclick = function () {
            highlightLayer(n);
            i = n;
            nextInterval = clearInterval(nextInterval);
            play_button.innerHTML = play;
        };
    });

    // we use a layer group to make it simple to remove an existing overlay
    // and add a new one in the same line of code, as below, without juggling
    // temporary variables.
    var layerGroup = L.layerGroup().addTo(map);

    // i is the number of the currently-selected layer
    var i = 0;

    // show the first overlay as soon as the map loads
    highlightLayer(i++);

    var nextInterval = animate();

    function animate() {
        // and then time the next() function to run every 1 seconds
        return setInterval(function () {
            highlightLayer(i);
            if (++i >= layers.length) i = 0;
        }, 1000 * 1);

    }

    function highlightLayer(i) {
        layerGroup.clearLayers().addLayer(layers[i].layer);
        var active = control.getElementsByClassName('active');
        for (var j = 0; j < active.length; j++) active[j].className = '';
        layers[i].button.className = 'active';
    }
}
var breaks,
    scheme,
    leg_breaks;

function legend() {

    var margin = {
        top: 5,
        right: 2,
        bottom: 5,
        left: 2
    };

    var width = 70 - margin.left - margin.right,
        height = 170 - margin.top - margin.bottom;

    var svg = d3.select("#legend").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var lp_h = 20,
        ls_w = 40,
        ls_h = 22;

    var legend = svg.selectAll("g.legend")
        .data(leg_breaks)
        .enter().append("g")
        .attr("class", "legend");

    legend.append("text")
        .data(leg_breaks)
        .attr("x", ls_w + 5)
        .attr("y", function (d, i) {
            return i * ls_h + 3;
        })
        .text(function (d, i) {
            return d;
        });

    legend.append("rect")
        .data(scheme)
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * ls_h;
        })
        .attr("width", ls_w)
        .attr("height", lp_h)
        .attr("z-index", 10)
        .style("fill", function (d, i) {
            return scheme[i];
        })
}

//1 function for each map - in parent HTMLs, call the map to draw
function assaultmap() {
    var container = L.DomUtil.get('layers');
    scheme = ["#fce49f", "#ffda71", "#ffcd3f", "#fbb317", "#f9a31a", "#f58720", "#e76424"],
        breaks = [5, 10, 15, 20, 25, 30],
        leg_breaks = [1, 5, 10, 15, 20, 25, 30, 59];

    function hex_style(hexagons) {
        // Maintain a density scale relative to initial zoom level.
        color = d3.scale.threshold()
            .domain(breaks)
            .range(scheme);

        hexagons
            .attr("fill", function (d) {
                return color(d.length);
            })
            .call(d3.helper.tooltip(
                function (d, i) {
                    return d.length;
                }
            ));
    }

    function init(id) {
        var tile = new L.hexLayer(id, {
            applyStyle: hex_style
        });
        return tile;
    }

    var assaultlayers = [{
            name: "'00",
            layer: init(assault2000)
     }, {
            name: "'01",
            layer: init(assault2001)
     }, {
            name: "'02",
            layer: init(assault2002)
     }, {
            name: "'03",
            layer: init(assault2003)
     }, {
            name: "'04",
            layer: init(assault2004)
     }, {
            name: "'05",
            layer: init(assault2005)
     }, {
            name: "'06",
            layer: init(assault2006)
     }, {
            name: "'07",
            layer: init(assault2007)
     }, {
            name: "'08",
            layer: init(assault2008)
     }, {
            name: "'09",
            layer: init(assault2009)
     }, {
            name: "'10",
            layer: init(assault2010)
     }, {
            name: "'11",
            layer: init(assault2011)
     }, {
            name: "'12",
            layer: init(assault2012)
     }, {
            name: "'13",
            layer: init(assault2013)
     }, {
            name: "'14",
            layer: init(assault2014)
     }
];
    crimemap(assaultlayers);
    legend();
}

function robberymap() {
    var container = L.DomUtil.get('layers');
    scheme = ["#f9f4b3", "#eee976", "#cdda54", "#a6cc4a", "#67b844", "#059b49", "#007b3e"],
        breaks = [8, 16, 24, 32, 40, 48],
        leg_breaks = [1, 8, 16, 24, 32, 40, 48, 70];

    function hex_style(hexagons) {
        color = d3.scale.threshold()
            .domain(breaks)
            .range(scheme);

        hexagons
            .attr("fill", function (d) {
                return color(d.length);
            })
            .call(d3.helper.tooltip(
                function (d, i) {
                    return d.length;
                }
            ));
    }

    function init(id) {
        var tile = new L.hexLayer(id, {
            applyStyle: hex_style
        });
        return tile;
    }
    var robberylayers = [{
            name: "'00",
            layer: init(robbery2000)
     }, {
            name: "'01",
            layer: init(robbery2001)
     }, {
            name: "'02",
            layer: init(robbery2002)
     }, {
            name: "'03",
            layer: init(robbery2003)
     }, {
            name: "'04",
            layer: init(robbery2004)
     }, {
            name: "'05",
            layer: init(robbery2005)
     }, {
            name: "'06",
            layer: init(robbery2006)
     }, {
            name: "'07",
            layer: init(robbery2007)
     }, {
            name: "'08",
            layer: init(robbery2008)
     }, {
            name: "'09",
            layer: init(robbery2009)
     }, {
            name: "'10",
            layer: init(robbery2010)
     }, {
            name: "'11",
            layer: init(robbery2011)
     }, {
            name: "'12",
            layer: init(robbery2012)
     }, {
            name: "'13",
            layer: init(robbery2013)
     }, {
            name: "'14",
            layer: init(robbery2014)
     }
];
    crimemap(robberylayers);
    legend();
}

function homicidemap() {
    var container = L.DomUtil.get('layers');
    scheme = ["#DB0984", "#AD137F", "#870D80", "#6B0062", "#460442"],
        breaks = [2, 3, 4, 5],
        leg_breaks = [1, 2, 3, 4, 5, 12];

    function hex_style(hexagons) {

        color = d3.scale.threshold()
            .domain(breaks)
            .range(scheme);

        hexagons
            .attr("fill", function (d) {
                return color(d.length);
            })
            .call(d3.helper.tooltip(
                function (d, i) {
                    return d.length;
                }
            ));
    }

    function init(id) {
        var tile = new L.hexLayer(id, {
            applyStyle: hex_style
        });
        return tile;
    }
    var homicidelayers = [{
            name: "'00",
            layer: init(homicide2000)
     }, {
            name: "'01",
            layer: init(homicide2001)
     }, {
            name: "'02",
            layer: init(homicide2002)
     }, {
            name: "'03",
            layer: init(homicide2003)
     }, {
            name: "'04",
            layer: init(homicide2004)
     }, {
            name: "'05",
            layer: init(homicide2005)
     }, {
            name: "'06",
            layer: init(homicide2006)
     }, {
            name: "'07",
            layer: init(homicide2007)
     }, {
            name: "'08",
            layer: init(homicide2008)
     }, {
            name: "'09",
            layer: init(homicide2009)
     }, {
            name: "'10",
            layer: init(homicide2010)
     }, {
            name: "'11",
            layer: init(homicide2011)
     }, {
            name: "'12",
            layer: init(homicide2012)
     }, {
            name: "'13",
            layer: init(homicide2013)
     }, {
            name: "'14",
            layer: init(homicide2014)
     }
];
    crimemap(homicidelayers);
    legend();
}