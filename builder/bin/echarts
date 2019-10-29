#!/usr/bin/env node
'use strict';

const program = require('commander');

program
  .option('-i, --in <in>', 'echarts components, isRequired')
  .option('-o, --out <out>', 'dest filename, isRequired', 'echarts.min.js')
  .option('-m, --min <min>', 'minimize ', true)
  .action(function(p) {
    if (!p.in) {
      throw Error(`args in cannot ${p.prefix}, isRequired`);
    }
    p.min = !!p.min;
  })
  .parse(process.argv);
require('../scripts/echarts')(program);
