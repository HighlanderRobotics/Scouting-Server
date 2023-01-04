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
const overview = require('./analysis/overview.js')
const positionalAccuracy = require('./analysis/positionalAccuracy.js')
const positionalCount = require('./analysis/positionalCount.js')
const cargoAccuracyAll = require('./analysis/cargoAccuracyAll.js')
const cargoCountAll = require('./analysis/cargoCountAll.js')
const defenseQualityAll = require('./analysis/defenseQualityAll.js')
const defenseQuantityll = require('./analysis/defenseQuantityAll.js')
const climberSucsessAll = require('./analysis/climberSucsessAll.js')






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
                    returnAnalysis.push(new predictWinning(Manager.db, task.red1, task.red2, task.red3, task.blue1, task.blue2, task.blue3))
                    break
                case(overview.name):
                    returnAnalysis.push(new overview(Manager.db, task.team))
                    break
                case(positionalAccuracy.name):
                    returnAnalysis.push(new positionalAccuracy(Manager.db, task.team))
                    break
                case(positionalCount.name):
                    returnAnalysis.push(new positionalCount(Manager.db, task.team))
                    break
                case(positionalCount.name):
                    returnAnalysis.push(new positionalCount(Manager.db, task.team))
                    break
                case(cargoAccuracyAll.name):
                    returnAnalysis.push(new cargoAccuracyAll(Manager.db))
                    break
                case(cargoCountAll.name):
                    returnAnalysis.push(new cargoCountAll(Manager.db))
                    break
                case(defenseQualityAll.name):
                    returnAnalysis.push(new defenseQualityAll(Manager.db))
                    break
                case(defenseQuantityll.name):
                    returnAnalysis.push(new defenseQualityAll(Manager.db))
                    break
                 case(climberSucsessAll):
                    returnAnalysis.push(new climberSucsessAll(Manager.db))
                    break
                
                default:

                    console.log(`${task.name} is not a valid task`)
            }
        })

        return returnAnalysis
    }
}

module.exports = TaskManager