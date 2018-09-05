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
		return this.props.pair.pairs.map((pair, i) => {
			const [cntr, base] = pair.split("_");
			return (
				<NavLink
					to={`/market/${pair}`}
					className={`button ${
						this.props.location.pathname === pair ||
						(this.props.location.pathname === "/" && i === 0)
							? "active"
							: ""
					}`}
					key={i}
				>
					{base}/{cntr}
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

const mapStateToProps = ({ pair, chart }) => {
	return { pair, chart };
};

export default withRouter(connect(mapStateToProps)(Chart));
