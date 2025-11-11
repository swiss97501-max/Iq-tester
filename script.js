/* ==========================
   ตัวแปรเริ่มต้น
   ========================== */
let currentQuestion = 0;
let userAnswers = [];
let totalQuestions = logicQuestions.length + openQuestions.length;
let iqScore = 0;

/* ==========================
   สุ่มคำถามผสม Logic + Open
   ========================== */
let allQuestions = [...logicQuestions, ...openQuestions];

/* ==========================
   เริ่มการทดสอบ
   ========================== */
function startTest() {
    // ตรวจ honeypot
    if(document.getElementById("hp_field").value !== "") {
        alert("Bot detected! การทดสอบถูกยกเลิก");
        return;
    }

    document.getElementById("profileSection").style.display = "none";
    document.getElementById("quizSection").style.display = "block";

    currentQuestion = 0;
    userAnswers = [];
    showQuestion();
}

/* ==========================
   แสดงคำถาม
   ========================== */
function showQuestion() {
    document.getElementById("questionText").innerText = allQuestions[currentQuestion];
    document.getElementById("questionBox").value = "";

    document.getElementById("progress").innerText = `ข้อที่ ${currentQuestion+1}/${totalQuestions}`;
    document.getElementById("progressBar").style.width = `${((currentQuestion)/totalQuestions)*100}%`;
}

/* ==========================
   ไปข้อต่อไป
   ========================== */
function nextQuestion() {
    const ans = document.getElementById("questionBox").value.trim();
    if(ans === "") {
        alert("กรุณาพิมพ์คำตอบก่อน");
        return;
    }
    userAnswers.push(ans);
    currentQuestion++;

    if(currentQuestion >= totalQuestions) {
        finishTest();
    } else {
        showQuestion();
    }
}

/* ==========================
   จบการทดสอบ
   ========================== */
function finishTest() {
    document.getElementById("quizSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";

    // คำนวณ IQ แบบสมมุติ (ตัวอย่าง)
    // Logic Questions 1 ข้อ = 10 คะแนน, Open Questions = 5 คะแนน
    let logicCorrect = 0;
    for(let i=0;i<logicQuestions.length;i++) {
        if(userAnswers[i] !== "") logicCorrect += 1; // placeholder, ในเว็บจริงต้องตรวจคำตอบจริง
    }
    let openScore = (userAnswers.length - logicQuestions.length) * 5;

    iqScore = Math.min(270, Math.round((logicCorrect*10 + openScore) * 270 / (logicQuestions.length*10 + openQuestions.length*5)));
    document.getElementById("iqScore").innerText = iqScore;

    // แสดง radar chart
    const ctx = document.getElementById('iqChart').getContext('2d');
    const data = {
        labels: ['Logic', 'Math', 'Verbal', 'Spatial', 'Memory', 'Creativity'],
        datasets: [{
            label: 'Skill Profile',
            data: [
                Math.min(100, logicCorrect*10),       // Logic
                Math.min(100, logicCorrect*8),        // Math
                Math.min(100, openScore*2),           // Verbal
                Math.min(100, logicCorrect*6),        // Spatial
                Math.min(100, openScore*3),           // Memory
                Math.min(100, openScore*4)            // Creativity
            ],
            backgroundColor: 'rgba(0,224,255,0.2)',
            borderColor: '#00e0ff',
            borderWidth: 2,
            pointBackgroundColor: '#00ffaa'
        }]
    };
    new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            scales: {
                r: {
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}
