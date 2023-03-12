const { map } = require('mathjs')
const BaseAnalysis = require('../../BaseAnalysis.js')
// const Manager = require('./manager/dbmanager.js')

class cargoCountAuto extends BaseAnalysis {
    static name = `cargoCountAuto`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.start = start
        // this.end = end
        this.paths = {}

    }
    async getAccuracy() {
        let a = this
        return new Promise(async function (resolve, reject) {

            var sql = `SELECT scoutReport, newMatches.key AS key
                FROM data
            JOIN (SELECT matches.key AS key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
               
          `;
            let jsonObject = {};
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                if (rows != undefined) {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array) {
                        let curr = JSON.parse(row.scoutReport).events
                        console.log(row)
                        let arr = []
                        for (var i = 0; i < curr.length; i++) {

                            let subArr = curr[i]

                            if (subArr[0] < 16) {
                                if (subArr[1] === 10 || subArr[1] === 11 || subArr === 12) {
                                    arr.push(subArr[1])
                                }
                                else {
                                    arr.push(subArr[2])
                                }

                            }
                           
                        }

                        let total = 0
                        let data = JSON.parse(row.scoutReport)
                        if (data.autoChallengeResult === 1) {
                            total += 8
                        }
                        else if (data.autoChallengeResult === 2) {
                            total += 12
                        }
                        for (var i = 0; i < curr.length; i++) {
                            let entry = curr[i]
                            if (entry[0] <= 16 && entry[1] === 2) {
                                let max = Math.ceil(entry[2] / 3)
                                if (max === 3) {
                                    total += 6

                                }
                                if (max === 2) {
                                    total += 4

                                }
                                if (max === 1) {
                                    total += 3

                                }
                            }
                        }
                        if (arr.length > 1) {
                            if (jsonObject.hasOwnProperty(arr)) {
                                jsonObject[arr].frequency++;
                            } else {
                                jsonObject[arr] = { frequency: 1, score: total };
                            }
                        }
                    }

                    
                }
                a.paths = jsonObject
                resolve("done")
p

            })

                // let arr = [];
                // map.forEach((value, key) => {
                //     arr.push({ position: key, frequency: value.freq, score: value.score });
                // });
              

            

    })
            .catch((err) => {
    if (err) {
        return err
    }
})
            .then((data) => {
    // console.log(data)
    return data
})
    }
addKeyValue(key, score) {

}

runAnalysis() {
    return new Promise(async (resolve, reject) => {
        let a = this
        var temp = await a.getAccuracy().catch((err) => {
            if (err) {
                return err
            }
        })
        // a.result = temp  
        resolve("done")
    })

}
finalizeResults() {
    return {
        "paths": Object.entries(this.paths).map(([key, value]) => ({
            ...value,
            positions: key.split(",").map(i => parseInt(i)),
        })),
        "team": this.team
    }
}

}
module.exports = cargoCountAuto
