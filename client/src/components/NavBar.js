import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
  render() {
    return (
      <div className="nav-bar">
        <div className="container">
          <div className="brand-logo">
            <Link to="/">
              <img src="/blacklotus-with-shadow.png" alt="Black Lotus" />
            </Link>
          </div>
          <div className="nav-items">
            <ul className="pull-right" />
            <ul className="pull-left">
              <Link to="/account">
                <li className="nav-item">
                  <i className="icon ion-ios-wallet" /> 0x8a37b7...2830E1{' '}
                  (0.097252 ETH)
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
