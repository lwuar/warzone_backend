var router = require("express").Router();
const blog = require("../controllers/blog.controller.js");
const { body, query } = require('express-validator');


router.post("/writeOwnBlog",
    body('comment_bid').isInt().optional(),
    body('blog_info').isString(),
    body('blog_location').isString(),
    body('blog_type').isInt().optional(),
    blog.writeOwnBlog);

router.get("/readOwnBlog",
    query('page').isInt().optional(),
    query('limit').isInt().optional(),
    blog.readOwnBlog);

router.get("/readPublicBlog",
    query('author_uid').isInt().optional(),
    query('comment_bid').isInt().optional(),
    query('blog_type').isInt().optional(),
    query('page').isInt().optional(),
    query('limit').isInt().optional(),
    blog.readPublicBlog);

router.get("/readBlogTree",
    query('comment_bid').isInt(),
    query('page').isInt().optional(),
    query('limit').isInt().optional(),
    blog.readBlogTree);

router.put("/updateOwnBlog",
    body('blog_info').isString().optional(),
    body('blog_status').isString().optional(),
    body('blog_location').isString().optional(),
    body('blog_type').isInt().optional(),
    blog.updateOwnBlog);

router.put("/thumbsAddOnBlog",
    body('bid').isInt(),
    body('thumbsChange').isBoolean(),
    blog.thumbsAddOnBlog);

router.put("/thumbsRemoveOnBlog",
    body('bid').isInt(),
    blog.thumbsRemoveOnBlog);

router.delete("/delete",
    body('bid').isInt(),
    blog.deleteOwnBlog);

module.exports = router;