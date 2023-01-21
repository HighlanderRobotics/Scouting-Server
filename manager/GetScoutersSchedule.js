const Manager = require('./Manager.js')
const fs = require('fs')

class GetScoutersSchedule extends Manager {
    static name = 'getScoutersSchedule'

    constructor() {
        super()
    }

    runTask() {
        return new Promise((resolve, reject) => {
            function keyFromOrdinalNumber(ordinalNumber) {
                var sql = `SELECT tournamentKey, matchType FROM matches
                    WHERE ? = matchNumber
                    LIMIT 1`
                Manager.db.all(sql, [ordinalNumber], (err, row) =>
                {
                    return row.tournamentKey + "_" + row.matchType 
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

            const shifts = object.shifts
            const newShifts = shifts.map((shift) => ({
                ...shift,
                startKey: keyFromOrdinalNumber(shift.start),
                endKey: keyFromOrdinalNumber(shift.end),
            }))

            resolve(JSON.stringify(
                {
                    ...object,
                    shifts: newShifts,
                }
            ))
        })
    }
}

module.exports = GetScoutersSchedule