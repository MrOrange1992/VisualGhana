import { Component, OnInit } from '@angular/core';
import {MapService} from './map.service';
import {MapTypeStyle} from '@agm/core';
import {Chart, ChartComponent} from 'chart.js';

import * as borderStyles from '../../assets/styles/borderStyles.json';
import * as powerLineStyles from '../../assets/styles/powerLineStyles.json';
import * as powerPlantStyles from '../../assets/styles/powerPlantStyles.json';
import * as healthCareStyles from '../../assets/styles/healthCareStyles.json';
import * as solarStyles from '../../assets/styles/solarStyles.json';
import * as primaryRoadStyles from '../../assets/styles/primaryRoadStyles.json';
import * as secondaryRoadStyles from '../../assets/styles/secondaryRoadStyles.json';
import * as tertiaryRoadStyles from '../../assets/styles/tertiaryRoadStyles.json';
import {PieChart} from '../entities/PieChart';
import {PowerPlant} from '../entities/PowerPlant';
import {HealthSite} from '../entities/HealthSite';
import {Colors} from '../entities/Colors';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {

  // MAP CONFIG / STYLES
  latitude;
  longitude;
  zoom;
  // property for custom map styles, edit in file ../assets/mapStyles.json
  customMapStyles;
  // disables draggable map functionality
  mapDraggable = false;

  colors = Colors;


  // AGM DATA LAYER OBJECTS
  borders;
  healthSites: HealthSite[];
  powerLines;
  powerPlants: PowerPlant[];
  airports;
  // ROAD types
  roadData;
  primaryRoads;
  secondaryRoads;
  tertiaryRoads;
  unclassifiedRoads;
  surfaceRoads;

  // ONMAP INFO
  infoVisible = false;
  infoLatitude;
  infoLongitude;
  infoGeoJsonObject: Object;

  // CHART
  chart = [];


  // MISC
  stdRadius;


  constructor(private mapService: MapService) {}

  /**
   * Function is called on map initialize
   * Custom mapstyles are loaded here
   */
  ngOnInit() {
    this.mapService.loadCustomMapStyles('mapStyles').subscribe(data => this.customMapStyles = data);

    // additionally ghana borders polyline is loaded here
    this.mapService.loadBorders().subscribe(data => this.borders = data);

    // start in infrastructure configuration
    this.loadInfrastructureConfig();

    // this.mapService.loadRoads().subscribe(result => { this.roadData = result; console.log(this.roadData); });
    }

  /**
   * Load / reset data for healthsites to be displayed
   * Completeness specifies the completeness of attributes for each object/entry
   */
  loadHealthSites() {

    if (this.healthSites) {
      this.healthSites = null;
      this.chart = [];
    }
    else {

      this.mapService.loadHealthSites().subscribe(resPointData => {
        const healthSiteData = resPointData;
        console.log(healthSiteData);

        this.healthSites = healthSiteData['features'].map(feature => {
          return new HealthSite(
            feature.properties.name,
            +feature.geometry.coordinates[1],
            +feature.geometry.coordinates[0],
            +feature.properties.completeness.slice(0, -1),
            feature.properties.type,
            this.stdRadius
          );
        });
        console.log(this.healthSites);

        const data = this.healthSites.map(site => site.type);
        const clinicCount = data.filter(res => res === 'clinic').length;
        const hospitalCount = data.length - clinicCount;
        console.log(data, clinicCount, hospitalCount);

        const pieChart = new PieChart('canvas', 'doughnut', 'Feature Completeness',
          [clinicCount, hospitalCount], ['Clinic', 'Hospital'], Object.keys(this.colors).map(key => this.colors[key]));
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
      this.mapService.loadCustomMapStyles('mapStyles').subscribe(data => this.customMapStyles = data );

    }
    else {
      this.mapService.loadAirports().subscribe(resPointData => this.airports = resPointData);

      this.mapService.loadCustomMapStyles('mapStylesRoad').subscribe(data => this.customMapStyles = data );

      // const filteredData = this.roadData['features'].filter(data => data.properties.highway === 'primary');
      // console.log(filteredData);

      // this.primaryRoads = {'type': 'FeatureCollection', 'features': this.roadData['features'].filter(data => data.properties.highway === 'primary') };
      // this.secondaryRoads = {'type': 'FeatureCollection', 'features': this.roadData['features'].filter(data => data.properties.highway === 'secondary') };
      // this.tertiaryRoads = {'type': 'FeatureCollection', 'features': this.roadData['features'].filter(data => data.properties.highway === 'tertiary') };
      // this.unclassifiedRoads = {'type': 'FeatureCollection', 'features': this.roadData['features'].filter(data => data.properties.highway === 'unclassified') };
      //console.log(this.primaryRoads, this.secondaryRoads, this.tertiaryRoads);

      this.surfaceRoads = {'type': 'FeatureCollection', 'features': this.roadData['features'].filter(data => data.properties.surface != null) };
      console.log(this.surfaceRoads);



      // const pieChart = new PieChart('canvas', 'doughnut', 'Road Surfaces', [overHalf, lesserHalf], ['Greater 50%', 'Less 50%'], ['#28536C', '#28436C']);
      // this.chart = pieChart.chart;

    }
  }

  /**
   * Load / reset data for power related data to be displayed
   */
  loadPower() {
    if (!this.powerLines) {

      this.mapService.loadPowerLines().subscribe(resLineData => this.powerLines = resLineData);
      this.mapService.loadPowerPlants().subscribe(resPointData => {
        const powerPlantData = resPointData;

        console.log(powerPlantData);

        this.powerPlants = powerPlantData['features'].map(feature => {

          const cap = +feature.properties['capacity(MW)'];


          return new PowerPlant(
            feature.properties.name,
            +feature.geometry.coordinates[0],
            +feature.geometry.coordinates[1],
            feature.properties.community,
            cap,
            cap * 100,
            feature.properties.yearCompleted
          );
        });
        console.log(this.powerPlants);
      });
    } else {
      this.powerLines = null;
      this.powerPlants = null;
    }
  }

  // return json styles for objects to display from import statements
  loadBorderStyles() { return borderStyles; }
  loadPowerPlantsStyles() { return powerPlantStyles; }
  loadPowerLineStyles() { return powerLineStyles; }
  loadHealthcareStyles() { return healthCareStyles; }
  loadSolarStyles() { return solarStyles; }
  loadPrimaryRoadStyles() {return primaryRoadStyles; }
  loadSecondaryRoadStyles() {return secondaryRoadStyles; }
  loadTertiaryRoadStyles() {return tertiaryRoadStyles; }


  // load Infrastructure config
  loadInfrastructureConfig() {
    this.zoom = 6.98;
    this.latitude = 7.35;
    this.longitude = -3.9;
    this.stdRadius = 10000;

    if (this.healthSites) this.healthSites.forEach(site => site.radius = this.stdRadius);

  }

  // load Technology config
  loadTechnologyConfig() {
    this.zoom = 4;
    this.latitude = 3.751479;
    this.longitude = 22.454407;
    this.stdRadius = 20000;

    if (this.healthSites) this.healthSites.forEach(site => site.radius = this.stdRadius);
    // if (this.powerPlants) this.powerPlants.forEach(site => site.radius = this.stdRadius + (+site['capacity(MW)'] *10));

  }

  // load Concept config
  loadConceptConfig() {
    this.zoom = 9;
    this.latitude = 6.63333;
    this.longitude = -1.451813;
    this .stdRadius = 2000;

    if (this.healthSites) this.healthSites.forEach(site => site.radius = this.stdRadius);
    // if (this.powerPlants) this.powerPlants.forEach(site => site.radius = this.stdRadius + (+site['capacity(MW)'] *10));

  }

  // used to hide the info window when random location on map is clicked
  clickedMap() { this.infoVisible = false; }

  clickedHealthCare(healthSite) {
    console.log('Clicked Health Site!\n', healthSite);
    this.infoVisible = true;
    this.infoLatitude = healthSite.latitude;
    this.infoLongitude = healthSite.longitude;
    this.infoGeoJsonObject = healthSite;
  }



}
