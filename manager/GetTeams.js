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
                    errorCode = 500
                    reject({
                        "results": err,
                        "customCode": errorCode
                    })
                } else {
                    resolve({
                        "results": storedTeams,
                    })
                }
            })
        })
    }
}

module.exports = GetTeams