import{Chart} from 'chart.js';

export class LineChart {

  chart: Chart;
  type: string;

  constructor (context: string, titleText: string, data: number[], labels: string[], colors: any) {
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
        }
      }

    });
  }
}

