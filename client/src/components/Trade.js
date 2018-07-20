import React, { Component } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import { connect } from 'react-redux';

class Trade extends Component {
  render() {
    return (
      <div className="Trade">
        <div className="row">
          <div className="col-md-8">
            <div className="chart card">
              <div className="chart__nav">
                <div className="outerWrapper">
                  <div className="markets">
                    <div className="fadeRight" />
                    <div className="wrapper">
                      <div className="button active">BTC/USD</div>
                      <div className="button">BTC/LTC</div>
                      <div className="button">BTC/XRP</div>
                      <div className="button">BTC/ETH</div>
                      <div className="button">BTC/XMR</div>
                      <div className="button">BTC/NANO</div>
                      <div className="button">BTC/NEO</div>
                      <div className="button">BTC/NEM</div>
                      <div className="button">BTC/BCH</div>
                      <div className="button">BTC/EOS</div>
                      <div className="button">BTC/XML</div>
                      <div className="button">BTC/IOTA</div>
                    </div>
                  </div>
                </div>
                <div className="options">
                  <div className="button active">Price</div>
                  <div className="button">Market depth</div>
                </div>
              </div>
              <ReactHighstock config={this.props.trade.config} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">Trade</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ trade }) => {
  return { trade };
};

export default connect(mapStateToProps)(Trade);
