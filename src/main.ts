import { bot, Config } from "@power-bots/powerbotlibrary"
export { bot } from "@power-bots/powerbotlibrary"
export { knex } from "@power-bots/powerbotlibrary"
import { Timer } from "./lib/timers"
import { Guild, NonThreadGuildBasedChannel, Role, Snowflake } from "discord.js"

bot.setup(__dirname)
bot.run()

Config.onSet("guild.mute.role", async (config: any) => {
    let guild: Guild | null = null
    let role: Role | null = null
    try {
        guild = await bot.client.guilds.fetch(config.id)
    } catch {}
    if (!guild) return
    try {
        role = await guild.roles.fetch(config.value)
    } catch {}
    if (!role) return
    let channels = await guild.channels.fetch()
    channels.forEach((channel: NonThreadGuildBasedChannel | null, id: Snowflake) => {
        channel?.permissionOverwrites.edit(role, {
            SendMessages: false,
            SendMessagesInThreads: false,
            CreatePublicThreads: false,
            CreatePrivateThreads: false
        })
    })
})

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