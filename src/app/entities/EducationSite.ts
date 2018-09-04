export class EducationSite {
  name: string;
  vicinity: string;
  longitude: number;
  latitude: number;
  radius: number;

  constructor(feature, radius: number) {

    console.log(feature);
    this.name = feature.name;
    this.latitude = feature.geometry.location[0];
    this.longitude = feature.geometry.location[1];
    this.radius = radius;
  }
}

