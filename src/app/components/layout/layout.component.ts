import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  usuario:any = null

  constructor(public autenticacion: AutenticacionService,
     private swal: SwalService,
     private router:Router,
     public authService:AutenticacionService) { }

  ngOnInit() {
    this.authService.user$.subscribe((user:any) => {
      if(user){
        this.authService.seLogueo = true;
        this.usuario = user
        switch(this.usuario.perfil){
          case "Paciente":
            this.authService.esPaciente = true;
            break;
          case "Especialista":
            this.authService.esEspecialista = true;
            break;
          case "Admin":
            this.authService.esAdmin = true;
            break;
        }
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
        this.router.navigate(['home'])
      }
      else{
        this.swal.Info('Atención.', 'Su sesión sigue activa.')
      }
    })
  }
}
