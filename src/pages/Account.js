import React, { Component } from 'react';
import Search from '../components/Search';
import Asset from '../components/Asset';
import M from 'materialize-css/dist/js/materialize.min.js';

class Account extends Component {
  componentDidMount = () => {
    M.AutoInit();
  };

  render() {
    return (
      <div className="MyAccount">
        <div className="row">
          <div className="col-12">
            <Search />
          </div>
        </div>

        <div className="assets">
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
            <div className="col-md-6 col-lg-3">
              <Asset />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Account;
