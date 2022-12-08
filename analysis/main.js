// const Manager = require('.././dbmanager.js')
// const AverageForMetric = require('./AverageForMetric.js')
// const TeamsInTournament = require('./TeamsInTournament.js')
const TaskManager = require('../TaskManager.js')

// const analysis = [new AverageForMetric(Manager.db, "frc254", "teleopHighSuccess"), new TeamsInTournament(Manager.db, "2022cc")]

var tasks = [
    {
        name: "AverageForMetric",
        teamKey: "frc254",
        metric: "teleopHighSuccess"
    },
    {
        name: "AverageForMetric",
        teamKey: "frc8033",
        metric: "teleopHighSuccess"
    },
    {
        name: "TeamsInTournament",
        tournamentKey: "2022cc"
    }
]

async function run() {
    var results = await new TaskManager().runTasks(tasks)

    console.log(results)
}

run()