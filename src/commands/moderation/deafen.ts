import { reply } from "@power-bots/powerbotlibrary"
import { GuildMember, SlashCommandBuilder } from "discord.js"
import { hasPermissions } from "../../lib/checkPermissions"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("deafen")
		.setDescription("Deafen a member")
		.addMentionableOption((option) =>
			option
				.setName("member")
				.setDescription("The member to deafen")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for deafen")
				.setRequired(false),
		),
	async execute(interaction: any) {
		if (!(await hasPermissions(interaction, "DeafenMembers"))) return
		const target: GuildMember = interaction.options.getMentionable("member")
		if (!target.moderatable || !target.voice.channel === null)
			return await reply(interaction, "generic.error")
		await target.voice.setDeaf(true, interaction.options.getString("reason"))
		await reply(interaction, "generic.success", {
			username: target.user.username,
		})
	},
}
