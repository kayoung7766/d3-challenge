var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
  // console.log(d3.csv("assets/data/data.csv"));
  console.log(d3.csv("assets/data/data.csv"));
d3.csv("assets/data/data.csv").then(function(healthData) {
     // Step 1: Parse Data/Cast as numbers
    // ==============================
   healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
      });
  
      // Step 2: Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty)*.9, d3.max(healthData, d => d.poverty)*1.1])
        .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.healthcare)*.9, d3.max(healthData, d => d.healthcare)*1.1])
        .range([height, 0]);
  
      // Step 3: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // Step 4: Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);
  
      // Step 5: Create Circles
    // ==============================


    var circlesGroupAll = chartGroup
      .selectAll("circlesGroup")
      .data(healthData)
      .enter()

    var circlesGroup = circlesGroupAll
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "9")
    .attr("fill", "pink")
    .attr("opacity", ".5");

    var circlesTextGroup = circlesGroupAll
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare));
  
  
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("In Poverty (%)");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
    }).catch(function(error) {
      console.log(error);
    });
  