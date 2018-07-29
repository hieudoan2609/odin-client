import React, { Component } from 'react';
import Chart from '../components/Chart';
import Trade from '../components/Trade';
import OrderBook from '../components/OrderBook';

class Market extends Component {
  render() {
    return (
      <div className="Market">
        <div className="row">
          <div className="col-md-8">
            <Chart />
          </div>
          <div className="col-md-4">
            <Trade />
          </div>
        </div>

        <OrderBook />
      </div>
    );
  }
}

export default Market;
