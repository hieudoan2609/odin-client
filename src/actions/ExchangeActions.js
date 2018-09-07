import Web3 from "web3";
import exchangeAbi from "../contracts/ExchangePureAbi.json";
import { EXCHANGE_CONNECT } from "./types";

const web3 = new Web3(
	Web3.givenProvider || "https://rinkeby.infura.io/pVTvEWYTqXvSRvluzCCe"
);
// const exchangeAddress = "0x3F3aEF30AFee20b0281B2947c4F694DA1839d281";
// const exchange = new web3.eth.Contract(exchangeAbi, exchangeAddress);

export const connectExchange = () => {
	return async dispatch => {
		console.log(await web3.eth.getAccounts());
	};
};
