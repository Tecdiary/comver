const { colors } = require('./colors');
const { exec } = require('child_process');

const createGitCommit = tag => new Promise((resolve) => {
    // const cmdAdd = 'git add composer.json';
    console.log(colors.fg.Cyan, `git add...`, colors.Reset);
    const cmdAdd = 'git add .';
    exec(cmdAdd, (err1) => {
        if (!err1) {
            console.log(colors.fg.Cyan, `git commit...`, colors.Reset);
            const cmdCommit = `git commit -m ${tag}`;
            exec(cmdCommit, (err2) => {
                if (!err2) {
                    resolve(tag);
                } else {
                    console.log(colors.fg.Red, err2, colors.Reset);
                }
            });
        } else {
            console.log(colors.fg.Red, err1, colors.Reset);
        }
    });
});

const statusGit = () => new Promise((resolve, reject) => {
    console.log(colors.fg.Cyan, `git status...`, colors.Reset);
    const cmd = `git status --porcelain`;
    exec(cmd, (err, stdout, stderr) => {
        if (!err) {
            if (stdout) {
                reject(stdout);
            } else {
                resolve();
            }
        } else {
            reject(err);
        }
    });
});

const createGitTag = tag => new Promise((resolve) => {
    console.log(colors.fg.Cyan, `git tag...`, colors.Reset);
    const cmd = `git tag -s ${tag} -m "${tag}"`;
    exec(cmd, (err) => {
        if (!err) {
            resolve(tag);
        } else {
            console.log(colors.fg.Red, err, colors.Reset);
        }
    });
});

const pushGitTag = tag => new Promise((resolve) => {
    console.log(colors.fg.Cyan, `git push...`, colors.Reset);
    const cmd = `git push --follow-tags`;
    exec(cmd, (err) => {
        if (!err) {
            resolve(tag);
        } else {
            console.log(colors.fg.Red, err, colors.Reset);
        }
    });
});

module.exports = { createGitCommit, createGitTag, pushGitTag, statusGit };
