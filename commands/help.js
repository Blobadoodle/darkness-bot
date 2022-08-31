import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const run = (client, message, args, level) => {
    const { container } = client;

    const myCommands = message.guild ? container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level) :
        container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);

    const enabledCommands = myCommands.filter(cmd => cmd.conf.enabled);

    const sorted = enabledCommands.sort((p, c) => p.help.category > c.help.category ? 1 : 
        p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );

    const fields = [];
		
    sorted.forEach( c => {
        fields.push({name: c.help.name, value: `${c.help.description}\nUsage: \`${message.settings.prefix}${c.help.usage}\``});
    });

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Help')
        .setDescription('Help for all available text commands')
        .addFields(...fields)
        .setFooter({text: 'For any bug reports/feature requests/support with this bot please send me a message on Twitter or create a GitHub issue.'})
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('Twitter')
            .setStyle(ButtonStyle.Link)
            .setURL('https://twitter.com/Blobadoodle'),
        new ButtonBuilder()
            .setLabel('GitHub')
            .setStyle(ButtonStyle.Link)
            .setURL('https://github.com/Blobadoodle/bot-template')
    );

    return message.channel.send({embeds: [embed], components: [row]});
};


export const conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['h'],
    permLevel: 'User'
};
  
export const help = {
    name: 'help',
    category: 'System',
    description: 'Displays all the available text commands.',
    usage: 'help'
};