# Exchange.sol

* features:

  * adding/ removing tokens (owner only) ✓

  * setting fee (owner only) ✓

  * transfer ownership (owner only) ✓

  * depositing ✓

  * withdrawing ✓

  * placing orders

  * cancelling orders ✓

  * matching orders

  * trading orders, taking fees

  * see market's data:

    * 24h volume

    * bid/ ask

    * orderbook

    * recent trades

    * market depth

  * see account's data:

    * trades

    * orders

    * tokens

* public functions:

  * addToken ✓

  * removeToken ✓

  * deposit ✓

  * depositToken ✓

  * withdraw ✓

  * withdrawToken ✓

  * changeAdmin ✓

  * changeFeeMake ✓

  * changeFeeTake ✓

  * order

  * cancelOrder

  * trade

  * availableVolume (helper)

  * amountFilled (helper)

* private functions

  * tradeBalances

* public variables:

  * admin ✓

  * tokens ✓

  * balances ✓

  * orders

  * orderFills

  * feeMake ✓

  * feeTake ✓

* events:

  * Order ✓

  * Cancel

  * Trade ✓

  * Deposit ✓

  * Withdraw ✓

# EXAMPLE .ENV

TOKEN_NAME='BLACK LOTUS'
TOKEN_SYMBOL='LOT'
RINKEBY_MNEMONIC=''
