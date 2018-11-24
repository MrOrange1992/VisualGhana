import {Colors} from '../enums/Colors';

export class PowerPlant {
  name: string;
  longitude: number;
  latitude: number;
  community: string;
  capacity: number;
  private _radius: number;
  yearCompleted: number;
  type: string;
  private _color: string;

  constructor(feature, radius: number) {
    this.name = feature.properties.name;
    this.longitude = +feature.geometry.coordinates[0];
    this.latitude = +feature.geometry.coordinates[1];
    this.community = feature.properties.community;
    this.capacity = +feature.properties['capacity(MW)'];
    this._radius = radius; // +feature.properties['capacity(MW)'] * 100;
    this.yearCompleted = feature.properties.yearCompleted;
    this.type = feature.properties.type;

    if (feature.properties.type === 'Thermal') {
      this._color = Colors.powerThermalplantColor;
    } else if (feature.properties.type === 'Hydroelectric') {
      this._color =  Colors.powerHydroplantColor;
    } else if (feature.properties.type === 'Solar Power') {
      this._color =  Colors.powerSolarplantColor;
    } else {
      this._color =  null;
    }
  }


  get radius(): number { return this._radius; }

  set radius(value: number) { this._radius = value; }

  get color(): string { return this._color; }

  set color(value: string) { this._color = value; }
}
