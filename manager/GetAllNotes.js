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
                    reject(err)
                }

                if (notes) {
                    notes.forEach((note) => {
                        returnNotes.push(note.notes)
                    })
                    
                    resolve(returnNotes)
                } else {
                    reject(`No notes found for ${teamkey}`)
                }
            })
        })
        
    }

}

module.exports = GetAllNotes