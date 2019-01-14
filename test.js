'use strict';

const {join} = require('path');
const {mkdir, writeFile} = require('fs').promises;

const readdirClean = require('.');
const rmfr = require('rmfr');
const test = require('tape');

test('readdirClean()', async t => {
	const tmp = join(__dirname, 'tmp');

	await rmfr(tmp);
	await mkdir(tmp);
	await Promise.all([
		'__MACOSX',
		'.1',
		'2',
		'Thumbs.db'
	].map(async filename => writeFile(join(tmp, filename))));

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

test('Argument validation', async t => {
	t.plan(3);

	try {
		await readdirClean(/^/u);
		t.fail('Unexpectedly succeeded.');
	} catch ({code}) {
		t.equal(
			code,
			'ERR_INVALID_ARG_TYPE',
			'should invalidate a non-string value.'
		);
	}

	try {
		await readdirClean();
		t.fail('Unexpectedly succeeded.');
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected 1 argument (<string|Buffer|Uint8Array|URL>), but got no arguments instead.',
			'should invalidate no arguments.'
		);
	}

	try {
		await readdirClean('1', '2');
		t.fail('Unexpectedly succeeded.');
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected 1 argument (<string|Buffer|Uint8Array|URL>), but got 2 arguments instead.',
			'should invalidate too many arguments.'
		);
	}
});
