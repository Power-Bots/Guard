import { SlashCommandBuilder, MessageFlags } from "discord.js"
import { parseTime } from "../../lib/parseTime"
import { hasPermissions } from "../../lib/checkPermissions"
import { reply } from "@power-bots/powerbotlibrary"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("timeout")
		.setDescription("Timeout a member")
		.addMentionableOption((option) =>
			option
				.setName("member")
				.setDescription("The member to timeout")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("duration")
				.setDescription(
					"Duration of timeout. Has a limit of 28 days. Example: 2w 1d 8h 7m 3s",
				)
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
		if (!target.moderatable)
			return await reply(interaction, "timeout.not_allowed")
		const unparsedDuration = interaction.options.getString("duration")
		let duration = await parseTime(unparsedDuration, { fullTime: false })
		if (!duration) return await reply(interaction, "error.invalid_duration")
		if (duration > 2419200000)
			return await reply(interaction, "timeout.invalid_duration")
		await target.timeout(duration, interaction.options.getString("reason"))
		await reply(interaction, "timeout.success", {
			username: target.user.username,
			duration: unparsedDuration,
		})
	},
}
