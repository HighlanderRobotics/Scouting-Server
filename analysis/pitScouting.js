// const BaseAnalysis = require('./BaseAnalysis.js')

// class trends extends BaseAnalysis {
//     static name = `fa`

//     constructor(db, team) {
//         super(db)
//         this.team = team
//         this.result = this.result
//     }
//     async getTrend() {
//         let a = this
       
//         let sql = `SELECT *
//         FROM pitScouting
//         WHERE team = ?`
//         return new Promise(function (resolve, reject) {
//             a.db.all(sql, [a.team], (err, rows) => {

//                 if(err)
//                 {
//                     console.log(err)
//                     reject(err)
//                 }
//                 a.result = rows[0]

//                 resolve("done")

//             })
//         })


//     }



//     runAnalysis() {
//         let a = this
//         return new Promise(async (resolve, reject) => {
//             await a.getTrend().catch((err) => {

//             })
//             resolve("done")
//         })


//     }

//     finalizeResults() {
//         return {
//             "team": this.team,
//             "result": this.result
//         }
//     }
// }

// module.exports = trends