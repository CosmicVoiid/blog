const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token");
const loginController = require("../controllers/loginController");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const commentController = require("../controllers/commentController");

router.get("/", (req, res) => {
	res.redirect("/api");
});

router.get("/api", (req, res) => {
	res.json({ message: "Welcome to the API" });
});

router.get("/api/login", loginController.api_login_get);
router.post("/api/login", loginController.api_login_post);

router.get("/api/posts", verifyToken, postController.post_get);
router.post("/api/posts", verifyToken, postController.post_post);
router.put("/api/posts/:id", verifyToken, postController.post_put);
router.delete("/api/posts/:id", verifyToken, postController.post_delete);

router.get("/api/users", verifyToken, userController.user_get);
router.post("/api/users", verifyToken, userController.user_post);
router.put("/api/users/:id", verifyToken, userController.user_put);
router.delete("/api/users/:id", verifyToken, userController.user_delete);

router.get(
	"/api/posts/:postId/comments",
	verifyToken,
	commentController.comment_get
);
router.post(
	"/api/posts/:postId/comments",
	verifyToken,
	commentController.comment_post
);
router.put(
	"/api/posts/:postId/comments/:id",
	verifyToken,
	commentController.comment_put
);
router.delete(
	"/api/posts/:postId/comments/:id",
	verifyToken,
	commentController.comment_delete
);

module.exports = router;
