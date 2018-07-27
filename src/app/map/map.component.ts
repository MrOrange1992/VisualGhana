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
  longitude = -3.5;

  // zoom factor for google maps
  zoom = 7.9;

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
    this.mapService.loadSolarStations().subscribe(resPointData => this.solarStations = resPointData);
    this.mapService.loadPowerLines().subscribe(resLineData => this.powerLines = resLineData);
    this.mapService.loadPowerPlants().subscribe(resPointData => this.powerPlants = resPointData);
  }

  loadTransportation() {
    this.mapService.loadAirports().subscribe(resPointData => this.airports = resPointData);
    this.mapService.loadRoads().subscribe(resLineData => this.roads = resLineData);

  }

}
