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
  customMapStyles;//: MapTypeStyle[] = [];
  // disables draggable map functionality
  mapDraggable = false;

  // AGM DATA LAYER OBJECTS
  borders;
  healthSites;
  solarStations;
  powerLines;
  powerPlants;
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

    this.mapService.loadRoads().subscribe(result => {
      this.roadData = result;
      console.log(this.roadData);
    });
    }

  /**
   * Load / reset data for healthsites to be displayed
   */
  loadHealthSites() {
    let data = [];
    let allCount = 0;
    let greaterHalfCount = 0;

    let completeness;

    if (this.healthSites) {
      this.healthSites = null;
    }
    else {
      this.mapService.loadHealthSites().subscribe(resPointData => this.healthSites = resPointData);


      const pieChart = new PieChart('TestPie', 'canvas', [120, 102], ['hospital', 'clinic'], ['#28536C', '#28436C']);

      this.chart = pieChart.chart;

      /*this.chart = new Chart('canvas', {
        type: 'pie',
        data: {
          labels: ['hospital', 'clinic'],
          datasets: [{
            label: 'Hospital / Clinic',
            data: [120, 102],
          }]
        }
      });
      */
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


    }
  }

  /**
   * Load / reset data for power related data to be displayed
   */
  loadPower() {
    if (this.powerLines) {
      this.solarStations = null;
      this.powerLines = null;
      this.powerPlants = null;
    }
    else {
      this.mapService.loadSolarStations().subscribe(resPointData => this.solarStations = resPointData);
      this.mapService.loadPowerLines().subscribe(resLineData => this.powerLines = resLineData);
      this.mapService.loadPowerPlants().subscribe(resPointData => this.powerPlants = resPointData);
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
  loadInfrastructureConfig()
  {
    this.zoom = 6.98;
    this.latitude = 7.35;
    this.longitude = -3.9;
  }

  // load Technology config
  loadTechnologyConfig() {
    this.zoom = 4;
    this.latitude = 3.751479;
    this.longitude = 22.454407;
  }

  // load Concept config
  loadConceptConfig() {
    this.zoom = 9;
    this.latitude = 6.629198;
    this.longitude = -1.451813;
  }

  clickedMap(clickEvent) {
    this.infoVisible = false;
  }

  clickedHealthCare(clickEvent) {
    this.infoVisible = true;
    this.infoLatitude = clickEvent.latLng.lat();
    this.infoLongitude = clickEvent.latLng.lng();
    this.infoGeoJsonObject = clickEvent.feature.f;
  }



}
