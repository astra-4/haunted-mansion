//constants and stuff
const state = {
    scene: 'job',
    coinFlips: 0,
    blueprintSeen: false,
    tabletSeen: false,
    coinSeen: false,
    portraitSeen: false,
    questionsAsked: {
        crew: false,
        who: false,
        want: false
    },
    heartAnswer: null,
    kitchenDone: false,
    studyDone: false,
    ballroomDone: false,
    ending: null,
    items: [],
};

const inventoryDefs = {
    coin: {
        label: 'Lucky Coin',
        glyph: '🪙'
    },
    lockpicks: {
        label: 'Lock Picks',
        glyph: '🔧'
    },
    journal: {
        label: "Macrus' Journal",
        glyph: '📓'
    },
    photo: {
        label: 'Family Photograph',
        glyph: '🖼'
    }
};

let typer = null;

function typeText(full, speaker) {
    clearInterval(typer);
    document.getElementById('dialogueSpeaker').textContent = speaker || 'NARRATION';
    const textEl = document.getElementById('dialoghueTextInner');
    const cursor = document.getElementById('cursor');
    cursor.classList.add('hidden');
    let i = 0;
    typer = setInterval(() => {
        i++;
        textEl.textContent = full.slice(0,i);
        if (i>=full.length) {
            clearInterval(typer);
            cursor.classList.remove('hidden');
        }
    }, 16);
}

function showScene(id) {
    document.querySelectorAll('.scene').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function updateProgress() {
    const stepMap = {
        job: 1,
        separated: 2,
        ghost: 3,
        investigation: 4,
        vault: 5,
        ending: 5,
        epilogue: 5
    };
    document.getElementById('progress').textContent = 'Scene ${stepMap[state.scene] || 1} of 5';
}

function addItem(key) {
    if (!state.items.includes(key)) state.items.push(key);
    renderInventory();
}

function renderInventory() {
    const wrap = document.getElementById('inventoryItems');
    wrap.innerHTML = '';
    state.items.forEach(key => {
        const def = inventoryDefs[key];
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.title = def.label;
        div.textContent = def.glyph;
        wrap.appendChild(div);
    });
    document.getElementById('inventoryEmpty').classList.toggle('hidden', state.items.length > 0);
}

function goToScene(id) {
    state.scene = id;
    showScene('scene-' + id);
    updateProgress();
}

//oh coding gods please grant my code with no bugs



//scene 1 da j*b
document.getElementById('btnEnter').addEventListener('click', () => {
    goToScene('separated');
    typeText("The chandelier crashes between the group. Dust fills the room. When it settles, everyone is gone.", "NARRATION");
});

//scene 2 seaparated + interatigve part
function maybeShowFollowBtn() {
    if (state.blueprintSeen || state.tabletSeen || state.coinSeen || state.portraitSeen) {
        document.getElementById('btnFollow').classList.remove('hidden');
    }
}

document.getElementById('objBlueprint').addEventListener('click', () => {
    state.blueprintSeen = true;
    typeText("Marcus circled one room: the Vault. Underneath, in different handwriting: Don't look for the vault", "BLUEPRINT");
    maybeShowFollowBtn();
});

document.getElementById('objTablet').addEventListener('click', () => {
    state.tabletSeen = true;
    typeText("Lena's tablet glows: NO SIGNAL. Then the text changes by itself: YOU SHOULD LEAVE.", "LENA'S TABLET");
    maybeShowFollowBtn();
});

document.getElementById('objCoin').addEventListener('click', () => {
    if (!state.coinSeen) {
        state.coinSeen = true;
        addItem('coin');
    }
    state.coinFlips++;
    document.getElementById('coinFace').textContent = state.coinFlips % 2 === 0 ? 'H' : 'T';
    typeText("Briggs' lucky coin. It never lands the same way twice while you're watching.", "LUCKY COIN");
    maybeShowFollowBtn();
});

document.getElementById('objPortrait').addEventListener('click', () => {
    state.portraitSeen = true;
    typeText('A wealthy family: mother, father, young daughter. Her face has been scratched away. "The Blackwoods, Summer of 1896."', "FAMILY PORTRAIT");
    maybeShowFollowBtn();
});

document.getElementById('btnFollow').addEventListener('click', () => {
    goToScene('ghost');
    typeText("You follow soft footsteps into the library. Books float gently through the air. A girl appears near the fireplace.", "NARRATION");
});


//scene 3 the ghost dialogue tree
function maybeShowContinue() {
    const q = state.questionsAsked;
    if (q.crew && q.who && q.want) {
        document.getElementById('btnContinueGhost').classList.remove('hidden');
    }
}

function askQuestion(key, btnId, text) {
    state.questionsAsked[key] = true;
    document.getElementById(btnId).classList.add('asked');
    typeText(text, "EVELYN");
    maybeShowContinue();
}

document.getElementById('qCrew').addEventListener('click', () => {
    askQuestion('crew', 'qCrew', "Scattered, like leaves. They will find their own way, or they won't.");
});

document.getElementById('qWho').addEventListener('click', () => {
    askQuestion('who', 'qWho', "I have watched thieves enter this house for over a century. None care about the truth. Only the treasure.");
});

document.getElementById('qWant').addEventListener('click', () => {
    askQuestion('want', 'qWant', "To be remembered as more than a legend other people came here to rob.");
});

document.getElementById('btnContinueGhost').addEventListener('click', () => {
    document.getElementById('ghostQuestions').classList.add('hidden');
    document.getElementById('ghostHeart').classList.remove('hidden');
    typeText('"My name is Evelyn," she says. "Did you come for the Heart?"', "EVELYN");
});

function answerHeart(answer, replyText) {
    state.heartAnswer = answer;
    document.getElementById('ghostHeart').classList.add('hidden');
    document.getElementById('ghostExit').classList.remove('hidden');
    typeText(replyText, "EVELYN");
}

document.getElementById('heartYes').addEventListener('click', () => {
    answerHeart('yes', "Everyone comes looking for treasure. No one ever asks why this house is haunted.");
});

document.getElementById('heartMaybe').addEventListener('click', () => {
    answerHeart('maybe', "Maybe is honest, at least. More honest than the others who came before you.");
});

document.getElementById('heartUnsure').addEventListener('click', () => {
    answerHeart('unsure', "Neither did the others, by the end. Perhaps that's where the truth begins.");
});

document.getElementById('btnSearchManor').addEventListener('click', () => {
    goToScene('investigation');
    typeText('Evelyn fades, whispering: "Find the truth before you find the vault."', "NARRATION");
})


//scene 4 investigation
function maybeShowReturnBtn() {
    if (state.kitchenDone && state.studyDone && state.ballroomDone) {
        document.getElementById('btnReturnEvelyn').classList.remove('hidden');
    }
}

document.getElementById('roomKitchen').addEventListener('click', () => {
    if (!state.kitchenDone) { state.kitchenDone = true; addItem('lockpicks'); }
    document.getElementById('roomKitchen').classList.add('done');
    document.getElementById('kitchenLabel').textContent = 'investigated';
    typeText("Lena's lock-pick kit sits by a broken dinner table. A newspaper headline: BLACKWOOD FAMILY VANISHES. Not dies — vanishes.", "KITCHEN");
    maybeShowReturnBtn();
});

document.getElementById('roomStudy').addEventListener('click', () => {
    if (!state.studyDone) { state.studyDone = true; addItem('journal'); }
    document.getElementById('roomStudy').classList.add('done');
    document.getElementById('studyLabel').textContent = 'investigated';
    typeText('Marcus\'s notebook is full of sketches and research. One page is torn out. The last remaining line: "The Heart isn\'t an object.', "STUDY");
    maybeShowReturnBtn();
});

document.getElementById('roomBallroom').addEventListener('click', () => {
    if (!state.ballroomDone) { state.ballroomDone = true; addItem('photo'); }
    document.getElementById('roomBallroom').classList.add('done');
    document.getElementById('ballroomLabel').textContent = 'investigated';
    typeText("Briggs' backpack lies beside an old phonograph. Playing it fills the room with laughter, then crying, then silence.", "BALLROOM");
    maybeShowReturnBtn();
});

document.getElementById('btnReturnEvelyn').addEventListener('click', () => {
    goToScene('vault');
    typeText("The hidden vault opens. Inside: no treasure. Just shelves of letters, photographs, and keepsakes.", "NARRATION");
});



//restart
function restart() {
    state.scene = 'job';
    state.coinFlips = 0;
    state.items=[];
    state.blueprintSeen = false;
    state.tabletSeen = false;
    state.coinSeen = false;
    state.portraitSeen = false;
    state.questionsAsked = {
        crew: false,
        who: false,
        want: false
    };
    state.heartAnswer = null;
    state.kitchenDone = false;
    state.studyDone = false;
    state.ballroomDone = false;
    state.ending = null;
    document.getElementById('btnFollow').classList.add('hidden');
    document.getElementById('ghostQuestions').classList.remove('hidden');
    document.getElementById('ghostHeart').classList.add('hidden');
    document.getElementById('ghostExit').classList.add('hidden');
    document.getElementById('btnContinueGhost').classList.add('hidden');
    ['qCrew', "qWho", 'qWant'].forEach(id => document.getElementById(id). classList.remove('asked'));
    document.getElementById('btnReturnEvelyn').classList.add('hidden');
    ['roomKitchen', 'roomStudy', 'roomBallroom'].forEach(id => document.getElementById(id).classList.remove('done'));
    document.getElementById('kitchenLabel').textContent = 'click to search';
    document.getElementById('studyLabel').textContent = 'click to search';
    document.getElementById('ballroomLabel').textContent = 'click to search';
    document.getElementById('vaultIntro').classList.remove('hidden');
    document.getElementById('vaultChoice').classList.add('hidden');
    document.getElementById('coinFace').textContent = 'H';
    renderInventory();
    goToScene('job');
    typeText("A stormy night~ Your crew parks outside Blackwood Manor. One job. One grab. Everyone set for life.", "NARRATION");
}
document.getElementById('btnRestart1').addEventListener('click', restart);
document.getElementById('btnRestart2').addEventListener('click', restart);

//loading
updateProgress();
renderInventory();
typeText("A stormy night~ Your crew parks outside Blackwood Manor. One job. One grab. Everyone set for life.", "NARRATION");