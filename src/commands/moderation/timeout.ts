import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
} from "discord.js"
import { parseTime } from "../../lib/parseTime"

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
		if (!interaction.appPermissions.has(PermissionFlagsBits.MuteMembers))
			return await interaction.reply({
				content: `❌ I don't have the \`Timeout Members\` permission!`,
				flags: [MessageFlags.Ephemeral],
			})
		if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers))
			return await interaction.reply({
				content: `❌ You don't have the \`Timeout Members\` permission`,
				flags: [MessageFlags.Ephemeral],
			})
		const target = interaction.options.getMentionable("member")
		if (!target.moderatable)
			return await interaction.reply({
				content: `❌ This member may not be timedout`,
				flags: [MessageFlags.Ephemeral],
			})
		const unparsedDuration = interaction.options.getString("duration")
		let duration = await parseTime(unparsedDuration, { fullTime: false })
		if (!duration)
			return await interaction.reply({
				content: `❌ Invalid Duration`,
				flags: [MessageFlags.Ephemeral],
			})
		if (duration > 2419200000)
			return await interaction.reply({
				content: `❌ Duration must not be longer then 28 days`,
				flags: [MessageFlags.Ephemeral],
			})
		await target.timeout(duration, interaction.options.getString("reason"))
		if (unparsedDuration) {
			await interaction.reply({
				content: `✅ Timedout \`${target.user.username}\` for\`${unparsedDuration}\``,
			})
		} else {
			await interaction.reply({
				content: `✅ Timedout \`${target.user.username}\``,
			})
		}
	},
}
