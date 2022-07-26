import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { cryptoChartComponent } from './crypto-chart.component';
import { DashChart } from '../dashboard/DashChart';
import { Observable } from 'rxjs';

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


  getCharts1(){
    return [
        new DashChart(cryptoChartComponent,
        { name: 'ETH', borderColor: 'bg-dark'}
      ),
        new DashChart(cryptoChartComponent,
        { name: 'BTC', borderColor: 'bg-primary'}
      )
    ]
  }

  getCharts() {
    this.getJSON()
    .subscribe( data => {
      this.getChartsProcess(data);
    })
    return this.charts;
    
  }


  charts : DashChart[] = [];
  getChartsProcess(data){
    let tmp = data['largeDiagram']['elements'];
    for (const element in tmp){
        let crt = new DashChart(cryptoChartComponent,{
          name: tmp[element]['name'],
          borderColor: tmp[element]['borderColor']
        })
        this.charts.push(crt);
    }
  }

  localData;
  public getJSON(): Observable<any> {
    return this.http.get("../../../../assets/defaultSession.json");
  }

  // getChartsByDefault {
  // }

}