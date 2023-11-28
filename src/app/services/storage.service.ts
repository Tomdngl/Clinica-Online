import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage:Storage) { }

  async SubirImagenes(dni:string, archivos:any, perfil:any)
  {
    const urls: string[] = [];

    for (let i = 0; i < archivos.length; i++) {
      const imagenes = archivos[i];
      const nombreImg = `img${i}_${dni}_${Date.now()}_${Math.random()*10}`;
  
      const imgRef = ref(this.storage, `${perfil}/${nombreImg}`);
      await uploadBytes(imgRef, imagenes).then(() => {
        getDownloadURL(imgRef).then(url => {
          urls.push(url)
        })
      })
    }
  
    return urls;
  }
}
