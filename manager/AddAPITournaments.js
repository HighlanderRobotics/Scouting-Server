const Manager = require('./Manager.js')
const axios = require("axios")

class AddAPITournaments extends Manager {
    static name = "addAPITournaments"

    constructor() {
        super()
    }

    async runTask(year) {
        var url = "https://www.thebluealliance.com/api/v3"

        var sql = `INSERT INTO tournaments (name, location, date, key) VALUES (?, ?, ?, ?)`

        async function insertTournament(sql, response, i) {
            return new Promise((resolve, reject) => {
                Manager.db.run(sql, [response.data[i].name, response.data[i].city, response.data[i].start_date, response.data[i].key], (err) => {
                    if (err) {
                        console.error(`Error inserting tournament: ${err}`)
                        reject(`Error inserting tournament: ${err}`)
                    } else {
                        resolve()
                    }
                })
            })
        }

        await axios.get(`${url}/events/${year}/simple`, {
            headers: {'X-TBA-Auth-Key': process.env.KEY}
        })
        .then(async (response) => {
            for (var i = 0; i < response.data.length; i++) {
                await insertTournament(sql, response, i)
                .catch((err) => {
                    if (err) {
                        console.log(`Error with inserting tournament: ${err}`)
                        reject(err)
                    }
                })
            }
            return
        })
        .catch((err) => {
            if (err) {
                return {
                    "results": err,
                    "errorStatus": true
                }
            } else {
                return {
                    "results": "Successfully added API tournaments",
                    "errorStatus": false
                }
            }
        })
        .then((results) => {
            return results
        })
    }
}

module.exports = AddAPITournaments