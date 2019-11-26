var port = process.env.PORT || 5000;
var util = require('util');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');

require('colors');


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var _ = require('lodash');
var yahooFinance = require('yahoo-finance');

var yahooStockPrices = require('yahoo-stock-prices');

// Chargement de socket.io
var io = require('socket.io').listen(http);
io.sockets.on("connection", function (socket) {


    var SYMBOLS = [
        'KORI.PA',
        'OR.PA',
        'FTI.PA',
        'ATO.PA',
        'BIM.PA',
        'SOP.PA'
    ];


    setInterval(function (){
        yahooStockPrices.getCurrentPrice('KORI.PA', function(err, price){
            socket.emit("stock", price)
            console.log(price);
        })
        // yahooStockPrices.getHistoricalPrices(10, 25, 2019, 10, new Date().getDate(), new Date().getFullYear(), 'KORI.PA', '1d', function(err, prices){
        //     socket.emit("stocks", prices)
        //     console.log(prices);
        // });
    }, 600);

    yahooFinance.historical({
        symbols: SYMBOLS,
        from: new Date('2018-11-18'),
        to: new Date('2019-11-26'),
        period: 'd'
    }, function (err, result) {
        if (err) { throw err; }
        _.each(result, function (quotes, symbol) {
            socket.emit("datas", quotes, symbol)
            console.log(util.format(
                '=== %s (%d) ===',
                symbol,
                quotes.length
            ).cyan);
            if (quotes[0]) {
                console.log(
                    '%s\n...\n%s',
                    JSON.stringify(quotes[0], null, 2),
                    JSON.stringify(quotes[quotes.length - 1], null, 2)
                );
            } else {
                console.log('N/A');
            }
        });
    });
})
http.listen(port);
