const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
		published: { type: Boolean, required: true },
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
