const Manager = require('./Manager.js')

class deletePicklist extends Manager {
    static name = "deletePicklist"

    constructor() {
        super()
    }

    async runTask(uuid) {

        var sql = `DELETE FROM sharedPicklists
        WHERE uuid = ?` 
        Manager.db.run(sql, [uuid], (err, rows) =>
        {
            if (err)
            {
                console.log(err)
            }
            resolve("done")
        })

    }
}

module.exports = deletePicklist