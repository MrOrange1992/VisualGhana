import{Chart} from 'chart.js';
export class PieChart {

  chart: Chart;
  type: string;
  styles: object;

  constructor (titleText: string, context: string, data: number[], labels: string[], colors: string[])
  {
    this.chart = new Chart(context, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: "",
          data: data,
          backgroundColor: colors
        }]
      },
      options: {
        legend: {
          display: true,
          labels: {
            fontColor: 'rgb(255,255,255)'
          }
        },
        title: {
          display: true,
          text: "My first Piechart",
          fontColor: '#28536C'
        }
      }

    });
  }
}

