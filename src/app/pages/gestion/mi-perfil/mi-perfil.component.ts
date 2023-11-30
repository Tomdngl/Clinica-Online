import { Component } from '@angular/core';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent {
  usuario: any = null;
  loading: boolean = false;
  esPaciente: boolean = false;
  esEspecialista: boolean = false;
  esAdmin: boolean = false;
  diasEspecialista: any[] = [];

  especialidad1: boolean = true;
  especialidad2: boolean = false;

  lunes: boolean = false;
  martes: boolean = false;
  miercoles: boolean = false;
  jueves: boolean = false;
  viernes: boolean = false;
  sabado: boolean = false;
  duracionTurno: number = 30;

  turnosActuales: any = {};

  constructor(public authService:AutenticacionService,
    private swal:SwalService,
    private notificationService:ToastService,
    private firestoreService:FirestoreService) {}

  ngOnInit() {
    this.loading = true
    this.authService.user$.subscribe((user:any) => {
      if(user)
      {
        this.usuario = user;
        if(this.authService.esPaciente)
        {
          this.esPaciente = true;
        }
        if(this.authService.esAdmin)
        {
          this.esAdmin = true;
        }
        if(this.authService.esEspecialista)
        {
          this.esEspecialista = true
          if (this.usuario.especialidad[0].diasTurnos) {
            this.diasEspecialista = [...this.usuario.especialidad[0].diasTurnos];
            this.duracionTurno = this.usuario.especialidad[0].duracionTurno;
            this.activarBoton();
            this.firestoreService.ObtenerListadoTurnos().subscribe((turnosEspecialista) => {
              for (let i = 0; i < turnosEspecialista.length; i++) {
                const listaTurnos = turnosEspecialista[i];
                if (this.usuario.email == listaTurnos.especialista.email) {
                  this.turnosActuales = listaTurnos;
                }
              }
            });
          }  
        }
      }
      this.loading = false;
    })
  }

  agregarDia(day: string) {
    if (this.especialidad1) {
      if (
        !this.diasEspecialista.some((d) => d == day) &&
        !this?.usuario?.especialidad[1]?.diasTurnos?.some((d: any) => d == day)
      ) {
        this.diasEspecialista.push(day);
        this.notificationService.showInfo('Se ha asignado un Día', 'MI PERFIL');
        this.activateDeactivarBoton(day);
      } else if (this.diasEspecialista.some((d) => d == day)) {
        const index = this.diasEspecialista.indexOf(day);
        this.diasEspecialista.splice(index, 1);
        this.notificationService.showInfo(
          'Se cancelo la asignación del día',
          'MI PERFIL'
        );
        this.activateDeactivarBoton(day);
      } else {
        this.notificationService.showWarning(
          'Este día ya esta asignado para otra especialidad',
          'MI PERFIL'
        );
      }
    } else if (this.especialidad2) {
      if (
        !this.diasEspecialista.some((d) => d == day) &&
        !this.usuario.especialidad[0].diasTurnos.some((d: any) => d == day)
      ) {
        this.diasEspecialista.push(day);
        this.notificationService.showInfo('Se ha asignado un Día', 'MI PERFIL');
        this.activateDeactivarBoton(day);
      } else if (this.diasEspecialista.some((d) => d == day)) {
        const index = this.diasEspecialista.indexOf(day);
        this.diasEspecialista.splice(index, 1);
        this.notificationService.showInfo(
          'Se cancelo la asignación del día',
          'MI PERFIL'
        );
        this.activateDeactivarBoton(day);
      } else {
        this.notificationService.showWarning(
          'Este día ya esta asignado para otra especialidad',
          'MI PERFIL'
        );
      }
    }
  }

  activateDeactivarBoton(day: string) {
    switch (day) {
      case 'lunes':
        this.lunes = !this.lunes;
        break;
      case 'martes':
        this.martes = !this.martes;
        break;
      case 'miércoles':
        this.miercoles = !this.miercoles;
        break;
      case 'jueves':
        this.jueves = !this.jueves;
        break;
      case 'viernes':
        this.viernes = !this.viernes;
        break;
      case 'sábado':
        this.sabado = !this.sabado;
        break;
    }
  }

  activarBoton() {
    this.diasEspecialista.forEach((day) => {
      switch (day) {
        case 'lunes':
          this.lunes = true;
          break;
        case 'martes':
          this.martes = true;
          break;
        case 'miércoles':
          this.miercoles = true;
          break;
        case 'jueves':
          this.jueves = true;
          break;
        case 'viernes':
          this.viernes = true;
          break;
        case 'sábado':
          this.sabado = true;
          break;
      }
    });
  }

  desactivarBoton() {
    this.diasEspecialista.forEach((day) => {
      switch (day) {
        case 'lunes':
          this.lunes = false;
          break;
        case 'martes':
          this.martes = false;
          break;
        case 'miércoles':
          this.miercoles = false;
          break;
        case 'jueves':
          this.jueves = false;
          break;
        case 'viernes':
          this.viernes = false;
          break;
        case 'sábado':
          this.sabado = false;
          break;
      }
    });
  }

  actualizarUsuario() {
    let esp: any = {};
    if (this.especialidad1) {
      esp.nombre = this.usuario.especialidad[0].nombre;
      esp.diasTurnos = [...this.diasEspecialista];
      esp.duracionTurno = this.duracionTurno;
      this.usuario.especialidad[0] = esp;
    } else if (this.especialidad2) {
      esp.nombre = this.usuario.especialidad[1].nombre;
      esp.diasTurnos = [...this.diasEspecialista];
      esp.duracionTurno = this.duracionTurno;
      this.usuario.especialidad[1] = esp;
    }

    const listaDeTurnos: any[] = [];
    const currentDate = new Date();
    const duracionTurno = this.duracionTurno * 60000;

    for (let i = 0; i < this.diasEspecialista.length; i++) {
      const day = this.diasEspecialista[i];
      let dayNumber = 0;
      switch (day) {
        case 'lunes':
          dayNumber = 1;
          break;
        case 'martes':
          dayNumber = 2;
          break;
        case 'miércoles':
          dayNumber = 3;
          break;
        case 'jueves':
          dayNumber = 4;
          break;
        case 'viernes':
          dayNumber = 5;
          break;
        case 'sábado':
          dayNumber = 6;
          break;
      }

      // CREACION DE TURNOS
      for (let j = 1; j <= 60; j++) {
        const date = new Date(currentDate.getTime() + 84600000 * j);
        if (date.getDay() == dayNumber) {
          let turnDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            8
          );
          let turnoNew: any = {};
          turnoNew.estado = 'disponible';
          if (this.especialidad1) {
            turnoNew.especialidad = this.usuario.especialidad[0].nombre;
          } else {
            turnoNew.especialidad = this.usuario.especialidad[1].nombre;
          }
          turnoNew.especialista = this.usuario;
          turnoNew.paciente = null;
          turnoNew.fecha = new Date(turnDay.getTime());
          listaDeTurnos.push(turnoNew);
          while (turnDay.getHours() < 19) {
            turnoNew = {};
            turnDay = new Date(turnDay.getTime() + duracionTurno);
            if (turnDay.getHours() != 19) {
              turnoNew.estado = 'disponible';
              if (this.especialidad1) {
                turnoNew.especialidad = this.usuario.especialidad[0].nombre;
              } else {
                turnoNew.especialidad = this.usuario.especialidad[1].nombre;
              }
              turnoNew.especialista = this.usuario;
              turnoNew.paciente = null;
              turnoNew.fecha = new Date(turnDay.getTime());
              listaDeTurnos.push(turnoNew);
            }
          }
        }
      }
    }

    // CREACION DE LISTA DE TURNOS DEL ESPECIALISTA, ESTO SE GUARDA EN LA BD
    const turno: any = {};
    
    if (this.turnosActuales.id) {
      
      turno.id = this.turnosActuales.id;
    }
    turno.especialista = this.usuario;
    turno.turnos = listaDeTurnos;

    
    if (this.turnosActuales?.turnos?.length) {
      let especialidad: string = '';
      if (this.especialidad1) {
        especialidad = this.usuario.especialidad[0].nombre;
      } else {
        especialidad = this.usuario.especialidad[1].nombre;
      }
      
      this.turnosActuales.turnos = this.turnosActuales.turnos.filter(
        (t: any) => {
          return (
            (t.estado != 'disponible' && t.especialidad == especialidad) ||
            t.especialidad != especialidad
          );
        }
      );
      
      turno.turnos = [...this.turnosActuales.turnos];
      for (let i = 0; i < listaDeTurnos.length; i++) {
        const newTurn = listaDeTurnos[i];
        turno.turnos.push(newTurn);
      }
      this.firestoreService.ActualizarListadoTurnos(turno);
    } else {
      this.firestoreService.CrearListadoTurnos(turno);
    }

    this.authService.ActualizarUsuario(this.usuario);
    this.swal.Exito("EXITO","Horarios asignados correctamente");
  }

  mostrarTurnosPrimera() {
    if (!this.especialidad1) {
      this.especialidad1 = true;
      this.especialidad2 = false;
      this.duracionTurno = this.usuario.especialidad[0].duracionTurno;
      this.desactivarBoton();
      this.diasEspecialista = [...this.usuario.especialidad[0].diasTurnos];
      this.activarBoton();
    }
  }

  mostrarTurnosSegunda() {
    if (!this.especialidad2) {
      this.especialidad1 = false;
      this.especialidad2 = true;
      this.duracionTurno = this.usuario.especialidad[1].duracionTurno;
      this.desactivarBoton();
      this.diasEspecialista = [...this.usuario?.especialidad[1].diasTurnos];
      this.activarBoton();
    }
  }
}
