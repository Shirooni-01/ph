// ==================================================
// ================= ENGINE SETUP =================
// ==================================================

const modelArea = document.getElementById("model_area");
const controlsArea = document.getElementById("controls_area");

// Get dimensions from the container instead of hardcoding
let width = modelArea.clientWidth;
let height = modelArea.clientHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0c); // Slightly darker for "Physic Hell"

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(8, 8, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio); // Fixes blurriness on mobile
renderer.setSize(width, height);
modelArea.appendChild(renderer.domElement);

// ================= MOBILE & ZOOM SETUP =================
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;      // Adds smooth weight to rotation
controls.dampingFactor = 0.05;
controls.enableZoom = true;         // Enables pinch-to-zoom
controls.zoomSpeed = 1.5;           // Faster response for mobile fingers
controls.minDistance = 2;           // Prevents zooming inside models
controls.maxDistance = 60;          // Prevents getting lost in space

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(40, 40, 0x333333, 0x222222);
scene.add(gridHelper);

let activeAnimation = null;

function animate() {
    requestAnimationFrame(animate);
    if (activeAnimation) activeAnimation();
    controls.update(); // Required for damping to work
    renderer.render(scene, camera);
}
animate();

// ================= UTILITIES =================

// Call this function whenever you switch models to fix the "Black Screen" issue
function fixSize() {
    const w = modelArea.clientWidth;
    const h = modelArea.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}

function clearScene() {
    // Keep lights and grid, remove physics objects
    scene.children = scene.children.filter(obj =>
        obj === light ||
        obj === ambientLight ||
        obj === gridHelper
    );
    activeAnimation = null;
}

// Ensure the graph stays responsive if the phone rotates
window.addEventListener('resize', fixSize);
