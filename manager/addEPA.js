const singleEPA = require('./addSingleEPA')
const getTeamsInTournament = require('./GetTeamsInTournament')

const { re, resolve } = require('mathjs')
const Manager = require('./Manager.js')
const GetTeams = require('./GetTeams')

class addEPA extends Manager {
    static name = "addEPA"

    constructor() {
        super()
    }

    async runTask() {
        let teams = await new GetTeams().runTask()
        for(let i = 0; i < teams.length; i ++)
        {
            console.log(i)
            await new singleEPA().runTask(teams[i].teamNumber)
        }
        resolve("done")

    }
}

module.exports = addEPA