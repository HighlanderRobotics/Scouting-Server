const { json } = require('express')
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
                        let arr = []
                        let events = []
                        let currObj = -1
                        for (var i = 0; i < curr.length; i++) {

                            let subArr = curr[i]

                            if (subArr[0] < 16) {
                                    
                                    if (subArr[1] === 1 || subArr[1] === 0) {
                                        currObj = subArr[1]
                                        events.push(subArr[1])
                                        arr.push({ "location": subArr[2], "event": subArr[1], "time": subArr[0]})
                                    }
                                    else if (subArr[1] === 2) {
                                        events.push(subArr[1])
                                        arr.push({ "location": subArr[2], "event": subArr[1] + currObj, "time": subArr[0]})
                                        currObj = -1
                                    }
                                    else {
                                        events.push(subArr[1])
                                        arr.push({ "location": subArr[2], "event": subArr[1], "time": subArr[0] })
                                    }
                                
                            }

                        }

                        let total = 0
                        let str = ""
                        let data = JSON.parse(row.scoutReport)
                        if (data.autoChallengeResult === 1) {
                            total += 8
                            arr.push({ "location": 11, "event": 9, "time": 15})
                            str = "docked"

                        }
                        else if (data.autoChallengeResult === 2) {
                            arr.push({ "location": 11, "event": 9, "time": 15})
                            total += 12
                            str = "engaged"

                        }
                        else if (data.autoChallengeResult === 3)
                        {
                            arr.push({ "location": 11, "event": 9, "time": 15})
                            str = "failed"

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
                        if (events.length > 1) {
                            let key = JSON.stringify(events)
                            if (jsonObject.hasOwnProperty(key)) {
                                jsonObject[key].frequency++;
                                jsonObject[key].matches.push(row.key)

                            } else {
                                jsonObject[key] = { frequency: 1, score: total, positions : arr, matches : [row.key], chargeRate : {"docked" : 0, "engaged" : 0, "failed" : 0}};
                                jsonObject[key].chargeRate.str
                            }
                            console.log(str)
                            if (str != "")
                            {
                                jsonObject[key].chargeRate[str]++;
                            }


                        }


                    }


                }

                a.paths = Object.entries(jsonObject).map(([key, value]) => ({
                    ...value,
                }))
                resolve("done")
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
            "paths": this.paths,
            "team": this.team,
        }
    }
}
module.exports = cargoCountAuto
