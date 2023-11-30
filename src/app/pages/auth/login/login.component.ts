import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Persona } from 'src/app/classes/persona';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { SwalService } from 'src/app/services/swal.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading: boolean = false
  //@ts-ignore
  formUsuario: FormGroup;

  constructor(private fb: FormBuilder, private swal: SwalService, private authService: AutenticacionService, private firestoreService: FirestoreService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true
    this.formUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]]
    });

    setTimeout(() => {
      this.loading = false
    }, 1600);
  }

  async Login() {
    if (this.formUsuario.valid) {
      this.loading = true;
      const email = this.formUsuario.getRawValue().email;
      const clave = this.formUsuario.getRawValue().clave;

      const credenciales = {
        email: email,
        clave: clave
      };
      this.authService.Login(credenciales).then((data: any) => {
        console.log(data.user.emailVerified)
        console.log(data.user)
        if (data.user.emailVerified == true) {
          this.firestoreService.TraerUsuarioPorEmail(email).then((querySnapshot) => {
            const usuarioLogueado = querySnapshot.docs[0].data() as Persona;
            switch (usuarioLogueado.perfil) {
              case "Paciente":
                this.swal.Exito("Éxito", "Ha iniciado sesión...").then(() => {
                  usuarioLogueado.habilitado = true;
                  this.authService.ActualizarUsuario(usuarioLogueado);
                  console.info("Entro paciente");
                  this.authService.seLogueo = true;
                  this.authService.esPaciente = true;
                  this.router.navigate(['']);
                  this.loading = false;
                });
                break;
              case "Especialista":
                if (usuarioLogueado.habilitado) {
                  this.swal.Exito("Éxito", "Ha iniciado sesión...").then(() => {
                    usuarioLogueado.habilitado = true;
                    this.authService.ActualizarUsuario(usuarioLogueado);
                    console.info("Entro especialista");
                    this.authService.seLogueo = true;
                    this.authService.esEspecialista = true;
                    this.router.navigate(['']);
                  });
                }
                else {
                  this.swal.Error("Atención", "Su cuenta debe ser aprobada por un administrador.")
                  this.authService.SignOut();
                  this.authService.seLogueo = false;
                }
                this.loading = false;
                break;
              default:
                this.swal.Exito("Éxito", "Ha iniciado sesión...").then(() => {
                  console.info("Entro admin");
                  this.authService.seLogueo = true;
                  this.authService.esAdmin = true;
                  this.router.navigate(['']);
                  this.loading = false;
                });
                break;
            }
          })
        }
        else {
          this.swal.Error("Atención", "Su correo electrónico aún no ha sido verificado, revise su casilla de correo.");
          this.authService.SignOut();
          this.loading = false;
        }
      }).catch((error) => {
        this.swal.Error("Error.", this.authService.ObtenerMensajeError(error.code))
        this.loading = false;
      })
    }
    else {
      this.swal.Error("Error.", "Revise los campos antes de continuar.")
      this.loading = false;
    }
  }

  seleccionUsuario($event: any) {
    this.formUsuario.patchValue({
      email: $event.email,
      clave: $event.password
    })
  }

  volver(): void {
    this.router.navigate(['home']);
  }
}
