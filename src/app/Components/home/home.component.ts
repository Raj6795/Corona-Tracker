import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/Models/global-data';
import { DataServiceService } from 'src/app/Services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalDeath = 0;
  totalActive = 0;
  totalRecovered = 0;
  loading = true;
  globalData: GlobalDataSummary[];
  chart = {
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true,
    },
  };
  datatable = [];

  constructor(private dataService: DataServiceService) {}

  initChart(caseType: string) {
    // this.datatable.push(['Country', 'Cases']);
    this.datatable = [];

    this.globalData.forEach((cs) => {
      let value: number;
      if (caseType === 'c') if (cs.confirmed > 1000) value = cs.confirmed;

      if (caseType === 'a') if (cs.deaths > 1000) value = cs.active;

      if (caseType === 'd') if (cs.active > 1000) value = cs.deaths;

      if (caseType === 'r') if (cs.recovered > 1000) value = cs.recovered;

      this.datatable.push([cs.country, value]);
    });
  }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        // console.log(result);
        this.globalData = result;
        result.forEach((cs) => {
          if (!isNaN(cs.confirmed)) {
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalRecovered += cs.recovered;
            this.totalDeath += cs.deaths;
          }
        });
        this.initChart('a');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value);
  }
}
