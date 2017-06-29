'use strict';

const inspectWithKind = require('inspect-with-kind');
const isActualContent = require('junk').not;
const {readdir} = require('graceful-fs');

const PATH_ERROR = 'Expected a directory path';

module.exports = function readdirClean(...args) {
  return new Promise((resolve, reject) => {
    const argLen = args.length;

    if (argLen !== 1) {
      throw new RangeError(`Expected 1 argument (string), but got ${
        argLen === 0 ? 'no' : argLen
      } arguments instead.`);
    }

    const [dir] = args;

    if (typeof dir !== 'string') {
      throw new TypeError(`${PATH_ERROR} (string), but got ${inspectWithKind(dir)}.`);
    }

    if (dir.length === 0) {
      throw new TypeError(`${PATH_ERROR}, but got '' (empty string).`);
    }

    readdir(dir, (err, paths) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(paths.filter(isActualContent));
    });
  });
};
