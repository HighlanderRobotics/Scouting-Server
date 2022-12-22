const Manager = require('./Manager.js')
const axios = require('axios');

class AddAPITeams extends Manager {
    static name = 'addAPITeams'

    constructor() {
        super()
    }

    async runTask() {
        var url = 'https://www.thebluealliance.com/api/v3'
        
        var sql = `INSERT INTO teams (key, teamNumber, teamName) VALUES (?, ?, ?)`

        
        for (var j = 0; j < 18; j++) {
            console.log(`Inserting teams ${Math.round((j/18)*100)}%`)
            await axios.get(`${url}/teams/${j}/simple`, {
                headers: {'X-TBA-Auth-Key': process.env.KEY}
            })
            .then(async (response) => {
                for (var i = 0; i < response.data.length; i++) {
                    await insertTeam(sql, response, i)
                }
            }).catch(err => {
                if (err) {
                    console.error(`Error with getting teams from TBA API: ${err}`)
                    return err                    
                }
            }).then(() => {
                if (j === 17) {
                    console.log(`Finished inserting API teams`)
                    return
                }
            })
        }
    }

    async insertTeam(sql, response, i) {
        return new Promise((resolve, reject) => {
            Manager.db.run(sql, [response.data[i].key, response.data[i].team_number, response.data[i].nickname], (err) => {
                if (err) {
                    console.error(`Error inserting teams: ${response.data[i]}`)
                    reject(`Error inserting teams: ${response.data[i]}`)
                } else {
                    resolve()
                }
            })
        })
    }
}

module.exports = AddAPITeams