const path = require('path');
const fs = require('fs');
const { getNextVersion } = require('./utils');
const { createGitCommit, createGitTag, pushGitTag } = require('./git');

module.exports = args => new Promise((resolve) => {
  const composerJson = path.join(process.cwd(), 'composer.json');
  const packageJson = path.join(process.cwd(), 'package.json');

  const pkg = require(composerJson);
  const nPkg = require(packageJson);
  const type = args[0];

  const nextVersion = pkg.version ? getNextVersion(pkg.version, type) : '0.0.0';
  const nNextVersion = nPkg.version ? getNextVersion(nPkg.version, type) : '0.0.0';
  pkg.version = nextVersion;
  nPkg.version = nNextVersion;

  fs.writeFileSync(composerJson, JSON.stringify(pkg, null, '\t'));
  fs.writeFileSync(packageJson, JSON.stringify(nPkg, null, '\t'));

  const tagName = `v${nextVersion}`;
  createGitCommit(tagName)
    .then(createGitTag)
    .then(pushGitTag)
    .then(tag => resolve(tag));
});
