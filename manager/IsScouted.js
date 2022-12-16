const Manager = require('./Manager.js')

class IsScouted extends Manager {
    static name = `isScouted`

    constructor() {
        super()
        this.result = []
    }

    runTask(tournamentKey, matchNumber) {
        
        let a = this

        return new Promise(async (resolve, reject) => {
            let matches = await a.getMatchKeys(tournamentKey, matchNumber)
            .catch((err) => {
                if (err) {
                    reject(err)
                }
            })

            if (matches === undefined) {
                reject("Something went wrong")
            } else {
                matches.forEach(scouter => {
                    a.result.push(scouter)
                });
                
                resolve(a.result)
            }
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

    async getMatchKeys(tournamentKey, matchNumber) {
        let sql = `SELECT matchKey, name FROM matches
            LEFT JOIN data ON matches.key = data.matchKey
            LEFT JOIN scouters ON data.scouterId = scouters.id
            WHERE matches.gameKey = "${tournamentKey}"
            AND matches.matchNumber = ${matchNumber}
            `

        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, matches) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                if (matches) {
                    resolve(matches)
                } else {
                    reject("No matches found")
                }
            })      
        })
    }

}

module.exports = IsScouted