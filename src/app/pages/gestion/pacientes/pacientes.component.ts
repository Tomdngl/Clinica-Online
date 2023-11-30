import { Component } from '@angular/core';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { ToastService } from 'src/app/services/toast.service';
import { AngularFireAuth  } from '@angular/fire/compat/auth';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent {
  loading: boolean = false;
  user: any = null;
  usersList: any[] = [];
  turnosDelPaciente: any;
  turnosDelEspecialista: any;
  currentSpecialistTurnList: any;
  pacientesAtendidos: any[] = [];
  turnosFiltrados: any;
  turnList: any;
  pacientesDelEspecialista: any;
  auxPacientesDelEspecialista: any;
  isPaciente: any;
  isEspecialista: any;
  usuarioLogueado: any;
  listaDeEspecialistas: any;

  historialClinico: any[] = [];
  historialActivo: any[] = [];
  historialClinicoDelEspecialista: any[] = [];
  hayPacientesAtendidos: boolean = false;
  turnosActivos: any[] = [];

  constructor(
    private authService: AutenticacionService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
        this.authService.seLogueo = true;
      }
      this.firestoreService.TraerUsuarios().subscribe((users) => {
        if (users) {
          this.usersList = users;
        }
        this.firestoreService.getHistorialesClinicos().subscribe((historial) => {
          this.historialClinico = historial;
          this.pacientesAtendidos = [];
          this.historialClinicoDelEspecialista = [];
          historial.forEach((h) => {
            for (let i = 0; i < this.usersList.length; i++) {
              const usuario = this.usersList[i];
              if (usuario.perfil == 'Paciente' && usuario.id == h.paciente.id && this.user.id == h.especialista.id) {
                this.usersList[i].historial = true;
                this.pacientesAtendidos = this.pacientesAtendidos.filter(
                  (p) => {
                    return p.id != usuario.id;
                  }
                );
                this.pacientesAtendidos.push(usuario);
              }
            }
          });          

          this.historialClinicoDelEspecialista = this.historialClinico.filter(
            (h) => {
              return h.especialista.id == this.user.id;
            }
          );

          this.historialClinicoDelEspecialista.forEach((h) => {
            h.paciente.contadorHistorial = 0;
          });
          for (let i = 0; i < this.pacientesAtendidos.length; i++) {
            const paciente = this.pacientesAtendidos[i];
            paciente.contador = 0;
            this.historialClinicoDelEspecialista.forEach((h) => {
              if (paciente.id == h.paciente.id) {
                paciente.contador++;
                h.paciente.contador = paciente.contador;
              }
            });
          }

          if (this.pacientesAtendidos.length == 0) {
            this.hayPacientesAtendidos = false;
          } else {
            this.hayPacientesAtendidos = true;
          }
        });
      });
    });

    this.cargarTurnos();

    setTimeout(() => {
      this.loading = false;
    }, 5000)
  }

  verHistorialPaciente(paciente: any) {
    this.historialActivo = [];
    this.turnosActivos = [];
    for (let i = 0; i < this.historialClinico.length; i++) {
      const historial = this.historialClinico[i];
      if (historial.paciente.id == paciente.id) {
        this.historialActivo.push(historial);
      }
    }
    for (let i = 0; i < this.turnosFiltrados.length; i++) {
      const turnoFiltrado = this.turnosFiltrados[i];
      if (turnoFiltrado.paciente.id == paciente.id) {
        this.turnosActivos.push(turnoFiltrado);
      }
    }
  }

  cargarTurnos() {
    this.firestoreService.ObtenerListadoTurnos().subscribe((turns: any) => {
      this.currentSpecialistTurnList = turns;
      this.turnList = [];
      this.turnosFiltrados = [];
      this.turnosDelPaciente = [];
      this.turnosDelEspecialista = [];
      this.pacientesDelEspecialista = [];
      this.auxPacientesDelEspecialista = [];

      for (let i = 0; i < turns.length; i++) {
        const turnSpecialist = turns[i].turnos;
        for (let j = 0; j < turnSpecialist.length; j++) {
          const turn = turnSpecialist[j];
          if (turn.estado !== 'disponible') {
            this.turnList.push(turn);
            if (turn.paciente?.id === this.usuarioLogueado?.id) {
              this.turnosDelPaciente.push(turn);
            }
            if (turn.especialista?.id === this.usuarioLogueado?.id) {
              this.turnosDelEspecialista.push(turn);
              this.auxPacientesDelEspecialista.push(turn.paciente);
            }
          }
        }
      }

      for (let i = 0; i < this.auxPacientesDelEspecialista.length; i++) {
        const paciente = this.auxPacientesDelEspecialista[i];
        const index = this.pacientesDelEspecialista.findIndex((p: any) => paciente.id === p.id);
        if (index === -1) {
          this.pacientesDelEspecialista.push(paciente);
        }
      }

      if (this.isPaciente) {
        this.turnosFiltrados = [...this.turnosDelPaciente];
      } else if (this.isEspecialista) {
        this.turnosFiltrados = [...this.turnosDelEspecialista];
      }

    });
    this.firestoreService.TraerUsuarios().subscribe((users) => {
      if (users) {
        this.listaDeEspecialistas = users.filter(
          (u: any) => u.perfil == 'especialista' && u.habilitado
        );
      }
    });
  }
}
