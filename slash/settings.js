import { SlashCommandBuilder, EmbedBuilder, roleMention, channelMention, userMention, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import config from '../config.js';
import log from '../log.js';
import { settings } from '../modules/settings.js';
import { setSettings } from '../modules/functions.js';

// eslint-disable-next-line no-unused-vars
export const run = async (client, interaction, level) => {
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
    } else {
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

const commandDataDefault = new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Change the settings for this server')
    .setDMPermission(false);

const defaults = config.defaultSettings;
for(const i of defaults) {
    commandDataDefault.addSubcommand(subcommand => {
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

export const commandData = commandDataDefault;

export const conf = {
    permLevel: 'Administrator',
    guildOnly: false
};

export const help = {
    name: 'Settings',
    category: 'System',
    description: 'Change the settings for this server',
    usage: 'settings <setting name> <setting value>'
};