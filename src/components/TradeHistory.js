import React, { Component } from "react";
import { connect } from "react-redux";
import { roundFixed } from "../helpers";

class TradeHistory extends Component {
	state = {
		market: true
	};

	renderOrders = () => {
		const trades = this.props.exchange.trades;
		return trades.map((trade, i) => {
			return (
				<tr key={i}>
					<td className="icon">
						<span className={trade.type} />
					</td>
					<td>{trade.date}</td>
					<td>{roundFixed(trade.price)}</td>
					<td>{roundFixed(trade.amount)}</td>
					<td>{roundFixed(trade.total)}</td>
				</tr>
			);
		});
	};

	switchTab = market => {
		this.setState({ market });
	};

	renderContent = () => {
		if (this.state.market) {
			return this.renderMarketTrades();
		} else {
			return this.renderMyTrades();
		}
	};

	renderMarketTrades = () => {
		return (
			<div>
				<div className="table-responsive">
					<table className="table">
						<thead>
							<tr>
								<th />
								<th scope="col">Date</th>
								<th scope="col">Price</th>
								<th scope="col">Amount</th>
								<th scope="col">Total</th>
							</tr>
						</thead>
						<tbody>{this.renderOrders()}</tbody>
					</table>
				</div>
				<div className="fadeBottom" />
			</div>
		);
	};

	renderMyTrades = () => {
		if (!this.props.exchange.user) {
			return this.renderOverlay();
		} else {
			return <p>My Trades</p>;
		}
	};

	renderOverlay() {
		if (!this.props.exchange.user) {
			return (
				<div className="unavailable">
					<p>Please log in to see trade history.</p>
				</div>
			);
		}
	}

	renderNoTrades() {
		if (!this.props.exchange.trades.length) {
			return (
				<div className="unavailable">
					<p>No trades within the last 24 hours.</p>
				</div>
			);
		}
	}

	render() {
		return (
			<div className="TradeHistory">
				{this.renderNoTrades()}

				<div className="card px-4 py-4">
					<div className="head">
						<div className="title">24h Trade History</div>
					</div>

					<div className="body">{this.renderContent()}</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ orderBook, exchange }) => {
	return { orderBook, exchange };
};

export default connect(mapStateToProps)(TradeHistory);
