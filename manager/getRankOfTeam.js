const Manager = require('./Manager.js')
const { resolve } = require('mathjs')
const axios = require('axios')



class getRankOfTeam extends Manager {
    static name = "getRankOfTeam"

    constructor() {
        super()
    }

    async runTask(teamKey, eventKey) {
        var url = 'https://www.thebluealliance.com/api/v3'
        if (eventKey === undefined) {
            resolve("-")
        }
        return new Promise((resolve, reject) => {
            axios.get(`${url}/event/${eventKey}/rankings`, {
                headers: { 'X-TBA-Auth-Key': process.env.KEY }
            })
                .then(async (response) => {
                    for (let i = 0; i < response.data.rankings.length; i++) {
                        if (response.data.rankings[i].team_key === teamKey) {
                            let x = response.data.rankings[i].rank
                            resolve(x.toString())
                        }
                    }
                    resolve("-")
                })
                .catch(err => {
                    resolve("-")
                })


        })

    }
}

module.exports = getRankOfTeam
