import React, { Component } from "react";
import { connect } from "react-redux";

class SellOrders extends Component {
	renderPrices = () => {
		const { sellBook } = this.props.exchange;

		const prices = [];

		for (const price in sellBook.prices) {
			prices.push(
				<tr key={price}>
					<td>{price}</td>
					<td>{sellBook.prices[price].amount}</td>
					<td>{sellBook.prices[price].total}</td>
				</tr>
			);
		}

		return prices;
	};

	render() {
		const { sellBook, currentMarket } = this.props.exchange;

		return (
			<div className="SellOrders">
				<div className="card px-4 py-4">
					<div className="head">
						<div className="title">
							<div className="icon sell" />
							Sell orders
						</div>
						<div className="subtitle">
							Total: {sellBook.total} {currentMarket}
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

export default connect(mapStateToProps)(SellOrders);
