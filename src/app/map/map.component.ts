import { Component, OnInit } from '@angular/core';
import {MapService} from './map.service';
import {LatLngBoundsLiteral, MapsAPILoader} from '@agm/core';
import { } from 'googlemaps';
import {Chart, ChartComponent} from 'chart.js';

import {PieChart} from '../entities/PieChart';
import {PowerPlant} from '../entities/PowerPlant';
import {HealthSite} from '../entities/HealthSite';
import {Colors} from '../entities/Colors';
import {Airport} from '../entities/Airport';
import {EducationSite} from "../entities/EducationSite";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {

  // MAP CONFIG / STYLES
  map;
  zoom;
  // property for custom map styles, edit in file ../assets/mapStyles.json
  public customMapStyles;
  // disables draggable map functionality
  mapDraggable = false;

  // AGM DATA LAYER OBJECTS
  // POINT
  healthSites: HealthSite[];
  powerPlants: PowerPlant[];
  airports: Airport[];
  educationSites: EducationSite[];

  // LINE
  powerLines;
  roadData;
  surfaceRoads;

  // POLYGON
  overlay;

  // ONMAP INFO
  infoVisible = false;
  infoLatitude;
  infoLongitude;
  infoGeoJsonObject: Object;

  // CHART
  chart;


  // MISC
  latlngBounds: LatLngBoundsLiteral;

  stdRadius;
  showrwandaimg = false;
  showkenyaimg = false;
  colors = Colors;

  constructor(private mapService: MapService, private mapsAPILoader: MapsAPILoader) {}

  /**
   * Function is called on map initialize
   * Custom mapstyles are loaded here
   */
  ngOnInit() {
    console.log('Loading map and data, please wait ...');

    this.mapService.loadCustomMapStyles('mapStyles').subscribe(data => this.customMapStyles = data);

    this.mapService.loadOverlay().subscribe(response => {
      this.overlay = response;
      console.log('NGOninit, Overlay data available!!!: ', this.overlay);
    });

    // start in infrastructure configuration
    this.loadInfrastructureConfig();

    this.mapsAPILoader.load().then(() => {
      // let result = new google.maps.Point(1,2);

      // this.map = new google.maps.Map(document.getElementById("ghanaMap"));

      // let result = new google.maps.places.PlacesService(this.map);

    });

    this.mapService.loadRoads().subscribe(result => { this.roadData = result; console.log('NGOninit, Road data available!!!: ', this.roadData); });
    }

  /**
   * Load / reset data for healthsites to be displayed
   * Completeness specifies the completeness of attributes for each object/entry
   */
  loadHealthSites() {

    if (this.healthSites) {
      this.healthSites = null;
      if (this.chart) { this.chart.destroy(); }
    } else {

      this.mapService.loadHealthSites().subscribe(resPointData => {
        const healthSiteData = resPointData;
        console.log('Loading healthsites...', healthSiteData);

        this.healthSites = healthSiteData['features'].map(feature => new HealthSite(feature, this.getStdRadius(this.zoom)));

        // Destroy any chart if existing
        if (this.chart) { this.chart.destroy(); }

        const data = this.healthSites.map(site => site.type);
        const clinicCount = data.filter(res => res === 'clinic').length;
        const hospitalCount = data.length - clinicCount;
        // console.log(data, clinicCount, hospitalCount);

        const pieChart = new PieChart(
          'chartCanvas',
          'doughnut',
          'Healthsite Type Distribution',
          [clinicCount, hospitalCount],
          ['Clinic', 'Hospital'],
          [this.colors.clinicColor, this.colors.hospitalColor]
        );

        this.chart = pieChart.chart;
      });
    }

  }

  /**
   * Load / reset data for transportation to be be displayed
   */
  loadTransportation() {
    if (this.airports) {
      this.airports = null;
      this.surfaceRoads = null;
      this.mapService.loadCustomMapStyles('mapStyles').subscribe(data => this.customMapStyles = data );
    } else {
      this.mapService.loadAirports().subscribe(resPointData => {
        // const airportData = resPointData;

        console.log('Loading airports...');

        this.airports = resPointData['features'].map(feature => new Airport(feature, this.getStdRadius(this.zoom)));
        console.log('Loading airport data...\n', this.airports);

      });

      this.customMapStyles = this.customMapStyles.map(feature => {
        //console.log(feature);
        if (feature.elementType === 'geometry' && feature.featureType === 'road') {
          console.log(feature);
          return {
            featureType: "road",
            elementType: "geometry",
            stylers: [
              {
                visibility: "on"
              },
              {
                color: "#7f8d89"
              }
            ]
          };
        } else {
          return feature;
        }
      });

      console.log('Loading road data including surfaces...');
      this.surfaceRoads = {'type': 'FeatureCollection', 'features': this.roadData['features'].filter(data => data.properties.surface != null) };

      // const pieChart = new PieChart('canvas', 'doughnut', 'Road Surfaces', [overHalf, lesserHalf], ['Greater 50%', 'Less 50%'], ['#28536C', '#28436C']);
      // this.chart = pieChart.chart;

    }
  }

  /**
   * Load / reset data for power related data to be displayed
   */
  loadPower() {
    if (!this.powerLines) {
      // Load power line data
      this.mapService.loadPowerLines().subscribe(resLineData => {
        this.powerLines = resLineData;

        console.log('Loading powerline data...\n', this.powerLines);
      });

      // Load power plant data and pasre to PowerPlant objects
      this.mapService.loadPowerPlants().subscribe(resPointData => {
        const powerPlantData = resPointData;
        console.log('Loading powerplants...\n', powerPlantData);
        this.powerPlants = powerPlantData['features'].map(feature => new PowerPlant(feature, this.getStdRadius(this.zoom)));

        // Destroy any chart if existing
        if (this.chart) { this.chart.destroy(); }

        // Prepare data for pie chart
        const thermalCapacity = this.powerPlants
          .filter(res => res.type === 'Thermal')
          .map(a => a.capacity)
          .reduceRight((first, next) => first + next);

        const hydroCapacity = this.powerPlants
          .filter(res => res.type === 'Hydroelectric')
          .map(a => a.capacity)
          .reduceRight((first, next) => first + next);

        const solarCapacity = this.powerPlants
          .filter(res => res.type === 'Solar Power')
          .map(a => a.capacity)
          .reduceRight((first, next) => first + next)
          .toFixed(0);

        // Compute set of unique lables out of all powerplant types
        const labels = this.powerPlants
          .map(powerPlant => powerPlant.type)
          .filter((index, value, plant) => plant.indexOf(index) === value);

        // console.log(thermalCapacity, hydroCapacity, solarCapacity);

        // create pie chart
        const pieChart = new PieChart(
          'chartCanvas',                                                      // Context
          'doughnut',                                                         // Chart type
          'Powerplant capacity distribution [MW]',                            // Chart title
          [+thermalCapacity, +hydroCapacity, +solarCapacity],                 // Data
          labels,                                                             // Labels
          [this.colors.powerThermalplantColor, this.colors.powerHydroplantColor, this.colors.powerSolarplantColor]    // Colors
        );
        if (this.chart) {
          console.log('Destroying active chart...\n', this.chart);
          this.chart.destroy();
        }
        this.chart = pieChart.chart;
      });

    } else {
      if (this.chart) { this.chart.destroy(); }
      this.powerLines = null;
      this.powerPlants = null;
    }
  }

  loadEducation() {
    this.mapService.loadEducation().subscribe(response => {
      //console.log(response['results']);
      this.educationSites = response['results'].map(feature => {
        if (feature.position)
          new EducationSite(feature, this.getStdRadius(this.zoom));
      })
      console.log(this.educationSites);
    });
  }

  // return json styles for objects to display from import statements
  loadPowerLineStyles(feature) {
    // console.log('Loading powerline styles', feature);
    /* All voltages
        161
        35
        225
        330
        69
        30
        11
        33
    const voltages = this.powerLines['features']
      .map(powerLine => powerLine.properties.voltage_kV)
      .filter((index, value, plant) => plant.indexOf(index) === value);
    console.log(voltages);
    */
    if (feature.f.voltage_kV === 161) {
      return { clickable: true, strokeWeight: 1, strokeOpacity: 0.6, strokeColor: Colors.powerLinesColor};
    } else if (feature.f.voltage_kV === 225) {
      return { clickable: true, strokeWeight: 2, strokeOpacity: 0.6, strokeColor: Colors.powerLinesColor };
    } else if (feature.f.voltage_kV === 330) {
      return { clickable: true, strokeWeight: 3, strokeOpacity: 0.6, strokeColor: Colors.powerLinesColor };
    } else {
      return { clickable: false, strokeWeight: 0.2, strokeOpacity: 0.6, strokeColor: Colors.powerLinesColor };
    }
  }

  loadOverLayStyles() {
    return {
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#000000',
      fillOpacity: 0.65
    };
  }


  loadRoadStyles(feature) {
    /* ALl SURFACE types
      asphalt paved
      unpaved unpaved
      paved   paved
      ground  unpaved
      dirt    unpaved
      sand    unpaved
      compacted paved
      gravel    unpaved
      concrete  paved
      grass     unpaved
      mud       unpaved
      clay      unpaved
      ground‬     unpaved
      fine_gravel   unpaved
      earth     unpaved
      wood      unpaved
      soil      unpaved
      paving_stones  paved
      UN
      un
      GR
      cobblestone unpaved
      pebblestone unpaved
      dirt/sand   unpaved
   */
    // console.log('Loading road styles...\n', feature);
    const surface = feature.f.surface;

    if (surface === 'asphalt'
      || surface === 'paved'
      || surface === 'compacted'
      || surface === 'concrete'
      || surface === 'paving_stones'
    ) {
      return {clickable: true, strokeWeight: 1, strokeColor: Colors.roadPavedColor};
    } else {
      return { clickable: true, strokeWeight: 2, strokeColor: Colors.roadUnpavedColor };
    }
  }

  // SCENARIO CONFIGURATIONS
  // load Infrastructure config
  loadInfrastructureConfig() {
    this.latlngBounds = {
      north: 11,
      east: 0,
      south: 4,
      west: -6
    }
  }
  // load Technology config
  loadTechnologyConfig() {
    this.latlngBounds = {
      north: 20,
      east: 20,
      south: -20,
      west: -20
    }
  }
  // load Concept config
  loadConceptConfig() {
    this.latlngBounds = {
      north: 7,
      east: -1,
      south: 6,
      west: -3
    }
  }

  // used to hide the info window when random location on map is clicked
  clickedMap() { this.infoVisible = false; }

  zoomChange(actualZoom) {
    console.log('Zoom changed to: ', actualZoom);
    this.zoom = actualZoom;
    this.stdRadius = this.getStdRadius(actualZoom);
    if (this.healthSites) { this.healthSites.forEach(site => site.radius = this.getStdRadius(actualZoom)); }
    if (this.powerPlants) { this.powerPlants.forEach(plant => plant.radius = this.getStdRadius(actualZoom)); }
    if (this.airports) { this.airports.forEach(port => port.radius = this.getStdRadius(actualZoom)); }
  }

  clickedObject(object) {
    console.log('Clicked object!\n', object);
    this.infoVisible = true;
    this.infoLatitude = object.latitude;
    this.infoLongitude = object.longitude;
    this.infoGeoJsonObject = object;
  }

  clickedSurfaceRoads(event) {
    console.log(event);
    this.infoVisible = true;
    this.infoLatitude = event.latLng.lat();
    this.infoLongitude = event.latLng.lng();
    this.infoGeoJsonObject = event.feature.f;
  }

  clickedPowerLines(event) {
    console.log(event);
    this.infoVisible = true;
    this.infoLatitude = event.latLng.lat();
    this.infoLongitude = event.latLng.lng();
    this.infoGeoJsonObject = event.feature.f;
  }

  mouseOverObject(object) {
    console.log('Mouse over object!\n', object);

    if (this.zoom < 11) {
      const newRadius = object.capacity * this.getStdRadius(this.zoom) / 10;

      if (newRadius > 30000) {
        object.radius = 30000;
      } else if (newRadius < this.getStdRadius(this.zoom)) {
      } else {
        object.radius = object.capacity * this.getStdRadius(this.zoom) / 10;
      }
    }
  }

  mouseOutObject(object) {
    console.log('Mouse out object!\n', object);
    object.radius = this.getStdRadius(this.zoom);
  }

  loadrwandaimage() {
    if (this.showrwandaimg) this.showrwandaimg = false;
    else this.showrwandaimg = true;
  }


  loadkenyaimage() {
    if (this.showkenyaimg) this.showkenyaimg = false;
    else this.showkenyaimg = true;
  }

  getStdRadius(zoom) {
    // calculation for reasonable results for circle radius when zooming in
    return Math.round((15000000) / (zoom ** 4));
  }
}
