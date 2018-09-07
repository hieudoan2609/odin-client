import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

class TradeHistory extends Component {
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

	render() {
		return (
			<div className="TradeHistory">
				<div className="card px-4 py-4">
					<div className="head buttons">
						<div className="button active">Market history</div>
						<div className="button">My trades</div>
					</div>

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
			</div>
		);
	}
}

const mapStateToProps = ({ orderBook }) => {
	return { orderBook };
};

export default connect(mapStateToProps)(TradeHistory);
