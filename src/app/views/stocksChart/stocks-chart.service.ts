import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { DashChart } from '../dashboard/dashChart';
import { stocksChartComponent } from './stocks-chart.component';
import { collection, deleteField, doc, getDoc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
import { db } from 'src/app/app.module';


@Injectable({
  providedIn: 'root'
})
export class stocksChartService {

  constructor(private http : HttpClient) { }

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

  new (selectedStocks: string){
    

    var chartUrl :string;
   
    chartUrl = environment.stockApi.url+
              selectedStocks+
              environment.stockApi.range+
              environment.stockApi.apiKey;

    return this.http
    .get(chartUrl, {
      responseType: "json",
      observe: 'body' 
    })
    
  }

  getChartsDefault(id){
    return new DashChart(stocksChartComponent,
        { name: 'AAPL',
          bgcolor: 'bg-primary',
          pointRadius: 2,
          type: 'line'
        },
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


  charts : DashChart[];
  getChartsProcess(data){
    let tmp = data['stockDiagram']['elements'];
    for (const element in tmp){
        let crt = new DashChart(stocksChartComponent,{
          name: tmp[element]['name'],
          type: tmp[element]['type'],
          pointRadius: tmp[element]['pointRadius'],
          bgcolor: tmp[element]['bgcolor']
        },
        element)
        this.charts.push(crt);
    }
  }

  getChartsFromFirestore(data){
    this.charts = [];
    for (const element in data){
        let crt = new DashChart(stocksChartComponent,{
          name: data[element]['name'],
          type: data[element]['type'],
          pointRadius: data[element]['pointRadius'],
          bgcolor: data[element]['bgcolor']
        },
        element)
        this.charts.push(crt);
    }
  }


  async clearFromFirestore(name, username, id){
    //* getting reference
    const userRef = collection(db, 'Utilizatori');
    const userFind = query(userRef, where ("username", "==", username), limit(1));
    const querySnap = await getDocs(userFind);

    //* checking and deleting the field with the name id
    querySnap.forEach(async (document) => {
      let docRef = doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram');
      let stockSnap = await (await getDoc(docRef)).data();
      for (const docNow in stockSnap){
        if (docNow == id)
          if (stockSnap[docNow]['name'] == name) {
            updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram'), {
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
      let docRef = doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram');
      let stockSnap = await getDoc(docRef);
      if(stockSnap.exists()){
        if (JSON.stringify(stockSnap.data()) == JSON.stringify({})){
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram'), {
            [`${id}`]: {
                name: info.data.name, 
                bgcolor: info.data.bgcolor,
                pointRadius : info.data.pointRadius,
                type: info.data.type
              }
        })    
        }
        else {
          console.log('been in here');
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram'), {
            [`${id}`]: {
              name: info.data.name, 
              bgcolor: info.data.bgcolor,
              pointRadius : info.data.pointRadius,
              type: info.data.type
            }
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
      let docRef = doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram');
      let cryptoSnap = await getDoc(docRef);
      if(cryptoSnap.exists()){
          updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram'), {
            [`${id}`]: {
              name: data.name, 
              bgcolor: data.bgcolor, 
              type: data.type,
              pointRadius: data.pointRadius
            }
        })    
      }
  })

  }

  async switchPlaces(charts, username){
    const userRef = collection(db, 'Utilizatori');
    const userFind = query(userRef, where ("username", "==", username), limit(1));
    const querySnap = await getDocs(userFind);

    querySnap.forEach(async (document) => {
      let docRef = doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram');
      let cryptoSnap = await getDoc(docRef);
      if(cryptoSnap.exists()){
          for (const elem in charts){
            updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram'), {
              [`${charts[elem].instance.id}`]: charts[elem].instance.chartData
          })  
          } 
        } 
  
        //   updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram'), {
        //     [`${chart1.instance.id}`]: chart1.instance.chartData
        // })    
        //   updateDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram'), {
        //     [`${chart2.instance.id}`]: chart2.instance.chartData
        // })    
  })
    
  }

  tickers = [];
  getTickersNASDAQ(){
    this.tickers = [];
    this.http.get("https://dumbstockapi.com/stock?format=tickers-only&exchange=NASDAQ")
        .subscribe((data) => {
          for (const element in data) {
            this.tickers.push(data[element]);
          }
        })
  }

  localData;
  public getJSON(): Observable<any> {
    return this.http.get("../../../../assets/defaultSession.json");
  }
}