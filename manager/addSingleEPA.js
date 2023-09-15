const Manager = require('./Manager')
const { resolve } = require('mathjs')
const axios = require('axios')

//gets norm_epa_recent and full_winrate from statbotics given a team number
//used in category metrics (analysis folder)

class addSingleEPA extends Manager {
    static name = "addSingleEPA"

    constructor() {
        super()
    }

    async runTask(teamNumber) {
        var url = 'https://api.statbotics.io/v2'
        return new Promise((resolve, reject) => {
            axios.get(`${url}/team/${teamNumber}`, {
                headers: { 'X-TBA-Auth-Key': process.env.KEY }
            })
                .then(async (response) => {
                    console.log(response.data.norm_epa_recent)
                    await this.addEpa(teamNumber, response.data.norm_epa_recent)
                })
                .catch(err => {
                    // console.log(err)
                    resolve("-")
                })
                resolve("done")


        })

    }
    async addEpa(teamNumber, epa) {
        var sql = `INSERT INTO epaTable (team, epa) VALUES (?, ?)`
        return new Promise(async (resolve, reject) => {
            Manager.db.all(sql, [teamNumber, epa], async (err, rows) => {
                if(err)
                {
                    // console.log(err)
                    reject(err)
                }
                else{
                    resolve("done")
                }
            })
        })
    }


}

module.exports = addSingleEPA
