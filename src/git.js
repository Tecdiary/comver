const { exec } = require('child_process');

const createGitCommit = tag => new Promise((resolve) => {
  // const cmdAdd = 'git add composer.json';
  console.log("git adding...");
  const cmdAdd = 'git add .';
  exec(cmdAdd, (err1) => {
    if (!err1) {
      console.log("git committing...");
      const cmdCommit = `git commit -m ${tag}`;
      exec(cmdCommit, (err2) => {
        if (!err2) {
          resolve(tag);
        } else {
          console.error(err2);
        }
      });
    } else {
      console.error(err1);
    }
  });
});

const statusGit = () => new Promise((resolve, reject) => {
  console.log("git status...");
  const cmd = `git status --porcelain`;
  exec(cmd, (err, stdout, stderr) => {
    if (!err) {
      if (stdout) {
        reject(stdout);
      } else {
        resolve();
      }
    } else {
      console.error(err);
    }
  });
});

const createGitTag = tag => new Promise((resolve) => {
  console.log("git tagging...");
  const cmd = `git tag -a ${tag} -m "${tag}"`;
  exec(cmd, (err) => {
    if (!err) {
      resolve(tag);
    } else {
      console.error(err);
    }
  });
});

const pushGitTag = tag => new Promise((resolve) => {
  console.log("git pushing...");
  const cmd = `git push --follow-tags -f`;
  exec(cmd, (err) => {
    if (!err) {
      resolve(tag);
    } else {
      console.error(err);
    }
  });
});

module.exports = {createGitCommit, createGitTag, pushGitTag, statusGit};
