#HR, 06-10-15
#Load geojsons into a js file for maps - best solution for getting around cross-domain issues with Leaflet
import os
os.chdir("D:\Comm\occ4\crime")

import json

assaultjs = "var "
assault = dict()

robberyjs = "var "
robbery = dict()

homicidejs = "var "
homicide = dict()

#make JS file with variables for each geojson
for x in range (2000,2015):
    assault[x] = json.loads(open("data/assault/assault" + str(x) + ".geojson").read())
    robbery[x] = json.loads(open("data/robbery/robbery" + str(x) + ".geojson").read())
    homicide[x] = json.loads(open("data/homicide/homicide" + str(x) + ".geojson").read())
    
for x in range (2000,2014):
    assaultjs = assaultjs + "assault" + str(x) + "=" + str(assault[x]) + ","
    robberyjs = robberyjs + "robbery" + str(x) + "=" + str(robbery[x]) + ","
    homicidejs = homicidejs + "homicide" + str(x) + "=" + str(homicide[x]) + ","
assaultjs = assaultjs + "assault2014 =" + str(assault[2014]) + ";"
robberyjs = robberyjs + "robbery2014 =" + str(robbery[2014]) + ";"
homicidejs = homicidejs + "homicide2014 =" + str(homicide[2014]) + ";"

with open('js/assaultdata.js', 'w') as f:
    f.write(assaultjs)
with open('js/robberydata.js', 'w') as f:
    f.write(robberyjs)
with open('js/homicidedata.js', 'w') as f:
    f.write(homicidejs)