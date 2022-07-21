import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


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


  url = 'https://app.sportdataapi.com/api/v1/soccer/seasons?apikey=3ea82800-08c9-11ed-ad06-ab1e69863a69';

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
}
