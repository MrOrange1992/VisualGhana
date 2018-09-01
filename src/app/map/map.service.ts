import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class MapService {

  hereAPI;

  constructor(private httpClient: HttpClient) {
    this.httpClient.get('../../assets/private/hereApi.json').subscribe(response =>  {
      console.log(response);
      this.hereAPI = response;
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

  // HERE API education
  // https://places.cit.api.here.com/places/v1/autosuggest?q=education&compressedRoute=8-hf3jiTwsFglKsEw9JviF0nJ49CgxJrE46Gs8Do2CjpCguI7uB8lIg4D89LkvJnvDkjPvtC4oPn8Es8NsxL0tanqI8vX3_VriBvsU847C7nW84sCzzXg27BA8hyB43Zw7ekqT4u5Bw5Lk3iE0svCgvlFnuVsy2DrlRkxmGnhewiwCs-oCr0MkprDAwhlE_mEkprD4vd861Cr7Qwi8Bvm_B77M_3hB0zmBztuBo0mBvk7BArt_B_yIrxuBAznEk9qB7h3BryI_5jCvpE7lmB8uV7t7BslR32_B77MjpoCAj6uB8oE_jkCryI_8_BslRn-_Bk9qBrzZoher5MwoWjkC40J_oI4IzsOjiXr8hB3rQr1Oj3KviF_mOjkC_iQ0Z7yiBwqBz_gBjkCvziBv8R3mkB7mP3wLvoMj1fn4L3ugB_zZr4oBjpM3yez6MjrQzzNjhpBvRrgW75I3zb7kG37XziJv8b_5M7mZ7lSvsUjpMv4dr_O75hB4kCnuVssV7uVo4L_-RsvHn9fsvHz2nBglKvvkBgxEzwWo4L_6T%3Bw%3D1000&Accept-Language=de-DE%2Cde%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7&app_id=nShhnbGiIBGL9IgH1wUL&app_code=Eh__AVp7QXVYqGBS0jcCxw
  /*
      curl \
      --compressed \
      -H 'Accept-Encoding:gzip' \
      -H 'Accept-Language:de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7' \
      --get 'https://places.cit.api.here.com/places/v1/autosuggest' \
        --data-urlencode 'app_code=Eh__AVp7QXVYqGBS0jcCxw' \
        --data-urlencode 'app_id=nShhnbGiIBGL9IgH1wUL' \
        --data-urlencode 'compressedRoute=8-hf3jiTwsFglKsEw9JviF0nJ49CgxJrE46Gs8Do2CjpCguI7uB8lIg4D89LkvJnvDkjPvtC4oPn8Es8NsxL0tanqI8vX3_VriBvsU847C7nW84sCzzXg27BA8hyB43Zw7ekqT4u5Bw5Lk3iE0svCgvlFnuVsy2DrlRkxmGnhewiwCs-oCr0MkprDAwhlE_mEkprD4vd861Cr7Qwi8Bvm_B77M_3hB0zmBztuBo0mBvk7BArt_B_yIrxuBAznEk9qB7h3BryI_5jCvpE7lmB8uV7t7BslR32_B77MjpoCAj6uB8oE_jkCryI_8_BslRn-_Bk9qBrzZoher5MwoWjkC40J_oI4IzsOjiXr8hB3rQr1Oj3KviF_mOjkC_iQ0Z7yiBwqBz_gBjkCvziBv8R3mkB7mP3wLvoMj1fn4L3ugB_zZr4oBjpM3yez6MjrQzzNjhpBvRrgW75I3zb7kG37XziJv8b_5M7mZ7lSvsUjpMv4dr_O75hB4kCnuVssV7uVo4L_-RsvHn9fsvHz2nBglKvvkBgxEzwWo4L_6T;w=1000' \
        --data-urlencode 'pretty=true' \
        --data-urlencode 'q=education'
   */
  loadEducation() {
    const url: string = 'https://places.cit.api.here.com/places/v1/autosuggest';

    const params = new HttpParams()
      .set('app_code', this.hereAPI.appCode)
      .set('app_id', this.hereAPI.appID)
      .set('compressedRoute', '8-hf3jiTwsFglKsEw9JviF0nJ49CgxJrE46Gs8Do2CjpCguI7uB8lIg4D89LkvJnvDkjPvtC4oPn8Es8NsxL0tanqI8vX3_VriBvsU847C7nW84sCzzXg27BA8hyB43Zw7ekqT4u5Bw5Lk3iE0svCgvlFnuVsy2DrlRkxmGnhewiwCs-oCr0MkprDAwhlE_mEkprD4vd861Cr7Qwi8Bvm_B77M_3hB0zmBztuBo0mBvk7BArt_B_yIrxuBAznEk9qB7h3BryI_5jCvpE7lmB8uV7t7BslR32_B77MjpoCAj6uB8oE_jkCryI_8_BslRn-_Bk9qBrzZoher5MwoWjkC40J_oI4IzsOjiXr8hB3rQr1Oj3KviF_mOjkC_iQ0Z7yiBwqBz_gBjkCvziBv8R3mkB7mP3wLvoMj1fn4L3ugB_zZr4oBjpM3yez6MjrQzzNjhpBvRrgW75I3zb7kG37XziJv8b_5M7mZ7lSvsUjpMv4dr_O75hB4kCnuVssV7uVo4L_-RsvHn9fsvHz2nBglKvvkBgxEzwWo4L_6T;w=1000')
      .set('pretty', 'true')
      .set('q', 'education');

    return this.httpClient.get(url, {params: params});
  }
}
