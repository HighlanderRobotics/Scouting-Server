const Manager = require('./Manager.js')

class addPitScouting extends Manager {
    static name = 'addPitScouting'

    constructor() {
        super()
    }
    
    runTask(team, lowerCenterGravity, driveTrainType, lengthDriveTrain, widthDriveTrain) {
        let sql = `INSERT INTO pitScouting (team, lowerCenterGravity, driveTrain, lengthDriveTrain, widthDriveTrain) VALUES (?, ?, ?, ?, ?)`
        
      

        return new Promise((resolve, reject) => {

            Manager.db.all(sql, [team, lowerCenterGravity, driveTrainType, lengthDriveTrain, widthDriveTrain], (err, rows) => {
                if(err)
                {
                    console.log(err)
                    reject(err)
                }


            })
            resolve("done")
        })
    }

}

module.exports = addPitScouting