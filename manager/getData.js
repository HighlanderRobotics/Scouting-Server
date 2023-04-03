const { re } = require('mathjs')
const Manager = require('./Manager.js')

class getData extends Manager {
    static name = "getData"

    constructor() {
        super()
    }

    async runTask(matchKey) {

        var sql = `SELECT *
        FROM data 
        WHERE matchKey = ?`
        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [matchKey], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(rows)
            })
        })

    }
}

module.exports = getData