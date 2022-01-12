const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");

exports.post_get = (req, res) => {
	jwt.verify(
		req.token,
		process.env.SECRET_KEY || process.env.SECRET_KEY_DEV,
		(err, authData) => {
			if (err) res.sendStatus(403);
			else {
				Post.find()
					.populate("author")
					.exec((err, result) => {
						if (err) res.sendStatus(404);
						res.json({
							message:
								"To post data, format must be { title: title, content: content, author: authData, published: Boolean }",
							results: result,
							authData: authData,
						});
					});
			}
		}
	);
};

exports.post_post = [
	body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
	body("content", "Content must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),

	(req, res, next) => {
		jwt.verify(
			req.token,
			process.env.SECRET_KEY || process.env.SECRET_KEY_DEV,
			(err, authData) => {
				if (err) {
					res.sendStatus(403);
				} else {
					const errors = validationResult(req);

					const post = new Post({
						title: req.body.title,
						content: req.body.content,
						author: req.body.author,
						published: req.body.published,
					});

					if (!errors.isEmpty()) {
						res.json({
							message: "There are errors with your request",
							errors: errors.array(),
							authData,
						});
						return;
					}

					post.save((err, result) => {
						if (err) {
							res.json({
								message: "Errors with saving to database",
								errors: err,
							});
							return next(err);
						}

						res.json({
							message: "Successfully stored to database",
							result: post,
							authData,
						});
					});
				}
			}
		);
	},
];

exports.post_put = [
	body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
	body("content", "Content must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),

	(req, res, next) => {
		jwt.verify(
			req.token,
			process.env.SECRET_KEY || process.env.SECRET_KEY_DEV,
			(err, authData) => {
				if (err) {
					res.sendStatus(403);
				} else {
					const errors = validationResult(req);

					if (!errors.isEmpty()) {
						res.json({
							message: "There are errors with your request",
							errors: errors.array(),
							authData,
						});
						return;
					}

					const post = new Post({
						_id: req.params.id,
						title: req.body.title,
						content: req.body.content,
						author: req.body.author,
						published: req.body.published,
					});

					Post.findByIdAndUpdate(
						req.params.id,
						post,
						{},
						(err, updatedPost) => {
							if (err) {
								res.json({ message: "Post not found" });
								return;
							}
							res.json({ message: "Post Updated", authData });
						}
					);
				}
			}
		);
	},
];

exports.post_delete = (req, res, next) => {
	jwt.verify(
		req.token,
		process.env.SECRET_KEY || process.env.SECRET_KEY_DEV,
		(err, authData) => {
			if (err) return res.sendStatus(403);
			Post.findById(req.params.id).exec((err, result) => {
				if (err) {
					res.status(404).json({ message: "Post does not exist" });
					return;
				}
				Post.findByIdAndRemove(req.params.id, (err) => {
					if (err) return res.sendStatus(503);
					res.json({ message: "Post deleted" });
				});
			});
		}
	);
};
