export const round = num => {
	return Math.round(parseFloat(num) * 100000000) / 100000000;
};

export const roundFixed = (num, decimalPoints) => {
	if (!decimalPoints) {
		decimalPoints = 8;
	}

	return parseFloat(num).toFixed(decimalPoints);
};
