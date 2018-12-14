import json

with open ('ghanaHealthsites.geojson','r') as healthFile, open ('ghanaDistricts.geojson','r') as districtsFile:
	
	healthData = json.loads(healthFile.read())

	districtsData = json.loads(districtsFile.read())

	

	districtsNameList = [obj.get('properties').get('adm2') for obj in districtsData.get('features')]


	healthNameList = {obj.get('properties').get('District') for obj in healthData.get('features')}

	#print(healthNameList)

	count = 0


	for name in districtsNameList:
		if name in healthNameList:
			print('')
		else: 
			print(name)
			count = count + 1 


	print(count)


			

