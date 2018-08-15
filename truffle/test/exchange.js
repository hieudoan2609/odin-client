require("dotenv").config();
const Exchange = artifacts.require("Exchange");
const Token = artifacts.require("Token");

contract("Exchange", accounts => {
	const etherAddress = "0x0000000000000000000000000000000000000000";
	const tokenName = process.env.TOKEN_NAME;
	const tokenSymbol = process.env.TOKEN_SYMBOL;
	const tokenTotalSupply = 1000000000000000000000000000;
	const tokenUnitsOneEthCanBuy = 10000;

	let exchange;
	let token;

	beforeEach(async () => {
		exchange = await Exchange.new();
		token = await Token.new(
			tokenName,
			tokenSymbol,
			tokenUnitsOneEthCanBuy,
			tokenTotalSupply
		);
	});

	it("should initialize properly", async () => {
		assert.equal(await exchange.owner.call(), accounts[0]);

		const ETH = await exchange.tokens.call(etherAddress);

		assert.equal(ETH[0], "Ethereum");
		assert.equal(ETH[1], "ETH");
	});

	describe("adding tokens", () => {
		it("owner can add tokens", async () => {
			await exchange.addToken(token.address, tokenName, tokenSymbol);

			const newToken = await exchange.tokens.call(token.address);

			assert.equal(newToken[0], tokenName);
			assert.equal(newToken[1], tokenSymbol);
		});

		it("users can not add tokens", async () => {
			try {
				assert.fail(
					await exchange.addToken(
						token.address,
						tokenName,
						tokenSymbol,
						{
							from: accounts[1]
						}
					)
				);
			} catch (err) {
				assert.equal(
					err.message,
					"VM Exception while processing transaction: revert"
				);
			}
		});
	});

	describe("removing tokens", () => {
		it("owner can remove tokens", async () => {
			await exchange.removeToken(token.address);

			const removedToken = await exchange.tokens.call(token.address);

			assert.equal(removedToken[0], 0);
			assert.equal(removedToken[1], 0);
		});
	});
});
