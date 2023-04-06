const Manager = require('./Manager.js')
const axios = require("axios")
const { resolve, row } = require('mathjs')

class getPickedTeams extends Manager {
    static name = "getPickedTeams"

    constructor() {
        super()
    }

    async runTask(){

        var sql = `SELECT *
        FROM pickedTeams`
        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(rows.map((row) => ({
                    ...row,
                    teams: JSON.parse(row.teams).map(team => parseInt(team)),
                })))

            })
        })

    }
}

module.exports = getPickedTeams