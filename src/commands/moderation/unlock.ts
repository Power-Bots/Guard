import { SlashCommandBuilder, GuildChannel, Role } from "discord.js"
import { hasPermissions } from "../../lib/checkPermissions"
import { reply } from "@power-bots/powerbotlibrary"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unlock")
		.setDescription("Unlock a channel")
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription(
					"The channel to unlock. If none given the current one is used",
				)
				.setRequired(false),
		),
	async execute(interaction: any) {
		if (!(await hasPermissions(interaction, "ManageChannels"))) return
		const channel: GuildChannel =
			interaction.options.getChannel("channel") || interaction.channel
		const everyone: Role = interaction.guild.roles.everyone
		channel.permissionOverwrites.edit(everyone, {
			SendMessages: null,
			SendMessagesInThreads: null,
			CreatePublicThreads: null,
			CreatePrivateThreads: null,
			AddReactions: null,
		})
		await reply(interaction, "unlock.success", { id: channel.id })
	},
}
