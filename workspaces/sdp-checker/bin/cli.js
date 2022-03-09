#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const fg = require('fast-glob');
const server = require('../server');

program.version(require('../package.json').version);
program.parse(process.argv);

const cwd = path.join(process.cwd(), program.args[0]);
const projectJson = require(require.resolve('./package.json', {
  paths: [cwd],
}));
const handler = {
  get: function (obj, prop) {
    return prop in obj ? obj[prop] : 0;
  },
  set: function (obj, prop, value) {
    obj[prop] = obj[prop] === undefined ? 1 : value;
    return true;
  },
};

const inDep = new Proxy({}, handler);
const outDep = new Proxy({}, handler);
const subpackages = fg
  .sync(
    projectJson.workspaces.map((v) => v + '/*.json'),
    { cwd }
  )
  .map((subpackage) => {
    const subPackageJson = path.resolve(cwd, subpackage);
    const json = require(subPackageJson);
    const name = json.name;
    return {
      name,
      dependencies: json.dependencies,
    };
  });
if (subpackages.length === 0) {
  throw new Error(
    '好像没有探测到subpackages...麻烦检查一下yarn workspaces的配置吧。'
  );
}

for (const { name, dependencies = {} } of subpackages) {
  for (const key of Object.keys(dependencies)) {
    inDep[key] = inDep[key] + 1;
  }
  outDep[name] = Object.keys(dependencies).length;
}

const dep = Array.from(new Set(Object.keys(inDep).concat(Object.keys(outDep))));
const S = {};
const score = {};
function calc(package) {
  return (outDep[package] / (outDep[package] + inDep[package])).toFixed(2);
}
dep.sort((a, b) => calc(b) - calc(a));
dep.forEach((d) => {
  S[d] = calc(d);
  if (S[d] >= 0.6) {
    score[d] = 'flexible';
  } else if (S[d] >= 0.4) {
    score[d] = 'normal';
  } else {
    score[d] = 'stable';
  }
});

server.report(projectJson.name, dep, inDep, outDep, S, score);
