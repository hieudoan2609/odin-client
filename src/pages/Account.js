import React, { Component } from "react";
import Search from "../components/Search";
import Asset from "../components/Asset";
import M from "materialize-css/dist/js/materialize.min.js";
import { connect } from "react-redux";
import _ from "lodash";

class Account extends Component {
	componentDidMount = () => {
		M.AutoInit();
	};

	renderAssets = () => {
		const exchange = this.props.exchange;
		const assetGroups = _.chunk(Object.keys(exchange.assets), 4);

		return assetGroups.map((group, i) => {
			return (
				<div className="row" key={i}>
					{group.map((key, i) => {
						const asset = exchange.assets[key];

						return (
							<div className="col-md-6 col-lg-3" key={i}>
								<Asset
									name={asset.name}
									symbol={asset.symbol}
									availableBalance={asset.balance.available}
									reserveBalance={asset.balance.reserve}
								/>
							</div>
						);
					})}
				</div>
			);
		});
	};

	render() {
		return (
			<div className="MyAccount">
				<div className="row">
					<div className="col-12">
						<Search />
					</div>
				</div>

				<div className="assets">{this.renderAssets()}</div>
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

export default connect(mapStateToProps)(Account);
