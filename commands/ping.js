import log from '../log.js';

// eslint-disable-next-line no-unused-vars
export const run = async (client, message, args, level) => {
    const pingMsg = await message.reply('Ping?');
    const latency = pingMsg.createdTimestamp - message.createdTimestamp;
    log.debug(`Pinged. Latency: ${latency}ms`);
    return pingMsg.edit(`Pong!\nLatency: ${latency}ms`);
};

export const conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['pong'],
    permLevel: 'User'
};

export const help = {
    name: 'ping',
    category: 'Misc',
    description: 'Replies with pong!',
    usage: 'ping'
};