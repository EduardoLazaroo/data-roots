
import { Pipe, PipeTransform } from '@angular/core';
import { UF_NAMES } from './uf-names';

@Pipe({
  name: 'ufName'
})
export class UfNamePipe implements PipeTransform {
  transform(value: string): string {
    return UF_NAMES[value] || value;
  }
}
