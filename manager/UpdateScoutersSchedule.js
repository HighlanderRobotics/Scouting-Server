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
                console.log('Error writing to scouters file')
            }
        })
        return {
            "results": "Recieved",
            "errorStatus": false
        }
    }
}

module.exports = UpdateScoutersSchedule