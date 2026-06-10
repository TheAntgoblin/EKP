function getDeckFileFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("file");
}

async function loadDeck() {
    const file = getDeckFileFromURL();
    if (!file) {
        document.getElementById("deckContainer").textContent = "Virhe: pakkaa ei löytynyt.";
        return;
    }

    const pakka = await fetch(file).then(r => r.json());
    const kortitDB = await fetch("cards.json").then(r => r.json());
    
    function getCardInfo(name) {
        return kortitDB.find(c => c.Nimi === name);
    }

    const container = document.getElementById("pakanKortit");
    let html = `
        <h2>Main Deck</h2>`;

    pakka.main.forEach(card => {
        const info = getCardInfo(card.nimi);
        const maksu = info ? info.Maksu : "?";
        html += `
        <div class="kortti">
            <div class="maksu">${maksu}</div>
            <img class="kuva" src="Images/Arts/${card.nimi}.jpg" alt="${card.nimi}">
            <div class="nimi">${card.nimi}</div>
            <div class="määrä">x${card.määrä}</div>
        </div>
        `;
    });

    html += `<h2>Sideboard</h2>`;
    pakka.side.forEach(card => {
        const info = getCardInfo(card.nimi);
        const maksu = info ? info.Maksu : "?";
        html += `
        <div class="kortti">
            <div class="maksu">${maksu}</div>
            <img class="kuva" src="Images/Arts/${card.nimi}.jpg" alt="${card.nimi}">
            <div class="nimi">${card.nimi}</div>
            <div class="määrä">x${card.määrä}</div>
        </div>
        `;
    });
    container.innerHTML = html;
    
}