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


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {

  // MAP CONFIG / STYLES
  map;
  zoom;
  // property for custom map styles, edit in file ../assets/mapStyles.json
  public customMapStyles;
  public educationDistributionStyles;

  // AGM DATA LAYER OBJECTS
  // POINT
  healthSites: HealthSite[];
  filteredHealthSites: HealthSite[];
  powerPlants: PowerPlant[];
  airports: Airport[];
  popOverYearData;
  aulaTerraMarkers;

  // LINE
  powerLines;
  roadData;
  aulaTerraRoad;
  popOverYears;

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

  // MISC
  objectKeys = Object.keys;
  colors = Colors;
  latlngBounds: LatLngBoundsLiteral;
  educationMode = false;
  healthMode = false;
  stdRadius;
  activeTimeLineYear = 2018;
  years: number[] =  Array(
    1965,
    1982,
    2000,
    2008,
    2010,
    2013,
    2016,
    2017,
    2020,
    2030,
    2040,
    2050
  );
  mediaSource = {
    type: null,
    src: null
  };
  foreCastMode = false;
  aulaTerraMode = false;
  populationMode = false;

  constructor(
    private mapService: MapService,
    private stylesService: StylesService,
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

    this.mapService.loadData('ghanaHealthsites.geojson').subscribe(resPointData => {

      // console.log('Loading healthsites...', resPointData);

      this.healthSites = resPointData['features'].map(feature => new HealthSite(feature, this.getStdRadius(this.zoom)));

      // Destroy any chart if existing
      if (this.chart) this.chart.destroy();

      const data = this.healthSites.map(site => site.type);

      const clinicCount = data.filter(res => res === 'Clinic').length;
      const hospitalCount = data.filter(res =>
        res === 'Hospitals' ||
        res === 'District Hospital' ||
        res === 'Health Centre' ||
        res === 'Regional Hospital').length;
      const maternityCount = data.filter(res => res === 'Maternity Home' || res === 'RCH').length;
      const otherlenght = data.length - clinicCount - hospitalCount - maternityCount;
      // console.log(data, clinicCount, hospitalCount);

      const pieChart = new PieChart(
        'chartCanvas',
        'doughnut',
        'Healthsite Type Distribution',
        [clinicCount, hospitalCount, maternityCount, otherlenght],
        ['Clinic', 'Hospital', 'Children Healthcare', 'Others'],
        [Colors.clinicColor, Colors.hospitalColor, Colors.maternityColor, '#000']
      );

      this.chart = pieChart.chart;
    });
  }

  loadHealthSiteType(type) {
    this.filteredHealthSites = null;
    switch (type) {
      case 'Hospital':
        this.filteredHealthSites = this.healthSites.filter(site =>
          site.type === 'Hospitals' ||
          site.type === 'District Hospital' ||
          site.type === 'Health Centre' ||
          site.type === 'Regional Hospital');

          console.log(this.filteredHealthSites);

        break;

      case 'Clinic':
        // console.log(this.healthSites.length);
        this.filteredHealthSites = this.healthSites.filter(site => site.type === type);
        break;

      case 'Children Healthcare':
        this.filteredHealthSites = this.healthSites.filter(site =>
          site.type === 'Maternity Home' ||
          site.type === 'RCH');
        break;

      case 'Others':
        this.filteredHealthSites = this.healthSites.filter(site =>
          site.type === 'CHPS');
        break;

      default:
        console.log('Unknown healthsite type specified: ' + type.toString());
    }

  }

  loadTransportation() {

    this.mapService.loadData('ghanaRoads.geojson').subscribe(result => {
      // console.log('Loading road data ...');
      this.roadData = result;
    });

    this.mapService.loadData('ghanaAirports.geojson').subscribe(resPointData => {
      // console.log('Loading airport data ...');
      this.airports = resPointData['features'].map(feature => new Airport(feature, this.getStdRadius(this.zoom)));
    });
  }

  /**
   * Load / reset data for power related data to be displayed
   */
  loadPower() {

    // Load power line data
    this.mapService.loadData('ghanaPowerLines.geojson').subscribe(resLineData => {
      this.powerLines = resLineData;

      // console.log('Loading powerline data...\n', this.powerLines);
    });

    // Load power plant data and pasre to PowerPlant objects
    this.mapService.loadData('ghanaPowerPlants.geojson').subscribe(resPointData => {
      // console.log('Loading powerplants...\n', powerPlantData);
      this.powerPlants = resPointData['features'].map(feature => new PowerPlant(feature, this.getStdRadius(this.zoom)));

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
        [Colors.powerThermalplantColor, Colors.powerHydroplantColor, Colors.powerSolarplantColor]    // Colors
      );

      this.chart = barChart.chart;
    });
  }

  prepareEducation() {
    this.educationMode = true;
  }

  loadEducationDistribution(type) {

    this.mapService.loadData('ghanaDistricts.geojson').subscribe(resPolygonData => {
      this.districts = resPolygonData;

      if (this.chart) { this.chart.destroy(); }

      this.districts['features'] = this.districts['features'].map(feature => {

        switch (type) {
          case 'primaryschool':
          {
            feature.properties.active = feature.properties.primaryschool;
            this.chart = new BarChart('chartCanvas', 'Primaryschool distribution', [], [], Colors.educationColor).chart;
            break;
          }
          case 'highschool':
          {
            feature.properties.active = feature.properties.highschool;
            this.chart = new BarChart('chartCanvas', 'Highschool distribution', [], [], Colors.educationColor).chart;
            break;
          }
          case 'university':
          {
            feature.properties.active = feature.properties.university;
            this.chart = new BarChart('chartCanvas', 'University distribution', [], [], Colors.educationColor).chart;
            break;
          }
        }
        return feature;
      });
    });
  }

  preparePopulation() {

    this.populationMode = true;
    this.mapService.loadData('ghanaPopulationDensity.geojson').subscribe(resPolygonData => {
      this.populationTiles = resPolygonData;
      // console.log('Loading populationDensity data...\n', this.populationTiles);
    });
  }

    /*loadPopulationTiles() {
      this.mapService.loadData('ghanaPopulationDensity.geojson').subscribe(resPolygonData => {
        this.populationTiles = resPolygonData;
        console.log('Loading populationDensity data...\n', this.populationTiles);
      });*/

    loadPopulationPyramide(){

      this.mapService.loadData('populationPyramide.json').subscribe(resData => {
        const total = resData['total'];
        const maleCount = resData['distribution'].filter(entry => entry.gender === 'Male').map(entry => entry.count);
        const femaleCount = resData['distribution'].filter(entry => entry.gender === 'Female').map(entry => entry.count);
        const labels = resData['distribution'].filter(entry => entry.gender === 'Female').map(entry => entry.years);

        if (this.chart) {
          this.chart.destroy();
        }

        this.chart = new Chart('chartCanvas', {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                // label: data,
                data: femaleCount,
                backgroundColor: '#113951'
              },
              {
                // label: data,
                data: maleCount,
                backgroundColor: '#806315'
              }]
          },
          options: {
            legend: {
              display: false,
              labels: {
                fontColor: 'white'
              }
            },
            title: {
              display: true,
              text: 'Population Pyramide',
              fontColor: 'white'
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
        'Population over the years',
        population,
        years,
        Colors.populationOverYearsColor
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
      north: 11,
      east: 0,
      south: 4,
      west: -7
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
  loadConceptConfig() {
    this.resetMap();
    this.latlngBounds = {
      north: 11,
      east: 0,
      south: 4,
      west: -7
    };
    if (this.foreCastMode) this.foreCastMode = false;
    else {
      this.foreCastMode = true;
    }
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
    if (this.powerPlants) { this.powerPlants.forEach(plant => plant.radius = this.getStdRadius(actualZoom) + plant.capacity * 100); }
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

  clickedYear(year) {

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

    // add clicked district to chart data
    function updateChartData(chart, data) {
      chart.data.datasets.forEach((dataset) => dataset.data = data);
      chart.update();
    }

    updateChartData(this.chart, [+thermalCapacity, +hydroCapacity, +solarCapacity]);
  }

/*
  mouseOverObject(object) {
    // console.log('Mouse over object!\n', object);

    if (this.zoom < 11) {
      const newRadius = object.capacity * this.getStdRadius(this.zoom) / 10;

      if (newRadius > 30000) {
        object.radius = 30000;
      } else if (newRadius < this.getStdRadius(this.zoom)) {
      } else {
        object.radius = object.capacity * this.getStdRadius(this.zoom) / 10;
      }
    }
  }


  mouseOutObject(object) {
    // console.log('Mouse out object!\n', object);
    object.radius = this.getStdRadius(this.zoom);
  }
  */

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
    this.infoGeoJsonObject = null;
    this.foreCastMode = false;
    this.populationMode = false;

    // POINT
    this.healthSites = null;
    this.filteredHealthSites = null;
    this.powerPlants = null;
    this.airports = null;
    this.aulaTerraMarkers = null;

    // LINE
    this.powerLines = null;
    this.roadData = null;
    this.aulaTerraRoad = null;

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
