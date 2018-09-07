import { withRouter } from "react-router-dom";
import CandleStickChartWithHoverTooltip from "./CandleStickChartWithHoverTooltip";
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

class Chart extends Component {
	renderChart = () => {
		return (
			<CandleStickChartWithHoverTooltip
				type="hybrid"
				data={this.props.chart.data}
			/>
		);
	};

	renderPairs = () => {
		return this.props.exchange.assets.map((asset, i) => {
			return (
				<NavLink
					to={`/market/${asset.symbol}`}
					className={`button ${
						this.props.location.pathname === asset.symbol ||
						(this.props.location.pathname === "/" && i === 0)
							? "active"
							: ""
					}`}
					key={i}
				>
					{"ETH"}/{asset.symbol}
					<span className="buy">7,410.52</span>
				</NavLink>
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

const mapStateToProps = ({ exchange, chart }) => {
	return { exchange, chart };
};

export default withRouter(connect(mapStateToProps)(Chart));
