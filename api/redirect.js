const axios = require('axios').default;
const semver = require('semver');

module.exports = (req, res) => {
	var version = req.query.version;

	const docsURL = `https://${req.headers.host}`;

	if (!version) {
		return res.status(400).send('Version is required');
	}

	var regex = /^v[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9a-zA-Z.]+)?$/;

	if (!version.match(regex)) {
		return res.status(400).send('Invalid version');
	}

	axios.get(`${docsURL}/static-json/versions.json`).then(function(response) {
		var data = [...response.data.beta, ...response.data.stable].sort((a, b) => semver.gt(a, b) ? 1 : -1);

		console.log(data);

		if (data.includes(version)) {
			return res.redirect(`${docsURL}/docs/${version}`);
		}

		var requestedVersion = version.replace(/^v/, '');

		var closestVersion = '';
		for (var i = 0; i < data.length; i++) {
			var _thisVersion = data[i].replace(/^v/, '');
			if (semver.gt(_thisVersion, requestedVersion)) {
				continue;
			}

			closestVersion = _thisVersion;
		}

		console.log(closestVersion, _thisVersion);

		if (!closestVersion) {
			return res.status(404).end('Failed to find previous version');
		} else {
			res.redirect(`${docsURL}/docs/v${closestVersion}?from-version=${version}`);
		}
	}).catch(function (error) {
		console.error(error);
		res.status(500).send('An error occurred');
	});
};