import ping from './utility/ping'
import server from './utility/server'
import user from './utility/user'

import abilityCheck from './players/abilityCheck'
import savingThrow from './players/savingThrow'
import skillTemplate from './players/skillTemplate'
import charInfo from './players/charInfo'
import initiative from './players/initiative'
import attack from './players/attack'
import spell from './players/spell'
import spellList from './players/spellList'

export const allCommands = {
    common: [
        ping,
        server,
        user,
        abilityCheck,
        savingThrow,
        charInfo,
        initiative,
        attack,
        spell,
        spellList,
    ],
    special: [
        skillTemplate,
    ],
}
