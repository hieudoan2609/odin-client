import React, { Component } from "react";
import { connect } from "react-redux";
import { round } from "../helpers";

class Asset extends Component {
	transfer = (type, name, symbol) => {
		window.$("#transfer").trigger("open", { type, name, symbol });
	};

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
				<div className="card">
					{this.renderOverlay()}

					<p className="title">
						{this.props.name}
						<span>({this.props.symbol})</span>
					</p>
					<p className="subtitle">
						<span
							onClick={() =>
								this.transfer("deposit", this.props.name, this.props.symbol)
							}
						>
							Deposit
						</span>
						<span
							onClick={() =>
								this.transfer("withdraw", this.props.name, this.props.symbol)
							}
						>
							Withdraw
						</span>
					</p>

					<div className="row">
						<div className="col-12">
							<div className="title">Total Balance</div>
							<div className="value">
								{round(
									round(this.props.availableBalance) +
										round(this.props.reserveBalance)
								)}
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

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Asset);
