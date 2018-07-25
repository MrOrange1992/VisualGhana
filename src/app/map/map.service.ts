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
  loadGhanaBorders() {
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
   * Test function for custom point parsing from json
   * @returns {Observable<Point[]>}
   */
  loadTestPoints(): Observable<Point[]> {
    return this.httpClient.get<Point[]>('../../assets/data/testPoint.geojson');
  }
}
