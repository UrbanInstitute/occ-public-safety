#HR, 06-08-15
#Our Changing Cities crime data
require(dplyr)
require(doBy)
require(tidyr)
require(stats)
require(reshape2)

crimes<-read.csv("data/dccrime2000-2014_cleaned.csv",header=T)

occ<-filter(crimes,grepl("Homicide|ADW|Robbery", offense))
occ$point_x<-round(occ$point_x)
occ$point_y<-round(occ$point_y)
occs<-select(occ,reportdate,year,offense,address,point_x,point_y,id_ui)
write.csv(occs, file="data/occ_crimes.csv", row.names=FALSE)

#Add lat-long & neighborhood cluster in ArcMap - originally projected in ESPG 26985
occg<-read.csv("data/occ_crimesgeomatch_all.csv",header=T, stringsAsFactors=F)
occm<-occg%>%filter(Latitude !=0) %>%
  select(offense,year,Latitude,Longitude)
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

#Neighborhood analysis - by cluster, # of each crime by year
occg<-mutate(occg, p = 1)
clusters <-
  summaryBy(p ~ cluster + cluster_name + year + offense, FUN = c(sum), data =
              occg)
clusters<-clusters%>%spread(offense,p.sum) %>%
  rename(robbery=Robbery,homicide=Homicide,aggassault=ADW)

#Add in cluster population - source: http://www.neighborhoodinfodc.org/comparisontables/comp_table_cltr00.xls
nnip<-read.csv("data/nnip_clusters.csv",header=T, stringsAsFactors=F)
#get rid of non-cluster rows
nnip<-nnip%>%slice(1:39) %>%
  select(CLUSTER_TR2000,TotPop_2000,TotPop_2010) %>%
  separate(CLUSTER_TR2000, c("c","cluster")) %>%
  rename(pop_2000=TotPop_2000,pop_2010=TotPop_2010) %>%
  select(-c)

#interpolate populations
#NNIP method: use 2010 populations for each subsequent year in absence of newer data
nnip$slope<-(nnip$pop_2010 - nnip$pop_2000)/10
nnip<-nnip%>%mutate(pop_2001=pop_2000+slope,pop_2002=pop_2000+2*slope,pop_2003=pop_2000+3*slope,pop_2004=pop_2000+4*slope,
                    pop_2005=pop_2000+5*slope,pop_2006=pop_2000+6*slope,pop_2007=pop_2000+7*slope,pop_2008=pop_2000+8*slope,pop_2009=pop_2000+9*slope) %>%
  select(-pop_2010, everything()) %>%
  mutate(pop_2011=pop_2010,pop_2012=pop_2010,pop_2013=pop_2010,pop_2014=pop_2010) %>%
  select(-slope)

#join cluster population by year to crimes
pop<-nnip%>%gather(year,"pop",2:16) %>%
  select(cluster,year,pop)
vars<-colsplit(pop$year, "_", c("temp", "year"))
pop<-pop%>%select(-year)
pop<-bind_cols(pop,vars)
pop<-pop%>%select(-temp)
pop$cluster<-as.numeric(pop$cluster)
clusters<-left_join(clusters,pop, by = c("cluster","year"))
clusters<-clusters%>%filter(year<2015)
clusters[is.na(clusters)] <- 0

#rates of each crime by cluster & year - per 1,000 residents
clusters<-clusters%>%mutate(assaultrate = 1000*aggassault/pop, robrate = 1000*robbery/pop, homrate = 1000*homicide/pop,
                            violentcrime = aggassault + robbery + homicide, 
                            violentrate = 1000*violentcrime/pop)
write.csv(clusters, file="data/clusterdata.csv", row.names=F,na="0")

#violent crime rate by year for each cluster for neighborhood slide
clustersmin<-clusters%>%select(cluster,violentrate,year)
hoods<-clustersmin%>%spread(year,violentrate)
names(hoods)<-c("cluster","violent2000","violent2001","violent2002","violent2003",
                "violent2004","violent2005","violent2006","violent2007","violent2008",
                "violent2009","violent2010","violent2011","violent2012","violent2013","violent2014")
hoods<-hoods%>%mutate(pctchange14 = (violent2014 - violent2000)/violent2000,
                      rawchange14 = (violent2014 - violent2000))
write.csv(hoods, file="data/clusters_violentcrime.csv", row.names=F)

#Clusters 8 and 29 for neighborhood zoom-in slides
clz<-clusters%>%filter(cluster==8|cluster==29) %>% 
  select(cluster,year,assaultrate,robrate,homrate)
write.csv(clz, file="data/clusters8_29.csv", row.names=F)
