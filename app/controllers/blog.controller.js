const { equal } = require("assert");
const User = require("../models/user.model.js");
const Blog = require("../models/blog.model.js");
const defaultConfig = require("../config/default.config.js");
// const busiConfig = require("../config/business.config.js");

const CurDate = require("../helper/date.helper.js");
const { validationResult } = require('express-validator');
const myCrypto = require('../helper/crypto.helper.js');
const { ADMIN_USER, GOV_USER, BASIC_USER, INIT_ISPUBLIC } = require("../config/default.config.js");
const auth = require("../helper/auth.helper.js");


// write blog or comment

exports.writeOwnBlog = async(req, res) => {

    // #swagger.tags = ['Blog Others']

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    const blog = new Blog({
        comment_bid: req.body.comment_bid || null,
        author_uid: req.uid,
        blog_info: req.body.blog_info,
        blog_status: defaultConfig.INIT_ISPUBLIC,
        blog_location: req.body.location,
        blog_thumbs: new CurDate().now,
        date_modified: new CurDate().now,
        date_creation: defaultConfig.INIT_LAST_LOGIN // an impossible date means user haven't logged in
    });

    Blog.create(blog, (err) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while creating the blog post."
            });
        else res.status(200).send({
            message: "Write blog success!"
        });
    });

}

// read all recent blogs of user
exports.readOwnBlog = async(req, res) => {

    // #swagger.tags = ['Blog Read']


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const blog = new Blog({
        author_uid: req.uid,
    })
    Blog.getByAttrs(blog, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving blog."
            });
        else {
            return res.send({
                message: "Read own blog success!",
                payload: data
            })
        };
    });
}


// read all recent public blogs of other user
exports.readPublicBlog = async(req, res) => {
    // #swagger.tags = ['Blog Read']

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const blog = new Blog({
        author_uid: req.query.author_uid || null,
        comment_bid: req.query.comment_bid || null,
        blog_status: INIT_ISPUBLIC
    })
    Blog.getByAttrs(blog, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving blog."
            });
        else {
            return res.send({
                message: "Read public blog by uid success!",
                payload: data
            })
        };
    });
}

// read comments of a blog by BFS with level 

exports.readBlogTree = async(req, res) => {
    // #swagger.tags = ['Blog Read']

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const blog = new Blog({
        comment_bid: req.query.comment_bid,
        blog_status: INIT_ISPUBLIC
    })
    Blog.getByAttrs(blog, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving blog."
            });
        else {
            console.log("readblog tree")
            return res.send({
                message: "Read blog tree success!",
                payload: data
            })
        };
    });
}


exports.updateOwnBlog = async(req, res) => {
    // #swagger.tags = ['Blog Others']


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const blog = new Blog({
        author_uid: req.uid,
        blog_info: req.body.blog_info,
        blog_status: req.body.blog_status,
        blog_location: req.body.blog_location
    });

    Blog.updateOwn(blog, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving blog."
            });
        else {
            console.log("readblog tree")
            return res.send({
                message: "Update own blog success!",
                payload: data
            })
        };
    });
}

exports.thumbsChangeOnBlog = async(req, res) => {
    // #swagger.tags = ['Blog Others']


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const blog = new Blog({
        bid: req.body.bid,
        blog_status: defaultConfig.INIT_ISPUBLIC,
        date_modified: new CurDate().now
    });

    Blog.updateThumbs(req.body.thumbsChange, blog, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving blog."
            });
        else {
            console.log("readblog tree")
            return res.send({
                message: "Update own blog success!",
                payload: data
            })
        };
    });
}

exports.deleteOwnBlog = async(req, res) => {
    // #swagger.tags = ['Blog Others']


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const blog = new Blog({
        bid: req.body.bid,
        author_uid: req.uid
    });

    Blog.delete(blog, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving blog."
            });
        else {
            console.log("readblog tree")
            return res.send({
                message: "Update own blog success!",
                payload: data
            })
        };
    });
}