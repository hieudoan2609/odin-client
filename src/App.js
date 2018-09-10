import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "./components/NavBar";
import Market from "./pages/Market";
import Account from "./pages/Account";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import { getChartData, getMarket } from "./actions";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
	componentWillMount = () => {
		const exchange = this.props.exchange;
		this.props.getChartData();
		const defaultMarket = Object.keys(exchange.assets)[0];
		const defaultMarketAddress = exchange.assets[defaultMarket].address;
		this.props.getMarket(defaultMarket, defaultMarketAddress);
	};

	render() {
		if (this.props.chart.loading || this.props.exchange.loading) {
			return <Loading />;
		}

		return (
			<Router>
				<div className="App">
					<NavBar />

					<div className="container">
						<Switch>
							<Route exact path="/" component={Market} />
							<Route path="/account" component={Account} />
							<Route path="/market/:pair" component={Market} />
						</Switch>
					</div>

					<Footer />
				</div>
			</Router>
		);
	}
}

const mapStateToProps = ({ chart, exchange }) => {
	return { chart, exchange };
};

const mapFunctionsToProps = {
	getChartData,
	getMarket
};

export default connect(
	mapStateToProps,
	mapFunctionsToProps
)(App);
