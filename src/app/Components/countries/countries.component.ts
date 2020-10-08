import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateWiseData } from 'src/app/Models/date-wise-data';
import { GlobalDataSummary } from 'src/app/Models/global-data';
import { DataServiceService } from 'src/app/Services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit {
  totalConfirmed = 0;
  totalDeath = 0;
  totalActive = 0;
  totalRecovered = 0;
  dateWiseData;
  countries: string[] = [];
  loading = true;
  dataTable = [];
  selectedCountryData: DateWiseData[];
  data: GlobalDataSummary[];

  chart = {
    LineChart: 'LineChart',
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
    },
  };
  constructor(private service: DataServiceService) {}

  ngOnInit(): void {
    merge(
      this.service.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map((result) => {
          this.data = result;
          this.data.forEach((cs) => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValue('India');
        this.loading = false;
      },
    });
  }

  updateValue(country: string) {
    // console.log(country);
    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.totalConfirmed = cs.confirmed;
        this.totalDeath = cs.deaths;
        this.totalActive = cs.active;
        this.totalRecovered = cs.recovered;
      }
    });
    this.selectedCountryData = this.dateWiseData[country];
    this.updateChart();
    // console.log(this.selectedCountryData);
  }

  updateChart() {
    this.dataTable = [];
    // this.dataTable.push(['Date', 'Cases']);
    // console.log(this.selectedCountryData);
    this.selectedCountryData.forEach((cs) => {
      this.dataTable.push([cs.date, cs.cases]);
    });
  }
}
