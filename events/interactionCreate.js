const log = require('../log');
const { getSettings, permlevel } = require('../modules/functions');
const config = require('../config');

async function handleCommand(client, interaction) {
    
    const settings = interaction.settings = getSettings(interaction.guild);

    const level = permlevel(interaction);

    const cmd = client.container.slash.get(interaction.commandName);
    if(!cmd) return interaction.reply('Command does not exist');

    if(level < client.container.levelCache[cmd.conf.permLevel]) {
        return await interaction.reply({
            content: `You do not have permission to use this command.\nThis command requires \`${cmd.conf.permLevel}\`\nYou have \`${config.permLevels.find(l => l.level === level).name}\``,
            ephemeral: settings.systemNotice !== 'true'
        });
    }

    try {
        await cmd.run(client, interaction);
        log.info(`${interaction.user.id} ran slash command ${cmd.commandData.name}`);
    } catch(e) {
        console.error(e);
        log.error(`The command ${cmd.commandData.name} ran by ${interaction.user.id} encountered an error`);
        await interaction.reply(`There was a problem with your request.\`\`\`${e.message}\`\`\`Please report any bugs to \`Blobadoodle#1066\``)
            .catch(err => {
                if(err.code === 'InteractionAlreadyReplied') {
                    interaction.followUp(`There was a problem with your request.\`\`\`${e.message}\`\`\`Please report any bugs to \`Blobadoodle#1066\``);
                } else {
                    console.error(err);
                    log.error('An error occured replying to an error');
                }
            });
    }
}

// eslint-disable-next-line no-unused-vars
module.exports = async (client, interaction) => {
    if(interaction.isChatInputCommand()) await handleCommand(client, interaction);
    else return;
};