import { EmbedBuilder, SlashCommandBuilder, userMention } from 'discord.js';

// eslint-disable-next-line no-unused-vars
export const run = async (client, interaction, level) => {
    const user = interaction.options.get('user').member;

    const muted = interaction.guild.roles.cache.get(interaction.settings.muted);

    user.roles.remove(muted)
        .then(() => {
            const embed = new EmbedBuilder()
                .setColor('#48C970')
                .setTitle('Success')
                .setDescription(`Successfully unmuted ${userMention(user.user.id)}`)
                .setTimestamp();
            interaction.reply({embeds: [embed]});
        })
        .catch((e) => {
            console.error(e);
            const embed = new EmbedBuilder()
                .setColor('#ee4b2b')
                .setTitle('Erorr')
                .setDescription('You can\'t unmute that user!')
                .setTimestamp();
            interaction.reply({embeds: [embed]});
        });
};

export const commandData = new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a user')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('User to unmute')
            .setRequired(true)
    )
    .setDMPermission(false);

export const conf = {
    permLevel: 'Moderator',
    guildOnly: false
};

export const help = {
    name: 'unmute',
    category: 'Moderation',
    description: 'Unmute a user',
    usage: 'unmute <user>'
};