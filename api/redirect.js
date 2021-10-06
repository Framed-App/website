const axios = require('axios').default;
const docsURL = 'https://framed-docs-truewinter.vercel.app';

module.exports = (req, res) => {
	var version = req.query.version;

	console.log(req);

	if (!version) {
		return res.status(400).send('Version is required');
	}

	var regex = /^v[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9a-zA-Z.]+)?$/;

	if (!version.match(regex)) {
		return res.status(400).send('Invalid version');
	}

	axios.get(`${docsURL}/static-json/versions.json`).then(function(response) {
		var data = [...response.data.beta, ...response.data.stable];

		if (data.includes(version)) {
			return res.redirect(`${docsURL}/docs/${version}`);
		}

		var requestedVersion = version.replace(/^v/, '');
		data.sort();

		var closestVersion = '';
		for (var i = 0; i < data.length; i++) {
			var _thisVersion = data[i].replace(/^v/, '');
			if (_thisVersion > requestedVersion) {
				continue;
			}

			closestVersion = _thisVersion;
		}

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