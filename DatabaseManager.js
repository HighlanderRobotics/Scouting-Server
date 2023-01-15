const Manager = require('./manager/Manager.js')
const AddScoutReport = require('./manager/AddScoutReport.js')
const GetTeams = require('./manager/GetTeams.js')
const InitServer = require('./manager/InitServer.js')
const ResetAndPopulate = require('./manager/ResetAndPopulate.js')
const AddAPITeams = require('./manager/AddAPITeams.js')
const AddAPITournaments = require('./manager/AddAPITournaments.js')
const AddScouters = require('./manager/AddScouters.js')
const AddTournamentMatches = require('./manager/AddTournamentMatches.js')
const IsScouted = require('./manager/IsScouted.js')
const GetScouters = require('./manager/GetScouters.js')
const GetScoutersSchedule = require('./manager/GetScoutersSchedule.js')
const UpdateScoutersSchedule = require('./manager/UpdateScoutersSchedule.js')
const GetMatches = require('./manager/GetMatches.js')
const IsMatchesScouted = require('./manager/IsMatchesScouted.js')
const GetAllNotes = require('./manager/GetAllNotes.js')
const NewScouter = require('./manager/NewScouter.js')
const MatchesCompleted = require('./manager/MatchesCompleted.js')
const GetTeamsInTournament = require('./manager/GetTeamsInTournament.js')

class DatabaseManager {
    constructor() {
        
    }

    runTask(task, body) {
        // return new Promise(async (resolve, reject) => {
            switch (task) {
                case AddScoutReport.name:
                    // Different naming scheme is because of Jacob
                    return new AddScoutReport().runTask(`frc${body.teamNumber}`, body.tournamentKey, body)
                case GetTeams.name:
                    return new GetTeams().runTask()
                case InitServer.name:
                    return new InitServer().runTask()
                case ResetAndPopulate.name:
                    return new ResetAndPopulate().runTask()
                case AddAPITeams.name:
                    return new AddAPITeams().runTask()
                case AddAPITournaments.name:
                    return new AddAPITournaments().runTask(body.year)
                case AddScouters.name:
                    return new AddScouters().runTask()
                case AddTournamentMatches.name:
                    return new AddTournamentMatches().runTask(body.tournamentName, body.tournamentDate)
                case IsScouted.name:
                    return new IsScouted().runTask(body.tournamentKey, body.matchKey)
                case GetScouters.name:
                    return new GetScouters().runTask()
                case GetScoutersSchedule.name:
                    return new GetScoutersSchedule().runTask()
                case UpdateScoutersSchedule.name:
                    return new UpdateScoutersSchedule().runTask(body)
                case GetMatches.name:
                    return new GetMatches().runTask(body)
                case IsMatchesScouted.name:
                    return new IsMatchesScouted().runTask(body.tournamentKey, body.scouterName, body.matchKeys)
                case GetAllNotes.name:
                    return new GetAllNotes().runTask(body.teamKey, body.sinceTime)
                case NewScouter.name:
                    return new NewScouter().runTask(body.scouterName, body.scouterNumber, body.scouterEmail)
                case MatchesCompleted.name:
                    return new MatchesCompleted().runTask(body)
                case GetTeamsInTournament.name:
                    return new GetTeamsInTournament().runTask(body.tournamentKey)
                default:
                    return new Promise((resolve, reject) => {
                        reject({
                            "task": task,
                            "result": `${task} is not a task`,
                            "customCode": 400
                        })
                    })
            // }
    
        }
    }
}

module.exports = DatabaseManager