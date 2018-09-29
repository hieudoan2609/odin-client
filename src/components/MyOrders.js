import React, { Component } from "react";
import { connect } from "react-redux";
import { roundFixed } from "../helpers";
import Flash from "../components/Flash";
import M from "materialize-css/dist/js/materialize.min.js";

class MyOrders extends Component {
	state = {
		pending: false
	};

	componentDidMount = () => {
		M.AutoInit();
	};

	cancelOrder = async order => {
		var {
			user,
			exchangeInstance,
			currentMarket,
			assets,
			web3
		} = this.props.exchange;

		var err;
		try {
			this.setState({ pending: order.id });
			await exchangeInstance.methods
				.cancelOrder(assets[currentMarket].address, order.id)
				.send({ from: user });
		} catch (error) {
			this.setState({ pending: false });
			err = error;
		}

		if (!err) {
			this.setState({ pending: false });
			var $ = window.$;
			$("#orderCancelled").modal("open");
		}
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
								this.state.pending === order.id ? "action pending" : "action"
							}
							onClick={() => this.cancelOrder(order)}
						>
							{this.state.pending === order.id ? "Please wait..." : "Cancel"}
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

					<Flash
						id="orderCancelled"
						title="ORDER CANCELLED."
						content="Your order has been cancelled, it will disappear shortly."
					/>

					<div className="head">
						<div className="title">My open orders</div>
					</div>

					<div className="body">{this.renderOrderTable()}</div>
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
)(MyOrders);
