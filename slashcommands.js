const fs = require("fs")
const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { clientId, guild } = require("./config.json")
const commands = []
const slashcommandsFiles = fs.readdirSync("./slashcmd").filter(file => file.endsWith("js")) 

for(const file of slashcommandsFiles){
    const slash = require(`./slashcmd/${file}`)
    commands.push(slash.data.toJSON())

}

const rest = new REST({ version: "9" }).setToken("OTM2MDQ1NTQxMzU0MjUwMjgx.YfHeVw.e4Ncp2c6DkoLhLEuLnAgjr_PX-Y")

createSlash()

async function createSlash(){
    try{
        await rest.put(
            Routes.applicationCommands(clientId, guild), {
                body: commands
            }
        )
        console.log("Slash commands agregados.")
    } catch(e){
        console.error(e)
    }
}