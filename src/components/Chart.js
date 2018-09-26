import CandleStickChartWithHoverTooltip from "./CandleStickChartWithHoverTooltip";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Chart extends Component {
	renderChart = () => {
		if (!this.props.exchange.ticks) {
			return (
				<div className="unavailable">
					<p>Chart data not available.</p>
				</div>
			);
		}

		return (
			<CandleStickChartWithHoverTooltip
				type="hybrid"
				data={this.props.exchange.ticks}
			/>
		);
	};

	renderPairs = () => {
		var keys = Object.keys(this.props.exchange.assets);
		// var sorted_keys = [];

		// for (var i in keys) {
		// 	if (keys[i] === this.props.exchange.currentMarket) {
		// 		sorted_keys.unshift(keys[i]);
		// 	} else {
		// 		sorted_keys.push(keys[i]);
		// 	}
		// }

		return keys.map((assetKey, i) => {
			const asset = this.props.exchange.assets[assetKey];
			const price = this.props.exchange.marketPrices[assetKey];

			return (
				<Link
					to={{
						pathname: `/market/${asset.symbol}`,
						from: `/market/${this.props.exchange.currentMarket}`
					}}
					className={`button ${
						this.props.exchange.currentMarket === asset.symbol ? "active" : ""
					}`}
					key={i}
				>
					{"ETH"}/{asset.symbol}
					<span
						className={
							price.currentPrice < price.previousPrice ? "sell" : "buy"
						}
					>
						{price.currentPrice}
					</span>
				</Link>
			);
		});
	};

	render() {
		return (
			<div className="Chart card">
				<div className="chart__nav">
					<div className="outerWrapper">
						<div className="markets">
							<div className="fadeRight" />
							<div className="wrapper">{this.renderPairs()}</div>
						</div>
					</div>
				</div>
				{this.renderChart()}
			</div>
		);
	}
}

const mapStateToProps = ({ exchange }) => {
	return { exchange };
};

export default connect(mapStateToProps)(Chart);
