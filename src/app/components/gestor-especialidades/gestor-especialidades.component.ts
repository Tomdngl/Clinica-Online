import { Component, EventEmitter, Output } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-gestor-especialidades',
  templateUrl: './gestor-especialidades.component.html',
  styleUrls: ['./gestor-especialidades.component.scss']
})
export class GestorEspecialidadesComponent {
  @Output() botonClickeado = new EventEmitter<any>();
  especialidades: string[] = [];
  filtroEspecialidad: string[] = [];
  inputEspecialidad: string;
  crearEspecialidad: string;
  inputValidado: boolean = false;
  listaEspecialidades: any;

  constructor(private firestoreService: FirestoreService,
    private swalService: SwalService,) {
    this.listaEspecialidades = [];
    this.crearEspecialidad = "";
    this.inputEspecialidad = "";
  }

  ngOnInit(): void {
    this.filtroEspecialidad = [];
    this.firestoreService.traerEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data.map((doc: any) => doc.nombre);
      this.filtroEspecialidad = [...this.especialidades];
    });
  }

  validarEspecialidad() {
    if (this.inputEspecialidad.match(/^[a-zA-Z ]+$/)) {
      this.inputValidado = true;
      this.crearEspecialidad = this.inputEspecialidad;
    }
    else {
      this.inputValidado = false;
    }
    this.inputEspecialidad = '';
    this.filtroEspecialidad = [...this.especialidades];
  }

  borrarEspecialidad(especialidad: string) {
    this.swalService.MostrarConfirmacion("Confirmación", "¿Desea eliminar la especialidad?").then((res) => {
      if (res.isConfirmed) {
        this.firestoreService.borrarEspecialidadFirestore(especialidad)
          .then(() => {
            this.swalService.Exito('Especialidad "${especialidad}" Eliminada con éxito.', "Eliminada.");
            const indice = this.especialidades.indexOf(especialidad);
            if (indice !== -1) {
              this.especialidades.splice(indice, 1);
              this.filtroEspecialidad = [...this.especialidades];
            }
          })
          .catch((error: any) => {
            this.swalService.Error('Error al eliminar la especialidad "${especialidad}": ${error}', "Error.");
          });
      }
      else {
        this.swalService.Info('Atención.', 'Se canceló la eliminación de la especialidad.')
      }
    })
  }

  filtrarLista() {
    this.filtroEspecialidad = this.especialidades.filter((item: string) =>
      item.toLowerCase().includes(this.inputEspecialidad.toLowerCase())
    );
  }

  agregarEspecialidad() {
    if (this.inputValidado) {
      this.firestoreService.setEspecialidad(this.crearEspecialidad);
      this.swalService.Exito("Especialidad agregada con éxito!", "Éxito.");
    }
    else {
      this.swalService.Error("Revise el nombre de la especialidad", "Error.");
    }
  }

  clickListado(especialidad: any) {
    const nombreEspecialidad = { nombre: especialidad };

    if (!this.listaEspecialidades.some((e: any) => e.nombre === especialidad)) {
      if (this.listaEspecialidades.length < 2) {
        this.listaEspecialidades.push(nombreEspecialidad);
        this.botonClickeado.emit(this.listaEspecialidades);
      }
    } else {
      const indice = this.listaEspecialidades.findIndex((e: any) => e.nombre === especialidad);
      this.listaEspecialidades.splice(indice, 1);
      this.botonClickeado.emit(this.listaEspecialidades);
    }
  }
}
