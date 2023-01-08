const Manager = require('./Manager.js')

class IsMatchesScouted extends Manager {
    static name = 'isMatchesScouted'

    constructor() {
        super()
    }
    
    runTask(tournamentKey, scouterName, matchKeys) {
        let a = this

        let errorCode = 400

        matchKeys = JSON.parse(matchKeys)

        return new Promise(async (resolve, reject) => {
            let data = await a.getData(tournamentKey, scouterName, matchKeys)
            .catch((err) => {
                if (err) {
                    reject(err)
                }
            })

            if (data == undefined) {
                console.log('No data')
                errorCode = 406
                reject(`No data`)
            } else {
                let returnVals = []
                let exists = true

                for (let i = 0; i < matchKeys.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        // console.log(data[j].scouterName + " " + data[j].matchKey)
                        if (exists && data[j].scouterName == scouterName && data[j].matchKey.includes(`${matchKeys[i]}_`)) {
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

    getData(tournamentKey, scouterName, matchKeys) {
        let sql = `SELECT * FROM matches
        LEFT JOIN data ON matches.key = data.matchKey
        LEFT JOIN scouters ON data.scouterName = scouters.name
        WHERE matches.gameKey = '${tournamentKey}'
        AND data.scouterName = '${scouterName}'
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
                    let errorCode = 500
                    console.log(err)
                    reject(err)
                }
                if (data) {
                    resolve(data)
                } else {
                    let errorCode = 406
                    reject("No matches found")
                }
            })
        })
    }
}

module.exports = IsMatchesScouted