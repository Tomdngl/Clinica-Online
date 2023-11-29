import { Component } from '@angular/core';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  usuario:any = null

  constructor(public autenticacion: AutenticacionService, private swal: SwalService) { }

  ngOnInit() {
    this.autenticacion.user$.subscribe((user:any) => {
      if(user){
        this.usuario = user
      }
      else{
        this.usuario = null
      }
    }) 
    console.log(this.usuario)
  }

  CerrarSesion()
  {
    this.swal.MostrarConfirmacion("Confirmación", "¿Desea cerrar sesión?").then((res) => {
      if(res.isConfirmed){
        this.autenticacion.SignOut()
      }
      else{
        this.swal.Info('Atención.', 'Su sesión sigue activa.')
      }
    })
  }
}
