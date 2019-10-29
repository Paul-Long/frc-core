#!/usr/bin/env node
'use strict';

const program = require('commander');

program
  .option('--config <config>', 'webpack config')
  .option('--env <env>', 'NODE_ENV', 'development')
  .option('--prefix <prefix>', 'app url prefix')
  .option('--title <title>', 'web title', '')
  .action(function(p) {
    p.env = p.env || 'development';
    if (!p.prefix) {
      throw Error(`args prefix cannot ${p.prefix}, isRequired`);
    }
    if (!p.config) {
      throw Error(`args prefix cannot ${p.config}, isRequired`);
    }
  })
  .parse(process.argv);
require('../scripts/start')(program);
