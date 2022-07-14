import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Utilizator } from './utilizator.model';
import { db } from './app.module';
@Injectable({
  providedIn: 'root'
})
export class UtilizatorService {

  constructor(private firestore: AngularFirestore) { }

  // some methods to work with the database, but I'll work on them later
  // should now focus on how to get the registration form, login form
  // work with the database Firestore.



  //createUser(){
  //  return this.firestore.collection('Utilizatori')
  //}


  /*getUser() {
    return this.firestore.collection('Utilizatori').snapshotChanges();    
  }

  createUser() {
    return this.firestore.collection('Utilizatori').add(Utilizator);
  }

  updateUser() {
    delete Utilizator.id;
    this.firestore.doc('Utilizatori/' + Utilizator.id).update(Utilizator);
  }
  */
}
