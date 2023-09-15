const Manager = require('./Manager.js')

class GetTeamsInTournament extends Manager {
    static name = 'getTeamsInTournament'

    constructor() {
        super()
    }

    runTask(tournamentKey) {
        var sql = `SELECT teams.key, teamNumber, teamName FROM matches 
            INNER JOIN teams ON matches.teamKey = teams.key
            WHERE matches.tournamentKey = '${tournamentKey}'
            ORDER BY teamnumber
        `


        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, storedTeams) => {
                if (err) {
                    reject({
                        "results": err,
                        "customCode": 500
                    })
                }
                
                if (storedTeams == undefined) {
                    reject({
                        "results": "No teams found for the tournament",
                        "customCode": 406
                    })
                } else {
                    let teams = []

                    let temp = []

                    storedTeams.forEach((team) => {
                        if (!temp.includes(team.teamNumber)) {
                            temp.push(team.teamNumber)
                            teams.push(team)
                        }
                    })

                    resolve(teams)
                }
            })
        })
    }
}

module.exports = GetTeamsInTournament