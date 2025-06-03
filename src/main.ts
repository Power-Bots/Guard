import { Bot } from "@power-bots/powerbotlibrary"
export { db } from "@power-bots/powerbotlibrary"
import path from "node:path"

export const knex = require("knex")({
  client: 'better-sqlite3',
  connection: {
    filename: path.join(__dirname, '../bot.db')
  },
  useNullAsDefault: true
})

import { Timer } from "./lib/timers"

export const bot = new Bot(__dirname)

// Check for finished timers every 10 seconds
async function timerCheck() {
    const timers = await Timer.getFinishedTimers()
    if (!timers) return
    timers.forEach(async (timer: Timer) => {
        if (timer.type === "ban" && timer.userID && timer.serverID) {
            const serverID = timer.serverID.toString()
            const userID = timer.userID.toString()
            try {
                let server = await bot.client.guilds.fetch(serverID)
                server.bans.remove(userID)
            } catch (e) {
                bot.log.error(e)
            }
            timer.del()
        }
    })
}
setInterval(timerCheck, 10 * 1000)