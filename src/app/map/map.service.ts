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

  loadEducation(query: string, location: number[], radius: number) {

    const url: string = 'https://maps.googleapis.com/maps/api/place/textsearch/json?';
    // const url: string = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=primarySchool&location=6,-1&radius=1000&key=AIzaSyCSAhqBNgszAqDNKynLN8ctyJ-J4GdS8IA';


    const params = new HttpParams()
      //.set('callback', 'JSONP_CALLBACK')
      .set('query', query)
      .set('location', `${location[0]},${location[1]}`)
      .set('radius', radius.toString())
      .set('key', googleMapsData.apiKey);

    return this.httpClient.get(url, {params: params});

    // return this.httpClient.jsonp(`${url}?${params.toString()}`, 'callback');


  // https://maps.googleapis.com/maps/api/place/textsearch/json?query=primarySchool&location=6,-1&radius=1000&key=AIzaSyCSAhqBNgszAqDNKynLN8ctyJ-J4GdS8IA
  }
}
