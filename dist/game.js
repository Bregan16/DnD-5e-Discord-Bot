import { capitalize } from './utils.js';
const RPSChoices = {
    rock: {
        description: 'sedimentary, igneous, or perhaps even metamorphic',
        virus: 'outwaits',
        computer: 'smashes',
        scissors: 'crushes',
    },
    cowboy: {
        description: 'yeehaw~',
        scissors: 'puts away',
        wumpus: 'lassos',
        rock: 'steel-toe kicks',
    },
    scissors: {
        description: 'careful ! sharp ! edges !!',
        paper: 'cuts',
        computer: 'cuts cord of',
        virus: 'cuts DNA of',
    },
    virus: {
        description: 'genetic mutation, malware, or something inbetween',
        cowboy: 'infects',
        computer: 'corrupts',
        wumpus: 'infects',
    },
    computer: {
        description: 'beep boop beep bzzrrhggggg',
        cowboy: 'overwhelms',
        paper: 'uninstalls firmware for',
        wumpus: 'deletes assets for',
    },
    wumpus: {
        description: 'the purple Discord fella',
        paper: 'draws picture on',
        rock: 'paints cute face on',
        scissors: 'admires own reflection in',
    },
    paper: {
        description: 'versatile and iconic',
        virus: 'ignores',
        cowboy: 'gives papercut to',
        rock: 'covers',
    },
};
export function getRPSChoices() {
    return Object.keys(RPSChoices);
}
export function getResult(p1, p2) {
    let gameResult;
    if (RPSChoices[p1.objectName]?.[p2.objectName]) {
        gameResult = { win: p1, lose: p2, verb: RPSChoices[p1.objectName][p2.objectName] };
    }
    else if (RPSChoices[p2.objectName]?.[p1.objectName]) {
        gameResult = { win: p2, lose: p1, verb: RPSChoices[p2.objectName][p1.objectName] };
    }
    else {
        gameResult = { win: p1, lose: p2, verb: 'tie' };
    }
    return formatResult(gameResult);
}
function formatResult({ win, lose, verb }) {
    return verb === 'tie'
        ? `<@${win.id}> and <@${lose.id}> draw with **${win.objectName}**`
        : `<@${win.id}>'s **${win.objectName}** ${verb} <@${lose.id}>'s **${lose.objectName}**`;
}
export function getShuffledOptions() {
    return getRPSChoices()
        .map((c) => ({
        label: capitalize(c),
        value: c.toLowerCase(),
        description: RPSChoices[c]['description'],
    }))
        .sort(() => Math.random() - 0.5);
}
