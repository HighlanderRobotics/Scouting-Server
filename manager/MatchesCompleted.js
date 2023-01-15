const Manager = require('./Manager.js')

class MatchesCompleted extends Manager {
    static name = "matchesCompleted"

    constructor() {
        super()
    }

    async runTask(body) {
        let sql = `SELECT key FROM matches
        INNER JOIN data ON matches.key = data.matchKey
        WHERE `

        if (body.teamKey) {
            sql += `matches.teamKey = '${body.teamKey}'`
        } else if (body.teamNumber) {
            sql += `matches.teamKey = 'frc${body.teamNumber}'`
        } else {
            return new Error({
                "results": `Missing teamKey or teamNumber`,
                "customCode": 400
            })
        }

        if (body.tournamentKey) {
            sql += ` AND matches.tournamentKey = '${body.tournamentKey}'`
        }

        let returnData = []

        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, playedMatches) => {
                if (err) {
                    console.log(err)
                    errorCode = 500
                    reject({
                        "result": err,
                        "customCode": 500
                    })
                }

                playedMatches.forEach(matchKey => {
                    if (!returnData.includes(matchKey.key)) {
                        returnData.push(matchKey.key)
                    }
                })
                resolve(returnData)
            })
        })
    }
}

module.exports = MatchesCompleted