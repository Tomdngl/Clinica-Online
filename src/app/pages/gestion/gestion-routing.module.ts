import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { SolicitarTurnosComponent } from './solicitar-turnos/solicitar-turnos.component';
import { TurnosComponent } from './turnos/turnos.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { PacientesComponent } from './pacientes/pacientes.component';

const routes: Routes = [
  {
    path:'mis-turnos',
    component:MisTurnosComponent
  },
  {
    path:'solicitar-turno',
    component:SolicitarTurnosComponent
  },
  {
    path:'turnos',
    component:TurnosComponent //Agregar guard de admin
  },
  {
    path:'mi-perfil',
    component:MiPerfilComponent 
  },
  {
    path:'pacientes',
    component:PacientesComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
