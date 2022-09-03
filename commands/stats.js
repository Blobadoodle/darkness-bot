import { version, EmbedBuilder } from 'discord.js';
import { readFileSync } from 'node:fs';
import { execSync } from 'child_process';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

function format_uptime(uptime) {
    const hours = Math.floor(uptime / (60*60));
    const minutes = Math.floor(uptime % (60*60) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// eslint-disable-next-line no-unused-vars
export const run = (client, message, args, level) => {
    const commit = execSync('git rev-parse --short HEAD').toString().trim();

    const npmpackage = JSON.parse(readFileSync(`${__dirname}\\..\\package.json`));

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Stats')
        .setDescription('Bot status')
        .addFields(
            { name: 'Mem Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
            { name: 'Users', value: client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toString(), inline: true },
            { name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
            { name: 'Channels', value: client.channels.cache.size.toString(), inline: true },
            { name: 'Discord.js', value: `v${version}`, inline: true },
            { name: 'Node.js', value: process.version, inline: true },
            { name: 'Version', value: npmpackage.version, inline: true },
            { name: 'Commit', value: commit, inline: true },
            { name: 'Uptime', value: format_uptime(process.uptime())}
        )
        .setTimestamp();
    
    return message.reply({embeds: [embed]});
};

export const conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'Bot Admin'
};

export const help = {
    name: 'stats',
    category: 'Miscellaneous',
    description: 'Give some useful bot statistics',
    usage: 'stats'
};