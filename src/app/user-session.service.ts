import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable, Observable } from 'rxjs';

@Injectable()

export class UserSessionService {

  constructor(private http: HttpClient) {
    this.getJSON().subscribe();
   }

  localData;
  public getJSON(): Observable<any> {
    this.http.get("./assets/defaultSession.json")
    .subscribe( data => {
      this.localData = data;
      console.log(data);
      
    })
    return this.localData;
  }
}
