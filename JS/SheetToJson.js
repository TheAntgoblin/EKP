const fs = require("fs");

function sheetToJason() {
    let sheet = fs.readFileSync("C:\\Users\\Anton\\OneDrive\\Tiedostot\\Eeppinen Korttipeli\\EeppinenTCG.csv", "latin1");
    sheet = sheet.replace(//g, '"');
    sheet = sheet.replace(//g, '"');
    const rows = sheet.split("\n");
    const column_names = rows[0].split(",");
    const cards = [];
    for (let i = 1; i < rows.length; i++) {
        const values = splitCSV(rows[i]);
        if (!values[2] || values[2].trim() === "") {
            continue;
        }


        let card = {};
        if (values[2] == "") {
            continue;
        }
        for (let j = 0; j < column_names.length; j++) {
            if (j === 1 || j === 4 || j === 11 || j >= 13) {
                continue;
            }
            if (values[j] && values[j].trim() !== "") {
                card[column_names[j]] = values[j].trim();
            }
        }

        card["Kyky"] = [values[13], values[14], values[15]]
            .map(v => (v || "").trim())
            .filter(v => v !== "")
            .join(" ");

        cards.push(card);
    }

    fs.writeFileSync("cards.json", JSON.stringify(cards, null, 2));
    console.log("JSON made");
}

function splitCSV(row) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
            continue;
        }

        if (char === "," && !insideQuotes) {
            result.push(current);
            current = "";
            continue;
        }

        current += char;
    }

    result.push(current);
    return result;
}

sheetToJason();
