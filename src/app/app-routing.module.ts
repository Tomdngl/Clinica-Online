import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/home/error/error.component';

const routes: Routes = [
  { 
    path:'',
    redirectTo:'/home',
    pathMatch:'full'
  },
  {
    path:'home',
    loadChildren:() => import('../app/pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path:'auth',
    loadChildren:() => import('../app/pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path:'gestion',
    loadChildren:() => import('../app/pages/gestion/gestion.module').then(m => m.GestionModule)
  },
  {
    path: '**',
    component: ErrorComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
