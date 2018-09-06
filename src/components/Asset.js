import React, { Component } from "react";
import Modal from "./Modal";

class Asset extends Component {
	render() {
		return (
			<div className="Asset">
				<Modal name="Ethereum" symbol="ETH" type="deposit" />
				<Modal name="Ethereum" symbol="ETH" type="withdraw" />

				<div className="card">
					<p className="title">
						{this.props.name}
						<span>({this.props.symbol})</span>
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
							<div className="value">
								{this.props.availableBalance + this.props.reserveBalance}
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-6">
							<div className="title">Available</div>
							<div className="value">{this.props.availableBalance}</div>
						</div>
						<div className="col-6">
							<div className="title">In Orders</div>
							<div className="value">{this.props.reserveBalance}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

// const mapStateToProps = ({ contract }) => {
// 	return { contract };
// };

// const mapFunctionsToProps = {
// 	getChartData
// };

export default Asset;
