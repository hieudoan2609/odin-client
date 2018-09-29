import React, { Component } from "react";

class Modal extends Component {
	render() {
		return (
			<div id="flash" className="modal">
				<div className="modal-content">
					<h4>{this.props.title}</h4>
					<p>{this.props.content}</p>
				</div>
				<div className="modal-footer">
					<div className="buttons">
						<div href="#!" className="button2 modal-close">
							<div>OK</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Modal;
