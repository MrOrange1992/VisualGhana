export class HealthSite {
  name: string;
  latitude: number;
  longitude: number;
  completeness: number;
  type: string;
  radius: number;

  constructor(name: string, latitude: number, longitude: number, completeness: number, type: string, radius: number) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.completeness = completeness;
    this.type = type;
    this.radius = radius;
  }
}
