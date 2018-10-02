import React, { Component } from "react";
import { connect } from "react-redux";
import M from "materialize-css/dist/js/materialize.min.js";

class Transfer extends Component {
	state = {
		amount: "",
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
				amount: "",
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

	handleSubmit = () => {
		if (this.state.type === "withdraw") {
			this.withdraw();
		} else {
			this.deposit();
		}
	};

	deposit = async () => {
		var { symbol, amount } = this.state;
		var {
			user,
			exchangeInstance,
			assetsFiltered,
			web3,
			assetWeb3Instances,
			exchangeAddress,
			baseAsset
		} = this.props.exchange;

		if (!amount) {
			await this.setState({ error: "Amount cannot be 0." });
			return;
		}

		var balance = await this.getBalance(user, symbol);

		if (parseFloat(balance) < parseFloat(amount)) {
			await this.setState({ error: "Insufficient balance." });
			return;
		}

		amount = web3.utils.toWei(amount.toString());
		var assetAddress = assetsFiltered[symbol].address;
		var err;
		var approved = false;

		if (symbol !== baseAsset.symbol) {
			try {
				this.setState({ pending: true, error: "" });
				await assetWeb3Instances[symbol].methods
					.approve(exchangeAddress, amount)
					.send({ from: user });
				approved = true;
			} catch (error) {
				this.setState({ pending: false });
				err = error;
			}
		} else {
			approved = true;
		}

		if (approved) {
			var value = symbol !== baseAsset.symbol ? 0 : amount;

			try {
				this.setState({ pending: true, error: "" });
				await exchangeInstance.methods
					.deposit(assetAddress, amount)
					.send({ from: user, value });
			} catch (error) {
				this.setState({ pending: false });
				err = error;
			}

			if (!err) {
				var $ = window.$;
				$("#transfer").modal("close");
				$("#transferComplete").modal("open");
			}
		}
	};

	getBalance = async (user, symbol, amount) => {
		return new Promise(async (resolve, reject) => {
			var balance;
			var { baseAsset, web3, assetWeb3Instances } = this.props.exchange;

			if (symbol === baseAsset.symbol) {
				balance = web3.utils.fromWei(await web3.eth.getBalance(user));
			} else {
				var token = assetWeb3Instances[symbol];
				balance = web3.utils.fromWei(
					await token.methods.balanceOf(user).call()
				);
			}

			resolve(balance);
		});
	};

	withdraw = async () => {
		var { symbol, amount } = this.state;
		var { user, exchangeInstance, assetsFiltered, web3 } = this.props.exchange;

		if (!amount) {
			await this.setState({ error: "Amount cannot be 0." });
			return;
		}

		if (assetsFiltered[symbol].availableBalance < this.state.amount) {
			await this.setState({ error: "Insufficient balance." });
			return;
		}

		amount = web3.utils.toWei(amount.toString());
		var marketAddress = assetsFiltered[symbol].address;
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
		var { symbol, type } = this.state;
		var { user } = this.props.exchange;
		var amount;
		if (type === "withdraw") {
			var { assetsFiltered } = this.props.exchange;
			amount = assetsFiltered[symbol].availableBalance;
			await this.setState({ amount });
			this.refs.amount.value = amount;
		} else {
			amount = parseFloat(await this.getBalance(user, symbol));
			await this.setState({ amount });
			this.refs.amount.value = amount;
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
							className={this.state.amount !== "" ? "active" : ""}
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
