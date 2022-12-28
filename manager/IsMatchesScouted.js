const Manager = require('./Manager.js')

class IsMatchesScouted extends Manager {
    static name = 'isMatchesScouted'

    constructor() {
        super()
    }
    
    runTask(tournamentKey, scouterId, matchKeys) {
        let a = this

        matchKeys = JSON.parse(matchKeys)

        return new Promise(async (resolve, reject) => {
            let data = await a.getData(tournamentKey, scouterId, matchKeys)
            .catch((err) => {
                if (err) {
                    reject(err)
                }
            })

            let returnVals = []
            let exists = true


            for (let i = 0; i < matchKeys.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    // console.log(data[j].scouterId + " " + data[j].matchKey)
                    if (exists && data[j].scouterId == scouterId && data[j].matchKey.includes(`${matchKeys[i]}_`)) {
                        returnVals.push({
                            "matchKey": matchKeys[i],
                            "specificMatchKey": data[j].matchKey,
                            "status": true
                        })
                        exists = false
                    }
                }

                if (exists) {
                    returnVals.push({
                        "matchKey": matchKeys[i],
                        "status": false
                    })
                }
                exists = true
            }

            

            resolve(returnVals)
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

    getData(tournamentKey, scouterId, matchKeys) {
        let sql = `SELECT * FROM matches
        LEFT JOIN data ON matches.key = data.matchKey
        LEFT JOIN scouters ON data.scouterId = scouters.id
        WHERE matches.gameKey = '${tournamentKey}'
        AND data.ScouterId = ${scouterId}
        AND (`
        
        for (let i = 0; i < matchKeys.length; i++) {
            if (i !== 0) {
                sql = sql + " OR "
            }
            sql = sql + `INSTR(matches.key, '${matchKeys[i]}_')`
        }
        sql = sql + `)`

        // console.log(sql)

        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                if (data) {
                    resolve(data)
                } else {
                    reject("No matches found")
                }
            })
        })
    }
}

module.exports = IsMatchesScouted