import { connect } from "react-redux";
import React, { Component } from "react";

class Trade extends Component {
	state = {
		type: "buy"
	};

	switchOrderType = type => {
		this.setState({ type });
	};

	renderOverlay() {
		if (!this.props.exchange.user) {
			return (
				<div className="unavailable">
					<p>Please log in to trade.</p>
				</div>
			);
		}
	}

	render() {
		const exchange = this.props.exchange;

		return (
			<div className="Trade card">
				{this.renderOverlay()}
				<div className="order__types">
					<div
						className={`button buy ${
							this.state.orderType === "buy" ? "active" : ""
						}`}
						onClick={() => this.switchOrderType("buy")}
					>
						Buy
					</div>
					<div
						className={`button sell ${
							this.state.orderType === "sell" ? "active" : ""
						}`}
						onClick={() => this.switchOrderType("sell")}
					>
						Sell
					</div>
				</div>
				<div className="order__body">
					<div className="mini card balance">
						<div className="title">
							Balance
							<span>0 {exchange.currentMarket}</span>
						</div>
					</div>
					<div className="fields">
						<div className="input-field">
							<input id="amount" type="text" autoComplete="off" />
							<label htmlFor="amount">Amount</label>
						</div>
						<div className="input-field">
							<input id="price" type="text" autoComplete="off" />
							<label htmlFor="price">Price</label>
						</div>
					</div>
					<p>Fee (0.1%): 0 BTC</p>
					<p>Total: 0 USD</p>
					<div className="buttons">
						<div className="button2">
							<div>Buy</div>
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

export default connect(mapStateToProps)(Trade);
