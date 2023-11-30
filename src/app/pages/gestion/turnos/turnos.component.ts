import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent {
  loading: boolean = false;
  listaDeTurnos: any[] = [];
  ListaDeTurnosActual: any[] = [];

  botonesEspecialidad: boolean = false;
  filtroEspecialidad: boolean = false;

  vistaListadoDeEspecialistas: boolean = false;
  listaDeEspecialistas: any[] = [];
  listaPorEspecialista: any[] = [];

  cancelacionTurno: boolean = false;
  comentarioCancelacion: string = '';
  turnoACancelar: any = {};

  palabraBusqueda: string = '';
  turnosFiltrados: any[] = [];

  constructor(
    private notificationService: ToastService,
    private firestoreService:FirestoreService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.firestoreService.ObtenerListadoTurnos().subscribe((turns: any) => {
      this.ListaDeTurnosActual = turns;
      this.listaDeTurnos = [];
      for (let i = 0; i < turns.length; i++) {
        const turnSpecialist = turns[i].turnos;
        for (let j = 0; j < turnSpecialist.length; j++) {
          const turn = turnSpecialist[j];
          if (turn.estado != 'disponible') {
            this.listaDeTurnos.push(turn);
          }
        }
      }
      this.turnosFiltrados = [...this.listaDeTurnos];
    });
    this.firestoreService.TraerUsuarios().subscribe((users) => {
      this.loading = false;
      if (users) {
        this.listaDeEspecialistas = users.filter(
          (u:any) => u.perfil == 'Especialista' && u.aprobado
        );
        console.log(this.listaDeEspecialistas);
      }
    });
  }

  cancelarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    console.log(turno);
  }

  confirmarCancelacion(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.showWarning(
        'Ingrese un comentario explicando la razón de la cancelacion.',
        'Turnos'
      );
    } else {
      turno.estado = 'cancelado';
      turno.comentario = this.comentarioCancelacion;
      for (let i = 0; i < this.ListaDeTurnosActual.length; i++) {
        const turnosEspecialista = this.ListaDeTurnosActual[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
              new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.firestoreService.ActualizarListadoTurnos(turnosEspecialista);
      }

      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.turnoACancelar = {};
        this.cancelacionTurno = false;
        this.notificationService.showSuccess('Turno cancelado.', 'Turnos');
      }, 1000);
    }
  }

  filtrarPorCamposAdministrador() {
    this.turnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.turnosFiltrados = [...this.listaDeTurnos];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      for (let i = 0; i < this.listaDeTurnos.length; i++) {
        const turno = this.listaDeTurnos[i];
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
    let rtn =value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
    if (parseInt(rtn.split('-')[2]) < 10 && parseInt(rtn.split('-')[2]) > 0) {
      rtn = value.getFullYear() + '-' + (value.getMonth() + 1) + '-0' + value.getDate();
    } else {
      rtn = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
    }
    return rtn;
  }
}
