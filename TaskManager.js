const Manager = require('./manager/dbmanager.js')
// const AverageForMetric = require('./analysis/AverageForMetric.js')
// const AverageForMetric = require('./analysis/AverageForMetric.js')
//const Overview = require('./overview.js')


const fullyScouted = require('./analysis/general/fullyScouted.js')
const defenseOverview = require('./analysis/defense/defenseOverview.js')
const breakdownMetrics = require('./analysis/breakdownMetrics.js')
const categoryMetrics = require('./analysis/categoryMetrics.js')
const cargoCountOverview = require('./analysis/teleop/cargo/cargoOverview.js')
const cargoCountAutoOverview = require('./analysis/auto/cargo/cargoAutoOverview.js')
const cyclingOverview = require('./analysis/teleop/cargo/cyclingOverview.js')


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
                case(cyclingOverview.name):
                    returnAnalysis.push(new cyclingOverview(Manager.db, task.team, task.type, task.location))
                case(cyclingOverview.name):
                    returnAnalysis.push(new cyclingOverview(Manager.db, task.team, task.type, task.location))
                    break
                case(cargoCountAutoOverview.name):
                    returnAnalysis.push(new cargoCountAutoOverview(Manager.db, task.team, task.type))
                    break
                case(cargoCountOverview.name):
                    returnAnalysis.push(new cargoCountOverview(Manager.db, task.team, task.type))
                case(cargoCountOverview.name):
                    returnAnalysis.push(new cargoCountOverview(Manager.db, task.team, task.type))
                    break
                case(categoryMetrics.name):
                    returnAnalysis.push(new categoryMetrics(Manager.db, task.team))
                case(categoryMetrics.name):
                    returnAnalysis.push(new categoryMetrics(Manager.db, task.team))
                    break
                case(breakdownMetrics.name):
                    returnAnalysis.push(new breakdown(Manager.db, task.team))
                    break
                case(defenseOverview.name):
                    returnAnalysis.push(new defenseOverview(Manager.db, task.team, task.type))
                case(defenseOverview.name):
                    returnAnalysis.push(new defenseOverview(Manager.db, task.team, task.type))
                    break
                case(fullyScouted.name):
                    returnAnalysis.push(new fullyScouted(Manager.db, task.team))
                case(robotRole.name):
                    returnAnalysis.push(new robotRole(Manager.db, task.team))
                    break
                default:
                    console.log(`${task.name} is not a valid task`)
            }
        })

        return returnAnalysis
    }
}

module.exports = TaskManager