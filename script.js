let questions = [
    {q:"2 + 3 * 4 = ?", type:"math"},
    {q:"ตัวไหนไม่เหมือนกัน: แมว, สุนัข, รถ, หนู?", type:"logic"},
    {q:"เติมคำให้สมบูรณ์: A___C", type:"verbal"}
];

let currentQuestion = 0;
let answers = [];
let profile = {};

const ageSlider = document.getElementById("age");
const heightSlider = document.getElementById("height");
const weightSlider = document.getElementById("weight");

ageSlider.oninput = () => document.getElementById("ageVal").innerText = ageSlider.value;
heightSlider.oninput = () => document.getElementById("heightVal").innerText = heightSlider.value;
weightSlider.oninput = () => document.getElementById("weightVal").innerText = weightSlider.value;

function startTest(){
    profile = {
        name: "Swiss Russameekiattisak",
        age: ageSlider.value,
        height: heightSlider.value,
        weight: weightSlider.value,
        gender: document.getElementById("gender").value
    };
    document.getElementById("profile").style.display = "none";
    document.getElementById("test").style.display = "block";
    showQuestion();
}

function showQuestion(){
    if(currentQuestion < questions.length){
        document.getElementById("question").innerText = questions[currentQuestion].q;
    } else {
        calculateIQ();
    }
}

function submitAnswer(){
    let answer = document.getElementById("answer").value;
    if(answer === "") return alert("กรุณาตอบคำถาม");
    answers.push(answer);
    document.getElementById("answer").value = "";
    currentQuestion++;
    showQuestion();
}

// ตัวอย่างการคำนวณ IQ แบบ random ก่อนเชื่อม AI
function calculateIQ(){
    document.getElementById("test").style.display = "none";
    document.getElementById("result").style.display = "block";
    
    // จำลองค่า IQ และ skill 6 ด้าน
    let data = {
        iq: 120,
        logic: Math.floor(Math.random()*100),
        math: Math.floor(Math.random()*100),
        verbal: Math.floor(Math.random()*100),
        spatial: Math.floor(Math.random()*100),
        memory: Math.floor(Math.random()*100),
        creativity: Math.floor(Math.random()*100)
    };
    
    // สร้าง radar chart
    const ctx = document.getElementById('iqChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["Logic","Math","Verbal","Spatial","Memory","Creativity"],
            datasets: [{
                label: `IQ: ${data.iq}`,
                data: [data.logic,data.math,data.verbal,data.spatial,data.memory,data.creativity],
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255,99,132,1)'
            }]
        },
        options: {
            scales: {
                r: { min: 0, max: 100 }
            }
        }
    });
}
