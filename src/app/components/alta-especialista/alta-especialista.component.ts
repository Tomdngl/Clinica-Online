import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Persona } from 'src/app/classes/persona';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { StorageService } from 'src/app/services/storage.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-alta-especialista',
  templateUrl: './alta-especialista.component.html',
  styleUrls: ['./alta-especialista.component.scss']
})
export class AltaEspecialistaComponent {
  @Input() especialidad?: any;
  //@ts-ignore
  formEspecialista: FormGroup;
  textoEspecialidades: string = "";
  imagenes:string[]
  nuevoEspecialista = new Persona()
  loading = false;
  captcha:string = ''
 
  constructor(private router: Router, 
    private fb: FormBuilder,
    private swal:SwalService,
    private storageService:StorageService,
    private authService:AutenticacionService) { 
    this.imagenes = [];
  }

ngOnInit() {
    this.formEspecialista = this.fb.group({
      nombre: ['',[Validators.required,Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/)]],
      apellido: ['',[Validators.required,Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/)]],
      edad: ['',[Validators.required]],
      dni: ['',[Validators.required,Validators.pattern('^[0-9]+$')]],
      especialidad: ['', [Validators.required]],
      email: ['',[Validators.required,Validators.email]],
      clave: ['',[Validators.required,Validators.minLength(6)]],
      foto:['',Validators.required],
      captcha:['',Validators.required]
    });
  }

  async Registrar() {
    console.log("this.imagenes.length:" + this.imagenes.length)
    console.log("this.formEspecialista.valid:" + this.formEspecialista.valid)
    
    if(this.formEspecialista.valid && this.imagenes.length == 1)
    {
      if(this.captcha != null || '')
      {
        this.loading = true

        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const files: FileList | null = fileInput.files;
  
        const urls = await this.storageService.SubirImagenes(this.formEspecialista.getRawValue().dni,files,"especialistas")
  
        this.nuevoEspecialista.nombre = this.formEspecialista.getRawValue().nombre;
        this.nuevoEspecialista.apellido = this.formEspecialista.getRawValue().apellido;
        this.nuevoEspecialista.edad = this.formEspecialista.getRawValue().edad;
        this.nuevoEspecialista.dni = this.formEspecialista.getRawValue().dni;
        this.nuevoEspecialista.especialidad = this.formEspecialista.getRawValue().especialidad;
        this.nuevoEspecialista.email = this.formEspecialista.getRawValue().email;
        this.nuevoEspecialista.password = this.formEspecialista.getRawValue().clave;
        this.nuevoEspecialista.perfil = "Especialista"
        this.nuevoEspecialista.fotos = urls
        this.authService.RegistrarUsuario(this.nuevoEspecialista)
        setTimeout(() => {
          this.loading = false;
          this.formEspecialista.reset();
          this.nuevoEspecialista = new Persona();
        }, 2000);
      }
    }
    else {
      if(this.captcha == null || '')
      {
        this.swal.Error('Error.','El captcha no ha sido resuelto.');
      }
      else
      {
        this.swal.Error('Error.','Error en los datos ingresados, reviselos e intente nuevamente.');
      }
    }
    this.loading = false
  }

  handleFileInputChange(event: any) {
    const files: FileList = event.target.files;

    if (files.length !== 1) {
      this.swal.Error("Error.","Debe subir 1 imágen")
      return;
    }

    this.imagenes = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      this.imagenes.push(imageUrl);
    }
  }

  addEspecialidad() {
    if (this.formEspecialista.getRawValue().especialidad == '') {
      this.especialidad = true;
    } else {
      this.especialidad = false;
    }
  }

  clickListado($event: any) {
    //@ts-ignore
    this.textoEspecialidades = $event.map((especialidad) => especialidad.nombre).join(' - ');
    this.especialidad = $event;
  }

  resolved(captchaResponse: string)
  {
    this.captcha = captchaResponse
    console.log("El captcha se resolvio con: " + this.captcha)
  }
  
  volver(): void {
    this.swal.MostrarConfirmacion("Confirmación", "¿Desea cancelar el registro?").then((res) => {
      if(res.isConfirmed){
        this.router.navigate(['home']);
      }
    })
  }
}
