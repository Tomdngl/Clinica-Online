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
import { DiaFormateadoPipe } from '../pipes/dia-formateado.pipe';
import { DiaTurnoPipe } from '../pipes/dia-turno.pipe';
import { DniFormateadoPipe } from '../pipes/dni-formateado.pipe';
import { CartasPacientesAdminDirective } from '../directivas/cartas-pacientes-admin.directive';
import { LayoutFocusDirective } from '../directivas/layout-focus.directive';
import { ResaltarHoverDirective } from '../directivas/resaltar-hover.directive';


@NgModule({
  declarations: [
    LayoutComponent,
    AltaUsuarioComponent,
    AltaEspecialistaComponent,
    GestorEspecialidadesComponent,
    InicioRapidoComponent,
    AltaAdminComponent,
    DiaFormateadoPipe,
    DiaTurnoPipe,
    DniFormateadoPipe,
    CartasPacientesAdminDirective,
    LayoutFocusDirective,
    ResaltarHoverDirective
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
    InicioRapidoComponent,
    DiaFormateadoPipe,
    DiaTurnoPipe,
    DniFormateadoPipe,
    CartasPacientesAdminDirective,
    LayoutFocusDirective,
    ResaltarHoverDirective
  ]
})
export class ComponentsModule { }
