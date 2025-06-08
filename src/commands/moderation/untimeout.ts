import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
} from "discord.js"

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
		if (!target.moderatable || !target.isCommunicationDisabled())
			return await interaction.reply({
				content: `❌ This member may not be untimedout`,
				flags: [MessageFlags.Ephemeral],
			})
		await target.timeout(null, interaction.options.getString("reason"))
		await interaction.reply({
			content: `✅ Untimedout \`${target.user.username}\``,
		})
	},
}
