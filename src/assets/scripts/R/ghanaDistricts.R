#install.packages("rjson")
library('rjson')
library(tidyverse)
library(ggplot2)

data(tips, package = "reshape2")
# load the json file
result <- fromJSON(file = "../../data/ghanaDistricts.geojson")


# function to create tibbles out of each feature of JSON
# to be concatenated to one tibble using map_drf()
extract_data <- function(entry)
{
  pop <- entry$properties$population 
  pop_kids <- entry$properties[['0-14 years']] 
  
  if (is.null(pop))
  {
    pop <- NA
  }
  
  if (is.null(pop_kids))
  {
    pop_kids <- NA
  }
  
  
  tibble (
    adm1 = entry$properties$adm1,
    adm2 = entry$properties$adm2, 
    area = entry$properties$area,
    population = pop,
    pop_0_14 = pop_kids,
    prim_schools = entry$properties$primaryschool,
    high_schools = entry$properties$highschool,
    universities = entry$properties$university,
    hospitals = entry$properties$Hospitals,
    dist_hosp = entry$properties$DistrictHospitals,
    reg_hosp = entry$properties$RegionalHospitals,
    help_cents = entry$properties$HealthCentres,
    mat_homes = entry$properties$MaternityHomes,
    rchs = entry$properties$RCHs,
    chps = entry$properties$CHPS,
    clinics= entry$properties$Clinic
  )
}


# 
ghanaDistricts <- map_dfr(result$features, extract_data)

# Show basic stats like mean etc
summary(ghanaDistricts)

# Bar plot to show the mean pctage of 0-14 year old kids grouped by region
ghanaDistricts %>% 
  mutate(kids_pct = pop_0_14/population * 100) %>% 
  group_by(adm1) %>% 
  summarise(mean_kids_pct = mean(kids_pct, na.rm = TRUE)) %>% 
  ggplot(aes(x = reorder(adm1, -mean_kids_pct), y = mean_kids_pct)) + 
  geom_bar(stat = 'identity', fill="steelblue") + 
  labs(x = "Regions", y = "Percentage under 14 years") +
  ggtitle("Pct of total pop under 14")

#Bar plot to show the prim_schools per population 0-14 grouped by region
ghanaDistricts %>% 
  mutate(schoolpropop = prim_schools/pop_0_14) %>% 
  group_by(adm1) %>% 
  summarise(schoolpropop = sum(schoolpropop, na.rm = TRUE)) %>% 
  ggplot(aes(x = reorder(adm1, -schoolpropop), y = schoolpropop)) + geom_bar(stat = 'identity', fill="steelblue")



#Bar plot to show the prim_schools per population 0-14 grouped by districts
ghanaDistricts %>% 
  mutate(schoolProPop = prim_schools/pop_0_14 * 100) %>% 
  filter(schoolProPop > 0) %>% 
  arrange(schoolProPop) %>% 
  head(10) %>% 
  ggplot(aes(x = reorder(adm2, schoolProPop), y = schoolProPop)) + geom_bar(stat = 'identity', fill="steelblue")

#Bar plot to show the hospitals per population grouped by districts
ghanaDistricts %>% 
  filter(hospitals > 0) %>% 
  head(10) %>% 
  ggplot(aes(x = reorder(adm2, hospitals), y = hospitals)) + geom_bar(stat = 'identity', fill="steelblue")

#Bar plot to show the prim_schools per area grouped by region
ghanaDistricts %>% 
  mutate(schoolProPopProArea = prim_schools / (pop_0_14 / area)) %>% 
  group_by(adm1) %>% 
  summarise(schoolProPopProArea = sum(schoolProPopProArea, na.rm = TRUE)) %>% 
  ggplot(aes(x = reorder(adm1, -schoolProPopProArea), y = schoolProPopProArea)) + geom_bar(stat = 'identity', fill="steelblue")


#Bar plot to show the prim_schools per area grouped by districts
ghanaDistricts %>% 
  mutate(schoolProPopProArea = prim_schools / (pop_0_14 / area)) %>% 
  filter(schoolProPopProArea > 0) %>% 
  arrange(schoolProPopProArea) %>% 
  head(10) %>% 
  ggplot(aes(x = reorder(adm2, schoolProPopProArea), y = schoolProPopProArea)) + geom_bar(stat = 'identity', fill="steelblue")

#Bar plot to show the hospitals per area grouped by districts
ghanaDistricts %>% 
  mutate(hospitalsProPopProArea = hospitals / (population / area)) %>% 
  #filter(hospitalsProPopProArea > 0) %>% 
  arrange(hospitalsProPopProArea) %>% 
  head(10) %>% 
  ggplot(aes(x = reorder(adm2, hospitalsProPopProArea), y = hospitalsProPopProArea)) + geom_bar(stat = 'identity', fill="steelblue")

#Bar plot to show the dist_hosp per area grouped by districts
ghanaDistricts %>% 
  mutate(distHospProPopProArea = dist_hosp / (population / area)) %>% 
  filter(distHospProPopProArea > 0) %>% 
  arrange(distHospProPopProArea) %>% 
  head(10) %>% 
  ggplot(aes(x = reorder(adm2, distHospProPopProArea), y = distHospProPopProArea)) + geom_bar(stat = 'identity', fill="steelblue")



# test scatterplot
ghanaDistricts %>%
  #group_by(adm1) %>%
  ggplot(aes(x=prim_schools, y=area, color=adm1)) + geom_point()



# test bubbleplot prim_schools per area and population grouped by adm1
ghanaDistricts %>%
  ggplot(aes(x=adm1, y=area, size=population, fill = prim_schools)) + 
  geom_point(shape = 21) +
  scale_size_continuous(range = c(1,15)) + 
  scale_fill_continuous(low = "steelblue1", high = "steelblue4") + 
  theme(legend.position="bottom", legend.direction="horizontal")


#----------schools--------------
        

#  bubbleplot  prim_schools per area and pop 0-14 grouped by adm2
ghanaDistricts %>%
  group_by(adm1) %>% 
  #filter(prim_schools > 0) %>%
  mutate(primSchoolProPopProArea = prim_schools / (pop_0_14 / area)) %>%
  mutate(newarea=area/100000) %>%
  #top_n(2, wt=primSchoolProPopProArea) %>% 
  ggplot(aes(x=adm1, y=newarea, size=pop_0_14, fill =  prim_schools)) + 
  geom_point(shape = 21) +
  ggtitle("Primary Schools in relation to area and population") +
  labs(x = "Regions", y = "Area (km^2)") +
  geom_text(aes(label=adm2),hjust=0, vjust=0, cex=1.5)+
  scale_size_continuous(range = c(1,15)) + 
  scale_fill_continuous(low = "steelblue1", high = "steelblue4") + 
  theme(legend.position="right", legend.direction="vertical") +
  theme_minimal()
  
  #  bubbleplot   high_schools per area and population grouped by adm2
ghanaDistricts %>%
  group_by(adm1) %>% 
  mutate(highSchoolsProPopProArea = high_schools / (population / area)) %>%
  mutate(newarea=area/100000) %>%
  #filter(universities > 0) %>% 
  #top_n(2, wt=universitiesProPopProArea) %>%
  ggplot(aes(x=adm1, y=newarea, size=population, fill =  high_schools)) + 
  geom_point(shape = 21) +
  ggtitle("High Schools in relation to area and population") +
  labs(x = "Regions", y = "Area (km^2)") +
  geom_text(aes(label=adm2),hjust=0, vjust=0, cex = 1.5)
  scale_size_continuous(range = c(1,15)) + 
  scale_fill_continuous(low = "steelblue1", high = "steelblue4") + 
  theme(legend.position="right", legend.direction="vertical") +
  theme_minimal()
  
  #  bubbleplot   universities per area and population grouped by adm2
  ghanaDistricts %>%
    group_by(adm1) %>% 
    mutate(universitiesProPopProArea = universities / (population / area)) %>%
    mutate(newarea=area/100000) %>%
    #filter(universities > 0) %>% 
    #top_n(2, wt=universitiesProPopProArea) %>%
    ggplot(aes(x=adm1, y=newarea, size=population, fill =  universities)) + 
    geom_point(shape = 21) +
    ggtitle("Universities in relation to area and population") +
    labs(x = "Regions", y = "Area (km^2)") +
    geom_text(aes(label=adm2),hjust=0, vjust=0, cex = 1.5)
    scale_size_continuous(range = c(1,15)) + 
    scale_fill_continuous(low = "steelblue1", high = "steelblue4") + 
    theme(legend.position="bottom", legend.direction="horizontal") +
    theme_minimal()
   
    #----------Healthsites--------------
    
     
    #  bubbleplot  hospitals per area and population grouped by adm2
    ghanaDistricts %>%
      group_by(adm1) %>%
      #filter(hospitals > 0) %>%
      mutate(hospitalsProPopProArea = hospitals / (population / area)) %>%
      mutate(newarea=area/100000) %>%
      #top_n(2, wt=hospitalsProPopProArea) %>% 
      ggplot(aes(x=adm1, y=newarea, size=population, fill =  hospitals)) + 
      geom_point(shape = 21) +
      ggtitle("Hospitals in relation to area and population") +
      labs(x = "Regions", y = "Area (km^2)") +
      geom_text(aes(label=adm2),hjust=0, vjust=0, cex=2) +
      scale_size_continuous(range = c(1,15)) + 
      scale_fill_continuous(low = "coral", high = "coral3") + 
      theme(legend.position="right", legend.direction="vertical") +
      theme_minimal()
    
    #  bubbleplot  dist_hosp per area and population grouped by adm2
    ghanaDistricts %>%
      group_by(adm1) %>%
      filter(dist_hosp > 0) %>%
      mutate(disthospProPopProArea = dist_hosp / (population / area)) %>%
      mutate(newarea=area/100000) %>%
      #top_n(2, wt=hospitalsProPopProArea) %>% 
      ggplot(aes(x=adm1, y=newarea, size=population, fill =  dist_hosp)) + 
      geom_point(shape = 21) +
      ggtitle("District Hospitals in relation to area and population") +
      labs(x = "Regions", y = "Area (km^2)") +
      geom_text(aes(label=adm2),hjust=0, vjust=0, cex=2) +
      scale_size_continuous(range = c(1,15)) + 
      scale_fill_continuous(low = "coral", high = "coral3") + 
      theme(legend.position="right", legend.direction="vertical") +
      theme_minimal()
    
    #  bubbleplot  reg_hosp per area and population grouped by adm2
    ghanaDistricts %>%
      group_by(adm1) %>%
      filter(reg_hosp > 0) %>%
      mutate(reghospProPopProArea = reg_hosp / (population / area)) %>%
      mutate(newarea=area/100000) %>%
      #top_n(2, wt=hospitalsProPopProArea) %>% 
      ggplot(aes(x=adm1, y=newarea, size=population, fill =  reg_hosp)) + 
      geom_point(shape = 21) +
      ggtitle("Regional Hospitals in relation to area and population") +
      labs(x = "Regions", y = "Area (km^2)") +
      geom_text(aes(label=adm2),hjust=0, vjust=0, cex=2) +
      scale_size_continuous(range = c(1,15)) + 
      scale_fill_continuous(low = "coral", high = "coral3") + 
      theme(legend.position="right", legend.direction="vertical") +
      theme_minimal()
   
     #  bubbleplot  help_cents per area and population grouped by adm2
    ghanaDistricts %>%
      group_by(adm1) %>%
      #filter(help_cents > 0) %>%
      mutate(help_centsProPopProArea = help_cents / (population / area)) %>%
      mutate(newarea=area/100000) %>%
      #top_n(2, wt=hospitalsProPopProArea) %>% 
      ggplot(aes(x=adm1, y=newarea, size=population, fill =  help_cents)) + 
      geom_point(shape = 21) +
      ggtitle("Health Centres in relation to area and population") +
      labs(x = "Regions", y = "Area (km^2)") +
      geom_text(aes(label=adm2),hjust=0, vjust=0, cex=2) +
      scale_size_continuous(range = c(1,15)) + 
      scale_fill_continuous(low = "coral", high = "coral3") + 
      theme(legend.position="right", legend.direction="vertical") +
      theme_minimal()
    
    #  bubbleplot  clinics per area and population grouped by adm2
    ghanaDistricts %>%
      group_by(adm1) %>%
      #filter(clinics > 0) %>%
      mutate(clinicsProPopProArea = clinics / (population / area)) %>%
      mutate(newarea=area/100000) %>%
      #top_n(2, wt=hospitalsProPopProArea) %>% 
      ggplot(aes(x=adm1, y=newarea, size=population, fill =  clinics)) + 
      geom_point(shape = 21) +
      ggtitle("Clinics  in relation to area and population") +
      labs(x = "Regions", y = "Area (km^2)") +
      geom_text(aes(label=adm2),hjust=0, vjust=0, cex=2) +
      scale_size_continuous(range = c(1,15)) + 
      scale_fill_continuous(low = "coral", high = "coral3") + 
      theme(legend.position="right", legend.direction="vertical") +
      theme_minimal()
    
    #  bubbleplot  mat_homes per area and population grouped by adm2
    ghanaDistricts %>%
      group_by(adm1) %>%
      #filter(mat_homes > 0) %>%
      mutate(mathomesProPopProArea = mat_homes / (population / area)) %>%
      mutate(newarea=area/100000) %>%
      #top_n(2, wt=hospitalsProPopProArea) %>% 
      ggplot(aes(x=adm1, y=newarea, size=population, fill =  mat_homes)) + 
      geom_point(shape = 21) +
      ggtitle("Maternity Homes in relation to area and population") +
      labs(x = "Regions", y = "Area (km^2)") +
      geom_text(aes(label=adm2),hjust=0, vjust=0, cex=2) +
      scale_size_continuous(range = c(1,15)) + 
      scale_fill_continuous(low = "coral", high = "coral3") + 
      theme(legend.position="right", legend.direction="vertical") +
      theme_minimal()
    
    #  bubbleplot  rchs per area and population grouped by adm2
    ghanaDistricts %>%
      group_by(adm1) %>%
     # filter(rchs > 0) %>%
      mutate(rchsProPopProArea = rchs / (population / area)) %>%
      mutate(newarea=area/100000) %>%
      #top_n(2, wt=hospitalsProPopProArea) %>% 
      ggplot(aes(x=adm1, y=newarea, size=population, fill =  rchs)) + 
      geom_point(shape = 21) +
      ggtitle("RCH in relation to area and population") +
      labs(x = "Regions", y = "Area (km^2)") +
      geom_text(aes(label=adm2),hjust=0, vjust=0, cex=2) +
      scale_size_continuous(range = c(1,15)) + 
      scale_fill_continuous(low = "coral", high = "coral3") + 
      theme(legend.position="right", legend.direction="vertical") +
      theme_minimal()
    
    
    
    #  bubbleplot  CHPS per area and population grouped by adm2
    ghanaDistricts %>%
      group_by(adm1) %>%
      #filter(chps > 0) %>%
      mutate(chpsProPopProArea = chps / (population / area)) %>%
      mutate(newarea=area/100000) %>%
      #top_n(2, wt=hospitalsProPopProArea) %>% 
      ggplot(aes(x=adm1, y=newarea, size=population, fill =  chps)) + 
      geom_point(shape = 21) +
      ggtitle("CHPS  in relation to area and population") +
      labs(x = "Regions", y = "Area (km^2)") +
      geom_text(aes(label=adm2),hjust=0, vjust=0, cex=2) +
      scale_size_continuous(range = c(1,15)) + 
      scale_fill_continuous(low = "coral", high = "coral3") + 
      theme(legend.position="right", legend.direction="vertical") +
      theme_minimal()
      
      


ghanaDistricts %>%
  group_by(adm1) %>% 
  summarise(
    population = sum(population, na.rm = TRUE), 
    pop_0_14 = sum(pop_0_14,na.rm = TRUE), 
    prim_schools = sum(prim_schools), 
    high_schools = sum(high_schools), 
    universities = sum(universities)) %>% 
  mutate(education = prim_schools + high_schools + universities) %>% 
  select(education, population, adm1) %>%
  ggplot(aes(x=education, y=adm1)) + geom_point()



