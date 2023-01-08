const Manager = require('./Manager.js')
const fs = require('fs');

class NewScouter extends Manager {
    static name = "newScouter"

    constructor() {
        super()
    }

    async runTask(scouterName, scouterNumber, scouterEmail) {
        fs.readFile(`${__dirname}/../scouters/./scouters.json`, 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err)
            } else {
                data = JSON.parse(data)
                try {
                    data.scouters.forEach((scouter) => {
                        if (scouter.name === scouterName) {
                            // console.log(`Scouter ${scouterName} already exists`)
                            throw new Error(`Scouter ${scouterName} already exists`)
                        }
                    })

                    data.scouters.push({
                        name: scouterName,
                        number: scouterNumber,
                        email: scouterEmail
                    })
    
                    data = JSON.stringify(data)
    
                    fs.writeFile(`${__dirname}/../scouters/./scouters.json`, data, () => {console.log('Updated the file')})

                    let sql = `INSERT INTO scouters (name, phoneNumber, email) VALUES (?, ?, ?)`

                    Manager.db.run(sql, [scouterName, scouterNumber, scouterEmail], (err) => {
                        if (err) {
                            throw new Error(err)
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        })

        return {
            "result": "Recieved",
            "errorStatus": false 
        }
    }
}

module.exports = NewScouter