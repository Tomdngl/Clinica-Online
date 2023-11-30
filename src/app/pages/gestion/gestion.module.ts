import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionRoutingModule } from './gestion-routing.module';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { TurnosComponent } from './turnos/turnos.component';
import { SolicitarTurnosComponent } from './solicitar-turnos/solicitar-turnos.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { DiaFormateadoPipe } from 'src/app/pipes/dia-formateado.pipe';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { DiaTurnoPipe } from 'src/app/pipes/dia-turno.pipe';
import { DniFormateadoPipe } from 'src/app/pipes/dni-formateado.pipe';
import { PacientesComponent } from './pacientes/pacientes.component';


@NgModule({
  declarations: [
    MisTurnosComponent,
    TurnosComponent,
    SolicitarTurnosComponent,
    MiPerfilComponent,
    PacientesComponent,
  ],
  imports: [
    NgbCarouselModule,
    CommonModule,
    GestionRoutingModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class GestionModule { }
