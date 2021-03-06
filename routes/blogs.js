const express = require('express');
const mongoose = require('mongoose');
const { Blog } = require('../models/Blog');
const { User } = require('../models/User');
const validateObjectId = require('../middleware/validateObjectId');
const { verifyUser } = require('../config/authenticate');

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const blogs = await Blog.find({ public: true }).populate({
			path: 'user',
			select: '-password',
		});

		return res.status(200).json(blogs);
	} catch (err) {
		console.log(err.message);
		res.status(404).json({
			error: err.message,
		});
	}
});

router.post('/', async (req, res, next) => {
	const { public, title, body, images, location } = req.body;

	const short = body.length < 51 ? body : body.slice(0, 50) + '...';

	try {
		const user = await User.findOne({
			email: 'dalmeida@gmail.com',
		}).select('-password');
		if (!user)
			return res.status(400).json({
				error: 'User does not exist',
			});

		const blog = new Blog({
			public,
			title,
			body,
			short,
			images,
			location,
			user,
		});

		await blog.save();

		return res.status(200).json({
			success: true,
			blog,
		});
	} catch (err) {
		console.log(err.message);
		res.status(404).json({
			error: err.message,
		});
	}
});

// TODO: get the blog only if public or the user is the author of it
router.get('/:id', validateObjectId, async (req, res, next) => {
	const { id } = req.params;

	try {
		const blog = await Blog.findOne({
			_id: id,
		});
		return res.status(200).json(blog);
	} catch (err) {
		console.log(err.message);
		res.status(404).json({
			error: err.message,
		});
	}
});

router.put('/:id', validateObjectId, async (req, res, next) => {
	const { id } = req.params;
	const { public, title, body, images, location } = req.body;
	console.log(public, req.body.public);

	const short = body
		? body.length < 51
			? body
			: body.slice(0, 50) + '...'
		: undefined;

	try {
		const user = await User.findOne({
			email: 'dalmeida@gmail.com',
		}).select('-password');
		if (!user)
			return res.status(400).json({
				error: 'User does not exist',
			});

		const blog = await Blog.findByIdAndUpdate(
			{
				_id: id,
			},
			{
				public,
				title,
				body,
				short,
				images,
				location,
			},
			{
				new: true,
			}
		);
		if (!blog)
			return res.status(400).json({
				error: 'Blog does not exist',
			});

		return res.status(200).json(blog);
	} catch (err) {
		console.log(err.message);
		res.status(404).json({
			error: err.message,
		});
	}
});

module.exports = router;
