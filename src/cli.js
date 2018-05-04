#!/usr/bin/env node

const comver = require('./');
const { colors } = require('./colors');

if (process.argv.length >= 3) {
    const args = process.argv[2].split(' ');
    comver(args).then((tag) => {
        console.log(colors.fg.Green, 'Your version has been successfully bumped to ', colors.fg.Cyan, tag, colors.Reset);
    });
} else {
    console.error(colors.fg.Yellow, `Please specify version increment type: (`, colors.fg.Cyan, `major, minor, patch`, colors.fg.Yellow, `) or -h for help.`, colors.Reset);
}
