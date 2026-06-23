import { Config, ConfigTypes, reply } from "@power-bots/powerbotlibrary"
import { Guild, Role, SlashCommandBuilder } from "discord.js"
import { hasPermissions } from "../../lib/checkPermissions"
import { bot } from "../../main"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unmute")
		.setDescription("Unmute a member")
		.addMentionableOption((option) =>
			option
				.setName("member")
				.setDescription("The member to unmute")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for unmute")
				.setRequired(false),
		),
	async execute(interaction: any) {
		if (!(await hasPermissions(interaction, "ManageRoles"))) return
		const target = interaction.options.getMentionable("member")
		let guild: Guild | null = null
		let role: Role | null = null
		let muteRoleID: string = await Config.get(
			ConfigTypes.Guild,
			interaction.guildId,
			"guild.mute.role",
		)
		if (!muteRoleID) return await reply(interaction, "mute.role_invalid")
		try {
			guild = await bot.client.guilds.fetch(interaction.guildId)
		} catch {}
		if (!guild) return
		try {
			role = await guild.roles.fetch(muteRoleID)
		} catch {}
		if (!role) return await reply(interaction, "mute.role_invalid")
		await target.roles.remove(role)
		await reply(interaction, "unmute.success", {
			username: target.user.username,
		})
	},
}
