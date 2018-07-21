import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from './components/NavBar';
import Trade from './components/Trade';
import Loading from './components/Loading';
import { populatePriceChart, populateDepthChart } from './actions';

class App extends Component {
  componentWillMount = () => {
    this.props.populatePriceChart();
    this.props.populateDepthChart();
  };

  render() {
    if (this.props.trade.priceLoading || this.props.trade.depthLoading) {
      return <Loading />;
    }

    return (
      <div className="App">
        <NavBar />
        <div className="container">
          <Trade />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ trade }) => {
  return { trade };
};

export default connect(mapStateToProps, {
  populatePriceChart,
  populateDepthChart
})(App);
