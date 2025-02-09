document.addEventListener("DOMContentLoaded", () => {
    const checkButton = document.getElementById("checkButton");
    const repairButton = document.getElementById("repairButton");
    const suitInfo = document.getElementById("suitInfo");
    const repairMessage = document.getElementById("repairMessage");

    let suits = [];  // ประกาศตัวแปร suits เพื่อเก็บข้อมูลชุด

    async function loadSuits() {
        const response = await fetch("suits.csv");
        const data = await response.text();
        suits = data.split("\n").map(row => {
            const [id, type, durability] = row.split(",");
            return { id, type, durability: parseInt(durability, 10) };
        });
    }

    checkButton.addEventListener("click", async () => {
        const suitId = document.getElementById("suitId").value;
        if (suits.length === 0) {
            await loadSuits();  // โหลดชุดเมื่อกดปุ่มตรวจสอบ
        }
        const suit = suits.find(s => s.id === suitId);

        if (!suit) {
            suitInfo.textContent = "ไม่พบรหัสชุดนี้";
            repairButton.style.display = "none";
            return;
        }

        if (suit.type !== "ชุดปกปิดตัวตน") {
            suitInfo.textContent = "รหัสนี้ไม่ใช่ชุดปกปิดตัวตน";
            repairButton.style.display = "none";
            return;
        }

        suitInfo.textContent = `รหัสชุด: ${suit.id}, ประเภท: ${suit.type}, ความทนทาน: ${suit.durability}`;

        // ตรวจสอบว่าเลขท้ายความทนทานเป็น 3 หรือ 7
        if (suit.durability % 10 === 3 || suit.durability % 10 === 7) {
            repairButton.style.display = "block";
        } else {
            repairButton.style.display = "none";
        }
    });

    repairButton.addEventListener("click", async () => {
        const suitId = document.getElementById("suitId").value;
        const suit = suits.find(s => s.id === suitId);

        if (suit && suit.type === "ชุดชุดปกปิดตัวตน") {
            // ถ้าความทนทานลงท้ายด้วยเลข 3 หรือ 7 บวก 25
            if (suit.durability % 10 === 3 || suit.durability % 10 === 7) {
                suit.durability = Math.min(suit.durability + 25, 100);
                suitInfo.textContent = `รหัสชุด: ${suit.id}, ประเภท: ${suit.type}, ความทนทาน: ${suit.durability}`;
                repairMessage.textContent = "ซ่อมแซมชุดสำเร็จ!";
            } else {
                // ถ้าความทนทานไม่ลงท้ายด้วย 3 หรือ 7 แสดงข้อความซ่อมแซมสำเร็จ
                suitInfo.textContent = `รหัสชุด: ${suit.id}, ประเภท: ${suit.type}, ความทนทาน: ${suit.durability}`;
                repairMessage.textContent = "ซ่อมแซมชุดสำเร็จ!";
            }
            
            // ซ่อนปุ่มซ่อม
            repairButton.style.display = "none";
        }
    });
});
