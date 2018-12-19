import json

with open ('../data/populationByDistricts.json','r') as populationFile, open ('../data/ghanaDistricts.geojson','r') as districtsFile:
	
	populationData = json.loads(populationFile.read())

	districtsData = json.loads(districtsFile.read())

	populationNameList = [obj.get('adm2') for obj in populationData]

	districtsNameList = [obj.get('properties').get('adm2') for obj in districtsData.get('features')]

	districtsDict = {obj.get('adm2'): (obj.get('population'), obj.get('0-14 years')) for obj in populationData}

	for feature in districtsData.get('features'):

		adm2 = feature.get('properties').get('adm2')

		if adm2 in districtsDict.keys():

			values = districtsDict[adm2]
			population = values[0]
			yearsto14 = values[1]

			feature.get('properties')['population'] = population
			feature.get('properties')['0-14 years'] = yearsto14



	for feature in districtsData.get('features'):
		print(feature.get('properties'))


	with open('../data/ghanaDistricts2.geojson','w') as districtoutput:
		districtoutput.write(json.dumps(districtsData, indent = 4))
			

