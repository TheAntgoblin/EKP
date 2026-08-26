
let currentSet = "Raha.jpg";
let cardCount = 0;

function zoomCard(cardPath) {
    const zoom_object = document.getElementById("cardZoom");
    const zoom_image = document.getElementById("zoomImage");

    zoom_image.src = `Images/Cards/${cardPath}.png`;
    zoom_object.classList.add("show");
    zoom_object.onclick = () => zoom_object.classList.remove("show");
    console.log("AAAA");
}

function selectSet(setName) {
    currentSet = setName;

    // highlight the clicked button
    document.querySelectorAll(".setButton").forEach(btn => btn.classList.remove("active"));
    document.getElementById(setName + "Btn").classList.add("active");
    console.log("WHAAAA")
    filterCards();
}

function updateCardCount() {
    document.querySelector(".cardCount").textContent = cardCount;
}

function drawcards(laji) {

    const div = document.createElement("div");
    div.className = "listCard";

    fetch('./cards.json')
        .then(res => res.json())
        .then(cards => {


            // Filter all cards matching this Laji
            const filtered = cards.filter(card => (card.Laji == laji || card.Laji.includes(laji + "/") || (card.Laji.includes(laji) && card.Laji.includes("vastakohta"))) && card.Maksu !== "*");
            const loitsut = cards.filter(card => card.Laji.includes(laji + " Loitsu"));

            // Insert each card under the header
            filtered.forEach(card => {
                //const element = drawcard(card.Nimi, card.Maksu, card.Max, card.Kyky, card.Setti, card.Aika);
                const element = drawcard(card);
                div.appendChild(element);
            });
            loitsut.forEach(card => {
                //const element = drawcard(card.Nimi, card.Maksu, card.Max, card.Kyky, card.Setti, card.Aika);
                const element = drawcard(card);
                div.appendChild(element);
            });

        });
    // Find the header <h2 id="Demoni"> or <h2 id="Enkeli"> etc.
    //const header = document.getElementById(laji);
    //header.insertAdjacentElement("afterend", div);

    const container = document.getElementById(laji + "Kortit");
    container.appendChild(div);
}

function drawcard(card) {

    const div = document.createElement("div");
    div.className = "card";
    div.dataset.name = card.Nimi.toLowerCase();
    div.dataset.maksu = String(card.Maksu);
    div.dataset.max = String(card.Max);
    div.dataset.laji = card.Laji;
    div.dataset.kyky = (card.Kyky || "").toLowerCase();
    div.dataset.setti = card.Setti;
    div.dataset.aika = card.Aika;
    div.dataset.tekija = (card.Tekija || "").toLowerCase();

    if (!(card.Setti.includes(currentSet) || card.Aika.includes(currentSet))) {
        div.style.display = "none";
    }
    else {
        cardCount++;
    }

    const setti = card.Setti.replace(".jpg", "");
    const img = document.createElement("img");
    img.src = "Images/Cards/" + setti + "/" + card.Nimi + ".png";
    img.onerror = () => {
        img.src = "Images/Cards/Image_not_found.png";
    }
    img.onclick = () => zoomCard(setti + "/" + card.Nimi);
    div.appendChild(img);

    const addButton = document.createElement("button");
    addButton.className = "addToDeck";
    addButton.textContent = "Lisää Pakkaan";
    addButton.onclick = () => addCard(card.Nimi, card.Maksu, card.Max, setti);
    div.appendChild(addButton);

    const sideButton = document.createElement("button");
    sideButton.className = "addToDeck";
    sideButton.textContent = "Lisää Sideen";
    sideButton.onclick = () => addSide(card.Nimi, card.Maksu, card.Max, setti);
    div.appendChild(sideButton);

    if (card.Tokens) {
        const tokens = card.Tokens.split(",");
        tokens.forEach(token => {
            const TokenLink = document.createElement("div");
            TokenLink.classList.add("tokenLink");
            TokenLink.textContent = token;
            TokenLink.onclick = () => zoomCard(setti+"/Tokens/"+token); 
            div.appendChild(TokenLink);
        });
    }

    return div;
}

function filterCards() {
    const serchTtext = document.getElementById("searchInput");
    const text = serchTtext.value.toLowerCase();
    const cards = document.querySelectorAll(".card");
    const maksuButtons = document.querySelectorAll(".maksuButton.active");
    let maksut = Array.from(maksuButtons).flatMap(btn => {
        const num = btn.textContent.trim();
        if (num === "10+") {
            return [10, 11, 12, 50, 100, 500, 1000];
        }
        else if (num === "X") {
            console.log("XXXXXXXXXXXXXXXXXXX")
            return ["I", "V", "X", "L", "C", "D", "M"];
        }

        return [Number(num)];
    });
    if (maksut.length === 0) {
        maksut = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "I", "V", "X", "L", "C", "D", "M"];
    }

    cards.forEach(card => {
        const name = card.dataset.name;
        const maksu = card.dataset.maksu;
        const laji = card.dataset.laji.toLowerCase();

        console.log("Teksti:" + text);
        console.log("Laji:" + laji);
        const kyky = card.dataset.kyky;
        const setti = card.dataset.setti;
        const aika = card.dataset.aika;
        const tekija = card.dataset.tekija;
        console.log(name)
        if ((name.includes(text) || kyky.includes(text) || tekija.includes(text) || laji.includes(text)) && (maksut.includes(Number(maksu)) || maksut.includes(maksu)) && (setti.includes(currentSet) || aika.includes(currentSet))) {
            if (card.style.display === "none") {
                card.style.display = "";
                cardCount++;
            }
        } else {
            if (card.style.display === "") {
                card.style.display = "none";
                cardCount--;
            }
        }
    });

    document.querySelectorAll("h2").forEach(lajiHeader => {
        const container = document.getElementById(lajiHeader.id + "Kortit");
        const Qbutton = document.getElementById(lajiHeader.id + "Quick");
        console.log(container)
        if (!container) return;
        console.log(container)
        const cards = container.querySelectorAll(".card");
        const allHidden = [...cards].every(
            card => getComputedStyle(card).display === "none"
        );

        if (allHidden) {
            lajiHeader.style.display = "none";
            Qbutton.classList.add('disabled');
        } else {
            lajiHeader.style.display = "";
            Qbutton.classList.remove('disabled');
        }
    });

    updateCardCount();

}

function maksuButton(btn) {
    btn.classList.toggle('active');
    filterCards();
}

function addCard(name, mana, max, setti) {
    const list = document.getElementById("listCart");

    const existing = Array.from(list.querySelectorAll('.item'))
        .find(item => item.querySelector('.name').textContent.trim() === name);

    if (existing) {
        // Increase quantity 
        const qtySpan = existing.querySelector('.quantity span:nth-child(2)');
        let qty = parseInt(qtySpan.textContent);

        if (qty < max) {
            qtySpan.textContent = qty + 1;
        }

        updateTotal();

        return;
    }


    // Create a new item 
    const item = document.createElement("div");
    item.classList.add("item");

    item.dataset.max = max;
    item.dataset.mana = mana;

    item.innerHTML = ` 
                    <div class="mana">${mana}</div> 
                    <div class="name" onclick = "zoomCard('${setti}/${name}')">${name}</div> 
                    <div class="quantity"> 
                        <span class="minus">-</span> 
                        <span>1</span> 
                        <span class="plus">+</span> 
                    </div> 
                `;

    list.appendChild(item);
    sortCards();
    updateTotal();
}

function addSide(name, mana, max, setti) {

    const list = document.getElementById("sideBoard");

    const existing = Array.from(list.querySelectorAll('.item'))
        .find(item => item.querySelector('.name').textContent.trim() === name);

    if (existing) {
        // Increase quantity 
        const qtySpan = existing.querySelector('.quantity span:nth-child(2)');
        let qty = parseInt(qtySpan.textContent);

        if (qty < max) {
            qtySpan.textContent = qty + 1;
        }

        updateTotal();
        return;
    }


    // Create a new item 
    const item = document.createElement("div");
    item.classList.add("item");

    item.dataset.max = max;
    item.dataset.mana = mana;

    item.innerHTML = ` 
                    <div class="mana">${mana}</div> 
                    <div class="name" onclick = "zoomCard('${setti}/${name}')">${name}</div> 
                    <div class="quantity"> 
                        <span class="minus">-</span> 
                        <span>1</span> 
                        <span class="plus">+</span> 
                    </div> 
                `;

    list.appendChild(item);
    sortSide();
    updateTotal();
}

function sortCards() {
    const list = document.getElementById("listCart");
    const items = Array.from(list.querySelectorAll(".item"));

    items.sort((a, b) => {
        return parseInt(a.dataset.mana) - parseInt(b.dataset.mana);
    });

    items.forEach(item => list.appendChild(item));

}

function sortSide() {
    const list = document.getElementById("sideBoard");
    const items = Array.from(list.querySelectorAll(".item"));

    items.sort((a, b) => {
        return parseInt(a.dataset.mana) - parseInt(b.dataset.mana);
    });

    items.forEach(item => list.appendChild(item));

}

function updateTotal() {
    const total = getTotalCards();
    document.getElementById("pakka").textContent = `Pakka (${total}/40)`;

    const sidetotal = getSideboard();
    document.getElementById("side").textContent = `Sideboard (${sidetotal}/10)`;
}

function getTotalCards() {
    const list = document.getElementById("listCart");
    const items = list.querySelectorAll(".item");

    let total = 0;

    items.forEach(item => {
        const qty = parseInt(item.querySelector(".quantity span:nth-child(2)").textContent);
        total += qty;
    });

    return total;
}

function getSideboard() {
    const list = document.getElementById("sideBoard");
    const items = list.querySelectorAll(".item");

    let total = 0;

    items.forEach(item => {
        const qty = parseInt(item.querySelector(".quantity span:nth-child(2)").textContent);
        total += qty;
    });

    return total;

}

function copyCards() {

    const list = document.getElementById("listCart");
    const items = list.querySelectorAll(".item");
    const side = document.getElementById("sideBoard");
    const side_items = side.querySelectorAll(".item");

    let output = "";
    let nimi = document.getElementById("Pakannimi").value;
    if (nimi.trim() == "") {
        output += `Pakka`
    } else {
        output += nimi;
    }
    output += `:\n\n`;
    items.forEach(item => {
        const name = item.querySelector(".name").textContent.trim();
        const qty = item.querySelector(".quantity span:nth-child(2)").textContent.trim();
        output += `${qty}x ${name}\n`;
    });

    output += `\nSidebaord:\n\n`;

    side_items.forEach(item => {
        const name = item.querySelector(".name").textContent.trim();
        const qty = item.querySelector(".quantity span:nth-child(2)").textContent.trim();
        output += `${qty}x ${name}\n`;
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(output)
            .then(() => console.log(""))
            .catch(() => fallbackCopy(output));
    } else {
        fallbackCopy(output);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        document.execCommand("copy");
        console.log("Copied using fallbackCopy")

    } catch (err) {
        console.log("Fail:", err)
    }

    document.body.removeChild(textarea);
}

