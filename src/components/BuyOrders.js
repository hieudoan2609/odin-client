import React, { Component } from "react";
import { connect } from "react-redux";

class BuyOrders extends Component {
	renderPrices = () => {
		const { buyBook } = this.props.exchange;

		const prices = [];

		for (const price in buyBook.prices) {
			prices.push(
				<tr key={price}>
					<td>{price}</td>
					<td>{buyBook.prices[price].amount}</td>
					<td>{buyBook.prices[price].total}</td>
				</tr>
			);
		}

		return prices;

		// return buyBook.prices.map((price, i) => {
		// 	return (
		// 		<tr key={i}>
		// 			<td>{order.price}</td>
		// 			<td>{order.amount}</td>
		// 			<td>{order.total}</td>
		// 		</tr>
		// 	);
		// });
	};

	render() {
		const { buyBook, currentMarket } = this.props.exchange;

		return (
			<div className="BuyOrders">
				<div className="card px-4 py-4">
					<div className="head">
						<div className="title">
							<div className="icon buy" />
							Buy orders
						</div>
						<div className="subtitle">
							Total: {buyBook.total} {currentMarket}
						</div>
					</div>

					<div className="table-responsive">
						<table className="table">
							<thead>
								<tr>
									<th scope="col">Price</th>
									<th scope="col">Amount</th>
									<th scope="col">Total</th>
								</tr>
							</thead>
							<tbody>{this.renderPrices()}</tbody>
						</table>
					</div>
					<div className="fadeBottom" />
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ orderBook, exchange }) => {
	return { orderBook, exchange };
};

export default connect(mapStateToProps)(BuyOrders);
