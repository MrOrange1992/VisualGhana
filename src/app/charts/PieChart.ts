import{Chart} from 'chart.js';
export class PieChart {

  chart: Chart;
  type: string;

  constructor (context: string, type: string, titleText: string, data: number[], labels: string[], colors: string[]) {
    this.chart = new Chart(context, {
      type: type,
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
          display: true,
          labels: {
            fontColor: 'white'
          }
        },
        title: {
          display: true,
          text: titleText,
          fontColor: 'white'
        }
      }

    });
  }
}

