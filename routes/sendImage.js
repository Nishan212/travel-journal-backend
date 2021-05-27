const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/:img', (req, res, next) => {
	const { img } = req.params;
	try {
		const filePath = path.join(__dirname, '\\..\\public\\' + img);

		if (!fs.existsSync(filePath))
			return res.status(404).json({
				error: 'Requested file does not exist',
			});

		res.sendFile(filePath);
	} catch (err) {
		console.log(err.message);
		res.status(404).json({
			error: err.message,
		});
	}
});

module.exports = router;
