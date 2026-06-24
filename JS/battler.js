import { readFile } from "fs/promises";

async function battle() {
    console.log("Battle alkaa");

    const data = await readFile("../cards.json", "utf8");
    const kortitDB = JSON.parse(data);

    const pakka = ["Planeetta I", "Planeetta X"];
    pakka.forEach(kortti => {
        const korttidata = kortitDB.find(k => k.Nimi === kortti);;
        console.log(korttidata);
    });

}

battle();