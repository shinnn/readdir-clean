# readdir-clean

[![NPM version](https://img.shields.io/npm/v/readdir-clean.svg)](https://www.npmjs.com/package/readdir-clean)
[![Build Status](https://travis-ci.org/shinnn/readdir-clean.svg?branch=master)](https://travis-ci.org/shinnn/readdir-clean)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/readdir-clean.svg)](https://coveralls.io/github/shinnn/readdir-clean?branch=master)

Like [`fs.readdir`](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback) but excludes contents automatically generated by OS, for example `.DS_Store` and `Thumbs.db`

```javascript
const {readdirSync} = require('fs');
const readdirClean = require('readdir-clean');

(async () => {
  readdirSync('.');
  /*=> [
    '.DS_Store',
    '.AppleDouble',
    '.LSOverride',
    'a.txt',
    'b.txt',
    'Thumbs.db'
  ] */

  await readdirClean();
  /*=> [
    'a.txt',
    'b.txt'
  ] */
})();
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install readdir-clean
```

## API

```javascript
const readdirClean = require('readdir-clean');
```

### readdirClean(*path*)

*path*: `string` (directory path)  
Return: `Promise<Array>`

Similar to [Node.js](https://nodejs.org) built-in `fs.readdir`, but different in the following points:

* Returns a [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* Doesn't support `encoding` option
* The paths are filtered with [`require('junk').not`](https://github.com/sindresorhus/junk#junknotfilename)

```javascript
readdirClean('path/to/dir').then(paths => {
  paths.includes('.Spotlight-V100'); //=> false
  paths.includes('.Trashes'); //=> false
  paths.includes('Desktop.ini'); //=> false
});
```

## License

[Creative Commons Zero v1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/deed)
