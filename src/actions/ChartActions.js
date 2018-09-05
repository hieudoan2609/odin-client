import axios from "axios";
import moment from "moment";
import { tsvParse, csvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";
import { GET_CHART_DATA } from "./types";

export const getChartData = () => {
	return async dispatch => {
		const res = await axios.get(
			"https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv"
		);

		const data = tsvParse(res.data, parseData(parseDate));

		dispatch({
			type: GET_CHART_DATA,
			payload: data
		});
	};
};

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");
