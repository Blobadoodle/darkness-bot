import { SlashCommandBuilder, EmbedBuilder, userMention } from 'discord.js';
import log from '../log.js';

// eslint-disable-next-line no-unused-vars
export const run = async (client, interaction, level) => {
    const user = interaction.options.get('user').member;

    if(!user.kickable) {
        const embed = new EmbedBuilder()
            .setColor('#ee4b2b')
            .setTitle('Error')
            .setDescription('You can\'t kick that user!')
            .setTimestamp();
        
        return interaction.reply({embeds: [embed]});
    }

    const reason = interaction.options.get('reason')?.value;
    
    user.kick({reason})
        .then((member) => {
            const embed = new EmbedBuilder()
                .setColor('#48C970')
                .setTitle('Success')
                .setDescription(`Successfully kicked ${userMention(member.user.id)}`)
                .setTimestamp();
            interaction.reply({embeds: [embed]});
        })
        .catch((e) => {
            const embed = new EmbedBuilder()
                .setColor('#ee4b2b')
                .setTitle('Error')
                .setDescription(`Failed to kick user ${userMention(user.user.id)}`)
                .setTimestamp();
            
            log.error(`Failed to kick user. Error: ${e.message}`);

            interaction.reply({embeds: [embed]});
        });
};

export const commandData = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user')
    .addUserOption(option => 
        option
            .setName('user')
            .setDescription('User to kick')
            .setRequired(true)
    )
    .addStringOption(option => 
        option
            .setName('reason')
            .setDescription('Reason to kick user')
            .setRequired(false)
    )
    .setDMPermission(false);

export const conf = {
    permLevel: 'Moderator',
    guildOnly: false
};

export const help = {
    name: 'kick',
    category: 'Moderation',
    description: 'Kick a user',
    usage: 'kick <user> (reason)'
};