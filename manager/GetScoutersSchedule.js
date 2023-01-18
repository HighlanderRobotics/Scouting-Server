const Manager = require('./Manager.js')
const fs = require('fs')

class GetScoutersSchedule extends Manager {
    static name = 'getScoutersSchedule'

    constructor() {
        super()
    }

    runTask() {
        return new Promise((resolve, reject) => {
            let data = fs.readFileSync(`${__dirname}/../scouters/./scoutersSchedule.json`, 'utf8', (err) => {
                if (err) {
                    reject({
                        'result': `Error reading scoutersSchedule file: ${err}`,
                        'customCode': 500
                    })
                }
            })
            resolve(data)
        })
    }
}

module.exports = GetScoutersSchedule