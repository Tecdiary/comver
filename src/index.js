const path = require('path');
const fs = require('fs');
const { getNextVersion } = require('./utils');
const { createGitCommit, createGitTag, pushGitTag } = require('./git');

module.exports = args => new Promise((resolve) => {
  const type = args[0];
  const allowedTypes = ['patch', 'minor', 'major', '-v', '-h'];
  if (allowedTypes.includes(type)) {
    if (type == '-v' || type == '-h') {
      const libPkg = path.resolve('package.json');
      const cvPkg = require(libPkg);
      console.log(`
${cvPkg.name} v${cvPkg.version}

${cvPkg.description}
By: ${cvPkg.author}

Help:
  comver major  - to bump major version 0.0.0 to 1.0.0
  comver minor  - to bump minor version 0.0.0 to 0.1.0
  comver patch  - to bump patch version 0.0.0 to 0.0.1

Please check https://semver.org/ to know more about Semantic Versioning.
      `);
    } else {
      const composerJson = path.join(process.cwd(), 'composer.json');
      const packageJson = path.join(process.cwd(), 'package.json');
      const pkg = require(composerJson);
      const nPkg = require(packageJson);
      const nextVersion = pkg.version ? getNextVersion(pkg.version, type) : '0.0.0';
      const nNextVersion = nPkg.version ? getNextVersion(nPkg.version, type) : '0.0.0';
      pkg.version = nextVersion;
      nPkg.version = nNextVersion;
      fs.writeFileSync(composerJson, JSON.stringify(pkg, null, '\t'));
      fs.writeFileSync(packageJson, JSON.stringify(nPkg, null, '\t'));

      const tagName = `v${nextVersion}`;
      createGitCommit(tagName).then(createGitTag).then(pushGitTag).then(tag => resolve(tag));
    }
  } else {
    console.log(`Unknown arg! please type 'comver -h' for help.`);
  }
});
