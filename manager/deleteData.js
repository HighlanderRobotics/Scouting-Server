const { re } = require('mathjs')
const Manager = require('./Manager.js')

class deleteData extends Manager {
    static name = "deleteData"

    constructor() {
        super()
    }

    async runTask(uuid) {

        var sql = `DELETE FROM data
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

module.exports = deleteData