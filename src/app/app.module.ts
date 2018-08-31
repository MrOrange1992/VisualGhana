import { BrowserModule } from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';

import {AgmCoreModule, LAZY_MAPS_API_CONFIG} from '@agm/core';
import {AppComponent} from './app.component';
import { MapComponent } from './map/map.component';
import {RouterModule} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {MapService} from './map/map.service';
import {GoogleMapsConfig} from './map/mapconfig.service';
import {HttpClientModule} from '@angular/common/http';
import {ConfigService} from './map/config.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES),
    HttpClientModule,
  ],
  declarations: [ AppComponent, MapComponent],
  bootstrap: [ AppComponent ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => function() {return configService.loadApiKey(); },
      deps: [ConfigService],
      multi: true
    },
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: GoogleMapsConfig
    },
    MapService,
    ConfigService
  ]
})
export class AppModule {
}
