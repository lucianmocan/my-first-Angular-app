import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';

import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ProfileComponent } from './profile.component';
import { app } from 'src/app/app.module';
import { storage } from 'src/app/app.module';
import { DataService } from 'src/app/data.service';


@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  constructor(
      private routes: Router
      ) { }

  profileImage;
  imagesRef = ref(storage, '/images/userProfile/');

  uploadProfileImage(name, file){
  let imageName = name.toString()+'.jpg';
  let userImageRef = ref(this.imagesRef, imageName);
  console.log(file);
  uploadBytes(userImageRef, file)
    .then((snapshot) => {
      console.log('uploaded a file');
    })
  }

  async downloadProfileImage(name){
    let imageName = name.toString()+'.jpg';
    let userImageRef = ref(this.imagesRef, imageName);
    getDownloadURL(userImageRef)
      .then((url) => {
        this.profileImage = url;
        console.log(this.profileImage);
      })
    return this.profileImage;
  }
}
