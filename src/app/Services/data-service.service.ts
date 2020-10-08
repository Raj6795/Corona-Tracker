import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DateWiseData } from '../Models/date-wise-data';
import { GlobalDataSummary } from '../Models/global-data';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  currentDate: Date = new Date();

  public globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/10-07-2020.csv`;
  public dateWiseDataURL = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;

  constructor(private http: HttpClient) {}

  getDateWiseData() {
    return this.http.get(this.dateWiseDataURL, { responseType: 'text' }).pipe(
      map((result) => {
        let rows = result.split('\n');
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach((row) => {
          let cols = row.split(/,(?=\S)/);
          let con = cols[1];
          cols.splice(0, 4);
          // console.log(con, cols);
          mainData[con] = [];
          cols.forEach((value, index) => {
            let dw: DateWiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[index])),
            };
            mainData[con].push(dw);
          });
        });
        // console.log(this.currentDate.toISOString());
        return mainData;
      })
    );
  }
  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        let data: GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0, 1);
        // console.log(rows);
        rows.forEach((row) => {
          let cols = row.split(/,(?=\S)/);
          // console.log(cols);
          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };
          let temp: GlobalDataSummary = raw[cs.country];
          if (temp) {
            temp.active += cs.active;
            temp.confirmed += cs.confirmed;
            temp.recovered += cs.recovered;
            temp.deaths += cs.deaths;

            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }
        });

        // console.log(raw);
        return <GlobalDataSummary[]>Object.values(raw);
      })
    );
  }
}
