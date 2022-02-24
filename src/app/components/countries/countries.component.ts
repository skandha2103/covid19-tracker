import { Component, OnInit } from '@angular/core';
import { DateWiseData } from 'src/app/models/date-wise-data'; 
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { ChartType } from "angular-google-charts";
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  dateWiseData;
  datatable = [];
  loading = true;
  selectedCountryData: DateWiseData[];
  chart = {
    LineChart : ChartType.LineChart, 
    height: 500, 
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }  
  }

  constructor(private service:DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ), 
      this.service.getGlobalData().pipe(map(result=>{
        this.data = result;
        this.data.forEach(cs=>{
          this.countries.push(cs.country)
        })
      }))
    ).subscribe(
      {
        complete : ()=>{
         this.updateValues('India')
         this.loading = false;
        }
      }
    )

  }

  updateChart(){
    // this.datatable.push(["Date" , 'Cases'])
    this.selectedCountryData.forEach(cs=>{
      this.datatable.push([cs.date , cs.cases])
    })
    // console.log(this.datatable);
    
  }

  updateValues(country:string){
    // console.log(country);
    this.data.forEach(cs=>{
      if(country == cs.country){
        this.totalConfirmed = cs.confirmed
        this.totalActive = cs.active
        this.totalDeaths = cs.deaths
        this.totalRecovered = cs.recovered
      }
    })

    this.selectedCountryData = this.dateWiseData[country]
    console.log(this.selectedCountryData);
    this.updateChart();

  }

}
