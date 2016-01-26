var d3 = require('d3');

var maxHistory = 60 * 1000; // 60 seconds

// Create a new sparkline
module.exports = function createSpark(opts) {

  var horiz = d3.scale.linear()
    .domain([maxHistory, 0])
    .range([0, opts.width]);

  var vert = d3.scale.linear()
    .domain([0,60])
    .clamp(true)
    .range([opts.height, 0]);

  var line = d3.svg.line()
    .interpolate('step-before')
    .x(function(d) { return horiz(Date.now() - d.at); })
    .y(function(d) { return vert(d.value); });

  var fill = d3.svg.area()
    .interpolate('step-before')
    .x(function(d) { return horiz(Date.now() - d.at); })
    .y0(opts.height)
    .y1(function(d) { return vert(d.value); });

  var stage = d3.select(opts.sel)
    .append('svg')
    .attr('width', opts.width)
    .attr('height', opts.height);

  var fillPath = stage
    .append('path')
    .attr('class', 'sparkline__fill');

  var linePath = stage
    .append('path')
    .attr('class', 'sparkline__line');

  return function(series) {
    fillPath.datum(series).attr('d', fill);
    linePath.datum(series).attr('d', line);
  };
};
