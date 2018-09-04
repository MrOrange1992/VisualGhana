import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {ConfigService} from './config.service';

@Injectable()
export class MapService {

  googleMapsAPI;

  constructor(private httpClient: HttpClient) {
   this.httpClient.get('../../assets/private/googleMapsData.json').subscribe(response =>  {
      console.log(response);
      this.googleMapsAPI = response;
    });
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


  loadEducation(query: string, location: number[], radius: number) {

    const url: string = 'https://maps.googleapis.com/maps/api/place/textsearch/json?';

    console.log(this.googleMapsAPI);

    const params = new HttpParams()
      .set('query', query)
      .set('location', `${location[0]}, ${location[1]}`)
      .set('radius', radius.toString())
      .set('key', this.googleMapsAPI.apiKey);

    return this.httpClient.get(url, {params: params});
  }
}
