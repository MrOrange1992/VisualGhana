import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MapComponent} from './map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(MapComponent) child;

  loadHealthSites() {
    this.child.loadHealthSites();
  }

  loadSolarStations() {
    this.child.loadSolarStations();
  }

  loadPowerLines() {
    this.child.loadPowerLines();
  }

  loadPowerPlants() {
    this.child.loadPowerPlants();
  }

  loadAirports() {
    this.child.loadAirports();
  }

  ngAfterViewInit() {}
}
