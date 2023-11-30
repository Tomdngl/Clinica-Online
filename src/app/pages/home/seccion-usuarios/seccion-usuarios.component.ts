import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwalService } from 'src/app/services/swal.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Persona } from 'src/app/classes/persona';
import { Router } from '@angular/router';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.scss']
})
export class SeccionUsuariosComponent implements OnInit {

  listadoUsuarios: any[] = [];
  crearMenuUsuario: boolean = false;
  formPaciente: boolean = false;
  formEspecialista: boolean = false;
  formAdministrador: boolean = false;
  loading: boolean = false;
  
  historialClinico: any[] = [];
  historialActivo: any[] = [];
  hayHistorial: boolean = false;

  listaTurnos: any[] = [];

  constructor(private router: Router,
    private firestoreService: FirestoreService,
    private authService: AutenticacionService,
    private swal: SwalService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.firestoreService.TraerUsuarios().subscribe((users) => {
      this.loading = false;
      if (users) {
        this.listadoUsuarios = users;
      }
      this.firestoreService.getHistorialesClinicos().subscribe((historial) => {
        this.historialClinico = historial;
        historial.forEach((h) => {
          for (let i = 0; i < this.listadoUsuarios.length; i++) {
            const usuario = this.listadoUsuarios[i];
            if (usuario.perfil == 'Paciente' && usuario.id == h.paciente.id) {
              this.listadoUsuarios[i].historial = true;
            }
          }
        });
      });
      this.firestoreService.ObtenerListadoTurnos().subscribe((turnos: any) => {
        this.listaTurnos = [];
        for (let i = 0; i < turnos.length; i++) {
          const turnoEspecialista = turnos[i].turnos;
          for (let j = 0; j < turnoEspecialista.length; j++) {
            const t = turnoEspecialista[j];
            this.listaTurnos.push(t);
          }
        }
      });
    });
  }

  actualizarUser(user: Persona, option: number) {
    if (user.perfil == 'Especialista') {
      if (option == 1) {
        user.habilitado = true;
        this.authService.ActualizarUsuario(user);
        this.swal.Exito("Exito", "Usuario habilitado")
      } else if (option == 2) {
        user.habilitado = false;
        this.authService.ActualizarUsuario(user);
        this.swal.Exito("Exito", "Usuario deshabilitado") //IMPLEMENTAR MEJORIA TIPO GESTOR ESPECIALIDADES EN SWAL
      }
    }
  }

  VerHistorialPaciente(paciente: any,event:any) {
    console.info('Entra')
    this.historialActivo = [];
    for (let i = 0; i < this.historialClinico.length; i++) {
      const historial = this.historialClinico[i];
      if (historial.paciente.id == paciente.id) {
        this.historialActivo.push(historial);
      }
    }
    event.stopPropagation();
  }

  mostrarMenuUsuarios() {
    this.crearMenuUsuario = true;
  }

  mostrarListaUsuarios() {
    this.crearMenuUsuario = false;
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
  }

  mostrarFormPaciente() {
    this.formPaciente = true;
  }

  mostrarFormEspecialista() {
    this.formEspecialista = true;
  }

  mostrarFormAdministrador() {
    this.formAdministrador = true;
  }

  descargarExcel() {
    const listadoAGuardar: any[] = [];
    this.listadoUsuarios.forEach((user: any) => {
      const usuario: any = {};
      if (user.obraSocial) {
        usuario.perfil = "Paciente";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.email = user.email;
        usuario.dni = user.dni;
        usuario.obraSocial = user.obraSocial;
        listadoAGuardar.push(usuario);
      }
      else if (user.especialidad) {
        usuario.perfil = "Especialista";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.email = user.email;
        usuario.dni = user.dni;
        user.especialidad?.forEach((especialidad: any, index: number) => {
          if (especialidad != undefined) {
            if (index == 0) {
              usuario.especialidad = ""
            }
            usuario.especialidad += especialidad.nombre;

            if (index !== user.especialidad.length - 1) {
              usuario.especialidad += " - ";
            }
          }
        });
        listadoAGuardar.push(usuario);
      }
      else {
        usuario.perfil = "Admin";
        usuario.nombre = user.nombre;
        usuario.apellido = user.apellido;
        usuario.email = user.email;
        usuario.dni = user.dni;
        listadoAGuardar.push(usuario);
      }
    });
    this.exportAsExcelFile(listadoAGuardar, 'Usuario-Clinica');
    this.swal.Exito("Exito", "Lista de usuarios descargada")
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  volver(): void {
    this.router.navigate(['home']);
  }
}