import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { cryptoChartComponent } from './crypto-chart.component';
import { DashChart } from '../dashboard/dashChart';
import { Observable } from 'rxjs';
import { collection, query, where, limit, getDocs, doc, updateDoc, getDoc, deleteField, arrayRemove } from 'firebase/firestore';
import { db } from 'src/app/app.module';

@Injectable({
  providedIn: 'root'
})
export class cryptoChartService {

  constructor(private http : HttpClient,
              ) {}

  info: any;

  d = new Date();
  day = this.d.getUTCDate();
  month = (this.d.getMonth()+1).toString();
  year = this.d.getFullYear().toString();



  dateFormatMonth (date: string) {
    let month = date.slice(5,7);
    return month;
  }

  dateFormatYear (date: string) {
    let year = date.slice(0,4);
    return year;
  }

  dateFormatDay (date: string) {
    let day = date.slice(8,10);
    return day;
  }

  dateFormat (date: string) {
    let day = date.slice(8,10);
    let month = date.slice(5,7);
    let year = date.slice(0,4);
    return day+"."+month+"."+year;
  }

  

  new (symbol: string){

    var chartUrl :string;

    chartUrl = environment.cryptoApi.url
              +symbol+
              environment.cryptoApi.range+
              environment.cryptoApi.apiKey;

    return this.http
    .get(chartUrl, {
      responseType: "json",
      observe: 'body' 
    });

    

  }


  getChartsDefault(id){
    return new DashChart(cryptoChartComponent,
        { name: 'BTC', borderColor: 'bg-primary'},
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

  getChartsFromFirestore(data){
    this.charts = [];
    for (const element in data){
        let crt = new DashChart(cryptoChartComponent,{
          name: data[element]['name'],
          borderColor: data[element]['borderColor']
        },
        element)
        this.charts.push(crt);
    }
  }


  charts : DashChart[];

  getChartsProcess(data){
    let tmp = data['largeDiagram']['elements'];
    for (const element in tmp){
        let crt = new DashChart(cryptoChartComponent,{
          name: tmp[element]['name'],
          borderColor: tmp[element]['borderColor'],
 
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
      let docRef = doc(db, 'Utilizatori', document.id, 'userSettings', 'largeDiagram');
      let cryptoSnap = await (await getDoc(docRef)).data();
      for (const docNow in cryptoSnap){
        if (docNow == id)
          if (cryptoSnap[docNow]['name'] == name) {
            updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'largeDiagram'), {
              [`${docNow}`]: deleteField()
          })    
          }
      }
    })
  }

  async storeOnFirestore(info, username, id){
    const userRef = collection(db, 'Utilizatori');
    const userFind = query(userRef, where ("username", "==", username), limit(1));
    const querySnap = await getDocs(userFind);

    querySnap.forEach(async (document) => {
      let docRef = doc(db, 'Utilizatori', document.id, 'userSettings', 'largeDiagram');
      let cryptoSnap = await getDoc(docRef);
      if(cryptoSnap.exists()){
        if (JSON.stringify(cryptoSnap.data()) == JSON.stringify({})){
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'largeDiagram'), {
            [`${id}`]: {name: info['data']['name'], borderColor: info['data']['borderColor']}
        })    
        }
        else {
          console.log('been in here');
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'largeDiagram'), {
            [`${id}`]: {name: info['data']['name'], borderColor: info['data']['borderColor']}
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
      let docRef = doc(db, 'Utilizatori', document.id, 'userSettings', 'largeDiagram');
      let cryptoSnap = await getDoc(docRef);
      if(cryptoSnap.exists()){
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'largeDiagram'), {
            [`${id}`]: {name: data.name, borderColor: data.borderColor}
        })    
      }
  })

  }
}