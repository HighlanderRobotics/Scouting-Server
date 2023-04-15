const { re } = require('mathjs')
const Manager = require('./Manager.js')
const getPickedTeams = require("./getPickedTeams")


class addPickedTeam extends Manager {
    static name = "addPickedTeam"

    constructor() {
        super()
    }

    async runTask(team) {

        var sql = `INSERT INTO pickedTeams (teams) VALUES (?)`
        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [team], async (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve (await new getPickedTeams().runTask())
                
                
            })
        })

    }
}

module.exports = addPickedTeam

