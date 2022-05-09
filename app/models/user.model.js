const defaultConfig = require("../config/default.config.js");
const sql = require("./db.js");
const query = require("../helper/query.helper.js");
const CurDate = require("../helper/date.helper.js");

// constructor
const User = function(user) {
    this.uid = user.uid;
    this.username = user.username;
    this.nickname = user.nickname;
    this.pw_hash = user.pw_hash;
    this.salt = user.salt;
    this.account_level = user.account_level;
    this.account_status = user.account_status;
    this.date_modified = user.date_modified;
    this.date_creation = user.date_creation;
    this.date_last_login = user.date_last_login;
};

User.create = (newUser, result) => {
    sql.query("INSERT INTO user_table SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created user: ", { uid: res.uid, ...newUser });
        result(null, "okay");
    });
};

User.formatCheck = (user, result) => {
    const LETTERSPACE = defaultConfig.LETTERSPACE_REGEX;
    const LETTERINT = defaultConfig.LETTERSPACE_REGEX;
    const INT_REGEX = defaultConfig.INT_REGEX;
    const EMAIL = defaultConfig.EMAIL_REGEX;
    if (!(user.uid == null || INT_REGEX.test(user.uid))) { return result(`wrong input format for uid: ${user.uid}`, null); }
    if (!(user.username == null || typeof user.username === "string")) { return result(`wrong input format for username: ${user.username}`, null); }
    if (!(user.nickname == null || typeof user.nickname === "string")) { return result(`wrong input format for nickname: ${user.nickname}`, null); }
    if (!(user.pw_hash == null || LETTERINT.test(user.pw_hash))) { return result(`wrong input format for pw_hash: ${user.pw_hash}`, null); }
    if (!(user.salt == null || LETTERINT.test(user.salt))) { return result(`wrong input format for salt: ${user.salt}`, null); }
    if (!(user.account_level == null || INT_REGEX.test(user.account_level))) { return result(`wrong input format for account account_level: ${user.account_level}`, null); }
    if (!(user.account_status == null || INT_REGEX.test(user.account_status))) { return result(`wrong input format for account status: ${user.account_status}`, null); }
    return result(null, "okay");
}


User.getByUid = async(user_uid, result) => {
    sql.query(`SELECT 
    uid,
    username,
    nickname,
    pw_hash,
    salt,
    account_level,
    account_status,
    date_modified,
    date_creation,
    date_last_login
     FROM user_table WHERE uid = ?`, user_uid, (err, res) => {
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



User.validateUsername = async(username) => {
    return sql.query(`SELECT  uid FROM user_table WHERE username = ?`, username);
};


User.getByUsername = (username, result) => {
    sql.query(`SELECT  
    uid,
    username,
    nickname,
    pw_hash,
    salt,
    account_level,
    account_status,
    date_modified,
    date_creation,
    date_last_login FROM user_table WHERE username = ?`, username, (err, res) => {
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

        // not found User with the user_sid
        result({ kind: "not_found" }, null);
    });
};

User.updatePersonalInfoByUid = (user_uid, user, result) => {

    sqlScript = " UPDATE user_table SET ";

    arr = [];
    if (user.username != null) {
        sqlScript += "username = ? , ";
        arr.push(user.username);
    }
    if (user.nickname != null) {
        sqlScript += "nickname = ? , ";
        arr.push(user.nickname);
    }
    if (user.account_status != null) {
        sqlScript += "account_status = ? , ";
        arr.push(user.account_status);
    }
    sqlScript += "date_modified = ? WHERE  (user_uid = ?)";
    arr.push(user.date_modified);
    arr.push(user_uid);
    if (result) {
        sql.query(sqlScript, arr, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // not found User with the id
                result({ kind: "not_found" }, null);
                return;
            }

            result(null, "okay");
        });
    } else {
        return sql.query(sqlScript, arr);
    }
};


User.updateLoginTimeByUid = (uid, result) => {
    const sqlScript = " UPDATE user_table SET date_last_login = ? WHERE  (uid = ?) ";
    const now = new CurDate().now;
    sql.query(sqlScript, [now, uid], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            // not found User with the id
            result({ kind: "not_found" }, null);
            return;
        }

        result(null, "okay");
    });
};


User.updateCredentialByUsername = (username, user, result) => {

    sqlScript = " UPDATE user_table SET ";

    arr = [];

    sqlScript += "pw_hash = ? , ";
    arr.push(user.pw_hash);

    sqlScript += "salt = ? , ";
    arr.push(user.salt);


    sqlScript += "date_modified = ? WHERE  (username = ?)";
    arr.push(user.date_modified);
    arr.push(username);


    sql.query(sqlScript, arr, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found User with the id
            result({ kind: "not_found" }, null);
            return;
        }

        result(null, "okay");
    });
};

User.updateCredentialByUid = (uid, user, result) => {
    sqlScript = " UPDATE user_table SET ";

    arr = [];

    sqlScript += "pw_hash = ? , ";
    arr.push(user.pw_hash);

    sqlScript += "salt = ? , ";
    arr.push(user.salt);


    sqlScript += "date_modified = ? WHERE  (uid = ?)";
    arr.push(user.date_modified);
    arr.push(uid);


    sql.query(sqlScript, arr, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found User with the id
            result({ kind: "not_found" }, null);
            return;
        }

        result(null, "okay");
    });
};


User.remove = (uid, result) => {
    sql.query("DELETE FROM user_table WHERE uid = ?", uid, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found User with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted user with user_uid: ", uid);
        result(null, res);
    });
};


User.updateAccountStatus = (uid, account_status, result) => {
    sqlScript = " UPDATE user_table SET ";
    arr = [];

    sqlScript += "account_status = ? , ";
    arr.push(account_status);

    sqlScript += "date_modified = ? WHERE  (uid = ?)";
    arr.push(new CurDate().now);
    arr.push(uid);


    sql.query(sqlScript, arr, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found User with the id
            result({ kind: "not_found" }, null);
            return;
        }

        result(null, "okay");
    });
};

module.exports = User;