import {
	SlashCommandBuilder,
} from "discord.js"
import { Timer } from "../../lib/timers"
import { bot } from "../../main"
import { Config, ConfigTypes } from "@power-bots/powerbotlibrary"
import { parseTime } from "../../lib/parseTime"
import { reply } from "@power-bots/powerbotlibrary"
import { hasPermissions } from "../../lib/checkPermissions"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mute")
		.setDescription("Mute a member")
		.addMentionableOption((option) =>
			option
				.setName("member")
				.setDescription("The member to mute")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for mute")
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName("duration")
				.setDescription("Duration of mute. Example: 1y 5M 9w 1d 8h 7m 3s")
				.setRequired(false),
		),
	async execute(interaction: any) {
		if (!await hasPermissions(interaction, "ManageRoles")) return
		const target = interaction.options.getMentionable("member")
		let muteRoleID: string = await Config.get(
			ConfigTypes.Guild,
			interaction.guildId,
			"guild.mute.role",
		)
		if (!muteRoleID) return await reply(interaction, "mute.role_invalid")
		let guild = await bot.getGuild(interaction.guildId)
		if (!guild) return
		let role = await bot.getRole(muteRoleID, guild)
		if (!role) return await reply(interaction, "mute.role_invalid")
		const unparsedDuration = interaction.options.getString("duration")
		if (unparsedDuration) {
			let finishTime = await parseTime(unparsedDuration)
			if (!finishTime) return await reply(interaction, "error.invalid_duration")
			Timer.new({
				userID: target.id,
				serverID: interaction.guildId,
				finishTime: finishTime,
				type: "mute",
			})
		}
		await target.edit({
			roles: [role],
			reason: interaction.options.getMentionable("reason"),
		})
		await reply(interaction, "mute.success", { username: target.user.username })
	},
	async finishedTimer(timer: Timer) {
		if (!(timer.serverID && timer.userID)) return
		try {
			let guild = await bot.getGuild(timer.serverID.toString())
			if (!guild) return
			let member = await guild.members.fetch(timer.userID.toString())
			let muteRoleID: string = await Config.get(
				ConfigTypes.Guild,
				guild.id,
				"mute.role",
			)
			let role = await bot.getRole(muteRoleID, guild)
			if (!role) return
			member.roles.remove(role)
		} catch {}
	},
}
