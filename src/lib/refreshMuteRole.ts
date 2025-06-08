import { Guild, GuildChannel, Role, Snowflake } from 'discord.js';
import { bot } from "../main"

export async function refreshMuteRole(guildId: Snowflake, roleId: Snowflake, channel?: GuildChannel){
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
    let channels: any = await guild.channels.fetch()
    if (channel) channels = await guild.channels.fetch(channel.id)
    let fails = 0
    let successful = 0
    channels.forEach(async (channel: any, id: Snowflake) => {
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