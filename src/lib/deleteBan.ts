import { db } from "../main"

export function deleteBan(serverID: any, userID: any){
    const delstmt = db.prepare(`DELETE FROM timers WHERE serverID = ${serverID} AND userID = ${userID} AND type = 'ban'`)
    delstmt.run()
}