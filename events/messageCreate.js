const log = require ('../log');
const config = require('../config');
const { permlevel, getSettings } = require('../modules/functions');

// eslint-disable-next-line no-unused-vars
module.exports = async (client, message) => {
    if(message.author.bot) return;
    const { container } = client;

    const settings = message.settings = getSettings(message.guild);

    const prefixMention = new RegExp(`<@!?${client.user.id}> ?$`);
    if(message.content.match(prefixMention)) {
        return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
    }

    const prefix = new RegExp(`^<@!?${client.user.id}> |^\\${settings.prefix}`).exec(message.content);

    if(!prefix) return;

    const args = message.content.split(' ');
    const command = args.shift().substring(1).toLowerCase();

    if(message.guild && !message.member) await message.guild.members.fetch(message.author);

    const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));

    if(!cmd) return;
    if(!cmd.conf.enabled) return;

    if(cmd && !message.guild && cmd.conf.guildOnly) return message.reply('This command is unvailable via DMs, Please run this in a server');

    const level = permlevel(message);

    if(level < container.levelCache[cmd.conf.permlevel]) {
        if(settings.systemNotice === 'true') return message.reply(`You do not have permission to use this command.\nThis command requires \`${cmd.conf.permLevel}\`\nYou have \`${config.permLevels.find(l => l.level === level).name}\``);
    }


    try {
        await cmd.run(client, message, args, level);
        log.info(`${message.author.id} ran command ${cmd.help.name} ${args.join(' ')}`);
    } catch(e) {
        console.error(e);
        log.error(`The command ${cmd.help.name} ran by ${message.author.id} encountered an error`);
        message.reply(`There was a problem with your request.\n\`\`\`${e.message}\`\`\`\nPlease report any bugs to \`Blobadoodle#1066\``)
            .catch(e => {
                console.error(e);
                log.error('An error occured replying to an error');
            });
    }
};