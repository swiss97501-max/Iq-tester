// ----- คำถามเปิด 10 ข้อ -----
const openQuestions = [
"ถ้าเกิดไฟไหม้ในบ้าน คุณจะทำอย่างไรเพื่อความปลอดภัยของตัวเองและผู้อื่น?",
"หากคุณพบเพื่อนที่เศร้า คุณจะช่วยให้เขารู้สึกดีขึ้นได้อย่างไร?",
"ถ้ารถคุณเสียกลางทาง คุณจะจัดการอย่างไรเพื่อให้ถึงที่หมาย?",
"หากคุณมีโอกาสลงทุน คุณจะตัดสินใจเลือกอะไรและทำไม?",
"ถ้าเพื่อนลืมวันสำคัญของคุณ คุณจะทำอย่างไร?",
"ถ้าเกิดปัญหาในทีมงาน คุณจะแก้ไขความขัดแย้งอย่างไร?",
"คุณจะวางแผนการเรียนหรือทำงานอย่างไรเพื่อให้มีประสิทธิภาพสูงสุด?",
"ถ้าต้องแก้ปัญหาความขัดแย้งระหว่างเพื่อน คุณจะทำอย่างไร?",
"หากต้องตัดสินใจเรื่องสำคัญโดยมีเวลาจำกัด คุณจะทำอย่างไร?",
"ถ้าพบว่าข้อมูลที่ใช้ในการตัดสินใจผิด คุณจะปรับแผนอย่างไร?"
];

// ----- คำถามปิด 100 ข้อ -----
const closedQuestions = [
"1 2 4 8 ?","2 4 8 16 ?","3 6 12 24 ?","5 10 20 40 ?","1 4 9 16 ?",
"2 5 10 17 ?","10 20 40 80 ?","1 3 6 10 ?","2 6 12 20 ?","1 3 5 7 ?",
"23=5 45=9 78=?","123=77 243=157 435=?","12 24 36 ?","7 14 28 56 ?","9 18 36 72 ?",
"4 8 16 32 ?","5 15 45 135 ?","6 12 18 24 ?","8 16 32 64 ?","11 22 44 88 ?",
"2 5 11 23 ?","1 2 6 24 ?","3 9 27 81 ?","2 6 12 20 ?","5 7 10 14 ?",
"1 1 2 3 5 ?","0 1 1 2 3 ?","2 4 8 16 ?","3 6 12 24 ?","1 2 4 8 ?",
"13 26 52 104 ?","14 28 56 112 ?","15 30 60 120 ?","16 32 64 128 ?","17 34 68 136 ?",
"18 36 72 144 ?","19 38 76 152 ?","20 40 80 160 ?","21 42 84 168 ?","22 44 88 176 ?"
];

// ----- สุ่ม 10 คำถามปิด -----
function getRandomClosedQuestions(n){
    let shuffled = closedQuestions.sort(()=>0.5-Math.random());
    return shuffled.slice(0,n);
}

// ----- ตัวแปร global -----
const totalQuestions = openQuestions.length + 10;
let answers = [];
let allQuestions = [];

// ----- เริ่มทดสอบ -----
function startTest(){
    document.getElementById("profile").style.display="none";
    document.getElementById("test").style.display="block";
    const form = document.getElementById("questionForm");
    form.innerHTML="";
    const randomClosed = getRandomClosedQuestions(10);
    allQuestions = [...openQuestions, ...randomClosed];
    allQuestions.forEach((q,i)=>{
        const div = document.createElement("div");
        div.className="question-box";
        div.innerHTML = `<label>Q${i+1}: ${q}</label>
        <textarea id="answer${i}" rows="2" oninput="updateProgress()"></textarea>`;
        form.appendChild(div);
    });
    updateProgress();
}

// ----- อัปเดต progress -----
function updateProgress(){
    let answered = 0;
    for(let i=0;i<totalQuestions;i++){
        if(document.getElementById(`answer${i}`).value.trim()!="") answered++;
    }
    document.getElementById("progress").innerText=`ตอบไป ${answered}/${totalQuestions} ข้อ`;
}

// ----- ส่งคำตอบและประเมิน -----
function submitTest(){
    answers = [];
    for(let i=0;i<totalQuestions;i++){
        answers.push(document.getElementById(`answer${i}`).value.trim());
    }

    // ----- ประเมิน skill แบบตัวอย่าง -----
    let skill = {
        Logic: Math.floor(Math.random()*100),
        Math: Math.floor(Math.random()*100),
        Verbal: Math.floor(Math.random()*100),
        Spatial: Math.floor(Math.random()*100),
        Memory: Math.floor(Math.random()*100),
        Creativity: Math.floor(Math.random()*100)
    };

    // ----- คำนวณ IQ ประมาณ -----
    let iq = 50 + Math.round((skill.Logic + skill.Math + skill.Verbal + skill.Spatial + skill.Memory + skill.Creativity)/6*2);

    // แสดงผล
    document.getElementById("test").style.display="none";
    document.getElementById("result").style.display="block";

    // ----- สร้าง radar chart -----
    const ctx = document.getElementById('iqChart').getContext('2d');
    new Chart(ctx,{
        type:'radar',
        data:{
            labels:["Logic","Math","Verbal","Spatial","Memory","Creativity"],
            datasets:[{
                label:`IQ ประมาณ: ${iq}`,
                data:[skill.Logic,skill.Math,skill.Verbal,skill.Spatial,skill.Memory,skill.Creativity],
                backgroundColor:'rgba(54,162,235,0.2)',
                borderColor:'rgba(54,162,235,1)',
                borderWidth:2,
                pointBackgroundColor:'rgba(54,162,235,1)'
            }]
        },
        options:{
            scales:{r:{min:0,max:100,ticks:{stepSize:20}}},
            plugins:{legend:{position:'top'}}
        }
    });

    document.getElementById("summary").innerHTML=`<p>ตอบคำถามทั้งหมด ${totalQuestions} ข้อแล้ว</p>`;
}
