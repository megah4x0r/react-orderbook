module.exports = () => ({
	preCmds: [
	],
	postCmds: [
		['/usr/bin/env', ['npm', 'install', '--save-dev', '@jduarter/expo-cli@4.6.0-alpha.0-jduarter.0']],
		['/usr/bin/env', ['npm', 'install', '--save-dev', 'postcss']],
		['./node_modules/.bin/expo-cli', ['customize:web', '--yes']],
		['/bin/cp', ['./expoize/index.html', './web/index.html']],
		['/bin/cp', ['./expoize/babel.config.js', './babel.config.js']]
	]
});
