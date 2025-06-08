import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
} from "discord.js"
import { Timer } from "../../lib/timers"
import { bot } from "../../main"
import { Config, ConfigTypes } from "@power-bots/powerbotlibrary"
import { parseTime } from "../../lib/parseTime"

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
		let muteRoleID: string = await Config.get(
			ConfigTypes.Guild,
			interaction.guildId,
			"guild.mute.role",
		)
		if (!muteRoleID)
			return await interaction.reply({
				content: `❌ No mute role set. To set a mute role use \`/config set guild.mute.role <mute role id>\``,
			})
		let guild = await bot.getGuild(interaction.guildId)
		if (!guild) return
		let role = await bot.getRole(muteRoleID, guild)
		if (!role)
			return await interaction.reply({
				content: `❌ No mute role set. To set a mute role use \`/config set guild.mute.role <mute role id>\``,
			})
		const unparsedDuration = interaction.options.getString("duration")
		if (unparsedDuration) {
			let finishTime = await parseTime(unparsedDuration)
			if (!finishTime)
				return await interaction.reply({
					content: `❌ Invalid Duration`,
					flags: [MessageFlags.Ephemeral],
				})
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
		await interaction.reply({ content: `✅ Muted \`${target.user.username}\`` })
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
