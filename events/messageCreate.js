import log from '../log.js';
import config from '../config.js';
import { permlevel, getSettings } from '../modules/functions.js';
import { EmbedBuilder } from 'discord.js';

// eslint-disable-next-line no-unused-vars
export const run = async (client, message) => {
    if(message.author.bot) return;
    const { container } = client;

    const settings = message.settings = getSettings(message.guild);

    const prefixMention = new RegExp(`<@!?${client.user.id}> ?$`);
    if(message.content.match(prefixMention)) {
        const embed  = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Prefix')
            .setDescription(`My prefix on this server is \`${settings.prefix}\``)
            .setTimestamp();
        return message.reply({embeds: [embed]});
    }

    const prefix = new RegExp(`^<@!?${client.user.id}> |^\\${settings.prefix}`).exec(message.content);

    if(!prefix) return;

    const args = message.content.slice(prefix[0].length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if(message.guild && !message.member) await message.guild.members.fetch(message.author);

    const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));

    if(!cmd) return;
    if(!cmd.conf.enabled) return;

    if(cmd && !message.guild && cmd.conf.guildOnly) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Server only command')
            .setDescription('This command is unavailable via DMs\nPlease run this in a server')
            .setTimestamp();
        return message.reply({embeds: [embed]});
    }
    const level = permlevel(message);

    if(level < container.levelCache[cmd.conf.permLevel]) {
        if(settings.systemnotice) { 
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Insufficient permissions')
                .setDescription(`You do not have permission to run this command.\nThis command requires you to be a \`${cmd.conf.permLevel}\`\nYou are a \`${config.permLevels.find(l => l.level === level).name}\``)
                .setTimestamp();
            message.reply({embeds: [embed]});
        }
        return;
    }


    try {
        await cmd.run(client, message, args, level);
        log.info(`${message.author.id} ran command ${cmd.help.name} ${args.join(' ')}`);
    } catch(e) {
        console.error(e);
        log.error(`The command ${cmd.help.name} ran by ${message.author.id} encountered an error`);
        const embed = new EmbedBuilder()
            .setColor('#ee4b2b')
            .setTitle('Error')
            .setDescription(`There was a problem running the command.\n\`\`\`${e.message}\`\`\`\nPlease report any bugs to \`Blobadoodle#1066\``)
            .setTimestamp();
        message.reply({embeds: [embed]})
            .catch(e => {
                console.error(e);
                log.error('An error occured replying to an error');
            });
    }
};