const Manager = require('./Manager.js')
const fs = require('fs')

class GetScouters extends Manager {
    static name = 'getScouters'

    constructor() {
        super()
    }

    async runTask() {
        let data = fs.readFileSync(`${__dirname}/../scouters/./scouters.json`, 'utf8', (err) => {
            if (err) {
                return 'Error reading scouters file'
            }
        })

        return data
    }
}

module.exports = GetScouters