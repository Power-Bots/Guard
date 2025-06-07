import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, Guild, Role } from 'discord.js';
import { Timer } from '../../lib/timers';
import { bot } from '../../main';
import { Config, ConfigTypes } from '@power-bots/powerbotlibrary';
import { parseTime } from '../../lib/parseTime';
import { refreshMuteRole } from '../../lib/refreshMuteRole';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('muterole')
		.setDescription('Manage mute role')
        .addSubcommand(subcommand => subcommand
            .setName("refresh")
            .setDescription("Refresh the mute role permissions")
        ),
	async execute(interaction: any) {
        const subCommand = interaction.options.getSubcommand();
        switch (subCommand) {
            case "refresh":
                if (!interaction.appPermissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.reply(
                    {content: `❌ I don't have the \`Manage Roles\` permission!`, flags: [MessageFlags.Ephemeral]});
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.reply(
                    {content: `❌ You don't have the \`Manage Roles\` permission`, flags: [MessageFlags.Ephemeral]});
                let muteRoleID: string = await Config.get(ConfigTypes.Guild, interaction.guildId, "guild.mute.role")
                if (!muteRoleID) return await interaction.reply({content: `❌ No mute role set. To set a mute role use \`/config set guild.mute.role <mute role id>\``});
                const results = await refreshMuteRole(interaction.guildId, muteRoleID)
                await interaction.reply({content: `✅ ${results?.successful} successful 
❌ ${results?.fails} failed`});
                break
            default:
                break
        }
    },
};