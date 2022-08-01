import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

import { DashChart } from '../dashboard/dashChart';
import { FootballWidgetComponent } from './football-widget/football-widget.component';
import { Observable } from 'rxjs';
import { collection, deleteField, doc, getDoc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
import { db } from 'src/app/app.module';

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


  getChartsDefault(id){
    return new DashChart(FootballWidgetComponent,
        { league: 'La Liga', team: 'Real Madrid'},
        id
      )
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

  async clearFromFirestore(name, username, id){
    //* getting reference
    const userRef = collection(db, 'Utilizatori');
    const userFind = query(userRef, where ("username", "==", username), limit(1));
    const querySnap = await getDocs(userFind);

    //* checking and deleting the field with the name id
    querySnap.forEach(async (document) => {
      let docRef = doc(db, 'Utilizatori', document.id, 'userSettings', 'footballInfo');
      let footSnap = await (await getDoc(docRef)).data();
      for (const docNow in footSnap){
        if (docNow == id)
          if (footSnap[docNow]['name'] == name) {
            updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'footballInfo'), {
              [`${docNow}`]: deleteField()
          })    
          }
      }
    })
  }

  async updateOnFirestore(data, username, id){
    const userRef = collection(db, 'Utilizatori');
    const userFind = query(userRef, where ("username", "==", username), limit(1));
    const querySnap = await getDocs(userFind);

    querySnap.forEach(async (document) => {
      let docRef = doc(db, 'Utilizatori', document.id, 'userSettings', 'footballInfo');
      let footSnap = await getDoc(docRef);
      if(footSnap.exists()){
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'footballInfo'), {
            [`${id}`]: {
              league: data.league, 
              team: data.team
            }
        })    
      }
  })

  }

  async storeOnFirestore(info, username, id){
    const userRef = collection(db, 'Utilizatori');
    const userFind = query(userRef, where ("username", "==", username), limit(1));
    const querySnap = await getDocs(userFind);

    querySnap.forEach(async (document) => {
      let docRef = doc(db, 'Utilizatori', document.id, 'userSettings', 'footballInfo');
      let footSnap = await getDoc(docRef);
      if(footSnap.exists()){
        if (JSON.stringify(footSnap.data()) == JSON.stringify({})){
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'footballInfo'), {
            [`${id}`]: {
                league: info.data.league,
                team: info.data.team
              }
          })    
        }
        else {
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'footballInfo'), {
            [`${id}`]: {
              league: info.data.league, 
              team: info.data.team
            }
        })    
        }
      }
  })
  }

}
