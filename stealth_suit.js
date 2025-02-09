document.addEventListener("DOMContentLoaded", () => {
    const checkButton = document.getElementById("checkButton");
    const repairButton = document.getElementById("repairButton");
    const suitInfo = document.getElementById("suitInfo");
    const repairMessage = document.getElementById("repairMessage");

    async function loadSuits() {
        const response = await fetch("suits.csv");
        const data = await response.text();
        return data.split("\n").map(row => {
            const [id, type, durability] = row.split(",");
            return { id, type, durability: parseInt(durability, 10) };
        });
    }

    checkButton.addEventListener("click", async () => {
        const suitId = document.getElementById("suitId").value;
        const suits = await loadSuits();
        const suit = suits.find(s => s.id === suitId);

        if (!suit) {
            suitInfo.textContent = "ไม่พบรหัสชุดนี้";
            repairButton.style.display = "none";
            return;
        }

        if (suit.type !== "ชุดลอบเร้น") {
            suitInfo.textContent = "รหัสนี้ไม่ใช่ชุดลอบเร้น";
            repairButton.style.display = "none";
            return;
        }

        suitInfo.textContent = `รหัสชุด: ${suit.id}, ประเภท: ${suit.type}, ความทนทาน: ${suit.durability}`;
        
        if (suit.durability < 50) {
            repairButton.style.display = "block";
        } else {
            repairButton.style.display = "none";
        }
    });

    repairButton.addEventListener("click", async () => {
        const suitId = document.getElementById("suitId").value;
        const suits = await loadSuits();
        const suit = suits.find(s => s.id === suitId);
        
        if (suit && suit.type === "ชุดลอบเร้น") {
            suit.durability = Math.min(suit.durability + 25, 100);
            suitInfo.textContent = `รหัสชุด: ${suit.id}, ประเภท: ${suit.type}, ความทนทาน: ${suit.durability}`;
            if (suit.durability >= 50) {
                repairMessage.textContent = "ซ่อมแซมชุดสำเร็จ!";
                repairButton.style.display = "none";
            } else {
                repairButton.style.display = "block";
            }
        }
    });
});