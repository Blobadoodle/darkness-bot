import { SlashCommandBuilder, EmbedBuilder, userMention } from 'discord.js';
import log from '../log.js';

// eslint-disable-next-line no-unused-vars
export const run = async (client, interaction, level) => {
    const user = interaction.options.get('user').member;

    if(!user.bannable) {
        const embed = new EmbedBuilder()
            .setColor('#ee4b2b')
            .setTitle('Error')
            .setDescription('You can\'t ban that user!')
            .setTimestamp();
        
        return interaction.reply({embeds: [embed]});
    }

    const reason = interaction.options.get('reason')?.value;
    const days = interaction.options.get('days')?.value;
    
    user.ban({reason, days})
        .then((member) => {
            const embed = new EmbedBuilder()
                .setColor('#48C970')
                .setTitle('Success')
                .setDescription(`Successfully banned ${userMention(member.user.id)}`)
                .setTimestamp();
            interaction.reply({embeds: [embed]});
        })
        .catch((e) => {
            const embed = new EmbedBuilder()
                .setColor('#ee4b2b')
                .setTitle('Error')
                .setDescription(`Failed to ban user ${userMention(user.user.id)}`)
                .setTimestamp();
            
            log.error(`Failed to ban user. Error: ${e.message}`);

            interaction.reply({embeds: [embed]});
        });
};

export const commandData = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption(option => 
        option
            .setName('user')
            .setDescription('User to ban')
            .setRequired(true)
    )
    .addStringOption(option => 
        option
            .setName('reason')
            .setDescription('Reason to ban user')
            .setRequired(false)
    )
    .addIntegerOption(option =>
        option
            .setName('days')
            .setDescription('Number of days of messages to delete')
            .setRequired(false)
    )
    .setDMPermission(false);

export const conf = {
    permLevel: 'Moderator',
    guildOnly: false
};

export const help = {
    name: 'ban',
    category: 'Moderation',
    description: 'Ban a user',
    usage: 'ban <user> (reason) (days of msgs to delete)'
};