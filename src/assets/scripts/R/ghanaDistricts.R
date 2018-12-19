#install.packages("rjson")
library('rjson')
library(tidyverse)

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
  ggplot(aes(x = adm1, y = mean_kids_pct)) + geom_bar(stat = 'identity')



