const defaultConfig = require("../config/default.config.js");
const sql = require("../models/db.js");
module.exports = function query(tableName, page, arr, sqlCountHeader, sqlGetHeader, sqlScript, result, orderBy = "date_modified", pageLimit = defaultConfig.LIMIT, groupBy = null) {
    // input check

    if (page < 0) {
        errmsg = "error: page size should be greater than 0";
        console.log(errmsg);
        result(errmsg, null);
        return;
    }

    // limit as 20
    const limit = pageLimit;
    // get page number from input
    const page_num = Number(page);
    // calculate offset
    const offset = (page_num - 1) * limit;

    let sqlCount = "SELECT " + sqlCountHeader + " " + sqlScript;
    let sqlGet = "SELECT " + sqlGetHeader + " " + sqlScript;

    if (groupBy != null)
        sqlGet += " GROUP BY " + groupBy;

    sqlGet += " ORDER BY " + orderBy;
    if (page != 0) {
        sqlGet += " LIMIT " + limit + " OFFSET " + offset;
    }
    sql.query(sqlCount, arr, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        //console.log(res);
        const count = res[0][sqlCountHeader];

        if (count != 0) {

            sql.query(sqlGet, arr, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                //console.log(res)
                var jsonResult = {
                    'item_count': res.length,
                    'current_page': page_num,
                    'max_page': Math.ceil(count / limit),
                    'content': res
                }
                var jsonStr = JSON.parse(JSON.stringify(jsonResult));

                // console.log(tableName + " found: ", jsonStr);
                result(null, jsonStr);
            });
        } else {
            var jsonResult = {
                'page_count': defaultConfig.PAGE_COUNT,
                'page_number': page_num,
                'max_page': defaultConfig.MAX_PAGE,
                'content': defaultConfig.CONTENT
            }
            var jsonStr = JSON.parse(JSON.stringify(jsonResult));
            console.log(tableName + " found: ", jsonStr);
            result(null, jsonStr);
        }
    });
}