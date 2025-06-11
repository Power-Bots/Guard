import { SlashCommandBuilder, MessageFlags } from "discord.js"
import { parseTime } from "../../lib/parseTime"
import { Timer } from "../../lib/timers"
import { bot } from "../../main"
import { hasPermissions } from "../../lib/checkPermissions"
import { reply } from "@power-bots/powerbotlibrary"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Ban a member")
		.addMentionableOption((option) =>
			option
				.setName("member")
				.setDescription("The member to ban")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for ban")
				.setRequired(false),
		)
		.addStringOption((option) =>
			option
				.setName("duration")
				.setDescription("Duration of ban. Example: 1y 5M 9w 1d 8h 7m 3s")
				.setRequired(false),
		),
	async execute(interaction: any) {
		if (!(await hasPermissions(interaction, "BanMembers"))) return
		const target = interaction.options.getMentionable("member")
		if (!target.moderatable) return await reply(interaction, "ban.not_allowed")
		const unparsedDuration = interaction.options.getString("duration")
		if (unparsedDuration) {
			let unbanTime = await parseTime(unparsedDuration)
			if (!unbanTime) return await reply(interaction, "error.invalid_duration")
			await Timer.new({
				userID: target.id,
				serverID: interaction.guildId,
				finishTime: unbanTime,
				type: "ban",
			})
		}
		target.ban({ reason: interaction.options.getString("reason") })
		if (unparsedDuration) {
			await reply(interaction, "ban_duration.success", {
				username: target.user.username,
				duration: unparsedDuration,
			})
		} else {
			await reply(interaction, "ban.success", {
				username: target.user.username,
			})
		}
	},
	async finishedTimer(timer: Timer) {
		if (!(timer.serverID && timer.userID)) return
		const serverID = timer.serverID.toString()
		const userID = timer.userID.toString()
		try {
			let server = await bot.client.guilds.fetch(serverID)
			await server.bans.remove(userID)
		} catch {}
	},
}
