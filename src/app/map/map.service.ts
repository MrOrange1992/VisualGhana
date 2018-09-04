import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class MapService {

  hereAPI;

  constructor(private httpClient: HttpClient) {
   /* this.httpClient.get('../../assets/private/hereApi.json').subscribe(response =>  {
      console.log(response);
      this.hereAPI = response;
    });*/
  }

  /**
   * Loads custom map styles for google map
   * @returns {Observable<Object>}
   */
  loadCustomMapStyles(file) {
    return this.httpClient.get(`../../assets/styles/${file}.json`);
  }

  /**
   * Loads polyline geojson data
   * @returns
   */
  loadBorders() {
    return this.httpClient.get('../../assets/data/ghanaBorders.geojson');
  }

  loadOverlay() {
    return this.httpClient.get('../../assets/data/africaBorders.geojson');
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

  /**
   * Loads road geojson data (file is ~244MB)
   * @returns {Observable<Object>}
   */
  loadRoads() {
    return this.httpClient.get('../../assets/data/ghanaRoads.geojson');
  }


  loadEducation() {

    //https://maps.googleapis.com/maps/api/place/textsearch/json?query=school&location=6,-1&radius=100000&fields=id,photos&key=AIzaSyCSAhqBNgszAqDNKynLN8ctyJ-J4GdS8IA
    const url: string = 'https://maps.googleapis.com/maps/api/place/textsearch/json?';

    const params = new HttpParams()
      .set('query', "school")
      .set('location', "6,-1")
      .set('radius', '10000')
      .set('key', 'AIzaSyCSAhqBNgszAqDNKynLN8ctyJ-J4GdS8IA');

    //return this.httpClient.get(url, {params: params});
    return this.httpClient.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=school&location=6,-1&radius=100000&fields=id,photos&key=AIzaSyCSAhqBNgszAqDNKynLN8ctyJ-J4GdS8IA");
  }
}
