import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MapComponent} from './map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(MapComponent) child;

  /**
   * Call function from child MapComponent for test point display
   */
  callTestPoints() {
    this.child.loadTestPoints();
  }

  /**
   * Call function from MapComponent to display Ghana borders as polyline
   * Called onClick
   */
  loadGhanaBorders() {
    this.child.loadGhanaBorders();
  }

  loadHealthSites() {
    this.child.loadHealthSites();
  }
  ngAfterViewInit() {}
}
