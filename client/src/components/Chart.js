import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import { connect } from 'react-redux';
import { switchChart } from '../actions';
import { NavLink } from 'react-router-dom';

class Chart extends Component {
  renderChart = () => {
    if (this.props.chart.type === 'price') {
      return <ReactHighstock config={this.props.chart.priceConfig} />;
    }

    return <ReactHighstock config={this.props.chart.depthConfig} />;
  };

  render() {
    return (
      <div className="chart card">
        <div className="chart__nav">
          <div className="outerWrapper">
            <div className="markets">
              <div className="fadeRight" />
              <div className="wrapper">
                <NavLink
                  to="/market/USD_BTC"
                  className={`button ${
                    this.props.location.pathname === '/' ? 'active' : ''
                  }`}
                >
                  USD/BTC
                  <span className="buy">7,410.52</span>
                </NavLink>
                <NavLink to="/market/LTC_BTC" className="button">
                  LTC/BTC
                  <span className="buy">84.73</span>
                </NavLink>
                <NavLink to="/market/XRP_BTC" className="button">
                  XRP/BTC
                  <span className="sell">0.454329</span>
                </NavLink>
                <NavLink to="/market/ETH_BTC" className="button">
                  ETH/BTC
                  <span className="sell">464.74</span>
                </NavLink>
                <NavLink to="/market/XMR_BTC" className="button">
                  XMR/BTC
                  <span className="buy">131.45</span>
                </NavLink>
                <NavLink to="/market/NANO_BTC" className="button">
                  NANO/BTC
                  <span className="buy">2.46</span>
                </NavLink>
                <NavLink to="/market/NEO_BTC" className="button">
                  NEO/BTC
                  <span className="buy">34.66</span>
                </NavLink>
                <NavLink to="/market/NEM_BTC" className="button">
                  NEM/BTC
                  <span className="sell">0.171755</span>
                </NavLink>
                <NavLink to="/market/BCH_BTC" className="button">
                  BCH/BTC
                  <span className="buy">791.82</span>
                </NavLink>
                <NavLink to="/market/EOS_BTC" className="button">
                  EOS/BTC
                  <span className="sell">8.12</span>
                </NavLink>
                <NavLink to="/market/XML_BTC" className="button">
                  XML/BTC
                  <span className="buy">0.289773</span>
                </NavLink>
                <NavLink to="/market/IOT_BTCA" className="button">
                  IOTA/BTC
                  <span className="buy">1.01</span>
                </NavLink>
              </div>
            </div>
          </div>
          <div className="options">
            <div
              className={`button ${
                this.props.chart.type === 'price' ? 'active' : ''
              }`}
              onClick={() => this.props.switchChart('price')}
            >
              Price
            </div>
            <div
              className={`button ${
                this.props.chart.type === 'depth' ? 'active' : ''
              }`}
              onClick={() => this.props.switchChart('depth')}
            >
              Market depth
            </div>
          </div>
        </div>
        {this.renderChart()}
      </div>
    );
  }
}

const mapStateToProps = ({ chart }) => {
  return { chart };
};

export default withRouter(connect(mapStateToProps, { switchChart })(Chart));
