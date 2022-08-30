import log from '../log.js';

export const run = async client => {
    log.info(`Logged in as ${client.user.tag}`);
};