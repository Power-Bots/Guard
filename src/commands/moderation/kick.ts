import {
	SlashCommandBuilder,
	MessageFlags,
} from "discord.js"
import { hasPermissions } from "../../lib/checkPermissions"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kick a member")
		.addMentionableOption((option) =>
			option
				.setName("member")
				.setDescription("The member to kick")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for kick")
				.setRequired(false),
		),
	async execute(interaction: any) {
		if (!await hasPermissions(interaction, "KickMembers")) return
		const target = interaction.options.getMentionable("member")
		if (!target.kickable)
			return await interaction.reply({
				content: `❌ This member may not be kicked`,
				flags: [MessageFlags.Ephemeral],
			})
		target.kick(interaction.options.getString("reason"))
		await interaction.reply({
			content: `✅ Kicked \`${target.user.username}\``,
		})
	},
}
