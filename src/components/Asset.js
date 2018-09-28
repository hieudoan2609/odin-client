import React, { Component } from "react";
import Modal from "./Modal";
import { connect } from "react-redux";
import { round } from "../helpers";

class Asset extends Component {
	renderOverlay() {
		if (!this.props.exchange.user) {
			return (
				<div className="unavailable">
					<p>Please log in to view this asset.</p>
				</div>
			);
		}
	}

	render() {
		return (
			<div className="Asset">
				<Modal
					name={this.props.name}
					symbol={this.props.symbol}
					type="deposit"
					id={`deposit-${this.props.symbol}`}
				/>
				<Modal
					name={this.props.name}
					symbol={this.props.symbol}
					type="withdraw"
					id={`withdraw-${this.props.symbol}`}
				/>

				<div className="card">
					{this.renderOverlay()}

					<p className="title">
						{this.props.name}
						<span>({this.props.symbol})</span>
					</p>
					<p className="subtitle">
						<span
							className="modal-trigger"
							href={`#deposit-${this.props.symbol}`}
						>
							Deposit
						</span>
						<span
							className="modal-trigger"
							href={`#withdraw-${this.props.symbol}`}
						>
							Withdraw
						</span>
					</p>

					<div className="row">
						<div className="col-12">
							<div className="title">Total Balance</div>
							<div className="value">
								{round(this.props.availableBalance + this.props.reserveBalance)}
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-6">
							<div className="title">Available</div>
							<div className="value">{round(this.props.availableBalance)}</div>
						</div>
						<div className="col-6">
							<div className="title">In Orders</div>
							<div className="value">{round(this.props.reserveBalance)}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ exchange }) => {
	return { exchange };
};

const mapFunctionsToProps = {};

export default connect(
	mapStateToProps,
	mapFunctionsToProps
)(Asset);
