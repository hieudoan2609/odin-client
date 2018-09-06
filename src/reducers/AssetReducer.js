const INITIAL_STATE = {
	assets: [
		{
			symbol: "BNB",
			address: "0xA39071f60fa2eC4b03749dBA262dCA7f68a43D1B"
		},
		{
			symbol: "VEN",
			address: "0x5d8357648858a69b40024A059a880a80fA91221E"
		},
		{
			symbol: "OMG",
			address: "0xae9DB274a5a797730aCF444540D72d966c9571D7"
		},
		{
			symbol: "ZRX",
			address: "0xCDA2497F18469b13aDfa3400FBF962667cEd3EB5"
		},
		{
			symbol: "ZIL",
			address: "0xD372b24B82Ba42450aF69386F2aDc78e1D300Bc8"
		},
		{
			symbol: "ICX",
			address: "0x3eb611A29C43393C2DCADEdb28B354F0Cb535253"
		},
		{
			symbol: "MKR",
			address: "0x76a86b8172886DE0810E61A75aa55EE74a26e76f"
		},
		{
			symbol: "AE",
			address: "0x1618B59953f0401Ef63C79C16d59546bB6DA4764"
		},
		{
			symbol: "NPXS",
			address: "0x9D871ef438E67720a0dAFD652646879A5a29c989"
		},
		{
			symbol: "BAT",
			address: "0xc001B0Fd61C2f6159C5eDc5DAB1c597c2ECA7ba1"
		}
	]
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		default:
			return state;
	}
};
