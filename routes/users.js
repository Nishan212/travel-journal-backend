const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const authenticate = require('../config/authenticate');
const router = express.Router();

router.post('/register', async (req, res, next) => {
	const { name, email, password } = req.body;

	try {
		const existingUser = await User.findOne({
			email,
		});
		if (existingUser)
			return res.status(400).json({
				error: 'User with this email exists',
			});

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const user = new User({
			name: name,
			email: email,
			password: hashPassword,
		});

		await user.save();

		return res.status(200).json({
			success: true,
			message: 'User created',
		});
	} catch (err) {
		console.log(err.message);
		res.status(404).json({
			error: err.message,
		});
	}
});

router.post('/login', async (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		try {
			if (err || !user) {
				return res.status(400).json({
					error: err !== null ? err.message : 'Body empty',
				});
			}

			req.login(user, { session: false }, err => {
				if (err)
					return res.status(400).json({
						error: err.message,
					});

				const body = { _id: user._id, email: user.email };
				const token = authenticate.getToken(body);

				return res.json({ success: true, token: token });
			});
		} catch (err) {
			return res.status(400).json({
				err,
			});
		}
	})(req, res, next);
});

module.exports = router;
