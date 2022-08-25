const { SlashCommandBuilder } = require('discord.js');
const log = require('../log');

// eslint-disable-next-line no-unused-vars
exports.run = async (client, interaction) => {
    await interaction.deferReply();
    const reply = await interaction.editReply('Ping?');
    const latency = reply.createdTimestamp - interaction.createdTimestamp;
    log.debug(`Pinged. Latency: ${latency}ms`);
    await interaction.editReply(`Pong!\nLatency is ${latency}ms`);
};

exports.commandData = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong');

exports.conf = {
    permLevel: 'User',
    guildOnly: false
};