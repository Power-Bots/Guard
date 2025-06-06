import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, GuildBan } from 'discord.js';
import { Timer } from '../../lib/timers';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unban a member')
        .addMentionableOption(option => 
            option
            .setName("member")
            .setDescription("The member to unban (User ID)")
            .setRequired(true)
        )
        .addStringOption(option => 
            option
            .setName("reason")
            .setDescription("Reason for unban")
            .setRequired(false)
        ),
	async execute(interaction: any) {
        if (!interaction.appPermissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply(
            {content: `❌ I don't have the \`Ban Members\` permission!`, flags: [MessageFlags.Ephemeral]});
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply(
            {content: `❌ You don't have the \`Ban Members\` permission`, flags: [MessageFlags.Ephemeral]});
        const target = interaction.options.getMentionable("member")
        let ban: GuildBan | null;
        try {
            ban = await interaction.guild.bans.fetch(target.id)
        } catch {
            ban = null
        }
        if (!ban) return await interaction.reply(
            {content: `❌ This member is not banned`, flags: [MessageFlags.Ephemeral]});
        Timer.get({
            userID: target.id,
            serverID: interaction.guildId,
            type: "ban"
        })
        await interaction.guild.bans.remove(target.id, interaction.options.getString("reason"))
        await interaction.reply({content: `✅ Unbanned \`${target.username}\``});
	},
};