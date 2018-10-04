import React, { Component } from "react";
import { connect } from "react-redux";
import M from "materialize-css/dist/js/materialize.min.js";
import {
	setInitialState,
	handleAmountInput,
	handleTransferSubmit,
	sendAll
} from "../actions";

class Transfer extends Component {
	componentDidMount = () => {
		M.AutoInit();
		window.$("#transfer").on("open", async (e, data) => {
			var { pending } = this.props.transfer;
			var { type, name, symbol } = data;
			var initialState = {
				amount: "",
				error: "",
				type,
				name,
				symbol,
				pending: false
			};

			if (!pending) {
				this.props.setInitialState(initialState);
			}

			window.$("#transfer").modal("open");
		});
	};

	renderSubmitButton = () => {
		var { pending, type } = this.props.transfer;

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
		return (
			<div className="buttons" onClick={this.props.handleTransferSubmit}>
				<div className="button2">
					<div>{type}</div>
				</div>
			</div>
		);
	};

	render() {
		var { type, name, symbol, amount, error } = this.props.transfer;

		return (
			<div id="transfer" className="modal">
				<div className="modal-content">
					<h4>
						{type} {name} ({symbol})
					</h4>
					<div className="input-field">
						<input
							id="amount"
							ref="amount"
							value={amount}
							type="number"
							autoComplete="off"
							onChange={this.props.handleAmountInput}
						/>
						<label htmlFor="amount" className={amount !== "" ? "active" : ""}>
							Amount
						</label>
						<span
							className="helper-text deposit-all"
							onClick={this.props.sendAll}
						>
							{type} entire balance
						</span>
					</div>
				</div>
				<div className="modal-footer">
					<span className="helper-text orange">{error}</span>
					{this.renderSubmitButton()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ exchange, transfer }) => {
	return { exchange, transfer };
};

const mapDispatchToProps = {
	setInitialState,
	handleAmountInput,
	handleTransferSubmit,
	sendAll
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Transfer);
