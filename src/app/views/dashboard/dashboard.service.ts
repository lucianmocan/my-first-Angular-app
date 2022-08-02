import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { collection, getDocs, query, where, limit, doc, getDoc } from 'firebase/firestore';
import { db } from 'src/app/app.module';
import { cryptoChartService } from '../cryptoChart/crypto-chart.service';
import { FootballWidgetService } from '../footballWidget/football-widget.service';
import { stocksChartService } from '../stocksChart/stocks-chart.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private cryptoChartService: cryptoChartService,
    private stocksChartService: stocksChartService,
    private footballWidgetService: FootballWidgetService
  ) { }

  async getUserSettings(givenAccessT, username){
      const userRef = collection(db, 'Utilizatori');
      const userFind = query(userRef, where ("username", "==", username), limit(1));
      const querySnap = await getDocs(userFind);

      querySnap.forEach(async (document) => {
        // need to check if it works alright
        let getAccessT = document.data()['accessToken'];
        // if (getAccessT == givenAccessT) {
          let cryptoSnap =  (await getDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'largeDiagram'))).data();
          this.cryptoChartService.getChartsFromFirestore(cryptoSnap);

          let stocksSnap =  (await getDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'stockDiagram'))).data();
          this.stocksChartService.getChartsFromFirestore(stocksSnap);

          let footSnap =  (await getDoc(doc(db, 'Utilizatori', document.id, 'userSettings', 'footballInfo'))).data();
          this.footballWidgetService.getChartsFromFirestore(footSnap);

        })

        // else {
        //   console.log("Error. Unauthorized request");
        // }
  }

  async clearFromFirestoreCrypto(name, username, id){
    await this.cryptoChartService.clearFromFirestore(name, username, id);
  }

  async clearFromFirestoreStock(name, username, id){
    await this.stocksChartService.clearFromFirestore(name, username, id);
  }

  async clearFromFirestoreFootball(name, username, id){
    await this.footballWidgetService.clearFromFirestore(name, username, id);
  }

}
