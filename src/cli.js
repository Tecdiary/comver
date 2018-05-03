#!/usr/bin/env node

const comver = require('./');

if (process.argv.length >= 3) {
  const args = process.argv[2].split(' ');
  comver(args).then((tag) => {
    console.log('Your version has been successfully bumped to '+tag);
  });
} else {
  console.error('Please specify version increment type: (major, minor, patch) or -h for help.');
}
