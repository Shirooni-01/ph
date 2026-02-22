// ==================================================
// ================= ENGINE SETUP =================
// ==================================================

// FIX: Changed ID from "model_area" to "graph-world"
const modelArea = document.getElementById("graph-world");

function updateGraph() {
    const exprString = document.getElementById('equation').value;
    const steps = 30; // Resolution
    const range = 10;
    
    let xData = [];
    let yData = [];
    let zData = [];

    // Create the range of X and Y values
    for (let i = -range; i <= range; i += (2 * range / steps)) {
        xData.push(i);
        yData.push(i);
    }

    try {
        const compiledExpr = math.compile(exprString);

        // Calculate Z for every (X, Y) pair
        for (let i = 0; i < yData.length; i++) {
            let zRow = [];
            for (let j = 0; j < xData.length; j++) {
                let val = compiledExpr.evaluate({ x: xData[j], y: yData[i] });
                zRow.push(val);
            }
            zData.push(zRow);
        }

        const data = [{
            z: zData,
            x: xData,
            y: yData,
            type: 'surface',
            colorscale: 'Viridis',
            showscale: false
        }];

        const layout = {
            autosize: true,
            scene: {
                xaxis: { title: 'X', color: '#fff' },
                yaxis: { title: 'Y', color: '#fff' },
                zaxis: { title: 'Z', color: '#fff' },
                backgroundColor: '#121212'
            },
            margin: { l: 0, r: 0, b: 0, t: 0 },
            paper_bgcolor: '#121212',
            font: { color: '#ffffff' }
        };

        const config = {
            responsive: true,
            displayModeBar: false 
        };

        // Use Plotly to render into the graph-world div
        Plotly.newPlot('graph-world', data, layout, config);

    } catch (err) {
        alert("Math Error: " + err.message);
    }
}

// Initial plot on load
if (modelArea) {
    updateGraph();
}

// Handle window resize
window.onresize = function() {
    if (document.getElementById('graph-world')) {
        Plotly.Plots.resize('graph-world');
    }
};
