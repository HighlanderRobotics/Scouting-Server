const Manager = require('./Manager.js')

class AddNonQualTeams extends Manager {
    static name = 'addNonQualTeams'

    constructor() {
        super()
    }

    runTask(body) {
        console.log(body.alliances)
        let sql = `UPDATE matches 
            SET teamKey = ? 
            WHERE teamkey IS NULL
            AND key = ?
        `

        let generatedKey = ''

        return new Promise(async (resolve, reject) => {
            // Do qf matches here
            for (var i = 0; i < 4; i++) {
                generatedKey = `${body.tournamentKey}_${body.matches[i].matchKey}`
                // Better seed
                for (var j = 0; j < 3; j++) {
                    console.log(`${generatedKey}_${j}`)
                    console.log(body.alliances[i].teamNumbers[j])

                    await Manager.db.run(sql, [`frc${body.alliances[i].teamNumbers[i]}`, `${generatedKey}_${j}`], (err) => {
                        if (err) {
                            console.log(err)
                            reject({
                                'result': err,
                                'customCode': 500
                            })
                        }
                    })
                }
                for (var j = 3; j < 6; j++) {
                    console.log(`${generatedKey}_${j}`)
                    console.log(body.alliances[8 - (i + 1)].teamNumbers[j - 3])

                    await Manager.db.run(sql, [`frc${body.alliances[8 - (i + 1)].teamNumbers[j - 3]}`, `${generatedKey}_${j}`], (err) => {
                        if (err) {
                            console.log(err)
                            reject({
                                'result': err,
                                'customCode': 500
                            })
                        }
                    })
                }
            }
            resolve('Done')
        })
    }
}

module.exports = AddNonQualTeams