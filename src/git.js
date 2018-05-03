const { exec } = require('child_process');

const createGitCommit = tag => new Promise((resolve) => {
  // const cmdAdd = 'git add composer.json';
  const cmdAdd = 'git add .';
  exec(cmdAdd, (err1) => {
    if (!err1) {
      const cmdCommit = `git commit -m ${tag}`;
      exec(cmdCommit, (err2) => {
        if (!err2) {
          resolve(tag);
        }
      });
    }
  });
});

const createGitTag = tag => new Promise((resolve) => {
  const cmd = `git tag -a ${tag} -m "${tag}"`;
  exec(cmd, (err) => {
    if (!err) {
      resolve(tag);
    }
  });
});

const pushGitTag = tag => new Promise((resolve) => {
  const cmd = `git push --follow-tags -f`;
  exec(cmd, (err) => {
    if (!err) {
      resolve(tag);
    }
  });
});

module.exports = {createGitCommit, createGitTag, pushGitTag};
