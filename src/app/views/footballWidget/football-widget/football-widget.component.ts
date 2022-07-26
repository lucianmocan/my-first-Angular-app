import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FootballWidgetService } from '../football-widget.service'
import { environment } from 'src/environments/environment';

@Component({
  selector: '[app-football-widget].col-sm-6',
  templateUrl: './football-widget.component.html',
  styleUrls: ['./football-widget.component.scss']
})
export class FootballWidgetComponent implements OnInit, AfterViewInit {

  league;
  team;

  @Input() chartData;

  @ViewChild('card') div;

  homeLogo; awayLogo;
  homeLongName;
  homeShortName; awayShortName;

  matchResult;

  homeTeam; awayTeam;
  matchData;
  locationInfo;
  status;
  topLogo;
  matchDate;
  season;

  constructor(public widget: FootballWidgetService) { }

  ngOnInit(): void {
    this.league = this.chartData.league;
    console.log(this.league);
    this.team = this.chartData.team;
    console.log(this.team);

  }

  ngAfterViewInit(): void {
    this.createNewFootballCard(this.div, this.team);

  }

  createNewFootballCard(card, team){
      this.widget.getDataSeasonID(this.league)
      .subscribe(result => {
            
            var query = result['data'].filter(function(result){return result['is_current'] == 1});
            let seasonID = query['0']['season_id'];
            var url = `https://app.sportdataapi.com/api/v1/soccer/matches?apikey=${environment.sportsApi.apiKey}&season_id=${seasonID}`;
            
            this.widget.getDataMatchID(url)
            .subscribe(result => {
              var query = result['data'].filter(function(search){return search['home_team']['name'] == team || search['away_team']['name'] == team});
              var ndQuery = query.filter(function(search){return search['status'] == 'finished'});
              var matchId = ndQuery.pop();
              this.homeTeam = matchId['home_team'];
              this.awayTeam = matchId['away_team'];
              this.homeLogo = this.homeTeam['logo'];
              this.awayLogo = this.awayTeam['logo'];
              this.matchDate = matchId['match_start'].slice(0, 16);
              this.homeLongName = this.homeTeam['name'];
              if (this.homeLongName == team){
                this.topLogo = this.homeLogo;
              }
              else {
                this.topLogo = this.awayLogo;
              }
              this.homeShortName = this.homeTeam['short_code'];
              this.awayShortName = this.awayTeam['short_code'];
              this.matchResult = matchId['stats']['ft_score'];
              this.status = matchId ['status'];
              this.locationInfo = matchId['venue']['name']+". "+matchId['venue']['city'];
              card.nativeElement.style.setProperty('display','block');
              })
            })
  }


}
