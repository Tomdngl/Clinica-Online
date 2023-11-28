import { Component } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
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
