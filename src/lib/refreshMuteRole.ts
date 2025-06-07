import { Guild, NonThreadGuildBasedChannel, Role, Snowflake, PermissionFlagsBits } from 'discord.js';
import { bot } from "../main"

export async function refreshMuteRole(guildId: Snowflake, roleId: Snowflake){
    let guild: Guild | null = null
    let role: Role | null = null
    try {
        guild = await bot.client.guilds.fetch(guildId)
    } catch {}
    if (!guild) return
    try {
        role = await guild.roles.fetch(roleId)
    } catch {}
    if (!role) return
    let channels = await guild.channels.fetch()
    let fails = 0
    let successful = 0
    channels.forEach(async (channel: NonThreadGuildBasedChannel | null, id: Snowflake) => {
        try {
            channel?.permissionOverwrites.edit(role, {
                SendMessages: false,
                SendMessagesInThreads: false,
                CreatePublicThreads: false,
                CreatePrivateThreads: false
            })
            successful++
        } catch {
            fails++
        }
    })
    return {fails: fails, successful: successful}
}