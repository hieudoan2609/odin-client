export const round = num => {
	return Math.round(parseFloat(num) * 100000000) / 100000000;
};

export const roundFixed = num => {
	return parseFloat(num).toFixed(8);
};
