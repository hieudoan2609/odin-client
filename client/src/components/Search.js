import React, { Component } from 'react';

class Search extends Component {
  render() {
    return (
      <div className="Search">
        <div className="card">
          <div className="input-field">
            <i className="icon ion-ios-search prefix" />
            <input id="search" type="text" autoComplete="off" />
            <label htmlFor="search">Search</label>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
