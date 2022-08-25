const log = require ('../log');

module.exports = async client => {
    log.info(`Logged in as ${client.user.tag}`);
};