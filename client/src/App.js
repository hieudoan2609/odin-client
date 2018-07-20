import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from './components/NavBar';
import Trade from './components/Trade';
import Loading from './components/Loading';
import { populateChart } from './actions';

class App extends Component {
  componentWillMount = () => {
    this.props.populateChart();
  };

  render() {
    if (this.props.trade.loading) {
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

export default connect(mapStateToProps, { populateChart })(App);
