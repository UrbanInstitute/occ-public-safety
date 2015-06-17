function crimemap(layers) {
    var max = 50,
        scale,
        classes = 7,
        container = L.DomUtil.get('layers'),
        scheme = colorbrewer["Reds"][classes];

    L.mapbox.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';
    var map = L.mapbox.map("map", 'urbaninstitute.iji12b2j', {
            maxZoom: 17,
            minZoom: 11,
            fadeAnimation: false
        })
        .setView([38.910, -77.02], 12);

    map.attributionControl
        .addAttribution('<a href="http://www.urban.org/">&copy; Urban Institute</a>');

    var last_layer;

    function init(id) {
        var tile = new L.hexLayer(id, {
            applyStyle: hex_style
        });
        return tile;
    }

    var layers = [{
            name: "2000",
            layer: init(assault2000)
     }, {
            name: "2001",
            layer: init(assault2001)
     }, {
            name: "2002",
            layer: init(assault2002)
     }, {
            name: "2003",
            layer: init(assault2003)
     }, {
            name: "2004",
            layer: init(assault2004)
     }, {
            name: "2005",
            layer: init(assault2005)
     }, {
            name: "2006",
            layer: init(assault2006)
     }, {
            name: "2007",
            layer: init(assault2007)
     }, {
            name: "2008",
            layer: init(assault2008)
     }, {
            name: "2009",
            layer: init(assault2009)
     }, {
            name: "2010",
            layer: init(assault2010)
     }, {
            name: "2011",
            layer: init(assault2011)
     }, {
            name: "2012",
            layer: init(assault2012)
     }, {
            name: "2013",
            layer: init(assault2013)
     }, {
            name: "2014",
            layer: init(assault2014)
     }
];

    function hex_style(hexagons) {
        // Maintain a density scale relative to initial zoom level.
        scale = d3.scale.quantize()
            .domain([0, max])
            .range(d3.range(classes));

        hexagons
        // .attr("stroke", scheme[classes - 1])
            .attr("fill", function (d) {
            return scheme[scale(d.length)];
        });
    }

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
crimemap();