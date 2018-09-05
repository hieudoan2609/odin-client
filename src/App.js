import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "./components/NavBar";
import Market from "./pages/Market";
import Account from "./pages/Account";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import { getChartData } from "./actions";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
	componentWillMount = () => {
		this.props.getChartData();
	};

	render() {
		if (this.props.chart.loading) {
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

const mapStateToProps = ({ chart }) => {
	return { chart };
};

const mapFunctionsToProps = {
	getChartData
};

export default connect(
	mapStateToProps,
	mapFunctionsToProps
)(App);
