import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Persona } from 'src/app/classes/persona';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { StorageService } from 'src/app/services/storage.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-alta-admin',
  templateUrl: './alta-admin.component.html',
  styleUrls: ['./alta-admin.component.scss']
})
export class AltaAdminComponent {
  @Input() especialidad?: any;
  //@ts-ignore
  formAdmin: FormGroup;
  imagenes:string[]
  nuevoAdmin = new Persona()
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
    this.formAdmin = this.fb.group({
      nombre: ['',[Validators.required,Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/)]],
      apellido: ['',[Validators.required,Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]*$/)]],
      edad: ['',[Validators.required]],
      dni: ['',[Validators.required,Validators.pattern('^[0-9]+$')]],
      email: ['',[Validators.required,Validators.email]],
      clave: ['',[Validators.required,Validators.minLength(6)]],
      foto:['',Validators.required],
      captcha:['',Validators.required]
    });
  }

  async Registrar() {
    console.log("this.imagenes.length:" + this.imagenes.length)
    console.log("this.formAdmin.valid:" + this.formAdmin.valid)
    
    if(this.formAdmin.valid && this.imagenes.length == 1)
    {
      if(this.captcha != null || '')
      {
        this.loading = true

        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const files: FileList | null = fileInput.files;
  
        const urls = await this.storageService.SubirImagenes(this.formAdmin.getRawValue().dni,files,"especialistas")
  
        this.nuevoAdmin.nombre = this.formAdmin.getRawValue().nombre;
        this.nuevoAdmin.apellido = this.formAdmin.getRawValue().apellido;
        this.nuevoAdmin.edad = this.formAdmin.getRawValue().edad;
        this.nuevoAdmin.dni = this.formAdmin.getRawValue().dni;
        this.nuevoAdmin.email = this.formAdmin.getRawValue().email;
        this.nuevoAdmin.password = this.formAdmin.getRawValue().clave;
        this.nuevoAdmin.perfil = "Admin"
        this.nuevoAdmin.fotos = urls
        this.authService.RegistrarUsuario(this.nuevoAdmin)
        setTimeout(() => {
          this.loading = false;
          this.formAdmin.reset();
          this.nuevoAdmin = new Persona();
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
