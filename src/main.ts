import { Bot } from "@power-bots/powerbotlibrary"
import { db } from "@power-bots/powerbotlibrary"
export { db } from "@power-bots/powerbotlibrary"

import { deleteBan } from "./lib/deleteBan"

// Check to see if a member should be unbanned every 10 seconds
async function unbanCheck() {
    const stmt = db.prepare(`SELECT * FROM timers WHERE finishTime <= ${Date.now()} AND type = 'ban'`)
    stmt.all().forEach(async (row: any) => {
        const serverID = row.serverID.toString()
        const userID = row.userID.toString()
        let server = await bot.client.guilds.fetch(serverID)
        try {
            server.bans.remove(userID)
        } catch {}
        deleteBan(serverID, userID)
    })
}
setInterval(unbanCheck, 10 * 1000)

export const bot = new Bot(__dirname)