import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { parseTime } from '../../lib/parseTime';
import { Timer } from '../../lib/timers';
import { bot } from '../../main';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a member')
        .addMentionableOption(option => 
            option
            .setName("member")
            .setDescription("The member to ban")
            .setRequired(true)
        )
        .addStringOption(option => 
            option
            .setName("reason")
            .setDescription("Reason for ban")
            .setRequired(false)
        )
        .addStringOption(option => 
            option
            .setName("duration")
            .setDescription("Duration of ban. Example: 1y 5M 9w 1d 8h 7m 3s")
            .setRequired(false)
        ),
	async execute(interaction: any) {
        if (!interaction.appPermissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply(
            {content: `❌ I don't have the \`Ban Members\` permission!`, flags: [MessageFlags.Ephemeral]});
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply(
            {content: `❌ You don't have the \`Ban Members\` permission`, flags: [MessageFlags.Ephemeral]});
        const target = interaction.options.getMentionable("member")
        if (!target.moderatable) return await interaction.reply({content: `❌ This member may not be banned`, flags: [MessageFlags.Ephemeral]});
        const unparsedDuration = interaction.options.getString("duration")
        let duration: number;
        if (unparsedDuration){
            let unbanTime;
            try {
                duration = parseTime(unparsedDuration)
                unbanTime = Date.now() + duration
            } catch {
                return await interaction.reply({content: `❌ Invalid Duration`, flags: [MessageFlags.Ephemeral]});
            }
            await Timer.new({
                userID: target.id,
                serverID: interaction.guildId,
                finishTime: unbanTime,
                type: "ban"
            })
        }
        target.ban({reason: interaction.options.getString("reason")})
        if (unparsedDuration) {
            await interaction.reply({content: `✅ Banned \`${target.user.username}\` for\`${unparsedDuration}\``});
        } else {
            await interaction.reply({content: `✅ Banned \`${target.user.username}\``});
        }
	},
    async finishedTimer(timer: Timer){
        if (!(timer.serverID && timer.userID)) return
        const serverID = timer.serverID.toString()
        const userID = timer.userID.toString()
        try {
            let server = await bot.client.guilds.fetch(serverID)
            await server.bans.remove(userID)
        } catch {}
    },
};