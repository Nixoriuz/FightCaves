let currentWave = 1;
const totalWaves = 63;

// DOM Element references
const contentTitle = document.getElementById('main-content-title');
const waveNavigation = document.getElementById('wave-navigation');
const sidebarPrevBtn = document.getElementById('sidebar-prev-btn');
const sidebarNextBtn = document.getElementById('sidebar-next-btn');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const scaleSlider = document.getElementById('scale-slider');
const scaleValue = document.getElementById('scale-value');
const mainContent = document.querySelector('.main-content');

// Event Listeners
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });
}

if(sidebarPrevBtn) {
    sidebarPrevBtn.addEventListener('click', () => {
        if (currentWave > 1) {
            showWaveDetails(currentWave - 1);
        }
    });
}

if(sidebarNextBtn) {
    sidebarNextBtn.addEventListener('click', () => {
        if (currentWave < totalWaves) {
            showWaveDetails(currentWave + 1);
        }
    });
}


if (scaleSlider && scaleValue && mainContent) {
    scaleSlider.addEventListener('input', (event) => {
        const scale = event.target.value;
        applyScale(scale);
        localStorage.setItem('savedScale', scale);
    });
}

// Data
const monsters = {
    'tz-kih': { name: 'Tz-Kih', level: 22, img: 'https://oldschool.runescape.wiki/images/Tz-Kih.png', info: 'Attacks with melee and drains prayer. Keep your distance! Too small to be safespotted by rocks.' },
    'tz-kek': { name: 'Tz-Kek', level: 45, img: 'https://oldschool.runescape.wiki/images/Tz-Kek_(level_45).png', info: 'Melee attacker. Can be trapped behind rocks. Its spawn location on Wave 3 determines Jad\'s spawn.' },
    'tok-xil': { name: 'Tok-Xil', level: 90, img: 'https://oldschool.runescape.wiki/images/Tok-Xil_(1).png', info: 'Ranged attacker. Protect from Missiles is effective. This can attack over rocks, so it\'s a high priority target.' },
    'yt-mejkot': { name: 'Yt-MejKot', level: 180, img: 'https://oldschool.runescape.wiki/images/Yt-MejKot_(1).png', info: 'Strong melee attacker. This is the main monster to trap behind the Italy Rock or Long Rock.' },
    'ket-zek': { name: 'Ket-Zek', level: 360, img: 'https://oldschool.runescape.wiki/images/Ket-Zek_(1).png', info: 'Powerful magic attacker. Always Protect from Magic. Will attack over rocks, so kill this after trapping any Meleers.' },
    'jad': { name: 'TzTok-Jad', level: 702, img: 'https://oldschool.runescape.wiki/images/TzTok-Jad.png', info: 'The big boss. Use Italy Rock to trap the healers. Watch its leg movements to switch prayers!' }
};

const waveSpawns = [
    ['tz-kih'], ['tz-kih', 'tz-kih'], ['tz-kek'], ['tz-kek', 'tz-kih'], ['tz-kek', 'tz-kih', 'tz-kih'], ['tz-kek', 'tz-kek'],
    ['tok-xil'], ['tok-xil', 'tz-kih'], ['tok-xil', 'tz-kih', 'tz-kih'], ['tok-xil', 'tz-kek'], ['tok-xil', 'tz-kek', 'tz-kih'], ['tok-xil', 'tz-kek', 'tz-kih', 'tz-kih'], ['tok-xil', 'tz-kek', 'tz-kek'], ['tok-xil', 'tok-xil'],
    ['yt-mejkot'], ['yt-mejkot', 'tz-kih'], ['yt-mejkot', 'tz-kih', 'tz-kih'], ['yt-mejkot', 'tz-kek'], ['yt-mejkot', 'tz-kek', 'tz-kih'], ['yt-mejkot', 'tz-kek', 'tz-kih', 'tz-kih'], ['yt-mejkot', 'tz-kek', 'tz-kek'], ['yt-mejkot', 'tok-xil'],
    ['yt-mejkot', 'tok-xil', 'tz-kih'], ['yt-mejkot', 'tok-xil', 'tz-kih', 'tz-kih'], ['yt-mejkot', 'tok-xil', 'tz-kek'], ['yt-mejkot', 'tok-xil', 'tz-kek', 'tz-kih'], ['yt-mejkot', 'tok-xil', 'tz-kek', 'tz-kih', 'tz-kih'], ['yt-mejkot', 'tok-xil', 'tz-kek', 'tz-kek'], ['yt-mejkot', 'tok-xil', 'tok-xil'], ['yt-mejkot', 'yt-mejkot'],
    ['ket-zek'], ['ket-zek', 'tz-kih'], ['ket-zek', 'tz-kih', 'tz-kih'], ['ket-zek', 'tz-kek'], ['ket-zek', 'tz-kek', 'tz-kih'], ['ket-zek', 'tz-kek', 'tz-kih', 'tz-kih'], ['ket-zek', 'tz-kek', 'tz-kek'], ['ket-zek', 'tok-xil'],
    ['ket-zek', 'tok-xil', 'tz-kih'], ['ket-zek', 'tok-xil', 'tz-kih', 'tz-kih'], ['ket-zek', 'tok-xil', 'tz-kek'], ['ket-zek', 'tok-xil', 'tz-kek', 'tz-kih'], ['ket-zek', 'tok-xil', 'tz-kek', 'tz-kih', 'tz-kih'], ['ket-zek', 'tok-xil', 'tz-kek', 'tz-kek'], ['ket-zek', 'tok-xil', 'tok-xil'], ['ket-zek', 'yt-mejkot'],
    ['ket-zek', 'yt-mejkot', 'tz-kih'], ['ket-zek', 'yt-mejkot', 'tz-kih', 'tz-kih'], ['ket-zek', 'yt-mejkot', 'tz-kek'], ['ket-zek', 'yt-mejkot', 'tz-kek', 'tz-kih'], ['ket-zek', 'yt-mejkot', 'tz-kek', 'tz-kih', 'tz-kih'], ['ket-zek', 'yt-mejkot', 'tz-kek', 'tz-kek'], ['ket-zek', 'yt-mejkot', 'tok-xil'],
    ['ket-zek', 'yt-mejkot', 'tok-xil', 'tz-kih'], ['ket-zek', 'yt-mejkot', 'tok-xil', 'tz-kih', 'tz-kih'], ['ket-zek', 'yt-mejkot', 'tok-xil', 'tz-kek'], ['ket-zek', 'yt-mejkot', 'tok-xil', 'tz-kek', 'tz-kih'], ['ket-zek', 'yt-mejkot', 'tok-xil', 'tz-kek', 'tz-kih', 'tz-kih'], ['ket-zek', 'yt-mejkot', 'tok-xil', 'tz-kek', 'tz-kek'],
    ['ket-zek', 'yt-mejkot', 'tok-xil', 'tok-xil'], ['ket-zek', 'yt-mejkot', 'yt-mejkot'], ['ket-zek', 'ket-zek'],
    ['jad']
];

const waveSpawnLocations = [
    ['C'], ['C', 'SE'], ['NE'], ['NE', 'C'], ['NE', 'C', 'SE'], ['NE', 'SW'], ['NW'], ['NW', 'C'], ['NW', 'C', 'SE'], ['NW', 'NE'], 
    ['NW', 'NE', 'C'], ['NW', 'NE', 'C', 'SE'], ['NW', 'NE', 'SW'], ['NW', 'SE'], ['SW'], ['SW', 'C'], ['SW', 'C', 'SE'], ['SW', 'NE'], 
    ['SW', 'NE', 'C'], ['SW', 'NE', 'C', 'SE'], ['SW', 'NE', 'SW'], ['SW', 'NW'], ['SW', 'NW', 'C'], ['SW', 'NW', 'C', 'SE'], 
    ['SW', 'NW', 'NE'], ['SW', 'NW', 'NE', 'C'], ['SW', 'NW', 'NE', 'C', 'SE'], ['SW', 'NW', 'NE', 'SW'], ['SW', 'NW', 'SE'], ['SW', 'SE'],
    ['SE'], ['SE', 'C'], ['SE', 'C', 'SE'], ['SE', 'NE'], ['SE', 'NE', 'C'], ['SE', 'NE', 'C', 'SE'], ['SE', 'NE', 'SW'], ['SE', 'NW'],
    ['SE', 'NW', 'C'], ['SE', 'NW', 'C', 'SE'], ['SE', 'NW', 'NE'], ['SE', 'NW', 'NE', 'C'], ['SE', 'NW', 'NE', 'C', 'SE'], ['SE', 'NW', 'NE', 'SW'], 
    ['SE', 'NW', 'SE'], ['SE', 'SW'], ['SE', 'SW', 'C'], ['SE', 'SW', 'C', 'SE'], ['SE', 'SW', 'NE'], ['SE', 'SW', 'NE', 'C'], 
    ['SE', 'SW', 'NE', 'C', 'SE'], ['SE', 'SW', 'NE', 'SW'], ['SE', 'SW', 'NW'], ['SE', 'SW', 'NW', 'C'], ['SE', 'SW', 'NW', 'C', 'SE'], 
    ['SE', 'SW', 'NW', 'NE'], ['SE', 'SW', 'NW', 'NE', 'C'], ['SE', 'SW', 'NW', 'NE', 'C', 'SE'], ['SE', 'SW', 'NW', 'NE', 'SW'], 
    ['SE', 'SW', 'NW', 'SE'], ['SE', 'SW', 'SE'], ['C', 'NE', 'NW', 'SE', 'SW'], ['NE']
];

// Functions
function applyScale(scale) {
    if (scaleValue) scaleValue.textContent = `${scale}%`;
    if (mainContent) mainContent.style.transform = `scale(${scale / 100})`;
    if (scaleSlider) scaleSlider.value = scale;
}

function showContent(viewId, clickedButton) {
    document.querySelectorAll('.content-view').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
    
    contentTitle.textContent = clickedButton.textContent;
    
    if(viewId === 'waves-view') {
         waveNavigation.classList.add('visible');
         updateArrowVisibility();
    } else {
         waveNavigation.classList.remove('visible');
    }

    if (window.innerWidth < 768) {
        sidebar.classList.add('-translate-x-full');
    }
    localStorage.setItem('savedView', viewId);
}

function updateArrowVisibility() {
    sidebarPrevBtn.classList.toggle('disabled', currentWave <= 1);
    sidebarNextBtn.classList.toggle('disabled', currentWave >= totalWaves);
}

function showWaveDetails(waveNum) {
    if (waveNum < 1 || waveNum > totalWaves) return;
    currentWave = waveNum;
    localStorage.setItem('savedWave', waveNum);

    
    const waveDetailsContainer = document.getElementById('wave-details');
    const currentWaveSpawns = waveSpawns[waveNum - 1];
    let content = `<h3 class="text-2xl font-bold text-center mb-4">Wave ${waveNum}</h3>`;
    
    if(waveNum === 63) {
        const jad = monsters['jad'];
         content += `
            <div class="text-center">
                <img src="${jad.img}" alt="${jad.name}" class="mx-auto mb-4" style="max-width: 200px;">
                <p class="text-xl font-bold">${jad.name} (Level ${jad.level})</p>
                <div class="mt-4 text-left mx-auto max-w-2xl">
                    <h4 class="font-bold text-lg">JAD FIGHT STRATEGY:</h4>
                    <p class="mb-2">This is it! Stay calm. Jad switches between two attacks:</p>
                    <ul class="list-disc list-inside">
                        <li><strong class="text-blue-400">Magic Attack:</strong> Jad stands on his hind legs. SWITCH TO <strong class="text-blue-400">PROTECT FROM MAGIC</strong>.</li>
                        <li><strong class="text-green-400">Ranged Attack:</strong> Jad stomps his front foot. SWITCH TO <strong class="text-green-400">PROTECT FROM MISSILES</strong>.</li>
                    </ul>
                    <p class="mt-2">At 50% health, four healers (Yt-HurKot) will spawn and heal Jad. You MUST attack each healer at least once to draw their aggression. Then you can go back to attacking Jad.</p>
                    <p class="mt-2 font-bold text-red-500">The most important thing is to watch Jad's attacks and switch prayers correctly. Attack, watch, switch, repeat. You've got this!</p>
                </div>
            </div>`;
    } else {
        content += '<div class="wave-grid-container">';
        currentWaveSpawns.forEach(monsterKey => {
            const monster = monsters[monsterKey];
            content += `
                <div class="text-center card p-4 rounded-lg flex flex-col items-center">
                    <img src="${monster.img}" alt="${monster.name}" class="monster-img mx-auto mb-2">
                    <p class="font-bold">${monster.name}</p>
                    <p>Level: ${monster.level}</p>
                    <p class="text-sm mt-2 text-gray-300 flex-grow">${monster.info}</p>
                </div>
            `;
        });
        content += '</div>';
    }
    
    waveDetailsContainer.innerHTML = content;
    
    // Highlight spawn points
    document.querySelectorAll('.spawn-marker').forEach(marker => marker.classList.remove('highlight-spawn'));
    const spawnsForWave = waveSpawnLocations[waveNum - 1];
    if (spawnsForWave) {
        spawnsForWave.forEach(spawnId => {
            const marker = document.getElementById(`spawn-${spawnId}`);
            if (marker) {
                marker.classList.add('highlight-spawn');
            }
        });
    }

    updateArrowVisibility();
}

// Initial Load Logic
document.addEventListener('DOMContentLoaded', () => {
    const savedScale = localStorage.getItem('savedScale') || 100;
    const savedWave = parseInt(localStorage.getItem('savedWave'), 10) || 1;
    const savedView = localStorage.getItem('savedView') || 'setup-view';

    applyScale(savedScale);
    
    // Restore the last active view
    const savedViewButton = document.querySelector(`.nav-btn[onclick*="'${savedView}'"]`);
    if (savedViewButton) {
        showContent(savedView, savedViewButton);
    } else {
         showContent('setup-view', document.querySelector('.nav-btn.active'));
    }

    showWaveDetails(savedWave);
});
```eof
