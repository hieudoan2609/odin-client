import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class Chart extends Component {
  renderChart = () => {
    return <ReactHighstock config={this.props.chart.priceConfig} />;
  };

  renderPairs = () => {
    return this.props.pair.pairs.map((pair, i) => {
      const [cntr, base] = pair.split('_');
      return (
        <NavLink
          to={`/market/${pair}`}
          className={`button ${
            this.props.location.pathname === pair ||
            (this.props.location.pathname === '/' && i === 0)
              ? 'active'
              : ''
          }`}
          key={i}
        >
          {base}/{cntr}
          <span className="buy">7,410.52</span>
        </NavLink>
      );
    });
  };

  render() {
    return (
      <div className="Chart card">
        <div className="chart__nav">
          <div className="outerWrapper">
            <div className="markets">
              <div className="fadeRight" />
              <div className="wrapper">{this.renderPairs()}</div>
            </div>
          </div>
        </div>
        {this.renderChart()}
      </div>
    );
  }
}

const mapStateToProps = ({ chart, pair }) => {
  return { chart, pair };
};

export default withRouter(connect(mapStateToProps)(Chart));
