const Manager = require('./Manager.js')

class GetMatches extends Manager {
    static name = 'getMatches'

    constructor() {
        super()
    }

    runTask(body) {
        var sql = `SELECT * FROM matches
            WHERE gameKey = '${body.tournamentKey}'
            ORDER BY matchNumber`


        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, storedTeams) => {
                if (err) {
                    console.error(`Error with getMatches(): ${err}`)
                    reject(`Error with getMatches(): ${err}`)
                } else {
                    // console.log(storedTeams)
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