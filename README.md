#Our Changing City chapter 4 - crime in DC
###Data sources
* Neighborhood clusters - shp: [DC Office of Planning](http://opendata.dc.gov/datasets/f6c703ebe2534fc3800609a07bad8f5b_17)
* Citywide population, aggravated assault and robbery data 2000 through 2012: [FBI UCR statistics](http://www.ucrdatatool.gov/Search/Crime/Local/JurisbyJurisLarge.cfm)
* Citywide population, aggravated assault and robbery numbers for 2013: [FBI Crime in the United States 2013 report](https://www.fbi.gov/about-us/cjis/ucr/crime-in-the-u.s/2013/crime-in-the-u.s.-2013/tables/table-8/table-8-state-cuts/table_8_offenses_known_to_law_enforcement_district_of_columbia_by_city_2013.xls)
* Citywide homicide numbers: [DC MPD District Crime Data at a Glance](http://mpdc.dc.gov/page/district-crime-data-glance)
* Geo-coded crime data 2011-present: [DC Metropolitan Police Department crime statistics download tool](http://crimemap.dc.gov/CrimeMapSearch.aspx) - 2000-2010, direct from MPD

###For data processing:
* [CrimeGeodata.R](/scripts/CrimeGeodata.R) + ArcMap: XY data to lat/long + neighborhood cluster for homicides, aggravated, assaults, robberies. Split into 1 CSV for each year*crime
* Run [csv2geojson.sh](/scripts/csv2geojson.sh) to make 1 js file per crime containing variables with each crime*year for Leaflet maps. Uses [csv2geojson](https://github.com/mapbox/csv2geojson) and then  [datajs.py](/scripts/datajs.py) to compile the js files.

Hexmaps build on the work of [affinitybridge](https://github.com/affinitybridge/d3-demos-quakes)