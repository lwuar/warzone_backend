const { equal } = require("assert");
const User = require("../models/user.model.js");
const defaultConfig = require("../config/default.config.js");
// const busiConfig = require("../config/business.config.js");

const CurDate = require("../helper/date.helper.js");
const { validationResult } = require('express-validator');
const myCrypto = require('../helper/crypto.helper.js');
const { ADMIN_USER, GOV_USER, BASIC_USER } = require("../config/default.config.js");
const auth = require("../helper/auth.helper.js");



exports.login = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // #swagger.tags = ['Basic']

    /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Allow user login on mobile phone. A Json Web Token is stored in cookie as an access token for authentication. Life time of token is set to 1 day',
                schema: {
                "username": "user1",
                "pw_cipher": "Abcd1234",
                }
        } */

    const username = req.body.username;
    const pw_cipher = req.body.pw_cipher;

    User.getByUsername(username, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                console.log("error, not found: ", err.message, " for user with username ", username);
                return res.status(500).send({
                    message: `wrong password or no such account`
                });
            } else {
                console.log("error, others: ", err.message, " for user with username ", username);
                return res.status(500).send({
                    message: "wrong password or no such account"
                });
            }
        } else {

            if (myCrypto.verifyPassword(pw_cipher, data.pw_hash, data.salt)) {
                // correct password

                if (data.account_status == defaultConfig.DISABLE_STATUS) {
                    // account status is disabled
                    console.log("account is disabled, ", data);
                    return res.status(500).send({
                        message: "wrong password or no such account"
                    });
                }

                User.updateLoginTimeByUid(data.uid, (err) => {
                    if (err) {
                        console.log("error: ", err);
                        return res.status(500).send({
                            message: "wrong password or no such account"
                        });
                    } else {
                        token = auth.getToken(data.uid, data.username, data.account_level);

                        return res.cookie("access_token", token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === "production",
                            }).status(200)
                            .json({
                                message: "Login Success"
                            });
                    }
                });
            } else {
                // wrong password
                console.log("error, wrong password for user with username ", username);
                return res.status(500).send({
                    message: "wrong password or no such account"
                });
            }
        }
    });
}

exports.register = async(req, res) => {
    // #swagger.tags = ['Basic']

    /*    #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Allow user to register.',
            schema: {
            "username": "user1",
            "pw_cipher": "Abcd1234",
             "nickname": "user1Nickname",
             "account_level":1
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
    if (![ADMIN_USER, GOV_USER, BASIC_USER].includes(req.body.account_level)) {
        return res.status(400).send({
            message: "Wrong account level!"
        });
    }
    try {
        const [pw_hash, salt] = myCrypto.getPasswordHash(req.body.pw_cipher);

        const user = new User({
            username: req.body.username,
            nickname: req.body.nickname,
            pw_hash: pw_hash,
            salt: salt,
            account_level: req.body.account_level,
            account_status: defaultConfig.INIT_STATUS,
            date_modified: new CurDate().now,
            date_creation: new CurDate().now,
            date_last_login: defaultConfig.INIT_LAST_LOGIN // an impossible date means user haven't logged in
        })

        User.create(user, (err, data) => {
            if (err)
                return res.status(500).send({
                    message: err.message || "An error occurred while creating the user."
                });
            else res.status(200).send({
                message: "Register Success!"
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: err || "Some error occurred while creating the user."
        });
    }
}

exports.getProfile = async(req, res) => {
    // #swagger.tags = ['Basic']

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    User.getByUid(req.uid, (err, data) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving user."
            });
        else {
            delete data.pw_hash;
            delete data.salt;
            return res.send({
                message: "success",
                payload: data
            })
        };
    });
}

exports.updateProfile = async(req, res) => {

    // #swagger.tags = ['Basic']
    /*    #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Update user profile information, which are the username, the nickname and the account level. All these attributes are optional',
            schema: {
            "username": "newuser1",
             "nickname": "newuser1Nickname",
             "account_level":2
            }
    } */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = new User({
        username: req.body.username || null,
        nickname: req.body.nickname || null,
        account_level: req.body.account_level || null,
        date_modified: new CurDate().now,
    })


    User.updateProfileByUid(req.uid, user, (err) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving user."
            });
        else {
            return res.send({
                message: "Update profile success!"
            })
        };
    });
}

exports.updatePassword = async(req, res) => {

    // #swagger.tags = ['Basic']
    /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Allow user to update password. Authentication is done by JWT',
                schema: {
                "new_cipher": "newAbcd1234"
                }
        } */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const [pw_hash, salt] = myCrypto.getPasswordHash(req.body.new_cipher);

    const user = new User({
        pw_hash: pw_hash,
        salt: salt,
        date_modified: new CurDate().now,
    })


    User.updatePasswordByUid(req.uid, user, (err) => {
        if (err)
            return res.status(500).send({
                message: err.message || "An error occurred while retrieving user."
            });
        else {
            return res.send({
                message: "Update password success!"
            })
        };
    });
}