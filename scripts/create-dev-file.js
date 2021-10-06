const fs = require('fs');
const path = require('path');

var devFilePath = path.join(__dirname, '..', '-DEV');

if (!fs.existsSync(devFilePath)) {
	fs.writeFile(devFilePath, '', (err) => {
		if (err) {
			console.error(err);
			return process.exit(1);
		}

		console.log('Dev file created');
	});
}