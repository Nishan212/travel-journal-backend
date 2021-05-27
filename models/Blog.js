const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new mongoose.Schema(
	{
		public: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			require: true,
			minlength: 4,
			maxlength: 50,
		},
		body: {
			type: String,
			require: true,
			minlength: 4,
		},
		short: {
			type: String,
		},
		images: {
			type: [String],
		},
		location: {
			type: String,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Blog = mongoose.model('Blog', BlogSchema);

exports.Blog = Blog;
exports.BlogSchema = BlogSchema;
