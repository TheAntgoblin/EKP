function getTournamentFileFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("file");
}

function zoomCard(cardName) {
    const zoom_object = document.getElementById("cardZoom");
    const zoom_image = document.getElementById("zoomImage");

    zoom_image.src = `Images/Cards/${cardName}.png`;
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

    for (const deck of decks) {
        const deckPath = `Turnaukset/${tournament}/${deck.tiedosto}`;
        const pakka = await fetch(deckPath).then(r => r.json());
        const kortitDB = await fetch("cards.json").then(r => r.json());

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
                const dualtypes = laji.split("/");
                dualtypes.forEach(dualtype => {
                    dualtype = dualtype.trim();
                    if (lajit[dualtype] !== undefined) {
                        lajit[dualtype] += card.määrä;
                    }
                });
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
                const dualtypes = laji.split("/");
                dualtypes.forEach(dualtype => {
                    dualtype = dualtype.trim();
                    if (lajit[dualtype] !== undefined) {
                        lajit[dualtype] += card.määrä;
                    }
                });
            }
        });
    }
    const kortitDB = await fetch("cards.json").then(r => r.json());
    const sorted = Object.entries(cardCounts)
    sorted.forEach(card => {
        const info = kortitDB.find(c => c.Nimi === card[0]);
        const max = info.Max;
        card[1] = card[1] / (max*decks.length);
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
        <h2>Main Deck</h2>`;

    sorted.forEach(card => {
        const info = kortitDB.find(c => c.Nimi === card[0]);
        html += `
        <div class="kortti" onclick="zoomCard('${card[0]}')">
            <div class="maksu">${info.Maksu}</div>
            <img class="kuva" src="Images/Arts/${card[0]}.jpg" alt="${card[0]}">
            <div class="nimi">${card[0]}</div>
            <div class="määrä">${cardCounts[card[0]]}</div>
            <div class="määrä">${card[1]}</div>
        </div>
        `;
    });
    container.innerHTML = html;
    html = ``;

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
    //console.log(cardUsage[sorted[0][0]])
}

