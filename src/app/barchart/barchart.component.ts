import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {

  chartData = [];
  dateArr = [];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
  };
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [], label : ''}
  ];

  isDateChart :boolean = true;

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
      this.http.get('./assets/charts.json').subscribe((res:any) => {
        this.dateArr = res.metrics.reduce( (a,b) => {
          let i = a.findIndex( x => x.date === b.date);
          return i === -1 ? a.push({ date : b.date, data : [{ speed :b.speed , 'roadType' : b['road-type']}] }) : a[i].data.push({ speed :b.speed , 'roadType' : b['road-type']}), a;
        }, []);
        this.initiateDateChart();
      })
  }

  initiateDateChart() {
    this.isDateChart = true;
    //Calculate Speed Average for each date
    this.chartData = this.dateArr.map(data => {
       return Math.floor((data.data.reduce((a,b) => 
         ( a>0 && !!a ? a+b.speed : 0 + b.speed)
       ))/this.dateArr.length)}
       );

    this.barChartData = [{data : this.chartData, label : ''}];
    this.barChartLabels = this.dateArr.map(data => data.date);
  }

  initiateWayChart(e) {
    if(e.active.length > 0 && this.isDateChart) {
      this.isDateChart = false;
      //Get the selected Chart bar index
      let index = e.active[0]._index;

      //Get distinguished chart data
      let arr = this.dateArr[index].data.reduce( (a,b) => {
        let i = a.findIndex( x => x.roadType === b.roadType);
        return i === -1 ? a.push({ roadType : b.roadType, data : [b.speed] }) : a[i].data.push(b.speed), a;
      }, []);

      //Calculate Speed average for Each way specific to the selected date.
      this.chartData = arr.map(road => {
        return Math.floor((road.data.reduce((a,b) => a+b))/road.data.length )
      })

      this.barChartLabels = arr.map(road => road.roadType);
      this.barChartData = [{data : this.chartData, label :this.dateArr[index].date}] ;
  }
}



}
