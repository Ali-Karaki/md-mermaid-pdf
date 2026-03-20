'use strict';

const path = require('path');

function mdToPdfPackageRoot() {
	return path.dirname(require.resolve('md-to-pdf/package.json'));
}

/** @param {...string} segments */
function mdToPdfLib(...segments) {
	return path.join(mdToPdfPackageRoot(), 'dist', 'lib', ...segments);
}

module.exports = { mdToPdfPackageRoot, mdToPdfLib };
