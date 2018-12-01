import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import GoogleMapsData from '../assets/private/googleMapsData.json';
import {AgmCoreModule} from '@agm/core';
import {AppComponent} from './app.component';
import {MapComponent} from './map/map.component';
import {RouterModule} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {MapService} from './map/map.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StylesService} from './map/styles.service';
import {EventService} from './map/event.service';
import { FilteryearPipe } from './pipes/filteryear.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot( {
      apiKey: GoogleMapsData.apiKey
      }
    ),
    RouterModule.forRoot(APP_ROUTES),
    HttpClientModule,
  ],
  declarations: [ AppComponent, MapComponent, FilteryearPipe],
  bootstrap: [ AppComponent ],
  providers: [
    MapService,
    StylesService,
    EventService
  ]
})
export class AppModule {
}
