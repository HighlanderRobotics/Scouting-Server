const Manager = require('./Manager.js')
const axios = require("axios")
const { resolve, row } = require('mathjs')

class getPicklists extends Manager {
    static name = "getPicklists"

    constructor() {
        super()
    }

    async runTask(){

        var sql = `SELECT *
        FROM sharedPicklists`
        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [], (err, rows) => {
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