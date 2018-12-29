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
    chps = entry$properties$CHPS
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



# test scatterplot
ghanaDistricts %>%
  #group_by(adm1) %>%
  ggplot(aes(x=prim_schools, y=area, color=adm1)) + geom_point()

# test scatterplot
ghanaDistricts %>%
  #group_by(adm1) %>%
  ggplot(aes(x=population, y=prim_schools)) + geom_point() + scale_x_continuous(limits=c(0, 250000))

# test bubbleplot
ghanaDistricts %>%
  ggplot(aes(x=adm1, y=area, size=population, fill = prim_schools)) + geom_point(shape = 21) +
  scale_size_continuous(range = c(1,15)) + 
  scale_fill_continuous(low = "steelblue1", high = "steelblue4") + 
  theme(legend.position="bottom", legend.direction="horizontal")
        

# test bubbleplot
ghanaDistricts %>%
  group_by(adm1) %>% 
  top_n(2, wt=population) %>% 
  ggplot(aes(x=adm1, y=area, size=population, fill = prim_schools)) + 
  geom_point(shape = 21) +
  geom_text(aes(label=adm2),hjust=0, vjust=0)
  scale_size_continuous(range = c(1,15)) + 
  scale_fill_continuous(low = "steelblue1", high = "steelblue4") + 
  theme(legend.position="bottom", legend.direction="horizontal")


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



