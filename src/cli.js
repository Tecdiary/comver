#!/usr/bin/env node

const comver = require('./');

if (process.argv.length >= 3) {
  const args = process.argv[2].split(' ');
  comver(args).then((tag) => {
    console.log(tag);
  });
} else {
  console.error('Please specify version increment type: (major, minor, patch)');
}
