import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
	GuildChannel,
} from "discord.js"
import { bot } from "../../main"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("slowmode")
		.setDescription("Enable slowmode on a channel")
		.addStringOption((option) =>
			option
				.setName("delay")
				.setDescription("Delay between each message")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for slowmode")
				.setRequired(false),
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription(
					"The channel enable slowmode. If none given the current one is used",
				)
				.setRequired(false),
		),
	async execute(interaction: any) {
		if (!interaction.appPermissions.has(PermissionFlagsBits.ManageChannels))
			return await interaction.reply({
				content: `❌ I don't have the \`Manage Channels\` permission!`,
				flags: [MessageFlags.Ephemeral],
			})
		if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
			return await interaction.reply({
				content: `❌ You don't have the \`Manage Channels\` permission`,
				flags: [MessageFlags.Ephemeral],
			})
		const channel: GuildChannel =
			interaction.options.getChannel("channel") || interaction.channel
		if (!channel.isTextBased())
			return await interaction.reply({ content: `❌ Invalid Channel` })
		const delayRaw = interaction.options.getString("delay")
		const delay = parseInt(delayRaw)
		if (delay != delayRaw)
			return await interaction.reply({ content: `❌ Invalid Delay` })
		await channel.setRateLimitPerUser(
			delayRaw,
			interaction.options.getString("reason"),
		)
		await interaction.reply({
			content: `✅ Set slowmmode for <#${channel.id}> to \`${delay}s\``,
		})
	},
}
