export class Persona {
    id: number;
    perfil: string;
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    obraSocial: string;
    especialidad: string;
    email: string;
    password: string;
    fotos: any;
    habilitado: boolean;
  
    constructor() {
      this.id = 0;
      this.perfil = '';
      this.nombre = '';
      this.apellido = '';
      this.edad = 0;
      this.dni = 0;
      this.obraSocial = '';
      this.especialidad = '';
      this.email = '';
      this.password = '';
      this.habilitado = false;
    }
}
