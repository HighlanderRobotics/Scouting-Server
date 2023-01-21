const Manager = require('./Manager.js')
const fs = require('fs')

class GetScoutersSchedule extends Manager {
    static name = 'getScoutersSchedule'

    constructor() {
        super()
    }

    runTask() {
        return new Promise(async (resolve, reject) => {
            async function keyFromOrdinalNumber(ordinalNumber) {
                return new Promise((resolve, reject) => {
                    let key = ""
                    var sql = `SELECT tournamentKey, matchType FROM matches
                    WHERE ? = matchNumber
                    LIMIT 1`
                    Manager.db.all(sql, [ordinalNumber], (err, row) => {
                        key += row.tournamentKey + "_" + row.matchType

                        resolve(key)
                    })
                })
            }


            let data = fs.readFileSync(`${__dirname}/../scouters/./scoutersSchedule.json`, 'utf8', (err) => {
                if (err) {
                    reject({
                        "result": `Error reading scoutersSchedule file: ${err}`,
                        "customCode": 500
                    })
                }
            })

            const object = JSON.parse(data);

            let shifts = object.shifts

            for (const index in shifts) {
                shifts[index].startKey = await keyFromOrdinalNumber(shifts[index].start)
                shifts[index].endKey = await keyFromOrdinalNumber(shifts[index].end)
            }

            resolve(JSON.stringify(
                {
                    ...object,
                    shifts: shifts,
                }
            ))
        })
    }

}

module.exports = GetScoutersSchedule