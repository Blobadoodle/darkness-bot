import Logger from './modules/logger.js';

function getDate() {
    const d = new Date();
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}-${d.getHours() + 1}-${d.getMinutes()}-${d.getSeconds()}`;
}

const log = new Logger('./logs/', `${getDate()}.log`); // Create logger object

export default log;