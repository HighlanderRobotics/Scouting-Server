const Manager = require('./Manager.js')

class GetTeams extends Manager {
    static name = 'getTeams'

    constructor() {
        super()
    }

    runTask() {
        var sql = `SELECT * FROM teams ORDER BY teamnumber`

        let errorCode = 400

        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, storedTeams) => {
                if (err) {
                    console.error(`Error with getTeams(): ${err}`)
                    errorCode = 500
                    reject(`Error with getTeams(): ${err}`)
                } else {
                    resolve(storedTeams);
                }
            })
        })
        .catch((err) => {
            if (err) {
                return {
                    "results": err,
                    "errorStatus": true,
                    "customCode": errorCode
                }
            } else {
                return {
                    "results": err,
                    "errorStatus": false
                }
            }
        })
        .then((results) => {
            return results
        })
    }
}

module.exports = GetTeams