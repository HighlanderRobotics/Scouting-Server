import * as dotenv from 'dotenv';
dotenv.config();

import inquirer from "inquirer";
import chalk from "chalk";
import { oraPromise } from "ora";

import { readFile, writeFile } from "fs/promises";
import path, { resolve } from "path";

import { exec } from 'child_process';
import fetch from 'node-fetch';
import DatabaseManager from './DatabaseManager.js';

try {
    await readFile(path.join(process.cwd(), ".env"))
    console.log("A .env file already exists");
} catch (error) {
    if (error.code = 'ENOENT') {
        await writeFile(path.join(process.cwd(), ".env"), "")
        console.log("Created a .env file");
    }
}

let questions = []

questions = [
    ...questions,
    {
        type: "input",
        name: "tournament_key",
        message: "What's the key for the tournament you're at?",
        validate: (value) => {
            const pass = value.match(/\d{4}.+/);
            if (pass) return true;

            return "Must include the year at the beginning"
        }
    }
]

if (!process.env.PORT) {
    questions.push({
        type: "number",
        name: "port",
        message: "What port should the server be hosted on?",
        default: 4000,
    })
}

if (!process.env.KEY) {
    questions.push({
        type: "input",
        name: "tba_key",
        message: "What's your TBA key?",
        validate: (value) => {
            const pass = value.match(/[a-zA-Z]+/);
            if (pass) return true;

            return "Invalid"
        },
        transformer: (value) => {
            let output = "";

            for (let i = 0; i < value.length; i++) {
                output = output + "*";
            }

            return output;
        }
    })
}

async function addEnvItem(key, value) {
    const currentFile = await readFile(path.join(process.cwd(), ".env"), { encoding: "utf-8" });

    await writeFile(path.join(process.cwd(), ".env"), `${currentFile}\n${key}=${value}`);
}

inquirer.prompt(questions).then(async (answers) => {
    if (answers.tba_key) {
        await addEnvItem("KEY", answers.tba_key);
    }

    if (answers.port) {
        await addEnvItem("PORT", answers.port)
    }

    
    const serverProcess = exec("npm start");

    await oraPromise(new Promise((resolve, reject) => setTimeout(() => resolve("Server started"), 5000)), {
        text: "Starting server",
        successText: "Started server"
    });

    await oraPromise(new DatabaseManager().runTask("resetAndPopulate"), {
        text: "Resetting and populating database",
        successText: "Reset and populated database",
    });

    // await oraPromise();

    await oraPromise(new DatabaseManager().runTask("addTournamentMatches", { "key": answers.tournament_key }), {
        text: "Adding matches",
        successText: "Done adding matches",
    });

    // await oraPromise(new DatabaseManager().runTask("addEPA"),
    // {
    //     text: "adding EPA of teams",
    //     successText : "done adding EPA of teams",
    // })

    serverProcess.kill();

    console.log("\n" + chalk.green("All done!") + "\n\n" + "Next: run " + chalk.blue("npm start") + " to start the server.");
});
