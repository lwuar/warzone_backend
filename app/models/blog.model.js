const defaultConfig = require("../config/default.config.js");
const sql = require("./db.js");
const query = require("../helper/query.helper.js");
const CurDate = require("../helper/date.helper.js");

// constructor
const Blog = function(blog) {
    this.bid = blog.bid;
    this.comment_bid = blog.comment_bid;
    this.author_uid = blog.author_uid;
    this.blog_info = blog.blog_info;
    this.blog_status = blog.blog_status;
    this.blog_location = blog.blog_location;
    this.blog_thumbs = blog.blog_thumbs;
    this.date_modified = blog.date_modified;
    this.date_creation = blog.date_creation;
};

Blog.create = (newBlog, result) => {
    sql.query("INSERT INTO blog_table SET ?", newBlog, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created blog: ", { bid: res.bid, ...newBlog });
        result(null, "okay");
    });
};



Blog.getByAttrs = async(blog, result) => {

    sqlScript = `SELECT 
    bid,
    comment_bid,
    author_uid,
    blog_info,
    blog_status,
    blog_location,
    blog_thumbs,
    date_modified,
    date_creation
     FROM blog_table WHERE 1=1 `;

    arr = [];
    if (blog.bid != null) {
        sqlScript += " AND bid = ? ";
        arr.push(blog.bid);
    }
    if (blog.comment_bid != null) {
        sqlScript += " AND comment_bid = ? ";
        arr.push(blog.comment_bid);
    }
    if (blog.blog_info != null) {
        sqlScript += " AND blog_info = ?  ";
        arr.push(blog.blog_info);
    }
    if (blog.blog_status != null) {
        sqlScript += " AND blog_status = ? ";
        arr.push(blog.blog_status);
    }
    if (blog.blog_location != null) {
        sqlScript += " AND blog_location = ? ";
        arr.push(blog.blog_location);
    }

    sqlScript += "ORDER BY date_creation DESC LIMIT 20";

    sql.query(sqlScript, arr, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            //console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found User with the user_uid
        result({ kind: "not_found" }, null);
    });
};


Blog.updateOwn = async(blog, result) => {

    sqlScript = " UPDATE blog_table SET ";

    arr = [];
    if (blog.blog_info != null) {
        sqlScript += "blog_info = ? , ";
        arr.push(blog.blog_info);
    }
    if (blog.blog_status != null) {
        sqlScript += "blog_status = ? , ";
        arr.push(blog.blog_status);
    }
    if (blog.blog_location != null) {
        sqlScript += "blog_location = ? , ";
        arr.push(blog.blog_location);
    }


    sqlScript += "date_modified = ? WHERE  (bid = ? and author_uid = ? )";
    arr.push(blog.date_modified);
    arr.push(blog.bid);
    arr.push(blog.author_uid);

    sql.query(sqlScript, arr, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found blog with the id
            result({ kind: "not_found" }, null);
            return;
        }

        result(null, "okay");
    });
};


Blog.updateThumbs = async(thumbsChange, blog, result) => {

    sqlScript = " UPDATE blog_table SET date_modified = ?, blog_thumbs = (SELECT blog_thumbs FROM blog_table WHERE bid = ? and blog_status = ?  ) ";
    if (thumbsChange == true) {
        sqlScript += " + 1";
    } else {
        sqlScript += " - 1";

    }
    sqlScript += " WHERE  (bid = ? and blog_status = ? )";
    arr = [blog.date_modified, blog.bid, blog.blog_status, blog.bid, blog.blog_status]
    sql.query(sqlScript, arr, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found blog with the id
            result({ kind: "not_found" }, null);
            return;
        }

        result(null, "okay");
    });
};




Blog.delete = (blog, result) => {
    sql.query("DELETE FROM blog_table WHERE bid = ? and author_uid = ?", [blog.bid, blog.author_uid], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found blog with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted blog_table with bid: ", blog.bid);
        result(null, res);
    });
};

module.exports = Blog;