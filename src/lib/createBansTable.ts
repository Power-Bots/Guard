import { db } from "../main"
export function createBansTable(){
    db.exec(`CREATE TABLE IF NOT EXISTS bans (
        userID INTEGER NOT NULL,
        serverID INTEGER NOT NULL,
        unbanTime INTEGER
    )`)
}