import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  animations: [
    trigger('slideInFromRight', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', animate('500ms ease-in')),
    ])
  ]
})
export class RegistroComponent {
  loading = true;
  formUsuario:boolean = false;
  formEspecialista:boolean = false;

  ngOnInit(): void {
  this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 500);
  }

  eligioUsuario() {
    this.formUsuario = true;
  }

  eligioEspecialista() {
    this.formEspecialista = true;
  }

  SeleccionRegistro()
  {
    this.formUsuario = false;
    this.formEspecialista = false;
  }
}
