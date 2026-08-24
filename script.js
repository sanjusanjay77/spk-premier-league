/* =========================================================
   SPK PREMIER LEAGUE - MAIN JAVASCRIPT
   ========================================================= */

let players = [];

let orangeCapPlayer = "";
let purpleCapPlayer = "";

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS244ZM4MSH1YiHrQRcurfp58WixmJhUPW93RW1D6ROcsA2IDt8hWBMj3373RDfYsICp0bWiY6DFR3-/pub?output=csv";


/* =========================================================
   PLAYER PHOTOS
   ========================================================= */

const playerPhotos = {
    "Sanjay": "images/WhatsApp Image 2026-08-06 at 8.35.40 PM.jpeg",
    "Pranesh": "images/WhatsApp Image 2026-08-05 at 3.16.37 PM.jpeg",
    "Karthick": "images/WhatsApp Image 2026-08-05 at 3.18.47 PM.jpeg"
};

function escapeHTML(str) {

    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}   
/* =========================================================
   SAFE NUMBER
   ========================================================= */

function num(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}


/* =========================================================
   CSV PARSER
   Handles commas inside quoted values
   ========================================================= */

function parseCSVLine(line) {

    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {

        const char = line[i];

        if (char === '"') {

            if (
                insideQuotes &&
                line[i + 1] === '"'
            ) {
                current += '"';
                i++;
            }
            else {
                insideQuotes = !insideQuotes;
            }

        }
        else if (
            char === "," &&
            !insideQuotes
        ) {
            result.push(current.trim());
            current = "";
        }
        else {
            current += char;
        }
    }

    result.push(current.trim());

    return result;
}


/* =========================================================
   LOAD GOOGLE SHEET
   ========================================================= */

async function loadPlayers() {

    try {

        const response = await fetch(SHEET_URL);

        if (!response.ok) {
            throw new Error(
                "Google Sheet loading failed: " +
                response.status
            );
        }

        const csv = await response.text();

        if (!csv.trim()) {
            console.warn("Google Sheet is empty.");
            players = [];
            return;
        }

        const rows = csv
            .trim()
            .split(/\r?\n/);

        players = rows
            .slice(1)
            .map(function(row) {

                const cols = parseCSVLine(row);

                return {

                    matchNo:
                        cols[0]?.trim() || "",

                    date:
                        cols[1]?.trim() || "",

                    name:
                        cols[2]?.trim() || "",

                    runs:
                        num(cols[3]),

                    ballsFaced:
                        num(cols[4]),

                    fours:
                        num(cols[5]),

                    sixes:
                        num(cols[6]),

                    wickets:
                        num(cols[7]),

                    ballsBowled:
                        num(cols[8]),

                    runsConceded:
                        num(cols[9]),

                    sixesGiven:
                        num(cols[10])

                };

            })
            .filter(function(player) {
                return player.name;
            });


        console.log(
            "Players loaded:",
            players.length
        );


        /* =================================================
           RUN DASHBOARD SECTIONS ONE BY ONE
           ================================================= */
        const tasks = [

    updateDashboard,
    updateRecords,
    generateLeaderboard,
    generateCapHolders,
    generatePlayerCards,
    calculateMVP,
    generateWinPercentage,
    loadComparisonPlayers,
    generateRecentForm,
    generateHallOfFame,
    generateLatestMatch,
    generateCharts,
    updateTrophyCabinet,
    showDatePerformance

];


        let index = 0;


        function runNextTask() {

            if (index >= tasks.length) {

                console.log(
                    "Dashboard completely loaded"
                );

                return;
            }


            try {

                if (
                    typeof tasks[index] ===
                    "function"
                ) {
                    tasks[index]();
                }

            }
            catch (error) {

                console.error(
                    "Dashboard section error:",
                    error
                );

            }


            index++;

            requestAnimationFrame(
                runNextTask
            );

        }


        requestAnimationFrame(
            runNextTask
        );

    }
    catch (error) {

        console.error(
            "Google Sheet loading error:",
            error
        );

    }

}

function generateLeaderboard() {

    const tableBody =
        document.getElementById("leaderboardBody");

    if (!tableBody) {
        console.warn("leaderboardBody not found");
        return;
    }

    let html = "";

    players.forEach(function(player) {

        const runs = Number(player.runs) || 0;
        const ballsFaced = Number(player.ballsFaced) || 0;
        const fours = Number(player.fours) || 0;
        const sixes = Number(player.sixes) || 0;
        const wickets = Number(player.wickets) || 0;
        const runsConceded = Number(player.runsConceded) || 0;
        const ballsBowled = Number(player.ballsBowled) || 0;
        const sixesGiven = Number(player.sixesGiven) || 0;

        const strikeRate =
            ballsFaced > 0
                ? ((runs / ballsFaced) * 100).toFixed(1)
                : "-";

        const economy =
            ballsBowled > 0
                ? ((runsConceded * 6) / ballsBowled).toFixed(2)
                : "-";

        const safeName =
            String(player.name || "")
                .replace(/\\/g, "\\\\")
                .replace(/'/g, "\\'");

        html += `
            <tr>

                <td>${player.matchNo || "-"}</td>

                <td>${player.date || "-"}</td>

                <td
                    onclick="openPlayer('${safeName}')"
                    style="
                        cursor:pointer;
                        color:#00D4FF;
                        font-weight:bold;
                    "
                >
                    ${player.name}
                </td>

                <td>${runs}</td>

                <td>${ballsFaced}</td>

                <td>${sixes}</td>

                <td>${fours}</td>

                <td>${strikeRate}</td>

                <td>${wickets}</td>

                <td>${runsConceded}</td>

                <td>${ballsBowled}</td>

                <td>${sixesGiven}</td>

                <td>${economy}</td>

            </tr>
        `;
    });

    tableBody.innerHTML = html;
}


/* =========================================================
   GET PLAYER TOTALS
   ========================================================= */

function getPlayerTotals() {

    const totals = {};

    players.forEach(function(player) {

        const name =
            String(player.name || "").trim();

        if (!name) {
            return;
        }

        if (!totals[name]) {

            totals[name] = {

                name: name,

                runs: 0,
                wickets: 0,
                sixes: 0,
                fours: 0,
                ducks: 0,

                ballsFaced: 0,
                ballsBowled: 0,

                runsConceded: 0,
                sixesGiven: 0,

                matches: 0,

                photo:
                    playerPhotos[name] || ""

            };

        }

        totals[name].runs +=
            num(player.runs);

        totals[name].wickets +=
            num(player.wickets);

        totals[name].sixes +=
            num(player.sixes);

        totals[name].fours +=
            num(player.fours);

        totals[name].ballsFaced +=
            num(player.ballsFaced);

        totals[name].ballsBowled +=
            num(player.ballsBowled);

        totals[name].runsConceded +=
            num(player.runsConceded);

        totals[name].sixesGiven +=
            num(player.sixesGiven);

        totals[name].matches++;

        /* Duck Count */
        if (
            num(player.runs) === 0 &&
            num(player.ballsFaced) > 0
        ) {
            totals[name].ducks++;
        }

    });

    return Object.values(totals);

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    const totalRuns =
        players.reduce(function(total, player) {

            return total + num(player.runs);

        }, 0);


    const totalWickets =
        players.reduce(function(total, player) {

            return total + num(player.wickets);

        }, 0);


    const totalSixes =
        players.reduce(function(total, player) {

            return total + num(player.sixes);

        }, 0);


    const totalMatches =
        new Set(
            players.map(function(player) {
                return player.matchNo;
            })
        ).size;


    const runsElement =
        document.getElementById("totalRuns");

    const wicketsElement =
        document.getElementById("totalWickets");

    const sixesElement =
        document.getElementById("totalSixes");

    const matchesElement =
        document.getElementById("totalMatches");


    if (runsElement) {
        runsElement.textContent =
            totalRuns;
    }

    if (wicketsElement) {
        wicketsElement.textContent =
            totalWickets;
    }

    if (sixesElement) {
        sixesElement.textContent =
            totalSixes;
    }

    if (matchesElement) {
        matchesElement.textContent =
            totalMatches;
    }

}


/* =========================================================
   TOURNAMENT RECORDS
   TIES ARE DISPLAYED
   ========================================================= */

function updateRecords() {

    const totals = getPlayerTotals();

    if (!totals || totals.length === 0) return;

    totals.forEach(player => {

        player.strikeRate =
            player.ballsFaced > 0
                ? (player.runs / player.ballsFaced) * 100
                : 0;

        player.economy =
            player.ballsBowled > 0
                ? (player.runsConceded * 6) / player.ballsBowled
                : null;

    });

    const highestRuns =
        Math.max(...totals.map(p => p.runs));

    const highestWickets =
        Math.max(...totals.map(p => p.wickets));

    const highestSixes =
        Math.max(...totals.map(p => p.sixes));

    const highestFours =
        Math.max(...totals.map(p => p.fours));

    const highestDucks =
        Math.max(...totals.map(p => p.ducks));

    const highestSR =
        Math.max(...totals.map(p => p.strikeRate));

    const bowlingPlayers =
        totals.filter(p => p.ballsBowled > 0);

    const bestEconomy =
        bowlingPlayers.length
            ? Math.min(...bowlingPlayers.map(p => p.economy))
            : null;

    const mostRuns =
        totals.filter(p => p.runs === highestRuns);

    const mostWickets =
        totals.filter(p => p.wickets === highestWickets);

    const mostSixes =
        totals.filter(p => p.sixes === highestSixes);

    const mostFours =
        totals.filter(p => p.fours === highestFours);

    const mostDucks =
        totals.filter(p => p.ducks === highestDucks);

    const highestStrikeRate =
        totals.filter(p => p.strikeRate === highestSR);

    const bestEconomyPlayers =
        bowlingPlayers.filter(
            p => p.economy === bestEconomy
        );

    orangeCapPlayer =
        mostRuns.map(p => p.name).join(" & ");

    purpleCapPlayer =
        mostWickets.map(p => p.name).join(" & ");

    document.getElementById("mostRuns").innerHTML =
        `${mostRuns.map(p => p.name).join(" & ")}<br>${highestRuns}`;

    document.getElementById("mostWickets").innerHTML =
        `${mostWickets.map(p => p.name).join(" & ")}<br>${highestWickets}`;

    document.getElementById("mostSixes").innerHTML =
        `${mostSixes.map(p => p.name).join(" & ")}<br>${highestSixes}`;

    document.getElementById("mostFours").innerHTML =
        `${mostFours.map(p => p.name).join(" & ")}<br>${highestFours}`;

    document.getElementById("mostDucks").innerHTML =
        `${mostDucks.map(p => p.name).join(" & ")}<br>${highestDucks}`;

    document.getElementById("highestSR").innerHTML =
        `${highestStrikeRate.map(p => p.name).join(" & ")}<br>${highestSR.toFixed(1)}`;

    document.getElementById("bestEconomy").innerHTML =
        bestEconomyPlayers.length
            ? `${bestEconomyPlayers.map(p => p.name).join(" & ")}<br>${bestEconomy.toFixed(2)}`
            : "-";

}

/* =========================================================
   SAFE HTML SETTER
   ========================================================= */

function setHTML(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.innerHTML = value;
    }

}

function generateCapHolders() {

    if (!players.length) return;

    // Get latest date
    const latestDate =
        players[players.length - 1].date;

    // Only players from latest date
    const latestPlayers =
        players.filter(
            p => p.date === latestDate
        );

    const totals = {};

    latestPlayers.forEach(player => {

        const name =
            String(player.name || "").trim();

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

    const highestRuns =
        Math.max(
            ...allPlayers.map(
                ([n, d]) => d.runs
            )
        );

    const highestWickets =
        Math.max(
            ...allPlayers.map(
                ([n, d]) => d.wickets
            )
        );

    const orangeHolders =
        allPlayers.filter(
            ([n, d]) =>
                d.runs === highestRuns
        );

    const purpleHolders =
        allPlayers.filter(
            ([n, d]) =>
                d.wickets === highestWickets
        );

    // Orange Cap
    document.getElementById(
        "orangeCapName"
    ).innerHTML =
        orangeHolders
            .map(([n]) => n)
            .join(" & ");

    document.getElementById(
        "orangeCapRuns"
    ).innerHTML =
        highestRuns +
        " Runs<br>" +
        latestDate;

    // Purple Cap
    document.getElementById(
        "purpleCapName"
    ).innerHTML =
        purpleHolders
            .map(([n]) => n)
            .join(" & ");

    document.getElementById(
        "purpleCapWickets"
    ).innerHTML =
        highestWickets +
        " Wickets<br>" +
        latestDate;

    // Photos
    const orangePhoto =
        document.getElementById(
            "orangeCapPhoto"
        );

    const purplePhoto =
        document.getElementById(
            "purpleCapPhoto"
        );

    if (orangeHolders.length === 1) {

        orangePhoto.src =
            orangeHolders[0][1].photo;

        orangePhoto.style.display =
            "block";

    } else {

        orangePhoto.style.display =
            "none";

    }

    if (purpleHolders.length === 1) {

        purplePhoto.src =
            purpleHolders[0][1].photo;

        purplePhoto.style.display =
            "block";

    } else {

        purplePhoto.style.display =
            "none";

    }

}

/* =========================================================
   PLAYER CARDS
   ========================================================= */

function generatePlayerCards() {

    const container =
        document.getElementById(
            "playerGrid"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const playerMap = {};


    players.forEach(function(player) {

        const name =
            String(player.name || "").trim();


        if (!name) {
            return;
        }


        if (!playerMap[name]) {

            playerMap[name] = {

                name: name,

                photo:
                    playerPhotos[name] || "",

                runs: 0,
                wickets: 0,
                sixes: 0,

                ballsFaced: 0,
                ballsBowled: 0,
                runsConceded: 0,

                matches: 0

            };

        }


        playerMap[name].runs +=
            num(player.runs);

        playerMap[name].wickets +=
            num(player.wickets);

        playerMap[name].sixes +=
            num(player.sixes);

        playerMap[name].ballsFaced +=
            num(player.ballsFaced);

        playerMap[name].ballsBowled +=
            num(player.ballsBowled);

        playerMap[name].runsConceded +=
            num(player.runsConceded);

        playerMap[name].matches++;

    });


    Object.values(playerMap)
        .forEach(function(player) {

            container.innerHTML += `

                <div
                    class="player-card"
                    onclick="openPlayer('${escapeHTML(player.name)}')"
                >

                    <img src="${player.photo}">

                    <h3>
                        ${escapeHTML(player.name)}
                    </h3>

                    <p>
                        🏏 ${player.runs} Runs
                    </p>

                    <p>
                        🎯 ${player.wickets} Wickets
                    </p>

                    <p>
                        💥 ${player.sixes} Sixes
                    </p>

                    <p>
                        🎮 ${player.matches} Matches
                    </p>

                </div>

            `;

        });

}

function openPlayer(name) {

    /* =========================================
       GET ALL RECORDS FOR SELECTED PLAYER
       ========================================= */

    const records = players.filter(function(player) {
        return String(player.name || "").trim() === String(name).trim();
    });

    if (!records.length) {
        console.warn("No records found for:", name);
        return;
    }


    /* =========================================
       TOTAL STATISTICS
       ========================================= */

    let totalRuns = 0;
    let totalWickets = 0;
    let totalSixes = 0;
    let totalFours = 0;

    let totalBallsFaced = 0;
    let totalBallsBowled = 0;

    let totalRunsConceded = 0;
    let totalSixesGiven = 0;


    records.forEach(function(record) {

        totalRuns += Number(record.runs) || 0;

        totalWickets += Number(record.wickets) || 0;

        totalSixes += Number(record.sixes) || 0;

        totalFours += Number(record.fours) || 0;

        totalBallsFaced +=
            Number(record.ballsFaced) || 0;

        totalBallsBowled +=
            Number(record.ballsBowled) || 0;

        totalRunsConceded +=
            Number(record.runsConceded) || 0;

        totalSixesGiven +=
            Number(record.sixesGiven) || 0;

    });


    /* =========================================
       STRIKE RATE
       ========================================= */

    const strikeRate =
        totalBallsFaced > 0
            ? (
                totalRuns /
                totalBallsFaced
            ) * 100
            : 0;


    /* =========================================
       ECONOMY
       ========================================= */

    const economy =
        totalBallsBowled > 0
            ? (
                totalRunsConceded * 6
            ) / totalBallsBowled
            : 0;


    /* =========================================
       PLAYER PHOTO
       ========================================= */

    const modalImg =
        document.getElementById("modalImg");

    if (modalImg) {

        modalImg.src =
            playerPhotos[name] || "";

    }


    /* =========================================
       BASIC PLAYER DETAILS
       ========================================= */

    const modalName =
        document.getElementById("modalName");

    if (modalName) {
        modalName.textContent = name;
    }


    /* =========================================
       UPDATE POPUP STATISTICS
       ========================================= */

    const modalRuns =
        document.getElementById("modalRuns");

    if (modalRuns) {
        modalRuns.textContent =
            totalRuns;
    }


    const modalWickets =
        document.getElementById("modalWickets");

    if (modalWickets) {
        modalWickets.textContent =
            totalWickets;
    }


    const modalFours =
        document.getElementById("modalFours");

    if (modalFours) {
        modalFours.textContent =
            totalFours;
    }


    const modalSixes =
        document.getElementById("modalSixes");

    if (modalSixes) {
        modalSixes.textContent =
            totalSixes;
    }


    const modalSR =
        document.getElementById("modalSR");

    if (modalSR) {
        modalSR.textContent =
            strikeRate.toFixed(1);
    }


    const modalEconomy =
        document.getElementById("modalEconomy");

    if (modalEconomy) {
        modalEconomy.textContent =
            economy.toFixed(2);
    }


    const modalBallsFaced =
        document.getElementById("modalBallsFaced");

    if (modalBallsFaced) {
        modalBallsFaced.textContent =
            totalBallsFaced;
    }


    const modalBallsBowled =
        document.getElementById("modalBallsBowled");

    if (modalBallsBowled) {
        modalBallsBowled.textContent =
            totalBallsBowled;
    }


    /* =========================================
       ⭐ RUNS CONCEDED
       THIS IS THE IMPORTANT PART
       ========================================= */

    const modalRunsConceded =
        document.getElementById("modalRunsConceded");

    if (modalRunsConceded) {

        modalRunsConceded.textContent =
            totalRunsConceded;

    } else {

        console.error(
            "modalRunsConceded element NOT FOUND in HTML"
        );

    }


    const modalSixesGiven =
        document.getElementById("modalSixesGiven");

    if (modalSixesGiven) {
        modalSixesGiven.textContent =
            totalSixesGiven;
    }


    const modalMatches =
        document.getElementById("modalMatches");

    if (modalMatches) {
        modalMatches.textContent =
            records.length;
    }


    /* =========================================
       DEBUG
       ========================================= */

    console.log(
        "Player:",
        name
    );

    console.log(
        "Balls Bowled:",
        totalBallsBowled
    );

    console.log(
        "Runs Conceded:",
        totalRunsConceded
    );


    /* =========================================
       ORANGE / PURPLE CAP EFFECT
       ========================================= */

    const orangeCapElement =
        document.getElementById("orangeCapName");

    const purpleCapElement =
        document.getElementById("purpleCapName");

    const orangeCap =
        orangeCapElement
            ? orangeCapElement.textContent.trim()
            : "";

    const purpleCap =
        purpleCapElement
            ? purpleCapElement.textContent.trim()
            : "";


    if (
        orangeCap
            .split("&")
            .map(function(x) {
                return x.trim();
            })
            .includes(name)
    ) {

        showFireworks("#ff9800");

        const sound =
            document.getElementById("fireworkSound");

        if (sound) {

            sound.currentTime = 0;

            sound.play().catch(function() {});

        }

    }


    if (
        purpleCap
            .split("&")
            .map(function(x) {
                return x.trim();
            })
            .includes(name)
    ) {

        showFireworks("#9c27b0");

        const sound =
            document.getElementById("fireworkSound");

        if (sound) {

            sound.currentTime = 0;

            sound.play().catch(function() {});

        }

    }


    /* =========================================
       SHOW MODAL
       ========================================= */

    const modal =
        document.getElementById("playerModal");

    if (modal) {

        modal.style.display = "flex";

    }


    /* =========================================
       DOWNLOAD DATE/TIME
       ========================================= */

    const downloadDateTime =
        document.getElementById(
            "downloadDateTime"
        );

    if (downloadDateTime) {

        downloadDateTime.textContent =
            new Date().toLocaleString("en-IN");

    }

}


/* =========================================================
   SAFE TEXT SETTER
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


/* =========================================================
   FIREWORK SOUND
   ========================================================= */

function playFireworkSound() {

    const sound =
        document.getElementById(
            "fireworkSound"
        );


    if (!sound) {
        return;
    }


    sound.currentTime = 0;


    const promise =
        sound.play();


    if (
        promise &&
        typeof promise.catch ===
        "function"
    ) {

        promise.catch(function() {
            console.log(
                "Sound could not autoplay."
            );
        });

    }

}


/* =========================================================
   CHARTS
   ========================================================= */

function generateCharts() {

    if (
        typeof Chart ===
        "undefined"
    ) {

        console.warn(
            "Chart.js is not loaded."
        );

        return;
    }


    const canvasRuns =
        document.getElementById(
            "runsChart"
        );


    const canvasWickets =
        document.getElementById(
            "wicketsChart"
        );


    if (
        !canvasRuns ||
        !canvasWickets
    ) {
        return;
    }


    const totals =
        getPlayerTotals();


    const playerNames =
        totals.map(function(player) {
            return player.name;
        });


    const totalRuns =
        totals.map(function(player) {
            return player.runs;
        });


    const totalWickets =
        totals.map(function(player) {
            return player.wickets;
        });


    const existingRuns =
        Chart.getChart(
            "runsChart"
        );


    if (existingRuns) {
        existingRuns.destroy();
    }


    const existingWickets =
        Chart.getChart(
            "wicketsChart"
        );


    if (existingWickets) {
        existingWickets.destroy();
    }


    new Chart(
        canvasRuns,
        {

            type: "bar",

            data: {

                labels: playerNames,

                datasets: [

                    {
                        label:
                            "Total Tournament Runs",

                        data:
                            totalRuns
                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    title: {

                        display: true,

                        text:
                            "Tournament Total Runs"

                    }

                }

            }

        }
    );


    new Chart(
        canvasWickets,
        {

            type: "bar",

            data: {

                labels: playerNames,

                datasets: [

                    {
                        label:
                            "Total Tournament Wickets",

                        data:
                            totalWickets
                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    title: {

                        display: true,

                        text:
                            "Tournament Total Wickets"

                    }

                }

            }

        }
    );

}


/* =========================================================
   MVP
   ========================================================= */

function calculateMVP() {

    if (!players.length) {
        return;
    }


    const latestDate =
        players[players.length - 1].date;


    const latestDatePlayers =
        players.filter(function(player) {

            return player.date ===
                latestDate;

        });


    const totals = {};


    latestDatePlayers.forEach(
        function(player) {

            if (!totals[player.name]) {

                totals[player.name] = {

                    runs: 0,
                    wickets: 0,
                    sixes: 0

                };

            }


            totals[player.name].runs +=
                num(player.runs);

            totals[player.name].wickets +=
                num(player.wickets);

            totals[player.name].sixes +=
                num(player.sixes);

        }
    );


    let mvpName = "";
    let highestPoints = -1;


    Object.keys(totals)
        .forEach(function(name) {

            const points =
                totals[name].runs +
                (
                    totals[name].wickets *
                    20
                ) +
                (
                    totals[name].sixes *
                    3
                );


            if (
                points >
                highestPoints
            ) {

                highestPoints =
                    points;

                mvpName =
                    name;

            }

        });


    setHTML(
        "mvpTitle",
        "👑 MVP of the Week"
    );


    setHTML(
        "mvpName",
        mvpName
    );


    const mvpPhoto =
        document.getElementById(
            "mvpPhoto"
        );


    if (mvpPhoto) {

        mvpPhoto.src =
            playerPhotos[mvpName] || "";

    }


    setHTML(
        "mvpStats",
        "📅 " +
        latestDate +
        "<br>" +
        "⭐ " +
        highestPoints +
        " MVP Points"
    );

}


/* =========================================================
   LATEST MATCH
   ========================================================= */

function generateLatestMatch() {

    if (!players.length) {
        return;
    }


    const lastMatchNo =
        players[
            players.length - 1
        ].matchNo;


    const latestPlayers =
        players.filter(function(player) {

            return player.matchNo ===
                lastMatchNo;

        });


    if (!latestPlayers.length) {
        return;
    }


    let html = `

        <div class="latest-match-card">

            <h2>
                🏏 Latest Match #${lastMatchNo}
            </h2>

            <p>
                📅 ${latestPlayers[0].date}
            </p>

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


    latestPlayers.forEach(
        function(player) {

            const sr =
                player.ballsFaced > 0
                    ? (
                        player.runs /
                        player.ballsFaced
                    ) * 100
                    : 0;


            const eco =
                player.ballsBowled > 0
                    ? (
                        player.runsConceded *
                        6
                    ) /
                    player.ballsBowled
                    : 0;


            html += `

                <tr>

                    <td>
                        ${escapeHTML(
                            player.name
                        )}
                    </td>

                    <td>
                        ${player.runs}
                    </td>

                    <td>
                        ${player.ballsFaced}
                    </td>

                    <td>
                        ${player.fours}
                    </td>

                    <td>
                        ${player.sixes}
                    </td>

                    <td>
                        ${sr.toFixed(1)}
                    </td>

                    <td>
                        ${player.wickets}
                    </td>

                    <td>
                        ${player.runsConceded}
                    </td>

                    <td>
                        ${player.ballsBowled}
                    </td>

                    <td>
                        ${eco.toFixed(2)}
                    </td>

                </tr>

            `;

        }
    );


    html += `

                </table>

            </div>

        </div>

    `;


    setHTML(
        "latestMatchCard",
        html
    );

}


/* =========================================================
   COMPARISON PLAYER DROPDOWNS
   ========================================================= */

function loadComparisonPlayers() {

    const uniquePlayers =
        [
            ...new Set(
                players.map(function(player) {
                    return player.name;
                })
            )
        ];


    const p1 =
        document.getElementById(
            "player1"
        );


    const p2 =
        document.getElementById(
            "player2"
        );


    if (!p1 || !p2) {
        return;
    }


    p1.innerHTML =
        '<option value="">Select Player 1</option>';


    p2.innerHTML =
        '<option value="">Select Player 2</option>';


    uniquePlayers.forEach(
        function(name) {

            p1.innerHTML +=
                `<option value="${escapeHTML(name)}">
                    ${escapeHTML(name)}
                </option>`;


            p2.innerHTML +=
                `<option value="${escapeHTML(name)}">
                    ${escapeHTML(name)}
                </option>`;

        }
    );

}


/* =========================================================
   COMPARE PLAYERS
   ========================================================= */

function comparePlayers() {

    const player1 =
        document.getElementById(
            "player1"
        )?.value;


    const player2 =
        document.getElementById(
            "player2"
        )?.value;


    if (
        !player1 ||
        !player2
    ) {

        alert(
            "Select both players."
        );

        return;
    }


    if (
        player1 === player2
    ) {

        alert(
            "Choose different players."
        );

        return;
    }


    const totals =
        getPlayerTotals();


    const a =
        totals.find(function(player) {
            return player.name === player1;
        });


    const b =
        totals.find(function(player) {
            return player.name === player2;
        });


    if (!a || !b) {
        return;
    }


    const runLead =
        Math.abs(
            a.runs -
            b.runs
        );


    const wicketLead =
        Math.abs(
            a.wickets -
            b.wickets
        );


    const runLeader =
        a.runs > b.runs
            ? player1
            : b.runs > a.runs
                ? player2
                : "Both";


    const wicketLeader =
        a.wickets > b.wickets
            ? player1
            : b.wickets > a.wickets
                ? player2
                : "Both";


    const avgSR1 =
        a.ballsFaced > 0
            ? (
                a.runs /
                a.ballsFaced
            ) * 100
            : 0;


    const avgSR2 =
        b.ballsFaced > 0
            ? (
                b.runs /
                b.ballsFaced
            ) * 100
            : 0;


    const eco1 =
        a.ballsBowled > 0
            ? (
                a.runsConceded *
                6
            ) /
            a.ballsBowled
            : 0;


    const eco2 =
        b.ballsBowled > 0
            ? (
                b.runsConceded *
                6
            ) /
            b.ballsBowled
            : 0;


    const pointsA =
        a.runs +
        (
            a.wickets *
            20
        );


    const pointsB =
        b.runs +
        (
            b.wickets *
            20
        );


    let winner = "Tie";


    if (pointsA > pointsB) {
        winner = player1;
    }
    else if (pointsB > pointsA) {
        winner = player2;
    }


    const result =
        document.getElementById(
            "comparisonResult"
        );


    if (!result) {
        return;
    }


    result.innerHTML = `

        <div class="compare-card">

            <div class="compare-grid">

                <div class="compare-player">

                    <img src="${a.photo}">

                    <h2>
                        ${escapeHTML(player1)}
                    </h2>

                    <div class="compare-stat">
                        🏏 Runs: ${a.runs}
                    </div>

                    <div class="compare-stat">
                        🎯 Wickets: ${a.wickets}
                    </div>

                    <div class="compare-stat">
                        💥 Sixes: ${a.sixes}
                    </div>

                    <div class="compare-stat">
                        ⚡ SR: ${avgSR1.toFixed(1)}
                    </div>

                    <div class="compare-stat">
                        🛡 ECO: ${eco1.toFixed(2)}
                    </div>

                </div>


                <div class="compare-player">

                    <img src="${b.photo}">

                    <h2>
                        ${escapeHTML(player2)}
                    </h2>

                    <div class="compare-stat">
                        🏏 Runs: ${b.runs}
                    </div>

                    <div class="compare-stat">
                        🎯 Wickets: ${b.wickets}
                    </div>

                    <div class="compare-stat">
                        💥 Sixes: ${b.sixes}
                    </div>

                    <div class="compare-stat">
                        ⚡ SR: ${avgSR2.toFixed(1)}
                    </div>

                    <div class="compare-stat">
                        🛡 ECO: ${eco2.toFixed(2)}
                    </div>

                </div>

            </div>


            <div class="winner-box">

                🏆 Head-to-Head Winner:
                ${escapeHTML(winner)}

            </div>


            <div class="lead-box">

                <h3>
                    📊 Lead Analysis
                </h3>

                <p>
                    🏏 ${escapeHTML(runLeader)}
                    leads by
                    <b>${runLead} Runs</b>
                </p>

                <p>
                    🎯 ${escapeHTML(wicketLeader)}
                    leads by
                    <b>${wicketLead} Wickets</b>
                </p>

            </div>

        </div>

    `;

}


/* =========================================================
   RECENT FORM
   ========================================================= */

function generateRecentForm() {

    const container =
        document.getElementById("recentFormContainer");

    if (!container) {
        console.error(
            "recentFormContainer not found"
        );
        return;
    }

    container.innerHTML = "";


    /*
    =========================================
    GET UNIQUE PLAYERS
    =========================================
    */

    const playerNames = [
        ...new Set(
            players
                .map(function(player) {
                    return String(
                        player.name || ""
                    ).trim();
                })
                .filter(Boolean)
        )
    ];


    let html =
        '<div class="recent-form-grid">';


    /*
    =========================================
    CREATE RECENT FORM FOR EACH PLAYER
    =========================================
    */

    playerNames.forEach(function(name) {

        /*
        Get all matches played by this player
        */

        const playerMatches =
            players
                .filter(function(player) {

                    return (
                        String(
                            player.name || ""
                        ).trim() === name
                    );

                })
                .slice();


        /*
        =========================================
        SORT BY MATCH NUMBER
        NEWEST MATCH FIRST
        =========================================
        */

        playerMatches.sort(
            function(a, b) {

                function getMatchNumber(player) {

                    const raw =
                        String(
                            player.matchNo || ""
                        ).trim();

                    /*
                    Extract numbers.

                    MM0015 -> 0015
                    M15    -> 15
                    15     -> 15
                    */

                    const match =
                        raw.match(/\d+/);

                    if (match) {

                        return Number(
                            match[0]
                        ) || 0;

                    }

                    return 0;
                }


                return (
                    getMatchNumber(b) -
                    getMatchNumber(a)
                );

            }
        );


        /*
        =========================================
        TAKE LAST 5 PLAYED MATCHES
        AFTER SORTING NEWEST -> OLDEST
        =========================================
        */

        const recentMatches =
            playerMatches.slice(0, 5);


        /*
        =========================================
        TOTAL FOR LAST 5
        =========================================
        */

        let totalRuns = 0;


        recentMatches.forEach(
            function(match) {

                totalRuns +=
                    Number(match.runs) || 0;

            }
        );


        const average =
            recentMatches.length > 0
                ? (
                    totalRuns /
                    recentMatches.length
                ).toFixed(1)
                : "0";


        /*
        =========================================
        PLAYER PHOTO
        =========================================
        */

        const photo =
            playerPhotos[name] || "";


        /*
        =========================================
        PLAYER CARD
        =========================================
        */

        html += `

            <div class="form-card">

                <img
                    src="${photo}"
                    alt="${name}"
                >

                <h2>
                    ${name}
                </h2>


                <div class="form-scores">
        `;


        /*
        =========================================
        DISPLAY LAST 5 MATCHES
        =========================================
        */

        recentMatches.forEach(
            function(match) {

                const runs =
                    Number(match.runs) || 0;


                /*
                Determine colour/class
                */

                let className =
                    "form-poor";


                if (runs >= 40) {

                    className =
                        "form-good";

                }
                else if (runs >= 20) {

                    className =
                        "form-average";

                }


                /*
                =================================
                FORMAT MATCH NUMBER
                =================================

                MM0015 -> M15
                MM0014 -> M14
                MM0013 -> M13

                */

                const rawMatchNo =
                    String(
                        match.matchNo || ""
                    ).trim();


                const numberMatch =
                    rawMatchNo.match(/\d+/);


                let displayMatch =
                    rawMatchNo;


                if (numberMatch) {

                    displayMatch =
                        "M" +
                        Number(
                            numberMatch[0]
                        );

                }


                /*
                =================================
                SCORE BOX
                =================================
                */

                html += `

                    <div class="score-wrapper">

                        <div
                            class="score-box ${className}"
                        >
                            ${runs}
                        </div>

                        <small>
                            ${displayMatch}
                        </small>

                    </div>

                `;

            }
        );


        html += `

                </div>


                <div class="avg-box">

                    <h3>
                        Average
                        (Last 5 Matches)
                    </h3>

                    <p>
                        ${average}
                    </p>

                </div>

            </div>

        `;

    });


    html += `
        </div>
    `;


    /*
    =========================================
    DISPLAY
    =========================================
    */

    container.innerHTML =
        html;


    console.log(
        "Recent Form updated successfully"
    );

}


/* =========================================================
   HALL OF FAME
   ========================================================= */

function generateHallOfFame() {

    if (!players || players.length === 0) {
        return;
    }

    /*
    =========================================
    HIGHEST SCORE
    =========================================
    */

    const highestScoreValue =
        Math.max(
            ...players.map(function(player) {
                return num(player.runs);
            })
        );

    const highestScorePlayers =
        players.filter(function(player) {
            return num(player.runs) === highestScoreValue;
        });


    /*
    =========================================
    BEST BOWLING
    =========================================
    */

    const highestWicketsValue =
        Math.max(
            ...players.map(function(player) {
                return num(player.wickets);
            })
        );

    const bestBowlingPlayers =
        players.filter(function(player) {
            return num(player.wickets) === highestWicketsValue;
        });


    /*
    =========================================
    MOST SIXES
    =========================================
    */

    const highestSixesValue =
        Math.max(
            ...players.map(function(player) {
                return num(player.sixes);
            })
        );

    const mostSixesPlayers =
        players.filter(function(player) {
            return num(player.sixes) === highestSixesValue;
        });


    /*
    =========================================
    FASTEST FIFTY
    =========================================
    */

    const fiftyPlayers =
        players.filter(function(player) {

            return (
                num(player.runs) >= 50 &&
                num(player.ballsFaced) > 0
            );

        });


    let fastestFiftyPlayers = [];

    if (fiftyPlayers.length > 0) {

        const fastestBalls =
            Math.min(
                ...fiftyPlayers.map(function(player) {
                    return num(player.ballsFaced);
                })
            );

        fastestFiftyPlayers =
            fiftyPlayers.filter(function(player) {

                return (
                    num(player.ballsFaced) ===
                    fastestBalls
                );

            });

    }


    /*
    =========================================
    MOST DUCKS
    =========================================
    */

    const totals =
        getPlayerTotals();

    const highestDucks =
        totals.length
            ? Math.max(
                ...totals.map(function(player) {
                    return num(player.ducks);
                })
            )
            : 0;

    const mostDuckPlayers =
        totals.filter(function(player) {

            return (
                num(player.ducks) ===
                highestDucks
            );

        });


    /*
    =========================================
    HELPER
    =========================================
    */

    function playerNames(playersList) {

        return playersList
            .map(function(player) {
                return player.name;
            })
            .filter(function(name, index, array) {
                return array.indexOf(name) === index;
            })
            .join(" & ");

    }


    /*
    =========================================
    DISPLAY HALL OF FAME
    =========================================
    */

    const highestScoreElement =
        document.getElementById("highestScore");

    if (highestScoreElement) {

        highestScoreElement.innerHTML =
            highestScoreValue +
            " Runs<br>" +
            playerNames(highestScorePlayers);

    }


    const bestBowlingElement =
        document.getElementById("bestBowling");

    if (bestBowlingElement) {

        bestBowlingElement.innerHTML =
            highestWicketsValue +
            " Wickets<br>" +
            playerNames(bestBowlingPlayers);

    }


    const mostSixesElement =
        document.getElementById("mostSixesMatch");

    if (mostSixesElement) {

        mostSixesElement.innerHTML =
            highestSixesValue +
            " Sixes<br>" +
            playerNames(mostSixesPlayers);

    }


    const fastestFiftyElement =
        document.getElementById("fastestFifty");

    if (fastestFiftyElement) {

        if (fastestFiftyPlayers.length > 0) {

            fastestFiftyElement.innerHTML =
                num(
                    fastestFiftyPlayers[0].ballsFaced
                ) +
                " Balls<br>" +
                playerNames(
                    fastestFiftyPlayers
                );

        }
        else {

            fastestFiftyElement.innerHTML =
                "No Fifty Yet";

        }

    }


    /*
    =========================================
    MOST DUCKS
    =========================================
    */

    const mostDucksElement =
        document.getElementById("mostDucks");

    if (mostDucksElement) {

        if (highestDucks > 0) {

            mostDucksElement.innerHTML =
                highestDucks +
                " Ducks<br>" +
                playerNames(mostDuckPlayers);

        }
        else {

            mostDucksElement.innerHTML =
                "No Ducks Yet";

        }

    }

}


/* =========================================================
   WIN PERCENTAGE
   ========================================================= */

function generateWinPercentage() {

    const playersMap = {};


    players.forEach(
        function(player) {

            const name =
                player.name;


            if (!playersMap[name]) {

                playersMap[name] = {

                    matches: 0,
                    wins: 0,

                    photo:
                        playerPhotos[name] || ""

                };

            }


            playersMap[name].matches++;

        }
    );


    const matchGroups = {};


    players.forEach(
        function(player) {

            if (
                !matchGroups[player.matchNo]
            ) {

                matchGroups[player.matchNo] =
                    [];

            }


            matchGroups[player.matchNo]
                .push(player);

        }
    );


    Object.values(matchGroups)
        .forEach(function(match) {

            if (!match.length) {
                return;
            }


            const highestRuns =
                Math.max.apply(
                    null,
                    match.map(function(player) {
                        return num(player.runs);
                    })
                );


            const winners =
                match.filter(
                    function(player) {

                        return (
                            num(player.runs) ===
                            highestRuns
                        );

                    }
                );


            winners.forEach(
                function(winner) {

                    if (
                        playersMap[winner.name]
                    ) {

                        playersMap[
                            winner.name
                        ].wins++;

                    }

                }
            );

        });


    let html =
        '<div class="win-grid">';


    Object.keys(playersMap)
        .forEach(function(name) {

            const data =
                playersMap[name];


            const winPercent =
                data.matches > 0
                    ? (
                        data.wins /
                        data.matches *
                        100
                    ).toFixed(1)
                    : "0.0";


            let glowClass = "";


            if (name === "Sanjay") {
                glowClass =
                    "sanjay-glow";
            }
            else if (name === "Karthick") {
                glowClass =
                    "karthick-glow";
            }
            else if (name === "Pranesh") {
                glowClass =
                    "pranesh-glow";
            }


            html += `

                <div
                    class="win-card ${glowClass}"
                >

                    <img src="${data.photo}">

                    <h2>
                        ${escapeHTML(name)}
                    </h2>

                    <div class="win-percent">
                        ${winPercent}%
                    </div>

                    <p>
                        Wins: ${data.wins}
                    </p>

                    <p>
                        Matches:
                        ${data.matches}
                    </p>

                </div>

            `;

        });


    html +=
        "</div>";


    setHTML(
        "winPercentageContainer",
        html
    );

}


/* =========================================================
   AWARD HISTORY
   ========================================================= */
function generateAwardHistory() {

    const matches = {};

    /* ================================
       GROUP DATA BY MATCH
    ================================= */

    players.forEach(function(player) {

        const matchNo =
            String(player.matchNo || "").trim();

        if (!matchNo) return;

        if (!matches[matchNo]) {
            matches[matchNo] = [];
        }

        matches[matchNo].push(player);

    });


    let html = "";


    /* ================================
       SORT MATCHES
    ================================= */

    Object.keys(matches)
        .sort(function(a, b) {

            const numA =
                parseInt(
                    String(a).replace(/\D/g, ""),
                    10
                ) || 0;

            const numB =
                parseInt(
                    String(b).replace(/\D/g, ""),
                    10
                ) || 0;

            return numB - numA;

        })
        .forEach(function(matchNo) {

            const matchPlayers =
                matches[matchNo];


            if (!matchPlayers.length) {
                return;
            }


            /* ================================
               HIGHEST RUNS
            ================================= */

            let highestRuns = 0;

            matchPlayers.forEach(function(player) {

                const runs =
                    Number(player.runs) || 0;

                if (runs > highestRuns) {
                    highestRuns = runs;
                }

            });


            /* ================================
               ALL BEST BATSMEN
            ================================= */

            const bestBatsmen = [];

            matchPlayers.forEach(function(player) {

                const runs =
                    Number(player.runs) || 0;

                if (runs === highestRuns) {

                    const name =
                        String(
                            player.name || ""
                        ).trim();

                    if (
                        name &&
                        !bestBatsmen.includes(name)
                    ) {
                        bestBatsmen.push(name);
                    }

                }

            });


            /* ================================
               HIGHEST WICKETS
            ================================= */

            let highestWickets = 0;

            matchPlayers.forEach(function(player) {

                const wickets =
                    Number(player.wickets) || 0;

                if (wickets > highestWickets) {
                    highestWickets = wickets;
                }

            });


            /* ================================
               ALL BEST BOWLERS
            ================================= */

            const bestBowlers = [];

            matchPlayers.forEach(function(player) {

                const wickets =
                    Number(player.wickets) || 0;

                if (wickets === highestWickets) {

                    const name =
                        String(
                            player.name || ""
                        ).trim();

                    if (
                        name &&
                        !bestBowlers.includes(name)
                    ) {
                        bestBowlers.push(name);
                    }

                }

            });


            /* ================================
               DATE
            ================================= */

            const matchDate =
                String(
                    matchPlayers[0].date || "-"
                ).trim();


            /* ================================
               BATSMEN DISPLAY
            ================================= */

            let batsmanDisplay = "";

            bestBatsmen.forEach(function(name) {

                batsmanDisplay += `
                    <span class="award-holder">
                        ${name}
                    </span>
                `;

            });


            /* ================================
               BOWLERS DISPLAY
            ================================= */

            let bowlerDisplay = "";

            bestBowlers.forEach(function(name) {

                bowlerDisplay += `
                    <span class="award-holder">
                        ${name}
                    </span>
                `;

            });


            /* ================================
               CREATE AWARD CARD
            ================================= */

            html += `

                <div class="award-card">

                    <h3>
                        🏏 Match ${matchNo}
                    </h3>

                    <p>
                        📅 ${matchDate}
                    </p>


                    <div class="award-row">


                        <!-- BEST BATSMAN -->

                        <div class="award-box">

                            <h4>
                                🔥 Best Batsman
                            </h4>

                            <div class="award-names">
                                ${batsmanDisplay}
                            </div>

                            <p>
                                <strong>
                                    ${highestRuns} Runs
                                </strong>
                            </p>

                        </div>


                        <!-- BEST BOWLER -->

                        <div class="award-box">

                            <h4>
                                🎯 Best Bowler
                            </h4>

                            <div class="award-names">
                                ${bowlerDisplay}
                            </div>

                            <p>
                                <strong>
                                    ${highestWickets} Wickets
                                </strong>
                            </p>

                        </div>


                    </div>

                </div>

            `;

        });


    /* ================================
       SHOW AWARDS
    ================================= */

    const awardHistory =
        document.getElementById(
            "awardHistory"
        );

    if (awardHistory) {

        awardHistory.innerHTML =
            html;

    }


    console.log(
        "Award history generated:",
        matches
    );

}


/* =========================================================
   BEST BATSMAN HISTORY
   ========================================================= */
function showBestBatsmanHistory() {

    const totals = {};

    // Calculate TOTAL runs for every player
    players.forEach(function(player) {

        const name = String(player.name || "").trim();

        if (!name) return;

        if (!totals[name]) {
            totals[name] = 0;
        }

        totals[name] += Number(player.runs) || 0;
    });


    const entries = Object.entries(totals);

    if (!entries.length) return;


    // Find highest TOTAL tournament runs
    const highestRuns = Math.max.apply(
        null,
        entries.map(function(entry) {
            return entry[1];
        })
    );


    // Get ALL players having the same total
    const bestBatsmen = entries.filter(function(entry) {

        return entry[1] === highestRuns;

    });


    const names = bestBatsmen.map(function(entry) {

        return entry[0];

    });


    const html = `

        <div class="award-history-card">

            <h3>🏏 Tournament Best Batsman</h3>

            <p>
                🔥 <strong>${names.join(" & ")}</strong>
            </p>

            <p>
                🏏 <strong>${highestRuns} Total Runs</strong>
            </p>

        </div>

    `;


    const container =
        document.getElementById("awardHistory");

    if (container) {
        container.innerHTML = html;
    }

}
/* =========================================================
   BEST BOWLER HISTORY
   ========================================================= */

function showBestBowlerHistory() {

    const totals = {};

    // Calculate TOTAL wickets for every player
    players.forEach(function(player) {

        const name = String(player.name || "").trim();

        if (!name) return;

        if (!totals[name]) {
            totals[name] = 0;
        }

        totals[name] += Number(player.wickets) || 0;
    });


    const entries = Object.entries(totals);

    if (!entries.length) return;


    // Find highest TOTAL wickets
    const highestWickets = Math.max.apply(
        null,
        entries.map(function(entry) {
            return entry[1];
        })
    );


    // Get ALL players having the same total
    const bestBowlers = entries.filter(function(entry) {

        return entry[1] === highestWickets;

    });


    const names = bestBowlers.map(function(entry) {

        return entry[0];

    });


    const html = `

        <div class="award-history-card">

            <h3>🎯 Tournament Best Bowler</h3>

            <p>
                🎯 <strong>${names.join(" & ")}</strong>
            </p>

            <p>
                🏆 <strong>${highestWickets} Total Wickets</strong>
            </p>

        </div>

    `;


    const container =
        document.getElementById("awardHistory");

    if (container) {
        container.innerHTML = html;
    }

}
/* =========================================================
   CLOSE PLAYER MODAL
   ========================================================= */

function closeModal() {

    const modal =
        document.getElementById(
            "playerModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


/* =========================================================
   DOWNLOAD PLAYER CARD
   ========================================================= */
function downloadPlayerCard() {

    const card =
        document.getElementById("downloadCard");

    if (!card) {
        console.error("downloadCard not found");
        alert("Player card not found");
        return;
    }


    /*
    =========================================
    SET DATE + TIME BEFORE CAPTURE
    =========================================
    */

    const dateTime =
        document.getElementById(
            "downloadDateTime"
        );

    const now = new Date();

    const formattedDateTime =
        now.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }) +
        " | " +
        now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });


    if (dateTime) {

        dateTime.textContent =
            formattedDateTime;

        /*
        Make sure html2canvas sees it
        */

        dateTime.style.display =
            "inline";

        dateTime.style.visibility =
            "visible";

        dateTime.style.opacity =
            "1";

    }


    /*
    =========================================
    WAIT FOR DOM TO UPDATE
    =========================================
    */

    setTimeout(function() {

        html2canvas(card, {

            scale: 2,

            useCORS: true,

            allowTaint: false,

            backgroundColor: "#111827",

            logging: false,

            windowWidth:
                card.scrollWidth,

            windowHeight:
                card.scrollHeight

        }).then(function(canvas) {


            /*
            =================================
            DOWNLOAD IMAGE
            =================================
            */

            const playerName =
                document.getElementById(
                    "modalName"
                )?.textContent.trim() ||
                "Player";


            const link =
                document.createElement("a");


            link.download =
                playerName +
                "_PlayerCard.png";


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);


        }).catch(function(error) {

            console.error(
                "Player card download error:",
                error
            );

            alert(
                "Unable to download player card."
            );

        });

    }, 200);

}


/* =========================================================
   FIREWORKS
   ========================================================= */

function showFireworks(color) {

    const centerX =
        window.innerWidth / 2;


    const centerY =
        window.innerHeight / 2;


    for (
        let i = 0;
        i < 40;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "firework-particle";


        particle.style.background =
            color;


        const angle =
            (
                Math.PI *
                2 *
                i
            ) / 40;


        const distance =
            150 +
            Math.random() * 100;


        particle.style.left =
            centerX + "px";


        particle.style.top =
            centerY + "px";


        particle.style.setProperty(
            "--x",
            Math.cos(angle) *
            distance +
            "px"
        );


        particle.style.setProperty(
            "--y",
            Math.sin(angle) *
            distance +
            "px"
        );


        document.body.appendChild(
            particle
        );


        setTimeout(
            function() {

                particle.remove();

            },
            2000
        );

    }

}


/* =========================================================
   LOGO HIT ANIMATION
   ========================================================= */

function logoHit() {

    const ball =
        document.getElementById(
            "ball"
        );


    const sound =
        document.getElementById(
            "hitSound"
        );


    if (!ball) {
        return;
    }


    ball.classList.remove(
        "ballFly"
    );


    void ball.offsetWidth;


    if (sound) {

        sound.currentTime = 0;


        const promise =
            sound.play();


        if (
            promise &&
            typeof promise.catch ===
            "function"
        ) {

            promise.catch(
                function() {}
            );

        }

    }


    ball.style.display =
        "block";


    ball.classList.add(
        "ballFly"
    );


    setTimeout(
        function() {

            ball.style.display =
                "none";

        },
        3000
    );

}


function updateTrophyCabinet() {


const orangeWins = {};
const purpleWins = {};
const sixerWins = {};


// ==========================================
// GET DATE
// ==========================================

function getDateKey(player) {

    const rawDate =
        player.matchDate ||
        player.date ||
        player.Date ||
        player.MatchDate;

    if (!rawDate) {
        return null;
    }

    const date = new Date(rawDate);

    if (!isNaN(date.getTime())) {

        return date
            .toISOString()
            .split("T")[0];

    }

    return String(rawDate).trim();
}


// ==========================================
// GET UNIQUE DATES
// ==========================================

const dates = [
    ...new Set(
        players
            .map(function(player) {
                return getDateKey(player);
            })
            .filter(function(date) {
                return date;
            })
    )
];


// ==========================================
// CALCULATE DAILY TROPHIES
// ==========================================

dates.forEach(function(date) {

    const dayTotals = {};


    players.forEach(function(player) {

        if (getDateKey(player) !== date) {
            return;
        }

        const name =
            String(player.name || "").trim();

        if (!name) {
            return;
        }


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


    const names =
        Object.keys(dayTotals);


    if (names.length === 0) {
        return;
    }


    // ======================================
    // ORANGE CAP
    // ======================================

    const highestRuns =
        Math.max(
            ...names.map(function(name) {
                return dayTotals[name].runs;
            })
        );


    if (highestRuns > 0) {

        names
            .filter(function(name) {

                return (
                    dayTotals[name].runs ===
                    highestRuns
                );

            })
            .forEach(function(name) {

                orangeWins[name] =
                    (orangeWins[name] || 0) + 1;

            });

    }


    // ======================================
    // PURPLE CAP
    // ======================================

    const highestWickets =
        Math.max(
            ...names.map(function(name) {

                return dayTotals[name].wickets;

            })
        );


    if (highestWickets > 0) {

        names
            .filter(function(name) {

                return (
                    dayTotals[name].wickets ===
                    highestWickets
                );

            })
            .forEach(function(name) {

                purpleWins[name] =
                    (purpleWins[name] || 0) + 1;

            });

    }


    // ======================================
    // SIXER KING
    // ======================================

    const highestSixes =
        Math.max(
            ...names.map(function(name) {

                return dayTotals[name].sixes;

            })
        );


    if (highestSixes > 0) {

        names
            .filter(function(name) {

                return (
                    dayTotals[name].sixes ===
                    highestSixes
                );

            })
            .forEach(function(name) {

                sixerWins[name] =
                    (sixerWins[name] || 0) + 1;

            });

    }

});


// ==========================================
// GET ALL PLAYERS
// ==========================================

const allPlayers = [
    ...new Set(
        players
            .map(function(player) {

                return String(
                    player.name || ""
                ).trim();

            })
            .filter(function(name) {
                return name;
            })
    )
];


// ==========================================
// SORT PLAYERS
// ==========================================

allPlayers.sort(function(a, b) {

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


// ==========================================
// CREATE TABLE
// ==========================================

let html = "";


allPlayers.forEach(function(name) {

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


// ==========================================
// DISPLAY
// ==========================================

const table =
    document.getElementById(
        "trophyTableBody"
    );


if (table) {

    table.innerHTML = html;

}

}


/* =========================================================
   START WEBSITE
   ========================================================= */

loadPlayers();



function showDatePerformance() {

    const selectedDate =
        document.getElementById("dateSelector").value;

    if (!selectedDate) return;

    const datePlayers =
        players.filter(
            p => p.date === selectedDate
        );

    let html =
    '<div class="date-player-grid">';

    datePlayers.forEach(player => {

        const photo =
            playerPhotos[player.name] || "";

        html += `

        <div class="date-player-card">

            <img src="${photo}"
                 class="date-player-img">

            <h3>${player.name}</h3>

            <p>🏏 Runs: ${player.runs}</p>

            <p>🎯 Wickets: ${player.wickets}</p>

        </div>

        `;

    });

    html += '</div>';

    document.getElementById(
        "datePerformanceContainer"
    ).innerHTML = html;

}
