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
const GetTournaments = require('./manager/GetTournaments.js')
const deletePicklist = require('./manager/deletePicklist.js')
const getPicklists = require('./manager/getPicklists.js')
const addPicklist = require('./manager/addPicklist.js')
const addMutablePicklist = require('./manager/addMutablePicklist.js')
const deleteMutablePicklist = require('./manager/deleteMutablePicklist.js')
const getMutablePicklists = require('./manager/getMutablePicklists.js')
const deleteData = require('./manager/deleteData.js')
const editNotes = require('./manager/editNotes.js')
const getScoutReport = require('./manager/getScoutReport.js')
const getPickedTeams = require('./manager/getPickedTeams.js')
const addPickedTeam = require('./manager/addPickedTeam.js')
const getRankOfTeam = require('./manager/getRankOfTeam.js')
const editData = require('./manager/editData.js')
const addMatch = require('./manager/addMatch.js')
const addPitScouting = require('./manager/addPitScouting.js')
const addEpa = require('./manager/addEPA.js')
const addEPA = require('./manager/addEPA.js')


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
                    return new AddTournamentMatches().runTask(body.key)
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
                case GetTournaments.name:
                    return new GetTournaments().runTask()
                case deletePicklist.name:
                    return new deletePicklist().runTask(body.uuid)
                case getPicklists.name:
                    return new getPicklists().runTask(body.team)
                case addPicklist.name:
                    return new addPicklist().runTask(body.uuid, body.name, body.cubeOneScore, body.cubeTwoScore, body.cubeThreeScore, body.coneOneScore, body.coneTwoScore, body.coneThreeScore, body.autoCargo, body.teleopScore, body.defenseScore, body.autoClimb, body.feedCone, body.feedCube, body.avgTotal, body.teleopClimb, body.driverAbility, body.team, body.userName)
                case addMutablePicklist.name:
                    //works as edit or add
                    return new addMutablePicklist().runTask(body.uuid, body.name, body.teams, body.team, body.userName)
                case deleteMutablePicklist.name:
                    return new deleteMutablePicklist().runTask(body.uuid)
                case getMutablePicklists.name:
                    return new getMutablePicklists().runTask(body.team)
                case deleteData.name:
                    return new deleteData().runTask(body.uuid)
                case editNotes.name:
                    return new editNotes().runTask(body.uuid, body.newNote) 
                case getPickedTeams.name:
                    return new getPickedTeams().runTask()
                case addPickedTeam.name:
                    return new addPickedTeam().runTask(body.team)
                case getScoutReport.name:
                    return new getScoutReport().runTask(body.matchKey)
                case getRankOfTeam.name:
                    return new getRankOfTeam().runTask(body.teamKey, body.tournamentKey)
                case editData.name:
                    return new editData().runTask(body.uuid, body.matchKey, body.scouterName, body.startTime, body.scoutReport, body.notes)
                case addMatch.name:
                    return new addMatch().runTask(body)
                case addPitScouting.name: 
                    return new addPitScouting().runTask(body.team, body.lowerCenterGravity, body.driveTrainType, body.lengthDriveTrain, body.widthDriveTrain)
                case addEPA.name:
                    return new addEPA().runTask()
                
                

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