function loadDecks() {
    fetch("Turnaukset/index.json")
        .then(r => r.json())
        .then(data => {
            const container = document.getElementById("pakkaLista");

            for (const turnaus in data) {
                const info = data[turnaus];
                const päivä = info.päivä;
                const pakat = info.pakat;

                pakat.forEach(pakka => {
                    const Path = `Turnaukset/${turnaus}/${pakka.tiedosto}`;

                    const wins = Object.values(pakka.wins || {}).reduce((a, b) => a + b, 0);
                    const losses = Object.values(pakka.losses || {}).reduce((a, b) => a + b, 0)
                    const pelaaja = pakka.pelaaja;
                    const pakanNimi = pakka.pakanNimi;

                    const a = document.createElement("a");
                    //a.href = "korttilista.html";
                    a.href = `pakka.html?file=${encodeURIComponent(Path)}`;
                    a.textContent = `${pelaaja} ${pakanNimi} (${wins}W–${losses}L) – ${turnaus} ${päivä}`;
                    a.className = "pakka";

                    container.appendChild(a);
                    container.appendChild(document.createElement("br"));
                });

            }


        });


}