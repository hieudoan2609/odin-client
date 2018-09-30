import React, { Component } from "react";
import Search from "../components/Search";
import Asset from "../components/Asset";
import { connect } from "react-redux";
import _ from "lodash";
import Loading from "../components/Loading";
import Login from "../components/Login";
import { fetchAccount } from "../actions";
import Transfer from "../components/Transfer";
import Flash from "../components/Flash";

class Account extends Component {
	componentWillMount = () => {
		this.props.fetchAccount();
	};

	renderAssets = () => {
		const exchange = this.props.exchange;
		const assetGroups = _.chunk(Object.keys(exchange.assetsFiltered), 4);

		return assetGroups.map((group, i) => {
			return (
				<div className="row" key={i}>
					{group.map((key, i) => {
						const asset = exchange.assetsFiltered[key];

						return (
							<div className="col-md-6 col-lg-3" key={i}>
								<Asset
									name={asset.name}
									symbol={asset.symbol}
									availableBalance={asset.availableBalance}
									reserveBalance={asset.reserveBalance}
								/>
							</div>
						);
					})}
				</div>
			);
		});
	};

	renderReloading = () => {
		if (this.props.exchange.reloading) {
			return <Loading />;
		}
	};

	render() {
		if (this.props.exchange.accountLoading) {
			return <Loading />;
		}

		return (
			<div className="MyAccount">
				{this.renderReloading()}

				<Transfer />

				<Flash
					id="transferComplete"
					title="REQUEST SUBMITTED."
					content="Your request has been successfully submitted, it will be processed shortly."
				/>

				<div className="row">
					<div className="col-12">
						<Login />
					</div>
				</div>

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

const mapFunctionsToProps = {
	fetchAccount
};

export default connect(
	mapStateToProps,
	mapFunctionsToProps
)(Account);
