import React, { Component } from "react";
import { connect } from "react-redux";
import { roundFixed } from "../helpers";
import M from "materialize-css/dist/js/materialize.min.js";
import { cancelOrder } from "../actions";

class MyOrders extends Component {
	componentDidMount = () => {
		M.AutoInit();
	};

	renderOverlay = () => {
		if (!this.props.exchange.user) {
			return (
				<div className="unavailable">
					<p>Please log in to see open orders.</p>
				</div>
			);
		}
	};

	renderNoOrders = () => {
		var { user, myOrders } = this.props.exchange;

		if (myOrders.length === 0 && user) {
			return (
				<div className="unavailable">
					<p>You have no open orders.</p>
				</div>
			);
		}
	};

	renderOrders = () => {
		var { myOrders, web3 } = this.props.exchange;

		return myOrders.map((order, i) => {
			return (
				<tr key={i}>
					<td className="icon">
						<span className={order.sell ? "sell" : "buy"} />
					</td>
					<td>{roundFixed(web3.utils.fromWei(order.price))}</td>
					<td>{roundFixed(web3.utils.fromWei(order.amount))}</td>
					<td>
						{roundFixed(
							web3.utils.fromWei(order.amount) * web3.utils.fromWei(order.price)
						)}
					</td>
					<td>
						<span
							className={
								this.props.myOrders.pending[order.id]
									? "action pending"
									: "action"
							}
							onClick={() => this.props.cancelOrder(order)}
						>
							{this.props.myOrders.pending[order.id]
								? "Please wait..."
								: "Cancel"}
						</span>
					</td>
				</tr>
			);
		});
	};

	renderOrderTable = () => {
		var { myOrders, user } = this.props.exchange;

		if (user && myOrders.length > 0) {
			return (
				<div>
					<div className="table-responsive">
						<table className="table">
							<thead>
								<tr>
									<th />
									<th scope="col">Price</th>
									<th scope="col">Amount</th>
									<th scope="col">Total</th>
									<th scope="col" />
								</tr>
							</thead>
							<tbody>{this.renderOrders()}</tbody>
						</table>
					</div>
					<div className="fadeBottom" />
				</div>
			);
		}
	};

	render() {
		return (
			<div className="MyOrders">
				<div className="card px-4 py-4">
					{this.renderOverlay()}
					{this.renderNoOrders()}

					<div className="head">
						<div className="title">My open orders</div>
					</div>

					<div className="body">{this.renderOrderTable()}</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ exchange, myOrders }) => {
	return { exchange, myOrders };
};

const mapDispatchToProps = { cancelOrder };

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MyOrders);
