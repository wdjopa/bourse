var util = require('util');

require('colors');

var _ = require('lodash');
var yahooFinance = require('yahoo-finance');

var SYMBOLS = [
    'KORI',
  'AAPL',
  'AMZN',
  'GOOGL',
  'YHOO'
];

yahooFinance.historical({
  symbols: SYMBOLS,
  from: '2019-01-01',
  to: '2019-10-31',
//   period: 'd'
}, function (err, result) {
  if (err) { throw err; }
  _.each(result, function (quotes, symbol) {
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