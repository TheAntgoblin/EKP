function loadDecks() {
    fetch("Turnaukset/index.json")
        .then(r => r.json())
        .then(data => {
            const container = document.getElementById("pakkaLista");

            for (const turnaus in data) {
                const info = data[turnaus];
                const päivä = info.päivä;
                const pakat = info.pakat;

                const box = document.createElement("div");
                box.className = "turnausBox";
                const h3 = document.createElement("h3");
                h3.textContent = `${turnaus} – ${päivä}`;
                box.appendChild(h3);

                pakat.forEach(pakka => {
                    const Path = `Turnaukset/${turnaus}/${pakka.tiedosto}`;

                    const wins = Object.values(pakka.wins || {}).reduce((a, b) => a + b, 0);
                    const losses = Object.values(pakka.losses || {}).reduce((a, b) => a + b, 0)
                    const pelaaja = pakka.pelaaja;
                    const pakanNimi = pakka.pakanNimi;

                    const a = document.createElement("a");
                    //a.href = "korttilista.html";
                    a.href = `pakka.html?file=${encodeURIComponent(Path)}`;
                    a.textContent = `${pelaaja} - ${pakanNimi} (${wins}W–${losses}L)`;
                    a.className = "pakka";

                    box.appendChild(a);
                    box.appendChild(document.createElement("br"));
                });

                container.appendChild(box);

            }


        });


}