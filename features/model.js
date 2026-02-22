//==================================================
// ================= ENGINE SETUP =================
//==================================================

const modelArea = document.getElementById("model_area");
const controlsArea = document.getElementById("controls_area");
const modelSelect = document.getElementById("model_select");

const width = 260;
const height = 350;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(6, 6, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
modelArea.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(40, 40);
scene.add(gridHelper);

let activeAnimation = null;

function animate() {
    requestAnimationFrame(animate);
    if (activeAnimation) activeAnimation();
    controls.update();
    renderer.render(scene, camera);
}
animate();


// ================= CLEAR SCENE =================

function clearScene() {

    scene.children = scene.children.filter(obj =>
        obj === light ||
        obj === ambientLight ||
        obj === gridHelper
    );

    // controlsArea.innerHTML = "";
    activeAnimation = null;
}


// ================= MODEL 1: COORDINATE SYSTEM =================

function buildCoordinateSystem() {
    clearScene();
    const axes = new THREE.AxesHelper(5);
    scene.add(axes);
}


// ================= MODEL 2: VECTOR ADDITION =================

function buildVectorAddition() {

    clearScene();

    controlsArea.innerHTML = `
        <p>Vector A (x,y,z)</p>
        <input type="number" id="ax" value="3">
        <input type="number" id="ay" value="2">
        <input type="number" id="az" value="1">

        <p>Vector B (x,y,z)</p>
        <input type="number" id="bx" value="1">
        <input type="number" id="by" value="2">
        <input type="number" id="bz" value="3">

        <p>Operation</p>
        <select id="operation">
            <option value="add">Addition (A + B)</option>
            <option value="subtract">Subtraction (A - B)</option>
            <option value="dot">Dot Product (A · B)</option>
            <option value="cross">Cross Product (A × B)</option>
        </select>

        <button id="update_vector">Calculate</button>

        
        <p id="results"></p>
    `;

    function drawVectors() {

        clearScene();
        scene.add(new THREE.AxesHelper(5));

        const ax = parseFloat(document.getElementById("ax").value);
        const ay = parseFloat(document.getElementById("ay").value);
        const az = parseFloat(document.getElementById("az").value);

        const bx = parseFloat(document.getElementById("bx").value);
        const by = parseFloat(document.getElementById("by").value);
        const bz = parseFloat(document.getElementById("bz").value);

        const operation = document.getElementById("operation").value;

        const origin = new THREE.Vector3(0, 0, 0);
        const v1 = new THREE.Vector3(ax, ay, az);
        const v2 = new THREE.Vector3(bx, by, bz);

        function addArrow(vec, color) {
            if (vec.length() === 0) return;
            const arrow = new THREE.ArrowHelper(
                vec.clone().normalize(),
                origin,
                vec.length(),
                color
            );
            scene.add(arrow);
        }

        // Always draw original vectors
        addArrow(v1, 0xff0000);
        addArrow(v2, 0x0000ff);

        let resultText = "";

        if (operation === "add") {

            const result = v1.clone().add(v2);
            addArrow(result, 0x00ff00);

            resultText = `A + B = (${result.x.toFixed(2)}, ${result.y.toFixed(2)}, ${result.z.toFixed(2)})`;

        }

        else if (operation === "subtract") {

            const result = v1.clone().sub(v2);
            addArrow(result, 0x00ff00);

            resultText = `A - B = (${result.x.toFixed(2)}, ${result.y.toFixed(2)}, ${result.z.toFixed(2)})`;

        }

        else if (operation === "dot") {

            const dot = v1.dot(v2);

            resultText = `A · B = ${dot.toFixed(2)}`;

        }

        else if (operation === "cross") {

            const cross = v1.clone().cross(v2);
            addArrow(cross, 0xffff00);

            resultText = `A × B = (${cross.x.toFixed(2)}, ${cross.y.toFixed(2)}, ${cross.z.toFixed(2)})`;

        }

        document.getElementById("results").innerHTML = `<b>${resultText}</b>`;
    }

    document.getElementById("update_vector")
        .addEventListener("click", drawVectors);

    drawVectors();
}


// ================= MODEL 3: PROJECTILE =================

function buildProjectileMotion() {

    clearScene();

    // ================= UI =================
    controlsArea.innerHTML = `
        <p>Velocity (m/s)</p>
        <input type="number" id="velocity" value="20">

        <p>Angle (degrees)</p>
        <input type="number" id="angle" value="45">

        <p>Gravity g (m/s²)</p>
        <input type="number" id="gravity" value="9.8">

        <button id="launch">Launch</button>
    `;

    // ================= Ball =================
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xffff00 })
    );

    scene.add(ball);

    const scale = 0.1; // visualization scaling
    let time = 0;

    function launch() {

        const velocity = parseFloat(document.getElementById("velocity").value);
        const angle = parseFloat(document.getElementById("angle").value) * Math.PI / 180;
        const g = parseFloat(document.getElementById("gravity").value);

        time = 0;
        ball.position.set(0, 0, 0);

        activeAnimation = function () {

            time += 0.05;

            const x = velocity * Math.cos(angle) * time;
            const y = velocity * Math.sin(angle) * time - 0.5 * g * time * time;

            if (y < 0) {
                activeAnimation = null;
                return;
            }

            ball.position.set(
                x * scale,
                y * scale,
                0
            );
        };
    }

    document.getElementById("launch")
        .addEventListener("click", launch);

    launch();
}

// ================= MODEL 4: SHM =================

function buildSHM() {

    clearScene();

    const mass = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.6, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x00ffff })
    );

    scene.add(mass);

    let t = 0;
    activeAnimation = function () {
        t += 0.05;
        mass.position.x = 3 * Math.cos(2 * t);
    };
}


// ================= MODEL 5: CIRCULAR MOTION =================

function buildCircularMotion() {

    clearScene();

    const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xff00ff })
    );

    scene.add(particle);

    let angle = 0;
    const radius = 4;

    activeAnimation = function () {
        angle += 0.02;
        particle.position.x = radius * Math.cos(angle);
        particle.position.z = radius * Math.sin(angle);
    };
}


// ================= REGISTRY =================

const models = [
    { id: "coords", name: "3D Coordinate System", build: buildCoordinateSystem },
    { id: "vector", name: "Vector Addition", build: buildVectorAddition },
    { id: "projectile", name: "Projectile Motion", build: buildProjectileMotion },
    { id: "shm", name: "Simple Harmonic Motion", build: buildSHM },
    { id: "circular", name: "Circular Motion", build: buildCircularMotion },
    { id: "efield", name: "Electric Field (Single Charge)", build: buildElectricFieldSingle },
    { id: "magnetic", name: "Magnetic Field Around Wire", build: buildMagneticFieldWire },
    { id: "emwave", name: "Electromagnetic Wave", build: buildEMWave },
    { id: "eminduction", name: "Electromagnetic Induction", build: buildElectromagneticInduction },
    { id: "lattice", name: "Crystal Lattice (HCP)", build: buildCrystalLattice }
];


models[0].build();

// ================= MODEL 6: ELECTRIC FIELD (SINGLE CHARGE) =================
function buildElectricFieldSingle() {

    clearScene();

    // Charge particle
    const charge = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    scene.add(charge);

    const fieldGroup = new THREE.Group();

    const lines = 24;
    const radius = 5;

    for (let i = 0; i < lines; i++) {

        const angle = (i / lines) * Math.PI * 2;

        const direction = new THREE.Vector3(
            Math.cos(angle),
            Math.sin(angle),
            0
        );

        const arrow = new THREE.ArrowHelper(
            direction,
            new THREE.Vector3(0, 0, 0),
            radius,
            0x00ff00
        );

        fieldGroup.add(arrow);
    }

    scene.add(fieldGroup);
}

// ================= MODEL 7: MAGNETIC FIELD AROUND WIRE =================

function buildMagneticFieldWire() {

    clearScene();

    const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    );

    scene.add(wire);

    const circles = 6;

    for (let i = 1; i <= circles; i++) {

        const radius = i;

        const geometry = new THREE.TorusGeometry(radius, 0.03, 8, 50);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        const torus = new THREE.Mesh(geometry, material);

        torus.rotation.x = Math.PI / 2;

        scene.add(torus);
    }
}

// ================= MODEL 8: ELECTROMAGNETIC WAVE =================
function buildEMWave() {

    clearScene();

    const length = 20;
    const step = 0.5;

    const ePoints = [];
    const bPoints = [];

    for (let x = -10; x <= 10; x += step) {

        ePoints.push(new THREE.Vector3(x, Math.sin(x), 0));
        bPoints.push(new THREE.Vector3(x, 0, Math.sin(x)));
    }

    const eGeometry = new THREE.BufferGeometry().setFromPoints(ePoints);
    const bGeometry = new THREE.BufferGeometry().setFromPoints(bPoints);

    const eLine = new THREE.Line(
        eGeometry,
        new THREE.LineBasicMaterial({ color: 0xff0000 })
    );

    const bLine = new THREE.Line(
        bGeometry,
        new THREE.LineBasicMaterial({ color: 0x0000ff })
    );

    scene.add(eLine);
    scene.add(bLine);

    let phase = 0;

    activeAnimation = function () {

        phase += 0.1;

        const newEPoints = [];
        const newBPoints = [];

        for (let x = -10; x <= 10; x += step) {

            newEPoints.push(new THREE.Vector3(
                x,
                Math.sin(x - phase),
                0
            ));

            newBPoints.push(new THREE.Vector3(
                x,
                0,
                Math.sin(x - phase)
            ));
        }

        eLine.geometry.setFromPoints(newEPoints);
        bLine.geometry.setFromPoints(newBPoints);
    };
}
// ================= MODEL 9: ELECTROMAGNETIC INDUCTION =================
function buildElectromagneticInduction() {

    clearScene();

    const group = new THREE.Group();
    scene.add(group);

    // Magnetic field lines
    for (let i = -5; i <= 5; i++) {

        const points = [
            new THREE.Vector3(i, -5, 0),
            new THREE.Vector3(i, 5, 0)
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color: 0x00ffff })
        );

        group.add(line);
    }

    // Rotating coil
    const coil = new THREE.Mesh(
        new THREE.TorusGeometry(2, 0.15, 16, 100),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );

    coil.rotation.x = Math.PI / 2;
    group.add(coil);

    activeAnimation = function () {
        coil.rotation.z += 0.03;
    };
}
// ================= MODEL 10: CRYSTAL LATTICE (HCP) =================
function buildCrystalLattice() {

    clearScene();

    const spacing = 1.2;

    for (let x = -3; x <= 3; x++) {
        for (let y = -3; y <= 3; y++) {

            const offset = (y % 2 === 0) ? 0 : spacing / 2;

            const atom = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0x00ffff })
            );

            atom.position.set(
                x * spacing + offset,
                y * spacing * 0.9,
                0
            );

            scene.add(atom);
        }
    }
}

// ================= UI SETUP =================
// ================= UI SETUP =================

const modelList = document.getElementById("model_list");
const dOptions = document.getElementById("d_options");
const backBtnM = document.getElementById("back_btn_model");

// Hide model display sections initially
controlsArea.style.display = "none";
modelArea.style.display = "none";
dOptions.style.display = "none";

models.forEach(model => {

    const li = document.createElement("li");
    li.id = "topic_li";
    li.textContent = model.name;

    li.style.cursor = "pointer";
    li.style.padding = "10px";
    li.style.height = "25px";
    li.style.width = "100%";
    li.style.borderBottom = "1px solid #ccc";

    li.addEventListener("click", () => {

        // Hide model list
        modelList.style.display = "none";

        // Show 3D + controls
        controlsArea.style.display = "flex";
        modelArea.style.display = "block";
        dOptions.style.display = "block";
        backBtnM.style.display = "inline-block";

        // Clear UI safely
        controlsArea.innerHTML = "";

        // Build selected model
        model.build();
    });

    modelList.appendChild(li);
});

//Back button logic
backBtnM.addEventListener("click", () => {

    if (modelList.style.display === "none") {

        // Currently inside model view → go back to list
        modelList.style.display = "flex";
        controlsArea.style.display = "none";
        modelArea.style.display = "none";
        dOptions.style.display = "none";

        clearScene();

    } else {

        // Already on list → go to home
        window.location.href = "../index.html";
    }
});