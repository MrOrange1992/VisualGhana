import { Component, OnInit } from '@angular/core';
import {MapService} from './map.service';
import {MapTypeStyle} from '@agm/core';
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

  // attributes for map styles and config
  latitude;
  longitude;
  zoom;
  // property for custom map styles, edit in file ../assets/mapStyles.json
  customMapStyles: MapTypeStyle[] = [];
  // disables draggable map functionality
  mapDraggable = false;

  // attributes to store agm data layer objects
  borders;
  healthSites;
  solarStations;
  powerLines;
  powerPlants;
  airports;
  roads;

  constructor(private mapService: MapService) {}

  /**
   * Function is called on map initialize
   * Custom mapstyles are loaded here
   */
  ngOnInit()
  {
    this.mapService.loadCustomMapStyles().subscribe(data => {
      Object.values(data).forEach(value => this.customMapStyles.push(value));
    });

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
    if (this.healthSites) this.healthSites = null;
    else this.mapService.loadHealthSites().subscribe(resPointData => this.healthSites = resPointData);
  }

  /**
   * Load / reset data for transportation to be be displayed
   */
  loadTransportation()
  {
    if (this.airports) this.airports = null;
    else this.mapService.loadAirports().subscribe(resPointData => this.airports = resPointData);
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


}
