import React, { Component } from "react";
import NavBar from "./components/NavBar";
import Market from "./pages/Market";
import Account from "./pages/Account";
import Footer from "./components/Footer";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import { reload } from "./actions";
import store from "./store";

const history = createHistory();
history.listen((location, action) => {
	if (location.from !== location.pathname) {
		reload();
	}
});

class App extends Component {
	constructor() {
		super();
		this.store = store;
	}

	render() {
		return (
			<Provider store={this.store}>
				<Router history={history}>
					<div className="App">
						<NavBar />

						<div className="container">
							<Switch>
								<Route exact path="/" component={Market} />
								<Route path="/market/:symbol" component={Market} />
								<Route path="/account" component={Account} />
								<Route component={Market} />
							</Switch>
						</div>

						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
