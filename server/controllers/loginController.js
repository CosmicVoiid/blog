const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Author = require("../models/author");

exports.api_login_get = (req, res, next) => {
	res.json({
		message:
			"To login to API, please send json load with format username: username, password: password",
	});
};

exports.api_login_post = (req, res, next) => {
	if (!req.body.username || !req.body.password) {
		res.json({
			message:
				"To login to API, please send json load with format username: username, password: password",
		});
		return;
	}
	Author.findOne({ username: req.body.username }, (err, author) => {
		if (err) return next(err);
		if (!author) {
			res.json({ message: "User does not exist" });
			return;
		}
		bcrypt.compare(req.body.password, author.password, (err, result) => {
			if (result) {
				req.body.currentAuthor = author;
				console.log(req.body.currentAuthor);
				jwt.sign(
					{ user: author },
					process.env.SECRET_KEY || process.env.SECRET_KEY_DEV,
					(err, token) => {
						res.json({
							success: true,
							message: "Logged in successfully",
							token: token,
						});
					}
				);
			} else {
				res.json({ message: "Incorrect password" });
				return;
			}
		});
	});
};
