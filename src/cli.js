#!/usr/bin/env node

const comver = require('./');
const { statusGit } = require('./git');

statusGit().then((res) => {
  console.log(res);
  if (process.argv.length >= 3) {
    const args = process.argv[2].split(' ');
    comver(args).then((tag) => {
      console.log('Your version has been successfully bumped to ' + tag);
    });
  } else {
    console.error('Please specify version increment type: (major, minor, patch) or -h for help.');
  }
}).catch((err) => {
  console.error('Working directory is not clean! Please commit your changes before versioning.');
  console.log(err);
});
