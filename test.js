'use strict';

const {join} = require('path');
const {mkdir} = require('fs');
const {promisify} = require('util');

const readdirClean = require('.');
const rmfr = require('rmfr');
const test = require('tape');
const writeFileAtomically = require('write-file-atomically');

test('readdirClean()', async t => {
  const tmp = join(__dirname, 'tmp');

  await rmfr(tmp);
  await promisify(mkdir)(tmp);
  await Promise.all([
    '__MACOSX',
    '.1',
    '2',
    'Thumbs.db'
  ].map(filename => writeFileAtomically(join(tmp, filename))));

  t.deepEqual(
    await readdirClean(tmp),
    ['.1', '2'],
    'should get paths in a directory without automatically generated contents'
  );

  try {
    await readdirClean(Buffer.from('__this_directory_does_not_exist__'));
  } catch (e) {
    t.equal(e.code, 'ENOENT', 'should fail when it cannot get contents.');
  }

  t.end();
});

test('Argument validation', t => {
  t.plan(3);

  readdirClean(/^/).catch(err => {
    t.equal(
      err.toString(),
      'TypeError: path must be a string or Buffer',
      'should invalidate a non-string value.'
    );
  });

  readdirClean().catch(err => {
    t.equal(
      err.toString(),
      'RangeError: Expected 1 argument (<string|Buffer|URL>), but got no arguments instead.',
      'should invalidate no arguments.'
    );
  });

  readdirClean('1', '2').catch(err => {
    t.equal(
      err.toString(),
      'RangeError: Expected 1 argument (<string|Buffer|URL>), but got 2 arguments instead.',
      'should invalidate too many arguments.'
    );
  });
});
