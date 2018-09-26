import React, { Component } from "react";
import Chart from "../components/Chart";
import Trade from "../components/Trade";
import OrderBook from "../components/OrderBook";
import { connect } from "react-redux";
import { fetchMarket } from "../actions";
import Loading from "../components/Loading";
import axios from "axios";

class Market extends Component {
	componentWillMount = async () => {
		var socket = this.props.exchange.socket;
		var assets = (await axios.get("/assets.json")).data;

		var market;
		if (
			this.props.match.params.symbol &&
			assets[this.props.match.params.symbol]
		) {
			market = this.props.match.params.symbol;
		} else {
			market = Object.keys(assets)[0];
		}

		this.props.fetchMarket(market, assets, socket);
	};

	componentWillReceiveProps = async nextProps => {
		var socket = this.props.exchange.socket;
		var assets = (await axios.get("/assets.json")).data;
		var market;
		if (
			this.props.match.params.symbol &&
			assets[this.props.match.params.symbol]
		) {
			market = this.props.match.params.symbol;
		} else {
			market = Object.keys(assets)[0];
		}

		if (this.props.exchange.reloading) {
			this.props.fetchMarket(market, assets, socket);
		}
	};

	renderReloading = () => {
		if (this.props.exchange.reloading) {
			return <Loading />;
		}
	};

	render() {
		if (this.props.exchange.marketLoading) {
			return <Loading />;
		}

		return (
			<div className="Market">
				{this.renderReloading()}

				<div className="row">
					<div className="col-lg-8">
						<Chart />
					</div>
					<div className="col-lg-4">
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

const mapFunctionsToProps = { fetchMarket };

export default connect(
	mapStateToProps,
	mapFunctionsToProps
)(Market);
