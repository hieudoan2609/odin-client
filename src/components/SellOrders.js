import React, { Component } from 'react';
import { connect } from 'react-redux';

class SellOrders extends Component {
  renderOrders = () => {
    return this.props.orderBook.sellOrders.map((order, i) => {
      return (
        <tr key={i}>
          <td>{order.price}</td>
          <td>{order.amount}</td>
          <td>{order.total}</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="SellOrders">
        <div className="card px-4 py-4">
          <div className="head">
            <div className="title">
              <div className="icon sell" />
              Sell orders
            </div>
            <div className="subtitle">Total: 696969 BTC</div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Price</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>{this.renderOrders()}</tbody>
            </table>
          </div>
          <div className="fadeBottom" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ orderBook }) => {
  return { orderBook };
};

export default connect(mapStateToProps)(SellOrders);
