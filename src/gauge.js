var d3 = require('d3');
var labelFormat = d3.format('0.0f');

// Create scale for radial gauges
var scale = d3.scale.linear()
  .clamp(true)
  .domain([0,60])
  .range([-Math.PI/1.5, Math.PI/1.5]);

var minTheta = d3.min(scale.range()), maxTheta = d3.max(scale.range());

module.exports = function createGauge(opts) {
  var t = opts.thickness || 55;
  var et = opts.emptyThickness || 35;
  var timing = opts.timing !== undefined ? opts.timing : 500;
  var gap = opts.gap !== undefined ? opts.gap : Math.PI/180;
  var minDim = Math.min(opts.width, opts.height);
  var r = opts.r || (minDim / 2) - (Math.max(t, et)/2);

  var svg = d3.select(opts.sel).append('svg')
    .attr('width', opts.width)
    .attr('height', opts.height);

  var gauge = svg.append('g').attr('transform', 'translate('+opts.width/2+','+opts.height/2+')');
  var filled = gauge.append('path').attr('class', 'chart-gauge__filled');
  var rest = gauge.append('path').attr('class', 'chart-gauge__rest');
  var label = gauge.append('text')
    .attr('class', 'chart-gauge__label')
    .attr('font-size', minDim/4)
    .attr('y', minDim/2.25);

  var labelVal = label.append('tspan')
    .attr('class', 'chart-gauge__value');
  var labelUnits = label.append('tspan')
    .attr('class', 'chart-gauge__units');

  var filledArc = d3.svg.arc().outerRadius(r+(t/2)).innerRadius(r-(t/2));
  var restArc = d3.svg.arc().outerRadius(r+(et/2) ).innerRadius(r-(et/2));

  var previousVal = 0;
  var render = function(val) {
    var inp = d3.interpolateNumber(previousVal, val);
    previousVal = val;
    gauge.transition().duration(timing).tween('move', function() {
      return function(percent) {
        var val = inp(percent);
        var theta = scale(val);

        filledArc.startAngle(minTheta).endAngle(theta - gap / 2);
        filled.attr('d', filledArc);

        restArc.startAngle(theta + gap / 2).endAngle(maxTheta);
        rest.attr('d', restArc);

        labelVal.text(labelFormat(val));
        labelUnits.text('/sec');
      };
    });
  };

  render(0);

  return render;
};
