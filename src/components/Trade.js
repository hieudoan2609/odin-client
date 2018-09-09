import { connect } from "react-redux";
import React, { Component } from "react";
import { switchOrderType } from "../actions";

class Trade extends Component {
	render() {
		const exchange = this.props.exchange;

		return (
			<div className="Trade card">
				<div className="order__types">
					<div
						className={`button buy ${
							this.props.trade.orderType === "buy" ? "active" : ""
						}`}
						onClick={() => this.props.switchOrderType("buy")}
					>
						Buy
					</div>
					<div
						className={`button sell ${
							this.props.trade.orderType === "sell" ? "active" : ""
						}`}
						onClick={() => this.props.switchOrderType("sell")}
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

const mapStateToProps = ({ trade, exchange }) => {
	return { trade, exchange };
};

export default connect(
	mapStateToProps,
	{ switchOrderType }
)(Trade);
