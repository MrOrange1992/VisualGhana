import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class MapService {

  constructor(private httpClient: HttpClient) {}

  /**
   * Loads custom map styles for google map
   * @returns {Observable<Object>}
   */
  loadCustomMapStyles() {
    return this.httpClient.get('../../assets/mapStyles.json');
  }

  /**
   * Loads polyline geojson data
   * @returns
   */
  loadBorders() {
    return this.httpClient.get('../../assets/data/ghanaBorders.geojson');
  }

  /**
   * Loads healthsites points geojson data
   * @returns
   */
  loadHealthSites() {
    return this.httpClient.get('../../assets/data/ghanaHealthsites.geojson');
  }

  /**
   * Loads solar stations on grid points geojson data
   * @returns
   */
  loadSolarStations() {
    return this.httpClient.get('../../assets/data/ghanaSolarStations.geojson');
  }

  /**
   * Loads power lines geojson data
   * @returns
   */
  loadPowerLines() {
    return this.httpClient.get('../../assets/data/ghanaPowerLines.geojson');
  }

  /**
   * Loads power plants geojson data
   * @returns
   */
  loadPowerPlants() {
    return this.httpClient.get('../../assets/data/ghanaPowerPlants.geojson');
  }

  /**
   * Loads air ports geojson data
   * @returns
   */
  loadAirports() {
    return this.httpClient.get('../../assets/data/ghanaAirports.geojson');
  }

  loadRoads() {
    return this.httpClient.get('../../assets/data/ghanaRoads.geojson');
  }
}
