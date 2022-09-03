import config from '../config.js';
import { settings } from './settings.js'; 

export function permlevel(message) {
    let permlvl = 0;
  
    const permOrder = config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
  
    while (permOrder.length) {
        const currentLevel = permOrder.shift();
        if(!message.guild && currentLevel.guildOnly) continue;

        if(currentLevel.check(message)) {
            permlvl = currentLevel.level;
            break;
        }
    }

    return permlvl;
}


export function getSettings(guild) {
    let guildConf = undefined;
    if(guild != undefined) guildConf = settings.get(guild.id);

    if(guildConf != null && guildConf != undefined) {
        return guildConf;
    } else {
        guildConf = config.defaultSettings;
    }
    const csettings = {};

    for(const i of guildConf) {
        csettings[i.name] = i.value;
    }

    return csettings;
}

export function setSettings(guild) {
    const defaults = config.defaultSettings;

    const csettings = {};

    for(const i of defaults) {
        csettings[i.name] = i.value;
    }

    return settings.set(guild.id, csettings);
}