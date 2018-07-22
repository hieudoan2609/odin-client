import React, { Component } from 'react';

class Trade extends Component {
  render() {
    return (
      <div className="Trade">
        <div className="card">
          <div className="order__types">
            <div className="button active">Market</div>
            <div className="button">Limit</div>
          </div>
          <div className="order__body">
            <div className="row">
              <div className="col-4 no-padding">Bid</div>
              <div className="col-8 no-padding">
                <span className="bid">7200</span> USD
              </div>
            </div>
            <div className="row">
              <div className="col-4 no-padding">Ask</div>
              <div className="col-8 no-padding">
                <span className="ask">7400</span> USD
              </div>
            </div>
            <div className="row">
              <div className="col-4 no-padding">Balance</div>
              <div className="col-8 no-padding">
                <span className="balance">18000</span> USD
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Trade;
