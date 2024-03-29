const fs = require('fs')
const Papa = require('papaparse')

// const scouters = JSON.parse(fs.readFileSync(`./scouters.json`, 'utf8')).scouters
const availability = Papa.parse(fs.readFileSync('./Availability.csv', 'utf8'), { header: true }).data
let version = 1
let previous = fs.readFileSync('./scoutersSchedule.json', 'utf8')
if (undefined != previous && previous.includes('version')) {
    console.log('Previous version already exists')
    version = JSON.parse(previous).version + 1
}

const tournamentKey = '2022cc'
const amountOfQms = 65
const shiftSize = 5
let nonqual = 0
const busy = ['Vaughn Khouri', 'Alex Ware', 'Reece Beck', 'Peter Stokes', 'Jasper Tripp']


let run = async () => {
    let viables = []

    let newData = {
        'version': version,
        'shifts': []
    }

    availability.forEach(scouter => {
        if (scouter.availability === 'Yes') {
            viables.push(scouter.name)
        } else if (scouter.availability === 'Maybe') {
            console.log(`Confirm with: ${scouter.name}`)
        }
    })

    for (var i = 0; i < (amountOfQms/shiftSize) + 4; i++) {
        let startMatchKey = tournamentKey + '_'
        let endMatchKey = tournamentKey + '_'

        let startMatchNumber = 0
        let endMatchNumber = 0

        if ((i*shiftSize + 1) < amountOfQms && (i*shiftSize + shiftSize) < amountOfQms) {
            // Before amount of qms
            startMatchNumber = (i*shiftSize + 1)
            endMatchNumber = (i*shiftSize + shiftSize)
            startMatchKey += 'qm' + (i*shiftSize + 1)
            endMatchKey += 'qm' + (i*shiftSize + shiftSize)
        } else if ((i*shiftSize + 1) < amountOfQms) {
            // Stops at amount of qms because after would be pick
            startMatchNumber = (i*shiftSize + 1)
            endMatchNumber = amountOfQms
            startMatchKey += 'qm' + (i*shiftSize + 1)
            endMatchKey += 'qm' + amountOfQms
        } else {
            if (nonqual == 0) {
                // First non qual match
                startMatchNumber = amountOfQms + 1
                endMatchNumber = amountOfQms + 4
                startMatchKey += 'qf0'
                endMatchKey += 'qf3'
            } else if (nonqual == 1) {
                // Figured out startMatchNumber and endMatchNumber like this because it's easier to keep track of how many matches in a non-qual shift (since double elimination)
                startMatchNumber = amountOfQms + 4 + 1
                endMatchNumber = amountOfQms + 4 + 4
                startMatchKey += 'ef0'
                endMatchKey += 'sf1'
            } else if (nonqual == 2) {
                // Winners finals happens between ef2 and ef5
                startMatchNumber = amountOfQms + 4 + 4 + 1
                endMatchNumber = amountOfQms + 4 + 4 + 5
                startMatchKey += 'ef2'
                // ef5 is also known as Losers Finals, but isn't labelled differently ig
                endMatchKey += 'ef5'
            } else if (nonqual == 3) {
                // Grand Finals
                startMatchNumber = amountOfQms + 4 + 4 + 5 + 1
                endMatchNumber = amountOfQms + 4 + 4 + 5 + 3
                startMatchKey += 'gf0'
                endMatchKey += 'gf2'
            } else {
                // If it gets here I guess I can't count
                console.log('Barry can\'t count lmao')
                break
            }
            nonqual++
        }

        newData.shifts[i] = {
            'start': startMatchNumber,
            'end': endMatchNumber,
            'startKey': startMatchKey,
            'endKey': endMatchKey,
            'scouts': []
        }

        while (newData.shifts[i].scouts.length < 6) {
            var possibleScout = viables[Math.floor(Math.random() * (viables.length))]
            
            if (
                !newData.shifts[(i)].scouts.includes(possibleScout)
                && !busy.includes(possibleScout)
                && !newData.shifts[(i-1) < 0 ? 0 : i-1].scouts.includes(possibleScout)
            ) {
                newData.shifts[i].scouts.push(possibleScout)
            }
        }

    }

    console.log('Writing to file')
    fs.writeFileSync('./scoutersSchedule.json', JSON.stringify(newData), 'utf8', (err) => {
        if (err) {
            return 'Error writing to scouters file'
        }
        console.log('written')
    })    
}

run()