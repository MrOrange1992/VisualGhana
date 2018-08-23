export class PowerPlant {
  name: string;
  longitude: number;
  latitude: number;
  community: string;
  capacity: number;
  radius: number;
  yearCompleted: number;

  constructor(name: string, longitude: number, latitude: number, community: string, capacity: number, radius: number, yearCompleted: number) {
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.community = community;
    this.capacity = capacity;
    this.radius = radius;
    this.yearCompleted = yearCompleted;
  }
}
