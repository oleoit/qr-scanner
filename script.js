let html5QrCode = null;
let isScanning = false;
let currentLang = 'th'; // ค่าเริ่มต้นเป็นภาษาไทย

// --- 0. TRANSLATIONS (ระบบแปลภาษา) ---
const translations = {
    th: {
        nav_home: "หน้าแรก",
        nav_howto: "วิธีใช้งาน",
        nav_donate: "เลี้ยงกาแฟ",
        tab_scan: "📸 สแกน QR",
        tab_generate: "✨ สร้าง QR",
        btn_open_cam: "เปิดกล้อง",
        btn_close_cam: "ปิดกล้อง",
        btn_upload: "อัปโหลดรูป",
        result_label: "ผลลัพธ์:",
        label_text: "ข้อความ หรือ URL:",
        placeholder_text: "พิมพ์ข้อความที่นี่...",
        btn_create: "✨ สร้าง QR Code",
        save_hint: "คลิกขวา หรือกดค้างที่รูปเพื่อบันทึก",
        howto_title: "วิธีใช้งาน",
        step1_title: "1. เลือกโหมด",
        step1_desc: "กดเลือกเมนูว่าต้องการสแกน หรือต้องการสร้างคิวอาร์โค้ดใหม่",
        step2_title: "2. สั่งงาน",
        step2_desc: "หากสแกน ให้นำกล้องไปจ่อที่ภาพ หากสร้าง ให้พิมพ์ข้อความแล้วกดปุ่ม",
        step3_title: "3. รับผลลัพธ์",
        step3_desc: "ระบบจะทำงานทันทีบน Browser ของคุณ ปลอดภัยและรวดเร็ว",
        header_desc: "สแกนและสร้างคิวอาร์โค้ดได้ทันที Free 100%",
        footer_credit: "พัฒนาโดย ยุทธนา ภูมามอบ"
    },
    en: {
        nav_home: "Home",
        nav_howto: "How to use",
        nav_donate: "Buy me a coffee",
        tab_scan: "📸 Scan QR",
        tab_generate: "✨ Create QR",
        btn_open_cam: "Start Camera",
        btn_close_cam: "Stop Camera",
        btn_upload: "Upload Image",
        result_label: "Result:",
        label_text: "Text or URL:",
        placeholder_text: "Type your text here...",
        btn_create: "✨ Generate QR Code",
        save_hint: "Right click or long press to save image.",
        howto_title: "How to Use",
        step1_title: "1. Select Mode",
        step1_desc: "Choose between scanning a QR code or creating a new one.",
        step2_title: "2. Action",
        step2_desc: "To scan, point the camera. To create, type text and hit the button.",
        step3_title: "3. Result",
        step3_desc: "Works instantly on your browser. Secure and fast.",
        header_desc: "Scan and Generate QR Codes instantly Free 100%",
        footer_credit: "Developed by Yutthana Pumamob"
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'th' ? 'en' : 'th';
    updateText();
}

function updateText() {
    const t = translations[currentLang];

    // อัปเดตข้อความทั่วไป
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });

    // อัปเดต Placeholder
    const inputEl = document.getElementById('qr-text');
    if (inputEl) inputEl.placeholder = t.placeholder_text;

    // อัปเดตปุ่มภาษา
    document.getElementById('current-lang').innerText = currentLang === 'th' ? 'EN' : 'TH';

    // อัปเดตสถานะปุ่มกล้อง
    updateButtonUI();
}

// 1. จัดการ TABS
function switchTab(tabName) {
    const scanSection = document.getElementById('scan-section');
    const generateSection = document.getElementById('generate-section');
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => btn.classList.remove('active'));

    if (tabName === 'scan') {
        tabBtns[0].classList.add('active');
        scanSection.classList.remove('hidden');
        generateSection.classList.add('hidden');
        startScanner();
    } else {
        tabBtns[1].classList.add('active');
        scanSection.classList.add('hidden');
        generateSection.classList.remove('hidden');
        stopScanner();
    }
}

// 2. SCANNER LOGIC (Camera)
function getHtml5QrCode() {
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }
    return html5QrCode;
}

function startScanner() {
    const scanner = getHtml5QrCode();
    if (isScanning) return;

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    scanner.start({ facingMode: "environment" }, config, onScanSuccess)
        .then(() => {
            isScanning = true;
            updateButtonUI();
        })
        .catch(err => {
            console.error("Error starting camera", err);
            // alert("ไม่สามารถเปิดกล้องได้ (กรุณาอนุญาตการเข้าถึงกล้อง)");
        });
}

function stopScanner() {
    if (html5QrCode && isScanning) {
        html5QrCode.stop().then(() => {
            isScanning = false;
            updateButtonUI();
        }).catch(err => console.error(err));
    }
}

function toggleCamera() {
    if (isScanning) {
        stopScanner();
    } else {
        startScanner();
    }
}

function updateButtonUI() {
    const btn = document.getElementById('cam-toggle-btn');
    if (!btn) return;
    
    const t = translations[currentLang];
    
    // SVG Icons
    const iconCameraOn = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;
    const iconCameraOff = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21l-2-2m-3.268-3.268A6 6 0 0 0 5 9H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.5"></path><path d="M1 1l22 22"></path></svg>`;

    if (isScanning) {
        btn.innerHTML = `${iconCameraOff} <span>${t.btn_close_cam}</span>`;
        btn.className = "cam-btn stop";
    } else {
        btn.innerHTML = `${iconCameraOn} <span>${t.btn_open_cam}</span>`;
        btn.className = "cam-btn start";
    }
}

// 3. SCANNER LOGIC (File Upload)
// ฟังก์ชันกดปุ่ม Upload แล้วปิดกล้องอัตโนมัติ
function triggerUpload() {
    if (isScanning) {
        stopScanner();
    }
    document.getElementById('qr-input-file').click();
}

function scanFromFile(inputElement) {
    if (inputElement.files.length === 0) return;

    const imageFile = inputElement.files[0];
    const scanner = getHtml5QrCode();

    const performScan = () => {
        scanner.scanFile(imageFile, true)
        .then(decodedText => {
            onScanSuccess(decodedText);
            inputElement.value = ''; 
        })
        .catch(err => {
            alert("ไม่พบ QR Code ในรูปภาพนี้ หรือภาพไม่ชัดเจน");
            console.error(err);
            inputElement.value = ''; 
        });
    };

    if (isScanning) {
        html5QrCode.stop().then(() => {
            isScanning = false;
            updateButtonUI();
            performScan();
        }).catch(() => performScan());
    } else {
        performScan();
    }
}

// ฟังก์ชันเช็คว่าเป็น URL หรือไม่ (เพื่อตัดสินใจว่าจะโชว์ปุ่ม "เปิดลิงก์" ไหม)
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}

// 4. COMMON SUCCESS HANDLER (พร้อมแก้ภาษาต่างดาว)
function onScanSuccess(decodedText) {
    console.log(`Scan Result (Raw): ${decodedText}`);
    
    // 1. หยุดกล้องทันทีที่เจอ QR Code
    if (isScanning) {
        stopScanner();
    }

    // 2. แก้ภาษาต่างดาว (Decode Latin-1 to UTF-8)
    let finalText = decodedText;
    try {
        finalText = decodeURIComponent(escape(decodedText));
    } catch (err) {
        console.log("Using raw text");
    }

    // 3. ตรวจสอบว่าเป็น Link หรือไม่
    const isLink = isValidUrl(finalText) || finalText.startsWith('http') || finalText.startsWith('www');

    // 4. แสดง Popup ผลลัพธ์
    Swal.fire({
        title: currentLang === 'th' ? 'ผลการสแกน' : 'Scan Result',
        // สร้าง HTML เอง เพื่อคุมปุ่มไม่ให้ปิด Popup
        html: `
            <div style="text-align: left; margin-bottom: 5px; font-weight: bold; color: #333;">
                ${currentLang === 'th' ? 'เนื้อหา' : 'Content'}
            </div>
            <div style="
                background: #f4f4f5; 
                padding: 15px; 
                border-radius: 10px; 
                color: #1f2937; 
                font-size: 1rem; 
                word-break: break-all;
                text-align: left;
                border: 1px solid #e5e7eb;
                margin-bottom: 20px;
                max-height: 200px;
                overflow-y: auto;
            ">
                ${finalText}
            </div>

            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="btn-copy" style="
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 6px;
                    background-color: #9ca3af;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: 0.2s;
                ">
                    <i class="far fa-copy"></i> ${currentLang === 'th' ? 'คัดลอก' : 'Copy'}
                </button>

                ${isLink ? `
                <button id="btn-open" style="
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 6px;
                    background-color: #65a30d;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: 0.2s;
                ">
                    <i class="fas fa-external-link-alt"></i> ${currentLang === 'th' ? 'เปิดลิงก์' : 'Open'}
                </button>
                ` : ''}
            </div>
        `,
        showConfirmButton: false, // ปิดปุ่ม OK มาตรฐาน
        showCancelButton: false,  // ปิดปุ่ม Cancel มาตรฐาน
        showCloseButton: true,    // ✅ โชว์ปุ่มกากบาท (X) มุมขวาบน
        allowOutsideClick: false, // ห้ามกดพื้นหลังเพื่อปิด
        
        // สั่งงานปุ่มที่เราสร้างเอง
        didOpen: () => {
            // ตั้งค่าปุ่ม Copy
            const btnCopy = document.getElementById('btn-copy');
            if(btnCopy) {
                btnCopy.addEventListener('click', () => {
                    navigator.clipboard.writeText(finalText).then(() => {
                        // เปลี่ยนสีและข้อความปุ่มชั่วคราว
                        const originalText = btnCopy.innerHTML;
                        btnCopy.innerHTML = `<i class="fas fa-check"></i> ${currentLang === 'th' ? 'เรียบร้อย' : 'Copied'}`;
                        btnCopy.style.backgroundColor = '#10b981'; // สีเขียว
                        
                        setTimeout(() => {
                            btnCopy.innerHTML = originalText;
                            btnCopy.style.backgroundColor = '#9ca3af'; // กลับสีเทา
                        }, 1500);
                    });
                });
            }

            // ตั้งค่าปุ่ม Open Link
            const btnOpen = document.getElementById('btn-open');
            if(btnOpen) {
                btnOpen.addEventListener('click', () => {
                    window.open(finalText, '_blank');
                });
            }
        }
    }).then((result) => {
        // --------------------------------------------------------
        // เช็คว่า Popup ถูกปิดลงหรือไม่ (กด X หรือกด ESC)
        // --------------------------------------------------------
        if (result.isDismissed) {
            console.log("Popup closed, restarting scanner...");
            startScanner(); // เปิดกล้องใหม่อีกครั้งทันที
        }
    });
}

// 5. GENERATOR LOGIC (ใช้ node-qrcode รองรับภาษาไทยสมบูรณ์)
function generateQR() {
    const inputText = document.getElementById('qr-text').value;
    const container = document.getElementById('qrcode-output');
    const wrapper = document.getElementById('qrcode-output-container');

    if (!inputText.trim()) {
        alert("กรุณาพิมพ์ข้อความก่อน");
        return;
    }

    container.innerHTML = ""; 
    wrapper.classList.remove('hidden');

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    // Library นี้จัดการภาษาไทยให้เองอัตโนมัติ
    QRCode.toCanvas(canvas, inputText, { 
        width: 200,
        margin: 2,
        color: {
            dark: "#000000",
            light: "#ffffff"
        }
    }, function (error) {
        if (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการสร้าง QR Code");
        } else {
            console.log('สร้าง QR Code สำเร็จ!');
        }
    });
}

// 6. DONATE BUTTON LOGIC (PromptPay + Ko-fi)
function setupDonateButton() {
    const donateBtn = document.getElementById('donateBtn');
    
    if (donateBtn) {
        donateBtn.addEventListener('click', () => {
            // ========================================================
            // ⚠️ ข้อมูลของคุณ
            // ========================================================
            const myPromptPay = "0825559797";      
            const myKofiUrl = "https://ko-fi.com/yutthana"; // อย่าลืมใส่ URL ของคุณ
            
            // เพิ่มชื่อบัญชีตรงนี้
            const myNameTH = "ยุทธนา ภูมามอบ";
            const myNameEN = "Yutthana Pumamob";
            // ========================================================

            Swal.fire({
                title: currentLang === 'th' ? '☕ เลี้ยงกาแฟผู้พัฒนา' : '☕ Buy me a coffee',
                html: `
                    <div style="text-align: center; font-size: 0.95rem; color: #555; margin-bottom: 20px;">
                        ${currentLang === 'th' 
                            ? 'เลือกช่องทางที่คุณสะดวกได้เลยครับ ^^' 
                            : 'Choose your preferred payment method'}
                    </div>

                    <div style="background: #f0fdf4; padding: 15px; border-radius: 12px; border: 1px dashed #22c55e; margin-bottom: 15px;">
                        <div style="font-weight: bold; color: #15803d; margin-bottom: 5px;">
                            <i class="fas fa-qrcode"></i> Thai PromptPay
                        </div>
                        <img src="https://promptpay.io/${myPromptPay}" style="width: 180px; mix-blend-mode: multiply;">
                        
                        <div style="font-size: 0.9rem; font-weight: bold; color: #333; margin-top: 8px;">
                            PromptPay: ${myPromptPay}
                        </div>
                        
                        <div style="font-size: 0.85rem; color: #666;">
                            ${currentLang === 'th' ? 'ชื่อ: ' + myNameTH : 'Name: ' + myNameEN}
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 15px 0;">
                        <div style="height: 1px; background: #ddd; flex: 1;"></div>
                        <span style="color: #999; font-size: 0.8rem;">OR</span>
                        <div style="height: 1px; background: #ddd; flex: 1;"></div>
                    </div>

                    <a href="${myKofiUrl}" target="_blank" style="text-decoration: none;">
                        <button style="
                            width: 100%;
                            background-color: #29abe0;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 50px;
                            font-weight: bold;
                            font-size: 1rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            cursor: pointer;
                            box-shadow: 0 4px 6px rgba(41, 171, 224, 0.3);
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            <i class="fas fa-mug-hot"></i> Support on Ko-fi
                        </button>
                    </a>
                `,
                showConfirmButton: false,
                showCloseButton: true,
                width: 480, // ใช้ขนาดกว้างหน่อย ข้อความจะได้ไม่ตกบรรทัด
                padding: '20px'
            });
        });
    }
}

// Initial Run
document.addEventListener('DOMContentLoaded', () => {
    updateText();
    switchTab('scan');
    setupDonateButton();
});