const mongoose = require('mongoose');

module.exports = async function () {
	const db = process.env.DB_URI;

	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});
		console.log('Mongo Connected');
	} catch (err) {
		console.log(err.message);
		process.exit(1);
	}
};
