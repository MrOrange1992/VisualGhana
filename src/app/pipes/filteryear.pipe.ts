import { Pipe, PipeTransform } from '@angular/core';
import {PowerPlant} from '../entities/PowerPlant';

@Pipe({
  name: 'filteryear'
})
export class FilteryearPipe implements PipeTransform {

  transform(powerPlants: PowerPlant[], timeLineYear): any {


    if (powerPlants != null)

      return powerPlants.filter(powerPlant => powerPlant.yearCompleted <= timeLineYear);
    else return null;
  }

}
