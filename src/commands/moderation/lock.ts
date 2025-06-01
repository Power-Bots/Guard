import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, GuildChannel, Role } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Lock a channel')
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to lock. If none given the current one is used")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("message")
            .setDescription("Message to send to channel")
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
            SendMessages: false,
            SendMessagesInThreads: false,
            CreatePublicThreads: false,
            CreatePrivateThreads: false,
            AddReactions: false
        })
        const message = interaction.options.getString("message")
        if (channel.isSendable() && message) await channel.send({content: message})
        await interaction.reply({content: `✅ Locked <#${channel.id}>`});
	},
};