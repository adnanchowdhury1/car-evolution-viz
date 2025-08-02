function showScene0(data) {
    // 1) Ensure a single tooltip div exists
    if (d3.select(".tooltip").empty()) {
        d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("background", "rgba(0,0,0,0.7)")
            .style("color", "white")
            .style("padding", "6px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("opacity", 0);
    }
    const tooltip = d3.select(".tooltip");

    // 2) Drawing function that takes a year cutoff
    function drawScene0(yearCutoff) {
        d3.select("#viz-container").html("");

        // Filter to valid rows
        const filtered = data.filter(d =>
            d.year >= 1990 &&
            d.year <= yearCutoff &&
            d.mpg > 0 &&
            d.displ > 0
        );

        // Create SVG
        const svg = d3.select("#viz-container")
            .append("svg")
            .attr("width", 800)
            .attr("height", 550);

        const margin = { top: 50, right: 40, bottom: 100, left: 70 },
            width = 800 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const chart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3.scaleLinear()
            .domain(d3.extent(filtered, d => d.displ)).nice()
            .range([0, width]);
        const y = d3.scaleLinear()
            .domain(d3.extent(filtered, d => d.mpg)).nice()
            .range([height, 0]);

        // Axes
        chart.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));
        chart.append("g")
            .call(d3.axisLeft(y));

        // Title & Axis Labels
        svg.append("text")
            .attr("x", margin.left + width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .text(`MPG vs Engine Displacement (1990–${yearCutoff})`);

        svg.append("text")
            .attr("x", margin.left + width / 2)
            .attr("y", height + margin.top + 60)
            .attr("text-anchor", "middle")
            .text("Engine Displacement (L)");

        svg.append("text")
            .attr("transform", `translate(20,${margin.top + height / 2}) rotate(-90)`)
            .attr("text-anchor", "middle")
            .text("MPG");

        // Color Legend (purple→green = 1990→2020)
        const legendW = 300, legendH = 10;
        const legend = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top + height + 20})`);

        const defs = legend.append("defs");
        const grad = defs.append("linearGradient").attr("id", "grad");

        grad.selectAll("stop")
            .data(d3.range(0, 1.01, 0.01))
            .enter().append("stop")
            .attr("offset", d => d)
            .attr("stop-color", d => d3.interpolateCool(d));

        legend.append("rect")
            .attr("width", legendW)
            .attr("height", legendH)
            .style("fill", "url(#grad)");

        const legendScale = d3.scaleLinear()
            .domain([1990, 2020])
            .range([0, legendW]);

        legend.append("g")
            .attr("transform", `translate(0,${legendH})`)
            .call(d3.axisBottom(legendScale).tickFormat(d3.format("d")).ticks(5));

        // Draw points with tooltip
        chart.selectAll("circle")
            .data(filtered)
            .enter().append("circle")
            .attr("cx", d => x(d.displ))
            .attr("cy", d => y(d.mpg))
            .attr("r", 4)
            .attr("fill", d => d3.interpolateCool((d.year - 1990) / 30))
            .attr("opacity", 0.7)
            .on("mouseover", (event, d) => {
                tooltip.html(`
                 <strong>${d.make} ${d.model}</strong><br/>
                 Year: ${d.year}<br/>
                 MPG: ${d.mpg}<br/>
                 Displacement: ${d.displ} L
               `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .transition().duration(100).style("opacity", 1);
            })
            .on("mouseout", () => {
                tooltip.transition().duration(100).style("opacity", 0);
            });
        d3.select("#viz-container")
            .append("div")
            .attr("class", "caption")
            .style("margin", "10px 0")
            .html(`
            Cars have changed significantly between 1990 and 2020. Their engines have gotten smaller and more fuel efficient. Smaller engines (left) consistently achieve higher MPG, 
            and you can see that newer models (green) cluster toward better efficiency overall.
        `);
    }

    // 3) Initial draw & slider hookup
    const initialYear = +d3.select("#year-slider").property("value");
    d3.select("#year-value").text(initialYear);
    drawScene0(initialYear);

    d3.select("#year-slider").on("input", function () {
        const year = +this.value;
        d3.select("#year-value").text(year);
        drawScene0(year);
    });
}
