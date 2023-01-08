const Manager = require('./Manager.js')

class IsScouted extends Manager {
    static name = `isScouted`

    constructor() {
        super()
        this.result = []
    }

    runTask(tournamentKey, matchKey) {
        
        let a = this

        return new Promise(async (resolve, reject) => {
            let matches = await a.getMatchKeys(tournamentKey, matchKey)
            .catch((err) => {
                if (err) {
                    reject(err)
                }
            })

            if (matches === undefined) {
                reject('Something went wrong')
            } else {
                matches.forEach(scouter => {
                    a.result.push(scouter)
                });
                
                resolve(a.result)
            }
        })
        .catch((err) => {
            if (err) {
                return {
                    "results": err,
                    "errorStatus": true
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

    async getMatchKeys(tournamentKey, matchKey) {
        let sql = `SELECT matches.key, name FROM matches
            LEFT JOIN data ON matches.key = data.matchKey
            LEFT JOIN scouters ON data.scouterName = scouters.name
            WHERE matches.gameKey = '${tournamentKey}'
            AND INSTR(matches.key, '${matchKey}_')
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
                    reject('No matches found')
                }
            })      
        })
    }

}

module.exports = IsScouted