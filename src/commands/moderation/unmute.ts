import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
	Guild,
	Role,
} from "discord.js"
import { bot } from "../../main"
import { Config, ConfigTypes } from "@power-bots/powerbotlibrary"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unmute")
		.setDescription("Mute a member")
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
		if (!interaction.appPermissions.has(PermissionFlagsBits.ManageRoles))
			return await interaction.reply({
				content: `❌ I don't have the \`Manage Roles\` permission!`,
				flags: [MessageFlags.Ephemeral],
			})
		if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles))
			return await interaction.reply({
				content: `❌ You don't have the \`Manage Roles\` permission`,
				flags: [MessageFlags.Ephemeral],
			})
		const target = interaction.options.getMentionable("member")
		let guild: Guild | null = null
		let role: Role | null = null
		let muteRoleID: string = await Config.get(
			ConfigTypes.Guild,
			interaction.guildId,
			"guild.mute.role",
		)
		if (!muteRoleID)
			return await interaction.reply({
				content: `❌ No mute role set. To set a mute role use \`/config set guild.mute.role <mute role id>\``,
			})
		try {
			guild = await bot.client.guilds.fetch(interaction.guildId)
		} catch {}
		if (!guild) return
		try {
			role = await guild.roles.fetch(muteRoleID)
		} catch {}
		if (!role)
			return await interaction.reply({
				content: `❌ No mute role set. To set a mute role use \`/config set guild.mute.role <mute role id>\``,
			})
		await target.roles.remove(role)
		await interaction.reply({
			content: `✅ Unmuted \`${target.user.username}\``,
		})
	},
}
