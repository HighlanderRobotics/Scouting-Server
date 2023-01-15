const Manager = require('./Manager.js')

class GetAllNotes extends Manager {
    static name = 'getAllNotes'

    constructor() {
        super()
    }
    
    runTask(teamKey, sinceTime) {
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
                    reject({
                        "result": err,
                        "customCode": 500
                    })
                }

                if (notes.length) {
                    notes.forEach((note) => {
                        returnNotes.push(note.notes)
                    })
                    
                    resolve(returnNotes)
                } else {
                    reject({
                        "result": `No notes found for ${teamKey}`,
                        "customCode": 406
                    })
                }
            })
        })
    }

}

module.exports = GetAllNotes