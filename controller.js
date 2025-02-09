let suits = [];

// แปลง CSV เป็น Object
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

// โหลดข้อมูลจาก suits.csv
async function loadCSV() {
    try {
        const response = await fetch('suits.csv');
        const text = await response.text();
        suits = parseCSV(text);
    } catch (error) {
        console.error('Error loading CSV file:', error);
    }
}

// ตรวจสอบรหัสชุดซุปเปอร์ฮีโร่และเปลี่ยนหน้า
function handleFormSubmit() {
    const codeInput = document.getElementById('suitCode').value;
    const suit = suits.find(suit => suit.suit_id === codeInput);
    const errorElement = document.getElementById('error');

    if (!suit) {
        errorElement.textContent = 'ไม่พบรหัสชุดในฐานข้อมูล';
        return;
    }

    errorElement.textContent = ''; // เคลียร์ข้อความผิดพลาด
    
    // เปลี่ยนหน้าไปตามประเภทของชุด
    if (suit.suit_type === 'ชุดทรงพลัง') {
        window.location.href = 'power_suit.html';
    } else if (suit.suit_type === 'ชุดลอบเร้น') {
        window.location.href = 'stealth_suit.html';
    } else if (suit.suit_type === 'ชุดปกปิดตัวตน') {
        window.location.href = 'concealment_suit.html';
    }
}

// โหลด CSV เมื่อเปิดหน้าเว็บ
loadCSV();

//กลับหน้าแรก
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});