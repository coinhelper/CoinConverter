
/*
 * GET home page.
 */
var request = require('request');
var utils = require('./utils');

// Add the possible tickers to an array. Will refactor this at some point
var cointype = [];
cointype['litecoin'] = "https://btc-e.com/api/2/ltc_usd/ticker";
cointype['bitcoin'] = "https://btc-e.com/api/2/btc_usd/ticker";

var currencies = [];
currencies.push( {name : "USD", symbol: "$"} );
currencies.push( {name : "GBP", symbol: "£"} ); 

// Intiialize the member variable amount as 0. this should get updated if everything goes well
var usdAmount = 0;

exports.index = function(req, res){
    //default coin to litecoin
    var coin = "litecoin";

    //but add some logic for coin typed on the URL
    if(typeof req.params.coin != 'undefined'){
        coin = req.params.coin;
        if (!(coin in cointype)){
            res.status(404).send('Crypto Currency (' + coin + ') not supported... yet');
            throw new Error('invalid-crypto');
        }
    }
    request(cointype[coin], function(error, response, body){
        if(!error && response.statusCode == 200){
            // read JSON packet and parse
            var objTicker = JSON.parse(body);
            usdAmount = objTicker.ticker.buy;
        }

        // render view
        res.render('index', { amount: usdAmount, coin:utils.capFirst(coin), currencies: currencies });
    });
};

