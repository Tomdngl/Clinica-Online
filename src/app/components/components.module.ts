import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { AltaUsuarioComponent } from './alta-usuario/alta-usuario.component';
import { AltaEspecialistaComponent } from './alta-especialista/alta-especialista.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestorEspecialidadesComponent } from './gestor-especialidades/gestor-especialidades.component';
import { InicioRapidoComponent } from './inicio-rapido/inicio-rapido.component';


@NgModule({
  declarations: [
    LayoutComponent,
    AltaUsuarioComponent,
    AltaEspecialistaComponent,
    GestorEspecialidadesComponent,
    InicioRapidoComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    LayoutComponent,
    AltaEspecialistaComponent,
    AltaUsuarioComponent,
    GestorEspecialidadesComponent,
    InicioRapidoComponent
  ]
})
export class ComponentsModule { }
