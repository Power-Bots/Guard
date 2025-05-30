import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createBansTable } from '../../lib/createBansTable';
import { parseTime } from '../../lib/parseTime';
import { db } from '../../main';

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
        createBansTable()
        if (!interaction.appPermissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply(
            {content: `❌ I don't have the \`Ban Members\` permission!`, ephemeral: true});
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply(
            {content: `❌ You don't have the \`Ban Members\` permission`, ephemeral: true});
        const target = interaction.options.getMentionable("member")
        if (!target.moderatable) return await interaction.reply({content: `❌ This member may not be banned`, ephemeral: true});
        const unparsedDuration = interaction.options.getString("duration")
        let duration: number;
        if (unparsedDuration){
            let unbanTime;
            try {
                duration = parseTime(unparsedDuration)
                unbanTime = Date.now() + duration
            } catch {
                return await interaction.reply({content: `❌ Invalid Duration`});
            }
            const insert = db.prepare("INSERT INTO bans (userID, serverID, unbanTime) VALUES (?, ?, ?)")
            insert.run(target.id, interaction.guildId, unbanTime)
        }
        target.ban({reason: interaction.options.getString("reason")})
        if (unparsedDuration) {
            await interaction.reply({content: `✅ Banned \`${target.user.username}\` for\`${unparsedDuration}\``});
        } else {
            await interaction.reply({content: `✅ Banned \`${target.user.username}\``});
        }
	},
};