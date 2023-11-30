import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diaTurno'
})
export class DiaTurnoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {

    if (value.seconds) {
      value = new Date(value.seconds * 1000);
    }

    const dia = value.getDate().toString().padStart(2,'0')
    const mes = (value.getMonth() + 1).toString().padStart(2,'0')
    const hora = value.getHours() + 2
    const minutos = value.getMinutes().toString().padStart(2,'0')

    return `${mes}/${dia} ${hora}:${minutos}`;
  }
}
