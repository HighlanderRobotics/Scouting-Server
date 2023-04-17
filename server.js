require('dotenv').config()

const axios = require("axios")

//this will allow us to pull params from .env file
const express = require('express')

// HTTPS
const port = process.env.PORT

const app = express()
app.use(express.json())

// Terminal QR Code
var qrcode = require('qrcode-terminal')

//socket io
const { Server, Socket } = require("socket.io")


// ngrok
// Get constant url from paid ngrok
let url = undefined

setup = async () => {

    try {
        url = await axios.get('http://localhost:4040/api/tunnels')
            .then((res) => {
                // console.log(res.data.tunnels[0])
                return res.data.tunnels[0].public_url
            })
        console.log(url)

        if (url.startsWith('https://')) {
            const https = 'https://'
            return url.slice(https.length)
        }

        if (url.startsWith('http://')) {
            const http = 'http://'
            return url.slice(http.length)
        }
    } catch (e) {
        console.log(`\nngrok link is not setup/running\n`)
    }

    return url
}

// Temporary if others want to use old endpoints for integration test day, will force changing endpoints later
const Manager = require('./manager/dbmanager.js')

const server = app.listen(port, async () => {
    console.log(`Collection Server running on ${port}...`)

    // Scannable qr code with ngrok link
    if (await setup()) {
        qrcode.generate(url)
    }

    // Init server here, idk what it would init but possibly could run + cache analysis engine, all it does is turn foreign keys on

    var sql = `PRAGMA foreign_keys = ON`

    // Shouldn't give a response if it runs correctly, just enables foreign keys

    return new Promise((resolve, reject) => {
        Manager.db.get(sql, (err) => {
            if (err) {
                reject(`(Ask Barry) Error: ${err}`)
            } else {
                resolve()
            }
        })
    })
        .catch((err) => {
            if (err) {
                return err
            }
        })
        .then((results) => {
            return results
        })
        .then((results) => {
            if (results) {
                console.log(results)
            } else {
                console.log(`Initializing server`)
            }
        })
})

exports.app = app
