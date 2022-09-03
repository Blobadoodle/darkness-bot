import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

// eslint-disable-next-line no-unused-vars
export const run = async (client, interaction, level) => {
    const user = interaction.options.get('user').user;

    const createdAt = user.createdAt.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'});

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(user.tag)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`Joined discord on ${createdAt}`)
        .setTimestamp();

    if(user.bot) embed.setFooter({ text: 'BOT'});

    return interaction.reply({embeds: [embed]});
};

export const commandData = new SlashCommandBuilder()
    .setName('user')
    .setDescription('Gets info about a user')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('The user to get info on')
            .setRequired(true)
    )
    .setDMPermission(false);

export const conf = {
    permLevel: 'User',
    guildOnly: false
};

export const help = {
    name: 'user',
    category: 'System',
    description: 'Gets info about a user',
    usage: 'user'
};