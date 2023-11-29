import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { AltaUsuarioComponent } from './alta-usuario/alta-usuario.component';
import { AltaEspecialistaComponent } from './alta-especialista/alta-especialista.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestorEspecialidadesComponent } from './gestor-especialidades/gestor-especialidades.component';
import { InicioRapidoComponent } from './inicio-rapido/inicio-rapido.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { AltaAdminComponent } from './alta-admin/alta-admin.component';


@NgModule({
  declarations: [
    LayoutComponent,
    AltaUsuarioComponent,
    AltaEspecialistaComponent,
    GestorEspecialidadesComponent,
    InicioRapidoComponent,
    AltaAdminComponent
  ],
  imports: [
    RecaptchaModule,
    CommonModule,
    ComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaFormsModule
  ],
  exports: [
    LayoutComponent,
    AltaEspecialistaComponent,
    AltaUsuarioComponent,
    AltaAdminComponent,
    GestorEspecialidadesComponent,
    InicioRapidoComponent
  ]
})
export class ComponentsModule { }
