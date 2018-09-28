import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { roundFixed } from "../helpers";

class NavBar extends Component {
	renderUser = () => {
		var { user, baseAsset } = this.props.exchange;
		if (user) {
			return (
				<span>
					<i className="icon ion-ios-wallet" />{" "}
					{`
						${user.substring(0, 6)}...${user.substring(user.length - 4, user.length)}
						(${roundFixed(baseAsset.availableBalance, 2)} ${baseAsset.symbol})
					`}
				</span>
			);
		}

		return (
			<span>
				<i className="icon ion-ios-wallet" /> Log in
			</span>
		);
	};

	render() {
		return (
			<div className="nav-bar">
				<div className="container">
					<div className="brand-logo">
						<Link
							to={{
								pathname: `/market/${this.props.exchange.currentMarket}`,
								from: window.location.pathname
							}}
						>
							<img src="/logo.png" alt="OdinTrade" />
						</Link>
					</div>
					<div className="nav-items">
						<ul className="pull-right" />
						<ul className="pull-left">
							<Link
								to={{
									pathname: "/account",
									from: window.location.pathname
								}}
							>
								<li className="nav-item">{this.renderUser()}</li>
							</Link>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ exchange }) => {
	return { exchange };
};

// const mapFunctionsToProps = {
// 	getChartData
// };

export default connect(mapStateToProps)(NavBar);
