import { SlashCommandBuilder, MessageFlags } from "discord.js"
import { hasPermissions } from "../../lib/checkPermissions"
import { reply } from "@power-bots/powerbotlibrary"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("untimeout")
		.setDescription("Untimeout a member")
		.addMentionableOption((option) =>
			option
				.setName("member")
				.setDescription("The member to untimeout")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for timeout")
				.setRequired(false),
		),
	async execute(interaction: any) {
		if (!(await hasPermissions(interaction, "MuteMembers"))) return
		const target = interaction.options.getMentionable("member")
		if (!target.moderatable || !target.isCommunicationDisabled())
			return await reply(interaction, "untimeout.not_allowed")
		await target.timeout(null, interaction.options.getString("reason"))
		await reply(interaction, "untimeout.success", {
			username: target.user.username,
		})
	},
}
