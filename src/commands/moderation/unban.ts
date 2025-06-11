import { SlashCommandBuilder, MessageFlags, GuildBan } from "discord.js"
import { Timer } from "../../lib/timers"
import { hasPermissions } from "../../lib/checkPermissions"
import { reply } from "@power-bots/powerbotlibrary"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unban")
		.setDescription("Unban a member")
		.addMentionableOption((option) =>
			option
				.setName("member")
				.setDescription("The member to unban (User ID)")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for unban")
				.setRequired(false),
		),
	async execute(interaction: any) {
		if (!(await hasPermissions(interaction, "BanMembers"))) return
		const target = interaction.options.getMentionable("member")
		let ban: GuildBan | null
		try {
			ban = await interaction.guild.bans.fetch(target.id)
		} catch {
			ban = null
		}
		if (!ban)
			return await reply(interaction, "unban.not_allowed")
		Timer.get({ userID: target.id, serverID: interaction.guildId, type: "ban" })
		await interaction.guild.bans.remove(
			target.id,
			interaction.options.getString("reason"),
		)
		await reply(interaction, "unban.success", {username: target.username})
	},
}
