import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class cryptoChartService {

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

  

  new (symbol: string, selUrl: string){
    
    var apiKey1 = 'B9IEWLT09LZ893CO';
    var apiKey4 = '1EATG6FH0JYICSWH';

    var apiKey2 = 'P5SCW3RT1FCREPLB';
    var apiKey3 = '6SODH35P84IDVOAS';

    var chartUrl :string;

    if (selUrl == 'Url1'){
      chartUrl = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol='+symbol+'&market=EUR&interval=5min&apikey='+apiKey1;

    }
    else if (selUrl == 'Url2'){
      chartUrl = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol='+symbol+'&market=EUR&interval=5min&apikey='+apiKey2;
    }
    else if (selUrl == 'Url3'){
      chartUrl = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol='+symbol+'&market=EUR&interval=5min&apikey='+apiKey3;
    }

    return this.http
    .get(chartUrl, {
      responseType: "json",
      observe: 'body' 
    });

    

  }
}