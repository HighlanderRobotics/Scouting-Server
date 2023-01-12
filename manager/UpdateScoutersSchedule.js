const Manager = require('./Manager.js')
const fs = require('fs')

class UpdateScoutersSchedule extends Manager {
    static name = 'updateScoutersSchedule'

    constructor() {
        super()
    }

    runTask(schedule) {
        return new Promise((resolve, reject) => {
            try {
                fs.writeFileSync(`${__dirname}/../scouters/./scoutersSchedule.json`, JSON.stringify(schedule), 'utf8')
                
                resolve(`Success`)
            } catch (e) {
                reject({
                    "results": `Error writing to file: ${e}`,
                    "customCode": 500
                })
            }
        })
    }
}

module.exports = UpdateScoutersSchedule