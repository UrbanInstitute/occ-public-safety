#HR, 06-10-15
#Load geojsons into a js file for maps - best solution for getting around cross-domain issues with Leaflet
import os
os.chdir("D:\Comm\occ4\crime")

import json

assaultjs = "var "
assault = dict()

#make JS file with variables for each geojson
for x in range (2000,2015):
    assault[x] = json.loads(open("data/assault/assault" + str(x) + ".geojson").read())
for x in range (2000,2014):
    assaultjs = assaultjs + "assault" + str(x) + "=" + str(assault[x]) + ","
assaultjs = assaultjs + "assault2014 =" + str(assault[2014]) + ";"

with open('js/assaultdata.js', 'w') as f:
    f.write(assaultjs)