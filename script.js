let currentScene = 0;

d3.csv("data/vehicles.csv").then(rawData => {
    // 1) Log available columns
    console.log("Columns in your CSV:", Object.keys(rawData[0]));

    // 2) Preprocess
    const data = rawData.map(d => ({
        ...d,
        year: +d.year,
        mpg: +d.comb08,   // combined EPA MPG
        displ: +d.displ     // engine displacement (L)
    }));

    // 3) Log ranges
    console.log("MPG range:", d3.extent(data, d => d.mpg));
    console.log("Displ range:", d3.extent(data, d => d.displ));

    // 4) Show first scene
    showScene0(data);

    // 5) Navigation handlers
    d3.select("#next").on("click", () => {
        const maxScenes = 2;
        currentScene = Math.min(currentScene + 1, maxScenes);
        updateScene(data);
    });
    d3.select("#prev").on("click", () => {
        currentScene = Math.max(currentScene - 1, 0);
        updateScene(data);
    });
});

function updateScene(data) {
    d3.select("#viz-container").html("");
    if (currentScene === 0) showScene0(data);
    else if (currentScene === 1) showScene1(data);
    else if (currentScene === 2) showScene2(data);
}
