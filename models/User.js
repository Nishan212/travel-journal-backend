const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			maxlength: 30,
			required: true,
		},
		email: {
			type: String,
			minlength: 5,
			maxlength: 50,
			required: true,
		},
		password: {
			type: String,
			minlength: 5,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.userSchema = userSchema;
