# Currently runs from localhost

## POST /runEngine
Will accept a uuid and a list of analyses (made of analyses that can be run (will come later))
```
body: {
    "uuid": uuid,
    "analysis": [
        {
            "name": "averagePoints",
            "analysisId": 2,
        },
        {
            "name": "averagePoints",
            "analysisId": 3,
        }
    ]
}
```
### Will return: Response code 200
```
{
    "uuid": uuid,
    "taskNumber": taskNumber
}
```

## POST /getTaskData
Can accept either a uuid that was sent with the initial request AND/OR the taskNumber that is returned with the uuid. Will return the promise associated with the taskNumber/uuid
```
body: {
    "uuid": uuid,
    "taskNumber": INTEGER
}
```
### Will return: Response code 200
```
{
    "uuid": uuid,
    "taskNumber": INTEGER,
    "taskData": Promise
}
```

## POST /addScoutRport
Will accept if a teamKey, tournamentKey, and data
```
body: {
    "uuid": "uuidgoeshere",
    "teamKey": "frc254",
    "tournamentKey": "2022cc",
    "data": {
        "constantData": {
            "scouterId": "Barry B Benson",
            "matchNumber": 13,
            "defense": 0,
            "startTime": 129834982,
            "notes": "Ya like jazz"
        },
        "gameDependent": {
            "events": [
                {
                    "event": "point"
                },
                {
                    "event": "point"
                }
            ]
        }
    }
}
```
### Will return: Response code 200
{
    "uuid": uuid,
    "taskNumber": taskNumber
}

## POST /addTournamentMatches
Add all the matches for a tournament, currently only works for matches where all the teams are in the db, so some offseason matches will have issues (such as Bordie React)
```
body: {
    "tournamentName": "Chezy Champs",
    "tournamentDate": "2022-09-23"
}
```
### Will return: Response code 200
{
    "taskNumber": taskNumber
}

## GET /listTeams
Sends JSON list of all teams in the teams table
Response code 200
```
[
    {
        "key": "frc1",
        "teamNumber": 1,
        "teamName": "The Juggernauts"
    },
    {
        "key": "frc4",
        "teamNumber": 4,
        "teamName": "Team 4 ELEMENT"
    }
]
```