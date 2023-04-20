const Manager = require('./Manager.js')

class IsMatchesScouted extends Manager {
    static name = 'isMatchesScouted'

    constructor() {
        super()
    }
    
    runTask(tournamentKey, scouterName, matchKeys) {
        let a = this
        matchKeys = JSON.parse(matchKeys)

        return new Promise(async (resolve, reject) => {
            let data = await a.getData(tournamentKey, scouterName, matchKeys)
            .catch((err) => {
                if (err) {
                    reject({
                        "result": err,
                        "customCode": 500
                    })
                }
            })

            if (data === undefined) {
                console.log('No data')
                reject({
                    "result": `No data`,
                    "customCOde": 406
                })
            } else {
                let returnVals = []
                let exists = true

                for (let i = 0; i < matchKeys.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        // console.log(data[j].scouterName + " " + data[j].matchKey)
                        if (exists && data[j].scouterName == scouterName && data[j].matchKey.includes(`${matchKeys[i]}_`)) {
                            returnVals.push({
                                "matchKey": matchKeys[i],
                                "key": data[j].matchKey,
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
    }

    getData(tournamentKey, scouterName, matchKeys) {
        let sql = `SELECT * FROM matches
        LEFT JOIN data ON matches.key = data.matchKey
        LEFT JOIN scouters ON data.scouterName = scouters.name
        WHERE matches.tournamentKey = '${tournamentKey}'
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