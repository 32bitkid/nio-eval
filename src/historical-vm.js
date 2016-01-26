var nio = require('niojs');
var _ = require('lodash');

module.exports = function createHistoricalVM(maxAge) {
  if (maxAge === undefined) { maxAge = 60000; }
  var recent = [];
  return nio.func(function(value) {
    recent.unshift({ value: value, at: Date.now() });
    recent = _.filter(recent, function(d) { return (Date.now() - d.at) < maxAge; });
    return recent;
  });
};
