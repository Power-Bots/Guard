import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
	GuildChannel,
	Role,
} from "discord.js"
import { parseTime } from "../../lib/parseTime"
import { Timer } from "../../lib/timers"
import { bot } from "../../main"
import { hasPermissions } from "../../lib/checkPermissions"
import { reply } from "@power-bots/powerbotlibrary"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lock")
		.setDescription("Lock a channel")
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription(
					"The channel to lock. If none given the current one is used",
				)
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("Message to send to channel")
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName("duration")
				.setDescription("Duration of ban. Example: 1y 5M 9w 1d 8h 7m 3s")
				.setRequired(false),
		)
		.addBooleanOption((option) =>
			option
				.setName("reactions")
				.setDescription("Set true to keep reactions on")
				.setRequired(false),
		),
	async execute(interaction: any) {
		if (!await hasPermissions(interaction, "ManageChannels")) return
		const channel: GuildChannel =
			interaction.options.getChannel("channel") || interaction.channel
		const everyone: Role = interaction.guild.roles.everyone
		const unparsedDuration = interaction.options.getString("duration")
		if (unparsedDuration) {
			let finishTime = await parseTime(unparsedDuration)
			if (!finishTime)
				return await reply(interaction, "error.invalid_duration")
			await Timer.new({
				channelID: channel.id,
				serverID: interaction.guildId,
				finishTime: finishTime,
				type: "lock",
			})
		}
		await channel.permissionOverwrites.edit(everyone, {
			SendMessages: false,
			SendMessagesInThreads: false,
			CreatePublicThreads: false,
			CreatePrivateThreads: false,
			AddReactions: false,
		})
		const reactions = interaction.options.getBoolean("reactions")
		if (reactions)
			await channel.permissionOverwrites.edit(everyone, { AddReactions: null })
		const message = interaction.options.getString("message")
		if (channel.isSendable() && message)
			await channel.send({ content: message })
		if (unparsedDuration) return await reply(interaction, "lock_duration.success", {id: channel.id, duration: unparsedDuration})
		await reply(interaction, "lock.success", {id: channel.id})
	},
	async finishedTimer(timer: Timer) {
		let channel: GuildChannel | null = null
		let everyone: Role | null = null
		try {
			channel = await bot.client.channels.fetch(timer.channelID)
			if (!channel) return
			everyone = channel.guild.roles.everyone
		} catch {}
		if (!(channel && everyone)) return
		if (
			!channel
				.permissionsFor(channel.client.user.id)
				?.has(PermissionFlagsBits.ManageChannels)
		)
			return
		channel.permissionOverwrites.edit(everyone, {
			SendMessages: null,
			SendMessagesInThreads: null,
			CreatePublicThreads: null,
			CreatePrivateThreads: null,
			AddReactions: null,
		})
	},
}
