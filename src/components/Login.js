import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout, goBack } from "../actions";

class LogIn extends Component {
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
							<span
								onClick={() => this.props.goBack(this.props.exchange.interval)}
							>
								Go back
							</span>
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
						<div className="choices">
							<span
								onClick={() => this.props.goBack(this.props.exchange.interval)}
							>
								Go back
							</span>
						</div>
					</div>
				</div>
			);
		}
	};

	renderLoggedIn = () => {
		if (this.props.exchange.user) {
			return (
				<div className="unavailable solid">
					<div>
						<h2>Welcome.</h2>
						<p>You are now logged in.</p>
						<div className="choices">
							<span
								onClick={() => this.props.logout(this.props.exchange.interval)}
							>
								Log out
							</span>
						</div>
					</div>
				</div>
			);
		}
	};

	renderCard = () => {
		return (
			<div className="card">
				{this.renderInstallMetamask()}
				{this.renderUnlockMetamask()}
				{this.renderLoggedIn()}
				<div className="head">
					<p className="title">Log in to a wallet</p>
				</div>
				<div className="body">
					<div className="row">
						<div className="col-md-4" />
						<div className="col-md-4">
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
						</div>
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
	logout,
	goBack
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LogIn);
