import React, { Component } from "react";
import MyOrders from "./MyOrders";
import SellOrders from "./SellOrders";
import BuyOrders from "./BuyOrders";
import TradeHistory from "./TradeHistory";

class OrderBook extends Component {
	render() {
		return (
			<div className="OrderBook">
				<div className="row">
					<div className="col-12">
						<MyOrders />
					</div>
				</div>

				<div className="row">
					<div className="col-lg-4">
						<SellOrders />
					</div>
					<div className="col-lg-4">
						<BuyOrders />
					</div>
					<div className="col-lg-4">
						<TradeHistory />
					</div>
				</div>
			</div>
		);
	}
}

export default OrderBook;
