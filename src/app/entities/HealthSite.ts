import {Colors} from '../enums/Colors';

export class HealthSite {
  name: string;
  latitude: number;
  longitude: number;
  completeness: number;
  type: string;
  private _color: string;
  private _radius: number;

  constructor(feature, radius: number) {
    this.name = feature.properties.name;
    this.latitude = +feature.geometry.coordinates[1];
    this.longitude = +feature.geometry.coordinates[0];
    this.completeness = +feature.properties.completeness.slice(0, -1);
    this.type = feature.properties.type;
    this._radius = radius;

    if (feature.properties.type === 'clinic') {
      this._color = Colors.clinicColor;
    } else if (feature.properties.type === 'hospital') {
      this._color =  Colors.hospitalColor;
    } else {
      this._color =  Colors.hospitalColor;
    }
  }


  get color(): string { return this._color; }

  set color(value: string) { this._color = value; }

  get radius(): number { return this._radius; }

  set radius(value: number) { this._radius = value; }
}
