import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) {

  }

  TraerUsuarios() {
    const collectionUser = this.angularFirestore.collection('usuarios')
    return collectionUser.valueChanges()
  }

  async TraerUsuarioPorEmail(email: string) {
    try {
      const collectionUsers = this.angularFirestore.collection('usuarios');
      const querySnapshot = await collectionUsers.ref.where('email', '==', email).limit(1).get();

      return querySnapshot;
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      throw error;
    }
  }

  setEspecialidad(nombres: any) {
    const documento = this.angularFirestore.doc('especialidades/' + this.angularFirestore.createId());
    const uid = documento.ref.id;

    documento.set({
      uid: uid,
      nombre: nombres
    });
  }

  traerEspecialidades() {
    const collection = this.angularFirestore.collection<any>('especialidades');
    return collection.valueChanges();
  }

  async borrarEspecialidadFirestore(especialidad: string) {
    const collection = this.angularFirestore.collection<any>('especialidades', ref =>
      ref.where('nombre', '==', especialidad)
    );

    collection.get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete().then(() => {
          console.log(`Especialidad "${especialidad}" eliminada de Firestore.`);
        }).catch(error => {
          console.error(`Error al eliminar la especialidad "${especialidad}":`, error);
        });
      });
    });
  }
//Gestion de turnos

  CrearListadoTurnos(turno: any) {
    this.angularFirestore
      .collection<any>('turnos')
      .add(turno)
      .then((data) => {
        this.angularFirestore.collection('turnos').doc(data.id).set({
          id: data.id,
          especialista: turno.especialista,
          turnos: turno.turnos,
        });
      });
  }

  ActualizarListadoTurnos(turno: any) {
    this.angularFirestore
      .doc<any>(`turnos/${turno.id}`)
      .update(turno)
      .then(() => { })
  }

  ObtenerListadoTurnos() {
    const collection = this.angularFirestore.collection<any>('turnos');
    return collection.valueChanges();
  }
}
