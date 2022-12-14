const Manager = require('./manager/dbmanager.js')
const AverageForMetric = require('./analysis/AverageForMetric.js')
const TeamsInTournament = require('./analysis/TeamsInTournament.js')
const BestAverageForMetric = require('./analysis/BestAverageForMetric.js')
//const Overview = require('./overview.js')
const fullyScouted = require('./analysis/fullyScouted.js')
const defenseAmmount = require('./analysis/defenseQuantity.js')
const defenseQuality = require('./analysis/defenseQuality.js')
const notes = require('./analysis/notes.js')
const climberSucsess = require('./analysis/climberSucsess.js')
const climberMax = require('./analysis/climberMax.js')
const cargoCount = require('./analysis/cargoCount.js')
const cargoAccuracy = require('./analysis/cargoAccuracy.js')
const scores = require('./analysis/averageScore.js')
const predictWinning = require('./analysis/predictWinning.js')

class TaskManager {

    runTasks(tasks) {
        if (tasks.length <= 0) {
            console.log(`No tasks provided`)
            return `No tasks provided`
        }
        let a = this

        return new Promise(async (resolve, reject) => {
            let analysis
            let results = []

            // Add tasks
            analysis = a.addTasks(tasks)

            for (var i = 0; i < analysis.length; i++) {
                // Run tasks
                await analysis[i].runAnalysis()
            }

            for (var i = 0; i < analysis.length; i++) {
                // Resolve results when they've all finished
                // console.log(analysis[i].finalizeResults())
                results.push(analysis[i].finalizeResults())
            }
            resolve(results)
        })
        .catch((err) => {
            if (err) {
                return err
            }
        })
        .then((results) => {
            return results
        })
    }

    addTasks(tasks) {
        let returnAnalysis = []

        tasks.forEach((task) => {
            switch (task.name) {
                case (AverageForMetric.name):
                    // console.log(`AverageForMetric`)
                    returnAnalysis.push(new AverageForMetric(Manager.db, task.teamKey, task.metric))
                    break
                case (TeamsInTournament.name):
                    // console.log(`TeamsInTournament`)
                    returnAnalysis.push(new TeamsInTournament(Manager.db, task.tournamentKey))
                    break
                case (BestAverageForMetric.name):
                    // console.log(task.name)
                    returnAnalysis.push(new BestAverageForMetric(Manager.db, task.tournamentKey, task.metric))
                    break
                case(cargoCount.name):
                    returnAnalysis.push(new cargoCount(Manager.db, task.team, task.start, task.end))
                    break
                case(cargoAccuracy.name):
                    returnAnalysis.push(new cargoAccuracy(Manager.db, task.team, task.start, task.end))
                    break
                case(climberMax.name):
                    returnAnalysis.push(new climberMax(Manager.db, task.team, task.start, task.end))
                    break
                case(climberSucsess.name):
                    returnAnalysis.push(new climberSucsess(Manager.db, task.team, task.start, task.end))
                    break
                case(notes.name):
                    returnAnalysis.push(new notes(Manager.db, task.team, task.start, task.end))
                    break
                case(defenseAmmount.name):
                    returnAnalysis.push(new defenseAmmount(Manager.db, task.team, task.start, task.end))
                    break
                case(defenseQuality.name):
                    returnAnalysis.push(new defenseQuality(Manager.db, task.team, task.start, task.end))
                    break
                case(scores.name):
                    returnAnalysis.push(new scores(Manager.db, task.team, task.start, task.end))
                    break
                case(fullyScouted.name):
                    returnAnalysis.push(new fullyScouted(Manager.db, task.team, task.start, task.end))
                    break
                case(predictWinning.name):
                    returnAnalysis.push(new predictWinning(Manager.db, task.team, task.start, task.end))
                    break
                default:
                    console.log(`${task.name} is not a valid task`)
            }
        })

        return returnAnalysis
    }
}

module.exports = TaskManager