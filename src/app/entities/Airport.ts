export class Airport {

  name: string;
  longitude: number;
  latitude: number;
  type: string;
  radius: number;


  constructor(name: string, longitude: number, latitude: number, type: string, radius: number) {
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.type = type;
    this.radius = radius;
  }
}
