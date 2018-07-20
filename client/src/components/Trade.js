import React, { Component } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import { connect } from 'react-redux';
import { populateChart } from '../actions';

class Trade extends Component {
  componentWillMount = () => {
    this.props.populateChart();
  };

  render() {
    return (
      <div className="Trade">
        <div className="row">
          <div className="col-md-8">
            <div className="chart card">
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

export default connect(mapStateToProps, { populateChart })(Trade);
