import React, { Component } from "react";
import { connect } from "react-redux";
import { roundFixed } from "../helpers";

class BuyOrders extends Component {
	renderPrices = () => {
		const { buyBook } = this.props.exchange;

		const prices = [];

		for (const price in buyBook.prices) {
			prices.push(
				<tr key={price}>
					<td>{roundFixed(price)}</td>
					<td>{roundFixed(buyBook.prices[price].amount)}</td>
					<td>{roundFixed(buyBook.prices[price].total)}</td>
				</tr>
			);
		}

		prices.sort((a, b) => {
			return b.key - a.key;
		});

		return prices;
	};

	renderNoBuyOrders = () => {
		if (!Object.keys(this.props.exchange.buyBook.prices).length) {
			return (
				<div className="unavailable">
					<p>No buy orders found.</p>
				</div>
			);
		}
	};

	render() {
		const { buyBook, currentMarket } = this.props.exchange;

		return (
			<div className="BuyOrders">
				{this.renderNoBuyOrders()}
				<div className="card px-4 py-4">
					<div className="head">
						<div className="title">
							<div className="icon buy" />
							Buy orders
						</div>
						<div className="subtitle">
							Total: {roundFixed(buyBook.total)} {currentMarket}
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
