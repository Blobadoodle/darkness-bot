import { SlashCommandBuilder } from 'discord.js';
import log from '../log.js';
// eslint-disable-next-line no-unused-vars
export const run = async (client, interaction, level) => {
    await interaction.deferReply();
    const reply = await interaction.editReply('Ping?');
    const latency = reply.createdTimestamp - interaction.createdTimestamp;
    log.debug(`Pinged. Latency: ${latency}ms`);
    await interaction.editReply(`Pong!\nLatency is ${latency}ms`);
};

export const commandData = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Get the bots latency');

export const conf = {
    permLevel: 'User',
    guildOnly: false
};

export const help = {
    name: 'ping',
    category: 'System',
    description: 'Get the bots latency',
    usage: 'ping'
};