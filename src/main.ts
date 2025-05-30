import { Bot } from "powerbotlibrary"
import { db } from "powerbotlibrary"
export { db } from "powerbotlibrary"

import { createBansTable } from "./lib/createBansTable"

// Check to see if a member should be unbanned every 10 seconds
async function unbanCheck() {
    createBansTable()
    const stmt = db.prepare(`SELECT * FROM bans WHERE unbanTime <= ${Date.now()}`)
    stmt.all().forEach(async (row: any) => {
        const serverID = row.serverID.toString()
        const userID = row.userID.toString()
        let server = await bot.client.guilds.fetch(serverID)
        server.bans.remove(userID)
        const delstmt = db.prepare(`DELETE FROM bans WHERE serverID = ${serverID} AND userID = ${userID}`)
        delstmt.run()
    })
}
setInterval(unbanCheck, 10 * 1000)

export const bot = new Bot(__dirname)