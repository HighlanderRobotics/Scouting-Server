const Manager = require('./Manager.js')
const fs = require('fs')

class GetScoutersSchedule extends Manager {
    static name = 'getScoutersSchedule'

    constructor() {
        super()
    }

    runTask() {
        let data = fs.readFileSync(`${__dirname}/../scouters/./scoutersSchedule.json`, 'utf8', (err) => {
            if (err) {
                return 'Error reading scouters file'
            }
        })

        return data
    }
}

module.exports = GetScoutersSchedule