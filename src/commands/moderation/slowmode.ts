import { SlashCommandBuilder, GuildChannel } from "discord.js"
import { hasPermissions } from "../../lib/checkPermissions"
import { reply } from "@power-bots/powerbotlibrary"

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
		if (!(await hasPermissions(interaction, "ManageChannels"))) return
		const channel: GuildChannel =
			interaction.options.getChannel("channel") || interaction.channel
		if (!channel.isTextBased())
			return await reply(interaction, "error.invalid_channel")
		const delayRaw = interaction.options.getString("delay")
		const delay = parseInt(delayRaw)
		if (delay != delayRaw)
			return await reply(interaction, "error.invalid_delay")
		await channel.setRateLimitPerUser(
			delayRaw,
			interaction.options.getString("reason"),
		)
		await reply(interaction, "slowmode.success", {
			id: channel.id,
			delay: delay,
		})
	},
}
