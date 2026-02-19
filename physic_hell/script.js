const MenuBtn = document.getElementById('menu_btn');
const menu = document.getElementById('menu');

if (MenuBtn) {
    MenuBtn.addEventListener('click', () => {
        menu.classList.toggle('show');
    });
}

// Home page cards
const GraphCard = document.getElementById('graphcard');
if (GraphCard) {
    GraphCard.addEventListener('click', () => {
        window.location.href = 'features/graph.html';
    });
}

const ModelCard = document.getElementById('d3card');
if (ModelCard) {
    ModelCard.addEventListener('click', () => {
        window.location.href = 'features/d3model.html';
    });
}

const lectureCard = document.getElementById('lecturecard');
if (lectureCard) {
    lectureCard.addEventListener('click', () => {
        window.location.href = 'features/lectures.html';
    });
}

const quizCard = document.getElementById('quizcard');
if (quizCard) {
    quizCard.addEventListener('click', () => {
        window.location.href = 'features/quiz.html';
    });
}

// Back button
const backBtn = document.getElementById('back_btn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
}


// ================================
// GRAPH ENGINE
// ================================

const canvas = document.getElementById("graph_canvas");

if (canvas) {
    const ctx = canvas.getContext("2d");
    const inputField = document.getElementById("input_field");
    const graphBtn = document.getElementById("graph_btn");

    const width = canvas.width;
    const height = canvas.height;

    function drawAxes() {
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;

        // X axis
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Y axis
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
    }

    function plotFunction(func) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = -10; x <= 10; x += 0.1) {
            let y = func(x);

            let canvasX = width / 2 + x * 20;
            let canvasY = height / 2 - y * 20;

            if (x === -10) {
                ctx.moveTo(canvasX, canvasY);
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        }

        ctx.stroke();
    }

    function formatEquation(eq) {
        return eq
            .replace(/π/g, "Math.PI")
            .replace(/sin/g, "Math.sin")
            .replace(/cos/g, "Math.cos")
            .replace(/tan/g, "Math.tan")
            .replace(/sqrt/g, "Math.sqrt")
            .replace(/log/g, "Math.log")
            .replace(/abs/g, "Math.abs")
            .replace(/\^/g, "**")
            .replace(/(\d)(x)/g, "$1*$2");  // 2x → 2*x
    }


    graphBtn.addEventListener("click", () => {
        let equation = inputField.value;

        try {
            equation = formatEquation(equation);
            const func = new Function("x", "return " + equation);

            drawAxes();
            plotFunction(func);

        } catch (error) {
            alert("Invalid equation");
        }
    });


    drawAxes();
}

