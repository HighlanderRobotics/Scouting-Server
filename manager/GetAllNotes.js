const Manager = require('./Manager.js')

class GetAllNotes extends Manager {
    static name = 'getAllNotes'

    constructor() {
        super()
    }
    
    runTask(teamKey, sinceTime) {
        let errorCode = 400
        let sql = `SELECT notes FROM data
            LEFT JOIN matches ON matches.key = data.matchKey
            WHERE matches.teamKey = '${teamKey}'`
        
        if (sinceTime) {
            sql = sql + ` AND startTime > ${sinceTime}`
        }

        return new Promise((resolve, reject) => {
            let returnNotes = []

            Manager.db.all(sql, (err, notes) => {
                if (err) {
                    errorCode = 500
                    reject(err)
                }

                if (notes.length) {
                    notes.forEach((note) => {
                        returnNotes.push(note.notes)
                    })
                    
                    resolve(returnNotes)
                } else {
                    errorCode = 406
                    reject(`No notes found for ${teamKey}`)
                }
            })
        })
        .catch((err) => {
            if (err) {
                return {
                    "results": err,
                    "errorStatus": true,
                    "customCode": errorCode,
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

}

module.exports = GetAllNotes