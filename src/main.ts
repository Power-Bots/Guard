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

// Check for finished timers every 1 second
async function timerCheck() {
    const timers = await Timer.getFinishedTimers()
    if (!timers) return
    timers.forEach(async (timer: Timer) => {
        if (!timer.type) return
        const command = bot.commands.get(timer.type)
        if (!(command && command.finishedTimer)) return await timer.del()
        await command.finishedTimer(timer)
        timer.del()
    })
}
setInterval(timerCheck, 1 * 1000)