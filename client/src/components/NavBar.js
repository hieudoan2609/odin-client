import React, { Component } from 'react';

class NavBar extends Component {
  render() {
    return (
      <div className="nav-bar">
        <div className="container">
          <div className="brand-logo">
            <img src="/blacklotus-with-shadow.png" alt="Black Lotus" />
          </div>
          <div className="nav-items">
            <ul className="pull-right" />
            <ul className="pull-left">
              <li className="nav-item">
                <i className="icon ion-ios-wallet" /> 0x8a37b7...2830E1{' '}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
