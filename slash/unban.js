import { SlashCommandBuilder, EmbedBuilder, userMention } from 'discord.js';

// eslint-disable-next-line no-unused-vars
export const run = async (client, interaction, level) => {
    const user = interaction.options.get('user').value;
    const reason = interaction.options.get('reason')?.value;
    
    interaction.guild.bans.fetch(user)
        .then(() => {
            interaction.guild.bans.remove(user, reason)
                .then(user => {
                    const embed = new EmbedBuilder()
                        .setColor('#48c970')
                        .setTitle('Success')
                        .setDescription(`Successfully unbanned ${userMention(user.id)}`)
                        .setTimestamp();
                    interaction.reply({embeds: [embed]});
                })
                .catch(() => {
                    const embed = new EmbedBuilder()
                        .setColor('#ee4b2b')
                        .setTitle('Error')
                        .setDescription('Failed to ban user')
                        .setTimestamp();
                    interaction.reply({embeds: [embed]});
                });
        })
        .catch((e) => {
            console.error(e);
            const embed = new EmbedBuilder()
                .setColor('#ee4b2b')
                .setTitle('Error')
                .setDescription('The user isn\'t banned!')
                .setTimestamp();
            interaction.reply({embeds: [embed]});
        });
};

export const commandData = new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .addStringOption(option => 
        option
            .setName('user')
            .setDescription('ID of user to unban')
            .setRequired(true)
    )
    .addStringOption(option => 
        option
            .setName('reason')
            .setDescription('Reason to Unban user')
            .setRequired(false)
    )
    .setDMPermission(false);

export const conf = {
    permLevel: 'Moderator',
    guildOnly: false
};

export const help = {
    name: 'unban',
    category: 'Moderation',
    description: 'Unban a user',
    usage: 'unban <user> (reason)'
};