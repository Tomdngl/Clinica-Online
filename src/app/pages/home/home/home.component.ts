import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AutenticacionService } from 'src/app/services/autenticacion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  usuario:any = null
  perfil: any;
  urlApi: string = "https://api.github.com/users/Tomdngl";

  constructor(private http: HttpClient, private router: Router, public autenticacionService: AutenticacionService) {}

  ngOnInit(): void {
    this.autenticacionService.user$.subscribe((user:any) => {
      if(user){
        this.usuario = user
      }
      else{
        this.usuario = null
      }
    }) 
      this.http.get(this.urlApi).subscribe(res => this.perfil = res);
  }

  redirectLogin() {
      // Redirige a la página /login
      this.router.navigate(['auth/login']);
  }

  redirectRegistro() {
    // Redirige a la página /login
    this.router.navigate(['auth/login']);
}
}