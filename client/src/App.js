import React, { Component } from 'react';
import NavBar from './components/NavBar';
import Trade from './components/Trade';

class App extends Component {
  render() {
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

export default App;
