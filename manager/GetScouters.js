const Manager = require('./Manager.js')
const fs = require('fs')

class GetScouters extends Manager {
    static name = 'getScouters'

    constructor() {
        super()
    }

    async runTask() {
        let scoutersList = []

        try {
            let data = fs.readFileSync(`${__dirname}/../scouters/./scouters.json`, 'utf8')

            data = JSON.parse(data)

            for (let i = 0; i < data.scouters.length; i++) {
                scoutersList.push(data.scouters[i].name)
            }
    
            return scoutersList
        } catch (e) {
            return new Error({
                "results": `Error reading scouters file: ${e}`,
                "customCode": 500
            })
        }
    }
}

module.exports = GetScouters