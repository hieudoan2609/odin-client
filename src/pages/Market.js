import React, { Component } from "react";
import Chart from "../components/Chart";
import Trade from "../components/Trade";
import OrderBook from "../components/OrderBook";
import { getMarket } from "../actions";
import { connect } from "react-redux";

class Market extends Component {
	componentWillMount = () => {
		const exchange = this.props.exchange;

		let market = this.props.match.params.pair
			? this.props.match.params.pair
			: Object.keys(exchange.assets)[0];

		if (exchange.currentMarket !== market) {
			this.props.getMarket(market);
		}
	};

	componentWillReceiveProps = nextProps => {
		const exchange = this.props.exchange;

		let market;
		if (!nextProps.match.params.pair) {
			market = Object.keys(exchange.assets)[0];
		} else {
			market = nextProps.match.params.pair;
		}

		if (exchange.currentMarket !== market) {
			this.props.getMarket(market);
		}
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

const mapStateToProps = ({ exchange }) => {
	return { exchange };
};

const mapFunctionsToProps = {
	getMarket
};

export default connect(
	mapStateToProps,
	mapFunctionsToProps
)(Market);
