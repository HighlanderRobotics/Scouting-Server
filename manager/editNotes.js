const { re } = require('mathjs')
const Manager = require('./Manager.js')
//adds or updates

class editNotes extends Manager {
    static name = "editNotes"

      constructor() {
        super()
    }

    async runTask(uuid, newNote) {

        var sql = `UPDATE data
        SET notes = ?
        WHERE uuid = ?`
        

        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [newNote, uuid], (err, rows) => {
                if(err)
                {
                    console.log(err)
                    reject(err)
                }
                resolve("done")
               
            })
           
        })

    }
}

module.exports = editNotes