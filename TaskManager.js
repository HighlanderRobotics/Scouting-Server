const Manager = require('./manager/dbmanager.js')
// const AverageForMetric = require('./analysis/AverageForMetric.js')
// const AverageForMetric = require('./analysis/AverageForMetric.js')
// const TeamsInTournament = require('./analysis/TeamsInTournament.js')
// const BestAverageForMetric = require('./analysis/random/BestAverageForMetric.js')
// const BestAverageForMetric = require('./analysis/random/BestAverageForMetric.js')
//const Overview = require('./overview.js')
const fullyScouted = require('./analysis/general/fullyScouted.js')
const defenseAmmount = require('./analysis/defense/defenseQuantity.js')
const defenseQuality = require('./analysis/defense/defenseQuality.js')
const notes = require('./analysis/general/notes.js')
const scores = require('./analysis/general/averageScore.js')
// const fullyScouted = require('./analysis/general/fullyScouted.js')
// const defenseAmmount = require('./analysis/defense/defenseQuantity.js')
// const defenseQuality = require('./analysis/defense/defenseQuality.js')
// const notes = require('./analysis/general/notes.js')
// const scores = require('./analysis/general/averageScore.js')
const predictWinning = require('./analysis/predictWinning.js')
const overview = require('./analysis/overview.js')
const positionalAccuracy = require('./analysis/positionalAccuracy.js')
const positionalCount = require('./analysis/positionalCount.js')
const defenseQualityAll = require('./analysis/defense/defenseQualityAll.js')
const defenseQuantityll = require('./analysis/defense/defenseQuantityAll.js')
const defenseQualityDifference = require('./analysis/defense/defenseQualityDifference.js')
const defenseQuantityDifference = require('./analysis/defense/defenseQuantityDifference.js')
const averageScoreDifference = require('./analysis/general/averageScoreDifference.js')
const averageScoreAll = require('./analysis/general/averageScoreAll.js')
const cargoCount = require('./analysis/teleop/cargo/cargoCount.js')
const cargoCountAll = require('./analysis/teleop/cargo/cargoCountAll.js')
const cargoCountDifference = require('./analysis/teleop/cargo/cargoCountDifference.js')
const climberSucsess = require('./analysis/teleop/climber/climberSucsess.js')
// const climberSucsessAuto = require('./analysis/climb/climberSucsessAuto.js')
const cargoCountAutoAll = require('./analysis/auto/cargo/cargoCountAutoAll.js')
const cargoCountAuto = require('./analysis/auto/cargo/cargoCountAuto.js')
const cargoCountAutoDifference = require('./analysis/auto/cargo/cargoCountAutoDifference.js')
const climberSucsessAll = require('./analysis/teleop/climber/climberSucsessAll.js')
const climberSucsessDifference = require('./analysis/teleop/climber/climberSucsessDifference.js')
// const climberSucsessAutoAll = require('./analysis/climb/climberSucsessAutoAll.js')
// const climberSucsessAutoDifference = require('./analysis/climb/climberSucsessAutoDifference.js')
const robotRole = require('./analysis/general/robotRole')
const cycling = require('./analysis/teleop/cargo/cycling.js')
const cyclingAll = require('./analysis/teleop/cargo/cyclingAll.js')
const cyclingDifference = require('./analysis/teleop/cargo/cyclingDifference.js')
const defenseEvents = require('./analysis/defense/defenseEvents.js')
const defenseEventAll = require('./analysis/defense/defenseEventAll.js')
const defenseEventDifference = require('./analysis/defense/defenseEventDifference.js')

class TaskManager {

    runTasks(task) {
        if (!task.name) {
            console.log(`No task provided`)
            return `No task provided`
        }
        let a = this

        return new Promise(async (resolve, reject) => {
            let analysis

            // Add task
            analysis = a.getTask(task.name)
            .catch((err) => {
                return err
            })

            // Run tasks
            await analysis.runAnalysis()
            resolve(analysis.finalizeResults())
        })
            // Wtf is this
            .catch((err) => {
                if (err) {
                    return err
                }
            })
            .then((results) => {
                return results
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

    getTask(task) {
        switch (task) {
            case (notes.name):
                return new notes(Manager.db, task.team, task.start, task.end)
                break
            case (defenseAmmount.name):
                return new defenseAmmount(Manager.db, task.team, task.start, task.end)
                break
            case (defenseQuality.name):
                return new defenseQuality(Manager.db, task.team, task.start, task.end)
                break
            case (scores.name):
                return new scores(Manager.db, task.team, task.start, task.end)
                break
            case (fullyScouted.name):
                return new fullyScouted(Manager.db, task.team, task.start, task.end)
                break
            case (predictWinning.name):
                return new predictWinning(Manager.db, task.red1, task.red2, task.red3, task.blue1, task.blue2, task.blue3)
                break
            case (overview.name):
                return new overview(Manager.db, task.team)
                break
            case (positionalCount.name):
                return new positionalCount(Manager.db, task.team)
                break
            case (climberSucsess.name):
                return new climberSucsess(Manager.db, task.team)
                break
            // case (climberSucsessAuto.name):
            //     return new climberSucsessAuto(Manager.db, task.team))
            //     break
            case (defenseQualityAll.name):
                return new defenseQualityAll(Manager.db)
                break
            case (defenseQuantityll.name):
                return new defenseQualityAll(Manager.db)
                break
            case (averageScoreAll.name):
                return new averageScoreAll(Manager.db)
                break
            case (defenseQuantityDifference.name):
                return new defenseQualityDifference(Manager.db, task.team)
                break
            case (defenseQualityDifference.name):
                return new defenseQualityDifference(Manager.db, task.team)
                break
            case (averageScoreDifference.name):
                return new averageScoreDifference(Manager.db, task.team)
                break
            case (cargoCountDifference.name):
                return new cargoCountDifference(Manager.db, task.team, task.type)
                break
            case (cargoCountAll.name):
                return new cargoCountAll(Manager.db, task.type)
                break
            case (cargoCount.name):
                return new cargoCount(Manager.db, task.team, task.type)
                break
            case (cargoCountAutoDifference.name):
                return new cargoCountAutoDifference(Manager.db, task.team, task.type)
                break
            case (cargoCountAutoAll.name):
                return new cargoCountAutoAll(Manager.db, task.type)
                break
            case (cargoCountAuto.name):
                return new cargoCountAuto(Manager.db, task.team, task.type)
                break

            case (climberSucsessAll.name):
                return new climberSucsessAll(Manager.db)
                break
            case (climberSucsessDifference.name):
                return new climberSucsessDifference(Manager.db, task.team)
                break
            // case (climberSucsessAutoAll.name):
            //     return new climberSucsessAutoAll(Manager.db))
            //     break
            // case (climberSucsessAutoDifference.name):
            //     return new climberSucsessAutoDifference(Manager.db, task.team))
            //     break
            case (robotRole.name):
                return new robotRole(Manager.db, task.team)
                break
            //MAKE SURE COLLIN KNOWS TO SEND TYPE (1 = CUBE, 2 = CONE) AND LOCATION (3 = SCORE 5 = GIVE TO TEAM)
            case (cycling.name):
                return new cycling(Manager.db, task.team, task.type, task.location)
                break
            case (cyclingAll.name):
                return new cyclingAll(Manager.db, task.type, task.location)
                break
            case (cyclingDifference.name):
                return new cyclingDifference(Manager.db, task.team, task.type, task.location)
                break
            //defense = 6 (pin) or 7 (block)
            //put into task.type
            case (defenseEvents.name):
                return new defenseEvents(Manager.db, task.team, task.type)
                break
            case (defenseEventAll.name):
                return new defenseEvents(Manager.db, task.type)
                break
            case (defenseEventDifference.name):
                return new defenseEventDifference(Manager.db, task.team, task.type)
            case (predictWinning.name):
                return new predictWinning(Manager.db, task.red1, task.red2, task.red3, task.blue1, task.blue2, task.blue3)
                break
            case (overview.name):
                return new overview(Manager.db, task.team)
                break
            case (positionalCount.name):
                return new positionalCount(Manager.db, task.team)
                break
            case (positionalCount.name):
                return new positionalCount(Manager.db, task.team)
                break
            case (climberSucsess.name):
                return new climberSucsess(Manager.db, task.team)
                break
            // case (climberSucsessAuto.name):
            //     return new climberSucsessAuto(Manager.db, task.team)
                // break
            case (defenseQualityAll.name):
                return new defenseQualityAll(Manager.db)
                break
            case (defenseQuantityll.name):
                return new defenseQualityAll(Manager.db)
                break
            case (averageScoreAll.name):
                return new averageScoreAll(Manager.db)
                break
            case (defenseQuantityDifference.name):
                return new defenseQualityDifference(Manager.db, task.team)
                break
            case (defenseQualityDifference.name):
                return new defenseQualityDifference(Manager.db, task.team)
                break
            case (averageScoreDifference.name):
                return new averageScoreDifference(Manager.db, task.team)
                break
            case (cargoCountDifference.name):
                return new cargoCountDifference(Manager.db, task.team, task.type)
                break
            case (cargoCountAll.name):
                return new cargoCountAll(Manager.db, task.type)
                break
            case (cargoCount.name):
                return new cargoCount(Manager.db, task.team, task.type)
                break
            case (cargoCountAutoDifference.name):
                return new cargoCountAutoDifference(Manager.db, task.team, task.type)
                break
            case (cargoCountAutoAll.name):
                return new cargoCountAutoAll(Manager.db, task.type)
                break
            case (cargoCountAuto.name):
                return new cargoCountAuto(Manager.db, task.team, task.type)
                break
            case (climberSucsessAll.name):
                return new climberSucsessAll(Manager.db)
                break
            case (climberSucsessDifference.name):
                return new climberSucsessDifference(Manager.db, task.team)
                break
            // case (climberSucsessAutoAll.name):
            //     return new climberSucsessAutoAll(Manager.db)
            //     break
            // case (climberSucsessAutoDifference.name):
            //     return new climberSucsessAutoDifference(Manager.db, task.team)
            //     break
            case (robotRole.name):
                return new robotRole(Manager.db, task.team)
                break
            //MAKE SURE COLLIN KNOWS TO SEND TYPE (1 = CUBE, 2 = CONE) AND LOCATION (3 = SCORE 5 = GIVE TO TEAM)
            case (cycling.name):
                return new cycling(Manager.db, task.team, task.type, task.location)
                break
            case (cyclingAll.name):
                return new cyclingAll(Manager.db, task.type, task.location)
                break
            case (cyclingDifference.name):
                return new cyclingDifference(Manager.db, task.team, task.type, task.location)
                break
            //defense = 6 (pin) or 7 (block)
            //put into task.type
            case (defenseEvents.name):
                return new defenseEvents(Manager.db, task.team, task.type)
                break
            case (defenseEventAll.name):
                return new defenseEvents(Manager.db, task.type)
                break
            case (defenseEventDifference.name):
                return new defenseEventDifference(Manager.db, task.team, task.type)
                break
            default:
                return new Error("Task doesn't exist")
            }
        return returnAnalysis
    }
}

module.exports = TaskManager