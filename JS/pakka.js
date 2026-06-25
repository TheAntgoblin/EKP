function getDeckFileFromURL() {
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

    let cardTypes = {
        olento: 0,
        loitsu: 0,
        pysyvä: 0
    };
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
    const maksut = Array(11).fill(0);
    const sidemaksut = Array(11).fill(0);

    pakka.main.forEach(card => {
        const info = getCardInfo(card.nimi);
        const maksu = info ? info.Maksu : "?";
        const laji = info ? info.Laji : "?";
        html += `
        <div class="kortti" onclick="zoomCard('${card.nimi}')">
            <div class="maksu">${maksu}</div>
            <img class="kuva" src="Images/Arts/${card.nimi}.jpg" alt="${card.nimi}">
            <div class="nimi">${card.nimi}</div>
            <div class="määrä">x${card.määrä}</div>
        </div>
        `;
        if (laji.includes("Pysyvä Loitsu")) {
            cardTypes.pysyvä += card.määrä;
        } else if (laji.includes("Loitsu")) {
            cardTypes.loitsu += card.määrä;
        } else {
            cardTypes.olento += card.määrä;
            const dualtypes = laji.split("/");
            dualtypes.forEach(dualtype => {
                dualtype = dualtype.trim();
                if (lajit[dualtype] !== undefined) {
                    lajit[dualtype] += card.määrä;
                }
            });
        }

        if (Number(maksu) >= 0 && Number(maksu) <= 10) {
            maksut[Number(maksu)] += card.määrä;
        } else {
            maksut[11] += card.määrä;
        }

    });

    html += `<h2>Sideboard</h2>`;
    pakka.side.forEach(card => {
        const info = getCardInfo(card.nimi);
        const maksu = info ? info.Maksu : "?";
        html += `
        <div class="kortti" onclick="zoomCard('${card.nimi}')">
            <div class="maksu">${maksu}</div>
            <img class="kuva" src="Images/Arts/${card.nimi}.jpg" alt="${card.nimi}">
            <div class="nimi">${card.nimi}</div>
            <div class="määrä">x${card.määrä}</div>
        </div>
        `;
        if (Number(maksu) >= 0 && Number(maksu) <= 10) {
            sidemaksut[Number(maksu)] += card.määrä;
        } else {
            sidemaksut[11] += card.määrä;
        }
    });

    new Chart(document.getElementById("cardtypePie"), {
        type: "pie",
        data: {
            labels: ["Olento", "Loitsu", "Pysyvä Loitsu"],
            datasets: [{
                data: [cardTypes.olento, cardTypes.loitsu, cardTypes.pysyvä],
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

    new Chart(document.getElementById("creaturetypePie"), {
        type: "pie",
        data: {
            labels: ["Demoni", "Eläin", "Enkeli", "Epäkuollut", "Ihminen", "Kasvi", "Kone", "Mutantti", "Silmä", "Sähkö", "Tuli", "Vesi", "Ötökkä"],
            datasets: [{
                data: [lajit.Demoni, lajit.Eläin, lajit.Enkeli, lajit.Epäkuollut, lajit.Ihminen, lajit.Kasvi, lajit.Kone, lajit.Mutantti, lajit.Silmä, lajit.Sähkö, lajit.Tuli, lajit.Vesi, lajit.Ötökkä],
                backgroundColor: ["#535353", "#a7712a", "#ececec", "#b847b8", "#f7b8fd", "#44ff72", "#b6b6b6", "#c2bc85", "#9bfff2", "#f4ff5b", "#ff3e3e", "#3c3ff1", "#578b60"]
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "black",
                        font: {
                            size: 14
                        },
                        filter: (item, chart) => {
                            console.log(chart.datasets[0].data[item.index]);
                            const value = chart.datasets[0].data[item.index];
                            if (value > 0) {
                                return 1;
                            } else {
                                return 0;
                            }
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

    new Chart(document.getElementById("maksuChart"), {
        type: "bar",
        data: {
            labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
            datasets: [{
                label: "Maksu määrä",
                data: maksut,
                backgroundColor: "#2391db"
            },
            {
                label: "Sideboard",
                data: sidemaksut,
                backgroundColor: "#cc4e4e"
            }]
        },
        options: {
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true }
            },
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

    container.innerHTML = html;

}