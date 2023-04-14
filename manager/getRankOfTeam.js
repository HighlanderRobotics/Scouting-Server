const Manager = require('./Manager.js')
const { Server } = require("socket.io")
const { resolve } = require('mathjs')
const axios = require('axios')



class getRankOfTeam extends Manager {
    static name = "getRankOfTeam"

    constructor() {
        super()
    }

    async runTask(teamKey, eventKey) {
        var url = 'https://www.thebluealliance.com/api/v3'
        return new Promise((resolve, reject) => {
            axios.get(`${url}/events/${eventKey}/rankings`, {
                headers: { 'X-TBA-Auth-Key': "Zu9HepaVv3oaMxJFsmuqAfcksKTci0v6mOephsnBaXk7kcPbW2VV0WXtq9kyMynS" }
            })
            try 
            {(async (response) => {
                    for (let i = 0; i < response.data.length; i++) {
                        if (response.data[i].teamKey === teamKey) {
                            resolve(response.data.rankings[i].rank)
                        }
                        
                    }
                    resolve(0)
                })
            }
            catch (error)
            {
                reject(error)
            }
        })

    }
}

module.exports = getRankOfTeam
