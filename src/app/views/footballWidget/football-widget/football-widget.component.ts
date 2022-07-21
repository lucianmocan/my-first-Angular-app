import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FootballWidgetService } from '../football-widget.service'

@Component({
  selector: 'app-football-widget',
  templateUrl: './football-widget.component.html',
  styleUrls: ['./football-widget.component.scss']
})
export class FootballWidgetComponent implements AfterViewInit {

  @Input() league;
  @Input() team;

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

  ngAfterViewInit(): void {
    this.createNewFootballCard(this.div, this.team);

  }

  createNewFootballCard(card, team){
      this.widget.getDataSeasonID(this.league)
      .subscribe(result => {
            
            var query = result['data'].filter(function(result){return result['is_current'] == 1});
            let seasonID = query['0']['season_id'];
            var url = 'https://app.sportdataapi.com/api/v1/soccer/matches?apikey=3ea82800-08c9-11ed-ad06-ab1e69863a69&season_id='+seasonID;
            
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
