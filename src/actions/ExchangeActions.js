import Web3 from "web3";
import exchangeAbi from "../contracts/ExchangePureAbi.json";
import { EXCHANGE_CURRENT_MARKET } from "./types";

const infura = "https://rinkeby.infura.io/pVTvEWYTqXvSRvluzCCe";
const web3 = new Web3(Web3.givenProvider || infura);
const exchangeAddress = "0x3F3aEF30AFee20b0281B2947c4F694DA1839d281";
const exchange = new web3.eth.Contract(exchangeAbi, exchangeAddress);

export const getMarketInfo = () => {
	return async dispatch => {
		console.log(await exchange.getPastEvents("allEvents"));
	};
};

export const setCurrentMarket = market => {
	return {
		type: EXCHANGE_CURRENT_MARKET,
		payload: market
	};
};
