module.exports = {
    LIMIT: 5,
    START: 1,
    MAX_PRICE: 0,
    BOOK_STATUS: 0,

    SELL_STATUS_NOT_COLLECTED: 0,
    SELL_STATUS_IS_COLLECTED: 1,
    SELL_STATUS_IS_SOLD_NOT_PAID: 2,
    SELL_STATUS_NOT_SOLD_RETURN: 3,
    SELL_STATUS_IS_SOLD_IS_PAID: 4,



    PAGE_COUNT: 0,
    MAX_PAGE: 0,
    CONTENT: [],
    INIT_LAST_LOGIN: "2000-01-01",
    PRICE: /^[0-9]+[.][0-9]{2}$/,
    INIT_BALANCE: "0.00",


    INIT_ISPUBLIC: 0,
    NOTPUBLIC: 1,

    INIT_STATUS: 1,
    DISABLE_STATUS: 0,



    // security
    PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,32}$/,
    PASSWORD_WISHLIST: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    PASSWORD_LENGTH: 20,
    SYMMETRIC_ALGO: 'aes-256-cbc',
    HASH_ALGO: `sha512`,
    PASSWORD_RESET_LIFETIME: 600,


    // 
    ADMIN_USER: 2,
    GOV_USER: 1,
    BASIC_USER: 0,


    //log type
    LOG_CHECKOUT: 1,
    LOG_CASHOUT: 2,
    LOG_REFUND: 3,

    //    
    LETTERSPACE_REGEX: /^[a-zA-Z ]*$/,
    LETTERINT_REGEX: /^[a-zA-Z\d]*$/,
    INT_REGEX: /^[\d]*$/,
    EMAIL_REGEX: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
};