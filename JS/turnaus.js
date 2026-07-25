function getTournamentFileFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("file");
}

function zoomCard(cardPath) {
    const zoom_object = document.getElementById("cardZoom");
    const zoom_image = document.getElementById("zoomImage");

    zoom_image.src = `Images/Cards/${cardPath}.png`;
    zoom_object.classList.add("show");
    zoom_object.onclick = () => zoom_object.classList.remove("show");
}

async function loadCards() {
    const tournament = getTournamentFileFromURL();
    const file = `Turnaukset/index.json`;
    console.log(file)
    if (!file) {
        document.getElementById("deckContainer").textContent = "Virhe: turnausta ei löytynyt.";
        return;
    }


    const indexData = await fetch(`${file}`).then(r => r.json());

    document.getElementById("Turnaus_nimi").textContent = tournament;
    document.getElementById("Turnaus_päivä").textContent = indexData[tournament].päivä;

    const decks = indexData[tournament].pakat; // list of deck files

    const cardCounts = {};
    const cardUsage = {};
    let lajit = {
        Demoni: 0,
        Eläin: 0,
        Enkeli: 0,
        Epäkuollut: 0,
        Ihminen: 0,
        Kasvi: 0,
        Kone: 0,
        Mutantti: 0,
        Silmä: 0,
        Sähkö: 0,
        Tuli: 0,
        Vesi: 0,
        Ötökkä: 0
    }
    let tyypit = {
        Olento: 0,
        Loitsu: 0,
        Pysyvä: 0
    }

    const kortitDB = await fetch("cards.json").then(r => r.json());

    for (const deck of decks) {
        const deckPath = `Turnaukset/${tournament}/${deck.tiedosto}`;
        const pakka = await fetch(deckPath).then(r => r.json());

        pakka.main.forEach(card => {
            const nimi = card.nimi;
            const määrä = card.määrä;
            const info = kortitDB.find(c => c.Nimi === nimi);
            const max = info.Max;
            const laji = info.Laji;
            //console.log(nimi + max)

            if (!cardCounts[nimi]) cardCounts[nimi] = 0;
            cardCounts[nimi] += määrä;
            if (!cardUsage[nimi]) cardUsage[nimi] = max;
            if (!laji.includes("Loitsu")) {
                tyypit["Olento"] += card.määrä;
                const dualtypes = laji.split("/");
                dualtypes.forEach(dualtype => {
                    dualtype = dualtype.trim();
                    if (lajit[dualtype] !== undefined) {
                        lajit[dualtype] += card.määrä;
                    }
                });
            } else if (laji === "Pysyvä Loitsu") {
                tyypit["Pysyvä"] += card.määrä;
            } else {
                tyypit["Loitsu"] += card.määrä;
            }
        });
        pakka.side.forEach(card => {
            const nimi = card.nimi
            const määrä = card.määrä
            const info = kortitDB.find(c => c.Nimi === nimi);
            const max = info.Max;
            const laji = info.Laji;
            //console.log(nimi + max)

            if (!cardCounts[nimi]) cardCounts[nimi] = 0;
            cardCounts[nimi] += määrä;
            if (!cardUsage[nimi]) cardUsage[nimi] = max;
            if (!laji.includes("Loitsu")) {
                tyypit["Olento"] += card.määrä;
                const dualtypes = laji.split("/");
                dualtypes.forEach(dualtype => {
                    dualtype = dualtype.trim();
                    if (lajit[dualtype] !== undefined) {
                        lajit[dualtype] += card.määrä;
                    }
                });
            } else if (laji === "Pysyvä Loitsu") {
                tyypit["Pysyvä"] += card.määrä;
            } else {
                tyypit["Loitsu"] += card.määrä;
            }
        });
    }

    const sorted = Object.entries(cardCounts)
    sorted.forEach(card => {
        const info = kortitDB.find(c => c.Nimi === card[0]);
        const max = info.Max;
        card[1] = card[1] / (max * decks.length);
        card[1] = card[1].toFixed(2);
        console.log(card[1])
    });
    sorted.sort((a, b) => b[1] - a[1]); // highest usage first

    const sortedLajit = Object.entries(lajit)
        .sort((a, b) => b[1] - a[1]);


    console.log(sorted)
    console.log(sortedLajit)
    const container = document.getElementById("pakanKortit");
    let html = `
    <h2>Turnauksen Kortit</h2>`;

    sorted.forEach(card => {
        const info = kortitDB.find(c => c.Nimi === card[0]);
        let setti = info.Setti;
        setti = setti.replace(".jpg", "");
        const cardPath = `${setti}/${info.Nimi}`
        html += `
        <div class="kortti" onclick="zoomCard('${cardPath}')">
            <div class="maksu">${info.Maksu}</div>
            <img class="kuva" src="Images/Arts/${card[0]}.jpg" alt="${card[0]}">
            <div class="nimi">${card[0]}</div>
            <div class="määrä">${cardCounts[card[0]]}</div>
            <div class="määrä">${card[1]}</div>
        </div>
        `;
    });
    container.innerHTML = html;
    html = `
    <h2>Turnauksen Lajit</h2>`;

    const laji_container = document.getElementById("lajit");
    sortedLajit.forEach(laji => {
        html += `
        <div class="kortti">
            <div class="nimi">${laji[0]}</div>
            <div class="määrä">${laji[1]}</div>
        </div>
        `;
    });
    laji_container.innerHTML = html;

    new Chart(document.getElementById("cardtypePie"), {
        type: "pie",
        data: {
            labels: ["Olento", "Loitsu", "Pysyvä Loitsu"],
            datasets: [{
                data: [tyypit.Olento, tyypit.Loitsu, tyypit.Pysyvä],
                backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"]
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "black",
                        font: {
                            size: 16
                        }
                    }
                },
                tooltip: {
                    titleFont: { size: 16 },
                    bodyFont: { size: 14 }
                }
            }
        }
    });
    //console.log(cardUsage[sorted[0][0]])
}

