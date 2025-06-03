import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, GuildChannel, Role, Guild } from 'discord.js';
import { parseTime } from '../../lib/parseTime';
import { Timer } from '../../lib/timers';
import { bot } from '../../main';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Lock a channel')
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to lock. If none given the current one is used")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("message")
            .setDescription("Message to send to channel")
            .setRequired(false)
        )
        .addStringOption(option => 
            option
            .setName("duration")
            .setDescription("Duration of ban. Example: 1y 5M 9w 1d 8h 7m 3s")
            .setRequired(false)
        ),
	async execute(interaction: any) {
        if (!interaction.appPermissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.reply(
            {content: `❌ I don't have the \`Manage Channels\` permission!`, flags: [MessageFlags.Ephemeral]});
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.reply(
            {content: `❌ You don't have the \`Manage Channels\` permission`, flags: [MessageFlags.Ephemeral]});
        const channel: GuildChannel = interaction.options.getChannel("channel") || interaction.channel
        const everyone: Role = interaction.guild.roles.everyone
        channel.permissionOverwrites.edit(everyone, {
            SendMessages: false,
            SendMessagesInThreads: false,
            CreatePublicThreads: false,
            CreatePrivateThreads: false,
            AddReactions: false
        })
        const unparsedDuration = interaction.options.getString("duration")
        let duration: number;
        if (unparsedDuration){
            let finishTime;
            try {
                duration = parseTime(unparsedDuration)
                finishTime = Date.now() + duration
            } catch {
                return await interaction.reply({content: `❌ Invalid Duration`, flags: [MessageFlags.Ephemeral]});
            }
            await Timer.new({
                channelID: channel.id,
                serverID: interaction.guildId,
                finishTime: finishTime,
                type: "lock"
            })
        }
        const message = interaction.options.getString("message")
        if (channel.isSendable() && message) await channel.send({content: message})
        if (unparsedDuration) {
            await interaction.reply({content: `✅ Locked <#${channel.id}> for\`${unparsedDuration}\``});
        } else {
            await interaction.reply({content: `✅ Locked <#${channel.id}>`});
        }
	},
    async finishedTimer(timer: Timer) {
        let channel: GuildChannel
        let everyone: Role
        try {
            channel = await bot.client.channels.fetch(timer.channelID)
            everyone = channel.guild.roles.everyone
            channel.permissionOverwrites.edit(everyone, {
                SendMessages: true,
                SendMessagesInThreads: true,
                CreatePublicThreads: true,
                CreatePrivateThreads: true,
                AddReactions: true
            })
        } catch (e){
            bot.log.error(e)
        }
    },
};