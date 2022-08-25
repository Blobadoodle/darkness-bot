require('dotenv').config();

const { Client, Collection } = require('discord.js');
const { intents, partials, permLevels } = require('./config');
const { readdirSync } = require('fs');
const log = require('./log');

const client = new Client({ intents, partials });
const slash = new Collection();
const aliases = new Collection();
const commands = new Collection();

const levelCache = {};
for(const level of permLevels) {
    levelCache[level.name] = level.level;
}

client.container = {
    slash,
    aliases,
    commands,
    levelCache
};

async function init() {
    const commands = readdirSync('./commands/').filter(file => file.endsWith('.js'));
    for(const file of commands) {
        const props = require(`./commands/${file}`);
        log.info(`Loading Command: ${props.help.name}`);
        client.container.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.container.aliases.set(alias, props.help.name);
        });
    }

    const slashes = readdirSync('./slash/').filter(file => file.endsWith('.js'));
    for(const file of slashes) {
        const command = require(`./slash/${file}`);
        log.info(`Loading slash command: ${command.commandData.name}`);
        client.container.slash.set(command.commandData.name, command);
    }

    const events = readdirSync('./events/').filter(file => file.endsWith('.js'));
    for(const file of events) {
        const eventName = file.split('.')[0];
        log.info(`Loading event: ${eventName}`);
        const event = require(`./events/${file}`);
        client.on(eventName, event.bind(null, client)); // magic
    }

    client.on('threadCreate', (thread) => thread.join()); // Join any thread that is created so the bot can be used in there

    client.login(process.env.DISCORD_TOKEN);
}

init();