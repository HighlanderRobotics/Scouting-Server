const Manager = require('./Manager.js')
const { Server } = require("socket.io")
const { resolve } = require('mathjs')
const Io = require("../collectionServer.js")



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
                Io.emit('pickedTeams', rows)
                resolve(rows)
            })
        })

    }
}

module.exports = getPickedTeams
