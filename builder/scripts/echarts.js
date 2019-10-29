'use strict';
const join = require('path').join;
const {buildCharts} = require('../src');

exports = module.exports = function(program) {
  const option = {
    in: join(process.cwd(), program.in),
    out: join(process.cwd(), program.out)
  };
  buildCharts(option, function(code) {
    process.exit(code);
  });
};
