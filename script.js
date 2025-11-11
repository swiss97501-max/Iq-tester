/* ==========================
   ตัวแปรเริ่มต้น
   ========================== */
let currentQuestion = 0;
let userAnswers = [];
let totalQuestions = 15; // Logic 10 + Open 5
let iqScore = 0;

const logicQuestions = [
  "2, 3, 5, 9, 17, 33, ?",
  "12 → 21, 23 → 38, 34 → 57, 45 → ?",
  "1, 2, 6, 21, 88, ?",
  "[1 2; 3 4] → 10, [2 3; 4 5] → 14, [3 4; 5 6] → ?",
  "15 → 7, 28 → 13, 45 → 19, 66 → ?",
  "1, 2, 4, 12, 48, 240, ?",
  "1, 1, 2, 6, 24, 120, 720, 5040, ?",
  "7, 14, 28, 56, 112, ?",
  "5, 10, 20, 40, 80, ?",
  "11, 23, 47, 95, 191, ?"
];

const openQuestions = [
  "ถ้าคุณถูกบังคับให้แก้ปัญหาที่ไม่มีทางแก้ คุณจะเริ่มจากตรงไหน?",
  "หากคุณถูกทิ้งไว้บนเกาะร้าง มีเวลา 24 ชั่วโมง คุณจะทำอย่างไรให้รอดชีวิต?",
  "คุณจะจัดการกับเพื่อนร่วมทีมที่ไม่ทำงานแต่ได้เครดิตเท่าคุณอย่างไร?",
  "ถ้า AI ควบคุมโลก คุณจะหาวิธีสื่อสารหรือโต้แย้งมันอย่างไร?",
  "จงออกแบบวิธีเรียนรู้สิ่งใหม่โดยไม่มีหนังสือหรืออินเทอร์เน็ต"
];

let allQuestions = [...logicQuestions, ...openQuestions];

/* ==========================
   สร้าง dropdown เลือกข้อมูล
   ========================== */
window.onload = () => {
  const ageSel = document.getElementById("age");
  const hSel = document.getElementById("height");
  const wSel = document.getElementById("weight");
  for(let i=1;i<=140;i++){ ageSel.appendChild(new Option(i,i)); }
  for(let i=30;i<=250;i++){ hSel.appendChild(new Option(i,i)); }
  for(let i=3;i<=250;i++){ wSel.appendChild(new Option(i,i)); }
};

/* ==========================
   เริ่มการทดสอบ
   ========================== */
function startTest() {
    const userName = document.getElementById("name").value.trim();
    if(userName === "") { alert("กรุณาใส่ชื่อของคุณก่อนเริ่มทดสอบ"); return; }

    if(document.getElementById("hp_field").value !== "") {
        alert("Bot detected! การทดสอบถูกยกเลิก");
        return;
    }

    document.getElementById("profileSection").style.display = "none";
    document.getElementById("quizSection").style.display = "block";

    currentQuestion = 0;
    userAnswers = [];
    showQuestion();

    document.querySelector("#resultSection h2").innerText = `${userName} — ผลการทดสอบ IQ ของคุณ`;
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
    if(ans === "") { alert("กรุณาพิมพ์คำตอบก่อน"); return; }
    userAnswers.push(ans);
    currentQuestion++;

    if(currentQuestion >= totalQuestions) { finishTest(); }
    else { showQuestion(); }
}

/* ==========================
   จบการทดสอบ
   ========================== */
function finishTest() {
    document.getElementById("quizSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";

    // สมมุติ IQ คำนวณ
    let logicCorrect = 0;
    for(let i=0;i<logicQuestions.length;i++){
        if(userAnswers[i]!=="") logicCorrect+=1;
    }
    let openScore = (userAnswers.length - logicQuestions.length)*5;

    iqScore = Math.min(270, Math.round((logicCorrect*10 + openScore)*270/(logicQuestions.length*10 + openQuestions.length*5)));
    document.getElementById("iqScore").innerText = iqScore;

    // Radar chart
    const ctx = document.getElementById('iqChart').getContext('2d');
    const data = {
        labels: ['Logic','Math','Verbal','Spatial','Memory','Creativity'],
        datasets:[{
            label:'Skill Profile',
            data:[
                Math.min(100, logicCorrect*10),
                Math.min(100, logicCorrect*8),
                Math.min(100, openScore*2),
                Math.min(100, logicCorrect*6),
                Math.min(100, openScore*3),
                Math.min(100, openScore*4)
            ],
            backgroundColor:'rgba(0,224,255,0.2)',
            borderColor:'#00e0ff',
            borderWidth:2,
            pointBackgroundColor:'#00ffaa'
        }]
    };
    new Chart(ctx,{type:'radar',data:data,options:{responsive:true,scales:{r:{suggestedMin:0,suggestedMax:100}}}});

    // Certificate
    const userName = document.getElementById("name").value.trim();
    document.getElementById("certName").innerText = userName;
    document.getElementById("certIQ").innerText = iqScore;
    document.getElementById("certDate").innerText = new Date().toLocaleDateString();
    document.getElementById("certificate").style.display="block";
}

/* ==========================
   สร้าง Certificate PDF
   ========================== */
function generateCertificate() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape','pt','a4');

    const name=document.getElementById("certName").innerText;
    const iq=document.getElementById("certIQ").innerText;
    const date=document.getElementById("certDate").innerText;

    doc.setFontSize(36); doc.setTextColor(0,224,255);
    doc.text("Certificate of IQ Test", 300, 100, {align:'center'});

    doc.setFontSize(24); doc.setTextColor(255,255,255);
    doc.text(`ผู้ทดสอบ: ${name}`, 300, 200, {align:'center'});
    doc.text(`IQ Score: ${iq}`, 300, 260, {align:'center'});
    doc.text(`วันที่ทดสอบ: ${date}`, 300, 320, {align:'center'});

    doc.setDrawColor(0,224,255); doc.setLineWidth(3);
    doc.rect(50,50,700,400,'S');

    doc.save(`${name}_IQ_Certificate.pdf`);
}
