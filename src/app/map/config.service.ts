import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ConfigService {

  constructor(private httpClient: HttpClient) {}

  /**
   * Loads the apikey for google maps from local txt file
   * @returns {Promise<void>}
   */
  loadApiKey() {
    return this.httpClient.get('../../assets/private/apiKey.txt', {responseType: 'text'}).toPromise()
      .then(data => localStorage.setItem('apiKey', data));
  }
}
