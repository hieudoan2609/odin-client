import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import { connect } from 'react-redux';
import { switchChart } from '../actions';
import { NavLink } from 'react-router-dom';

class Trade extends Component {
  renderChart = () => {
    if (this.props.trade.chart === 'price') {
      return <ReactHighstock config={this.props.trade.priceConfig} />;
    }

    return <ReactHighstock config={this.props.trade.depthConfig} />;
  };

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
                      <NavLink to="/market/BTC_USD" className="button">
                        BTC/USD
                      </NavLink>
                      <NavLink to="/market/BTC_LTC" className="button">
                        BTC/LTC
                      </NavLink>
                      <NavLink to="/market/BTC_XRP" className="button">
                        BTC/XRP
                      </NavLink>
                      <NavLink to="/market/BTC_ETH" className="button">
                        BTC/ETH
                      </NavLink>
                      <NavLink to="/market/BTC_XMR" className="button">
                        BTC/XMR
                      </NavLink>
                      <NavLink to="/market/BTC_NANO" className="button">
                        BTC/NANO
                      </NavLink>
                      <NavLink to="/market/BTC_NEO" className="button">
                        BTC/NEO
                      </NavLink>
                      <NavLink to="/market/BTC_NEM" className="button">
                        BTC/NEM
                      </NavLink>
                      <NavLink to="/market/BTC_BCH" className="button">
                        BTC/BCH
                      </NavLink>
                      <NavLink to="/market/BTC_EOS" className="button">
                        BTC/EOS
                      </NavLink>
                      <NavLink to="/market/BTC_XML" className="button">
                        BTC/XML
                      </NavLink>
                      <NavLink to="/market/BTC_IOTA" className="button">
                        BTC/IOTA
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="options">
                  <div
                    className={`button ${
                      this.props.trade.chart === 'price' ? 'active' : ''
                    }`}
                    onClick={() => this.props.switchChart('price')}
                  >
                    Price
                  </div>
                  <div
                    className={`button ${
                      this.props.trade.chart === 'depth' ? 'active' : ''
                    }`}
                    onClick={() => this.props.switchChart('depth')}
                  >
                    Market depth
                  </div>
                </div>
              </div>
              {this.renderChart()}
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

export default withRouter(connect(mapStateToProps, { switchChart })(Trade));
