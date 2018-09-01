export class EducationSite {
  name: string;
  vicinity: string;
  longitude: number;
  latitude: number;
  radius: number;

  constructor(feature, radius: number) {

    console.log(feature);
    this.name = feature.title;
    this.vicinity = feature.vicinity;
    this.latitude = feature.position[0];
    this.longitude = feature.position[1];
    this.radius = radius;
  }
}
