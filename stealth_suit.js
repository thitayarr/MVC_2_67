document.addEventListener("DOMContentLoaded", () => {
    const checkButton = document.getElementById("checkButton");
    const repairButton = document.getElementById("repairButton");
    const suitInfo = document.getElementById("suitInfo");
    const repairMessage = document.getElementById("repairMessage");
    const repairCountDisplay = document.getElementById("repairCountDisplay"); // สำหรับแสดงจำนวนชุดที่ซ่อมแซม

    let suits = [];  // เก็บข้อมูลชุดทั้งหมดที่โหลดไว้
    let repairCounts = {  // เก็บจำนวนชุดที่ซ่อมแซม
        "ชุดลอบเร้น": 0,
    };

    // ฟังก์ชันโหลดชุดจากไฟล์ CSV
    async function loadSuits() {
        const response = await fetch("suits.csv");
        const data = await response.text();
        suits = data.split("\n").map(row => {
            const [id, type, durability] = row.split(",");
            return { id, type, durability: parseInt(durability, 10) };
        });
    }

    // เมื่อกดปุ่มตรวจสอบ
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

        if (suit.type !== "ชุดลอบเร้น") {
            suitInfo.textContent = "รหัสนี้ไม่ใช่ชุดลอบเร้น";
            repairButton.style.display = "none";
            return;
        }

        suitInfo.textContent = `รหัสชุด: ${suit.id}, ประเภท: ${suit.type}, ความทนทาน: ${suit.durability}`;

        // ถ้าความทนทานต่ำกว่า 50 แสดงปุ่มซ่อม
        if (suit.durability < 50) {
            repairButton.style.display = "block";
        } else {
            repairButton.style.display = "none";
        }
    });

    // เมื่อกดปุ่มซ่อมแซม
    repairButton.addEventListener("click", async () => {
        const suitId = document.getElementById("suitId").value;
        const suit = suits.find(s => s.id === suitId);

        if (suit && suit.type === "ชุดลอบเร้น") {
            // ถ้าความทนทานต่ำกว่า 50 และบวก 25 ได้
            if (suit.durability < 50) {
                suit.durability = Math.min(suit.durability + 25, 100);  // บวกได้สูงสุดไม่เกิน 100
            }

            suitInfo.textContent = `รหัสชุด: ${suit.id}, ประเภท: ${suit.type}, ความทนทาน: ${suit.durability}`;

            // ถ้าความทนทานถึง 50 หรือมากกว่า แสดงข้อความซ่อมแซมสำเร็จ
            if (suit.durability >= 50) {
                repairMessage.textContent = "ซ่อมแซมชุดสำเร็จ!";
                repairButton.style.display = "none";  // ซ่อนปุ่มซ่อมแซม

                // เพิ่มจำนวนชุดที่ซ่อมแซมในประเภทนี้
                repairCounts[suit.type] = (repairCounts[suit.type] || 0) + 1;
                updateRepairCountDisplay();  // อัปเดตการแสดงผลจำนวนชุดที่ซ่อมแซม
            } else {
                repairButton.style.display = "block";  // ให้แสดงปุ่มซ่อมถ้าความทนทานยังไม่ถึง 50
            }
        }
    });

    // ฟังก์ชันแสดงผลจำนวนชุดที่ซ่อมแซม
    function updateRepairCountDisplay() {
        repairCountDisplay.textContent = `จำนวนชุดที่ซ่อมแซม:\n`;
        for (const type in repairCounts) {
            if (repairCounts[type] > 0) {
                repairCountDisplay.textContent += `${type}: ${repairCounts[type]} ชุด\n`;
            }
        }
    }
});
