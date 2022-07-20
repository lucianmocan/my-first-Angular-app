import { Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { stocksChartService } from './stocks-chart.service'
import { CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips'
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { ColorsComponent } from '../theme/colors.component';
import { find } from 'rxjs/operators';

@Component({
  selector: 'app-stocks-chart',
  templateUrl: './stocks-chart.component.html',
  styleUrls: ['./stocks-chart.component.scss']
})
export class stocksChartComponent implements OnInit {

  @ViewChild('holding') holding;

  // getting selectedOption from DashboardComponent
  @Input() selectedStock;
  @Input() bgColor; 
  @Input() stockChartType;
  @Input() pointRadius;

  setRadius = 4;
  constructor( public chart : stocksChartService) {}

  stockname: string;
  cryptoChartInfo: string;

  ngAfterViewInit(){
    this.holding.nativeElement.classList.add(this.bgColor);
  }
  ngOnInit(): void {
    this.setRadius = this.pointRadius;
    this.stockname = this.selectedStock;
    this.setColours();
    this.setPointRadius();
    this.displayData();
  }

  setToLine(){
    this.stockChartType = 'line';
    this.setColours();
    this.displayData();
  }

  setToBar(){
    this.stockChartType = 'bar';
    this.setColours();
    this.displayData();
  }
  

  setPointRadius(){
        this.lineChart1Options['elements']['point']['radius']=this.pointRadius;
  }

  setColours(){
    if (this.stockChartType == 'bar'){
      this.lineChart1Colours = [
      {
        backgroundColor: 'red',
        borderColor: 'red',
        pointHoverBackgroundColor: 'red'
        
      },
      {
        backgroundColor: 'green',
        borderColor: 'green',
        pointHoverBackgroundColor: 'green'
      },
      {
        backgroundColor: 'orange',
        borderColor: 'orange',
        pointHoverBackgroundColor: 'orange'
      }
    ]
    return true
  }
   else {
    this.lineChart1Colours = [
      {
        backgroundColor: 'transparent',
        borderColor: 'red',
        pointHoverBackgroundColor: 'red'
        
      },
      {
        backgroundColor: 'transparent',
        borderColor: 'green',
        pointHoverBackgroundColor: 'green'
      },
      {
        backgroundColor: 'transparent',
        borderColor: 'orange',
        pointHoverBackgroundColor: 'orange'
      }
    ]
    return false;
   }
  }

  displayData(){
    this.lineChart1Data1.splice(0,this.lineChart1Data1.length);
    this.lineChart1Data2.splice(0,this.lineChart1Data2.length);
    this.lineChart1Data3.splice(0,this.lineChart1Data3.length);
    this.lineChart1Labels.splice(0,this.lineChart1Labels.length);
    let data = this.chart.new(this.stockname);
    var i = 1;
    data
    .subscribe(result => {
      result['results'].forEach(element => {
        this.cryptoChartInfo = 'Trend this month (' + result['resultsCount']+' records).';
        this.lineChart1Data1.unshift(element['o']);
        this.lineChart1Data2.unshift(element['h']);
        this.lineChart1Data3.unshift(element['c']);
        this.lineChart1Labels.push((i++).toString());
      })
    })
  }

  public lineChart1Data1 : Array<number> = [];
  public lineChart1Data2 : Array<number> = [];
  public lineChart1Data3 : Array<number> = [];
  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: this.lineChart1Data1,
      label: 'open',
    },
    {
      data: this.lineChart1Data2,
      label: 'high'
    },
    {
      data: this.lineChart1Data3,
      label: 'close'
    }
  ];
  public lineChart1Labels: Array<any> = [];
  public lineChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true
      }
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: this.setRadius,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };

  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: 'red',
      pointHoverBackgroundColor: 'red'
      
    },
    {
      backgroundColor: 'transparent',
      borderColor: 'green',
      pointHoverBackgroundColor: 'green'
    },
    {
      backgroundColor: 'transparent',
      borderColor: 'orange',
      pointHoverBackgroundColor: 'orange'
    }
  ];

  public lineChart1Legend = false;

}
