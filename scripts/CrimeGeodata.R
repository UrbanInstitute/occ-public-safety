#HR, 06-08-15
#Our Changing Cities crime data
require(dplyr)

crimes<-read.csv("data/dccrime2000-2014_cleaned.csv",header=T)

occ<-filter(crimes,grepl("Homicide|ADW|Robbery", offense))
occ$point_x<-round(occ$point_x)
occ$point_y<-round(occ$point_y)
occs<-select(occ,reportdate,year,offense,address,point_x,point_y,id_ui)
write.csv(occs, file="data/occ_crimes.csv", row.names=FALSE)

#Add lat-long in ArcMap - originally projected in ESPG 26985
occg<-read.csv("data/occ_crimesgeo_all.csv",header=T, stringsAsFactors=F)
occm<-filter(occg,Latitude !=0)
occm<-select(occm,offense,year,Latitude,Longitude)
write.csv(occm, file="data/occ_crimes_min.csv", row.names=FALSE)

#For each crime, export points by year
assaults<-filter(occm,grepl("ADW", offense))
files <- paste('data/assault/assault', 2000:2014, '.csv', sep = '')
mapply(write.csv, split(assaults, assaults$year), file = files,
       MoreArgs = list(quote = FALSE, row.names = FALSE)) 
write.csv(assaults, file="data/assault/assaults.csv", row.names=FALSE)

homicides<-filter(occm,grepl("Homicide", offense))
files <- paste('data/homicide/homicide', 2000:2014, '.csv', sep = '')
mapply(write.csv, split(homicides, homicides$year), file = files,
       MoreArgs = list(quote = FALSE, row.names = FALSE)) 
write.csv(homicides, file="data/homicide/homicides.csv", row.names=FALSE)

robberies<-filter(occm,grepl("Robbery", offense))
robberies<-filter(robberies,year<2015)
files <- paste('data/robbery/robbery', 2000:2014, '.csv', sep = '')
mapply(write.csv, split(robberies, robberies$year), file = files,
       MoreArgs = list(quote = FALSE, row.names = FALSE)) 
write.csv(robberies, file="data/robbery/robberies.csv", row.names=FALSE)