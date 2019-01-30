import{Chart} from 'chart.js';

export class LineChart {

  chart: Chart;
  type: string;

  constructor (context: string, titleText: string, data: number[], labels: string[], colors: any, xAxisLabel: string, yAxisLabel: string) {
    this.chart = new Chart(context, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
           //label: labels,
          data: data,
         borderColor: colors
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
          fontColor: 'white',
          strokeWeight: 2
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: "white",
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
      }

    });
  }
}

