import React, { Component } from "react";
import Chart from "../components/Chart";
import Trade from "../components/Trade";
import OrderBook from "../components/OrderBook";
import { connect } from "react-redux";
import { fetchMarket, leavePage } from "../actions";
import Loading from "../components/Loading";
import axios from "axios";

class Market extends Component {
	componentWillMount = async () => {
		var socket = this.props.exchange.socket;
		var assets = (await axios.get("/assets.json")).data;
		var market = this.props.match.params.symbol
			? this.props.match.params.symbol
			: Object.keys(assets)[0];

		this.props.fetchMarket(market, assets, socket);
	};

	componentWillUnmount = () => {
		this.props.leavePage();
	};

	componentWillReceiveProps = async nextProps => {
		var socket = this.props.exchange.socket;
		var assets = (await axios.get("/assets.json")).data;
		var market = nextProps.match.params.symbol
			? nextProps.match.params.symbol
			: Object.keys(assets)[0];

		if (
			!this.props.exchange.loading &&
			this.props.exchange.currentMarket !== market
		) {
			this.props.leavePage();
			this.props.fetchMarket(market, assets, socket);
		}
	};

	render() {
		if (this.props.exchange.loading) {
			return <Loading />;
		}

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

const mapFunctionsToProps = { fetchMarket, leavePage };

export default connect(
	mapStateToProps,
	mapFunctionsToProps
)(Market);
