const { re } = require('mathjs')
const Manager = require('./Manager.js')
const updateEPA = require('../analysis/general/updateEPA.js')

class isFullyScouted extends Manager {
    static name = "isFullyScouted"

    constructor() {
        super()
    }

    async runTask(matchNumber) {

        var sql = `SELECT DISTINCT matchKey
       FROM newData
       JOIN (SELECT *
           FROM data 
           JOIN data ON matches.key
           WHERE matches.matchNumber = ?) AS  newData`

        return new Promise(async (resolve, reject) => {

            Manager.db.all(sql, [matchNumber], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                if (rows.length >= 6) {
                     
                }
                resolve("done")
            })
        })



    }
}

module.exports = isFullyScouted