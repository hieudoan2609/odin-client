import React, { Component } from "react";

class Loading extends Component {
	render() {
		return (
			<div className="loading">
				<div className="loading__blink">
					<img src="/logo.png" alt="OdinTrade" />
				</div>
			</div>
		);
	}
}

export default Loading;
