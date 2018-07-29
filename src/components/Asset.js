import React, { Component } from 'react';
import Modal from './Modal';

class Asset extends Component {
  render() {
    return (
      <div className="Asset">
        <Modal name="Ethereum" symbol="ETH" type="deposit" />
        <Modal name="Ethereum" symbol="ETH" type="withdraw" />

        <div className="card">
          <p className="title">
            Ethereum<span>(ETH)</span>
          </p>
          <p className="subtitle">
            <span className="modal-trigger" href="#deposit">
              Deposit
            </span>
            <span className="modal-trigger" href="#withdraw">
              Withdraw
            </span>
          </p>

          <div className="row">
            <div className="col-12">
              <div className="title">Total Balance</div>
              <div className="value">0.18946627</div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="title">Available</div>
              <div className="value">0.18946627</div>
            </div>
            <div className="col-6">
              <div className="title">In Orders</div>
              <div className="value">0</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Asset;
