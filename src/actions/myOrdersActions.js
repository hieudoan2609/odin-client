import store from "../store";
import { MY_ORDERS_PENDING } from "./types";

export const cancelOrder = order => {
	return async dispatch => {
		var {
			user,
			exchangeInstance,
			currentMarket,
			assets
		} = store.getState().exchange;
		var { pending } = store.getState().myOrders;

		var err;
		try {
			pending[order.id] = true;
			dispatch({
				type: MY_ORDERS_PENDING,
				payload: { pending }
			});

			await exchangeInstance.methods
				.cancelOrder(assets[currentMarket].address, order.id)
				.send({ from: user });
		} catch (error) {
			pending[order.id] = false;
			dispatch({
				type: MY_ORDERS_PENDING,
				payload: { pending }
			});

			err = error;
		}

		if (!err) {
			pending[order.id] = false;
			dispatch({
				type: MY_ORDERS_PENDING,
				payload: { pending }
			});

			var $ = window.$;
			$("#orderCancelled").modal("open");
		}
	};
};
