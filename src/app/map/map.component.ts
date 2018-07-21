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
  latitude = 7.95;
  longitude = -1;

  // object to store geojson data for ghana border polyline
  ghanaBorders;

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
  }

  /**
   * Loads and displays polyline showing Ghana borders
   */
  loadGhanaBorders() {
    this.mapService.loadGhanaBorders().subscribe(data => this.ghanaBorders = data);
  }

  /**
   * Test point display
   */
  loadTestPoints() {
    this.mapService.loadTestPoints().subscribe(resPointData => this.testPoints = resPointData);
  }

}
