/* ==========================
   Swiss IQ Tester v3.0
   By Swiss Russameekiattisak
   ========================== */

// ----------- ค่าพื้นฐาน -----------
let currentQuestion = 0;
let answers = [];
let totalQuestions = 10;
let profile = {};
let startTime = 0;

// ----------- ป้องกันสแปม/บอท -----------
function checkRateLimit(max = 5, sec = 60) {
  const key = 'iq_times';
  const now = Date.now();
  let arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr = arr.filter(t => now - t < sec * 1000);
  if (arr.length >= max) return false;
  arr.push(now);
  localStorage.setItem(key, JSON.stringify(arr));
  return true;
}

// honeypot ตรวจบอท
function checkBot() {
  const hp = document.getElementById('hp_field');
  return hp && hp.value.trim() !== "";
}

// ----------- ระบบเริ่มต้น -----------
const logicQuestions = [
  "12, 24, 48, 96, ?",
  "2, 6, 18, 54, ?",
  "23 = 5, 45 = 9, 78 = ?",
  "ถ้ารถคันหนึ่งวิ่งด้วย 60 กม./ชม. ไป 2 ชม. แล้วอีกคันวิ่ง 80 กม./ชม. ไป 1.5 ชม. ใครไกลกว่า?",
  "123 = 77, 243 = 157, 435 = ?"
];

const openQuestions = [
  "ถ้าคุณถูกบังคับให้แก้ปัญหาที่ไม่มีทางแก้ คุณจะเริ่มจากตรงไหน?",
  "หากคุณถูกทิ้งไว้บนเกาะร้าง มีเวลา 24 ชั่วโมง คุณจะทำอย่างไรให้รอดชีวิต?",
  "คุณจะจัดการกับเพื่อนร่วมทีมที่ไม่ทำงานแต่ได้เครดิตเท่าคุณอย่างไร?",
  "ถ้า AI ควบคุมโลก คุณจะหาวิธีสื่อสารหรือโต้แย้งมันอย่างไร?",
  "จงออกแบบวิธีเรียนรู้สิ่งใหม่โดยไม่มีหนังสือหรืออินเทอร์เน็ต"
];

// ----------- โหลดคำถาม -----------
function loadQuestion() {
  const qBox = document.getElementById("questionBox");
  const qText = document.getElementById("questionText");
  const progress = document.getElementById("progress");
  const btnNext = document.getElementById("btnNext");

  let q;
  if (currentQuestion < logicQuestions.length) {
    q = logicQuestions[currentQuestion];
  } else {
    q = openQuestions[currentQuestion - logicQuestions.length];
  }

  qText.innerText = `ข้อ ${currentQuestion + 1}: ${q}`;
  progress.innerText = `ข้อที่ ${currentQuestion + 1}/${totalQuestions}`;
  qBox.value = "";
  btnNext.innerText = currentQuestion === totalQuestions - 1 ? "ส่งผลการทดสอบ" : "ข้อต่อไป";
}

// ----------- กดถัดไป / ส่ง -----------
function nextQuestion() {
  if (checkBot()) {
    alert("การกระทำถูกบล็อก (สงสัยว่าเป็นบอท)");
    return;
  }
  if (!checkRateLimit()) {
    alert("คุณตอบเร็วเกินไป กรุณารอสักครู่");
    return;
  }

  const ans = document.getElementById("questionBox").value.trim();
  if (!ans) {
    alert("กรุณาตอบก่อนไปต่อ");
    return;
  }

  answers.push(ans);
  currentQuestion++;

  if (currentQuestion < totalQuestions) {
    loadQuestion();
  } else {
    endTest();
  }
}

// ----------- ประเมินผล IQ -----------
function endTest() {
  const elapsed = (Date.now() - startTime) / 1000;
  const avgLen = answers.reduce((a,b)=>a+b.length,0)/answers.length;

  // วิเคราะห์ง่ายๆ: ยาว, มีตรรกะ, ไม่ซ้ำ, เวลานาน -> IQ สูง
  let iq = 80 + (avgLen / 5) + Math.min(elapsed/8,100);
  if (iq > 270) iq = 270;

  const detail = {
    Logic: (Math.random()*50 + iq/5),
    Math: (Math.random()*40 + iq/6),
    Verbal: (avgLen/3 + 40),
    Spatial: (Math.random()*30 + iq/8),
    Memory: (Math.random()*40 + 30),
    Creativity: (Math.random()*50 + iq/7)
  };

  renderRadar(detail, iq);
}

// ----------- Radar Chart -----------
function renderRadar(detail, iq) {
  document.getElementById("quizSection").style.display = "none";
  document.getElementById("resultSection").style.display = "block";
  document.getElementById("iqScore").innerText = Math.round(iq);

  const ctx = document.getElementById("iqChart").getContext("2d");
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ["Logic","Math","Verbal","Spatial","Memory","Creativity"],
      datasets: [{
        label: "Skill Profile",
        data: [
          detail.Logic, detail.Math, detail.Verbal,
          detail.Spatial, detail.Memory, detail.Creativity
        ],
        fill: true,
        backgroundColor: "rgba(54,162,235,0.3)",
        borderColor: "rgb(54,162,235)",
        pointBackgroundColor: "rgb(54,162,235)"
      }]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 20 }
        }
      }
    }
  });
}

// ----------- เริ่มทดสอบ -----------
function startTest() {
  const name = document.getElementById("name").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);

  if (!name || !age || !weight || !height) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  profile = { name, age, weight, height };
  startTime = Date.now();
  document.getElementById("profileSection").style.display = "none";
  document.getElementById("quizSection").style.display = "block";
  loadQuestion();
}

// ----------- เมื่อโหลดหน้าเว็บ -----------
window.onload = () => {
  loadSelectors();
};

// ----------- สร้างตัวเลือกอายุ/ส่วนสูง/น้ำหนัก -----------
function loadSelectors() {
  const ageSel = document.getElementById("age");
  const hSel = document.getElementById("height");
  const wSel = document.getElementById("weight");

  for (let i=1;i<=140;i++){
    const opt = document.createElement("option");
    opt.value = i; opt.text = i;
    ageSel.appendChild(opt);
  }
  for (let i=30;i<=250;i++){
    const opt = document.createElement("option");
    opt.value = i; opt.text = i;
    hSel.appendChild(opt);
  }
  for (let i=3;i<=250;i++){
    const opt = document.createElement("option");
    opt.value = i; opt.text = i;
    wSel.appendChild(opt);
  }
}
