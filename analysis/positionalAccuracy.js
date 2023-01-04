const { addAPITeams } = require("../manager/dbmanager.js");
const BaseAnalysis = require("./BaseAnalysis.js");
// const Manager = require('./manager/dbmanager.js')

class positionalAccuracy extends BaseAnalysis {
  static name = `positionalAccuracy`;

  constructor(db, team) {
    super(db);
    this.team = team;
    this.teamKey = "frc" + team;
    // this.start = start
    // this.end = end
    this.hub;
    this.tarmac;
    this.launchPad;
    this.feildEnd;
    this.feild;
  }
  async getAccuracy() {
    let a = this;
    return new Promise(async function (resolve, reject) {
      var sql = `SELECT scoutReport
                FROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
          `;
      a.db.all(sql, [a.team], (err, rows) => {
        if (err) {
          console.log(err);
        }
        let tarmacMakes = 0;
        let tarmacCount = 0;
        let hubMakes = 0;
        let hubCount = 0;
        let launchpadMakes = 0;
        let launchpadCount = 0;
        let fieldEndMakes = 0;
        let feildEndCount = 0;
        let fieldMakes = 0;
        let feildCount = 0;

        //                     0. hub
        // 1. tarmac
        // 2. launchpad
        // 3. fieldEnd
        // 4. field

        rows.forEach(functionAdder);
        function functionAdder(row, index, array) {
          let curr = JSON.parse(row.scoutReport).events;
          for (var i = 0; i < curr.length; i++) {
            let subArr = curr[i];
            if (subArr[2] === 0) {
              hubCount++;
              if (subArr[1] === 0) {
                hubMakes++;
              }
            }
            if (subArr[2] === 1) {
              tarmacCount++;
              if (subArr[1] === 0) {
                tarmacMakes++;
              }
            }
            if (subArr[2] === 2) {
              launchpadCount++;
              if (subArr[1] === 0) {
                launchpadMakes++;
              }
            }
            if (subArr[2] === 3) {
              feildEndCount++;
              if (subArr[1] === 0) {
                fieldEndMakes++;
              }
            }
            if (subArr[2] === 4) {
              feildCount++;
              if (subArr[1] === 0) {
                fieldMakes++;
              }
            }
          }
        }
        a.hub = hubMakes / hubCount;
        a.tarmac = tarmacMakes / tarmacCount;
        a.launchPad = launchpadMakes / launchpadCount;
        a.feildEnd = fieldEndMakes / feildEndCount;
        a.feild = fieldMakes / feildCount;
        // console.log(a.hub)
        // console.log(a.feildEnd)

        // console.log(a.tarmac)

        // console.log(a.launchPad)

        // console.log(a.feild)
        // console.log(makes/len)

        resolve("done");
      });
    });
  }

  runAnalysis() {
    return new Promise(async (resolve, reject) => {
      let a = this;
      await a.getAccuracy().catch((err) => {
        if (err) {
          return err;
        }
      });
      resolve("done");
    });
  }
  finalizeResults() {
    return {
      tarmac: this.tarmac,
      hub: this.hub,
      feild: this.feild,
      feildEnd: this.feildEnd,
      launchPad: this.launchPad,
      team: this.team,
    };
  }
}
module.exports = positionalAccuracy;
