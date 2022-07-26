import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { DashChart } from '../dashboard/DashChart';
import { stocksChartComponent } from './stocks-chart.component';


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

  getCharts() {
    this.getJSON()
    .subscribe( data => {
      this.getChartsProcess(data);
    })
    return this.charts;
    
  }


  charts : DashChart[] = [];
  getChartsProcess(data){
    let tmp = data['stockDiagram']['elements'];
    for (const element in tmp){
        let crt = new DashChart(stocksChartComponent,{
          name: tmp[element]['name'],
          type: tmp[element]['type'],
          pointRadius: tmp[element]['pointRadius'],
          bgcolor: tmp[element]['bgcolor']
        })
        this.charts.push(crt);
    }
  }

  localData;
  public getJSON(): Observable<any> {
    return this.http.get("../../../../assets/defaultSession.json");
  }
}