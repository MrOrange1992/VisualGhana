import {LatLng, LatLngLiteral} from '@agm/core';

export class Road {

  // latitude and longitude most be converted to float

  coordinates: Array<LatLng | LatLngLiteral> | Array<Array<LatLng | LatLngLiteral>>;
  name: string;
  highway: string;
  surface: string;

  constructor(coordinates: Array<LatLng | LatLngLiteral> | Array<Array<LatLng | LatLngLiteral>>, name: string, highway: string, surface: string) {
    this.coordinates = coordinates;
    this.name = name;
    this.highway = highway;
    this.surface = surface;
  }
}
