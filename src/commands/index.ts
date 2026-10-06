import ping from './utility/ping'
import server from './utility/server'
import user from './utility/user'

import abilityCheck from './players/abilityCheck'
import savingThrow from './players/savingThrow'
import skillTemplate from './players/skillTemplate'
import charInfo from './players/charInfo'
import initiative from './players/initiative'

export const allCommands = {
    common: [
        ping,
        server,
        user,
        abilityCheck,
        savingThrow,
        charInfo,
        initiative,
    ],
    special: [
        skillTemplate,
    ],
}
