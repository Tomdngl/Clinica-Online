import { Component } from '@angular/core';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-solicitar-turnos',
  templateUrl: './solicitar-turnos.component.html',
  styleUrls: ['./solicitar-turnos.component.scss']
})
export class SolicitarTurnosComponent {
  usuario: any = null;
  esPaciente: boolean = false;
  loading: boolean = false;

  arrayEspecialistas: any[] = [];
  arrayEspecialistasSeleccionados: any[] = [];
  arrayEspecialidades: any[] = [];
  arrayPacientes: any[] = [];
  EspecialidadActiva: any = null;
  EspecialistaActivo: any = null;
  pacienteActivo: any = null;
  muestraSeleccionEspecialista: boolean = true;
  muestraSeleccionPaciente: boolean = false;
  muestraSeleccionTurnos: boolean = false;
  ListaDeTurnosActual: any[] = [];
  turnosAMostrar: any[] = [];
  turnosDeUnDiaAMostrar: any[] = [];
  diasAMostrar: any[] = [];
  botonPedirTurno: boolean = false;
  turnoSeleccionado: any = null;

  constructor(
    public authService:AutenticacionService,
    private firestoreService:FirestoreService,
    private notificationService:ToastService
  ) 
  {}
  
  ngOnInit(): void {
    this.loading = true;
    this.authService.user$.subscribe((user:any) => {
      if(user)
      {
        this.usuario = user;
        if(this.authService.esPaciente)
        {
          this.esPaciente = true
        }
        else if(this.authService.esAdmin)
        {
          this.muestraSeleccionPaciente = true
        }

        this.firestoreService.traerEspecialidades().subscribe((especialidades) => {
          if (especialidades) {
            this.arrayEspecialidades = especialidades;
           
          } else {
            this.loading = false;
          }
        });

        this.firestoreService.TraerUsuarios().subscribe((users) => {
          if (users) {
            this.arrayEspecialistas = users.filter((u:any) => u.perfil == 'Especialista' && u.habilitado);
            this.arrayPacientes = users.filter((u:any) => u.perfil == 'Paciente');
            this.firestoreService.ObtenerListadoTurnos().subscribe((turnosEspecialista) => {
            this.ListaDeTurnosActual = turnosEspecialista;
            this.loading = false;
            });
          } else {
            this.loading = false;
          }
        });
      }
      this.loading = false;
    })
  }

  verificarImagenEspecialidad(especialidad: any): string {
    const imagenPath = `assets/especialidades/${especialidad}.png`;
    const imagenExiste = this.verificarExistenciaImagen(imagenPath);
    return imagenExiste ? imagenPath : '/assets/especialidades/default.png';
  }

  verificarExistenciaImagen(rutaImagen: string): boolean {
    const img = new Image();
    img.src = rutaImagen;
    return img.complete || img.width + img.height > 0;
  }


  MostrarEspecialidad(esp: any) {
    this.muestraSeleccionEspecialista = false;
    this.EspecialidadActiva = esp;

    this.arrayEspecialistasSeleccionados = this.arrayEspecialistas.filter((u: any) => {
        return u.perfil === 'Especialista' && 
               u.habilitado && 
               Array.isArray(u.especialidad) &&  
               u.especialidad.some((e: any) => e.nombre.includes(esp.nombre)); 
    });

    console.log(this.arrayEspecialistasSeleccionados);
}

  MostrarPaciente(paciente: any) {
    this.muestraSeleccionPaciente = false;
    this.pacienteActivo = paciente;
  }

  mostrarTurnos(esp: any) {
    this.EspecialistaActivo = esp;
    this.muestraSeleccionTurnos = true;

    this.cargarHorasLibres('');
    this.turnosAMostrar.forEach((t) => {
      this.diasAMostrar.push(t.fecha);
    });

    const aux: any[] = [];
    this.diasAMostrar.forEach((d) => {
      for (let i = 0; i < this.diasAMostrar.length; i++) {
        const fecha = this.diasAMostrar[i];
        if (
          d.getMonth() === fecha.getMonth() &&
          d.getDate() === fecha.getDate()
        ) {
          if (!aux.some((a) => {
              return (d.getMonth() === a.getMonth() && d.getDate() === a.getDate());
            })
          ) {
            aux.push(d);
          }
        }
      }
    });

    aux.sort((a, b) => a - b);
    this.diasAMostrar = [...aux];

    console.info(this.turnosAMostrar)
  }

  cargarHorasLibres(day: string) {
    const currentDate = new Date();

    const listaTurnosDelEspecialista = this.ListaDeTurnosActual.filter(
      (t) => t.especialista.email == this.EspecialistaActivo.email
    );

    const turnosEspecialidad =
      listaTurnosDelEspecialista[0].turnos.filter((t: any) => {
        return (
          t.especialidad == this.EspecialidadActiva.nombre &&
          currentDate.getTime() < new Date(t.fecha.seconds * 1000).getTime()
        );
      });

    const turnos15dias: any[] = [];
    for (let i = 0; i < turnosEspecialidad.length; i++) {
      const turno = { ...turnosEspecialidad[i] };
      if (
        new Date(turno.fecha.seconds * 1000).getTime() <=
        currentDate.getTime() + 84600000 * 15 &&
        turno.estado == 'disponible'
      ) {
        turno.fecha = new Date(turno.fecha.seconds * 1000);
        turnos15dias.push(turno);
      }
    }
    console.log(turnos15dias);
    this.turnosAMostrar = [...turnos15dias];
  }

  SeleccionarTurno(turno: any) {
    this.turnoSeleccionado = turno;
    this.botonPedirTurno = true;
    this.notificationService.showInfo('Se ha seleccionado un turno', 'Turnos');
  }

  SolicitarTurno() {
    if (this.esPaciente) {
      this.turnoSeleccionado.paciente = this.usuario;
      this.turnoSeleccionado.estado = 'solicitado';
    } else {
      this.turnoSeleccionado.paciente = this.pacienteActivo;
      this.turnoSeleccionado.estado = 'solicitado';
    }

    for (let i = 0; i < this.ListaDeTurnosActual.length; i++) {
      const turnosEspecialista = this.ListaDeTurnosActual[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
          this.turnoSeleccionado.fecha.getTime() &&
          t.especialidad == this.turnoSeleccionado.especialidad
        );
      });
      turnosEspecialista.turnos[index] = this.turnoSeleccionado;
      this.firestoreService.ActualizarListadoTurnos(turnosEspecialista);
    }
    this.turnosAMostrar = [];
    this.turnosDeUnDiaAMostrar = [];
    this.botonPedirTurno = false;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.notificationService.showSuccess('Se ha solicitado el turno exitosamente', 'Turnos');
      this.cargarHorasLibres('');
    }, 1000);
  }
}
