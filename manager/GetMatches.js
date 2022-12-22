const Manager = require('./Manager.js')

class GetMatches extends Manager {
    static name = 'getMatches'

    constructor() {
        super()
    }

    runTask(tournamentKey) {
        var sql = `SELECT * FROM matches
            WHERE gameKey = '${tournamentKey}'
            ORDER BY matchNumber`

        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, storedTeams) => {
                if (err) {
                    console.error(`Error with getMatches(): ${err}`)
                    reject(`Error with getMatches(): ${err}`)
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

module.exports = GetMatches