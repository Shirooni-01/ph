function updateGraph() {
    const exprString = document.getElementById('equation').value;
    const steps = 30; 
    const range = 10;
    
    let xData = [], yData = [], zData = [];

    for (let i = -range; i <= range; i += (2 * range / steps)) {
        xData.push(i);
        yData.push(i);
    }

    try {
        const compiledExpr = math.compile(exprString);

        for (let i = 0; i < yData.length; i++) {
            let zRow = [];
            for (let j = 0; j < xData.length; j++) {
                let val = compiledExpr.evaluate({ x: xData[j], y: yData[i] });
                zRow.push(val);
            }
            zData.push(zRow);
        }

        const data = [{
            z: zData, x: xData, y: yData,
            type: 'surface',
            colorscale: 'Viridis',
            showscale: false
        }];

        const layout = {
            autosize: true,
            scene: {
                xaxis: { color: '#888' },
                yaxis: { color: '#888' },
                zaxis: { color: '#888' },
                backgroundColor: '#121212'
            },
            margin: { l: 0, r: 0, b: 0, t: 0 },
            paper_bgcolor: '#121212',
            font: { color: '#ffffff' }
        };

        Plotly.newPlot('graph-world', data, layout, { responsive: true, displayModeBar: false });

    } catch (err) {package
        alert("Equation Error: " + err.message);
    }
}

updateGraph();

window.onresize = function() {
    Plotly.Plots.resize('graph-world');
};