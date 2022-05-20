module.exports = {
    // init value
    LIMIT: 10,
    START: 1,
    PAGE: 0,
    MAX_PAGE: 0,
    CONTENT: [],
    INIT_LAST_LOGIN: "2000-01-01",
    INIT_THUMBS: 0,
    INIT_ISPUBLIC: 0,
    NOTPUBLIC: 1,
    INIT_STATUS: 1,
    DISABLE_STATUS: 0,
    INIT_BLOG_TYPE: 0,
    INIT_THUMB_AUTHOR_LIST: "[]",

    // security
    PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,32}$/,
    PASSWORD_WISHLIST: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    PASSWORD_LENGTH: 20,
    SYMMETRIC_ALGO: 'aes-256-cbc',
    HASH_ALGO: `sha512`,


    // user type
    ADMIN_USER: 2,
    GOV_USER: 1,
    BASIC_USER: 0,


    //log type
    LOG_CHECKOUT: 1,
    LOG_CASHOUT: 2,
    LOG_REFUND: 3,

    // regex
    LETTERSPACE_REGEX: /^[a-zA-Z ]*$/,
    LETTERINT_REGEX: /^[a-zA-Z\d]*$/,
    INT_REGEX: /^[\d]*$/,
    EMAIL_REGEX: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
};