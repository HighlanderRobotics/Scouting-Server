const Manager = require('./Manager.js')
const axios = require('axios')

class AddAPITournaments extends Manager {
    static name = 'addAPITournaments'

    constructor() {
        super()
    }

    async runTask(year) {
        var url = 'https://www.thebluealliance.com/api/v3'

        var sql = 'INSERT INTO tournaments (name, location, date, key) VALUES (?, ?, ?, ?)'

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

        return new Promise((resolve, reject) => {
            axios.get(`${url}/events/2022/simple`, {
                headers: {'X-TBA-Auth-Key': process.env.KEY}
            })
                .then(async (response) => {
                    for (var i = 0; i < response.data.length; i++) {
                        await insertTournament(sql, response, i)
                            .catch((err) => {
                                if (err) {
                                    // console.log(`Error with inserting tournament: ${err}`)
                                    reject({
                                        'result': `Error with inserting tournament: ${err}`,
                                        'customCode': 500
                                    })
                                }
                            })
                    }
                    console.log(`Inserted Tournaments for ${year}`)
                    resolve()
                })
                .catch((err) => {
                    if (err) {
                        console.log(err)
                        reject({
                            'result': `Error with getting TBA data: ${err}`,
                            'customCode': 500
                        })
                    }
                })
        })   

    }
}

module.exports = AddAPITournaments