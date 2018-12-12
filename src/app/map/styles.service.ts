import {Injectable, OnInit} from '@angular/core';
import {Colors} from '../enums/Colors';


@Injectable()
export class StylesService {

  constructor() {}

  loadOverLayStyles() {
    return {
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#000000',
      fillOpacity: 0.65
    };
  }

  loadAulaTerraRoadStyles() {
    return {
      strokeColor: Colors.aulaTerraColor,
      strokeOpacity: 1,
      strokeWeight: 2
    };
  }

  loadPopulationTileStyles(feature) {
    // parsing popdens distribution values for usage as opacity factor
    let avg = feature['l'].avg * 1500;

    //observing starnge render behaviour if opacity > 1
    //values > 1 occur sporadically for larger city locations
    if (avg > 1) avg = 1;

    return {
      strokeOpacity: 0,
      fillColor: Colors.populationDensityColor,
      fillOpacity: avg
    };
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

    if (feature['l'].voltage_kV === 161) {
      return { clickable: true, strokeWeight: 1, strokeOpacity: 0.6, strokeColor: Colors.powerLinesColor};
    } else if (feature['l'].voltage_kV === 225) {
      return { clickable: true, strokeWeight: 2, strokeOpacity: 0.6, strokeColor: Colors.powerLinesColor };
    } else if (feature['l'].voltage_kV === 330) {
      return { clickable: true, strokeWeight: 3, strokeOpacity: 0.6, strokeColor: Colors.powerLinesColor };
    } else {
      return { clickable: false, strokeWeight: 0.2, strokeOpacity: 0.6, strokeColor: Colors.powerLinesColor };
    }
  }

  loadRoadStyles(feature) {

    return { clickable: true, strokeWeight: 1, strokeColor: Colors.roadPavedColor };

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

    // console.log('Loading road styles...\n', feature);
    const surface = feature['l'].surface;

    if (surface === 'asphalt'
      || surface === 'paved'
      || surface === 'compacted'
      || surface === 'concrete'
      || surface === 'paving_stones'
    ) {
      return {clickable: true, strokeWeight: 1, strokeColor: Colors.roadPavedColor};
    } else {
    }
    */
  }

  // TODO -> district styles calc fillOpacity -> _/max(all_features)
  // So the district with the highest amount of observations will have 1
  // others will have less than one relative to the max element

  loadPrimarySchoolsDistributionStyles(feature) {

    return {
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 0.8,
      fillColor: Colors.educationPrimarySchoolColor,
      fillOpacity: feature.l.primaryschool / 100
    }
  }

  loadMiddleSchoolsDistributionStyles(feature) {

    return {
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 0.8,
      fillColor: Colors.educationMiddleSchoolColor,
      fillOpacity: feature.l.middleschool / 10
    }
  }

  loadHighSchoolsDistributionStyles(feature) {

    return {
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 0.8,
      fillColor: Colors.educationHighSchoolColor,
      fillOpacity: feature.l.highschool / 100
    }
  }

  loadUniversitiesDistributionStyles(feature) {

    return {
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 0.8,
      fillColor: Colors.educationUniversityColor,
      fillOpacity: feature.l.university / 100
    }
  }



}
