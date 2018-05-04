const fs = require('fs');
const path = require('path');
const { colors } = require('./colors');
const { getNextVersion } = require('./utils');
const { createGitCommit, createGitTag, pushGitTag, statusGit } = require('./git');

module.exports = args => new Promise((resolve) => {
    const type = args[0];
    const allowedTypes = ['patch', 'minor', 'major', '-v', '-h'];
    if (allowedTypes.includes(type)) {
        if (type == '-v' || type == '-h') {
            const cvPkg = require('../package.json');

            console.log(colors.fg.Cyan, colors.Bright, `
${cvPkg.name} -`, colors.fg.Magenta, `v${cvPkg.version}`, colors.Reset, `

${cvPkg.description}
By: ${cvPkg.author}

Help:`, colors.fg.Green, colors.Bright, `

    comver major    `, colors.Reset, `to bump major version 0.0.0 to 1.0.0`, colors.fg.Cyan, colors.Bright, `
    comver minor    `, colors.Reset, `to bump minor version 0.0.0 to 0.1.0`, colors.fg.Yellow, colors.Bright, `
    comver patch    `, colors.Reset, `to bump patch version 0.0.0 to 0.0.1`, colors.Reset, `

Please check https://semver.org/ to know more about Semantic Versioning.`);

        } else {
            const composerJson = path.join(process.cwd(), 'composer.json');
            fs.stat(composerJson, function(err, stat) {
                if (err == null) {
                    statusGit().then((res) => {
                        const pkg = require(composerJson);
                        const nextVersion = pkg.version ? getNextVersion(pkg.version, type) : '0.0.0';
                        pkg.version = nextVersion;
                        fs.writeFileSync(composerJson, JSON.stringify(pkg, null, '\t'));
                        try {
                            const packageJson = path.join(process.cwd(), 'package.json');
                            const nPkg = require(packageJson);
                            nPkg.version = nextVersion;
                            fs.writeFileSync(packageJson, JSON.stringify(nPkg, null, '\t'));
                        } catch (ex) {
                            console.log(colors.fg.Yellow, `Unable to set package.json version: `, ex);
                        }
                        const tagName = `v${nextVersion}`;
                        createGitCommit(tagName).then(createGitTag).then(pushGitTag).then(tag => resolve(tag));
                    }).catch((err) => {
                        console.log(colors.fg.Red, 'Working directory is not clean!', colors.Reset);
                        console.log(colors.fg.Yellow, 'Please commit your changes before versioning.', colors.Reset);
                    });
                } else if (err.code == 'ENOENT') {
                    console.log(colors.fg.Red, `Current working directory (`, colors.fg.Yellow, process.cwd(), colors.fg.Red, `) doesn't have`, colors.fg.Cyan, `composer.json`, colors.fg.Red, `file.`, colors.Reset);
                } else {
                    console.log(colors.fg.Red, `Error: `, err.code);
                }
            });
        }
    } else {
        console.log(colors.fg.Reb, `Unknown arg!`, colors.fg.Cyan, `please type 'comver -h' for help.`);
    }
});
