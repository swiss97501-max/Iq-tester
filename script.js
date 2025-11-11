let questions = [
    {q:"2 + 3 * 4 = ?", type:"math"},
    {q:"ต่อไปนี้ตัวไหนไม่เหมือนกัน: แมว, สุนัข, รถ, หนู?", type:"logic"},
    {q:"เติมคำให้สมบูรณ์: A___C", type:"verbal"}
];

let currentQuestion = 0;
let answers = [];

function startTest() {
    document.getElementById('profile').style.display = 'none';
    document.getElementById('test').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    if(currentQuestion < questions.length){
        document.getElementById('question').innerText = questions[currentQuestion].q;
    } else {
        calculateIQ();
    }
}

function submitAnswer() {
    let answer = document.getElementById('answer').value;
    if(answer === "") return alert("กรุณาตอบคำถาม");
    answers.push(answer);
    document.getElementById('answer').value = "";
    currentQuestion++;
    showQuestion();
}

// ฟังก์ชันคำนวณ IQ แบบง่ายๆ (ตัวอย่าง)
function calculateIQ() {
    document.getElementById('test').style.display = 'none';
    let iq = 100 + Math.floor(Math.random() * 50) - 25; // แค่ตัวอย่าง random IQ
    document.getElementById('result').style.display = 'block';
    document.getElementById('result').innerHTML = `
        <h2>ผลการทดสอบ IQ</h2>
        <p>ผู้ใช้: ${document.getElementById('name').value}</p>
        <p>IQ ประมาณ: ${iq}</p>
        <p>คำตอบของคุณ: ${answers.join(", ")}</p>
    `;
}
