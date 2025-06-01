import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, GuildChannel, Role } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlock')
		.setDescription('Unlock a channel')
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to unlock. If none given the current one is used")
            .setRequired(false)
        ),
	async execute(interaction: any) {
        if (!interaction.appPermissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.reply(
            {content: `❌ I don't have the \`Manage Channels\` permission!`, flags: [MessageFlags.Ephemeral]});
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.reply(
            {content: `❌ You don't have the \`Manage Channels\` permission`, flags: [MessageFlags.Ephemeral]});
        const channel: GuildChannel = interaction.options.getChannel("channel") || interaction.channel
        const everyone: Role = interaction.guild.roles.everyone
        channel.permissionOverwrites.edit(everyone, {
            SendMessages: true,
            SendMessagesInThreads: true,
            CreatePublicThreads: true,
            CreatePrivateThreads: true,
            AddReactions: true
        })
        await interaction.reply({content: `✅ Unlocked <#${channel.id}>`});
	},
};