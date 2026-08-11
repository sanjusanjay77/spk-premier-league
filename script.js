let players = [];

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS244ZM4MSH1YiHrQRcurfp58WixmJhUPW93RW1D6ROcsA2IDt8hWBMj3373RDfYsICp0bWiY6DFR3-/pub?output=csv";


const playerPhotos = {
  "Sanjay": "images/WhatsApp Image 2026-08-06 at 8.35.40 PM.jpeg",
  "Pranesh": "images/WhatsApp Image 2026-08-05 at 3.16.37 PM.jpeg",
  "Karthick": "images/WhatsApp Image 2026-08-05 at 3.18.47 PM.jpeg"
};
async function loadPlayers() {

    try {

        const response = await fetch(SHEET_URL);

        if (!response.ok) {
            throw new Error("Google Sheet loading failed");
        }

        const csv = await response.text();

        const rows = csv.trim().split(/\r?\n/);

        players = rows
            .slice(1)
            .map(row => {

                const cols = row.split(",");

                return {
                    matchNo: cols[0]?.trim() || "",
                    date: cols[1]?.trim() || "",
                    name: cols[2]?.trim() || "",

                    runs: Number(cols[3]) || 0,
                    ballsFaced: Number(cols[4]) || 0,
                    fours: Number(cols[5]) || 0,
                    sixes: Number(cols[6]) || 0,

                    wickets: Number(cols[7]) || 0,
                    ballsBowled: Number(cols[8]) || 0,
                    runsConceded: Number(cols[9]) || 0,
                    sixesGiven: Number(cols[10]) || 0
                };

            })
            .filter(p => p.name);


        console.log("Players loaded:", players.length);


        /*
         * Run each section separately.
         * This prevents one huge JavaScript task.
         */

        const tasks = [

            () => updateDashboard(),

            () => updateRecords(),

            () => generateLeaderboard(),

            () => generateCapHolders(),

            () => generatePlayerCards(),

            () => calculateMVP(),

            () => generateWinPercentage(),

            () => loadComparisonPlayers(),

            () => generateRecentForm(),

            () => generateHallOfFame(),

            () => generateLatestMatch(),

            () => updateTrophyCabinet()

        ];


        let index = 0;


        function runNextTask() {

            if (index >= tasks.length) {

                console.log("Dashboard completely loaded");

                return;

            }


            try {

                tasks[index]();

            }
            catch(error) {

                console.error(
                    "Dashboard section error:",
                    error
                );

            }


            index++;


            /*
             * Give browser time to render/handle
             * scrolling and clicking.
             */

            requestAnimationFrame(runNextTask);

        }


        requestAnimationFrame(runNextTask);


    }
    catch(error) {

        console.error(
            "Google Sheet loading error:",
            error
        );

    }

}
```javascript
function generateCapHolders() {

    const totals = {};

    players.forEach(function(player) {

        const name = String(player.name || "").trim();

        if (!name) return;

        if (!totals[name]) {
            totals[name] = {
                runs: 0,
                wickets: 0,
                photo: playerPhotos[name] || ""
            };
        }

        totals[name].runs += Number(player.runs) || 0;
        totals[name].wickets += Number(player.wickets) || 0;
    });


    const entries = Object.entries(totals);

    if (entries.length === 0) {
        return;
    }


    /* =========================
       ORANGE CAP
    ========================= */

    const highestRuns = Math.max(
        ...entries.map(function(entry) {
            return entry[1].runs;
        })
    );

    const orangeHolders = entries.filter(function(entry) {
        return entry[1].runs === highestRuns;
    });


    /* =========================
       PURPLE CAP
    ========================= */

    const highestWickets = Math.max(
        ...entries.map(function(entry) {
            return entry[1].wickets;
        })
    );

    const purpleHolders = entries.filter(function(entry) {
        return entry[1].wickets === highestWickets;
    });


    /* =========================
       ORANGE CAP DISPLAY
    ========================= */

    const orangePhoto =
        document.getElementById("orangeCapPhoto");

    const orangeName =
        document.getElementById("orangeCapName");

    const orangeRuns =
        document.getElementById("orangeCapRuns");


    if (orangeHolders.length === 1) {

        orangePhoto.src =
            orangeHolders[0][1].photo;

        orangePhoto.style.display = "block";

    } else {

        orangePhoto.style.display = "none";
    }


    orangeName.innerHTML =
        orangeHolders
            .map(function(entry) {
                return entry[0];
            })
            .join(" & ");


    orangeRuns.innerHTML =
        highestRuns + " Runs";


    /* =========================
       PURPLE CAP DISPLAY
    ========================= */

    const purplePhoto =
        document.getElementById("purpleCapPhoto");

    const purpleName =
        document.getElementById("purpleCapName");

    const purpleWickets =
        document.getElementById("purpleCapWickets");


    if (purpleHolders.length === 1) {

        purplePhoto.src =
            purpleHolders[0][1].photo;

        purplePhoto.style.display = "block";

    } else {

        purplePhoto.style.display = "none";
    }


    purpleName.innerHTML =
        purpleHolders
            .map(function(entry) {
                return entry[0];
            })
            .join(" & ");


    purpleWickets.innerHTML =
        highestWickets + " Wickets";


    /* =========================
       SAVE CAP HOLDER NAMES
    ========================= */

    orangeCapPlayer =
        orangeHolders
            .map(function(entry) {
                return entry[0];
            })
            .join(" & ");


    purpleCapPlayer =
        purpleHolders
            .map(function(entry) {
                return entry[0];
            })
            .join(" & ");
}
```


/* MVP */
function calculateMVP(){

const latestDate =
players[players.length - 1].date;

const latestDatePlayers =
players.filter(
p => p.date === latestDate
);

const totals = {};

latestDatePlayers.forEach(player=>{

if(!totals[player.name]){

totals[player.name] = {

runs:0,
wickets:0,
sixes:0

};

}

totals[player.name].runs += player.runs;
totals[player.name].wickets += player.wickets;
totals[player.name].sixes += player.sixes;

});

let mvpName = "";
let highestPoints = 0;

Object.keys(totals).forEach(name=>{

const points =
totals[name].runs +
(totals[name].wickets * 20) +
(totals[name].sixes * 3);

if(points > highestPoints){

highestPoints = points;
mvpName = name;

}

});

document.getElementById("mvpTitle").innerHTML =
"👑 MVP of the Week";

document.getElementById("mvpName").innerHTML =
mvpName;

document.getElementById("mvpPhoto").src =
playerPhotos[mvpName];

document.getElementById("mvpStats").innerHTML =
`
📅 ${latestDate}<br>
⭐ ${highestPoints} MVP Points
`;

}

/* Leaderboard */

function generateLeaderboard(){

let html = "";

players.forEach(player => {

const strikeRate =
player.ballsFaced > 0
? ((player.runs / player.ballsFaced) * 100).toFixed(1)
: "-";

const economy =
player.ballsBowled > 0
? ((player.runsConceded * 6) / player.ballsBowled).toFixed(2)
: "-";

html += `
<tr>
<td>${player.matchNo}</td>

<td>${player.date}</td>

<td onclick="openPlayer('${player.name}')"
style="cursor:pointer;color:#00D4FF;font-weight:bold;">
${player.name}
</td>

<td>${player.runs}</td>

<td>${player.ballsFaced}</td>

<td>${player.sixes}</td>

<td>${player.fours}</td>

<td>${strikeRate}</td>

<td>${player.wickets}</td>

<td>${player.runsConceded}</td>

<td>${player.ballsBowled}</td>

<td>${player.sixesGiven}</td>

<td>${economy}</td>

</tr>
`;

});

document.getElementById("leaderboardBody").innerHTML = html;

}
/* Player Cards */


function generatePlayerCards(){

const container =
document.getElementById("playerGrid");

container.innerHTML = "";

/* Combine all records of same player */

const playerMap = {};

players.forEach(player => {

if(!playerMap[player.name]){

playerMap[player.name] = {

name: player.name,
photo: playerPhotos[player.name],

runs: 0,
wickets: 0,
sixes: 0,

ballsFaced: 0,
ballsBowled: 0,
runsConceded: 0,

matches: 0

};

}

playerMap[player.name].runs += Number(player.runs || 0);
playerMap[player.name].wickets += Number(player.wickets || 0);
playerMap[player.name].sixes += Number(player.sixes || 0);

playerMap[player.name].ballsFaced += Number(player.ballsFaced || 0);
playerMap[player.name].ballsBowled += Number(player.ballsBowled || 0);
playerMap[player.name].runsConceded += Number(player.runsConceded || 0);

playerMap[player.name].matches++;

});

/* Create only one card per player */

Object.values(playerMap).forEach(player => {

container.innerHTML += `

<div
class="player-card"
onclick="openPlayer('${player.name}')">

<img src="${player.photo}">

<h3>${player.name}</h3>

<p>🏏 ${player.runs} Runs</p>

<p>🎯 ${player.wickets} Wickets</p>

<p>💥 ${player.sixes} Sixes</p>

<p>🎮 ${player.matches} Matches</p>

</div>

`;

});

}


/* Popup */

function openPlayer(name){


const records = players.filter(p => p.name === name);

let totalRuns = 0;
let totalWickets = 0;
let totalSixes = 0;
let totalFours = 0;

let totalBallsFaced = 0;
let totalBallsBowled = 0;

let totalRunsConceded = 0;
let totalSixesGiven = 0;

records.forEach(r => {

totalRuns += Number(r.runs || 0);
totalWickets += Number(r.wickets || 0);
totalSixes += Number(r.sixes || 0);
totalFours += Number(r.fours || 0);

totalBallsFaced += Number(r.ballsFaced || 0);
totalBallsBowled += Number(r.ballsBowled || 0);

totalRunsConceded += Number(r.runsConceded || 0);
totalSixesGiven += Number(r.sixesGiven || 0);

});

const strikeRate =
totalBallsFaced > 0
? ((totalRuns / totalBallsFaced) * 100).toFixed(1)
: "0";

const economy =
totalBallsBowled > 0
? (totalRunsConceded / (totalBallsBowled / 6)).toFixed(2)
: "0";

document.getElementById("modalImg").src =
playerPhotos[name];

document.getElementById("modalName").textContent =
name;

document.getElementById("modalRuns").textContent =
totalRuns;

document.getElementById("modalWickets").textContent =
totalWickets;

document.getElementById("modalFours").textContent =
totalFours;

document.getElementById("modalSixes").textContent =
totalSixes;

document.getElementById("modalSR").textContent =
strikeRate;

document.getElementById("modalEconomy").textContent =
economy;

document.getElementById("modalBallsFaced").textContent =
totalBallsFaced;

document.getElementById("modalBallsBowled").textContent =
totalBallsBowled;

document.getElementById("modalSixesGiven").textContent =
totalSixesGiven;

document.getElementById("modalMatches").textContent =
records.length;

const orangeCap =
document.getElementById("orangeCapName").textContent.trim();

const purpleCap =
document.getElementById("purpleCapName").textContent.trim();

if(name === orangeCap){

showFireworks("#ff9800");

const sound =
document.getElementById("fireworkSound");

if(sound){
sound.currentTime = 0;
sound.play();
}

}

if(name === purpleCap){

showFireworks("#9c27b0");

const sound =
document.getElementById("fireworkSound");

if(sound){
sound.currentTime = 0;
sound.play();
}

}
  
document.getElementById("playerModal").style.display =
"flex";

document.getElementById("downloadDateTime").textContent =
new Date().toLocaleString("en-IN");
}

/* Charts */

function generateCharts(){

const playerNames = [];
const totalRuns = [];
const totalWickets = [];

const groupedPlayers = {};

players.forEach(player=>{

if(!groupedPlayers[player.name]){

groupedPlayers[player.name] = {
runs:0,
wickets:0
};

}

groupedPlayers[player.name].runs += player.runs;
groupedPlayers[player.name].wickets += player.wickets;

});

Object.keys(groupedPlayers).forEach(name=>{

playerNames.push(name);

totalRuns.push(groupedPlayers[name].runs);

totalWickets.push(groupedPlayers[name].wickets);

});

const existingRuns = Chart.getChart("runsChart");
if(existingRuns) existingRuns.destroy();

const existingWickets = Chart.getChart("wicketsChart");
if(existingWickets) existingWickets.destroy();

new Chart(
document.getElementById("runsChart"),
{
type:"bar",

data:{
labels:playerNames,
datasets:[{
label:"Total Tournament Runs",
data:totalRuns
}]
},

options:{
responsive:true,
plugins:{
title:{
display:true,
text:"Tournament Total Runs"
}
}
}
}
);

new Chart(
document.getElementById("wicketsChart"),
{
type:"bar",

data:{
labels:playerNames,
datasets:[{
label:"Total Tournament Wickets",
data:totalWickets
}]
},

options:{
responsive:true,
plugins:{
title:{
display:true,
text:"Tournament Total Wickets"
}
}
}
}
);

}

function generateLatestMatch() {

const lastMatchNo =
players[players.length - 1].matchNo;

const latestPlayers =
players.filter(
p => p.matchNo === lastMatchNo
);

if(!latestPlayers.length) return;

let html = `

<div class="latest-match-card">

<h2>🏏 Latest Match #${lastMatchNo}</h2>

<p>📅 ${latestPlayers[0].date}</p>

<div class="latest-scroll">

<table class="latest-table">

<tr>
<th>Player</th>
<th>Runs</th>
<th>Balls</th>
<th>4s</th>
<th>6s</th>
<th>SR</th>
<th>Wkts</th>
<th>Runs Given</th>
<th>Balls Bowled</th>
<th>Economy</th>
</tr>

`;

latestPlayers.forEach(player => {

const sr =
player.ballsFaced > 0
? ((player.runs/player.ballsFaced)*100).toFixed(1)
: "-";

const eco =
player.ballsBowled > 0
? ((player.runsConceded*6)/player.ballsBowled).toFixed(2)
: "-";

html += `

<tr>
<td>${player.name}</td>
<td>${player.runs}</td>
<td>${player.ballsFaced}</td>
<td>${player.fours}</td>
<td>${player.sixes}</td>
<td>${sr}</td>
<td>${player.wickets}</td>
<td>${player.runsConceded}</td>
<td>${player.ballsBowled}</td>
<td>${eco}</td>
</tr>

`;

});

html += `

</table>

</div>

</div>

`;

document.getElementById("latestMatchCard").innerHTML = html;

}
function loadComparisonPlayers(){

const uniquePlayers =
[...new Set(players.map(p=>p.name))];

const p1 =
document.getElementById("player1");

const p2 =
document.getElementById("player2");

p1.innerHTML =
'<option value="">Select Player 1</option>';

p2.innerHTML =
'<option value="">Select Player 2</option>';

uniquePlayers.forEach(name=>{

p1.innerHTML +=
`<option value="${name}">${name}</option>`;

p2.innerHTML +=
`<option value="${name}">${name}</option>`;

});

}
function comparePlayers(){

const player1 =
document.getElementById("player1").value;

const player2 =
document.getElementById("player2").value;

if(player1===player2){

alert("Choose different players");

return;

}

const totals = {};

players.forEach(p=>{

if(!totals[p.name]){

totals[p.name]={
runs:0,
wickets:0,
sixes:0,
ballsFaced:0,
ballsBowled:0,
runsConceded:0,
photo:playerPhotos[p.name],
matches:0
};

}

totals[p.name].runs += p.runs;
totals[p.name].wickets += p.wickets;
totals[p.name].sixes += p.sixes;
totals[p.name].ballsFaced +=
Number(p.ballsFaced || 0);
totals[p.name].ballsBowled +=
Number(p.ballsBowled || 0);

totals[p.name].runsConceded +=
Number(p.runsConceded || 0);
totals[p.name].matches++;

});

const a = totals[player1];
const b = totals[player2];
const runLead =
Math.abs(a.runs - b.runs);

const wicketLead =
Math.abs(a.wickets - b.wickets);

const runLeader =
a.runs > b.runs ? player1 : player2;

const wicketLeader =
a.wickets > b.wickets ? player1 : player2;
const avgSR1 =
a.ballsFaced > 0
? ((a.runs / a.ballsFaced) * 100).toFixed(1)
: "0";

const avgSR2 =
b.ballsFaced > 0
? ((b.runs / b.ballsFaced) * 100).toFixed(1)
: "0";

const eco1 =
a.ballsBowled > 0
? ((a.runsConceded * 6) / a.ballsBowled).toFixed(2)
: "0";

const eco2 =
b.ballsBowled > 0
? ((b.runsConceded * 6) / b.ballsBowled).toFixed(2)
: "0";

const pointsA =
a.runs + (a.wickets*20);

const pointsB =
b.runs + (b.wickets*20);

const winner =
pointsA > pointsB
? player1
: player2;

document.getElementById(
"comparisonResult"
).innerHTML =

`
<div class="compare-card">

<div class="compare-grid">

<div class="compare-player">
<img src="${a.photo}">
<h2>${player1}</h2>

<div class="compare-stat">🏏 Runs: ${a.runs}</div>
<div class="compare-stat">🎯 Wickets: ${a.wickets}</div>
<div class="compare-stat">💥 Sixes: ${a.sixes}</div>
<div class="compare-stat">⚡ SR: ${avgSR1}</div>
<div class="compare-stat">🛡 ECO: ${eco1}</div>

</div>

<div class="compare-player">

<img src="${b.photo}">
<h2>${player2}</h2>

<div class="compare-stat">🏏 Runs: ${b.runs}</div>
<div class="compare-stat">🎯 Wickets: ${b.wickets}</div>
<div class="compare-stat">💥 Sixes: ${b.sixes}</div>
<div class="compare-stat">⚡ SR: ${avgSR2}</div>
<div class="compare-stat">🛡 ECO: ${eco2}</div>

</div>

</div>

<div class="winner-box">
🏆 Head-to-Head Winner: ${winner}
</div>

<div class="lead-box">

<h3>📊 Lead Analysis</h3>

<p>
🏏 ${runLeader} leads by
<b>${runLead} Runs</b>
</p>

<p>
🎯 ${wicketLeader} leads by
<b>${wicketLead} Wickets</b>
</p>

</div>

</div>
`;

}
```javascript
function generateCapHolders() {

    const totals = {};


    /* =========================
       CALCULATE PLAYER TOTALS
    ========================= */

    players.forEach(player => {

        const name =
            String(player.name || "").trim();

        if (!name) return;


        if (!totals[name]) {

            totals[name] = {

                runs: 0,

                wickets: 0,

                photo:
                    playerPhotos[name] || ""

            };

        }


        totals[name].runs +=
            Number(player.runs) || 0;

        totals[name].wickets +=
            Number(player.wickets) || 0;

    });


    const allPlayers =
        Object.entries(totals);


    if (!allPlayers.length) return;


    /* =========================
       ORANGE CAP
       FIND HIGHEST RUNS
    ========================= */

    const highestRuns =
        Math.max(
            ...allPlayers.map(
                ([name, data]) => data.runs
            )
        );


    const orangeHolders =
        allPlayers.filter(
            ([name, data]) =>
                data.runs === highestRuns
        );


    /* =========================
       PURPLE CAP
       FIND HIGHEST WICKETS
    ========================= */

    const highestWickets =
        Math.max(
            ...allPlayers.map(
                ([name, data]) => data.wickets
            )
        );


    const purpleHolders =
        allPlayers.filter(
            ([name, data]) =>
                data.wickets === highestWickets
        );


    /* =========================
       ORANGE CAP DISPLAY
    ========================= */

    const orangePhoto =
        document.getElementById(
            "orangeCapPhoto"
        );

    const orangeName =
        document.getElementById(
            "orangeCapName"
        );

    const orangeRuns =
        document.getElementById(
            "orangeCapRuns"
        );


    if (orangeHolders.length === 1) {

        orangePhoto.src =
            orangeHolders[0][1].photo;

        orangePhoto.style.display =
            "block";

    }
    else {

        /*
         * More than one player tied.
         * Hide single-player photo so
         * one player is not shown as
         * the only cap holder.
         */

        orangePhoto.style.display =
            "none";

    }


    orangeName.innerHTML =
        orangeHolders
            .map(
                ([name]) => name
            )
            .join(" & ");


    orangeRuns.innerHTML =
        highestRuns + " Runs";


    /* =========================
       PURPLE CAP DISPLAY
    ========================= */

    const purplePhoto =
        document.getElementById(
            "purpleCapPhoto"
        );

    const purpleName =
        document.getElementById(
            "purpleCapName"
        );

    const purpleWickets =
        document.getElementById(
            "purpleCapWickets"
        );


    if (purpleHolders.length === 1) {

        purplePhoto.src =
            purpleHolders[0][1].photo;

        purplePhoto.style.display =
            "block";

    }
    else {

        /*
         * More than one player tied.
         */

        purplePhoto.style.display =
            "none";

    }


    purpleName.innerHTML =
        purpleHolders
            .map(
                ([name]) => name
            )
            .join(" & ");


    purpleWickets.innerHTML =
        highestWickets + " Wickets";


    /* =========================
       GLOBAL CAP HOLDERS
       USED BY OTHER FUNCTIONS
    ========================= */

    orangeCapPlayer =
        orangeHolders
            .map(
                ([name]) => name
            )
            .join(" & ");


    purpleCapPlayer =
        purpleHolders
            .map(
                ([name]) => name
            )
            .join(" & ");

}
```


function generateHallOfFame(){

/* Highest Score */

const highestScore =
[...players]
.sort((a,b)=>b.runs-a.runs)[0];

/* Best Bowling */

const bestBowling =
[...players]
.sort((a,b)=>b.wickets-a.wickets)[0];

/* Most Sixes */

const mostSixes =
[...players]
.sort((a,b)=>b.sixes-a.sixes)[0];

/* Fastest Fifty */

const fiftyPlayers =
players.filter(
p => p.runs >= 50
);

let fastestFifty = null;

if(fiftyPlayers.length){

fastestFifty =
fiftyPlayers.sort(
(a,b)=>a.ballsFaced-b.ballsFaced
)[0];

}

document.getElementById(
"highestScore"
).innerHTML =

`${highestScore.runs} Runs<br>
${highestScore.name}`;

document.getElementById(
"bestBowling"
).innerHTML =

`${bestBowling.wickets} Wickets<br>
${bestBowling.name}`;

document.getElementById(
"mostSixesMatch"
).innerHTML =

`${mostSixes.sixes} Sixes<br>
${mostSixes.name}`;

if(fastestFifty){

document.getElementById(
"fastestFifty"
).innerHTML =

`${fastestFifty.ballsFaced} Balls<br>
${fastestFifty.name}`;

}
else{

document.getElementById(
"fastestFifty"
).innerHTML =

`No Fifty Yet`;

}

}
function generateRecentForm(){

const container =
document.getElementById(
"recentFormContainer"
);

container.innerHTML="";

const playerNames =
[...new Set(
players.map(p=>p.name)
)];

let html =
'<div class="recent-form-grid">';

playerNames.forEach(name=>{

const playerMatches =
players
.filter(p=>p.name===name)
.sort((a,b)=>
Number(b.matchNo)-
Number(a.matchNo)
)
.slice(0,5);

let totalRuns = 0;

playerMatches.forEach(match=>{

totalRuns += match.runs;

});

const avg =
playerMatches.length
? (totalRuns/playerMatches.length)
.toFixed(1)
: 0;

const photo =
playerPhotos[name] || "";

html += `

<div class="form-card">

<img src="${photo}">

<h2>${name}</h2>

<div class="form-scores">

`;

playerMatches.forEach(match=>{

let cls="form-poor";

if(match.runs>=40){

cls="form-good";

}
else if(match.runs>=20){

cls="form-average";

}

html +=

`
<div class="score-box ${cls}">
${match.runs}
</div>
`;

});

html += `

</div>

<div class="avg-box">

<h3>Average (Last 5 Matches)</h3>

<p>${avg}</p>

</div>

</div>

`;

});

html += "</div>";

container.innerHTML = html;

}
function generateWinPercentage(){

const playersMap = {};

players.forEach(player=>{

if(!playersMap[player.name]){

playersMap[player.name] = {

matches:0,
wins:0,
photo:playerPhotos[player.name]

};

}

playersMap[player.name].matches++;

});

const matchGroups = {};

players.forEach(player=>{

if(!matchGroups[player.matchNo]){

matchGroups[player.matchNo] = [];

}

matchGroups[player.matchNo].push(player);

});

Object.values(matchGroups).forEach(match=>{

const winner =
[...match]
.sort((a,b)=>b.runs-a.runs)[0];

playersMap[winner.name].wins++;

});

let html = '<div class="win-grid">';

Object.keys(playersMap).forEach(name=>{

const data = playersMap[name];

const winPercent =
(
data.wins /
data.matches * 100
).toFixed(1);

let glowClass = "";

if(name === "Sanjay"){
glowClass = "sanjay-glow";
}
else if(name === "Karthick"){
glowClass = "karthick-glow";
}
else if(name === "Pranesh"){
glowClass = "pranesh-glow";
}

html += `

<div class="win-card ${glowClass}">

<img src="${data.photo}">

<h2>${name}</h2>

<div class="win-percent">
${winPercent}%
</div>

<p>
Wins: ${data.wins}
</p>

<p>
Matches: ${data.matches}
</p>

</div>

`;

});

html += '</div>';

document.getElementById(
"winPercentageContainer"
).innerHTML = html;

}
loadPlayers();

function generateAwardHistory(){

const matches = {};

players.forEach(player=>{

if(!matches[player.matchNo]){
matches[player.matchNo] = [];
}

matches[player.matchNo].push(player);

});

let html = "";

Object.keys(matches)
.sort((a,b)=>b-a)
.forEach(matchNo=>{

const matchPlayers = matches[matchNo];

const bestBatsman =
[...matchPlayers]
.sort((a,b)=>b.runs-a.runs)[0];

const bestBowler =
[...matchPlayers]
.sort((a,b)=>b.wickets-a.wickets)[0];

html += `

<div class="award-card">

<h3>
🏏 Match ${matchNo}
</h3>

<p>
📅 ${matchPlayers[0].date}
</p>

<div class="award-row">

<div>

<h4>🔥 Best Batsman</h4>

<p>
${bestBatsman.name}
</p>

<p>
${bestBatsman.runs} Runs
</p>

</div>

<div>

<h4>🎯 Best Bowler</h4>

<p>
${bestBowler.name}
</p>

<p>
${bestBowler.wickets} Wickets
</p>

</div>

</div>

</div>

`;

});

document.getElementById(
"awardHistory"
).innerHTML = html;

}


function closeModal(){
document.getElementById("playerModal").style.display="none";
}
function downloadPlayerCard(){

try{

const now = new Date();

const dateElement =
document.getElementById("downloadDateTime");

if(dateElement){
dateElement.textContent =
now.toLocaleDateString("en-IN") +
" | " +
now.toLocaleTimeString("en-IN");
}

const card =
document.getElementById("downloadCard");

html2canvas(card,{
scale:2,
useCORS:true,
backgroundColor:"#111827"
}).then(canvas=>{

const link =
document.createElement("a");

link.download =
document.getElementById("modalName").textContent +
"_PlayerCard.png";

link.href =
canvas.toDataURL("image/png");

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

});

}catch(err){

console.error(err);
alert("Download Error");

}

}

// Close modal when clicking outside the player card

window.onclick = function(event){

    const modal =
    document.getElementById("playerModal");

    if(event.target == modal){

        modal.style.display = "none";

    }

}

function showFireworks(color){

const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

for(let i=0;i<40;i++){

const particle = document.createElement("div");

particle.className = "firework-particle";

particle.style.background = color;

const angle = (Math.PI * 2 * i) / 40;
const distance = 150 + Math.random()*100;

particle.style.left = centerX + "px";
particle.style.top = centerY + "px";

particle.style.setProperty(
"--x",
Math.cos(angle)*distance + "px"
);

particle.style.setProperty(
"--y",
Math.sin(angle)*distance + "px"
);

document.body.appendChild(particle);

setTimeout(()=>{
particle.remove();
},2000);

}

}
console.log(records);
function showBestBatsmanHistory(){

const matches = {};

players.forEach(player=>{

if(!matches[player.date]){
matches[player.date] = [];
}

matches[player.date].push(player);

});

let html = `
<h3>🏏 Best Batsman History</h3>
`;

Object.keys(matches)
.reverse()
.forEach(date=>{

const bestBatsman =
matches[date]
.sort((a,b)=>b.runs-a.runs)[0];

html += `
<div class="award-history-card">

<p>📅 ${date}</p>

<p>
🏏 ${bestBatsman.name}
</p>

<p>
${bestBatsman.runs} Runs
</p>

</div>
`;

});

document.getElementById("awardHistory").innerHTML = html;

}

function showBestBowlerHistory(){

const matches = {};

players.forEach(player=>{

if(!matches[player.date]){
matches[player.date] = [];
}

matches[player.date].push(player);

});

let html = `
<h3>🎯 Best Bowler History</h3>
`;

Object.keys(matches)
.reverse()
.forEach(date=>{

const bestBowler =
matches[date]
.sort((a,b)=>b.wickets-a.wickets)[0];

html += `
<div class="award-history-card">

<p>📅 ${date}</p>

<p>
🎯 ${bestBowler.name}
</p>

<p>
${bestBowler.wickets} Wickets
</p>

</div>
`;

});

document.getElementById("awardHistory").innerHTML = html;

}
function logoHit(){

const ball =
document.getElementById("ball");

const sound =
document.getElementById("hitSound");


ball.classList.remove("ballFly");

void ball.offsetWidth;


sound.currentTime = 0;
sound.play();


ball.style.display = "block";

ball.classList.add("ballFly");


setTimeout(()=>{

ball.style.display = "none";

},3000);

}

function updateTrophyCabinet() {

    const orangeWins = {};
    const purpleWins = {};
    const sixerWins = {};

    /* Get one consistent date value */
    function getDateKey(player) {

        const rawDate =
            player.matchDate ||
            player.date ||
            player.Date ||
            player.MatchDate;

        if (!rawDate) return null;

        const d = new Date(rawDate);

        if (!isNaN(d.getTime())) {
            return d.toISOString().split("T")[0];
        }

        return String(rawDate).trim();
    }


    /* Get all unique dates */
    const dates = [
        ...new Set(
            players
                .map(player => getDateKey(player))
                .filter(date => date)
        )
    ];


    /* Calculate awards for every complete date */
    dates.forEach(date => {

        const dayTotals = {};

        players.forEach(player => {

            if (getDateKey(player) !== date) return;

            const name =
                String(player.name || "").trim();

            if (!name) return;

            if (!dayTotals[name]) {

                dayTotals[name] = {
                    runs: 0,
                    wickets: 0,
                    sixes: 0
                };

            }

            dayTotals[name].runs +=
                Number(player.runs) || 0;

            dayTotals[name].wickets +=
                Number(player.wickets) || 0;

            dayTotals[name].sixes +=
                Number(player.sixes) || 0;

        });


        const names = Object.keys(dayTotals);

        if (!names.length) return;


        /* =========================
           ORANGE CAP
           Highest runs on that date
        ========================= */

        const highestRuns =
            Math.max(
                ...names.map(
                    name => dayTotals[name].runs
                )
            );

        if (highestRuns > 0) {

            names
                .filter(
                    name =>
                        dayTotals[name].runs === highestRuns
                )
                .forEach(name => {

                    orangeWins[name] =
                        (orangeWins[name] || 0) + 1;

                });

        }


        /* =========================
           PURPLE CAP
           Highest wickets on that date
        ========================= */

        const highestWickets =
            Math.max(
                ...names.map(
                    name => dayTotals[name].wickets
                )
            );

        if (highestWickets > 0) {

            names
                .filter(
                    name =>
                        dayTotals[name].wickets === highestWickets
                )
                .forEach(name => {

                    purpleWins[name] =
                        (purpleWins[name] || 0) + 1;

                });

        }


        /* =========================
           SIXER KING
           Highest sixes on that date
        ========================= */

        const highestSixes =
            Math.max(
                ...names.map(
                    name => dayTotals[name].sixes
                )
            );

        if (highestSixes > 0) {

            names
                .filter(
                    name =>
                        dayTotals[name].sixes === highestSixes
                )
                .forEach(name => {

                    sixerWins[name] =
                        (sixerWins[name] || 0) + 1;

                });

        }

    });


    /* Get all players */
    const allPlayers = [
        ...new Set(
            players
                .map(player =>
                    String(player.name || "").trim()
                )
                .filter(name => name)
        )
    ];


    /* Sort by total trophies */
    allPlayers.sort((a, b) => {

        const totalA =
            (orangeWins[a] || 0) +
            (purpleWins[a] || 0) +
            (sixerWins[a] || 0);

        const totalB =
            (orangeWins[b] || 0) +
            (purpleWins[b] || 0) +
            (sixerWins[b] || 0);

        return totalB - totalA;

    });


    /* =========================
       CREATE TABLE
    ========================= */

    let html = "";

    let totalOrange = 0;
    let totalPurple = 0;
    let totalSixes = 0;
    let totalTrophies = 0;


    allPlayers.forEach(name => {

        const orange =
            orangeWins[name] || 0;

        const purple =
            purpleWins[name] || 0;

        const sixes =
            sixerWins[name] || 0;

        const total =
            orange +
            purple +
            sixes;


        totalOrange += orange;
        totalPurple += purple;
        totalSixes += sixes;
        totalTrophies += total;


        html += `
            <tr>

                <td class="trophy-player">
                    ${name}
                </td>

                <td class="orange-count">
                    ${orange}
                </td>

                <td class="purple-count">
                    ${purple}
                </td>

                <td class="sixes-count">
                    ${sixes}
                </td>

                <td class="total-trophies">
                    ${total}
                </td>

            </tr>
        `;

    });


    /* =========================
       GRAND TOTAL
    ========================= */

    html += `
        <tr class="trophy-total-row">

            <td>
                <strong>TOTAL</strong>
            </td>

            <td>
                <strong>${totalOrange}</strong>
            </td>

            <td>
                <strong>${totalPurple}</strong>
            </td>

            <td>
                <strong>${totalSixes}</strong>
            </td>

            <td>
                <strong>${totalTrophies}</strong>
            </td>

        </tr>
    `;


    /* Display */
    const table =
        document.getElementById("trophyTableBody");

    if (table) {
        table.innerHTML = html;
    }

}
