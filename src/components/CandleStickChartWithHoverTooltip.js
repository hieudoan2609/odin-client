import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { BarSeries, CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { EdgeIndicator } from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import { ema } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

const dateFormat = timeFormat("%Y-%m-%d %H:00:00");
const numberFormat = format(".8f");
const candlesAppearance = {
	wickStroke: function fill(d) {
		return d.close > d.open ? "rgba(39,214,138,.5)" : "rgba(237,138,69,.5)";
	},
	fill: function fill(d) {
		return d.close > d.open ? "rgba(39,214,138,.5)" : "rgba(237,138,69,.5)";
	},
	stroke: function fill(d) {
		return d.close > d.open ? "rgba(39,214,138,1)" : "rgba(237,138,69,1)";
	},
	candleStrokeWidth: 1,
	widthRatio: 0.8,
	opacity: 1
};

function tooltipContent() {
	return ({ currentItem, xAccessor }) => {
		return {
			x: dateFormat(xAccessor(currentItem)),
			y: [
				{
					label: "open",
					value: currentItem.open && numberFormat(currentItem.open)
				},
				{
					label: "high",
					value: currentItem.high && numberFormat(currentItem.high)
				},
				{
					label: "low",
					value: currentItem.low && numberFormat(currentItem.low)
				},
				{
					label: "close",
					value: currentItem.close && numberFormat(currentItem.close)
				},
				{
					label: "volume",
					value: currentItem.volume && numberFormat(currentItem.volume)
				}
			].filter(line => line.value)
		};
	};
}

const keyValues = ["high", "low"];

class CandleStickChartWithHoverTooltip extends React.Component {
	removeRandomValues(data) {
		return data.map(item => {
			const newItem = { ...item };
			const numberOfDeletion = Math.floor(Math.random() * keyValues.length) + 1;
			for (let i = 0; i < numberOfDeletion; i += 1) {
				const randomKey =
					keyValues[Math.floor(Math.random() * keyValues.length)];
				newItem[randomKey] = undefined;
			}
			return newItem;
		});
	}

	render() {
		let { type, data: initialData, width, ratio } = this.props;

		// remove some of the data to be able to see
		// the tooltip resize
		initialData = this.removeRandomValues(initialData);

		const ema20 = ema()
			.id(0)
			.options({ windowSize: 20 })
			.merge((d, c) => {
				d.ema20 = c;
			})
			.accessor(d => d.ema20);

		const ema50 = ema()
			.id(2)
			.options({ windowSize: 50 })
			.merge((d, c) => {
				d.ema50 = c;
			})
			.accessor(d => d.ema50);

		const margin = { left: 10, right: 80, top: 10, bottom: 30 };

		const calculatedData = ema50(ema20(initialData));
		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
			d => d.date
		);
		const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
			calculatedData
		);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 100)]);
		const xExtents = [start, end];

		console.log(width / 80);

		return (
			<ChartCanvas
				height={400}
				width={width}
				ratio={ratio}
				margin={margin}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart
					id={1}
					yExtents={[d => [d.high, d.low]]}
					padding={{ top: 10, bottom: 20 }}
				>
					<XAxis
						axisAt="bottom"
						orient="bottom"
						stroke="transparent"
						tickStroke="#777777"
						ticks={width / 80}
					/>

					<YAxis
						axisAt="right"
						orient="right"
						ticks={5}
						tickFormat={numberFormat}
						stroke="transparent"
						tickStroke="#777777"
					/>

					<CandlestickSeries {...candlesAppearance} />

					<EdgeIndicator
						itemType="last"
						orient="right"
						edgeAt="right"
						yAccessor={d => d.close}
						displayFormat={numberFormat}
						fill={d =>
							d.close > d.open ? "rgba(39,214,138,1)" : "rgba(237,138,69,1)"
						}
						lineStroke={"#777777"}
					/>

					<HoverTooltip
						tooltipContent={tooltipContent()}
						fontSize={15}
						stroke={"transparent"}
						fontFill={"#777777"}
						fill={"#151b28"}
					/>
				</Chart>
				<Chart
					id={2}
					yExtents={[d => d.volume]}
					height={150}
					origin={(w, h) => [0, h - 150]}
				>
					<BarSeries
						yAccessor={d => d.volume}
						fill={d => (d.close > d.open ? "#27d68a" : "#ed8a45")}
					/>
				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickChartWithHoverTooltip.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChartWithHoverTooltip.defaultProps = {
	type: "svg"
};
CandleStickChartWithHoverTooltip = fitWidth(CandleStickChartWithHoverTooltip);

export default CandleStickChartWithHoverTooltip;
