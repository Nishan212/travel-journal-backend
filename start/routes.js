const express = require('express');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');
const users = require('../routes/users');
const blogs = require('../routes/blogs');
const upload = require('../routes/upload');
const sendImg = require('../routes/sendImage');

module.exports = function (app) {
	app.use(express.json());
	app.use(cors());
	app.use(morgan('dev'));
	app.use(passport.initialize());

	app.use('/api/users', users);
	app.use('/api/blogs', blogs);
	app.use('/api/upload', upload);
	app.use('/api/send', sendImg);

	app.all('*', (req, res, next) => {
		return res.status(404).json({ error: 'Route not found' });
	});

	app.use((err, req, res, next) => {
		return res.status(400).json({
			error: err.message,
		});
	});
};
