import { connect } from "react-redux";
import React, { Component } from "react";
import { roundFixed } from "../helpers";
import M from "materialize-css/dist/js/materialize.min.js";
import {
	handleTradePriceInput,
	handleTradeAmountInput,
	dispatchFeeAndTotal,
	handleSubmit,
	switchOrderType
} from "../actions";

class Trade extends Component {
	componentDidMount = () => {
		M.AutoInit();
	};

	renderOverlay = () => {
		if (!this.props.exchange.user) {
			return (
				<div className="unavailable">
					<p>Please log in to trade.</p>
				</div>
			);
		}
	};

	renderBalance = () => {
		var { baseAsset, currentMarket, assets } = this.props.exchange;
		var { type } = this.props.trade;

		if (type === "sell") {
			return (
				<div className="mini card balance">
					<div className="title">
						Balance
						<span>
							{roundFixed(assets[currentMarket].availableBalance)}{" "}
							{currentMarket}
						</span>
					</div>
				</div>
			);
		} else {
			return (
				<div className="mini card balance">
					<div className="title">
						Balance
						<span>
							{roundFixed(baseAsset.availableBalance)} {baseAsset.symbol}
						</span>
					</div>
				</div>
			);
		}
	};

	renderFee = () => {
		var { fee, baseAsset, currentMarket } = this.props.exchange;
		var { type } = this.props.trade;
		var tradeFee = this.props.trade.fee;

		if (type === "sell") {
			return (
				<p>
					Fee ({fee}
					%): {roundFixed(tradeFee)} {baseAsset.symbol}
				</p>
			);
		} else {
			return (
				<p>
					Fee ({fee}
					%): {roundFixed(tradeFee)} {currentMarket}
				</p>
			);
		}
	};

	renderSubmitButton = () => {
		var { pending, type } = this.props.trade;

		if (pending) {
			return (
				<div className="buttons">
					<div className="button2 pending">
						<div>
							<span>Please wait...</span>
						</div>
					</div>
				</div>
			);
		}
		if (type === "sell") {
			return (
				<div
					className="buttons"
					onClick={() => this.props.handleSubmit(this.refs)}
				>
					<div className="button2">
						<div>Sell</div>
					</div>
				</div>
			);
		} else {
			return (
				<div
					className="buttons"
					onClick={() => this.props.handleSubmit(this.refs)}
				>
					<div className="button2">
						<div>Buy</div>
					</div>
				</div>
			);
		}
	};

	renderTotal = () => {
		var { baseAsset, currentMarket } = this.props.exchange;
		var { type, totalMinusFee, amountMinusFee } = this.props.trade;

		if (type === "sell") {
			return (
				<p>
					Total: {roundFixed(totalMinusFee)} {baseAsset.symbol}
				</p>
			);
		} else {
			return (
				<p>
					Total: {roundFixed(amountMinusFee)} {currentMarket}
				</p>
			);
		}
	};

	render() {
		return (
			<div className="Trade card">
				{this.renderOverlay()}

				<div className="order__types">
					<div
						className={`button sell ${
							this.props.trade.type === "sell" ? "active" : ""
						}`}
						onClick={() => this.props.switchOrderType("sell")}
					>
						Sell
					</div>
					<div
						className={`button buy ${
							this.props.trade.type === "buy" ? "active" : ""
						}`}
						onClick={() => this.props.switchOrderType("buy")}
					>
						Buy
					</div>
				</div>
				<div className="order__body">
					{this.renderBalance()}
					<div className="fields">
						<div className="input-field">
							<input
								id="amount"
								ref="amount"
								type="number"
								autoComplete="off"
								onChange={this.props.handleTradeAmountInput}
								value={this.props.trade.amount}
							/>
							<label
								htmlFor="amount"
								className={this.props.trade.amount !== "" ? "active" : ""}
							>
								Amount
							</label>
						</div>
						<div className="input-field">
							<input
								id="price"
								ref="price"
								type="number"
								autoComplete="off"
								onChange={this.props.handleTradePriceInput}
								value={this.props.trade.price}
							/>
							<label
								htmlFor="price"
								className={this.props.trade.price !== "" ? "active" : ""}
							>
								Price
							</label>
						</div>
					</div>
					{this.renderFee()}
					{this.renderTotal()}

					<span className="helper-text orange">{this.props.trade.error}</span>

					{this.renderSubmitButton()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ exchange, trade }) => {
	return { exchange, trade };
};

const mapDispatchToProps = {
	handleTradePriceInput,
	handleTradeAmountInput,
	dispatchFeeAndTotal,
	handleSubmit,
	switchOrderType
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Trade);
