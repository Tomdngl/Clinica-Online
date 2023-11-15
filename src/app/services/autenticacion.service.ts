import { Injectable } from '@angular/core';
import { SwalService } from './swal.service';
import { Router } from '@angular/router';
import { AngularFirestore,AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  user$: Observable<any>;
  seLogueo:boolean = false;
  esAdmin:boolean = false;

  constructor(private swal:SwalService,
    private router:Router,
    private afAuth:AngularFireAuth,
    private afStore:AngularFirestore
    ) {
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if(user) {
            this.seLogueo = true;
            return this.afStore.doc<any>(`usuarios/${user.uid}`).valueChanges();
          }
          else {
            return of(null);
          }
        })
      );
  }

  async Login({email,clave}:any)
  {
    return await this.afAuth.signInWithEmailAndPassword(email,clave)
  }

  SignOut()
  {
    this.afAuth.signOut().then(() =>{
      this.seLogueo = false;
      this.swal.Exito("Redirigiendo a home","Sesión cerrada.").then(() => {
        this.router.navigate(['home'])
      })
    }).catch((error) => {
      this.swal.Error("Ha ocurrido un error inesperado.",this.ObtenerMensajeError(error.errorCode))
      console.log(error)
    })
  }

  RegistrarUsuario(usuario:any)
  {
      this.afAuth.createUserWithEmailAndPassword(usuario.email,usuario.clave).then((data) =>{
        this.afStore.collection('usuarios').doc(data.user?.uid).set({
        idUsuario: data.user?.uid,
        nombre:usuario.nombre,
        email:usuario.email,
        registradoEn:moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
        rol:"Usuario"
      }).then(() => {
        usuario.idUsuario = data.user?.uid
        this.CrearLogUsuario(usuario).then(() => {
          this.swal.Exito("Usuario registrado.","Redirigiendo a home").then(() =>{
            this.router.navigate([''])
          })
        })
      })
    }).catch((error) => {
      this.swal.Error("Error.",this.ObtenerMensajeError(error.errorCode))
    })
  }

CrearLogUsuario(usuario:any)
{
  const data = {
    usuario: usuario,
    fechaIngreso: moment().format('MMMM Do YYYY, h:mm:ss a')
  };

  return this.afStore.collection("userlogs").add(data);
}

  ObtenerMensajeError(errorCode: string): string {

    let mensaje: string = '';

    switch (errorCode) {
      case 'auth/invalid-login-credentials':
        mensaje = 'Crenciales inválidas.';
        break;
      case 'auth/email-already-in-use':
        mensaje = 'El email ingresado ya se encuentra en uso.';
        break;
      case 'auth/user-not-found':
        mensaje = 'El email ingresado no existe';
        break;
      case 'auth/invalid-email':
        mensaje = 'El email ingresado no es válido.';
        break;
      default:
        mensaje = 'Ocurrió un error, revise sus credenciales e intentelo nuevamente.';
        break;
    }
    return mensaje;
  } 
}
