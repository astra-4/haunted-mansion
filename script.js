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
    }
    photo: {
        label: 'Family Photograph',
        glyph: '🖼'
    },
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



//pass 1 scene 1 da j*b
document.getElementById('btnEnter').addEventListener('click', () => {
    goToScene('separated');
    typeText("The chandelier crashes between the group. Dust fills the room. When it settles, everyone is gone.", "NARRATION");
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