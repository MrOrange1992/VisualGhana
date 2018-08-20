import { Component, OnInit } from '@angular/core';
import {MapService} from './map.service';
import {MapTypeStyle} from '@agm/core';
import {Chart, ChartComponent} from 'chart.js';

import * as borderStyles from '../../assets/styles/borderStyles.json';
import * as powerLineStyles from '../../assets/styles/powerLineStyles.json';
import * as powerPlantStyles from '../../assets/styles/powerPlantStyles.json';
import * as healthCareStyles from '../../assets/styles/healthCareStyles.json';
import * as solarStyles from '../../assets/styles/solarStyles.json';

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
  customMapStyles: MapTypeStyle[] = [];
  // disables draggable map functionality
  mapDraggable = false;

  // AGM DATA LAYER OBJECTS
  borders;
  healthSites;
  solarStations;
  powerLines;
  powerPlants;
  airports;
  roads;

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
  ngOnInit()
  {
    this.mapService.loadCustomMapStyles().subscribe(data => { Object.values(data).forEach(value => this.customMapStyles.push(value)); });

    // additionally ghana borders polyline is loaded here
    this.mapService.loadBorders().subscribe(data => this.borders = data);

    // start in infrastructure configuration
    this.loadInfrastructureConfig();
  }

  /**
   * Load / reset data for healthsites to be displayed
   */
  loadHealthSites()
  {
    let data = [];
    let allCount = 0;
    let greaterHalfCount = 0;

    let completeness;

    if (this.healthSites)
    {
      this.healthSites = null;
    }
    else
    {
      this.mapService.loadHealthSites().subscribe(resPointData => this.healthSites = resPointData);



      this.chart = new Chart('canvas', {
        type: 'pie',
        data: {
          labels: ['hospital', 'clinic'],
          datasets: [{
            label: 'Hospital / Clinic',
            data: [120, 102],
          }]
        }
      });
    }

  }

  /**
   * Load / reset data for transportation to be be displayed
   */
  loadTransportation()
  {
    if (this.airports)
    {
      this.airports = null;
      this.roads = null;

    }
    else
    {
      this.mapService.loadAirports().subscribe(resPointData => this.airports = resPointData);
      /* this.mapService.loadRoads().subscribe(resLineData => this.roads = resLineData); */
    }
  }

  /**
   * Load / reset data for power related data to be displayed
   */
  loadPower()
  {
    if (this.powerLines)
    {
      this.solarStations = null;
      this.powerLines = null;
      this.powerPlants = null;
    }
    else
    {
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


  // load Infrastructure config
  loadInfrastructureConfig()
  {
    this.zoom = 8;
    this.latitude = 7.35;
    this.longitude = -3.9;
  }

  // load Technology config
  loadTechnologyConfig()
  {
    this.zoom = 4;
    this.latitude = 3.751479;
    this.longitude = 22.454407;
  }

  // load Concept config
  loadConceptConfig()
  {
    this.zoom = 9;
    this.latitude = 6.629198;
    this.longitude = -1.451813;
  }

  clickedMap(clickEvent)
  {
    this.infoVisible = false;
  }

  clickedHealthCare(clickEvent)
  {
    this.infoVisible = true;
    this.infoLatitude = clickEvent.latLng.lat();
    this.infoLongitude = clickEvent.latLng.lng();
    this.infoGeoJsonObject = clickEvent.feature.f;
  }



}
