const Manager = require('./Manager')
const { resolve } = require('mathjs')
const axios = require('axios')

//gets norm_epa_recent and full_winrate from statbotics given a team number
//used in category metrics (analysis folder)

class getStatbotics extends Manager {
    static name = "getStatbotics"

    constructor() {
        super()
    }

    async runTask(teamNumber) {
        var url = 'https://api.statbotics.io/v2'
        return new Promise((resolve, reject) => {
            axios.get(`${url}/team_year/${teamNumber}/2023`, {
                headers: { 'X-TBA-Auth-Key': process.env.KEY }
            })
                .then(async (response) => {
                    resolve({"epa_end" : response.data.epa_end, "full_winrate" : response.data.full_winrate})
                })
                .catch(err => {
                    resolve("-")
                })


        })

    }
    

}

module.exports = getStatbotics
