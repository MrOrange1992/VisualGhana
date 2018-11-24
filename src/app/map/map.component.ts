import { Component, OnInit } from '@angular/core';
import {MapService} from './map.service';
import {LatLngBoundsLiteral} from '@agm/core';
import {Chart, ChartComponent} from 'chart.js';
import {PieChart} from '../charts/PieChart';
import {PowerPlant} from '../entities/PowerPlant';
import {HealthSite} from '../entities/HealthSite';
import {Colors} from '../enums/Colors';
import {Airport} from '../entities/Airport';
import {EducationSite} from '../entities/EducationSite';
import {SchoolTypes} from '../enums/SchoolTypes';
import {BarChart} from '../charts/BarChart';
import {StylesService} from './styles.service';
import {EventService} from './event.service';


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
  // disables draggable map functionality
  mapDraggable = false;

  // AGM DATA LAYER OBJECTS
  // POINT
  healthSites: HealthSite[];
  powerPlants: PowerPlant[];
  airports: Airport[];
  educationSites: EducationSite[];

  // LINE
  powerLines;
  roadData;
  surfaceRoads;
  aulaTerra;

  // POLYGON
  overlay;
  populationTiles;
  regions;

  // ONMAP INFO
  infoVisible = false;
  infoLatitude;
  infoLongitude;
  infoGeoJsonObject: Object;

  // CHART
  chart;


  // MISC
  latlngBounds: LatLngBoundsLiteral;

  stdRadius;
  showziplineimg = false;
  showmkopaimg = false;
  showdroneimg = false;
  showpegafricaimg = false;

  constructor(private mapService: MapService, private stylesService: StylesService, private eventService: EventService) {}

  /**
   * Function is called on map initialize
   * Custom mapstyles are loaded here
   */
  ngOnInit() {
    console.log('Loading map and data, please wait ...');

    this.mapService.loadStyles('mapStyles.json').subscribe(data => this.customMapStyles = data);

    this.mapService.loadData('africaBorders.geojson').subscribe(response => {
      this.overlay = response;
      console.log('NGOninit, Overlay data available!!!: ', this.overlay);
    });

    // start in infrastructure configuration
    this.loadInfrastructureConfig();

    this.mapService.loadData('ghanaRoads.geojson').subscribe(result => { this.roadData = result; console.log('NGOninit, Road data available!!!: ', this.roadData); });
    }

  /**
   * Load / reset data for healthsites to be displayed
   * Completeness specifies the completeness of attributes for each object/entry
   */
  loadHealthSites() {

    if (this.healthSites) {
      this.healthSites = null;
      if (this.chart) { this.chart.destroy(); }
    } else {

      this.mapService.loadData('ghanaHealthsites.geojson').subscribe(resPointData => {
        const healthSiteData = resPointData;
        console.log('Loading healthsites...', healthSiteData);

        this.healthSites = healthSiteData['features'].map(feature => new HealthSite(feature, this.getStdRadius(this.zoom)));

        // Destroy any chart if existing
        if (this.chart) { this.chart.destroy(); }

        const data = this.healthSites.map(site => site.type);
        const clinicCount = data.filter(res => res === 'clinic').length;
        const hospitalCount = data.length - clinicCount;
        // console.log(data, clinicCount, hospitalCount);

        const pieChart = new PieChart(
          'chartCanvas',
          'doughnut',
          'Healthsite Type Distribution',
          [clinicCount, hospitalCount],
          ['Clinic', 'Hospital'],
          [Colors.clinicColor, Colors.hospitalColor]
        );

        this.chart = pieChart.chart;
      });
    }

  }

  /**
   * Load / reset data for transportation to be be displayed
   */
  loadTransportation() {
    if (this.airports) {
      this.airports = null;
      this.surfaceRoads = null;
      this.mapService.loadStyles('mapStyles.json').subscribe(data => this.customMapStyles = data );
    } else {
      this.mapService.loadData('ghanaAirports.geojson').subscribe(resPointData => {
        // const airportData = resPointData;

        console.log('Loading airports...');

        this.airports = resPointData['features'].map(feature => new Airport(feature, this.getStdRadius(this.zoom)));
        console.log('Loading airport data...\n', this.airports);

      });

      this.customMapStyles = this.customMapStyles.map(feature => {
        //console.log(feature);
        if (feature.elementType === 'geometry' && feature.featureType === 'road') {
          console.log(feature);
          return {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
              {
                visibility: 'on'
              },
              {
                color: '#7f8d89'
              }
            ]
          };
        } else {
          return feature;
        }
      });

      console.log('Loading road data including surfaces...');
      this.surfaceRoads = {'type': 'FeatureCollection', 'features': this.roadData['features'].filter(data => data.properties.surface != null) };
    }
  }

  /**
   * Load / reset data for power related data to be displayed
   */
  loadPower() {
    if (!this.powerLines) {
      // Load power line data
      this.mapService.loadData('ghanaPowerLines.geojson').subscribe(resLineData => {
        this.powerLines = resLineData;

        console.log('Loading powerline data...\n', this.powerLines);
      });

      // Load power plant data and pasre to PowerPlant objects
      this.mapService.loadData('ghanaPowerPlants.geojson').subscribe(resPointData => {
        const powerPlantData = resPointData;
        console.log('Loading powerplants...\n', powerPlantData);
        this.powerPlants = powerPlantData['features'].map(feature => new PowerPlant(feature, this.getStdRadius(this.zoom)));

        // Destroy any chart if existing
        if (this.chart) { this.chart.destroy(); }

        // Prepare data for pie chart
        const thermalCapacity = this.powerPlants
          .filter(res => res.type === 'Thermal')
          .map(a => a.capacity)
          .reduceRight((first, next) => first + next);

        const hydroCapacity = this.powerPlants
          .filter(res => res.type === 'Hydroelectric')
          .map(a => a.capacity)
          .reduceRight((first, next) => first + next);

        const solarCapacity = this.powerPlants
          .filter(res => res.type === 'Solar Power')
          .map(a => a.capacity)
          .reduceRight((first, next) => first + next)
          .toFixed(0);

        // Compute set of unique lables out of all powerplant types
        const labels = this.powerPlants
          .map(powerPlant => powerPlant.type)
          .filter((index, value, plant) => plant.indexOf(index) === value);

        // console.log(thermalCapacity, hydroCapacity, solarCapacity);

        // create pie chart
        const barChart = new BarChart(
          'chartCanvas',                                                      // Context
          'Powerplant capacity distribution [MW]',                            // Chart title
          [+thermalCapacity, +hydroCapacity, +solarCapacity],                 // Data
          labels,                                                             // Labels
          [Colors.powerThermalplantColor, Colors.powerHydroplantColor, Colors.powerSolarplantColor]    // Colors
        );
        if (this.chart) {
          console.log('Destroying active chart...\n', this.chart);
          this.chart.destroy();
        }
        this.chart = barChart.chart;
      });

    } else {
      if (this.chart) { this.chart.destroy(); }
      this.powerLines = null;
      this.powerPlants = null;
      this.infoGeoJsonObject = null;
    }
  }



  /*loadEducation() {
    if (!this.educationSites)
    {
      this.educationSites = [];


        this.mapService.loadData('primarySchools.json').subscribe(response =>
        {
          console.log(response['results']);
          response['results'].map(feature => {
            this.educationSites.push(new EducationSite(feature, SchoolTypes.primarySchool, this.getStdRadius(this.zoom)));
          });
          console.log(this.educationSites);

          /*Object.keys(SchoolTypes).forEach(query => {
            console.log(query);
            this.mapService.loadEducation(query, [6, -1], 1000).subscribe(response => {
              //console.log(response['results']);
              response['results'].map(feature => {
                this.educationSites.push(new EducationSite(feature, query, this.getStdRadius(this.zoom)));
              });
              console.log(this.educationSites);*/


         /* if (this.chart) { this.chart.destroy(); }

          const data = this.educationSites.map(site => site.type);
          const primarySchool = data.filter(res => res === 'primarySchool').length;
          const middleSchool = data.filter(res => res === 'middleSchool').length;
          const highSchool = data.filter(res => res === 'highSchool').length;
          const university = data.filter(res => res === 'university').length;

          // labels
          const labels = this.educationSites
            .map(educationSite => educationSite.type)
            .filter((index, value, plant) => plant.indexOf(index) === value);

          // console.log(thermalCapacity, hydroCapacity, solarCapacity);

          // create pie chart
          const pieChart = new PieChart(
            'chartCanvas',                                                      // Context
            'doughnut',                                                         // Chart type
            'School type distribution',                            // Chart title
            [+primarySchool, +middleSchool, +highSchool, +university],                 // Data
            labels,                                                             // Labels
            [this.colors.educationSitePrimarySchoolColor, this.colors.educationSiteMiddleSchoolColor, this.colors.educationSiteHighSchoolColor, this.colors.educationSiteUniversityColor]    // Colors
          );
          if (this.chart) {
            console.log('Destroying active chart...\n', this.chart);
            this.chart.destroy();
          }
          this.chart = pieChart.chart;

        });
    } else {
      if (this.chart) { this.chart.destroy(); }
      this.educationSites = null;

    }
  }*/

  loadRegions() {
    if (!this.regions) {

      this.mapService.loadData('ghanaDistricts.geojson').subscribe(resPolygonData => {
        this.regions = resPolygonData;

        console.log('Loading provinces...\n', this.regions);

        resPolygonData['features'].forEach(feature => console.log(feature.properties.adm2));
      });

    }
    else {

      this.regions = null;
    }
  }

  loadPopulationTiles() {
    if (!this.populationTiles) {

      this.mapService.loadData('ghanaPopulationDensity.geojson').subscribe(resPolygonData => {
        this.populationTiles = resPolygonData;

        console.log('Loading populationDensity data...\n', this.populationTiles);


      });

    }
    else {

      this.populationTiles = null;
    }
  }




  loadAulaterraRoad () {

    if(!this.aulaTerra){
      this.mapService.loadData('accraKwaso.geojson').subscribe(resLineData => {
        this.aulaTerra = resLineData;

        console.log('Loading aulaTerra data...\n', this.aulaTerra);
      });
    }
  }

  // SCENARIO CONFIGURATIONS
  // load Infrastructure config
  loadInfrastructureConfig() {
    this.latlngBounds = {
      north: 11,
      east: 0,
      south: 4,
      west: -7
    };
  }
  // load Technology config
  loadTechnologyConfig() {
    this.latlngBounds = {
      north: 18,
      east: 20,
      south: -22,
      west: -20
    };
  }
  // load Concept config
  loadConceptConfig() {
    this.latlngBounds = {
      north: 7,
      east: -1,
      south: 6,
      west: -3
    };
  }

  // used to hide the info window when random location on map is clicked
  clickedMap() { this.infoVisible = false; }

  zoomChange(actualZoom) {
    console.log('Zoom changed to: ', actualZoom);
    this.zoom = actualZoom;
    this.stdRadius = this.getStdRadius(actualZoom);
    if (this.healthSites) { this.healthSites.forEach(site => site.radius = this.getStdRadius(actualZoom)); }
    if (this.powerPlants) { this.powerPlants.forEach(plant => plant.radius = this.getStdRadius(actualZoom)); }
    if (this.airports) { this.airports.forEach(port => port.radius = this.getStdRadius(actualZoom)); }
    if (this.educationSites) { this.educationSites.forEach(edu => edu.radius = this.getStdRadius(actualZoom)); }

  }

  clickedObject(object) {
    console.log('Clicked object!\n', object);
    this.infoVisible = true;
    this.infoLatitude = object.latitude;
    this.infoLongitude = object.longitude;
    this.infoGeoJsonObject = object;
  }

  clickedSurfaceRoads(event) {
    console.log(event);
    this.infoVisible = true;
    this.infoLatitude = event.latLng.lat();
    this.infoLongitude = event.latLng.lng();
    this.infoGeoJsonObject = event.feature.f;
  }

  clickedPowerLines(event) {
    console.log(event);
    this.infoVisible = true;
    this.infoLatitude = event.latLng.lat();
    this.infoLongitude = event.latLng.lng();
    this.infoGeoJsonObject = event.feature.f;
  }

  clickedAulaTerraRoad(event) {
    console.log(event);
    this.infoVisible = true;
    this.infoLatitude = event.latLng.lat();
    this.infoLongitude = event.latLng.lng();
    this.infoGeoJsonObject = event.feature.f;
  }

  clickedRegion(event) {
    console.log(event);
  }

  mouseOverObject(object) {
    console.log('Mouse over object!\n', object);

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
    console.log('Mouse out object!\n', object);
    object.radius = this.getStdRadius(this.zoom);
  }

  loadziplineimage() {
    if (this.showziplineimg) this.showziplineimg = false;
    else {
      this.showziplineimg = true;
      this.showmkopaimg = false;
      this.showpegafricaimg = false;
    }

  }

  loadmkopaimage() {
    if (this.showmkopaimg) this.showmkopaimg = false;
    else {
      this.showmkopaimg = true;
      this.showziplineimg = false;
      this.showpegafricaimg = false;
    }
  }

  loaddroneimage() {
    if (this.showdroneimg) this.showdroneimg = false;
    else {
      this.showdroneimg = true;
      this.showziplineimg = false;
      this.showmkopaimg = false;
    }
  }

  loadpegafricaimage() {
    if (this.showpegafricaimg) this.showpegafricaimg = false;
    else {
      this.showpegafricaimg = true;
      this.showmkopaimg = false;

    }
  }

  getStdRadius(zoom) {
    // calculation for reasonable results for circle radius when zooming in
    return Math.round((15000000) / (zoom ** 4));
  }
}
