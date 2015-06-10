#Our Changing Cities chapter 4 - crime in DC
Data sources: DC MPD & FBI
* [2012-2014 geodata](http://opendata.dc.gov/datasets?q=crime&sort_by=relevance&geometry=-78.163%2C38.742%2C-75.888%2C39.062)
* [Neighborhood clusters](http://opendata.dc.gov/datasets/f6c703ebe2534fc3800609a07bad8f5b_17?geometry=-77.247%2C38.886%2C-76.758%2C38.967&filterByExtent=true)

For data processing:
* [CrimeGeodata.R](/scripts/CrimeGeodata.R) + ArcMap: XY data to lat/long + neighborhood cluster for homicides, aggravated, assaults, robberies. Split into 1 CSV for each year*crime
* Run [csv2geojson.sh](/scripts/csv2geojson.sh) to make 1 js file per crime containing variables with each crime*year for Leaflet maps. Uses [csv2geojson](https://github.com/mapbox/csv2geojson) and then  [datajs.py](/scripts/datajs.py) to compile the js files.This avoids cross-domain json ref problems. All other solutions (AJAX requests, hacky code) have their own issues too.

JS dependencies for graphs:
* d3
* Leaflet
* Modernizr
* jQuery