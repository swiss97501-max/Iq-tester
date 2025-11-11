// ====== DATA ======
const logicQuestions = [
    { q: "135 = 65, 254 = 136, 312 = ?", a: "288" },
    { q: "12, 23, 34, 45, ?", a: "56" },
    { q: "7, 14, 28, 56, ?", a: "112" },
    { q: "2, 3, 5, 9, 17, ?", a: "33" },
    { q: "1, 4, 9, 16, 25, ?", a: "36" },
    { q: "3, 6, 12, 24, 48, ?", a: "96" },
    { q: "1, 2, 6, 24, 120, ?", a: "720" },
    { q: "2, 5, 10, 17, 26, ?", a: "37" },
    { q: "1, 1, 2, 6, 24, ?", a: "120" },
    { q: "4, 9, 19, 39, 79, ?", a: "159" }
];

const openQuestions = [
    { q: "ถ้าคุณพบปัญหาซับซ้อน คุณจะจัดการอย่างไร?", a: "" },
    { q: "เล่าประสบการณ์ที่คุณคิดว่าใช้ความคิดสร้างสรรค์สูงสุด", a: "" },
    { q: "ถ้าคุณต้องตัดสินใจในสถานการณ์ยากๆ คุณจะทำอย่างไร?", a: "" },
    { q: "คุณจะแก้ปัญหาที่ทีมไม่เห็นด้วยได้อย่างไร?", a: "" },
    { q: "จงอธิบายวิธีคิดเชิงตรรกะของคุณในการแก้โจทย์", a: "" }
];

const allQuestions = [...logicQuestions, ...openQuestions];
let currentQuestionIndex = 0;
let answers = Array(allQuestions.length).fill("");

// ====== DOM Elements ======
const profileForm = document.getElementById("profile-form");
const quizSection = document.getElementById("quiz-section");
const profileSection = document.getElementById("profile-section");
const resultSection = document.getElementById("result-section");
const certificateSection = document.getElementById("certificate-section");

const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressFill = document.getElementById("progress-fill");

const resultName = document.getElementById("result-name");
const iqScore = document.getElementById("iq-score");
const radarCanvas = document.getElementById("radarChart");

const downloadBtn = document.getElementById("download-btn");

const certName = document.getElementById("cert-name");
const certIq = document.getElementById("cert-iq");
const certDate = document.getElementById("cert-date");
const pdfBtn = document.getElementById("pdf-btn");

// Slider values display
const ageSlider = document.getElementById("age");
const weightSlider = document.getElementById("weight");
const heightSlider = document.getElementById("height");
const ageValue = document.getElementById("age-value");
const weightValue = document.getElementById("weight-value");
const heightValue = document.getElementById("height-value");

ageSlider.oninput = () => ageValue.textContent = ageSlider.value;
weightSlider.oninput = () => weightValue.textContent = weightSlider.value;
heightSlider.oninput = () => heightValue.textContent = heightSlider.value;

// ====== FUNCTIONS ======
function showQuestion() {
    const q = allQuestions[currentQuestionIndex];
    questionText.textContent = `คำถาม ${currentQuestionIndex + 1}: ${q.q}`;
    answerInput.value = answers[currentQuestionIndex] || "";
    const progressPercent = ((currentQuestionIndex) / allQuestions.length) * 100;
    progressFill.style.width = progressPercent + "%";
}

function saveAnswer() {
    answers[currentQuestionIndex] = answerInput.value.trim();
}

// Navigation buttons
prevBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestionIndex > 0) currentQuestionIndex--;
    showQuestion();
});

nextBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestionIndex < allQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
});

// ====== PROFILE FORM SUBMIT ======
profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(profileForm.email.value) return alert("Bot detected!");
    profileSection.classList.remove("active");
    quizSection.classList.add("active");
    showQuestion();
});

// ====== CALCULATE IQ ======
function calculateIQ() {
    let logicScore = 0;
    logicQuestions.forEach((q, i) => {
        if (answers[i].replace(/\s+/g,'') === q.a) logicScore++;
    });
    let openScore = openQuestions.length; // สมมุติเต็ม score
    let totalScore = ((logicScore / logicQuestions.length) * 60 + (openScore / openQuestions.length) * 40);
    let iq = Math.round(50 + totalScore * (220/100));
    return iq;
}

// ====== SHOW RESULT ======
function finishQuiz() {
    saveAnswer();
    quizSection.classList.remove("active");
    resultSection.classList.add("active");

    const userName = document.getElementById("user-name").value;
    const iq = calculateIQ();

    resultName.textContent = userName;
    iqScore.textContent = iq;

    // Radar chart
    const radarData = {
        labels: ["Logic", "Math", "Verbal", "Spatial", "Memory", "Creativity"],
        datasets: [{
            label: "Skill Radar",
            data: [logicQuestions.length*10, logicQuestions.length*10, 70, 80, 75, 90],
            backgroundColor: "rgba(0, 255, 255, 0.2)",
            borderColor: "cyan",
            borderWidth: 2,
            pointBackgroundColor: "cyan"
        }]
    };
    new Chart(radarCanvas, {
        type: 'radar',
        data: radarData,
        options: {
            scales: {
                r: { beginAtZero: true, max: 100 }
            }
        }
    });

    // Certificate
    certName.textContent = userName;
    certIq.textContent = iq;
    certDate.textContent = new Date().toLocaleDateString();
}

// ====== DOWNLOAD CERTIFICATE PDF ======
pdfBtn.addEventListener("click", () => {
    if(!certName.textContent) return alert("ไม่มีข้อมูล Certificate!");
    const doc = new window.jspdf.jsPDF(); // แก้ตรงนี้
    doc.setFontSize(24);
    doc.text("Certificate", 105, 30, { align: "center" });
    doc.setFontSize(16);
    doc.text(`ชื่อ: ${certName.textContent}`, 20, 50);
    doc.text(`IQ: ${certIq.textContent}`, 20, 60);
    doc.text(`วันที่ทดสอบ: ${certDate.textContent}`, 20, 70);
    doc.save(`${certName.textContent}_IQ_Certificate.pdf`);
});
