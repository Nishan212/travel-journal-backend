const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET_KEY,
};

exports.getToken = function (user) {
	return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 360000 });
};

exports.localPassport = passport.use(
	'local',
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		async (email, password, done) => {
			await User.findOne({ email }, async (err, user) => {
				if (err) {
					return done(err);
				}

				if (!user) {
					return done(new Error('Email not registered'));
				}

				const isMatch = await bcrypt.compare(password, user.password);

				if (!isMatch) {
					return done(new Error('Incorrect password'));
				}

				return done(null, user);
			});
		}
	)
);

exports.jwtPassport = passport.use(
	'jwt',
	new JwtStrategy(options, async (jwt_payload, done) => {
		await User.findById(jwt_payload._id, (err, user) => {
			if (err) {
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	})
);

exports.verifyUser = passport.authenticate('jwt', {
	session: false,
	failWithError: true,
});
