import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MyChartService {

  constructor(private http : HttpClient) { }

  info: any;

  new (symbol: string){
    
    var apiKey = 'B9IEWLT09LZ893CO';

    var chartUrl = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol='+symbol+'&market=EUR&interval=5min&apikey=B9IEWLT09LZ893CO'

    return this.http
    .get(chartUrl, {
      responseType: "json",
      observe: 'body' 
    })
  }
}