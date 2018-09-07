import React, { Component } from "react";
import Chart from "../components/Chart";
import Trade from "../components/Trade";
import OrderBook from "../components/OrderBook";

class Market extends Component {
	componentWillMount = () => {
		if (!this.props.match.params.pair) {
			console.log("root");
		} else {
			console.log(this.props.match.params.pair);
		}
	};

	componentWillReceiveProps = nextProps => {
		console.log(nextProps.match.params.pair);
	};

	render() {
		return (
			<div className="Market">
				<div className="row">
					<div className="col-md-8">
						<Chart />
					</div>
					<div className="col-md-4">
						<Trade />
					</div>
				</div>

				<OrderBook />
			</div>
		);
	}
}

export default Market;
