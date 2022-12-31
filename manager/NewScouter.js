const Manager = require('./Manager.js')

class NewScouter extends Manager {
    static name = "nvewScouter"

    constructor() {
        super()
    }

    async runTask(scouterName, scouterNumber, scouterEmail) {
        // Do later addScoutReport has more priority   
    }
}

module.exports = NewScouter