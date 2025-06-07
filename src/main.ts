import { bot } from "@power-bots/powerbotlibrary"
import { Timer } from "./lib/timers"

export { bot, knex } from "@power-bots/powerbotlibrary"

bot.setup(__dirname)
bot.run()

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