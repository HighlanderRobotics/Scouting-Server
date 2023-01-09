const Manager = require('./manager/dbmanager.js')
const AverageForMetric = require('./analysis/AverageForMetric.js')
const TeamsInTournament = require('./analysis/TeamsInTournament.js')
const BestAverageForMetric = require('./analysis/BestAverageForMetric.js')
//const Overview = require('./overview.js')
const fullyScouted = require('./analysis/fullyScouted.js')
const defenseAmmount = require('./analysis/defenseQuantity.js')
const defenseQuality = require('./analysis/defenseQuality.js')
const notes = require('./analysis/notes.js')
const scores = require('./analysis/averageScore.js')
const predictWinning = require('./analysis/predictWinning.js')
const overview = require('./analysis/overview.js')
const positionalCount = require('./analysis/positionalCount.js')
const defenseQualityAll = require('./analysis/defenseQualityAll.js')
const defenseQuantityll = require('./analysis/defenseQuantityAll.js')
const defenseQualityDifference = require('./analysis/defenseQualityDifference.js')
const defenseQuantityDifference = require('./analysis/defenseQuantityDifference.js')
const averageScoreDifference = require('./analysis/averageScoreDifference.js')
const averageScoreAll = require('./analysis/averageScoreAll.js')
const coneCount = require('./analysis/coneCount.js')
const coneCountAll = require('./analysis/coneCountAll.js')
const coneCountDifference = require('./analysis/coneCountDifference.js')
const cubeCount = require('./analysis/cubeCount.js')
const cubeCountAll = require('./analysis/cubeCountAll.js')
const cubeCountDifference = require('./analysis/cubeCountDifference.js')
const climberSucsess = require('./analysis/climberSucsess.js')
const climberSucsessAuto = require('./analysis/climberSucsessAuto.js')
const cubeCountAutoAll = require('./analysis/cubeCountAutoAll.js')
const cubeCountAuto = require('./analysis/cubeCountAuto.js')
const cubeCountAutoDiffernce = require('./analysis/coneCountAutoDiffernce.js')
const coneCountAutoAll = require('./analysis/coneCountAutoAll.js')
const coneCountAuto = require('./analysis/coneCountAuto.js')
const coneCountAutoDiffernce = require('./analysis/coneCountAutoDiffernce.js')
const climberSucsessAll = require('./analysis/climberSucsessAll.js')
const climberSucsessDifference = require('./analysis/climberSucsessDifference.js')
const climberSucsessAutoAll = require('./analysis/climberSucsessAutoAll.js')
const climberSucsessAutoDifference = require('./analysis/climberSucsessAutoDifference.js')
const robotRole = require('./analysis/robotRole')
const cycling = require('./analysis/cycling.js')
const cyclingAll = require('./analysis/cyclingAll.js')
const cyclingDifference = require('./analysis/cyclingDifference.js')
const defenseEvents = require('./analysis/defenseEvents.js')
const defenseEventAll = require('./analysis/defenseEventAll.js')
const defenseEventDifference = require('./analysis/defenseEventDifference.js')











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
                
                case(positionalCount.name):
                    returnAnalysis.push(new positionalCount(Manager.db, task.team))
                    break
                case(positionalCount.name):
                    returnAnalysis.push(new positionalCount(Manager.db, task.team))
                    break
                case(climberSucsess.name):
                    returnAnalysis.push(new climberSucsess(Manager.db, task.team))
                    break
                case(climberSucsessAuto.name):
                    returnAnalysis.push(new climberSucsessAuto(Manager.db, task.team))
                    break
                case(defenseQualityAll.name):
                    returnAnalysis.push(new defenseQualityAll(Manager.db))
                    break
                case(defenseQuantityll.name):
                    returnAnalysis.push(new defenseQualityAll(Manager.db))
                    break
               
                case(averageScoreAll.name):
                    returnAnalysis.push(new averageScoreAll(Manager.db))
                    break
                
                case(defenseQuantityDifference.name):
                    returnAnalysis.push(new defenseQualityDifference(Manager.db, task.team))
                    break
                case(defenseQualityDifference.name):
                    returnAnalysis.push(new defenseQualityDifference(Manager.db, task.team))
                    break
                case(averageScoreDifference.name):
                    returnAnalysis.push(new averageScoreDifference(Manager.db, task.team))
                    break
                case(coneCountDifference.name):
                    returnAnalysis.push(new coneCountDifference(Manager.db, task.team))
                    break
                case(coneCountAll.name):
                    returnAnalysis.push(new coneCountDifference(Manager.db))
                    break
                case(coneCount.name):
                    returnAnalysis.push(new coneCount(Manager.db, task.team))
                    break
                case(cubeCountDifference.name):
                    returnAnalysis.push(new coneCountDifference(Manager.db, task.team))
                    break
                case(cubeCountAll.name):
                    returnAnalysis.push(new coneCountDifference(Manager.db))
                    break
                case(cubeCount.name):
                    returnAnalysis.push(new coneCount(Manager.db, task.team))
                    break
                case(cubeCountAutoDiffernce.name):
                    returnAnalysis.push(new cubeCountAutoDiffernce(Manager.db, task.team))
                    break
                case(cubeCountAutoAll.name):
                    returnAnalysis.push(new cubeCountAutoAll(Manager.db))
                    break
                case(cubeCountAuto.name):
                    returnAnalysis.push(new cubeCountAuto(Manager.db, task.team))
                    break
                case(coneCountAutoDiffernce.name):
                    returnAnalysis.push(new coneCountAutoDiffernce(Manager.db, task.team))
                    break
                case(coneCountAutoAll.name):
                    returnAnalysis.push(new coneCountAutoAll(Manager.db))
                    break
                case(coneCountAuto.name):
                    returnAnalysis.push(new coneCountAuto(Manager.db, task.team))
                    break
                case(climberSucsessAll.name):
                    returnAnalysis.push(new climberSucsessAll(Manager.db))
                    break
                case(climberSucsessDifference.name):
                    returnAnalysis.push(new climberSucsessDifference(Manager.db, task.team))
                    break
                case(climberSucsessAutoAll.name):
                    returnAnalysis.push(new climberSucsessAutoAll(Manager.db))
                    break
                case(climberSucsessAutoDifference.name):
                    returnAnalysis.push(new climberSucsessAutoDifference(Manager.db, task.team))
                    break
                case(robotRole.name):
                    returnAnalysis.push(new robotRole(Manager.db, task.team))
                    break
                //MAKE SURE COLLIN KNOWS TO SEND TYPE (1 = CUBE, 2 = CONE) AND LOCATION (3 = SCORE 5 = GIVE TO TEAM)
                case(cycling.name):
                    returnAnalysis.push(new cycling(Manager.db, task.team, task.type, task.location))
                    break
                case(cyclingAll.name):
                    returnAnalysis.push(new cyclingAll(Manager.db, task.type, task.location))
                    break
                case(cyclingDifference.name):
                    returnAnalysis.push(new cyclingDifference(Manager.db, task.team, task.type, task.location))
                    break
                //defense = 6 (pin) or 7 (block)
                //put into task.type
                case(defenseEvents.name):
                    returnAnalysis.push(new defenseEvents(Manager.db, task.team, task.type))
                    break
                case(defenseEventAll.name):
                    returnAnalysis.push(new defenseEvents(Manager.db, task.type))
                    break
                case(defenseEventDifference.name):
                    returnAnalysis.push(new defenseEventDifference(Manager.db, task.team, task.type))
                    break

                
                
                default:

                    console.log(`${task.name} is not a valid task`)
            }
        })

        return returnAnalysis
    }
}

module.exports = TaskManager