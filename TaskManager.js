const Manager = require('./manager/dbmanager.js')
// const AverageForMetric = require('./analysis/AverageForMetric.js')
// const AverageForMetric = require('./analysis/AverageForMetric.js')
//const Overview = require('./overview.js')

const fullyScouted = require('./analysis/general/fullyScouted.js')
const defenseOverview = require('./analysis/defense/defenseOverview.js')
const breakdownMetrics = require('./analysis/breakdownMetrics.js')
const categoryMetrics = require('./analysis/categoryMetrics.js')
const cargoCountOverview = require('./analysis/teleop/cargo/cargoCountOverview')
const cargoCountAutoOverview = require('./analysis/auto/cargo/cargoAutoOverview.js')
const cyclingOverview = require('./analysis/teleop/cargo/cyclingOverview.js')
const robotRole = require('./analysis/general/robotRole.js')
const notes = require('./analysis/general/notes')
const cycleOverviewAnalysis = require('./analysis/teleop/cargo/cycleOverveiwAnalysis.js')
const picklistShell = require('./analysis/picklistShell.js')
const averageScoreDetails = require('./analysis/general/averageScoreDetails.js')
const autoPaths = require('./analysis/auto/cargo/autoPaths.js')
const autoPathsTeams = require('./analysis/auto/cargo/autoPathsTeams.js')
const alliancePage = require('./analysis/alliancePage')
const cyclingDetials = require('./analysis/teleop/cargo/cylcingDetials.js')
const predictWinning = require('./analysis/predictWinning.js')
const scoringBreakdown = require('./analysis/general/scoringBreakdown.js')
const driverAbilityOverview = require('./analysis/general/driverAbilityOverview.js')
const pentalties = require('./analysis/general/penalties.js')
const links = require('./analysis/general/links.js')
const climberSucsess = require('./analysis/teleop/climber/climberSucsess.js')
const climberSucsessAuto = require('./analysis/auto/climb/climberSucsessAuto.js')
const suggestions = require('./analysis/suggestions.js')
const teamAndMatch = require('./analysis/teamAndMatch.js')


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
        let a = this;
        let returnAnalysis = []

        tasks.forEach((task) => {
            switch (task.name) {
                case (cyclingOverview.name):
                    returnAnalysis.push(new cyclingOverview(Manager.db, task.team, task.type, task.location))
                    break
                case (cargoCountAutoOverview.name):
                    returnAnalysis.push(new cargoCountAutoOverview(Manager.db, task.team, task.type, task.start))
                    break
                case (cargoCountOverview.name):
                    returnAnalysis.push(new cargoCountOverview(Manager.db, task.team, task.type, task.location))
                    break
                case (categoryMetrics.name):
                    returnAnalysis.push(new categoryMetrics(Manager.db, task.team))
                    break
                case (breakdownMetrics.name):
                    returnAnalysis.push(new breakdownMetrics(Manager.db, task.team))
                    break
                case (defenseOverview.name):
                    returnAnalysis.push(new defenseOverview(Manager.db, task.team, task.type))
                    break
                case (fullyScouted.name):
                    returnAnalysis.push(new fullyScouted(Manager.db, task.team))
                case ("robotRole"):
                    returnAnalysis.push(new robotRole(Manager.db, task.team))
                    break
                case ("coneCount"):
                    returnAnalysis.push(new cargoCountOverview(Manager.db, task.team, 1, 2))
                    break
                case ("cubeCount"):
                    returnAnalysis.push(new cargoCountOverview(Manager.db, task.team, 0, 2))
                    break
                case ("cubeCountAuto"):
                    returnAnalysis.push(new cargoCountAutoOverview(Manager.db, task.team, 0))
                    break
                case ("coneCountAuto"):
                    returnAnalysis.push(new cargoCountAutoOverview(Manager.db, task.team, 1))
                    break
                case ("cycleCubeTeam"):
                    returnAnalysis.push(new cyclingDetials(Manager.db, task.team, 0, 4))
                    break
                case ("cycleConeTeam"):
                    returnAnalysis.push(new cyclingDetials(Manager.db, task.team, 1, 4))
                    break
                case ("cycleCubeScore"):
                    returnAnalysis.push(new cyclingDetials(Manager.db, task.team, 0, 2))
                    break
                case ("cycleConeScore"):
                    returnAnalysis.push(new cyclingDetials(Manager.db, task.team, 1, 2))
                    break
                case ("defenseTime"):
                    returnAnalysis.push(new defenseOverview(Manager.db, task.team))
                    break
                case ("picklist"):
                    returnAnalysis.push(new picklistShell(Manager.db, task.tournamentKey, task.coneOneScore, task.coneTwoScore, task.coneThreeScore, task.cubeOneScore, task.cubeTwoScore, task.cubeThreeScore,task.autoCargo, task.teleopScore, task.defenseScore, task.autoClimb, task.feedCone, task.feedCube, task.avgTotal, task.teleopClimb, task.driverAbility))
                    break
                case (notes.name):
                    returnAnalysis.push(new notes(Manager.db, task.team))
                    break
                case ("avgTeleScore"):
                    returnAnalysis.push(new averageScoreDetails(Manager.db, task.team, 1))
                    break
                case("scoringBreakdown"):
                    returnAnalysis.push(new scoringBreakdown(Manager.db, task.team, 1, task.tournamentKey, task.matchNumber, task.matchType))
                    break
                case ("avgAutoScore"):
                    returnAnalysis.push(new averageScoreDetails(Manager.db, task.team, 0))
                    break
                case ("teamAutoPaths"):
                    returnAnalysis.push(new autoPaths(Manager.db, task.team))
                    break
                case("allianceAutoPaths"):
                    returnAnalysis.push(new autoPathsTeams(Manager.db, task.teamOne, task.teamTwo, task.teamThree))
                    break
                case("alliancePage"):
                    returnAnalysis.push(new alliancePage(Manager.db, task.teamOne, task.teamTwo, task.teamThree))
                    break
                case("predictMatch"):
                    returnAnalysis.push(new predictWinning(Manager.db, task.red1, task.red2, task.red3, task.blue1, task.blue2, task.blue3))
                    break
                case("driverAbility"):
                    returnAnalysis.push(new driverAbilityOverview(Manager.db, task.team))
                    break
                case("pentalties"):
                    returnAnalysis.push(new pentalties(Manager.db, task.team))
                    break
                case("links"):
                    returnAnalysis.push(new links(Manager.db, task.team))
                    break
                case("climberAuto"):
                    returnAnalysis.push(new climberSucsessAuto(Manager.db, task.team))
                    break
                case("climber"):
                    returnAnalysis.push(new climberSucsess(Manager.db, task.team))
                    break
                case("role"):
                    returnAnalysis.push(new robotRole(Manager.db, task.team))
                    break
                case("suggestions"):
                    returnAnalysis.push(new suggestions(Manager.db, task.red1, task.red2, task.red3, task.blue1, task.blue2, task.blue3, task.matchType))
                    break
                case("teamAndMatch"):
                    returnAnalysis.push(new teamAndMatch(Manager.db, task.team, task.matchKey))
                default:
                    console.log(`${task.name} is not a valid task`)
            }
        })

        return returnAnalysis
    }
}

module.exports = TaskManager