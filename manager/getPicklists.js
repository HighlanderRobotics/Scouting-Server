const Manager = require('./Manager.js')
const axios = require("axios")
const { resolve, row } = require('mathjs')

class getPicklists extends Manager {
    static name = "getPicklists"

    constructor() {
        super()
    }

    async runTask(team){
        if(team == null)
        {
            return("no team")
        }
        var sql = `SELECT *
        FROM sharedPicklists
        WHERE team = ?`
        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [team], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(rows)

            })
        })

    }
}

module.exports = getPicklists