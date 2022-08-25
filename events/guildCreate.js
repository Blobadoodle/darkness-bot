const { EmbedBuilder } = require('discord.js');
const log = require ('../log');
const { getSettings } = require('../modules/functions');

module.exports = async (client, guild) => {
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Welcome!')
        .setDescription(`Hello! My default prefix is \`${getSettings().prefix}\`. You can edit settings with the /settings command.`);
    
    const syschannel = guild.systemChannel;

    syschannel.send({embeds: [embed]});
    log.info(`${guild.ownerId} added the bot to ${guild.id}`);

};