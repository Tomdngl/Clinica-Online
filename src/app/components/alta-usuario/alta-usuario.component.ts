import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Persona } from 'src/app/classes/persona';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { StorageService } from 'src/app/services/storage.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-alta-usuario',
  templateUrl: './alta-usuario.component.html',
  styleUrls: ['./alta-usuario.component.scss']
})
export class AltaUsuarioComponent {
  //@ts-ignore
  formPaciente: FormGroup;
  imagenes:string[]
  loading:boolean = false
  nuevoPaciente = new Persona()
  captcha:string = ''

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private swal:SwalService,
    private storageService:StorageService,
    private authService:AutenticacionService) { 
    this.imagenes = [];
  }

  ngOnInit() {
    this.formPaciente = this.fb.group({
      nombre: ['',[Validators.required,Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/)]],
      apellido: ['',[Validators.required,Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/)]],
      edad: ['',[Validators.required]],
      dni: ['',[Validators.required,Validators.pattern('^[0-9]+$')]],
      obraSocial: ['',[Validators.required]],
      email: ['',[Validators.required,Validators.email]],
      clave: ['',[Validators.required,Validators.minLength(6)]],
      foto:['',Validators.required],
      captcha:['',Validators.required]
    });

    this.captcha = this.GenerarCaptcha(6)
  }

  async Registrar() {
    if(this.formPaciente.valid && this.imagenes.length == 2)
    {
      if(this.captcha.toLocaleLowerCase().trim() == this.formPaciente.getRawValue().captcha.toLocaleLowerCase().trim())
      {
        this.loading = true

        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const files: FileList | null = fileInput.files;
  
        const urls = await this.storageService.SubirImagenes(this.formPaciente.getRawValue().dni,files,"pacientes")
  
        this.nuevoPaciente.nombre = this.formPaciente.getRawValue().nombre;
        this.nuevoPaciente.apellido = this.formPaciente.getRawValue().apellido;
        this.nuevoPaciente.edad = this.formPaciente.getRawValue().edad;
        this.nuevoPaciente.dni = this.formPaciente.getRawValue().dni;
        this.nuevoPaciente.obraSocial = this.formPaciente.getRawValue().obraSocial;
        this.nuevoPaciente.email = this.formPaciente.getRawValue().email;
        this.nuevoPaciente.password = this.formPaciente.getRawValue().clave;
        this.nuevoPaciente.perfil = "Paciente"
        this.nuevoPaciente.fotos = urls
        this.authService.RegistrarUsuario(this.nuevoPaciente)
        setTimeout(() => {
          this.loading = false;
          this.formPaciente.reset();
          this.nuevoPaciente = new Persona();
        }, 2000);
      }
      else
      {
        this.swal.Error('Error.','¡El captcha es incorrecto!');
      }
    }
    else {
      this.swal.Error('Error.','¡Asegurese de completar el formulario correctamente!');
    }
    this.loading = false
  }

  handleFileInputChange(event: any) {
    const files: FileList = event.target.files;

    if (files.length !== 2) {
      this.swal.Error("Error.","Debe subir 2 imagenes")
      return;
    }

    this.imagenes = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      this.imagenes.push(imageUrl);
    }
  }

  LimpiarForm() {
    this.formPaciente.reset();
    this.imagenes = [];
  }

  GenerarCaptcha(num:number) :string
  {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaRetorno = ' ';
    const cantCaracteres = caracteres.length;
    for (let i = 0; i < num; i++) {
      captchaRetorno += caracteres.charAt(
        Math.floor(Math.random() * cantCaracteres)
      );
    }
    return captchaRetorno;
  }

  volver(): void {
    this.swal.MostrarConfirmacion("Confirmación", "¿Desea cancelar el registro?").then((res) => {
      if(res.isConfirmed){
        this.router.navigate(['home']);
      }
    })
  }
}
