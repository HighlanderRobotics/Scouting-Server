const Manager = require('./Manager.js')

class GetTeams extends Manager {
    static name = 'getTeams'

    constructor() {
        super()
    }

    runTask() {
        var sql = `SELECT * FROM teams ORDER BY teamnumber`


        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, storedTeams) => {
                if (err) {
                    reject({
                        "results": err,
                        "customCode": 500
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