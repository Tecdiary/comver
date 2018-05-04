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
            const libPkg = path.resolve('package.json');
            const cvPkg = require(libPkg);

            console.log(colors.fg.Cyan, `
${cvPkg.name} -`, colors.fg.Magenta, `v${cvPkg.version}`, colors.Reset, `

${cvPkg.description}
By: ${cvPkg.author}

Help:`, colors.fg.Green, `

  comver major  - to bump major version 0.0.0 to 1.0.0`, colors.fg.Cyan, `
  comver minor  - to bump minor version 0.0.0 to 0.1.0`, colors.fg.Yellow, `
  comver patch  - to bump patch version 0.0.0 to 0.0.1`, colors.Reset, `

Please check https://semver.org/ to know more about Semantic Versioning.`);

        } else {
            statusGit().then((res) => {
                const composerJson = path.join(process.cwd(), 'composer.json');
                fs.stat(composerJson, function(err, stat) {
                    if(err == null) {
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
                            console.log(colors.fg.Yellow, `Error: `, ex);
                        }

                        const tagName = `v${nextVersion}`;
                        createGitCommit(tagName).then(createGitTag).then(pushGitTag).then(tag => resolve(tag));
                    } else if(err.code == 'ENOENT') {
                        console.log(colors.fg.Red, `Current working directory doesn't have composer.json file.`, colors.Reset);
                    } else {
                        console.log(colors.fg.Red, `Error: `, err.code);
                    }
                });
            }).catch((err) => {
                console.log(colors.fg.Red, 'Working directory is not clean!', colors.Reset);
                console.log(colors.fg.Yellow, 'Please commit your changes before versioning.', colors.Reset);
            });
        }
    } else {
        console.log(colors.fg.Reb, `Unknown arg!', colors.fg.Cyan, 'please type 'comver -h' for help.`);
    }
});
