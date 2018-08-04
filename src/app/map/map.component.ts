import { Component, OnInit } from '@angular/core';
import {MapService} from './map.service';
import {MapTypeStyle} from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {

  // coordinates for map init
  latitude = 7.2;
  longitude = -3.9;



  // zoom factor for google maps
  zoom: number = 6.9;

  // object to store geojson data for ghana border polyline
  borders;

  // object to store health site geojson data
  healthSites;

  // object to store solarstations geojson data
  solarStations;

  // power lines
  powerLines;

  // power plants
  powerPlants;

  // airports
  airports;

  // roads
  roads;

  // property for custom map styles, edit in file ../assets/mapStyles.json
  customMapStyles: MapTypeStyle[] = [];

  // test custom point display from json
  testPoints: Point[] = [];

  // disables draggable map functionality
  mapDraggable = false;

  // toggle for power

  powerActive: boolean = false;

  // toggle for healthcare

  healthCareActive: boolean = false;

  // toggle for transportation

  transportationActive: boolean = false;

  constructor(private mapService: MapService) {}

  /**
   * Function is called on map initialize
   * Custom mapstyles are loaded here
   */
  ngOnInit() {
    this.mapService.loadCustomMapStyles().subscribe(data => {
      Object.values(data).forEach(value => this.customMapStyles.push(value));
    });
    this.mapService.loadBorders().subscribe(data => this.borders = data);
  }

  loadHealthSites() {

    if (this.healthSites)
      this.healthSites = null;

    else
      this.mapService.loadHealthSites().subscribe(resPointData => this.healthSites = resPointData);
}

  loadSolarStations() {
    this.mapService.loadSolarStations().subscribe(resPointData => this.solarStations = resPointData);
  }

  loadPowerLines() {
    this.mapService.loadPowerLines().subscribe(resLineData => this.powerLines = resLineData);
  }

  loadPowerPlants() {
    this.mapService.loadPowerPlants().subscribe(resPointData => this.powerPlants = resPointData);
  }

  loadAirports() {
    this.mapService.loadAirports().subscribe(resPointData => this.airports = resPointData);
  }


  loadPower() {

    if (!this.powerActive)
    {
      this.mapService.loadSolarStations().subscribe(resPointData => this.solarStations = resPointData);
      this.mapService.loadPowerLines().subscribe(resLineData => this.powerLines = resLineData);
      this.mapService.loadPowerPlants().subscribe(resPointData => this.powerPlants = resPointData);
      this.powerActive = true;
    }
    else
    {
      this.solarStations = null;
      this.powerLines = null;
      this.powerPlants = null;
      this.powerActive = false;

    }
  }


  loadTransportation() {

    if (!this.transportationActive)
    {
      this.mapService.loadAirports().subscribe(resPointData => this.airports = resPointData);

      //this.mapService.loadRoads().subscribe(resLineData => this.roads = resLineData);
      this.transportationActive = true;
       }
       else
    {
      this.airports = null;
      //this.roads = null;
      this.transportationActive = false;
    }


  }


  // define line thickness for elements in data layer


  loadTest(feature) {
    return ({
             clickable: false,
         strokeWeight: 2

       });

// load image for data layer
  }
  loadPowerPlantsStyles(feature)
  {
    return ({
      clickable: false,
      icon: '../../assets/img/thermalplant.png',
      //width: 50%,
      //height: 0.001

    });
  }

  // load Infrastructure config

  loadInfrastructureConfig(){

    this.zoom = 6.9;
    this.latitude = 7.2;
    this.longitude = -3.9;
  }

  // load Technology config

  loadTechnologyConfig(){

    this.zoom = 4;
    this.latitude = 3.751479;
    this.longitude = 22.454407;
  }

  // load Concept config

  loadConceptConfig(){

    this.zoom = 9;
    this.latitude = 6.629198;
    this.longitude = -1.451813;
  }


}
