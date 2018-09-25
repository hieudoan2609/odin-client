import React, { Component } from "react";
import { filterAssets } from "../actions";
import { connect } from "react-redux";

class Search extends Component {
	render() {
		let assets = this.props.exchange.assets;

		return (
			<div className="Search">
				<div className="card">
					<div className="input-field">
						<i className="icon ion-ios-search prefix" />
						<input
							id="search"
							type="text"
							autoComplete="off"
							value={this.props.exchange.search}
							onChange={e => this.props.filterAssets(e, assets)}
						/>
						<label
							htmlFor="search"
							className={this.props.exchange.search ? "active" : ""}
						>
							Search for an asset
						</label>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ exchange }) => {
	return { exchange };
};

const mapFunctionsToProps = {
	filterAssets
};

export default connect(
	mapStateToProps,
	mapFunctionsToProps
)(Search);
