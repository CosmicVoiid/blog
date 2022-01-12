const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const Comment = require("../models/comment");

exports.comment_get = (req, res, next) => {
	jwt.verify(
		req.token,
		process.env.SECRET_KEY || process.env.SECRET_KEY_DEV,
		(err, authData) => {
			if (err) return res.sendStatus(403);
			Comment.find({ post: req.params.postId }).exec((err, result) => {
				if (err) return res.sendStatus(400);
				res.json({ results: result, authData });
			});
		}
	);
};

exports.comment_post = [
	body("content", "Content must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),

	(req, res, next) => {
		jwt.verify(
			req.token,
			process.env.SECRET_KEY || process.env.SECRET_KEY_DEV,
			(err, authData) => {
				if (err) return res.sendStatus(403);

				const errors = validationResult(req);

				const comment = new Comment({
					content: req.body.content,
					user: req.body.user,
					post: req.body.post,
				});

				if (!errors.isEmpty()) {
					res.json({
						message: "There are errors with your request",
						errors: errors.array(),
						authData,
					});
					return;
				}

				comment.save((err, result) => {
					if (err) {
						res.json({
							message: "Errors with saving to database",
							errors: err,
						});
						return next(err);
					}

					res.json({
						message: "Successfully stored to database",
						result: comment,
						authData,
					});
				});
			}
		);
	},
];

exports.comment_put = [
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

					const comment = new Post({
						_id: req.params.id,
						title: req.body.title,
						content: req.body.content,
						author: req.body.author,
						published: req.body.published,
					});

					comment.findByIdAndUpdate(req.params.id, comment, {}, (err) => {
						if (err) {
							res.json({ message: "Comment not found" });
							return;
						}
						res.json({ message: "Comment Updated", authData });
					});
				}
			}
		);
	},
];

exports.comment_delete = (req, res, next) => {
	jwt.verify(
		req.token,
		process.env.SECRET_KEY || process.env.SECRET_KEY_DEV,
		(err, authData) => {
			if (err) return res.sendStatus(403);
			Comment.findById(req.params.id).exec((err, result) => {
				if (err) {
					res.status(404).json({ message: "Comment does not exist" });
					return;
				}
				Comment.findByIdAndRemove(req.params.id, (err) => {
					if (err) return res.sendStatus(503);
					res.json({ message: "Comment deleted" });
				});
			});
		}
	);
};
