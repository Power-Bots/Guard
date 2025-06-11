import { Config, ConfigTypes } from "@power-bots/powerbotlibrary"
import { Events, GuildChannel } from "discord.js"
import { refreshMuteRole } from "../lib/refreshMuteRole"

module.exports = {
	event: Events.ChannelCreate,
	async execute(channel: GuildChannel) {
		const muteRoleID = await Config.get(
			ConfigTypes.Guild,
			channel.guildId,
			"guild.mute.role",
		)
		if (!muteRoleID) return
		await refreshMuteRole(channel.guildId, muteRoleID)
	},
}
