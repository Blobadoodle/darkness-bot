import { EmbedBuilder, userMention, SlashCommandBuilder } from 'discord.js';
import { warns } from '../modules/settings.js';

// eslint-disable-next-line no-unused-vars
export const run = async (client, interaction, level) => {
    const user = interaction.options.get('user').value;
    if(interaction.options.getSubcommand() === 'warn') {
        let currentWarns = warns.get(user);
        if(!currentWarns) {
            warns.set(user, 1);
            currentWarns = 1;
        }
        else { 
            warns.set(user, currentWarns + 1);
            currentWarns += 1;
        }
        const embed = new EmbedBuilder()
            .setColor('#ee4b2b')
            .setTitle('WARN')
            .setDescription(`${userMention(user)} now has ${currentWarns} warnings!`)
            .setTimestamp();
        return interaction.reply({embeds: [embed]});
    } else {
        warns.set(user , 0);
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Reset')
            .setDescription(`${userMention(user)} has had their warnings reset!`)
            .setTimestamp();
        return interaction.reply({embeds: [embed]});
    }
};

export const commandData = new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Manage warnings')
    .addSubcommand(subcommand =>
        subcommand
            .setName('warn')
            .setDescription('Warn a user')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('User to warn')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('reset')
            .setDescription('Reset warnings for user')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('User to reset warns')
                    .setRequired(true)   
            )   
    )
    .setDMPermission(false);

export const conf = {
    permLevel: 'Moderator',
    guildOnly: false
};

export const help = {
    name: 'warns',
    category: 'Moderation',
    description: 'Manage warnings',
    usage: 'warns <warn|reset> <user>'
};