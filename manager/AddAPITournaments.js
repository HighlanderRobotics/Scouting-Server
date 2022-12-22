const Manager = require('./Manager.js')
const axios = require('axios');

class AddAPITournaments extends Manager {
    static name = 'addAPITournaments'

    constructor() {
        super()
    }

    async runTask() {
        var url = 'https://www.thebluealliance.com/api/v3'

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

        await axios.get(`${url}/events/2023/simple`, {
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
        }).catch(err => {
            if (err) {
                console.error(`Error with inserting API Tournaments: ${err}`)
                return`Error with inserting API Tournaments: ${err}`
            }
        })
        .then(() => {
            console.log(`Finished inserting tournaments`)
            return
        })
    }
}

module.exports = AddAPITournaments