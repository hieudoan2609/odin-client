import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class NavBar extends Component {
	renderUser = () => {
		if (this.props.exchange.user) {
			return (
				<span>
					<i className="icon ion-ios-wallet" /> 0x8a37b7...2830E1 (0.097252 BTC)
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
						<Link to="/">
							<img src="/logo.png" alt="OdinTrade" />
						</Link>
					</div>
					<div className="nav-items">
						<ul className="pull-right" />
						<ul className="pull-left">
							<Link to="/account">
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
