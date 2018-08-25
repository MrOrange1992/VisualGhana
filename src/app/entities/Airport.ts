export class Airport {

  name: string;
  longitude: number;
  latitude: number;
  type: string;
  private _radius: number;

  constructor(feature, radius: number) {
    this.name = feature.properties.name;
    this.longitude = +feature.geometry.coordinates[0];
    this.latitude = +feature.geometry.coordinates[1];
    this.type = feature.properties.type;
    this._radius = radius;
  }

  get radius(): number { return this._radius; }

  set radius(value: number) { this._radius = value; }
}
