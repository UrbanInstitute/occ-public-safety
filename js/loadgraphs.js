function allgraphs() {
    linecharts();
    clusterslide();
}

$(window).load(function () {
    if (Modernizr.svg) { // if svg is supported, draw dynamic chart
        d3.csv(linechart_data_url, function (error, rates) {
            data_cl = rates;
            d3.csv(barchart_data_url, function (error, change) {
                ratechange = change;
                d3.json(clustermap_data_url, function (error, dc2) {
                    if (error) throw error;
                    dc = dc2;
                    allgraphs();
                    window.onresize = allgraphs;
                });
            });
        });
    }
});