import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dniFormateado'
})
export class DniFormateadoPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    if (isNaN(value) || value.toString().length !== 8) {
      return '';
    }

    return `${value.toString().slice(0, 2)}.${value.toString().slice(2, 5)}.${value.toString().slice(5)}`;
  }
}
