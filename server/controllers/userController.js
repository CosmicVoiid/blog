const bcrypt = require("bcryptjs/dist/bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.user_get = (req, res) => {
	jwt.verify(
		req.token,
		process.env.SECRET_KEY || process.env.SECRET_KEY_DEV,
		(err, authData) => {
			if (err) res.sendStatus(403);
			else {
				User.find().exec((err, result) => {
					if (err) res.sendStatus(404);
					res.json({
						message:
							"To post user, format must be { first_name, last_name, username, password}",
						results: result,
						authData: authData,
					});
				});
			}
		}
	);
};

exports.user_post = [
	body("first_name", "First name must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("last_name", "Last name must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("username", "Username must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("password", "Password must not be empty")
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

					bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
						if (err) res.sendStatus("400");

						const user = new User({
							first_name: req.body.first_name,
							last_name: req.body.last_name,
							username: req.body.username,
							password: hashedPassword,
						});

						user.save((err, result) => {
							if (err) {
								res.json({
									message: "Errors with saving to database",
									errors: err,
								});
								return next(err);
							}

							res.json({
								message: "Successfully stored to database",
								result: user,
								authData,
							});
						});
					});
				}
			}
		);
	},
];

exports.user_put = [
	body("first_name", "First name must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("last_name", "Last name must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("username", "Username must not be empty")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("password", "Password must not be empty")
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

					bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
						if (err) res.sendStatus("400");

						const user = new User({
							_id: req.params.id,
							first_name: req.body.first_name,
							last_name: req.body.last_name,
							username: req.body.username,
							password: hashedPassword,
						});

						User.findByIdAndUpdate(req.params.id, user, {}, (err) => {
							if (err) {
								res.json({ message: "User not found" });
								return;
							}
							res.json({ message: "User Updated", authData });
						});
					});
				}
			}
		);
	},
];

exports.user_delete = (req, res, next) => {
	jwt.verify(
		req.token,
		process.env.SECRET_KEY || process.env.SECRET_KEY_DEV,
		(err, authData) => {
			if (err) return res.sendStatus(403);
			User.findById(req.params.id).exec((err, result) => {
				if (err) {
					res.status(404).json({ message: "Post does not exist" });
					return;
				}
				User.findByIdAndRemove(req.params.id, (err) => {
					if (err) return res.sendStatus(503);
					res.json({ message: "User deleted" });
				});
			});
		}
	);
};
