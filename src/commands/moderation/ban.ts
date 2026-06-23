import { reply } from "@power-bots/powerbotlibrary"
import { SlashCommandBuilder, User } from "discord.js"
import { hasPermissions } from "../../lib/checkPermissions"
import { parseTime } from "../../lib/parseTime"
import { Timer } from "../../lib/timers"
import { bot } from "../../main"

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
		const target = await interaction.options.getMentionable("member")
		const username = target?.user?.username ?? target.username
		if (!target.bannable && !(target instanceof User))
			return await reply(interaction, "ban.not_allowed")
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
		await interaction.guild.bans.create(target, {
			reason: interaction.options.getString("reason"),
		})
		if (unparsedDuration) {
			await reply(interaction, "ban_duration.success", {
				username: username,
				duration: unparsedDuration,
			})
		} else {
			await reply(interaction, "ban.success", { username: username })
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
