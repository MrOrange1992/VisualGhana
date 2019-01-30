import {Colors} from '../enums/Colors';

export class HealthSite {
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  ownership: string;
  district: string;
  region: string;
  private _color: string;
  private _radius: number;

  constructor(feature, radius: number) {
    this.name = feature.properties.FacilityName;
    this.latitude = +feature.geometry.coordinates[1];
    this.longitude = +feature.geometry.coordinates[0];
    this.type = feature.properties.Type;
    this.ownership = feature.properties.Ownership;
    this.district = feature.properties.District;
    this.region = feature.properties.Region;

    this._radius = radius;

    if (feature.properties.Type === 'Clinic') {
      this._color = Colors.clinicColor;
    } else if (feature.properties.Type === 'Hospital') {
      this._color = Colors.hospitalColor;
    }  else if (feature.properties.Type === 'District Hospital') {
      this._color = Colors.districtHospitalColor;
    } else if (feature.properties.Type === 'Regional Hospital') {
       this._color = Colors.regionalHospitalColor;
    } else if (feature.properties.Type === 'Health Centre') {
       this._color = Colors.healthCentreColor;
    } else if (feature.properties.Type === 'Maternity Home') {
      this._color = Colors.maternityColor;
    } else if (feature.properties.Type === 'RCH') {
      this._color = Colors.rchColor;
    } else {
      this._color = Colors.chpsColor;
    }
  }


  get color(): string { return this._color; }

  set color(value: string) { this._color = value; }

  get radius(): number { return this._radius; }

  set radius(value: number) { this._radius = value; }
}
