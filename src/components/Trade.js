import { connect } from "react-redux";
import React, { Component } from "react";
import { roundFixed } from "../helpers";
import Flash from "../components/Flash";
import M from "materialize-css/dist/js/materialize.min.js";

class Trade extends Component {
	state = {
		type: "sell",
		price: 0,
		amount: 0,
		fee: 0,
		total: 0,
		totalMinusFee: 0,
		error: "",
		pending: false
	};

	componentDidMount = () => {
		M.AutoInit();
	};

	handlePriceInput = async e => {
		var price = parseFloat(e.target.value);
		await this.setState({ price });
		this.calculateFeeAndTotal();
	};

	handleAmountInput = async e => {
		var amount = parseFloat(e.target.value);
		await this.setState({ amount });
		this.calculateFeeAndTotal();
	};

	calculateFeeAndTotal = async (price, amount) => {
		var feeRate = this.props.exchange.fee;

		var total, fee, totalMinusFee;
		if (this.state.price && this.state.amount) {
			total =
				this.state.type === "sell"
					? this.state.price * this.state.amount
					: this.state.amount;
			fee =
				this.state.type === "sell"
					? (total / 100) * feeRate
					: (this.state.amount / 100) * feeRate;
			totalMinusFee = total - fee;
			await this.setState({ total, fee, totalMinusFee });
		} else {
			total = 0;
			fee = 0;
			totalMinusFee = 0;
			await this.setState({ total, fee, totalMinusFee });
		}
	};

	switchOrderType = type => {
		this.setState({ type });
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

		if (this.state.type === "sell") {
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

		if (this.state.type === "sell") {
			return (
				<p>
					Fee ({fee}
					%): {roundFixed(this.state.fee)} {baseAsset.symbol}
				</p>
			);
		} else {
			return (
				<p>
					Fee ({fee}
					%): {roundFixed(this.state.fee)} {currentMarket}
				</p>
			);
		}
	};

	renderSubmitButton = () => {
		if (this.state.pending) {
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
		if (this.state.type === "sell") {
			return (
				<div className="buttons" onClick={this.handleSubmit}>
					<div className="button2">
						<div>Sell</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="buttons" onClick={this.handleSubmit}>
					<div className="button2">
						<div>Buy</div>
					</div>
				</div>
			);
		}
	};

	handleSubmit = async () => {
		var {
			user,
			exchangeInstance,
			currentMarket,
			assets,
			web3,
			baseAsset
		} = this.props.exchange;

		var { price, amount, total } = this.state;
		price = web3.utils.toWei(price.toString());
		amount = web3.utils.toWei(amount.toString());
		var marketAddress = assets[currentMarket].address;
		var sell = this.state.type === "sell" ? true : false;

		if (!this.state.price) {
			this.setState({ error: "Price can't be empty." });
			return;
		}

		if (!this.state.amount) {
			this.setState({ error: "Amount can't be empty." });
			return;
		}

		if (
			sell &&
			parseFloat(assets[currentMarket].availableBalance) <
				parseFloat(web3.utils.fromWei(amount.toString()))
		) {
			this.setState({
				error: `Insufficient ${currentMarket} balance.`
			});
			return;
		}

		if (!sell && parseFloat(baseAsset.availableBalance) < parseFloat(total)) {
			this.setState({ error: `Insufficient ${baseAsset.symbol} balance.` });
			return;
		}

		var err;
		try {
			this.setState({ pending: true, error: "" });
			await exchangeInstance.methods
				.createOrder(marketAddress, amount, price, sell)
				.send({ from: user });
		} catch (error) {
			this.setState({ pending: false });
			err = error;
		}

		if (!err) {
			this.setState({ pending: false, amount: 0, price: 0, total: 0, fee: 0 });
			this.refs.amount.value = 0;
			this.refs.price.value = 0;

			var $ = window.$;
			$("#orderSubmitted").modal("open");
		}
	};

	renderTotal = () => {
		var { baseAsset, currentMarket } = this.props.exchange;

		if (this.state.type === "sell") {
			return (
				<p>
					Total: {roundFixed(this.state.totalMinusFee)} {baseAsset.symbol}
				</p>
			);
		} else {
			return (
				<p>
					Total: {roundFixed(this.state.totalMinusFee)} {currentMarket}
				</p>
			);
		}
	};

	render() {
		return (
			<div className="Trade card">
				{this.renderOverlay()}

				<Flash
					id="orderSubmitted"
					title="ORDER SUBMITTED."
					content="Your order has been successfully submitted, it will appear shortly."
				/>

				<div className="order__types">
					<div
						className={`button sell ${
							this.state.type === "sell" ? "active" : ""
						}`}
						onClick={() => this.switchOrderType("sell")}
					>
						Sell
					</div>
					<div
						className={`button buy ${
							this.state.type === "buy" ? "active" : ""
						}`}
						onClick={() => this.switchOrderType("buy")}
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
								onChange={this.handleAmountInput}
							/>
							<label htmlFor="amount">Amount</label>
						</div>
						<div className="input-field">
							<input
								id="price"
								ref="price"
								type="number"
								autoComplete="off"
								onChange={this.handlePriceInput}
							/>
							<label htmlFor="price">Price</label>
						</div>
					</div>
					{this.renderFee()}
					{this.renderTotal()}

					<span className="helper-text orange">{this.state.error}</span>

					{this.renderSubmitButton()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ exchange }) => {
	return { exchange };
};

export default connect(mapStateToProps)(Trade);
