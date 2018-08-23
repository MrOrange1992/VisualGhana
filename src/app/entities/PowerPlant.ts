export class PowerPlant {
  name: string;
  longitude: number;
  latitude: number;
  community: string;
  capacity: number;
  radius: number;
  yearCompleted: number;
  type: string;

  constructor(name: string, longitude: number, latitude: number, community: string, capacity: number, radius: number, yearCompleted: number, type: string) {
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.community = community;
    this.capacity = capacity;
    this.radius = radius;
    this.yearCompleted = yearCompleted;
    this.type = type;
  }
}
