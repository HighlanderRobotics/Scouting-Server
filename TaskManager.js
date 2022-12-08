const Manager = require('./dbmanager.js')
const AverageForMetric = require('./analysis/AverageForMetric.js')
const TeamsInTournament = require('./analysis/TeamsInTournament.js')

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
            // console.log(results)

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
                    break;
                case (TeamsInTournament.name):
                    // console.log(`TeamsInTournament`)
                    returnAnalysis.push(new TeamsInTournament(Manager.db, task.tournamentKey))
                    break;
                default:
                    console.log(`${task.name} is not a valid task`)
            }
        })

        return returnAnalysis
    }

    bruh() {
        return [new AverageForMetric(Manager.db, "frc254", "teleopHighSuccess")]
    }

    async test() {
        let bruh = new AverageForMetric(Manager.db, "frc254", "teleopHighSuccess") 

        await bruh.runAnalysis()
        console.log(bruh.finalizeResults())
    }
}

module.exports = TaskManager