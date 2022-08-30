// eslint-disable-next-line no-unused-vars
export const run = async (client, message, args, level) => {

    const [globalCmds, guildCmds] = client.container.slash.partition(c => !c.conf.guildOnly);

    const msg = await message.reply('Deploying commands!');

    await client.guilds.cache.get(message.guild.id)?.commands.set(guildCmds.map(c => c.commandData));

    await client.application.commands.set(globalCmds.map(c => c.commandData)).catch(e => console.error(e));

    msg.edit('All commands deployed');
};

export const conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'Bot Owner'
};

export const help = {
    name: 'deploy',
    category: 'Misc',
    description: 'Deploy Slash Commands',
    usage: 'deploy'
};