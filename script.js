let players = [];

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS244ZM4MSH1YiHrQRcurfp58WixmJhUPW93RW1D6ROcsA2IDt8hWBMj3373RDfYsICp0bWiY6DFR3-/pub?output=csv";


const playerPhotos = {
  "Sanjay": "https://drive.google.com/thumbnail?id=1cto2yQ5qRuHhHNDSF2kjkd13L6gCoQF-&sz=w1000",
  "Pranesh": "https://drive.google.com/thumbnail?id=1J-49zs7_qQAKOhyirH6D8wPpe3mml_Bs&sz=w1000",
  "Karthick": "https://drive.google.com/thumbnail?id=12R404kHlrZHh3hrJmS40OVyAY4MUo8wh&sz=w1000"
};

async function loadPlayers() {

try {

const response = await fetch(SHEET_URL);

console.log("Status:", response.status);

const csv = await response.text();

console.log("CSV Data:");
console.log(csv);

const rows = csv.trim().split("\n");

console.log("Rows found:", rows.length);

players = rows.slice(1).map(row => {

const cols = row.split(",");

return {

matchNo: cols[0],
date: cols[1],
name: cols[2],
runs: Number(cols[3]),
ballsFaced: Number(cols[4]),
sixes: Number(cols[6]),
wickets: Number(cols[7]),
runsConceded: Number(cols[9]),
ballsBowled: Number(cols[8]),
sixesGiven: Number(cols[10]),
fours: Number(cols[5]),

};

});

console.log("Players:", players);

updateDashboard();
updateRecords();
generateLeaderboard();
generateCapHolders();
generatePlayerCards();
calculateMVP();
generateCharts();
generateWinPercentage();
loadComparisonPlayers();
generateRecentForm();
generateHallOfFame();
generateLatestMatch();

}
catch(err){

console.error("LOAD ERROR:", err);

}

}

/* Dashboard */

function updateDashboard(){

const totalRuns =
players.reduce((a,b)=>a+b.runs,0);

const totalWickets =
players.reduce((a,b)=>a+b.wickets,0);

const totalSixes =
players.reduce((a,b)=>a+b.sixes,0);

document.getElementById("totalRuns").textContent =
totalRuns;

document.getElementById("totalWickets").textContent =
totalWickets;

document.getElementById("totalSixes").textContent =
totalSixes;

const totalMatches =
new Set(players.map(player => player.matchNo)).size;

document.getElementById("totalMatches").textContent =
totalMatches;
}

/* Records */

function updateRecords(){

const mostRuns =
[...players].sort((a,b)=>b.runs-a.runs)[0];

const mostWickets =
[...players].sort((a,b)=>b.wickets-a.wickets)[0];

const mostSixes =
[...players].sort((a,b)=>b.sixes-a.sixes)[0];

const bestEconomy =
[...players].sort((a,b)=>a.economy-b.economy)[0];

const highestSR =
[...players].sort((a,b)=>b.strikeRate-a.strikeRate)[0];

const mostFours =
[...players].sort((a,b)=>b.fours-a.fours)[0];

document.getElementById("mostRuns").innerHTML =
`${mostRuns.name}<br>${mostRuns.runs}`;

document.getElementById("mostWickets").innerHTML =
`${mostWickets.name}<br>${mostWickets.wickets}`;

document.getElementById("mostSixes").innerHTML =
`${mostSixes.name}<br>${mostSixes.sixes}`;

document.getElementById("bestEconomy").innerHTML =
`${bestEconomy.name}<br>${bestEconomy.economy}`;

document.getElementById("highestSR").innerHTML =
`${highestSR.name}<br>${highestSR.strikeRate}`;

document.getElementById("mostFours").innerHTML =
`${mostFours.name}<br>${mostFours.fours} Fours`;

}
/* Records */

function updateRecords(){

const totals = {};

players.forEach(player=>{

if(!totals[player.name]){

totals[player.name] = {
runs:0,
wickets:0,
sixes:0,
fours:0,
ballsFaced:0,
ballsBowled:0,
runsConceded:0,
sixesGiven:0
};

}

totals[player.name].runs += Number(player.runs || 0);
totals[player.name].wickets += Number(player.wickets || 0);
totals[player.name].sixes += Number(player.sixes || 0);
totals[player.name].fours += Number(player.fours || 0);

totals[player.name].ballsFaced += Number(player.ballsFaced || 0);
totals[player.name].ballsBowled += Number(player.ballsBowled || 0);

totals[player.name].runsConceded += Number(player.runsConceded || 0);
totals[player.name].sixesGiven += Number(player.sixesGiven || 0);

});

const playerTotals = Object.entries(totals).map(([name,data])=>{

const strikeRate =
data.ballsFaced > 0
? ((data.runs / data.ballsFaced) * 100).toFixed(1)
: 0;

const economy =
data.ballsBowled > 0
? ((data.runsConceded * 6) / data.ballsBowled).toFixed(2)
: 0;

return{
name:name,
runs:data.runs,
wickets:data.wickets,
sixes:data.sixes,
fours:data.fours,
sixesGiven:data.sixesGiven,
strikeRate:Number(strikeRate),
economy:Number(economy)
};

});

const mostRuns =
[...playerTotals].sort((a,b)=>b.runs-a.runs)[0];

const mostWickets =
[...playerTotals].sort((a,b)=>b.wickets-a.wickets)[0];

const mostSixes =
[...playerTotals].sort((a,b)=>b.sixes-a.sixes)[0];

const mostFours =
[...playerTotals].sort((a,b)=>b.fours-a.fours)[0];

document.getElementById("mostRuns").innerHTML =
`${mostRuns.name}<br>${mostRuns.runs}`;

document.getElementById("mostWickets").innerHTML =
`${mostWickets.name}<br>${mostWickets.wickets}`;

document.getElementById("mostSixes").innerHTML =
`${mostSixes.name}<br>${mostSixes.sixes}`;

document.getElementById("mostFours").innerHTML =
`${mostFours.name}<br>${mostFours.fours}`;

}
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

/* Leaderboard */

function generateLeaderboard(){

    let html = "";

    players.forEach(player => {

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
            <td>${player.strikeRate}</td>
            <td>${player.wickets}</td>
            <td>${player.runsConceded}</td>
            <td>${player.ballsBowled}</td>
            <td>${player.sixesGiven}</td>
            <td>${player.economy}</td>
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

document.getElementById("playerModal").style.display =
"flex";
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

<table class="latest-table">

<tr>
<th>Player</th>
<th>Runs</th>
<th>Wickets</th>
<th>Sixes</th>
</tr>

`;

latestPlayers.forEach(player => {

html += `

<tr>
<td>${player.name}</td>
<td>${player.runs}</td>
<td>${player.wickets}</td>
<td>${player.sixes}</td>
</tr>

`;

});

html += `
</table>
</div>
`;

document.getElementById("latestMatchCard").innerHTML =
html;

}
function generateHeadToHead(){

const totals = {};

players.forEach(player=>{

if(!totals[player.name]){

totals[player.name] = {

runs:0,
wickets:0,
photo:player.photo

};

}

totals[player.name].runs += player.runs;
totals[player.name].wickets += player.wickets;

});

const sortedRuns =
Object.entries(totals)
.sort((a,b)=>b[1].runs-a[1].runs);

const leader = sortedRuns[0];
const second = sortedRuns[1];

const runLead =
leader[1].runs - second[1].runs;

const sortedWickets =
Object.entries(totals)
.sort((a,b)=>b[1].wickets-a[1].wickets);

const wicketLead =
sortedWickets[0][1].wickets -
sortedWickets[1][1].wickets;

document.getElementById("h2hPhoto").src =
leader[1].photo;

document.getElementById("h2hWinner").innerHTML =
leader[0];

document.getElementById("runsLead").innerHTML =
runLead;

document.getElementById("wicketsLead").innerHTML =
wicketLead;

document.getElementById("h2hSummary").innerHTML =
`
${leader[0]} is leading by
${runLead} runs and
${wicketLead} wickets compared to the nearest competitor.
`;

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
photo:playerPhotos[p.name],
strikeRate:0,
matches:0

};

}

totals[p.name].runs += p.runs;
totals[p.name].wickets += p.wickets;
totals[p.name].sixes += p.sixes;
totals[p.name].strikeRate += p.strikeRate;
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
(a.strikeRate/a.matches).toFixed(1);

const avgSR2 =
(b.strikeRate/b.matches).toFixed(1);

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

</div>

<div class="compare-player">

<img src="${b.photo}">
<h2>${player2}</h2>

<div class="compare-stat">🏏 Runs: ${b.runs}</div>
<div class="compare-stat">🎯 Wickets: ${b.wickets}</div>
<div class="compare-stat">💥 Sixes: ${b.sixes}</div>
<div class="compare-stat">⚡ SR: ${avgSR2}</div>

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
function generateCapHolders(){

const totals = {};

players.forEach(player=>{

if(!totals[player.name]){

totals[player.name] = {

runs:0,
wickets:0,
photo:playerPhotos[player.name]

};

}

totals[player.name].runs += player.runs;

totals[player.name].wickets += player.wickets;

});

/* Orange Cap */

const orangeCap =
Object.entries(totals)
.sort((a,b)=>b[1].runs-a[1].runs)[0];

/* Purple Cap */

const purpleCap =
Object.entries(totals)
.sort((a,b)=>b[1].wickets-a[1].wickets)[0];

document.getElementById(
"orangeCapPhoto"
).src =
orangeCap[1].photo;

document.getElementById(
"orangeCapName"
).innerHTML =
orangeCap[0];

document.getElementById(
"orangeCapRuns"
).innerHTML =
orangeCap[1].runs + " Runs";

document.getElementById(
"purpleCapPhoto"
).src =
purpleCap[1].photo;

document.getElementById(
"purpleCapName"
).innerHTML =
purpleCap[0];

document.getElementById(
"purpleCapWickets"
).innerHTML =
purpleCap[1].wickets + " Wickets";

}
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


let html =
'<div class="win-grid">';

Object.keys(playersMap).forEach(name=>{

const data =
playersMap[name];

const winPercent =
(
data.wins /
data.matches
*100
).toFixed(1);

html += `

<div class="win-card">

<img src="${data.photo}">

<h2>${name}</h2>

<div class="win-percent">
${winPercent}%
</div>

<p>
Wins:
${data.wins}
</p>

<p>
Matches:
${data.matches}
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

const card = document.getElementById("downloadCard");
const btn = document.querySelector(".download-btn");

btn.style.display = "none";

html2canvas(card,{
    scale:3,
    useCORS:true,
    backgroundColor:"#111827"
}).then(canvas=>{

    const link = document.createElement("a");

    link.download =
    document.getElementById("modalName").textContent +
    "_SPK_Player_Card.png";

    link.href = canvas.toDataURL("image/png");

    link.click();

    btn.style.display = "block";

});

}

const leaderboard = {};

players.forEach(p => {

if(!leaderboard[p.name]){

leaderboard[p.name] = {
name:p.name,
runs:0,
ballsFaced:0,
wickets:0,
ballsBowled:0,
runsConceded:0,
sixes:0,
fours:0,
matches:0
};

}

leaderboard[p.name].runs += Number(p.runs||0);
leaderboard[p.name].ballsFaced += Number(p.ballsFaced||0);
leaderboard[p.name].wickets += Number(p.wickets||0);
leaderboard[p.name].ballsBowled += Number(p.ballsBowled||0);
leaderboard[p.name].runsConceded += Number(p.runsConceded||0);
leaderboard[p.name].sixes += Number(p.sixes||0);
leaderboard[p.name].fours += Number(p.fours||0);
leaderboard[p.name].matches++;

});

Object.values(leaderboard).forEach(player=>{

player.strikeRate =
player.ballsFaced > 0
? ((player.runs/player.ballsFaced)*100).toFixed(1)
: 0;

player.economy =
player.ballsBowled > 0
? ((player.runsConceded*6)/player.ballsBowled).toFixed(2)
: 0;

});

const rankings =
Object.values(leaderboard)
.sort((a,b)=>b.runs-a.runs);
