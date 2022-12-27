const TaskManager = require('.././TaskManager.js')
const DatabaseManager = require('.././DatabaseManager.js')

// Tests must be updated to use latest data
test(`AverageForMetric`, async () => {
    let result = await new TaskManager().runTasks(
        [
            {
                'name': 'averageForMetric',
                'teamKey': 'frc8033',
                'metric': 'teleopHighSuccess'
            }
        ])

        expect(result[0].AverageForMetric).toBe(14.333333333333334)
})

test(`BestAverageForMetric`, async () => {
    let result = await new TaskManager().runTasks(
        [
            {
                'name': 'bestAverageForMetric',
                'tournamentKey': '2022cc',
                'metric': 'teleopHighSuccess'
            }
        ])

        expect(result[0].BestAverageForMetric).toBe(24.857142857142858)
        expect(result[0].team).toBe('frc4414')
})