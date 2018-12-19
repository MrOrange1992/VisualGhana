import json

with open('ghanaHealthsites.geojson', 'r') as ghanaHealthsitesFile, open('ghanaDistricts.geojson', 'r') as ghanaDistrictsFile:

	ghanaDistrictsData = json.loads(ghanaDistrictsFile.read())

	ghanaHealthsitesData = json.loads(ghanaHealthsitesFile.read())

	for feature in ghanaDistrictsData.get('features'):

		hosps = 0
		dist_hosps = 0
		health_centre = 0
		regionsl_hosp = 0
		mat_home = 0
		rch = 0
		chps = 0
		
		for healthsite in ghanaHealthsitesData.get('features'):

			if feature.get('properties').get('adm2') == healthsite.get('properties').get('District'):

				h_type = healthsite.get('properties').get('Type')

				if h_type == 'Hospitals': hosps += 1
				elif h_type == 'District Hospital': dist_hosps += 1
				elif h_type == 'Health Centre': health_centre += 1
				elif h_type == 'Regional Hospital': regionsl_hosp += 1
				elif h_type == 'Maternity Home': mat_home += 1
				elif h_type == 'RCH': rch += 1
				elif h_type == 'CHPS': chps += 1


		feature.get('properties')['Hospitals'] = hosps
		feature.get('properties')['District Hospitals'] = dist_hosps
		feature.get('properties')['Health Centres'] = health_centre
		feature.get('properties')['Regional Hospitals'] = regionsl_hosp
		feature.get('properties')['Maternity Homes'] = mat_home
		feature.get('properties')['RCHs'] = rch
		feature.get('properties')['CHPS'] = chps


	for feature in ghanaDistrictsData.get('features'):
		print(feature.get('properties')) 

	with open('newDistricts.geojson', 'w') as newDistrictsFile:
		newDistrictsFile.write(json.dumps(ghanaDistrictsData, indent=4))



	# Hospitals
	# District Hospital
	# Health Centre
	# Regional Hospital
	# Maternity Home
	# RCH
	# CHPS
	# Others
