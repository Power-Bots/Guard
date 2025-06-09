import { Lang, reply } from "@power-bots/powerbotlibrary"
import { PermissionFlagsBits, CommandInteraction } from "discord.js"

interface CheckPermissionsOptions {
	checkMember?: boolean
	checkBot?: boolean
}

export async function hasPermissions(
	interaction: CommandInteraction,
	permission: keyof typeof PermissionFlagsBits,
	options: CheckPermissionsOptions = { checkMember: true, checkBot: true },
): Promise<boolean> {
	if (options.checkBot) {
		if (!interaction.appPermissions.has(permission)) {
			await reply(interaction, "error.bot_missing_permission", {
				permission: await Lang.en.get(`permission.${permission}`),
			})
			return false
		}
	}
	if (options.checkMember) {
		const memberPerms = interaction.member?.permissions
		if (typeof memberPerms !== "string") {
			if (!memberPerms?.has(permission)) {
				await reply(interaction, "error.user_missing_permission", {
					permission: await Lang.en.get(`permission.${permission}`),
				})
				return false
			}
		}
	}
	return true
}
