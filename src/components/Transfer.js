import React, { Component } from "react";
import { connect } from "react-redux";
import M from "materialize-css/dist/js/materialize.min.js";

class Transfer extends Component {
	state = {
		amount: 0,
		error: "",
		type: "",
		name: "",
		symbol: "",
		pending: false
	};

	componentDidMount = () => {
		M.AutoInit();
		window.M = M;
		window.$("#transfer").on("open", async (e, data) => {
			var { type, name, symbol } = data;
			this.refs.amount.value = "";
			var initialState = {
				amount: 0,
				error: "",
				type,
				name,
				symbol,
				pending: false
			};
			await this.setState(initialState);
			window.$("#transfer").modal("open");
		});
	};

	handleAmountInput = e => {
		var amount = e.target.value;
		this.setState({ amount });
	};

	handleSubmit = async () => {
		var { type, symbol, amount } = this.state;
		var {
			user,
			exchangeInstance,
			assetsFiltered,
			assets,
			web3
		} = this.props.exchange;

		if (!amount) {
			await this.setState({ error: "Amount cannot be 0." });
			return;
		}

		if (assetsFiltered[symbol].availableBalance < this.state.amount) {
			await this.setState({ error: "Insufficient balance." });
			return;
		}

		amount = web3.utils.toWei(amount.toString());
		var marketAddress = assets[symbol].address;
		var err;
		try {
			this.setState({ pending: true, error: "" });
			await exchangeInstance.methods
				.withdraw(marketAddress, amount)
				.send({ from: user });
		} catch (error) {
			this.setState({ pending: false });
			err = error;
		}

		if (!err) {
			var $ = window.$;
			$("#transfer").modal("close");
			$("#transferComplete").modal("open");
		}
	};

	sendAll = async () => {
		var { symbol } = this.state;
		var { assetsFiltered } = this.props.exchange;
		var amount = assetsFiltered[symbol].availableBalance;
		await this.setState({ amount });
		this.refs.amount.value = amount;
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
		return (
			<div className="buttons" onClick={this.handleSubmit}>
				<div className="button2">
					<div>{this.state.type}</div>
				</div>
			</div>
		);
	};

	render() {
		return (
			<div id="transfer" className="modal">
				<div className="modal-content">
					<h4>
						{this.state.type} {this.state.name} ({this.state.symbol})
					</h4>
					<div className="input-field">
						<input
							id="amount"
							ref="amount"
							type="number"
							autoComplete="off"
							onChange={this.handleAmountInput}
						/>
						<label
							htmlFor="amount"
							className={this.state.amount ? "active" : ""}
						>
							Amount
						</label>
						<span className="helper-text deposit-all" onClick={this.sendAll}>
							{this.state.type} entire balance
						</span>
					</div>
				</div>
				<div className="modal-footer">
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

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Transfer);
