const { SlashCommandBuilder, EmbedBuilder, roleMention, channelMention, userMention, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const config = require('../config');
const log = require('../log');
const { settings } = require('../modules/settings');
const { setSettings } = require('../modules/functions');

// eslint-disable-next-line no-unused-vars
exports.run = async (client, interaction) => {
    const setting = interaction.options.getSubcommand();
    let value = interaction.options.get('value');
    let prettyValue = value.value;
    if('role' in value) {
        prettyValue = roleMention(value.role.id);
        value = value.role.name;
    } else if('channel' in value) {
        prettyValue = channelMention(value.channel.id);
        value = value.channel.name;
    } else if('user' in value) {
        prettyValue = userMention(value.user.id);
        value = value.user.id;
    }else {
        value = value.value;
    }

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Confirmation')
        .setDescription(`Are you sure you want to change ${setting} from ${interaction.settings[setting]} to ${prettyValue}?`)
        .setTimestamp();

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('settingsConfirm')
                .setLabel('Yes')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('settingsCancel')
                .setLabel('No')
                .setStyle(ButtonStyle.Danger)
        );

    const reply = await interaction.reply({embeds: [embed], components: [row]});

    const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
    };

    reply.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 15000})
        .then(i => {
            if(i.customId == 'settingsCancel') {
                interaction.deleteReply();
            } else {
                if(!settings.has(interaction.guild.id)) {
                    setSettings(interaction.guild);
                    log.debug('Creating settings for guild');
                }
                settings.set(interaction.guild.id, value, setting);

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Success')
                    .setDescription('Sucessfully updated setting!')
                    .setTimestamp();
                
                interaction.editReply({embeds: [embed], components: []});
            }
        })
        .catch(() => {
            log.debug('No interactions colected');
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Timed out')
                .setDescription('Timed out, you took to long to confirm')
                .setTimestamp();

            interaction.editReply({embeds: [embed], components: []});
        });
};

const commandData = new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Change the settings for this server');

const defaults = config.defaultSettings;
for(let i of defaults) {
    commandData.addSubcommand(subcommand => {
        subcommand
            .setName(i.name)
            .setDescription(i.description);
        if(i.type === 'boolean') {
            subcommand.addBooleanOption(option => 
                option
                    .setName('value')
                    .setDescription(i.prettyName)
                    .setRequired(true)
            );
        } else if(i.type === 'role') {
            subcommand.addRoleOption(option => 
                option
                    .setName('value')
                    .setDescription(i.prettyName)
                    .setRequired(true)
            );
        } else if(i.type === 'string') {
            subcommand.addStringOption(option =>
                option
                    .setName('value')
                    .setDescription(i.prettyName)
                    .setRequired(true)
            );
        } else if(i.type === 'user') {
            subcommand.addUserOption(option => 
                option
                    .setName('value')
                    .setDescription(i.prettyName)
                    .setRequired(true)
            );
        } else if(i.type === 'channel') {
            subcommand.addChannelOption(option =>
                option
                    .setName('value')
                    .setDescription(i.prettyName)
                    .setRequired(true)  
            );
        }
        return subcommand;
    });
}

exports.commandData = commandData;

exports.conf = {
    permLevel: 'Administrator',
    guildOnly: true
};