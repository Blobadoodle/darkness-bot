const log = require('../log.js');

// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args, level) => {
    const pingMsg = await message.reply('Ping?');
    const latency = pingMsg.createdTimestamp - message.createdTimestamp;
    log.debug(`Pinged. Latency: ${latency}ms`);
    return pingMsg.edit(`Pong!\nLatency: ${latency}ms`);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['pong'],
    permLevel: 'User'
};

exports.help = {
    name: 'ping',
    category: 'Misc',
    description: 'Replies with pong!',
    usage: 'ping'
};