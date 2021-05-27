const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/:img', (req, res, next) => {
	const { img } = req.params;
	try {
		res.sendFile(path.join(__dirname, '\\..\\public\\' + img));
	} catch (err) {
		console.log(err.message);
		res.status(404).json({
			error: err.message,
		});
	}
});

module.exports = router;
