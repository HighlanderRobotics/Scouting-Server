const Manager = require('./Manager.js')
const axios = require('axios');
const isFullyScouted = require('./isFullyScouted.js');
const updateEPA = require('../analysis/general/updateEPA.js');
const { rows } = require('jstat');

class AddTournament extends Manager {
    static name = 'addTournament'

    constructor() {
        super()
    }

    runTask(key, name, location, date) {

        let sql = `INSERT INTO tournaments (key, name, location, date) VALUES (?, ?, ?, ?)`


        // console.log(sql)

        return new Promise((resolve, reject) => {

            Manager.db.get(sql, [key, name, location, date], (err, row) => {
                if (err) {

                    console.error(err)


                    reject({

                        "result": err,

                        "customCode": 500
                    })
                }
                else {
                    resolve("done")
                }
            })
        })




    }

    // console.log(gameDependent)


}


module.exports = AddTournament