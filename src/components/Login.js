import React, { Component } from "react";
import { connect } from "react-redux";

class LogIn extends Component {
	render() {
		return (
			<div className="Login">
				<div className="card">
					<div className="head">
						<p className="title">Log in to a wallet</p>
					</div>
					<div className="body">
						<div className="row">
							<div className="col-md-6">
								<div className="button">
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
							<div className="col-md-6">
								<div className="button">
									<div>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											xmlnsXlink="http://www.w3.org/1999/xlink"
											width="24"
											height="24"
											viewBox="0 0 24 24"
										>
											<defs>
												<path id="a" d="M0 .181h3.96V4H0z" />
												<path id="c" d="M0 .178h3.96v3.68H0z" />
												<path id="e" d="M0 16h16V0H0z" />
											</defs>
											<g
												fill="none"
												fillRule="evenodd"
												transform="translate(4 4)"
											>
												<g transform="translate(0 12)">
													<mask id="b" fill="#fff">
														<use xlinkHref="#a" />
													</mask>
													<path
														fill="pink"
														d="M0 1.27A2.73 2.73 0 0 0 2.73 4h1.23V.181H0V1.27z"
														mask="url(#b)"
													/>
												</g>
												<mask id="d" fill="#fff">
													<use xlinkHref="#c" />
												</mask>
												<path
													fill="pink"
													d="M3.96 3.858V.178H2.73C1.224.178 0 1.318 0 2.726v1.132h3.96z"
													mask="url(#d)"
												/>
												<mask id="f" fill="#fff">
													<use xlinkHref="#e" />
												</mask>
												<path
													fill="pink"
													d="M0 10h4V6H0zM13.281 0H6v10h10V2.681C16 1.201 14.783 0 13.281 0M12 16h1.196C14.744 16 16 14.72 16 13.14V12h-4v4zM6 16h4v-4H6z"
													mask="url(#f)"
												/>
											</g>
										</svg>
										Login with Ledger
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ exchange }) => {
	return { exchange };
};

// const mapDispatchToProps = {
// 	getChartData
// };

export default connect(mapStateToProps)(LogIn);
