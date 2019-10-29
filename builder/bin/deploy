#!/usr/bin/env node
'use strict';

const program = require('commander');

program
  .option('--config <config>', 'webpack config file, isRequired')
  .option('--env <env>', 'NODE_ENV', 'production')
  .option('--prefix <prefix>', 'project web url prefix, isRequired')
  .option('--title <title>', 'web app title', '')
  .option('--analyzer', 'analysis webpack build package, only deploy')
  .option('--tar', 'build tar.gz file, only deploy', true)
  .action(function(p) {
    p.env = p.env || 'production';
    if (!p.prefix) {
      throw Error(`args prefix cannot ${p.prefix}, isRequired`);
    }
    if (!p.config) {
      throw Error(`args config cannot ${p.config}, isRequired`);
    }
    p.analyzer = !!p.analyzer;
    p.tar = !!p.tar;
  })
  .parse(process.argv);
require('../scripts/deploy')(program);
