import { Injectable } from '@angular/core';
import {getDownloadURL, getStorage, ref, uploadBytes} from "@angular/fire/storage";

export interface Image{
  url: string,
  data: object
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  readImage(files: FileList | null): Image{
    let response: Image = {url: '', data: {}};
    if (files && files.length > 0) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        if(reader.result && files[0]){
          response.data = files[0];
          response.url = reader.result.toString();
        }
      }
    }
    return response;
  }

  uploadImage(path: string, data: any): Promise<string>{
    const storage = getStorage();
    const storageRef = ref(storage, path);
    return new Promise<string>(resolve => {
      uploadBytes(storageRef, data).then(() => {
        getDownloadURL(storageRef).then((url) => {
          resolve(url)
        })
      });
    })
  }

}
