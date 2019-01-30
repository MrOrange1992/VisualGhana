import{Chart} from 'chart.js';

export class BarChart {

  chart: Chart;
  type: string;

  constructor (context: string, titleText: string, data: number[], labels: string[], colors: any, xAxisLabel: string, yAxisLabel: string) {
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
          xAxes: [{
            ticks: {
              fontColor: "white"
            },
            scaleLabel: {
              display: true,
              labelString: xAxisLabel,
              fontColor: 'white'
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: "white",

              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: yAxisLabel,
              fontColor: 'white'
            }
          }]
        }

      },
    });
  }
}

