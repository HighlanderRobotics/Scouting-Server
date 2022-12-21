const Manager = require('./manager/Manager.js')
const AddScoutReport = require('./manager/AddScoutReport.js')
const GetTeams = require('./manager/GetTeams.js')
const InitServer = require('./manager/InitServer.js')
const ResetAndPopulate = require('./manager/ResetAndPopulate.js')
const AddAPITeams = require('./manager/AddAPITeams.js')
const AddAPITournaments = require('./manager/AddAPITournaments.js')
const AddScouters = require('./manager/AddScouters.js')
const AddTournamentMatches = require('./manager/AddTournamentMatches.js')
const GetScouters = require('./manager/GetScouters.js')

class DatabaseManager {

    constructor() {
        
    }

    runTask(task, body) {
        return new Promise(async (resolve, reject) => {
            switch (task) {
                case AddScoutReport.name:
                    resolve(await new AddScoutReport().runTask(body.teamKey, body.tournamentKey, body.data))
                    break
                case GetTeams.name:
                    resolve(await new GetTeams().runTask())
                    break
                case InitServer.name:
                    resolve(await new InitServer().runTask())
                    break
                case ResetAndPopulate.name:
                    resolve(await new ResetAndPopulate().runTask())
                    break
                case AddAPITeams.name:
                    resolve(await new AddAPITeams().runTask())
                    break
                case AddAPITournaments.name:
                    resolve(await new AddAPITournaments().runTask())
                    break
                case AddScouters.name:
                    resolve(await new AddScouters().runTask())
                    break
                case AddTournamentMatches.name:
                    resolve(await new AddTournamentMatches().runTask(body.tournamentName, body.tournamentDate))
                    break
                case GetScouters.name:
                    resolve(await new GetScouters().runTask())
                    break;
                default:
                    reject(`${task} is not a task`)
                    break
            }
    
        })
        .catch((err) => {
            if (err) {
                return err
            }
        })
        .then((results) => {
            return results
        })
    }
}

module.exports = DatabaseManager