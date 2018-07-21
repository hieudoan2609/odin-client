import React, { Component } from 'react';

class Trade extends Component {
  render() {
    return (
      <div className="Trade">
        <div className="card">
          <div className="order__types">
            <div className="button">Market</div>
            <div className="button">Limit</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Trade;
