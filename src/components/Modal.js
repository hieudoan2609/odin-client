import React, { Component } from "react";

class Modal extends Component {
	render() {
		return (
			<div id={this.props.id} className="modal">
				<div className="modal-content">
					<h4>
						{this.props.type} {this.props.name} ({this.props.symbol})
					</h4>
					<div className="input-field">
						<input id="amount" type="text" autoComplete="off" />
						<label htmlFor="amount">Amount</label>
						<span className="helper-text deposit-all">
							{this.props.type} entire balance
						</span>
					</div>
				</div>
				<div className="modal-footer">
					<div className="buttons">
						<div className="button2">
							<div>{this.props.type}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Modal;
