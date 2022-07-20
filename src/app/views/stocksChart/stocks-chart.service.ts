import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

    chartUrl = 'https://api.polygon.io/v2/aggs/ticker/'+selectedStocks+'/range/1/day/2022-07-01/2022-07-20?adjusted=true&sort=asc&limit=120&apiKey=6JayVWjW8q_0vh_T6AIMd8OZsLLmrAdd'

    return this.http
    .get(chartUrl, {
      responseType: "json",
      observe: 'body' 
    })
    
  }
}