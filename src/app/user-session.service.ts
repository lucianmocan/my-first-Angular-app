import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import defaultSession from'./defaultSession.json';
import { Observable } from 'rxjs';

@Injectable()

export class UserSessionService {

  constructor(private http: HttpClient) {
    this.getJSON().subscribe();
   }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/defaultSession.json");
  }
}
