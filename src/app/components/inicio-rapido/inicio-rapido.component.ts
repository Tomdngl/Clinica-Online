import { Component, EventEmitter, Output } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-inicio-rapido',
  templateUrl: './inicio-rapido.component.html',
  styleUrls: ['./inicio-rapido.component.scss']
})
export class InicioRapidoComponent {
  @Output() usuarioClickeado = new EventEmitter<any>();
  listaAccesoRapido: any;

  constructor(private firestoreService:FirestoreService) {}

  ngOnInit(): void {
    this.firestoreService.TraerUsuarios().subscribe((usuarios:any[]) => {
      const pacientes: any[] = [];
      const especialistas: any[] = [];
      const admins: any[] = [];

      usuarios.forEach((usuario) => {
        if (usuario.perfil === 'Admin') {
          admins.push(usuario);
        } else if (usuario.perfil === 'Especialista') {
          especialistas.push(usuario);
        } else if (usuario.perfil === 'Paciente') {
          pacientes.push(usuario);
        }
      });

      this.listaAccesoRapido = {
        pacientes: pacientes.splice(0,3),
        especialistas: especialistas.splice(0,2),
        admins: admins.splice(0,1),
      }
    })
  }

  clickListado(usuario: any) {
    this.usuarioClickeado.emit(usuario);
  }
}
