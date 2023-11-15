import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    HomeComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
  ]
})
export class HomeModule { }
