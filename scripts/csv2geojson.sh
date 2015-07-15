for i in {2000..2014}
do csv2geojson data/assault/assault$i.csv > data/assault/assault$i.geojson
do csv2geojson data/homicide/homicide$i.csv > data/homicide/homicide$i.geojson
do csv2geojson data/robbery/robbery$i.csv > data/robbery/robbery$i.geojson
done

python scripts/datajs.py