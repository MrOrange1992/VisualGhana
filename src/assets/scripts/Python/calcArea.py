import json

from area import area as calcArea

with open('../data/ghanaDistricts.geojson', 'r') as ghanaDistrictsFile:

	ghanaDistrictsData = json.loads(ghanaDistrictsFile.read())

	features = ghanaDistrictsData.get('features')
	for feature in features:
		districtArea = calcArea(feature.get('geometry'))

		props = feature.get('properties')

		props['area'] = districtArea


	with open('../data/newDistricts.geojson', 'w') as newDistrictsFile:
		newDistrictsFile.write(json.dumps(ghanaDistrictsData, indent=4))



