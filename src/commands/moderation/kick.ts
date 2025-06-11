import { SlashCommandBuilder, MessageFlags } from "discord.js"
import { hasPermissions } from "../../lib/checkPermissions"
import { reply } from "@power-bots/powerbotlibrary"

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
		if (!(await hasPermissions(interaction, "KickMembers"))) return
		const target = interaction.options.getMentionable("member")
		if (!target.kickable) return await reply(interaction, "kick.not_allowed")
		target.kick(interaction.options.getString("reason"))
		await reply(interaction, "kick.success", { username: target.user.username })
	},
}
