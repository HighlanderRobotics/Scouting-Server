const { re } = require('mathjs')
const Manager = require('./Manager.js')

class deleteMutablePicklist extends Manager {
    static name = "deleteMutablePicklist"

    constructor() {
        super()
    }

    async runTask(uuid) {

        var sql = `DELETE FROM mutablePicklists
        WHERE uuid = ?`
        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [uuid], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve("done")
            })
        })

    }
}

module.exports = deleteMutablePicklist