import axios from 'axios';
import moment from 'moment';
import { POPULATE_CHART } from './types';

const INITIAL_CONFIG = {
  series: [
    {
      type: 'candlestick',
      name: 'Price',
      data: [],
      zIndex: 1
    },
    {
      type: 'area',
      name: 'Volume',
      data: [],
      yAxis: 1,
      color: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [[0, 'rgba(20, 91, 209, 1)'], [1, 'rgba(20, 91, 209, 0)']]
      }
    }
  ],
  plotOptions: {
    candlestick: {
      color: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [[0, 'rgba(239, 57, 91, 1)'], [1, 'rgba(239, 57, 91, 0)']]
      },
      lineColor: '#ef395b',
      upColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [[0, 'rgba(39, 214, 138, 1)'], [1, 'rgba(39, 214, 138, 0)']]
      },
      upLineColor: '#27d68a'
    }
  },
  chart: {
    backgroundColor: 'transparent',
    height: '300px'
  },
  credits: {
    enabled: false
  },
  rangeSelector: {
    enabled: false
  },
  scrollbar: {
    enabled: false
  },
  navigator: {
    enabled: false
  },
  tooltip: {
    backgroundColor: 'none',
    borderColor: 'none',
    shadow: false,
    style: {
      color: '#777777'
    },
    useHTML: true,
    formatter: function() {
      const open = this.points[0].point.open;
      const high = this.points[0].point.high;
      const low = this.points[0].point.low;
      const close = this.points[0].point.close;
      const volume = this.points[1].y;
      const date = moment(this.x).format("MMM D'YYYY");
      return `
        <ul style="
          list-style: none;
          background-color: rgba(33, 35, 51, 0.9);
          padding: 10px;
          margin: 0px;
          box-shadow: 0px 5px 15px rgba(1, 1, 1, 0.1);
          border-radius: 5px;
        ">
          <li><b>Date:</b> ${date}</li>
          <li><b>Open:</b> ${open}</li>
          <li><b>High:</b> ${high}</li>
          <li><b>Low:</b> ${low}</li>
          <li><b>Close:</b> ${close}</li>
          <li><b>Volume:</b> ${volume}</li>
        </div>
      `;
    }
  },
  xAxis: {
    lineColor: 'none',
    crosshair: {
      color: '#212333'
    },
    labels: {
      zIndex: -1,
      style: {
        font: '12px Fira Sans, sans-serif',
        color: '#777777'
      }
    },
    tickColor: 'none'
  },
  yAxis: [
    {
      opposite: false,
      labels: {
        style: {
          font: '12px Fira Sans, sans-serif',
          color: '#777777'
        }
      },
      gridLineColor: '#212333',
      gridLineWidth: 1,
      height: '100%'
    },
    {
      labels: {
        enabled: false
      },
      gridLineColor: 'none',
      gridLineWidth: 1,
      top: '0%',
      height: '100%',
      lineColor: 'none'
    }
  ]
};

export const populateChart = () => {
  return async dispatch => {
    const { data } = await axios.get('/aapl-ohlcv.json');
    let ohlc = [];
    let volume = [];
    for (let i = 0; i < data.length; i += 1) {
      ohlc.push([data[i][0], data[i][1], data[i][2], data[i][3], data[i][4]]);

      volume.push([data[i][0], data[i][5]]);
    }
    const config = INITIAL_CONFIG;
    config.series[0].data = ohlc;
    config.series[1].data = volume;
    dispatch({
      type: POPULATE_CHART,
      payload: config
    });
  };
};
