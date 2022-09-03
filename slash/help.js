import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

// eslint-disable-next-line no-unused-vars
export const run = async (client, interaction, level) => {
    const { container } = client;

    const myCommands = interaction.guild ? container.slash.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level) :
        container.slash.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);
    
    const sorted = myCommands.sort((p, c) => p.help.category > c.help.category ? 1 :
        p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );

    const fields = [];

    sorted.forEach( c => {
        fields.push({name: c.help.name, value: `${c.help.description}\nUsage: \`/${c.help.usage}\``});
    });

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Help')
        .setDescription('Help for all available slash commands')
        .addFields(...fields)
        .setFooter({text: 'For any bug reports/feature requests/support with this bot please send me a message on Twitter.'})
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('Twitter')
            .setStyle(ButtonStyle.Link)
            .setURL('https://twitter.com/Blobadoodle')
    );

    return interaction.reply({embeds: [embed], components: [row]});
};

export const commandData = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays all the available slash commands');

export const conf = {
    permLevel: 'User',
    guildOnly: false
};

export const help = {
    name: 'help',
    category: 'System',
    description: 'Displays all the available slash commands',
    usage: 'help'
};