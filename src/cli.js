#!/usr/bin/env node

const comver = require('./');
const { colors } = require('./colors');
const { statusGit } = require('./git');

statusGit().then((res) => {
  if (process.argv.length >= 3) {
    const args = process.argv[2].split(' ');
    comver(args).then((tag) => {
      console.log(colors.fg.Green, 'Your version has been successfully bumped to ', colors.fg.Cyan, tag, colors.Reset);
    });
  } else {
    console.error(colors.fg.Yellow, 'Please specify version increment type: (major, minor, patch) or -h for help.', colors.Reset);
  }
}).catch((err) => {
  console.log(colors.fg.Red, 'Working directory is not clean!', colors.Reset);
  console.log(colors.fg.Yellow, 'Please commit your changes before versioning.', colors.Reset);
  // console.log(err);
});
