import { Component, OnInit } from '@angular/core';
import {MapService} from './map.service';
import {LatLngBoundsLiteral} from '@agm/core';
import {Chart, ChartComponent} from 'chart.js';
import {PieChart} from '../charts/PieChart';
import {PowerPlant} from '../entities/PowerPlant';
import {HealthSite} from '../entities/HealthSite';
import {Colors} from '../enums/Colors';
import {Airport} from '../entities/Airport';
import {BarChart} from '../charts/BarChart';
import {StylesService} from './styles.service';
import {EventService} from './event.service';
import {LineChart} from '../charts/LineChart';
import {ControlPosition, MapTypeControlStyle} from "@agm/core/services/google-maps-types";



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  // MAP CONFIG / STYLES
  map;
  zoom;
  latlngBounds: LatLngBoundsLiteral;

  // property for custom map styles, edit in file ../assets/mapStyles.json
  public customMapStyles;
  public educationDistributionStyles;

  scaleStyles = {
    "position": ControlPosition.TOP_CENTER
  };

  // AGM DATA LAYER OBJECTS
  // POINT
  healthSites: HealthSite[];
  filteredHealthSites: HealthSite[];
  powerPlants: PowerPlant[];
  airports: Airport[];
  aulaTerraMarkers;
  yendiPoint = { longitude: -0.011462, latitude: 9.44 };
  forecastSites: HealthSite[];

  // LINE
  powerLines;
  roadData;
  aulaTerraRoad;
  drone2019POI;

  // POLYGON
  overlay;
  populationTiles;
  districts;

  // ONMAP INFO
  infoVisible = false;
  infoLatitude;
  infoLongitude;
  infoGeoJsonObject: Object;

  // CHART
  chart;
  popOverYears;

  // MISC
  objectKeys = Object.keys;
  colors = Colors;
  educationMode = false;
  healthMode = false;
  energyMode = false;
  stdRadius;
  activeTimeLineYear: number = 2018;
  timeLineContents;
  mediaSource = {
    type: null,
    src: null
  };
  foreCastMode = false;
  foreCastType = null;
  aulaTerraMode = false;
  populationMode = false;




  constructor(
    private mapService: MapService,
    public stylesService: StylesService,
    private eventService: EventService)
  {}

  /**
   * Function is called on map initialize
   * Custom mapstyles are loaded here
   */
  ngOnInit() {
    console.log('Loading map and data, please wait ...');

    this.mapService.loadStyles('mapStyles.json').subscribe(data => {
      // console.log('Loading map styles ...');
      this.customMapStyles = data;
    });

    this.mapService.loadData('africaBorders.geojson').subscribe(response => {
      // console.log('Loading overlay data ...');
      this.overlay = response;
    });

    // start in infrastructure configuration
    this.loadInfrastructureConfig();
  }

  prepareHealthSites() {

    this.healthMode = true;
    this.populationMode = false;
    this.educationMode = false;
    this.energyMode = false;
    if (this.chart) this.chart.destroy();



    this.mapService.loadData('ghanaHealthsites.geojson').subscribe(resPointData => {

      // console.log('Loading healthsites...', resPointData);

      this.healthSites = resPointData['features'].map(feature => new HealthSite(feature, this.getStdRadius(this.zoom)));

      // Destroy any chart if existing
      if (this.chart) this.chart.destroy();

      const data = this.healthSites.map(site => site.type);

      const clinicCount = data.filter(res => res === 'Clinic').length;
      const hospitalCount = data.filter(res => res === 'Hospital').length;
      const districtHospitalCount = data.filter(res => res === 'District Hospital').length;
      const regionalHospitalCount = data.filter(res => res === 'Regional Hospital').length;
      const healthCentreCount = data.filter(res => res === 'Health Centre').length;
      const rchCount = data.filter(res => res === 'RCH').length;
      const maternityCount = data.filter(res => res === 'Maternity Home').length;
      const chpsCount = data.filter(res => res === 'CHPS').length;
      // console.log(data, clinicCount, hospitalCount);

      const pieChart = new PieChart(
        'chartCanvas',
        'doughnut',
        'Healthsite Type Distribution',
        [hospitalCount, healthCentreCount, districtHospitalCount, regionalHospitalCount, clinicCount, maternityCount, rchCount, chpsCount, ],
        ['Hospital', 'Health Centre', 'District Hospital', 'Regional Hospital','Clinic', 'Maternity Homes', 'RCH', 'CHPS'],
        [Colors.hospitalColor, Colors.healthCentreColor, Colors.districtHospitalColor, Colors.regionalHospitalColor, Colors.clinicColor, Colors.maternityColor, Colors.rchColor, Colors.chpsColor ]
      );

      this.chart = pieChart.chart;
    });
  }

  loadHealthDistribution(type) {

    this.mapService.loadData('ghanaDistricts.geojson').subscribe(resPolygonData => {
      resPolygonData['features'].forEach(feature => feature.properties['color'] = Colors.hospitalColor);

      this.districts = resPolygonData;

      if (this.chart) { this.chart.destroy(); }

      const maxOpacity = resPolygonData['features']
        .map(entry => entry.properties[type])
        .reduce((current, next) => { if (next > current) return next; else return current; } );

      this.districts['features'] = this.districts['features'].map(feature => {

        /*
        function prepareCase(typeName, color) {
          feature.properties['maxOpacity'] = maxOpacity;
          this.chart = new BarChart(
            'chartCanvas',
            typeName + ' distribution',
            [],
            [],
            color,
            "Districts",
            "Count")
            .chart;
        }

        switch (type) {
          case 'Hospitals':
          {
            feature.properties['active'] = feature.properties.Hospitals;
            prepareCase('Hospital', Colors.hospitalColor);
            break;
          }
          case 'Clinic':
          {
            feature.properties['active'] = feature.properties.Clinic;
            prepareCase('Clinic', Colors.clinicColor);
            break;
          }
          case 'HealthCentres':
          {
            feature.properties['active'] = feature.properties.HealthCentres;
            prepareCase('Health Centre', Colors.healthCentreColor);
            break;
          }
          case 'DistrictHospitals':
          {
            feature.properties['active'] = feature.properties.DistrictHospitals;
            prepareCase('District Hospital', Colors.districtHospitalColor);
            break;
          }
          case 'RegionalHospitals':
          {
            feature.properties['active'] = feature.properties.RegionalHospitals;
            prepareCase('Regional Hospital', Colors.regionalHospitalColor);
            break;
          }
          case 'MaternityHomes':
          {
            feature.properties['active'] = feature.properties.MaternityHomes;
            prepareCase('Materbity Homes', Colors.maternityColor);
            break;
          }
          case 'RCHs':
          {
            feature.properties['active'] = feature.properties.RCHs;
            prepareCase('RCH', Colors.rchColor);
            break;
          }
          case 'CHPS':
          {
            feature.properties['active'] = feature.properties.CHPS;
            prepareCase('CHPS', Colors.chpsColor);
            break;
          }
        }
         */

        switch (type) {
          case 'Hospitals':
          {
            feature.properties['active'] = feature.properties.Hospitals;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'Hospital distribution',
              [],
              [],
              Colors.hospitalColor,
              "Districts",
              "Count")
              .chart;
            break;
          }
          case 'Clinic':
          {
            feature.properties['active'] = feature.properties.Clinic;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'Clinic distribution',
              [],
              [],
              Colors.clinicColor,
              "Districts",
              "Count")
              .chart;
            break;
          }
          case 'HealthCentres':
          {
            feature.properties['active'] = feature.properties.HealthCentres;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'Health Centre distribution',
              [],
              [],
              Colors.healthCentreColor,
              "Districts",
              "Count")
              .chart;
            break;
          }
          case 'DistrictHospitals':
          {
            feature.properties['active'] = feature.properties.DistrictHospitals;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'District Hospital distribution',
              [],
              [],
              Colors.districtHospitalColor,
              "Districts",
              "Count")
              .chart;
            break;
          }
          case 'RegionalHospitals':
          {
            feature.properties['active'] = feature.properties.RegionalHospitals;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'Regional Hospital distribution',
              [],
              [],
              Colors.regionalHospitalColor,
              "Districts",
              "Count")
              .chart;
            break;
          }
          case 'MaternityHomes':
          {
            feature.properties['active'] = feature.properties.MaternityHomes;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'Maternity Homes distribution',
              [],
              [],
              Colors.maternityColor,
              "Districts",
              "Count")
              .chart;
            break;
          }
          case 'RCHs':
          {
            feature.properties['active'] = feature.properties.RCHs;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'RCH distribution',
              [],
              [],
              Colors.rchColor,
              "Districts",
              "Count"
            ).chart;
            break;
          }
          case 'CHPS':
          {
            feature.properties['active'] = feature.properties.CHPS;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'CHPS distribution',
              [],
              [],
              Colors.chpsColor,
              "Districts",
              "Count")
              .chart;
            break;
          }
        }
        return feature;
      });
      console.log(this.districts['features']);
    });
  }

  loadHealthSiteType(type) {
    // this.filteredHealthSites = null;

    this.filteredHealthSites = this.healthSites.filter(site => site.type === type);

    console.log(this.filteredHealthSites);

    /*
    switch (type) {
      case 'Hospital':
        this.filteredHealthSites = this.healthSites.filter(site => site.type === type);
        break;

      case 'District Hospital':
        this.filteredHealthSites = this.healthSites.filter(site => site.type === type);
        break;

      case 'Regional Hospital':
        this.filteredHealthSites = this.healthSites.filter(site => site.type === type);
        break;

      case 'Health Centre':
        this.filteredHealthSites = this.healthSites.filter(site => site.type === type);
        break;

      case 'Clinic':
        this.filteredHealthSites = this.healthSites.filter(site => site.type === type);
        break;

      case 'Maternity Home':
        this.filteredHealthSites = this.healthSites.filter(site => site.type === type);
        break;

      case 'RCH':
        this.filteredHealthSites = this.healthSites.filter(site => site.type === type);
        break;

      case 'CHPS':
        this.filteredHealthSites = this.healthSites.filter(site => site.type === type);
        break;

      default:
        console.log('Unknown healthsite type specified: ' + type.toString());
    }
  */
  }

  loadTransportation() {

    this.populationMode = false;
    this.educationMode = false;
    this.energyMode = false;
    this.healthMode = false;
    if (this.chart) this.chart.destroy();

    this.mapService.loadData('ghanaRoads.geojson').subscribe(result => this.roadData = result);

    this.mapService.loadData('ghanaAirports.geojson').subscribe(resPointData => {
      this.airports = resPointData['features'].map(feature => new Airport(feature, this.getStdRadius(this.zoom)));
    });
  }

  /**
   * Load / reset data for power related data to be displayed
   */
  loadPower() {

    this.populationMode = false;
    this.educationMode = false;
    this.energyMode = true;
    this.healthMode = false;

    // Load power line data
    this.mapService.loadData('ghanaPowerLines.geojson').subscribe(resLineData => {
      this.powerLines = resLineData;

      // console.log('Loading powerline data...\n', this.powerLines);
    });

    // Load power plant data and pasre to PowerPlant objects
    this.mapService.loadData('ghanaPowerPlants.geojson').subscribe(resPointData => {
      // console.log('Loading powerplants...\n', powerPlantData);
      this.powerPlants = resPointData['features'].map(feature => new PowerPlant(feature));

      // Destroy any chart if existing
      if (this.chart) { this.chart.destroy(); }

      // Prepare data for pie chart
      const thermalCapacity = this.powerPlants
        .filter(res => res.type === 'Thermal')
        .filter(res => res.yearCompleted <= this.activeTimeLineYear)
        .map(a => a.capacity)
        .reduceRight((first, next) => first + next);

      const hydroCapacity = this.powerPlants
        .filter(res => res.type === 'Hydroelectric')
        .filter(res => res.yearCompleted <= this.activeTimeLineYear)
        .map(a => a.capacity)
        .reduceRight((first, next) => first + next);

      const solarCapacity = this.powerPlants
        .filter(res => res.type === 'Solar Power')
        .filter(res => res.yearCompleted <= this.activeTimeLineYear)
        .map(a => a.capacity)
        .reduceRight((first, next) => first + next)
        .toFixed(0);

      // Compute set of unique lables out of all powerplant types
      const labels = this.powerPlants
        .map(powerPlant => powerPlant.type)
        .filter((index, value, plant) => plant.indexOf(index) === value);

      // create pie chart
      const barChart = new BarChart(
        'chartCanvas',                                                      // Context
        'Powerplant capacity distribution [MW]',                            // Chart title
        [+thermalCapacity, +hydroCapacity, +solarCapacity],                 // Data
        labels,                                                             // Labels
        [Colors.powerThermalplantColor, Colors.powerHydroplantColor, Colors.powerSolarplantColor],    // Colors
        "Power plant type",
        "MW"
      );

      this.chart = barChart.chart;
    });
  }

  loadAccessToElectricity() {
    this.mapService.loadData('accessToElectricity.json').subscribe(resPointData => {

      const year = resPointData['content'].map(line => line.Year);
      const access = resPointData['content'].map(line => line.Access);
      // console.log(population, years);

      // Destroy any chart if existing
      if (this.chart) { this.chart.destroy(); }

      // create pie chart
      const lineChart = new LineChart(
        'chartCanvas',
        'Access to electricity',
        access,
        year,
        Colors.powerLinesColor,
        "Years",
        "Access [%]"
      );
      this.chart = lineChart.chart;

    });
  }

  prepareEducation() {
    this.populationMode = false;
    this.educationMode = true;
    this.energyMode = false;
    this.healthMode = false;
    if (this.chart) this.chart.destroy();

  }

  loadEducationDistribution(type) {

    this.mapService.loadData('ghanaDistricts.geojson').subscribe(resPolygonData => {
      resPolygonData['features'].forEach(feature => feature.properties['color'] = Colors.educationColor);

      this.districts = resPolygonData;

      if (this.chart) { this.chart.destroy(); }

      const maxOpacity = resPolygonData['features']
        .map(entry => entry.properties[type])
        .reduce((current, next) => { if (next > current) return next; else return current; } );

      this.districts['features'] = this.districts['features'].map(feature => {

        switch (type) {
          case 'primaryschool':
          {
            feature.properties['active'] = feature.properties.primaryschool;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'Primaryschool distribution',
              [],
              [],
              Colors.educationColor,
              "District",
              "Count"
            ).chart
            ;
            break;
          }
          case 'highschool':
          {
            feature.properties['active'] = feature.properties.highschool;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'Highschool distribution',
              [],
              [],
              Colors.educationColor,
              "District",
              "Count"
            ).chart;
            break;
          }
          case 'university':
          {
            feature.properties['active'] = feature.properties.university;
            feature.properties['maxOpacity'] = maxOpacity;
            this.chart = new BarChart(
              'chartCanvas',
              'University distribution',
              [],
              [],
              Colors.educationColor,
              "District",
              "Count"
            ).chart;
            break;
          }
        }
        return feature;
      });
    });
  }

  preparePopulation() {

    this.populationMode = true;
    this.educationMode = false;
    this.energyMode = false;
    this.healthMode = false;
    if (this.chart) this.chart.destroy();

    this.mapService.loadData('ghanaPopulationDensity.geojson').subscribe(resPolygonData => {
      this.populationTiles = resPolygonData;
      // console.log('Loading populationDensity data...\n', this.populationTiles);
    });
  }

  loadPopulationPyramide(){

    this.mapService.loadData('populationPyramide.json').subscribe(resData => {
      const total = resData['total'];
      const maleCount = resData['distribution'].filter(entry => entry.gender === 'Male').map(entry => entry.count);
      const femaleCount = resData['distribution'].filter(entry => entry.gender === 'Female').map(entry => entry.count);
      const labels = resData['distribution'].filter(entry => entry.gender === 'Female').map(entry => entry.years);

      if (this.chart) this.chart.destroy();

        this.chart = new Chart('chartCanvas', {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                // label: data,
                label: 'Female',
                data: femaleCount,
                backgroundColor: '#1179BE'
              },
              {
                // label: data,
                label: 'Male',
                data: maleCount,
                backgroundColor: '#124FC6'
              }]
          },
          options: {
            legend: {
              display: true,
              labels: {
                fontColor: 'white'
              }
            },
            title: {
              display: true,
              text: 'Population Pyramide',
              fontColor: 'white'
            },
            scales: {
              xAxes: [{
                ticks: {
                  fontColor: "white",
                },
                scaleLabel: {
                  display: true,
                  labelString: "Age",
                  fontColor: 'white'
                }
              }],
              yAxes: [{
                ticks: {
                  fontColor: "white",
                  beginAtZero: true
                },
                scaleLabel: {
                  display: true,
                  labelString: "Count",
                  fontColor: 'white'
                }
              }]
            }
          }

        });
      });
  }

  loadPopOverYears() {
    this.mapService.loadData('popOverYears.json').subscribe(resPointData => {

      const population = resPointData['content'].map(line => line.Population);
      const years = resPointData['content'].map(line => line.Year);
      // console.log(population, years);

      // Destroy any chart if existing
      if (this.chart) { this.chart.destroy(); }

      // create pie chart
      const lineChart = new LineChart(
        'chartCanvas',
        'Population over years',
        population,
        years,
        Colors.populationOverYearsColor,
        "Year",
        "Population"
      );
      this.chart = lineChart.chart;
    });
  }

  loadAulaterraRoad() {

    this.latlngBounds = {
      north: 6.6448,
      east: -1.4223,
      south: 6.604,
      west: -1.490
    };

    this.mapService.loadData('kwasoKorase.geojson').subscribe(resLineData => {
      this.aulaTerraRoad = resLineData;
      // console.log('Loading aulaTerra road...\n', this.aulaTerraRoad);
    });

    this.mapService.loadData('aulaTerraMarkers.json').subscribe(resData => {
      this.aulaTerraMarkers = resData['content'].filter(marker => marker.type !== 'technology');
      // console.log('Loading aula terra markers...\n', this.aulaTerraMarkers);
    });

    this.customMapStyles = this.customMapStyles.map(feature => {
      if (feature.elementType === 'geometry' && feature.featureType === 'road') {
        return {featureType: 'road', elementType: 'geometry', stylers: [{visibility: 'on'}, {color: '#7f8d89'}]};
      } else {return feature; }
    });
  }

  // SCENARIO CONFIGURATIONS
  // load Infrastructure config
  loadInfrastructureConfig() {
    this.resetMap();
    this.latlngBounds = {
      north: 10.5,
      east: -4,
      south: 5,
      west: -4.2
    };
  }
  // load Technology config
  loadTechnologyConfig() {
    this.resetMap();

    this.mapService.loadData('aulaTerraMarkers.json').subscribe(resData => {
      this.aulaTerraMarkers = resData['content'].filter(marker => marker.type === 'technology');
      // console.log('Loading technology markers...\n', this.aulaTerraMarkers);
    });

    this.latlngBounds = {
      north: 18,
      east: 20,
      south: -22,
      west: -20
    };
  }
  // load Concept config
  loadForecastConfig() {
    this.resetMap();
    this.latlngBounds = {
      north: 10.5,
      east: -4,
      south: 5,
      west: -4.2
    };
    this.foreCastMode = true;

    this.loadTimelineContents();

  }

  loadTimelineContents() {
    this.mapService.loadData('timeLineContents.json').subscribe(resData => {
      this.timeLineContents = resData['contents'];
    });
  }

  loadDrone2019Config() {
    this.resetMap();
    this.mapService.loadData('drone2019POI.geojson').subscribe(resData => {
      this.drone2019POI = resData;
    });
    this.latlngBounds = {
      north: 9.767,
      east: 0.38,
      south: 9.377,
      west: -0.19
    };

    this.foreCastMode = true;

    this.foreCastType = 'drone';

    this.loadTimelineContents();

    this.mapService.loadStyles('mapStylesDrones2019.json').subscribe(data => {
      this.customMapStyles = data;
    });
  }

  loadDrone2020Config() {
    this.resetMap();

    this.latlngBounds = {
      north: 10.5,
      east: -4,
      south: 5,
      west: -4.2
    };

    this.foreCastMode = true;
    this.foreCastType = 'drone';

    this.loadTimelineContents();
  }

  // used to hide the info window when random location on map is clicked
  clickedMap(event) {
    console.log('Clicked map...');
    this.infoVisible = false;
    //this.markerVisible = false;
    //this.techmarkerVisible = false;
    this.aulaTerraRoad = false;
  }

  zoomChange(actualZoom) {
    console.log('Zoom changed to: ', actualZoom);
    this.zoom = actualZoom;
    this.stdRadius = this.getStdRadius(actualZoom);
    if (this.healthSites) { this.healthSites.forEach(site => site.radius = this.getStdRadius(actualZoom)); }
    //if (this.powerPlants) { this.powerPlants.forEach(plant => plant.radius = this.getStdRadius(actualZoom) + plant.capacity * 100); }
    if (this.airports) { this.airports.forEach(port => port.radius = this.getStdRadius(actualZoom)); }
  }

  clickedObject(object) {
    console.log('Clicked object!\n', object);
    this.infoVisible = true;
    this.infoLatitude = object.latitude;
    this.infoLongitude = object.longitude;
    this.infoGeoJsonObject = object;
  }

  clickedLine(event) {
    //event.feature.forEachProperty(prop => console.log(prop));
    this.infoVisible = true;
    this.infoLatitude = event.latLng.lat();
    this.infoLongitude = event.latLng.lng();
    //this.infoGeoJsonObject = Object.keys(event.feature.l);
    this.infoGeoJsonObject = event.feature.l;

  }

  clickedDistricts(event) {

    console.log(event);

    // add clicked district to chart data
    function addData(chart, label, data) {
      chart.data.labels.push(label);
      chart.data.datasets.forEach((dataset) => dataset.data.push(data));
      chart.update();
    }

    function removeFirstDataPoint(chart) {
      chart.data.labels.splice(0,1);
      chart.data.datasets.forEach((dataset) => dataset.data.splice(0, 1));
      chart.update();
    }

    // remove first data point if too many
    if (this.chart.data.labels.length >= 3) removeFirstDataPoint(this.chart);

    addData(this.chart, event.feature.l.adm2, event.feature.l.active);
  }

  clickedYear(year, forecastType) {
    // add clicked district to chart data
    function updateChartData(chart, data) {
      chart.data.datasets.forEach((dataset) => dataset.data = data);
      chart.update();
    }

    if (forecastType == 'solar')
    {
      if (!this.powerPlants) return;

      console.log('clicked Timeline: ' + year.toString());
      this.activeTimeLineYear = year;

      // Prepare data for pie chart
      const thermalCapacity = this.powerPlants
        .filter(res => res.type === 'Thermal')
        .filter(res => res.yearCompleted <= this.activeTimeLineYear)
        .map(a => a.capacity)
        .reduceRight((first, next) => first + next, 0);

      const hydroCapacity = this.powerPlants
        .filter(res => res.type === 'Hydroelectric')
        .filter(res => res.yearCompleted <= this.activeTimeLineYear)
        .map(a => a.capacity)
        .reduceRight((first, next) => first + next, 0);

      const solarCapacity = this.powerPlants
        .filter(res => res.type === 'Solar Power')
        .filter(res => res.yearCompleted <= this.activeTimeLineYear)
        .map(a => a.capacity)
        .reduceRight((first, next) => first + next, 0)
        .toFixed(0);

      updateChartData(this.chart, [+thermalCapacity, +hydroCapacity, +solarCapacity]);
    }

    else
    {
      this.mapService.loadData('ghanaHealthsites.geojson').subscribe(resPointData => {

        this.filteredHealthSites = resPointData['features']
          .filter(feature => feature.properties.Type == "District Hospital" || feature.properties.Type == "CHPS")
          .map(filteredSites => new HealthSite(filteredSites, this.getStdRadius(this.zoom)));
      });

      this.activeTimeLineYear = year;

      if (year == 2019)
      {
        this.loadDrone2019Config();
      }
      else if (year == 2020)
      {
        this.loadDrone2020Config();

        this.mapService.loadData('ghanaHealthsites.geojson').subscribe(resPointData => {

          this.forecastSites = resPointData['features']
            .filter(feature => feature.properties.Type == "District Hospital" && +feature.geometry.coordinates[1] > 8)
            .map(filteredSites => new HealthSite(filteredSites, this.getStdRadius(this.zoom)));
        });
      }
    }
  }

  loadMediaSource(src, type) {
    this.mediaSource.src = src;
    this.mediaSource.type = type;
  }

  getStdRadius(zoom) {
    // calculation for reasonable results for circle radius when zooming in
    return Math.round((15000000) / (zoom ** 4));
  }

  resetMap() {

    this.mapService.loadStyles('mapStyles.json').subscribe(data => {
      // console.log('Loading map styles ...');
      this.customMapStyles = data;
    });

    this.latlngBounds = {
      north: 11,
      east: 0,
      south: 4,
      west: -7
    };

    this.educationMode = false;
    this.healthMode = false;
    this.energyMode = false;
    this.infoGeoJsonObject = null;
    this.foreCastMode = false;
    this.foreCastType = null;
    this.populationMode = false;
    this.activeTimeLineYear = 2018;

    // POINT
    this.healthSites = null;
    this.filteredHealthSites = null;
    this.powerPlants = null;
    this.airports = null;
    this.aulaTerraMarkers = null;
    this.forecastSites = null;

    // LINE
    this.powerLines = null;
    this.roadData = null;
    this.aulaTerraRoad = null;
    this.drone2019POI = null;

    // POLYGON
    this.populationTiles = null;
    this.districts = null;

    // MISC
    this.mediaSource.src = null;

    //MISC
    this.mediaSource.src = null;
    this.mediaSource.type = null;
    if (this.chart) this.chart.destroy();
  }
}
