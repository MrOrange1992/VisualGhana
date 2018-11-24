import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import googleMapsData from '../../assets/private/googleMapsData.json';

@Injectable()
export class MapService {

  pathToData: string = '../../assets/data/';
  pathToStyles: string = '../../assets/styles/';

  constructor(private httpClient: HttpClient) {}

  loadData(resource) {
    return this.httpClient.get(this.pathToData + resource);
  }

  loadStyles(resource) {
    return this.httpClient.get(this.pathToStyles + resource);
  }
}
