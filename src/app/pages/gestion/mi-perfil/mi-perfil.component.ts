import { Component } from '@angular/core';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

  historialClinico: any[] = [];
  historialClinicoFiltrado: any[] = [];
  tieneHistorial: boolean = false;
  tieneHistorialFiltrado: boolean = true;
  palabraBusqueda: any;
  turnosFiltrados: any;
  turnosDelEspecialista: any[] = [];
  turnosActuales: any = {};
  fechaActual: Date = new Date();

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
          this.firestoreService.getHistorialesClinicos().subscribe((historial) => {
          this.historialClinico = historial.filter((h) => h.paciente.id == this.usuario.id);
          this.tieneHistorial = this.historialClinico.length > 0;
          });
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
        this.notificationService.showInfo('Se ha asignado un día', 'Perfil');
        this.activateDeactivarBoton(day);
      } else if (this.diasEspecialista.some((d) => d == day)) {
        const index = this.diasEspecialista.indexOf(day);
        this.diasEspecialista.splice(index, 1);
        this.notificationService.showInfo(
          'Se cancelo la asignación del día',
          'Perfil'
        );
        this.activateDeactivarBoton(day);
      } else {
        this.notificationService.showWarning(
          'Este día ya esta asignado para otra especialidad',
          'Perfil'
        );
      }
    } else if (this.especialidad2) {
      if (
        !this.diasEspecialista.some((d) => d == day) &&
        !this.usuario.especialidad[0].diasTurnos.some((d: any) => d == day)
      ) {
        this.diasEspecialista.push(day);
        this.notificationService.showInfo('Se ha asignado un Día', 'Perfil');
        this.activateDeactivarBoton(day);
      } else if (this.diasEspecialista.some((d) => d == day)) {
        const index = this.diasEspecialista.indexOf(day);
        this.diasEspecialista.splice(index, 1);
        this.notificationService.showInfo(
          'Se cancelo la asignación del día',
          'Perfil'
        );
        this.activateDeactivarBoton(day);
      } else {
        this.notificationService.showWarning(
          'Este día ya esta asignado para otra especialidad',
          'Perfil'
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

  verHistorialClinico() {
    this.historialClinicoFiltrado = [...this.historialClinico];
  }

  filtrarPorCamposEspecialista() {
    this.turnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.turnosFiltrados = [...this.turnosDelEspecialista];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      for (let i = 0; i < this.turnosDelEspecialista.length; i++) {
        const turno = this.turnosDelEspecialista[i];
        const fechaBusqueda = this.transformarFechaParaBusqueda(turno.fecha);
        if (
          turno.especialista.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.especialista.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda) ||
          turno.estado.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.obraSocial.toLocaleLowerCase().includes(busqueda) ||
          fechaBusqueda.includes(busqueda) ||
          turno?.detalle?.altura?.toString().includes(busqueda) ||
          turno?.detalle?.peso?.toString().includes(busqueda) ||
          turno?.detalle?.temperatura?.toString().includes(busqueda) ||
          turno?.detalle?.presion?.includes(busqueda) ||
          turno?.detalleAdicional?.clave1?.includes(busqueda) ||
          turno?.detalleAdicional?.clave2?.includes(busqueda) ||
          turno?.detalleAdicional?.clave3?.includes(busqueda) ||
          turno?.detalleAdicional?.valor1?.includes(busqueda) ||
          turno?.detalleAdicional?.valor2?.includes(busqueda) ||
          turno?.detalleAdicional?.valor3?.includes(busqueda)
        ) {
          this.turnosFiltrados.push(turno);
        }
      }
    }
  }

  transformarFechaParaBusqueda(value: any) {
    if (value.seconds) {
      value = new Date(value.seconds * 1000);
    }
    let rtn =
      value.getFullYear() +
      '-' +
      (value.getMonth() + 1) +
      '-' +
      value.getDate();
    if (parseInt(rtn.split('-')[2]) < 10 && parseInt(rtn.split('-')[2]) > 0) {
      rtn =
        value.getFullYear() +
        '-' +
        (value.getMonth() + 1) +
        '-0' +
        value.getDate();
    } else {
      rtn =
        value.getFullYear() +
        '-' +
        (value.getMonth() + 1) +
        '-' +
        value.getDate();
    }
    return rtn;
  }

  filtrarHistorialClinico(nombreEspecialista: string) {
    this.historialClinicoFiltrado = [];
    const nombreLower = nombreEspecialista.toLowerCase();

    if (nombreEspecialista === '') {
      this.historialClinicoFiltrado = [...this.historialClinico];
    } else {
      for (let i = 0; i < this.historialClinico.length; i++) {
        const historial = this.historialClinico[i];
        const especialistaNombreLower = historial.especialista.nombre.toLowerCase();
        const especialistaApellidoLower = historial.especialista.apellido.toLowerCase();
        const nombreCompletoLower = especialistaNombreLower + ' ' + especialistaApellidoLower;

        if (nombreCompletoLower.includes(nombreLower)) {
          this.historialClinicoFiltrado.push(historial);
        }
      }
    }

    if (this.historialClinicoFiltrado.length === 0) {
      this.tieneHistorialFiltrado = false;
    } else {
      this.tieneHistorialFiltrado = true;
    }
  }

  crearPDF() {
    const DATA = document.getElementById('pdf');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas: any) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult: any) => {
        docResult.save(`historial-clinico-${this.usuario.nombre}.pdf`);
      });
  }
}
