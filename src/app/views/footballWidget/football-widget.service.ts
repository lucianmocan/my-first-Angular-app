import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

import { DashChart } from '../dashboard/dashChart';
import { FootballWidgetComponent } from './football-widget/football-widget.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FootballWidgetService implements OnInit{

  ngOnInit(){
    
  }
  constructor(
    private http: HttpClient) { }

  // englandID = "42"; spainID = "113";
  premierLeagueID = '237'; laligaID = '538';

  url = environment.sportsApi.url+environment.sportsApi.apiKey;
    
  getDataSeasonID(league) {

    if (league == 'Premier League')
      this.url +='&league_id='+this.premierLeagueID;
    else
    if (league == 'La Liga')
      this.url +='&league_id='+this.laligaID;

    return this.http
    .get(this.url, 
      {
        responseType:'json',
        observe: 'body'
      })
      
  }

  getDataMatchID(url){
    return this.http
               .get(url,
                {
                  responseType: 'json',
                  observe: 'body'
                })
  }

  getCharts() {
    this.charts = [];
    this.getJSON()
    .subscribe( data => {
      this.getChartsProcess(data);
    })
    return this.charts;
    
  }


  charts : DashChart[] = [];
  getChartsProcess(data){
    let tmp = data['footballInfo']['elements'];
    for (const element in tmp){
        let crt = new DashChart(FootballWidgetComponent,{
          league: tmp[element]['league'],
          team: tmp[element]['team']
        },
        element)
        this.charts.push(crt);
    }
  }

  getChartsFromFirestore(data){
    this.charts = [];
    for (const element in data){
        let crt = new DashChart(FootballWidgetComponent,{
          league: data[element]['league'],
          team: data[element]['team']
        },
        element)
        this.charts.push(crt);
    }
  }

  localData;
  public getJSON(): Observable<any> {
    return this.http.get("../../../../assets/defaultSession.json");
  }

}
