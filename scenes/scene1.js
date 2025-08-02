function showScene1(data) {
    // 1. Filter to years and valid MPG
    const filtered = data.filter(d =>
        d.year >= 1990 &&
        d.year <= 2020 &&
        d.mpg > 0
    );

    // 2. Roll up: compute average MPG per year
    const avgByYear = Array.from(
        d3.rollup(
            filtered,
            v => d3.mean(v, d => d.mpg),
            d => d.year
        ),
        ([year, mpg]) => ({ year, mpg })
    ).sort((a, b) => a.year - b.year);

    // 3. Set up SVG
    const svg = d3.select("#viz-container")
        .append("svg")
        .attr("width", 800)
        .attr("height", 500);

    const margin = { top: 50, right: 40, bottom: 60, left: 70 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 4. Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(avgByYear, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain(d3.extent(avgByYear, d => d.mpg))
        .nice()
        .range([height, 0]);

    // 5. Axes
    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    chart.append("g")
        .call(d3.axisLeft(y));

    // 6. Line generator
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.mpg));

    // 7. Draw line
    chart.append("path")
        .datum(avgByYear)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // 8. Title & Labels
    svg.append("text")
        .attr("x", margin.left + width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text("Average Combined MPG by Year (1990–2020)");

    svg.append("text")
        .attr("x", margin.left + width / 2)
        .attr("y", height + margin.top + 50)
        .attr("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", `translate(20,${margin.top + height / 2}) rotate(-90)`)
        .attr("text-anchor", "middle")
        .text("MPG");

    d3.select("#viz-container")
        .append("div")
        .attr("class", "caption")
        .style("margin", "10px 0")
        .html(`
          After a dip in the late ’90s, average MPG climbs steadily—especially after 2010—reflecting tightening fuel‐economy regulations.
        `);
}
