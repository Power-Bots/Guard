import { db, knex } from "../main"

interface TimerOptions {
    serverID: number | string,
    userID: number | string | null,
    channelID: number | string | null,
    finishTime: number | string | null,
    type: string
}

export class Timer {
    serverID: number | string
    userID: number | string | null
    channelID: number | string | null
    finishTime: number | string | null
    type: string
    constructor(options: TimerOptions){
        this.serverID = options.serverID
        this.userID = options.userID
        this.channelID = options.channelID
        this.finishTime = options.finishTime
        this.type = options.type
    }
    /*

    UNTESTED

    static async new(options: TimerOptions){
        knex("timers").insert({
            serverID: options.serverID,
            userID: options.userID,
            channelID: options.channelID,
            finishTime: options.finishTime,
            type: options.type
        })
        return new Timer(options)
    }
    static async get(options: TimerOptions): Promise<Timer[] | null> {
        const timersRaw = await knex("timers").where(options)
        let timers = []
        for (const timerRaw of timersRaw){
            timers.push(new Timer(timerRaw))
        }
        if (timers.length === 0) return null
        return timers
    }
    */
    static async getFinishedTimers(): Promise<Timer[] | null> {
        const timersRaw = await knex("timers")
            .where("finishTime", "<=", Date.now())
        let timers = []
        for (const timerRaw of timersRaw){
            timers.push(new Timer(timerRaw))
        }
        if (timers.length === 0) return null
        return timers
    }
    async del(){
        await knex("timers").where({
            serverID: this.serverID,
            userID: this.userID,
            channelID: this.channelID,
            finishTime: this.finishTime,
            type: this.type
        }).del()
    }
}