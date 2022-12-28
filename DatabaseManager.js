const Manager = require('./manager/Manager.js')
const AddScoutReport = require('./manager/AddScoutReport.js')
const GetTeams = require('./manager/GetTeams.js')
const InitServer = require('./manager/InitServer.js')
const ResetAndPopulate = require('./manager/ResetAndPopulate.js')
// const AddAPITeams = require('./manager/AddAPITeams.js')
// const AddAPITournaments = require('./manager/AddAPITournaments.js')
// const AddScouters = require('./manager/AddScouters.js')
const AddTournamentMatches = require('./manager/AddTournamentMatches.js')
const IsScouted = require('./manager/IsScouted.js')
const GetScouters = require('./manager/GetScouters.js')
const GetScoutersSchedule = require('./manager/GetScoutersSchedule.js')
const UpdateScoutersSchedule = require('./manager/UpdateScoutersSchedule.js')
const GetMatches = require('./manager/GetMatches.js')
const IsMatchesScouted = require('./manager/IsMatchesScouted.js')
const GetAllNotes = require('./manager/GetAllNotes.js')

class DatabaseManager {
    constructor() {
        
    }

    runTask(task, body) {
        return new Promise(async (resolve, reject) => {
            switch (task) {
                case AddScoutReport.name:
                    // Different naming scheme is because of Jacob
                    resolve(await new AddScoutReport().runTask(`frc${body.teamNumber}`, body.competitionKey, body))
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
                // case AddAPITeams.name:
                //     resolve(await new AddAPITeams().runTask())
                //     break
                // case AddAPITournaments.name:
                //     resolve(await new AddAPITournaments().runTask())
                //     break
                // case AddScouters.name:
                //     resolve(await new AddScouters().runTask())
                //     break
                case AddTournamentMatches.name:
                    resolve(await new AddTournamentMatches().runTask(body.tournamentName, body.tournamentDate))
                    break
                case IsScouted.name:
                    resolve(await new IsScouted().runTask(body.tournamentKey, body.matchKey))
                    break
                case GetScouters.name:
                    resolve(await new GetScouters().runTask())
                    break
                case GetScoutersSchedule.name:
                    resolve(await new GetScoutersSchedule().runTask())
                    break
                case UpdateScoutersSchedule.name:
                    resolve(await new UpdateScoutersSchedule().runTask(body))
                    break
                case GetMatches.name:
                    resolve(await new GetMatches().runTask(body))
                    break
                case IsMatchesScouted.name:
                    resolve(await new IsMatchesScouted().runTask(body.tournamentKey, body.scouterId, body.matchKeys))
                    break
                case GetAllNotes.name:
                    resolve(await new GetAllNotes().runTask(body.teamKey, body.sinceTime))
                    break
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