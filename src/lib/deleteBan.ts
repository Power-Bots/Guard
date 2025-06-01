import { db } from "../main"

export function deleteBan(serverID: any, userID: any){
    const delstmt = db.prepare(`DELETE FROM bans WHERE serverID = ${serverID} AND userID = ${userID}`)
    delstmt.run()
}