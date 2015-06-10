#HR, 06-10-15
#Load geojsons into a js file for maps - best solution for getting around cross-domain issues with Leaflet
import os
os.chdir("D:\Comm\occ4\crime")

import json

crimes = ["assault", "robbery", "homicide"]
for i in crimes: 
    djs = "var "
    dt = dict()
        
    #make JS file with variables for each geojson
    for x in range (2000,2015):
        dt[x] = json.loads(open("data/" + i +"/" + i + str(x) + ".geojson").read())
    for x in range (2000,2014):
        djs = djs + str(i) + str(x) + "=" + str(dt[x]) + ","
    djs = djs + str(i) + "2014 =" + str(dt[2014]) + ";"
  
    with open("js/" + str(i) + "data.js", 'w') as f:
        f.write(djs)