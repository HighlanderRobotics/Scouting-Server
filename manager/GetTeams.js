const Manager = require('./Manager.js')

class GetTeams extends Manager {
    static name = "GetTeams"

    constructor() {
        super()
    }

    runTask() {
        var sql = `SELECT * FROM teams ORDER BY teamnumber`

        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, storedTeams) => {
                if (err) {
                    console.error(`Error with getTeams(): ${err}`)
                    reject(`Error with getTeams(): ${err}`)
                } else {
                    resolve(storedTeams);
                }
            })
        })
        .catch((err) => {
            if (err) {
                return err
            }
        })
        .then((results) => {
            return results
        })
    }
}

module.exports = GetTeams