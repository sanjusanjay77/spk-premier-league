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

            generateAwardHistory,

            updateTrophyCabinet

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

```
const tableBody =
    document.getElementById("leaderboardBody");

if (!tableBody) {
    console.warn("leaderboardBody element not found");
    return;
}

let html = "";

players.forEach(function(player) {

    const runs =
        Number(player.runs) || 0;

    const ballsFaced =
        Number(player.ballsFaced) || 0;

    const fours =
        Number(player.fours) || 0;

    const sixes =
        Number(player.sixes) || 0;

    const wickets =
        Number(player.wickets) || 0;

    const runsConceded =
        Number(player.runsConceded) || 0;

    const ballsBowled =
        Number(player.ballsBowled) || 0;

    const sixesGiven =
        Number(player.sixesGiven) || 0;

    const strikeRate =
        ballsFaced > 0
            ? ((runs / ballsFaced) * 100).toFixed(1)
            : "-";

    const economy =
        ballsBowled > 0
            ? ((runsConceded * 6) / ballsBowled).toFixed(2)
            : "-";

    html += `
        <tr>

            <td>
                ${player.matchNo || "-"}
            </td>

            <td>
                ${player.date || "-"}
            </td>

            <td
                onclick="openPlayer('${player.name.replace(/'/g, "\\'")}')"
                style="
                    cursor:pointer;
                    color:#00D4FF;
                    font-weight:bold;
                "
            >
                ${player.name}
            </td>

            <td>
                ${runs}
            </td>

            <td>
                ${ballsFaced}
            </td>

            <td>
                ${sixes}
            </td>

            <td>
                ${fours}
            </td>

            <td>
                ${strikeRate}
            </td>

            <td>
                ${wickets}
            </td>

            <td>
                ${runsConceded}
            </td>

            <td>
                ${ballsBowled}
            </td>

            <td>
                ${sixesGiven}
            </td>

            <td>
                ${economy}
            </td>

        </tr>
    `;
});

tableBody.innerHTML = html;
```

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

    const totals =
        getPlayerTotals();


    if (!totals.length) {
        return;
    }


    totals.forEach(function(player) {

        player.strikeRate =
            player.ballsFaced > 0
                ? (
                    player.runs /
                    player.ballsFaced
                ) * 100
                : 0;


        player.economy =
            player.ballsBowled > 0
                ? (
                    player.runsConceded * 6
                ) /
                player.ballsBowled
                : null;

    });


    /* =========================================
       FIND MAXIMUM
       ========================================= */

    const highestRuns =
        Math.max.apply(
            null,
            totals.map(function(p) {
                return p.runs;
            })
        );


    const highestWickets =
        Math.max.apply(
            null,
            totals.map(function(p) {
                return p.wickets;
            })
        );


    const highestSixes =
        Math.max.apply(
            null,
            totals.map(function(p) {
                return p.sixes;
            })
        );


    const highestFours =
        Math.max.apply(
            null,
            totals.map(function(p) {
                return p.fours;
            })
        );


    const highestSR =
        Math.max.apply(
            null,
            totals.map(function(p) {
                return p.strikeRate;
            })
        );


    const bowlingPlayers =
        totals.filter(function(p) {
            return p.ballsBowled > 0;
        });


    const bestEconomy =
        bowlingPlayers.length
            ? Math.min.apply(
                null,
                bowlingPlayers.map(
                    function(p) {
                        return p.economy;
                    }
                )
            )
            : null;


    /* =========================================
       GET ALL TIED PLAYERS
       ========================================= */

    const mostRuns =
        totals.filter(function(p) {
            return p.runs === highestRuns;
        });


    const mostWickets =
        totals.filter(function(p) {
            return p.wickets === highestWickets;
        });


    const mostSixes =
        totals.filter(function(p) {
            return p.sixes === highestSixes;
        });


    const mostFours =
        totals.filter(function(p) {
            return p.fours === highestFours;
        });


    const highestStrikeRate =
        totals.filter(function(p) {
            return p.strikeRate === highestSR;
        });


    const bestEconomyPlayers =
        bowlingPlayers.filter(function(p) {
            return p.economy === bestEconomy;
        });


    /* =========================================
       SAVE CAP HOLDERS
       ========================================= */

    orangeCapPlayer =
        mostRuns
            .map(function(p) {
                return p.name;
            })
            .join(" & ");


    purpleCapPlayer =
        mostWickets
            .map(function(p) {
                return p.name;
            })
            .join(" & ");


    /* =========================================
       DISPLAY RECORDS
       ========================================= */

    setHTML(
        "mostRuns",
        mostRuns
            .map(function(p) {
                return p.name;
            })
            .join(" & ") +
        "<br>" +
        highestRuns
    );


    setHTML(
        "mostWickets",
        mostWickets
            .map(function(p) {
                return p.name;
            })
            .join(" & ") +
        "<br>" +
        highestWickets
    );


    setHTML(
        "mostSixes",
        mostSixes
            .map(function(p) {
                return p.name;
            })
            .join(" & ") +
        "<br>" +
        highestSixes
    );


    setHTML(
        "mostFours",
        mostFours
            .map(function(p) {
                return p.name;
            })
            .join(" & ") +
        "<br>" +
        highestFours
    );


    setHTML(
        "highestSR",
        highestStrikeRate
            .map(function(p) {
                return p.name;
            })
            .join(" & ") +
        "<br>" +
        highestSR.toFixed(1)
    );


    if (bestEconomyPlayers.length) {

        setHTML(
            "bestEconomy",
            bestEconomyPlayers
                .map(function(p) {
                    return p.name;
                })
                .join(" & ") +
            "<br>" +
            bestEconomy.toFixed(2)
        );

    }
    else {

        setHTML(
            "bestEconomy",
            "-"
        );

    }

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

const totals = {};

// Calculate tournament totals
players.forEach(function(player) {

    const name = String(player.name || "").trim();

    if (!name) {
        return;
    }

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

const allPlayers = Object.entries(totals);

if (allPlayers.length === 0) {
    return;
}


// ==========================================
// ORANGE CAP - HIGHEST RUNS
// ==========================================

const highestRuns = Math.max(
    ...allPlayers.map(function(entry) {
        return entry[1].runs;
    })
);

const orangeHolders = allPlayers.filter(function(entry) {
    return entry[1].runs === highestRuns;
});


// ==========================================
// PURPLE CAP - HIGHEST WICKETS
// ==========================================

const highestWickets = Math.max(
    ...allPlayers.map(function(entry) {
        return entry[1].wickets;
    })
);

const purpleHolders = allPlayers.filter(function(entry) {
    return entry[1].wickets === highestWickets;
});


// ==========================================
// ORANGE CAP ELEMENTS
// ==========================================

const orangePhoto = document.getElementById("orangeCapPhoto");
const orangeName = document.getElementById("orangeCapName");
const orangeRuns = document.getElementById("orangeCapRuns");


// Create holder photos
if (orangePhoto) {

    if (orangeHolders.length === 1) {

        orangePhoto.src = orangeHolders[0][1].photo;
        orangePhoto.style.display = "block";

    } else {

        orangePhoto.style.display = "none";
    }
}


// Names
if (orangeName) {

    orangeName.innerHTML = orangeHolders
        .map(function(entry) {
            return entry[0];
        })
        .join(" & ");

}


// Runs
if (orangeRuns) {

    orangeRuns.textContent =
        highestRuns + " Runs";

}


// ==========================================
// CREATE MULTIPLE ORANGE CAP PHOTOS
// ==========================================

let orangePhotoContainer =
    document.getElementById("orangeCapPhotoContainer");

if (!orangePhotoContainer) {

    orangePhotoContainer =
        document.createElement("div");

    orangePhotoContainer.id =
        "orangeCapPhotoContainer";

    orangePhotoContainer.className =
        "cap-photo-container";

    if (orangePhoto) {
        orangePhoto.parentNode.insertBefore(
            orangePhotoContainer,
            orangePhoto
        );
    }

}

orangePhotoContainer.innerHTML = "";

orangeHolders.forEach(function(entry) {

    const name = entry[0];
    const photo = entry[1].photo;

    const holder = document.createElement("div");

    holder.className = "cap-holder";

    holder.innerHTML = `
        <img
            src="${photo}"
            class="cap-holder-photo"
            alt="${name}"
        >

        <div class="cap-holder-name">
            ${name}
        </div>
    `;

    orangePhotoContainer.appendChild(holder);

});


// Hide original image because container handles photos
if (orangePhoto) {
    orangePhoto.style.display = "none";
}


// ==========================================
// PURPLE CAP ELEMENTS
// ==========================================

const purplePhoto =
    document.getElementById("purpleCapPhoto");

const purpleName =
    document.getElementById("purpleCapName");

const purpleWickets =
    document.getElementById("purpleCapWickets");


if (purplePhoto) {

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


if (purpleName) {

    purpleName.innerHTML =
        purpleHolders
            .map(function(entry) {
                return entry[0];
            })
            .join(" & ");

}


if (purpleWickets) {

    purpleWickets.textContent =
        highestWickets + " Wickets";

}


// ==========================================
// CREATE MULTIPLE PURPLE CAP PHOTOS
// ==========================================

let purplePhotoContainer =
    document.getElementById(
        "purpleCapPhotoContainer"
    );

if (!purplePhotoContainer) {

    purplePhotoContainer =
        document.createElement("div");

    purplePhotoContainer.id =
        "purpleCapPhotoContainer";

    purplePhotoContainer.className =
        "cap-photo-container";

    if (purplePhoto) {

        purplePhoto.parentNode.insertBefore(
            purplePhotoContainer,
            purplePhoto
        );

    }

}

purplePhotoContainer.innerHTML = "";


purpleHolders.forEach(function(entry) {

    const name = entry[0];
    const photo = entry[1].photo;

    const holder =
        document.createElement("div");

    holder.className =
        "cap-holder";

    holder.innerHTML = `
        <img
            src="${photo}"
            class="cap-holder-photo"
            alt="${name}"
        >

        <div class="cap-holder-name">
            ${name}
        </div>
    `;

    purplePhotoContainer.appendChild(holder);

});


// Hide original image
if (purplePhoto) {
    purplePhoto.style.display = "none";
}


// ==========================================
// SAVE CAP HOLDERS
// ==========================================

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


/* =========================================================
   PLAYER POPUP
   ========================================================= */

function openPlayer(name) {

    const records =
        players.filter(function(player) {

            return player.name === name;

        });


    if (!records.length) {
        return;
    }


    let totalRuns = 0;
    let totalWickets = 0;
    let totalSixes = 0;
    let totalFours = 0;

    let totalBallsFaced = 0;
    let totalBallsBowled = 0;

    let totalRunsConceded = 0;
    let totalSixesGiven = 0;


    records.forEach(function(record) {

        totalRuns +=
            num(record.runs);

        totalWickets +=
            num(record.wickets);

        totalSixes +=
            num(record.sixes);

        totalFours +=
            num(record.fours);

        totalBallsFaced +=
            num(record.ballsFaced);

        totalBallsBowled +=
            num(record.ballsBowled);

        totalRunsConceded +=
            num(record.runsConceded);

        totalSixesGiven +=
            num(record.sixesGiven);

    });


    const strikeRate =
        totalBallsFaced > 0
            ? (
                totalRuns /
                totalBallsFaced
            ) * 100
            : 0;


    const economy =
        totalBallsBowled > 0
            ? (
                totalRunsConceded * 6
            ) /
            totalBallsBowled
            : 0;


    setText(
        "modalName",
        name
    );

    setText(
        "modalRuns",
        totalRuns
    );

    setText(
        "modalWickets",
        totalWickets
    );

    setText(
        "modalFours",
        totalFours
    );

    setText(
        "modalSixes",
        totalSixes
    );

    setText(
        "modalSR",
        strikeRate.toFixed(1)
    );

    setText(
        "modalEconomy",
        economy.toFixed(2)
    );

    setText(
        "modalBallsFaced",
        totalBallsFaced
    );

    setText(
        "modalBallsBowled",
        totalBallsBowled
    );

    setText(
        "modalSixesGiven",
        totalSixesGiven
    );

    setText(
        "modalMatches",
        records.length
    );


    const modalImg =
        document.getElementById(
            "modalImg"
        );


    if (modalImg) {

        modalImg.src =
            playerPhotos[name] || "";

    }


    /* =========================================
       CAP HOLDER FIREWORKS
       Supports tied players
       ========================================= */

    const orangeHolders =
        orangeCapPlayer
            .split(" & ")
            .map(function(value) {
                return value.trim();
            });


    const purpleHolders =
        purpleCapPlayer
            .split(" & ")
            .map(function(value) {
                return value.trim();
            });


    if (
        orangeHolders.includes(name)
    ) {

        showFireworks("#ff9800");

        playFireworkSound();

    }


    if (
        purpleHolders.includes(name)
    ) {

        showFireworks("#9c27b0");

        playFireworkSound();

    }


    const modal =
        document.getElementById(
            "playerModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }


    setText(
        "downloadDateTime",
        new Date().toLocaleString(
            "en-IN"
        )
    );

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
        document.getElementById(
            "recentFormContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const playerNames =
        [
            ...new Set(
                players.map(function(player) {
                    return player.name;
                })
            )
        ];


    let html =
        '<div class="recent-form-grid">';


    playerNames.forEach(
        function(name) {

            const playerMatches =
                players
                    .filter(function(player) {
                        return player.name === name;
                    })
                    .sort(function(a, b) {

                        return (
                            Number(b.matchNo) -
                            Number(a.matchNo)
                        );

                    })
                    .slice(0, 5);


            let totalRuns = 0;


            playerMatches.forEach(
                function(match) {

                    totalRuns +=
                        num(match.runs);

                }
            );


            const avg =
                playerMatches.length
                    ? (
                        totalRuns /
                        playerMatches.length
                    ).toFixed(1)
                    : "0.0";


            const photo =
                playerPhotos[name] || "";


            html += `

                <div class="form-card">

                    <img src="${photo}">

                    <h2>
                        ${escapeHTML(name)}
                    </h2>

                    <div class="form-scores">

            `;


            playerMatches.forEach(
                function(match) {

                    let cls =
                        "form-poor";


                    if (
                        num(match.runs) >= 40
                    ) {

                        cls =
                            "form-good";

                    }
                    else if (
                        num(match.runs) >= 20
                    ) {

                        cls =
                            "form-average";

                    }


                    html += `

                        <div
                            class="score-box ${cls}"
                        >
                            ${num(match.runs)}
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
                            ${avg}
                        </p>

                    </div>

                </div>

            `;

        }
    );


    html +=
        "</div>";


    container.innerHTML =
        html;

}


/* =========================================================
   HALL OF FAME
   ========================================================= */

function generateHallOfFame() {

    if (!players.length) {
        return;
    }


    const highestScore =
        [...players]
            .sort(function(a, b) {

                return (
                    num(b.runs) -
                    num(a.runs)
                );

            })[0];


    const bestBowling =
        [...players]
            .sort(function(a, b) {

                return (
                    num(b.wickets) -
                    num(a.wickets)
                );

            })[0];


    const mostSixes =
        [...players]
            .sort(function(a, b) {

                return (
                    num(b.sixes) -
                    num(a.sixes)
                );

            })[0];


    const fiftyPlayers =
        players.filter(function(player) {

            return num(player.runs) >= 50;

        });


    let fastestFifty = null;


    if (fiftyPlayers.length) {

        fastestFifty =
            fiftyPlayers.sort(function(a, b) {

                return (
                    num(a.ballsFaced) -
                    num(b.ballsFaced)
                );

            })[0];

    }


    setHTML(
        "highestScore",
        highestScore.runs +
        " Runs<br>" +
        highestScore.name
    );


    setHTML(
        "bestBowling",
        bestBowling.wickets +
        " Wickets<br>" +
        bestBowling.name
    );


    setHTML(
        "mostSixesMatch",
        mostSixes.sixes +
        " Sixes<br>" +
        mostSixes.name
    );


    if (fastestFifty) {

        setHTML(
            "fastestFifty",
            fastestFifty.ballsFaced +
            " Balls<br>" +
            fastestFifty.name
        );

    }
    else {

        setHTML(
            "fastestFifty",
            "No Fifty Yet"
        );

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


    players.forEach(
        function(player) {

            if (
                !matches[player.matchNo]
            ) {

                matches[player.matchNo] =
                    [];

            }


            matches[player.matchNo]
                .push(player);

        }
    );


    let html = "";


    Object.keys(matches)
        .sort(function(a, b) {

            return Number(b) - Number(a);

        })
        .forEach(function(matchNo) {

            const matchPlayers =
                matches[matchNo];


            const highestRuns =
                Math.max.apply(
                    null,
                    matchPlayers.map(
                        function(player) {
                            return num(player.runs);
                        }
                    )
                );


            const highestWickets =
                Math.max.apply(
                    null,
                    matchPlayers.map(
                        function(player) {
                            return num(player.wickets);
                        }
                    )
                );


            const bestBatsmen =
                matchPlayers.filter(
                    function(player) {

                        return (
                            num(player.runs) ===
                            highestRuns
                        );

                    }
                );


            const bestBowlers =
                matchPlayers.filter(
                    function(player) {

                        return (
                            num(player.wickets) ===
                            highestWickets
                        );

                    }
                );


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

                            <h4>
                                🔥 Best Batsman
                            </h4>

                            <p>
                                ${
                                    bestBatsmen
                                        .map(
                                            function(p) {
                                                return p.name;
                                            }
                                        )
                                        .join(" & ")
                                }
                            </p>

                            <p>
                                ${highestRuns} Runs
                            </p>

                        </div>


                        <div>

                            <h4>
                                🎯 Best Bowler
                            </h4>

                            <p>
                                ${
                                    bestBowlers
                                        .map(
                                            function(p) {
                                                return p.name;
                                            }
                                        )
                                        .join(" & ")
                                }
                            </p>

                            <p>
                                ${highestWickets}
                                Wickets
                            </p>

                        </div>

                    </div>

                </div>

            `;

        });


    setHTML(
        "awardHistory",
        html
    );

}


/* =========================================================
   BEST BATSMAN HISTORY
   ========================================================= */

function showBestBatsmanHistory() {

    const matches = {};


    players.forEach(
        function(player) {

            if (
                !matches[player.date]
            ) {

                matches[player.date] =
                    [];

            }


            matches[player.date]
                .push(player);

        }
    );


    let html = `
        <h3>
            🏏 Best Batsman History
        </h3>
    `;


    Object.keys(matches)
        .reverse()
        .forEach(function(date) {

            const highestRuns =
                Math.max.apply(
                    null,
                    matches[date].map(
                        function(player) {
                            return num(player.runs);
                        }
                    )
                );


            const bestBatsmen =
                matches[date].filter(
                    function(player) {

                        return (
                            num(player.runs) ===
                            highestRuns
                        );

                    }
                );


            html += `

                <div
                    class="award-history-card"
                >

                    <p>
                        📅 ${date}
                    </p>

                    <p>
                        🏏
                        ${
                            bestBatsmen
                                .map(
                                    function(p) {
                                        return p.name;
                                    }
                                )
                                .join(" & ")
                        }
                    </p>

                    <p>
                        ${highestRuns} Runs
                    </p>

                </div>

            `;

        });


    setHTML(
        "awardHistory",
        html
    );

}


/* =========================================================
   BEST BOWLER HISTORY
   ========================================================= */

function showBestBowlerHistory() {

    const matches = {};


    players.forEach(
        function(player) {

            if (
                !matches[player.date]
            ) {

                matches[player.date] =
                    [];

            }


            matches[player.date]
                .push(player);

        }
    );


    let html = `
        <h3>
            🎯 Best Bowler History
        </h3>
    `;


    Object.keys(matches)
        .reverse()
        .forEach(function(date) {

            const highestWickets =
                Math.max.apply(
                    null,
                    matches[date].map(
                        function(player) {
                            return num(player.wickets);
                        }
                    )
                );


            const bestBowlers =
                matches[date].filter(
                    function(player) {

                        return (
                            num(player.wickets) ===
                            highestWickets
                        );

                    }
                );


            html += `

                <div
                    class="award-history-card"
                >

                    <p>
                        📅 ${date}
                    </p>

                    <p>
                        🎯
                        ${
                            bestBowlers
                                .map(
                                    function(p) {
                                        return p.name;
                                    }
                                )
                                .join(" & ")
                        }
                    </p>

                    <p>
                        ${highestWickets}
                        Wickets
                    </p>

                </div>

            `;

        });


    setHTML(
        "awardHistory",
        html
    );

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

    try {

        const now =
            new Date();


        const dateElement =
            document.getElementById(
                "downloadDateTime"
            );


        if (dateElement) {

            dateElement.textContent =
                now.toLocaleDateString(
                    "en-IN"
                ) +
                " | " +
                now.toLocaleTimeString(
                    "en-IN"
                );

        }


        const card =
            document.getElementById(
                "downloadCard"
            );


        if (
            !card ||
            typeof html2canvas ===
            "undefined"
        ) {

            alert(
                "Player card or html2canvas is not available."
            );

            return;
        }


        html2canvas(
            card,
            {

                scale: 2,

                useCORS: true,

                backgroundColor:
                    "#111827"

            }
        )
        .then(function(canvas) {

            const link =
                document.createElement(
                    "a"
                );


            link.download =
                (
                    document.getElementById(
                        "modalName"
                    )?.textContent ||
                    "Player"
                ) +
                "_PlayerCard.png";


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );

        })
        .catch(function(error) {

            console.error(
                "Canvas error:",
                error
            );

            alert(
                "Unable to download player card."
            );

        });

    }
    catch (error) {

        console.error(
            "Download Error:",
            error
        );

        alert(
            "Download Error"
        );

    }

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "playerModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            modal.style.display =
                "none";

        }

    }
);


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
