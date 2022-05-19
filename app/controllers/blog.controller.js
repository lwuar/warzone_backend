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
const { stringify } = require("querystring");
const { query } = require("../models/db.js");


// write blog or comment

exports.writeOwnBlog = async(req, res) => {

    // #swagger.tags = ['Blog Others']

    /*    #swagger.parameters['obj'] = {
             in: 'body',
             description: 'Allow users to write their own new blog. comment_bid is optional. If not null, then it is a comment to other blog. blog_info is the content of blog. TODO: Location need to be confirmed with Map developer',
             schema: {
             "comment_bid": "user1",
             "blog_info": "Abcd1234",
             "blog_location": "clear water bay, hk",
             "blog_type":"0"
             }
     } */

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
        blog_location: req.body.blog_location,
        blog_thumbs: defaultConfig.INIT_THUMBS,
        thumb_author_list: defaultConfig.INIT_THUMB_AUTHOR_LIST,
        blog_type: req.body.blog_type || defaultConfig.INIT_BLOG_TYPE,
        date_modified: new CurDate().now,
        date_creation: new CurDate().now
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
    Blog.getAll(blog, req.query.page || defaultConfig.PAGE, req.query.limit || defaultConfig.LIMIT, (err, data) => {
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
        blog_type: req.query.blog_type || null,
        blog_status: INIT_ISPUBLIC
    })
    Blog.getAll(blog, req.query.page || defaultConfig.PAGE, req.query.limit || defaultConfig.LIMIT, (err, data) => {
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
    Blog.getAll(blog, req.query.page || defaultConfig.PAGE, req.query.limit || defaultConfig.LIMIT, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving blog."
            });
        else {
            return res.send({
                message: "Read blog tree success!",
                payload: data
            })
        };
    });
}


exports.updateOwnBlog = async(req, res) => {
    // #swagger.tags = ['Blog Others']
    /*    #swagger.parameters['obj'] = {
               in: 'body',
               description: 'Allow users to update their own blog. All are optional',
               schema: {
               "comment_bid": "5",
               "blog_info": "Abcd1234",
               "blog_location": "clear water bay, hk",
               "blog_type":"1"
               }
       } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const blog = new Blog({
        author_uid: req.uid,
        blog_info: req.body.blog_info || null,
        blog_status: req.body.blog_status || null,
        blog_location: req.body.blog_location || null,
        blog_type: req.body.blog_type || null

    });

    Blog.updateOwn(blog, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving blog."
            });
        else {
            return res.send({
                message: "Update own blog success!",
                payload: data
            })
        };
    });
}

exports.thumbsAddOnBlog = async(req, res) => {
    // #swagger.tags = ['Blog Thumb']
    /*    #swagger.parameters['obj'] = {
               in: 'body',
               description: 'Allow user to thumb up or down for a blog or comment. bid is the corresponding id of blog. thumbsChange indicates the thumb, true for up and false for down. The total count of thumbs will be added or deducted by 1',
               schema: {
               "bid": 5,
               "thumbsChange": true,
           
               }
       } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const blog = new Blog({
        bid: req.body.bid,
        blog_status: defaultConfig.INIT_ISPUBLIC,
        date_modified: new CurDate().now
    });
    Blog.getOne(blog, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving blog."
            });
        else {
            curBlog = data;
            thumbAuthorList = JSON.parse(curBlog["thumb_author_list"]);

            if (thumbAuthorList.hasOwnProperty(req.uid) && thumbAuthorList[req.uid] != null) {
                // have given thumb before
                return res.status(500).send({
                    message: "The user have gave thumb before."
                });
            } else {
                // havent' given thumb yet
                change = req.body.thumbsChange ? 1 : -1
                thumbAuthorList[req.uid] = change;
                curBlog.blog_thumbs += change;
                curBlog.thumb_author_list = JSON.stringify(thumbAuthorList);

                Blog.updateThumb(curBlog, (err, data) => {
                    if (err)
                        return res.status(500).send({
                            message: err.message || "An error occurred while adding blog thumbs."
                        });
                    else {
                        return res.send({
                            message: "Add blog thumb success!",
                            payload: data
                        })
                    };
                });
            }
        };
    })
}


exports.thumbsRemoveOnBlog = async(req, res) => {
    // #swagger.tags = ['Blog Thumb']
    /*    #swagger.parameters['obj'] = {
                   in: 'body',
                   description: 'Allow user to remove their thumb up or down for a blog or comment. bid is the corresponding id of blog. The total count will be restored',
                   schema: {
                   "bid": 5,
                   }
           } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const blog = new Blog({
        bid: req.body.bid,
        blog_status: defaultConfig.INIT_ISPUBLIC,
        date_modified: new CurDate().now
    });
    Blog.getOne(blog, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving blog."
            });
        else {

            curBlog = data;
            thumbAuthorList = JSON.parse(curBlog["thumb_author_list"]);

            if (thumbAuthorList.hasOwnProperty(req.uid) && thumbAuthorList[req.uid] != null) {
                // have given thumb before
                change = thumbAuthorList[req.uid];
                curBlog.blog_thumbs -= change;
                thumbAuthorList[req.uid] = null;
                curBlog.thumb_author_list = JSON.stringify(thumbAuthorList);
                Blog.updateThumb(curBlog, (err, data) => {
                    if (err)
                        return res.status(500).send({
                            message: err.message || "An error occurred while removing blog thumbs."
                        });
                    else {
                        return res.send({
                            message: "Remove blog thumb success!",
                            payload: data
                        })
                    };
                })
            } else {
                return res.status(500).send({
                    message: "The user haven't given a thumb before."
                });
            }
        };
    })
}


exports.deleteOwnBlog = async(req, res) => {
    // #swagger.tags = ['Blog Others']
    /*    #swagger.parameters['obj'] = {
                    in: 'body',
                    description: 'Allow user to delete their blog or comment. bid is the corresponding id of blog. However, once there is a comment, it may not be deleted now. TODO: Add recursive delete for this part',
                    schema: {
                    "bid": 5,
                    }
            } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const blog = new Blog({
        bid: req.body.bid,
        author_uid: req.uid
    });

    Blog.delete(blog, (err) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while deleting blog."
            });
        else {
            return res.send({
                message: "Delete own blog success!",
            })
        };
    });
}