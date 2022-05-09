// let date_ob = new Date();
// let date = ("0" + date_ob.getDate()).slice(-2);
// // current month
// let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// // current year
// let year = date_ob.getFullYear();
class CurDate {
    now = new Date(Date.now() + 8 * (60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ')
}

module.exports = CurDate;
// console.log(new CurDate().now)