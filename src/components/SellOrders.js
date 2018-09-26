import React, { Component } from "react";
import { connect } from "react-redux";
import { roundFixed } from "../helpers";

class SellOrders extends Component {
	renderPrices = () => {
		const { sellBook } = this.props.exchange;

		const prices = [];

		for (const price in sellBook.prices) {
			prices.push(
				<tr key={price}>
					<td>{roundFixed(price)}</td>
					<td>{roundFixed(sellBook.prices[price].amount)}</td>
					<td>{roundFixed(sellBook.prices[price].total)}</td>
				</tr>
			);
		}

		return prices;
	};

	renderNoSellOrders = () => {
		if (!Object.keys(this.props.exchange.sellBook.prices).length) {
			return (
				<div className="unavailable">
					<p>No sell orders found.</p>
				</div>
			);
		}
	};

	render() {
		const { sellBook, currentMarket } = this.props.exchange;

		return (
			<div className="SellOrders">
				{this.renderNoSellOrders()}
				<div className="card px-4 py-4">
					<div className="head">
						<div className="title">
							<div className="icon sell" />
							Sell orders
						</div>
						<div className="subtitle">
							Total: {roundFixed(sellBook.total)} {currentMarket}
						</div>
					</div>

					<div className="body">
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
			</div>
		);
	}
}

const mapStateToProps = ({ orderBook, exchange }) => {
	return { orderBook, exchange };
};

export default connect(mapStateToProps)(SellOrders);
