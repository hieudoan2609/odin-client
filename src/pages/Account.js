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
		const assetGroups = _.chunk(this.props.contract.assets, 4);

		return assetGroups.map((group, i) => {
			return (
				<div className="row" key={i}>
					{group.map((asset, i) => {
						return (
							<div className="col-md-6 col-lg-3">
								<Asset name={asset.name} symbol={asset.symbol} />
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

const mapStateToProps = ({ contract }) => {
	return { contract };
};

// const mapFunctionsToProps = {
// 	getChartData
// };

export default connect(mapStateToProps)(Account);
