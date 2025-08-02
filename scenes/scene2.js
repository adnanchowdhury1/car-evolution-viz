function showScene2(data) {
    // 1) Hide the year‐slider controls (only needed for Scene 0)
    d3.select("#controls").style("display", "none");

    d3.select("#viz-container").html("");

    // 3) Filter the two years
    const data90 = data.filter(d => d.year === 1990 && d.displ > 0);
    const data20 = data.filter(d => d.year === 2020 && d.displ > 0);

    // 4) Set up SVG dimensions
    const margin = { top: 60, right: 40, bottom: 80, left: 70 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#viz-container")
        .append("svg")
        .attr("width", 800)
        .attr("height", 550);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 5) X scale (combine both years for domain)
    const allDisp = data90.map(d => d.displ).concat(data20.map(d => d.displ));
    const x = d3.scaleLinear()
        .domain(d3.extent(allDisp)).nice()
        .range([0, width]);

    // 6) Compute bins
    const binGen = d3.bin()
        .domain(x.domain())
        .thresholds(x.ticks(20));
    const bins90 = binGen(data90.map(d => d.displ));
    const bins20 = binGen(data20.map(d => d.displ));

    // 7) Y scale (max count of the two)
    const maxCount = d3.max([d3.max(bins90, b => b.length),
    d3.max(bins20, b => b.length)]);
    const y = d3.scaleLinear()
        .domain([0, maxCount]).nice()
        .range([height, 0]);

    // 8) Draw axes
    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    chart.append("g")
        .call(d3.axisLeft(y));

    // 9) Draw 1990 histogram (blue, semi-transparent)
    chart.selectAll("rect.year90")
        .data(bins90)
        .enter().append("rect")
        .attr("class", "year90")
        .attr("x", d => x(d.x0) + 1)
        .attr("y", d => y(d.length))
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("height", d => height - y(d.length))
        .attr("fill", "steelblue")
        .attr("opacity", 0.5);

    // 10) Draw 2020 histogram (orange)
    chart.selectAll("rect.year20")
        .data(bins20)
        .enter().append("rect")
        .attr("class", "year20")
        .attr("x", d => x(d.x0) + 1)
        .attr("y", d => y(d.length))
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("height", d => height - y(d.length))
        .attr("fill", "orange")
        .attr("opacity", 0.5);

    // 11) Title & axis labels
    svg.append("text")
        .attr("x", margin.left + width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text("Engine Displacement Distribution: 1990 (blue) vs 2020 (orange)");

    svg.append("text")
        .attr("x", margin.left + width / 2)
        .attr("y", height + margin.top + 60)
        .attr("text-anchor", "middle")
        .text("Engine Displacement (L)");

    svg.append("text")
        .attr("transform", `translate(20,${margin.top + height / 2}) rotate(-90)`)
        .attr("text-anchor", "middle")
        .text("Number of Models");

    // 12) Caption
    d3.select("#viz-container")
        .append("div")
        .attr("class", "caption")
        .style("margin", "10px 0")
        .html(`
        In 1990 (blue), the average engine displacement clustered around 3.0–4.0 L; 
        by 2020 (orange), that peak shifted down toward 2.0–3.0 L, 
        reflecting a move to smaller, more efficient powertrains.
      `);
}
