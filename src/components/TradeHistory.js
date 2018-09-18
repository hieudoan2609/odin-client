import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

class TradeHistory extends Component {
	state = {
		market: true
	};

	renderOrders = () => {
		return this.props.orderBook.tradeHistory.map((trade, i) => {
			return (
				<tr key={i}>
					<td className="icon">
						<span className={trade.type} />
					</td>
					<td>{moment(trade.date).format("YYYY-MM-D h:mm:ss")}</td>
					<td>{trade.price}</td>
					<td>{trade.amount}</td>
					<td>{trade.total}</td>
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

	render() {
		return (
			<div className="TradeHistory">
				<div className="card px-4 py-4">
					<div className="head buttons">
						<div
							className={this.state.market ? "button active" : "button"}
							onClick={() => this.switchTab(true)}
						>
							Market history
						</div>
						<div
							className={!this.state.market ? "button active" : "button"}
							onClick={() => this.switchTab(false)}
						>
							My trades
						</div>
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
