import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  private coinRanking = 'https://api.coinranking.com/v2';
  
  constructor(private http: HttpClient) { }

  
}
