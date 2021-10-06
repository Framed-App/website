const readline = require('readline');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function versionExists(version) {
	var files = fs.readdirSync(path.join(__dirname, '..', '_posts'));

	for (var i = 0; i < files.length; i++) {
		var split = files[i].split('-');

		if (split[split.length - 1].replace(/\.[a-zA-Z0-9]+$/, '') === version) {
			return true;
		}
	}
}

rl.question('Version? ', (answer) => {
	var regex = /^v[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9a-zA-Z.]+)?$/;

	if (!answer.match(regex)) {
		console.error('Invalid version');
		return rl.close();
	}

	var date = moment().format('YYYY-MM-DD');
	var fileName = `${date}-${answer}.md`;
	var versionPath = path.join(__dirname, '..', '_posts', fileName);

	if (versionExists(answer)) {
		console.error('Version exists');
		return rl.close();
	}

	rl.question('Branch? Valid options are [beta, stable]. ', (branch) => {
		var _validBranches = ['beta', 'stable'];

		if (!_validBranches.includes(branch)) {
			console.error('Invalid branch');
			return rl.close();
		}

		var template = `---\nlayout: docs\ntitle: "${answer}"\ndate: ${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}\ncategories: ${branch}\ntoc: true\n---\n`;

		fs.writeFile(versionPath, template, (err) => {
			if (err) {
				console.error(err);
				return rl.close();
			}

			console.log('Version created');
			rl.close();
		});
	});
});