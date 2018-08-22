export class SolarStation {
  name: string;
  longitude: number;
  latitude: number;
  region: string;
  locality: string;
  capacity: number;
  radius: number;

  constructor(name: string, longitude: number, latitude: number, region: string, locality: string, capacity: number, radius: number) {
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.region = region;
    this.locality = locality;
    this.capacity = capacity;
    this.radius = radius;
  }
}
