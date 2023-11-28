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
}
