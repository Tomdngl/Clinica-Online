import { Injectable } from '@angular/core';
import { SwalService } from './swal.service';
import { Router } from '@angular/router';
import { AngularFirestore,AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { Persona } from '../classes/persona';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  user$: Observable<any>;
  seLogueo:boolean = false;
  esAdmin:boolean = false;
  esPaciente:boolean = false;
  esEspecialista:boolean = false;

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
      this.esAdmin = false;
      this.esEspecialista = false;
      this.esPaciente = false;
      this.seLogueo = false;
    }).catch((error) => {
      this.swal.Error("Ha ocurrido un error.",this.ObtenerMensajeError(error.errorCode))
      console.log(error)
    })
  }

  RegistrarUsuario(usuario:Persona)
  {
    var config = {
      projectId: "clinica-online-8b8b6",
      appId: "1:230463154618:web:2bf27c6915406774e99583",
      storageBucket: "clinica-online-8b8b6.appspot.com",
      apiKey: "AIzaSyBRqBaDidOpIeYPYbUuQX4McXkVT-WExUo",
      authDomain: "clinica-online-8b8b6.firebaseapp.com",
      messagingSenderId: "230463154618"
    };
    
    const secondaryApp = firebase.initializeApp(config, "Secondary");

    console.log(usuario)
      secondaryApp.auth().createUserWithEmailAndPassword(usuario.email,usuario.password).then((data: any) =>{
        const uid = data.user?.uid;
        const documento = this.afStore.doc('usuarios/' + uid);
        console.info(usuario)
        documento.set({
          id: uid,
          perfil: usuario.perfil,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          edad: usuario.edad,
          dni: usuario.dni,
          obraSocial: usuario.obraSocial,
          especialidad: usuario.especialidad,
          email: usuario.email,
          password: usuario.password,
          fotos:usuario.fotos,
          habilitado: usuario.habilitado,
        }).then(() => {
            data.user.sendEmailVerification();
            this.swal.Exito("Éxito","Revisar la casilla de correo electrónico para verificar la cuenta.");
            this.router.navigate(['home'])
          })
          .catch((error) => {
            this.swal.Error("Error.",this.ObtenerMensajeError(error.code));
          })
          .finally(() => {
            secondaryApp.auth().signOut();
            secondaryApp.delete();
          });
      }).catch((error) => {
        console.log("Error")
        console.log(error)
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

ActualizarUsuario(usuario: any) {
  this.afStore
    .doc<any>(`usuarios/${usuario.id}`)
    .update(usuario)
    .then(() => { })
}

  ObtenerMensajeError(errorCode: string): string {
    let mensaje: string = '';
    console.log(errorCode)

    switch (errorCode) {
      case 'auth/invalid-login-credentials':
        mensaje = 'Credenciales inválidas.';
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
