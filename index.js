if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

//create server
const app = express();

//connect to mongodb
const port = process.env.PORT || process.env.PORT_DEV;
const dbURI = process.env.MONGODB_URI || process.env.MONGODB_URI_DEV;

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		console.log("Connected to MongoDB");
		app.listen(port);
	})
	.catch((err) => {
		console.log(err);
	});

//middleware
app.use(morgan("dev"));
