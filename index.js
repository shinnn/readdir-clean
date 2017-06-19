'use strict';

var isNotJunk = require('junk').not;
var PinkiePromise = require('pinkie-promise');
var readdir = require('graceful-fs').readdir;

var PATH_ERROR = 'Expected a directory path';

module.exports = function readdirClean(dir) {
  return new PinkiePromise(function(resolve, reject) {
    if (typeof dir !== 'string') {
      throw new TypeError(PATH_ERROR + ' (string), but got ' + dir + '.');
    }

    if (dir.length === 0) {
      throw new TypeError(PATH_ERROR + ', but got \'\' (empty string).');
    }

    readdir(dir, function(err, paths) {
      if (err) {
        reject(err);
        return;
      }

      resolve(paths.filter(isNotJunk));
    });
  });
};
