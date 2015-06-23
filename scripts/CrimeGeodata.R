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

#Neighborhood analysis - by cluster, # of each crime by year
table(occg$cluster)
occg<-mutate(occg, p = 1)
clusters <-
  summaryBy(p ~ cluster + cluster_name + year + offense, FUN = c(sum), data =
              occg)
clusters<-spread(clusters,offense,p.sum)
clusters<-rename(clusters,robbery=Robbery,homicide=Homicide,aggassault=ADW)
write.csv(clusters, file="data/clusterdata.csv", row.names=F,na="0")

#Add in cluster population - source: http://www.neighborhoodinfodc.org/comparisontables/comp_table_cltr00.xls
clusters<-read.csv("data/clusterdata.csv",header=T, stringsAsFactors=F)
nnip<-read.csv("data/nnip_clusters.csv",header=T, stringsAsFactors=F)
#get rid of non-cluster rows
nnip<-slice(nnip,1:39)
nnip<-nnip%>%select(CLUSTER_TR2000,TotPop_2000,TotPop_2010)
nnip<-nnip%>%separate(CLUSTER_TR2000, c("c","cluster"))
nnip<-nnip%>%rename(pop_2000=TotPop_2000,pop_2010=TotPop_2010)
nnip<-nnip%>%select(-c)

#interpolate populations
nnip$slope<-(nnip$pop_2010 - nnip$pop_2000)/10
nnip<-nnip%>%mutate(pop_2001=pop_2000+slope,pop_2002=pop_2000+2*slope,pop_2003=pop_2000+3*slope,pop_2004=pop_2000+4*slope,
                    pop_2005=pop_2000+5*slope,pop_2006=pop_2000+6*slope,pop_2007=pop_2000+7*slope,pop_2008=pop_2000+8*slope,pop_2009=pop_2000+9*slope)
nnip<-nnip%>%
  select(-pop_2010, everything())
#NNIP method: use 2010 populations for each subsequent year in absence of newer data
nnip<-nnip%>%mutate(pop_2011=pop_2010,pop_2012=pop_2010,pop_2013=pop_2010,pop_2014=pop_2010)
#popb: continue the interpolation
nnip<-nnip%>%mutate(popb_2011=pop_2010+slope,popb_2012=pop_2010+2*slope,popb_2013=pop_2010+3*slope,popb_2014=pop_2010+4*slope)
nnip<-nnip%>%select(-slope)

#compare 2 population estimates - NNIP and continuing the interpolation
pop<-nnip%>%gather(year,"pop",2:16)
pop<-pop%>%select(cluster,year,pop)
vars<-colsplit(pop$year, "_", c("temp", "year"))
pop<-pop%>%select(-year)
pop<-bind_cols(pop,vars)
pop<-pop%>%select(-temp)

popb<-nnip%>%gather(year,"popb",2:12,17:20)
popb<-popb%>%select(cluster,year,popb)
vars<-colsplit(popb$year, "_", c("temp", "year"))
popb<-popb%>%select(-year)
popb<-bind_cols(popb,vars)
popb<-popb%>%select(-temp)

#Join to cluster data file
pop<-left_join(pop,popb, by = c("cluster","year"))
pop$cluster<-as.numeric(pop$cluster)
clusters<-left_join(clusters,pop, by = c("cluster","year"))
clusters<-clusters%>%mutate(assaultrate = 10000*aggassault/pop,assaultrateb = 10000*aggassault/popb,
                            robrate = 10000*robbery/pop,robrateb = 10000*robbery/popb)
clusters<-clusters%>%mutate(violentcrime = aggassault + robbery + homicide, 
                            violentrate = 10000*violentcrime/pop,violentrateb = 10000*violentcrime/popb)
clusters<-clusters%>%filter(year<2015)

write.csv(clusters, file="data/clusterdata.csv", row.names=F,na="0")
clustersmin<-clusters%>%select(cluster,violentrate,year)
hoods<-clustersmin%>%spread(year,violentrate)
names(hoods)<-c("cluster","violent2000","violent2001","violent2002","violent2003",
                "violent2004","violent2005","violent2006","violent2007","violent2008",
                "violent2009","violent2010","violent2011","violent2012","violent2013","violent2014")
hoods<-hoods%>%mutate(pctchange14 = (violent2014 - violent2000)/violent2000,
                      rawchange14 = (violent2014 - violent2000))
write.csv(hoods, file="data/clusters_violentcrime.csv", row.names=F)
require(ggplot2)
require(extrafont)
#Bar chart: 2000-2014 change in violent crime
#Raw
barchart<-ggplot(hoods, aes(x=cluster, y=rawchange14)) +
  geom_bar(stat="identity") +
  ggtitle("Raw change in violent crime per 10,000 residents, 2000-2014")
barchart
png(filename = "screenshots/rawchange.png", width=1800, height=1000, res=200)
barchart
dev.off()

#Percent
barchart2<-ggplot(hoods, aes(x=cluster, y=pctchange14)) +
  geom_bar(stat="identity") +
  ggtitle("Percent change in violent crime per 10,000 residents, 2000-2014")
barchart2
png(filename = "screenshots/pctchange.png", width=1800, height=1000, res=200)
barchart2
dev.off()

#Line chart
linechart <- ggplot(clusters, aes(x=year, y=assaultrate, group=cluster)) +
  geom_line() +
  facet_wrap(~ cluster) +
  ggtitle("Aggravated Assault Rate by Neighborhood Cluster") +
  theme(panel.grid.minor=element_blank(), 
        panel.grid.major.x=element_blank(),
        axis.title.y=element_blank(),
        axis.title.x=element_text(size=12,family="Arial",face="bold"),
        axis.text = element_text(size=6, family="Arial", color="#444444"),
        plot.title = element_text(size=16, family="Arial")) 
linechart

png(filename = "screenshots/assaultchange.png", width=1800, height=1000, res=200)
linechart
dev.off()