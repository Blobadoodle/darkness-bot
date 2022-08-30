import * as dotenv from 'dotenv';
dotenv.config();

import { Client, Collection } from 'discord.js';
import config from './config.js';
const { intents, partials, permLevels } = config;
import { readdirSync } from 'node:fs';
import log from './log.js';

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
        const props = await import(`./commands/${file}`);
        log.info(`Loading Command: ${props.help.name}`);
        client.container.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.container.aliases.set(alias, props.help.name);
        });
    }

    const slashes = readdirSync('./slash/').filter(file => file.endsWith('.js'));
    for(const file of slashes) {
        const command = await import(`./slash/${file}`);
        log.info(`Loading slash command: ${command.commandData.name}`);
        client.container.slash.set(command.commandData.name, command);
    }

    const events = readdirSync('./events/').filter(file => file.endsWith('.js'));
    for(const file of events) {
        const eventName = file.split('.')[0];
        log.info(`Loading event: ${eventName}`);
        const event = await import(`./events/${file}`);
        client.on(eventName, event.run.bind(null, client)); // magic
    }

    client.on('threadCreate', (thread) => thread.join()); // Join any thread that is created so the bot can be used in there

    client.login(process.env.DISCORD_TOKEN);
}

init();