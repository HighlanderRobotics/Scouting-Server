const Manager = require('./Manager.js')
const fs = require('fs');
const { resolve } = require('path');
const { reject } = require('bcrypt/promises.js');

class GetScouters extends Manager {
    static name = "getScouters"

    constructor() {
        super()
    }

    async runTask() {
        let data = fs.readFileSync(`${__dirname}/.././scouters.json`, 'utf8', (err) => {
            if (err) {
                return "Error reading scouters file"
            }
        })

        return data
    }
}

module.exports = GetScouters