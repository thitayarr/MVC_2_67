let suits = [];

export async function loadSuits() {
    try {
        const response = await fetch('suits.csv');
        const text = await response.text();
        suits = parseCSV(text);
    } catch (error) {
        console.error('Error loading suits:', error);
    }
}

function parseCSV(data) {
    const rows = data.trim().split('\n');
    const header = rows[0].split(',');
    return rows.slice(1).map(row => {
        const values = row.split(',');
        return header.reduce((acc, key, index) => {
            acc[key] = values[index];
            return acc;
        }, {});
    });
}

export function findSuitById(suitId) {
    return suits.find(suit => suit.suit_id === suitId);
}
