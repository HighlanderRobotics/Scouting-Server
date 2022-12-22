const Manager = require('./Manager.js')
const fs = require('fs')

class UpdateScoutersSchedule extends Manager {
    static name = 'updateScoutersSchedule'

    constructor() {
        super()
    }

    runTask(schedule) {
        console.log()
        fs.writeFileSync(`${__dirname}/../scouters/./scoutersSchedule.json`, JSON.stringify(schedule), 'utf8', (err) => {
            if (err) {
                return 'Error writing to scouters file'
            }
        })

        return 'scoutersSchedule is updated'
    }
}

module.exports = UpdateScoutersSchedule