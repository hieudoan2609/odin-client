import React, { Component } from "react";
import NavBar from "./components/NavBar";
import Market from "./pages/Market";
import Account from "./pages/Account";
import Footer from "./components/Footer";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import reducers from "./reducers";
import { BrowserRouter, Route, Switch } from "react-router-dom";

class App extends Component {
	constructor() {
		super();
		this.store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
	}

	render() {
		return (
			<Provider store={this.store}>
				<BrowserRouter>
					<div className="App">
						<NavBar />

						<div className="container">
							<Switch>
								<Route exact path="/" component={Market} />
								<Route path="/market/:symbol" component={Market} />
								<Route path="/account" component={Account} />
							</Switch>
						</div>

						<Footer />
					</div>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;
