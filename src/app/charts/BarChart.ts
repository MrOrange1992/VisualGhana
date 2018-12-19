import{Chart} from 'chart.js';

export class BarChart {

  chart: Chart;
  type: string;

  constructor (context: string, titleText: string, data: number[], labels: string[], colors: any) {
    this.chart = new Chart(context, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          // label: data,
          data: data,
          backgroundColor: colors
        }]
      },
      options: {
        legend: {
          display: false,
          labels: {
            fontColor: 'white'
          }
        },
        title: {
          display: true,
          text: titleText,
          fontColor: 'white'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }

      },
    });
  }
}

