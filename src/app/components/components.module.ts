import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { AltaUsuarioComponent } from './alta-usuario/alta-usuario.component';
import { AltaEspecialistaComponent } from './alta-especialista/alta-especialista.component';


@NgModule({
  declarations: [
    LayoutComponent,
    AltaUsuarioComponent,
    AltaEspecialistaComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule
  ],
  exports: [
    LayoutComponent,
  ]
})
export class ComponentsModule { }
