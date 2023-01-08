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
                return {
                    "results": 'Error reading scouters file',
                    "errorStatus": true,
                    "customCode": 500
                } 
            }
        })

        return data
    }
}

module.exports = GetScoutersSchedule