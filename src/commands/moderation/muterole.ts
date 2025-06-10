import {
	SlashCommandBuilder,
} from "discord.js"
import { Config, ConfigTypes } from "@power-bots/powerbotlibrary"
import { refreshMuteRole } from "../../lib/refreshMuteRole"
import { hasPermissions } from "../../lib/checkPermissions"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("muterole")
		.setDescription("Manage mute role")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("refresh")
				.setDescription("Refresh the mute role permissions"),
		),
	async execute(interaction: any) {
		const subCommand = interaction.options.getSubcommand()
		switch (subCommand) {
			case "refresh":
				if (!await hasPermissions(interaction, "ManageRoles")) return
				let muteRoleID: string = await Config.get(
					ConfigTypes.Guild,
					interaction.guildId,
					"guild.mute.role",
				)
				if (!muteRoleID)
					return await interaction.reply({
						content: `❌ No mute role set. To set a mute role use \`/config set guild.mute.role <mute role id>\``,
					})
				const results = await refreshMuteRole(interaction.guildId, muteRoleID)
				await interaction.reply({
					content: `✅ ${results?.successful} successful 
❌ ${results?.fails} failed`,
				})
				break
			default:
				break
		}
	},
}
