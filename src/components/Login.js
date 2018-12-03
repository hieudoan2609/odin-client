import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout } from "../actions";

class LogIn extends Component {
	renderWrongNetwork = () => {
		if (this.props.exchange.wrongNetwork) {
			var { networkId } = this.props.exchange;

			var networkName;
			switch (networkId) {
				case 4:
					networkName = "Rinkeby";
					break;
				default:
					networkName = "Mainnet";
			}

			return (
				<div className="unavailable solid">
					<div>
						<h2>Wrong network.</h2>
						<p>Please change your network setting to {networkName}.</p>
						<div className="choices">{this.renderLogoutButton()}</div>
					</div>
				</div>
			);
		}
	};

	renderInstallMetamask = () => {
		if (this.props.exchange.installMetamask) {
			return (
				<div className="unavailable solid">
					<div>
						<h2>MetaMask is not installed.</h2>
						<p>Would you like to install it now?</p>
						<div className="choices">
							<span>
								<a href="https://metamask.io/">Install MetaMask</a>
							</span>
							{this.renderLogoutButton()}
						</div>
					</div>
				</div>
			);
		}
	};

	renderUnlockMetamask = () => {
		if (this.props.exchange.unlockMetamask) {
			return (
				<div className="unavailable solid">
					<div>
						<h2>MetaMask is not unlocked.</h2>
						<p>Please unlock MetaMask.</p>
						<div className="choices">{this.renderLoginButton()}</div>
					</div>
				</div>
			);
		}
	};

	renderLoginButton = () => {
		return (
			<div
				className="button"
				onClick={() => this.props.login(this.props.exchange.user)}
			>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path
							fill="pink"
							fillRule="evenodd"
							d="M3.911 4L3 6.68l.596 2.843-.386.299.56.433-.426.33.567.51-.36.242.824.95-1.22 3.85 1.148 3.873 4.12-1.075 2.187 1.704h2.737l2.383-1.746 3.967 1.117 1.149-3.874h.005l-1.226-3.849.823-.95-.36-.241.568-.51-.426-.33.56-.434-.386-.3L21 6.68 20.088 4 14.35 6.107H9.651L3.911 4zm10.284 9.451l2.344 1.103-3.28.945.936-2.048zm-6.734 1.1l2.345-1.1.936 2.048-3.281-.948zm3.151 3.148l.407-.234h1.962l.383.246.129 1.43h-3.015l.134-1.442z"
						/>
					</svg>
					Login with MetaMask
				</div>
			</div>
		);
	};

	renderLogoutButton = () => {
		return <span onClick={() => this.props.logout()}>Log out</span>;
	};

	renderCard = () => {
		var { user } = this.props.exchange;

		if (user) {
			return (
				<div className="card">
					<div className="account-info">
						<div>
							<div className="head">
								<p className="title">Welcome back.</p>
								<p>You have now logged in.</p>
								<div className="choices">
									<span onClick={() => this.props.logout()}>Log out</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="card">
				{this.renderInstallMetamask()}
				{this.renderUnlockMetamask()}
				{this.renderWrongNetwork()}
				<div className="head">
					<p className="title">Log in to a wallet</p>
				</div>
				<div className="body">
					<div className="row">
						<div className="col-md-4" />
						<div className="col-md-4">{this.renderLoginButton()}</div>
						<div className="col-md-4" />
					</div>
				</div>
			</div>
		);
	};

	render() {
		return <div className="Login">{this.renderCard()}</div>;
	}
}

const mapStateToProps = ({ exchange }) => {
	return { exchange };
};

const mapDispatchToProps = {
	login,
	logout
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LogIn);
