import React, { Component } from 'react';

class Table extends Component {
  state = {
    cols: []
  };

  componentWillMount = () => {
    const cols = Object.keys(this.props.data[0]);
    console.log(cols);
  };

  renderCols = () => {};

  render() {
    return (
      <div className="Table">
        <div className="card px-4 py-4">
          <div className="head">
            <div className="title">{this.props.title}</div>
            <div className="subtitle">{this.props.subtitle}</div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th />
                  <th scope="col">Price</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Total</th>
                  <th scope="col">Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
