'use strict';

const {promisify} = require('util');
const {readdir} = require('fs');

const isActualContent = require('junk').not;

const promisifiedReaddir = promisify(readdir);

module.exports = async function readdirClean(...args) {
	const argLen = args.length;

	if (argLen !== 1) {
		throw new RangeError(`Expected 1 argument (<string|Buffer|Uint8Array|URL>), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments instead.`);
	}

	return (await promisifiedReaddir(args[0])).filter(isActualContent);
};
